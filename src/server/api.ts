import { randomUUID, timingSafeEqual } from 'node:crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import { requireAdmin } from './auth';
import { config } from './config';
import { db } from './db';
import {
  CARD_KINDS,
  CARD_LANGS,
  CARD_THEMES,
  type BusinessCardData,
  type CardKind,
  type CardLang,
  type CardTheme,
  cardData,
  cardNotice,
  cardSlug,
  leadFields,
  leadRedirect,
  renderCard,
  vcard,
} from './cards';
import { h, sqlOr503, str, UUID } from './http';
import { ALLOWED_TYPES, uploadImage } from './storage';
import { invoices } from './invoices';
import { type OrderMailItem, leadNotification, mailer, orderConfirmation } from './mail';
import {
  CANCELLED_EVENTS,
  PAID_EVENTS,
  WEBHOOK_EVENTS,
  blocksCheckout,
  checkStripe,
  createCheckoutSession,
  verifyWebhook,
  webhookStatus,
} from './stripe';

/* eslint-disable @typescript-eslint/no-explicit-any */

const LANGS = ['de', 'fr', 'en', 'tr', 'ku'];
const TOPICS = ['cards', 'web', 'sh', 'abo', 'other'];
const PLANS = ['basis', 'business', 'premium'];

/** Nur erlaubte Spalten übernehmen; leere Texte werden zu NULL. */
function pick(body: any, cols: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of cols) {
    if (!(c in (body ?? {}))) continue;
    const v = body[c];
    out[c] = typeof v === 'string' ? (v.trim() === '' ? null : v.trim()) : v;
  }
  return out;
}

/** Einfache Bremse gegen Formular-Spam, pro Server-Instanz. */
const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

/** Nur die grobe Gattung, nie die IP — siehe Datenschutzerklärung. */
const deviceOf = (req: Request): 'ios' | 'android' | 'other' => {
  const ua = String(req.headers['user-agent'] ?? '');
  return /iphone|ipad|ipod/i.test(ua) ? 'ios' : /android/i.test(ua) ? 'android' : 'other';
};

const clientIp = (req: Request) =>
  String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '').split(',')[0].trim();

function origin(req: Request): string {
  if (config.siteUrl) return config.siteUrl;
  const proto = String(req.headers['x-forwarded-proto'] ?? req.protocol).split(',')[0];
  return `${proto}://${req.get('host')}`;
}

async function shopEnabled(sql: NonNullable<ReturnType<typeof db>>): Promise<boolean> {
  if (!config.stripeSecretKey) return false;
  const [row] = await sql`select value from settings where key = 'shop_enabled'`;
  return row?.['value'] === true;
}

// ── NFC-Weiterleitung ──────────────────────────────────────
export async function nfcRedirect(req: Request, res: Response) {
  res.set('Cache-Control', 'no-store');
  res.set('Referrer-Policy', 'no-referrer');
  const slug = String(req.params['slug'] ?? '').toLowerCase();
  const sql = db();
  if (!sql || !/^[a-z0-9-]{3,50}$/.test(slug)) return res.redirect(302, '/');

  const device = deviceOf(req);
  try {
    const [row] = await sql`
      with r as (select id, target_url from redirects where slug = ${slug} and active),
           s as (insert into scans (redirect_id, device) select id, ${device} from r)
      select target_url from r`;
    return res.redirect(302, row ? String(row['target_url']) : '/');
  } catch (err) {
    console.error('[r]', err);
    return res.redirect(302, '/');
  }
}

/**
 * Bestellbestätigung an den Kunden, Kopie ans eigene Postfach. Wird nur beim
 * Übergang auf „bezahlt" aufgerufen, also genau einmal je Bestellung.
 *
 * Ein Fehler beim Verschicken darf den Webhook nicht scheitern lassen: Stripe
 * würde das Ereignis sonst endlos erneut zustellen, obwohl die Bestellung
 * längst bezahlt ist. Darum wird er nur protokolliert.
 */
async function confirmOrder(
  sql: NonNullable<ReturnType<typeof db>>,
  order: Record<string, unknown>,
  base: string,
): Promise<void> {
  const to = String(order['customer_email'] ?? '').trim();
  const transport = mailer();
  if (!to || !transport) return;
  try {
    const [row] = await sql`select value from settings where key = 'invoice_profile'`;
    const sender = ((row?.['value'] as Record<string, string>) ?? {}) as Record<string, string>;
    const { subject, text } = orderConfirmation({
      orderId: String(order['id']),
      customerName: (order['customer_name'] as string | null) ?? null,
      items: ((order['items'] as OrderMailItem[]) ?? []).filter((i) => i && i.label),
      amountTotal: Number(order['amount_total']) || 0,
      siteUrl: base,
      sender,
    });
    await transport.sendMail({
      from: { name: sender['company'] || 'Breisgau Digital', address: config.smtpUser },
      to,
      bcc: config.smtpUser,
      subject,
      text,
    });
  } catch (err) {
    console.error('[shop] Bestellbestätigung', err);
  }
}

/**
 * Nach der Bezahlung: für jede bestellte NFC-Karte einen Entwurf anlegen.
 *
 * So entsteht aus einer Bestellung Arbeit im Portal statt einer Notiz im
 * Postfach: die Karte steht da, ist der Bestellung zugeordnet und wartet auf
 * ihren Inhalt. `active = false` — bis wir sie gefüllt und freigegeben haben,
 * zeigt /k/<name> sie nicht.
 *
 * Läuft im Ablauf des Webhooks und darf ihn nicht scheitern lassen: Stripe
 * würde das Ereignis sonst endlos erneut zustellen, obwohl längst bezahlt
 * ist. Darum wird ein Fehler nur protokolliert.
 *
 * Mehrfach kann es nicht laufen: aufgerufen wird es nur beim Übergang auf
 * „bezahlt", und den macht genau eine Abfrage genau einmal.
 */
export async function draftCards(sql: NonNullable<ReturnType<typeof db>>, order: Record<string, unknown>): Promise<number> {
  const items = (order['items'] as { key?: string; qty?: number }[] | null) ?? [];
  const label = str(order['business_name'], 200);
  let made = 0;

  for (const item of items) {
    const kind = CARD_KINDS.find((k) => `card.${k}` === item?.key);
    if (!kind) continue;
    const qty = Math.min(Math.max(Math.floor(Number(item?.qty) || 0), 0), 20);

    for (let n = 0; n < qty; n++) {
      // Der Inhalt läuft durch dieselbe Prüfung wie im Portal, damit im Feld
      // `data` nie etwas steht, das die Karte nicht kennt.
      const draft =
        cardData(kind, kind === 'business' ? { company: label || 'Neue Karte' } : { headline: 'Alles Gute!' }) ?? {};
      // Die Sprache der Bestellung ist geprüft (LANGS im Checkout) — geprüft
      // wird sie hier trotzdem: eine Zeile, die die Spaltenprüfung verletzt,
      // würde eine bezahlte Karte verschlucken.
      const lang = CARD_LANGS.includes(order['lang'] as CardLang) ? (order['lang'] as CardLang) : 'de';

      // Zwei Karten dürfen nicht denselben Kurznamen haben. Bei einem
      // Zusammenstoß hilft ein neuer Anhang, darum ein paar Versuche.
      for (let tries = 0; tries < 5; tries++) {
        const slug = cardSlug(label, randomUUID().slice(0, 6));
        const [row] = await sql`
          insert into cards (slug, kind, theme, lang, data, label, order_id, active)
          values (${slug}, ${kind}, 'brand', ${lang}, ${sql.json(draft as any)},
                  ${label}, ${String(order['id'])}, false)
          on conflict (slug) do nothing
          returning id`;
        if (row) {
          made++;
          break;
        }
      }
    }
  }
  return made;
}

/**
 * Seite einer NFC-Karte: /k/<slug>. Zählt die Okutma in derselben Abfrage,
 * wie /r/<slug> es für die Kurzlinks tut. Unbekannt oder abgeschaltet →
 * zurück auf die Startseite, damit eine alte Karte nie ins Leere zeigt.
 */
export async function cardPage(req: Request, res: Response) {
  res.set('Cache-Control', 'no-store');
  res.set('Referrer-Policy', 'no-referrer');
  res.set('X-Content-Type-Options', 'nosniff');
  const slug = String(req.params['slug'] ?? '').toLowerCase();
  const sql = db();
  if (!sql || !/^[a-z0-9-]{3,50}$/.test(slug)) return res.redirect(302, '/');

  // Rückmeldung des Kontaktbogens: sie steht in der Adresse, weil nach dem
  // Absenden weitergeleitet wird (POST-Redirect-GET).
  const notice = cardNotice(req.query as Record<string, unknown>);

  try {
    const [row] = await sql`
      with c as (select id, slug, kind, theme, lang, data from cards where slug = ${slug} and active),
           s as (insert into scans (card_id, device) select id, ${deviceOf(req)} from c)
      select slug, kind, theme, lang, data from c`;
    if (!row) return res.redirect(302, '/');
    return res.type('html').send(
      renderCard(
        {
          slug: String(row['slug']),
          kind: row['kind'] as CardKind,
          theme: row['theme'] as CardTheme,
          lang: row['lang'] as CardLang,
          data: row['data'] as never,
        },
        origin(req),
        notice,
      ),
    );
  } catch (err) {
    console.error('[k]', err);
    return res.redirect(302, '/');
  }
}

/**
 * Dieselbe Karte als Kontaktdatei: /k/<slug>/kontakt.vcf. Das Handy legt sie
 * direkt in die Kontakte, der Rechner lädt sie herunter.
 *
 * Hier wird nichts gezählt: die Okutma steht längst in der Statistik — der
 * Knopf sitzt auf der Seite, die sie gerade erzeugt hat. Und nur Firmenkarten
 * haben Kontaktdaten; eine Geburtstagskarte gehört in kein Adressbuch.
 */
export async function cardVcard(req: Request, res: Response) {
  res.set('Cache-Control', 'no-store');
  res.set('Referrer-Policy', 'no-referrer');
  res.set('X-Content-Type-Options', 'nosniff');
  const slug = String(req.params['slug'] ?? '').toLowerCase();
  const sql = db();
  if (!sql || !/^[a-z0-9-]{3,50}$/.test(slug)) return res.redirect(302, '/');

  try {
    const [row] = await sql`select data from cards where slug = ${slug} and active and kind = 'business'`;
    if (!row) return res.redirect(302, '/');
    const body = vcard(row['data'] as BusinessCardData);
    // Karte ohne Telefon, Mail, Web und Adresse: zurück auf die Karte.
    if (!body) return res.redirect(302, `/k/${slug}`);
    res.set('Content-Disposition', `attachment; filename="${slug}.vcf"`);
    return res.type('text/vcard; charset=utf-8').send(body);
  } catch (err) {
    console.error('[k.vcf]', err);
    return res.redirect(302, '/');
  }
}

/**
 * Rumpf des Kontaktbogens. Die Karte schickt ein gewöhnliches Formular, kein
 * JSON — darum ein eigener Parser, und ein enges Limit: mehr als ein paar
 * Zeilen Text nimmt der Bogen nicht.
 */
export const leadBody = express.urlencoded({ extended: false, limit: '16kb' });

/**
 * Ein Gast lässt seine Daten auf einer Firmenkarte: POST /k/<slug>/kontakt.
 *
 * Danach wird immer weitergeleitet (303), damit ein Neuladen den Eintrag
 * nicht ein zweites Mal schickt. Was schiefgeht, steht in der Adresse, nicht
 * in einer Fehlerseite — die Karte soll nie kaputt aussehen.
 *
 * Gespeichert wird nur, was im Bogen steht, und die grobe Gerätegattung.
 * Keine IP-Adresse: was nicht gespeichert wird, muss auch nicht geschützt
 * werden.
 */
export async function cardLead(req: Request, res: Response) {
  res.set('Cache-Control', 'no-store');
  res.set('Referrer-Policy', 'no-referrer');
  const slug = String(req.params['slug'] ?? '').toLowerCase();
  const sql = db();
  if (!sql || !/^[a-z0-9-]{3,50}$/.test(slug)) return res.redirect(302, '/');
  const drop = leadRedirect(slug, 'drop');

  // Ein Bot bekommt dieselbe Antwort wie ein Mensch — er soll nicht lernen,
  // woran es lag.
  const lead = leadFields(req.body);
  if (lead === 'trap') return res.redirect(303, drop);
  if (limited('lead:' + clientIp(req), 5, 10 * 60_000)) return res.redirect(303, drop);
  if (lead === 'need') return res.redirect(303, leadRedirect(slug, 'need'));

  try {
    const [card] = await sql`select id, lang, data from cards where slug = ${slug} and active and kind = 'business'`;
    if (!card) return res.redirect(302, '/');
    const data = card['data'] as BusinessCardData | null;
    // Nur Karten, auf denen der Bogen ausdrücklich eingeschaltet ist.
    if (data?.leads !== true) return res.redirect(303, drop);

    await sql`
      insert into card_leads (card_id, name, email, phone, company, message, device)
      values (${String(card['id'])}, ${lead.name}, ${lead.email}, ${lead.phone},
              ${lead.company}, ${lead.message}, ${deviceOf(req)})`;

    // Bei der Gelegenheit ausräumen, was zu alt ist. Das ist der Weg, auf dem
    // die Frist aus der Datenschutzerklärung auch ohne eingerichteten
    // Tageslauf eingehalten wird.
    void purgeLeads(sql)
      .then((n) => n && console.log('[k.kontakt] alte Kontakte gelöscht:', n))
      .catch((err) => console.error('[k.kontakt] Aufräumen', err));

    // Gespeichert ist gespeichert: die Benachrichtigung darf den Gast nicht
    // aufhalten und auch nicht scheitern lassen, was schon in der Datenbank
    // steht. Darum ohne await und mit eigenem Fang.
    void notifyLead(lead, {
      slug,
      title: data.company,
      lang: String(card['lang'] ?? 'de'),
      base: origin(req),
    }).catch((err) => console.error('[k.kontakt] Benachrichtigung', err));

    return res.redirect(303, leadRedirect(slug, 'ok'));
  } catch (err) {
    console.error('[k.kontakt]', err);
    return res.redirect(303, drop);
  }
}

/**
 * Uns melden, dass jemand seine Daten dagelassen hat. `reply-to` ist die
 * Adresse des Gastes: ein Klick auf Antworten geht an ihn, nicht an uns.
 */
async function notifyLead(
  lead: Exclude<ReturnType<typeof leadFields>, 'trap' | 'need'>,
  card: { slug: string; title: string; lang: string; base: string },
): Promise<void> {
  const transport = mailer();
  if (!transport) return;
  const { subject, text } = leadNotification({
    cardTitle: card.title,
    cardSlug: card.slug,
    lang: card.lang,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: lead.message,
    siteUrl: card.base,
  });
  await transport.sendMail({
    from: { name: 'Breisgau Digital', address: config.smtpUser },
    to: config.smtpUser,
    ...(lead.email ? { replyTo: lead.email } : {}),
    subject,
    text,
  });
}

/**
 * Wie lange ein hinterlassener Kontakt höchstens liegen bleibt.
 *
 * Die Zahl steht auch in der Datenschutzerklärung (/datenschutz, Abschnitt zu
 * den NFC-Karten). Wer sie hier ändert, ändert eine Zusage an den Gast — dann
 * muss der Text mit.
 */
export const LEAD_RETENTION_MONTHS = 12;

/**
 * Alte Kontakte löschen. Zwei Wege führen hierher, damit die Zusage auch
 * dann stimmt, wenn einer ausfällt:
 *
 *   * bei jedem neuen Eintrag (kostet eine Anweisung auf einem seltenen Weg),
 *   * einmal am Tag über /api/cron/cleanup, für den Fall, dass gar keine
 *     neuen Kontakte mehr kommen.
 *
 * Gibt zurück, wie viele Zeilen gegangen sind — nie, welche.
 */
/**
 * Darf dieser Aufruf aufräumen?
 *
 * Ohne gesetztes Geheimnis nie — eine offene Löschstrecke im Netz wäre
 * schlimmer als ein ausgefallener Lauf. Verglichen wird in konstanter Zeit:
 * ein zeichenweiser Vergleich verrät über die Laufzeit, wie weit jemand
 * richtig geraten hat.
 */
export function cronAuthorized(header: unknown, secret: string): boolean {
  if (!secret) return false;
  const sent = Buffer.from(typeof header === 'string' ? header : '');
  const want = Buffer.from(`Bearer ${secret}`);
  // timingSafeEqual wirft bei verschiedenen Längen, darum vorher prüfen.
  return sent.length === want.length && timingSafeEqual(sent, want);
}

export async function purgeLeads(sql: NonNullable<ReturnType<typeof db>>): Promise<number> {
  const gone = await sql`
    delete from card_leads
    where created_at < now() - ${`${LEAD_RETENTION_MONTHS} months`}::interval
    returning id`;
  return gone.length;
}

export const api = express.Router();

// Stripe braucht den unveränderten Rohtext für die Signaturprüfung.
api.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json', limit: '1mb' }),
  h(async (req, res) => {
    const secret = config.stripeWebhookSecret;
    const sig = String(req.headers['stripe-signature'] ?? '');
    if (!secret || !Buffer.isBuffer(req.body) || !verifyWebhook(req.body, sig, secret)) {
      // Laut protokollieren: passt das Geheimnis nicht zum Modus des
      // Schlüssels, bleiben bezahlte Bestellungen sonst stumm auf „offen".
      console.error(
        '[stripe] Webhook abgewiesen — Signatur passt nicht zu STRIPE_WEBHOOK_SECRET.',
        secret ? 'Testmodus und Echtbetrieb haben verschiedene Geheimnisse.' : 'STRIPE_WEBHOOK_SECRET fehlt.',
      );
      return res.status(400).json({ error: 'bad_signature' });
    }
    const event = JSON.parse(req.body.toString('utf8'));
    const sql = sqlOr503(res);
    if (!sql) return;
    if (PAID_EVENTS.includes(event.type)) {
      const s = event.data.object;
      const shipping = s.collected_information?.shipping_details ?? s.shipping_details ?? null;
      await sql`
        update orders set
          customer_email = ${s.customer_details?.email ?? null},
          customer_name = ${s.customer_details?.name ?? null},
          phone = ${s.customer_details?.phone ?? null},
          shipping = ${shipping ? sql.json(shipping) : null},
          amount_total = ${(s.amount_total ?? 0) / 100}
        where stripe_session_id = ${s.id}`;

      // Auf „bezahlt" nur beim ersten Mal: Stripe stellt dasselbe Ereignis
      // notfalls mehrfach zu, und die Bestätigung darf nur einmal raus.
      if (s.payment_status === 'paid') {
        const [order] = await sql`
          update orders set status = 'bezahlt', paid_at = now()
          where stripe_session_id = ${s.id} and status = 'offen'
          returning id, items, amount_total, customer_email, customer_name, business_name, lang`;
        if (order) {
          // Erst die Entwürfe, dann die Mail: die Mail verspricht dem Kunden,
          // dass wir seine Karte einrichten — dann soll sie auch schon im
          // Portal liegen.
          try {
            const made = await draftCards(sql, order);
            if (made) console.log('[shop] Kartenentwürfe angelegt:', made);
          } catch (err) {
            console.error('[shop] Kartenentwürfe', err);
          }
          await confirmOrder(sql, order, origin(req));
        }
      }
    }
    if (CANCELLED_EVENTS.includes(event.type)) {
      await sql`update orders set status = 'storniert' where stripe_session_id = ${event.data.object.id} and status = 'offen'`;
    }
    return res.json({ received: true });
  }),
);

// Der Rechnungsversand trägt das PDF im Body: erst anmelden, dann bis 4 MB lesen.
api.post('/admin/invoices/:id/send', requireAdmin, express.json({ limit: '4mb' }));

api.use(express.json({ limit: '32kb' }));

// ── Öffentlich: Anfrage speichern ──────────────────────────
api.post(
  '/enquiry',
  h(async (req, res) => {
    const b = req.body ?? {};
    if (b.website) return res.status(201).json({ ok: true }); // Honeypot: still verwerfen
    if (limited('enq:' + clientIp(req), 5, 10 * 60_000)) return res.status(429).json({ error: 'too_many' });

    const name = str(b.name, 200);
    const reach = str(b.reach, 200);
    if (!name || !reach) return res.status(400).json({ error: 'invalid' });
    const topics = Array.isArray(b.topics) ? b.topics.filter((t: unknown) => TOPICS.includes(String(t))) : [];
    const plan = PLANS.includes(b.plan) ? b.plan : null;
    const billing = ['monthly', 'yearly'].includes(b.billing) ? b.billing : null;
    const lang = LANGS.includes(b.lang) ? b.lang : null;

    const sql = sqlOr503(res);
    if (!sql) return;
    await sql`
      insert into enquiries (name, business, reach, message, topics, plan, billing, lang)
      values (${name}, ${str(b.business, 200)}, ${reach}, ${str(b.message, 5000)}, ${topics}, ${plan}, ${billing}, ${lang})`;
    return res.status(201).json({ ok: true });
  }),
);

// ── Aufräumen (Vercel Cron, einmal am Tag) ─────────────────
/**
 * Löscht Kontakte, die älter sind als die Frist in der
 * Datenschutzerklärung. Vercel ruft die Strecke nach dem Eintrag in
 * vercel.json auf und schickt dabei `Authorization: Bearer $CRON_SECRET`.
 *
 * Ohne gesetztes Geheimnis nimmt die Strecke niemanden an: eine offene
 * Löschstrecke im Netz wäre schlimmer als ein ausgefallener Lauf — und
 * aufgeräumt wird ohnehin auch bei jedem neuen Eintrag.
 */
api.get(
  '/cron/cleanup',
  h(async (req, res) => {
    if (!config.cronSecret) return res.status(503).json({ error: 'not_configured' });
    if (!cronAuthorized(req.headers['authorization'], config.cronSecret)) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const sql = sqlOr503(res);
    if (!sql) return;
    const removed = await purgeLeads(sql);
    console.log('[cron] alte Kontakte gelöscht:', removed);
    return res.json({ removed, retentionMonths: LEAD_RETENTION_MONTHS });
  }),
);

// ── Öffentlich: Shop ───────────────────────────────────────
api.get(
  '/shop',
  h(async (_req, res) => {
    const sql = db();
    if (!sql) return res.json({ enabled: false });
    return res.json({ enabled: await shopEnabled(sql) });
  }),
);

api.post(
  '/checkout',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!(await shopEnabled(sql))) return res.status(503).json({ error: 'shop_disabled' });
    if (limited('co:' + clientIp(req), 10, 10 * 60_000)) return res.status(429).json({ error: 'too_many' });

    /**
     * Ein Testmodus-Webhook und ein Echtbetrieb-Schlüssel (oder umgekehrt)
     * sind eine stille Geldfalle: der Kunde zahlt, Stripe signiert das
     * Ereignis mit einem anderen Geheimnis, die Prüfung schlägt fehl und die
     * Bestellung bleibt für immer „offen". Dann lieber gar nichts annehmen.
     * Ist Stripe nur nicht erreichbar, wird nicht blockiert.
     */
    const base = origin(req);
    const hook = await webhookStatus(`${base}/api/stripe/webhook`);
    if (blocksCheckout(hook)) {
      console.error(
        '[checkout] abgelehnt — kein passender Stripe-Webhook im Modus des Schlüssels:',
        hook.state,
        hook.missingEvents.join(',') || '(kein Endpunkt)',
      );
      return res.status(503).json({ error: 'webhook_missing' });
    }

    const b = req.body ?? {};
    const lang = LANGS.includes(b.lang) ? b.lang : 'de';
    const wanted: { key: string; qty: number }[] = (Array.isArray(b.items) ? b.items : [])
      .map((i: any) => ({ key: String(i?.key ?? ''), qty: Math.floor(Number(i?.qty)) }))
      .filter((i: { key: string; qty: number }) => i.qty >= 1 && i.qty <= 20);
    if (!wanted.length || wanted.length > 10) return res.status(400).json({ error: 'invalid_items' });

    // Preise kommen ausschließlich aus der Datenbank, nie aus dem Browser.
    const rows = await sql`select key, label, value from prices where shop and key in ${sql(wanted.map((w) => w.key))}`;
    const byKey = new Map(rows.map((r) => [String(r['key']), r]));
    if (wanted.some((w) => !byKey.has(w.key))) return res.status(400).json({ error: 'invalid_items' });

    const items = wanted.map((w) => {
      const r = byKey.get(w.key)!;
      return { key: w.key, label: String(r['label']), qty: w.qty, unit_price: Number(r['value']) };
    });
    const [ship] = await sql`select value from prices where key = 'shop.shipping'`;
    const shipping = Number(ship?.['value'] ?? 0);
    const total = items.reduce((s, i) => s + i.qty * i.unit_price, 0) + shipping;

    const [order] = await sql`
      insert into orders (items, amount_total, business_name, google_link, lang)
      values (${sql.json(items)}, ${total}, ${str(b.businessName, 200)}, ${str(b.googleLink, 500)}, ${lang})
      returning id`;
    const orderId = String(order['id']);

    const lines = items.map((i) => ({ name: i.label, unitAmountCents: Math.round(i.unit_price * 100), quantity: i.qty }));
    if (shipping > 0) lines.push({ name: 'Versand', unitAmountCents: Math.round(shipping * 100), quantity: 1 });

    const session = await createCheckoutSession({
      lines,
      orderId,
      successUrl: `${base}/${lang}/bestellen/danke?bestellung=${orderId}`,
      cancelUrl: `${base}/${lang}/bestellen`,
      locale: lang === 'ku' ? 'auto' : lang,
    });
    await sql`update orders set stripe_session_id = ${session.id} where id = ${orderId}`;
    return res.json({ url: session.url });
  }),
);

// ── Admin: Anmeldedaten für das Portal (öffentlich, nur Nicht-Geheimes) ──
/**
 * Verbindung zur Datenbank prüfen und einen verständlichen Grund liefern,
 * ohne Zugangsdaten preiszugeben.
 */
async function checkDb(): Promise<string | null> {
  const sql = db();
  if (!sql) return 'DATABASE_URL fehlt';
  try {
    await Promise.race([
      sql`select 1 from prices limit 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Zeitüberschreitung (10 s)')), 10_000)),
    ]);
    return null;
  } catch (err) {
    const e = err as { code?: string; message?: string };
    const msg = String(e.message ?? err).replace(/postgres(ql)?:\/\/[^\s]+/gi, '[DATABASE_URL]');
    if (e.code === '42P01') return 'Tabellen fehlen — SQL-Datei im Supabase SQL Editor ausführen';
    return (e.code ? e.code + ': ' : '') + msg.slice(0, 300);
  }
}

// ── Admin: Anmeldedaten für das Portal (öffentlich, nur Nicht-Geheimes) ──
api.get(
  '/admin/config',
  h(async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    const dbError = await checkDb();
    res.json({
      supabaseUrl: config.supabaseUrl,
      supabaseAnonKey: config.supabaseAnonKey,
      dbError,
      ready: {
        db: !dbError,
        auth: !!(config.supabaseUrl && config.supabaseAnonKey && config.adminEmails.length),
        stripe: !!(config.stripeSecretKey && config.stripeWebhookSecret),
        deployHook: !!config.deployHookUrl,
        mail: !!(config.smtpHost && config.smtpUser && config.smtpPass),
      },
    });
  }),
);

const admin = express.Router();
api.use('/admin', requireAdmin, admin);
admin.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

admin.get('/me', (_req, res) => {
  res.json({ email: res.locals['adminEmail'] });
});

/**
 * Stripe-Einrichtung prüfen: funktioniert der Schlüssel, läuft das Konto im
 * Test- oder Echtbetrieb, und welche Adresse samt Ereignissen gehört im
 * Stripe-Dashboard an den Webhook. Absichtlich hinter der Anmeldung, damit
 * die Stripe-API nicht von außen angestoßen werden kann.
 */
admin.get(
  '/stripe',
  h(async (req, res) => {
    const webhookUrl = `${origin(req)}/api/stripe/webhook`;
    const [status, hook] = await Promise.all([checkStripe(), webhookStatus(webhookUrl)]);
    res.json({
      ...status,
      webhookUrl,
      webhookEvents: WEBHOOK_EVENTS,
      webhook: hook,
      /** true = der Shop nimmt gerade kein Geld an. */
      checkoutBlocked: blocksCheckout(hook),
    });
  }),
);

admin.get(
  '/stats',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const [s] = await sql`
      select
        (select count(*)::int from enquiries where status = 'neu') as new_enquiries,
        (select count(*)::int from subscriptions where status = 'aktiv') as active_subscriptions,
        (select coalesce(sum(case when billing = 'yearly' then monthly_price * 10 / 12 else monthly_price end), 0)::float
           from subscriptions where status = 'aktiv') as monthly_revenue,
        (select count(*)::int from scans where scanned_at > now() - interval '30 days') as scans_30d,
        (select count(*)::int from orders where status in ('bezahlt', 'in_arbeit')) as open_orders`;
    res.json(s);
  }),
);

// Anfragen
admin.get(
  '/enquiries',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`select * from enquiries order by created_at desc limit 500`);
  }),
);

/** Einfache CRUD-Endpunkte mit fester Spaltenliste je Tabelle. */
function crud(path: string, table: string, cols: string[], opts: { create?: boolean; remove?: boolean } = {}) {
  admin.patch(
    `/${path}/:id`,
    h(async (req, res) => {
      const sql = sqlOr503(res);
      if (!sql) return;
      if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
      const data = pick(req.body, cols);
      if (!Object.keys(data).length) return res.status(400).json({ error: 'nothing_to_update' });
      const [row] = await sql`update ${sql(table)} set ${sql(data as any)} where id = ${req.params['id']} returning *`;
      return row ? res.json(row) : res.status(404).json({ error: 'not_found' });
    }),
  );
  if (opts.create) {
    admin.post(
      `/${path}`,
      h(async (req, res) => {
        const sql = sqlOr503(res);
        if (!sql) return;
        const [row] = await sql`insert into ${sql(table)} ${sql(pick(req.body, cols) as any)} returning *`;
        return res.status(201).json(row);
      }),
    );
  }
  if (opts.remove) {
    admin.delete(
      `/${path}/:id`,
      h(async (req, res) => {
        const sql = sqlOr503(res);
        if (!sql) return;
        if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
        await sql`delete from ${sql(table)} where id = ${req.params['id']}`;
        return res.status(204).end();
      }),
    );
  }
}

crud('enquiries', 'enquiries', ['status', 'notes', 'customer_id'], { remove: true });

/** Aus einer Anfrage einen Kunden anlegen und verknüpfen. */
admin.post(
  '/enquiries/:id/customer',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    const [e] = await sql`select * from enquiries where id = ${req.params['id']}`;
    if (!e) return res.status(404).json({ error: 'not_found' });
    const reach = String(e['reach'] ?? '');
    const isMail = reach.includes('@');
    const [c] = await sql`
      insert into customers (name, business, email, phone, notes)
      values (${e['name']}, ${e['business']}, ${isMail ? reach : null}, ${isMail ? null : reach}, ${e['message']})
      returning *`;
    await sql`update enquiries set customer_id = ${c['id']} where id = ${e['id']}`;
    return res.status(201).json(c);
  }),
);

// Kunden
admin.get(
  '/customers',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`
      select c.*,
        (select count(*)::int from subscriptions s where s.customer_id = c.id and s.status = 'aktiv') as active_subscriptions,
        (select count(*)::int from redirects r where r.customer_id = c.id) as redirects
      from customers c order by c.name`);
  }),
);
crud('customers', 'customers', ['name', 'business', 'email', 'phone', 'street', 'city', 'google_link', 'notes'], {
  create: true,
  remove: true,
});

// Abos
admin.get(
  '/subscriptions',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`
      select s.*, c.name as customer_name, c.business as customer_business,
        (s.start_date + make_interval(months => s.min_term_months))::date as min_term_end
      from subscriptions s join customers c on c.id = s.customer_id
      order by s.status, s.start_date desc`);
  }),
);
crud(
  'subscriptions',
  'subscriptions',
  ['customer_id', 'plan', 'billing', 'monthly_price', 'setup_fee', 'start_date', 'min_term_months', 'status', 'end_date', 'notes'],
  { create: true, remove: true },
);

// NFC-Links
admin.get(
  '/redirects',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`
      select r.*, c.name as customer_name,
        count(s.id)::int as scans_total,
        (count(s.id) filter (where s.scanned_at > now() - interval '30 days'))::int as scans_30d,
        max(s.scanned_at) as last_scan
      from redirects r
      left join scans s on s.redirect_id = r.id
      left join customers c on c.id = r.customer_id
      group by r.id, c.name
      order by r.created_at desc`);
  }),
);
crud('redirects', 'redirects', ['slug', 'target_url', 'label', 'customer_id', 'active'], { create: true, remove: true });

/**
 * Kontakte, die Gäste auf Karten hinterlassen haben. Neueste zuerst, mit dem
 * Kurznamen der Karte — sonst weiß man nicht, welche Karte jemand in der Hand
 * hatte.
 */
admin.get(
  '/leads',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`
      select l.*, k.slug as card_slug, k.label as card_label
      from card_leads l
      join cards k on k.id = l.card_id
      order by l.created_at desc
      limit 300`);
  }),
);
crud('leads', 'card_leads', ['handled'], { remove: true });



// NFC-Karten mit eigener Seite (/k/<slug>)
admin.get(
  '/cards',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`
      select k.*, c.name as customer_name,
        count(distinct s.id)::int as scans_total,
        (count(distinct s.id) filter (where s.scanned_at > now() - interval '30 days'))::int as scans_30d,
        max(s.scanned_at) as last_scan,
        count(distinct l.id)::int as leads_total,
        (count(distinct l.id) filter (where not l.handled))::int as leads_open
      from cards k
      left join scans s on s.card_id = k.id
      left join card_leads l on l.card_id = k.id
      left join customers c on c.id = k.customer_id
      group by k.id, c.name
      order by k.created_at desc`);
  }),
);

/** Art, Thema, Sprache und Inhalt zusammen prüfen — der Inhalt hängt an der Art. */
function cardFields(body: any): { kind: CardKind; theme: CardTheme; lang: CardLang; data: unknown } | null {
  const kind = CARD_KINDS.find((k) => k === body?.kind);
  if (!kind) return null;
  const data = cardData(kind, body?.data);
  if (!data) return null;
  const theme = (CARD_THEMES as readonly string[]).includes(body?.theme) ? (body.theme as CardTheme) : 'brand';
  const lang = (CARD_LANGS as readonly string[]).includes(body?.lang) ? (body.lang as CardLang) : 'de';
  return { kind, theme, lang, data };
}

admin.post(
  '/cards',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const fields = cardFields(req.body);
    if (!fields) return res.status(400).json({ error: 'invalid_card' });
    const slug = String(req.body?.slug ?? '').toLowerCase().trim();
    if (!/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug)) return res.status(400).json({ error: 'invalid_slug' });
    try {
      const [row] = await sql`
        insert into cards (slug, kind, theme, lang, data, label, customer_id)
        values (${slug}, ${fields.kind}, ${fields.theme}, ${fields.lang}, ${sql.json(fields.data as any)},
                ${str(req.body?.label, 200)}, ${req.body?.customer_id || null})
        returning *`;
      return res.status(201).json(row);
    } catch (err) {
      // Doppelter Kurzname: verständlich melden, nicht als 500.
      if ((err as { code?: string }).code === '23505') return res.status(409).json({ error: 'slug_taken' });
      throw err;
    }
  }),
);

admin.patch(
  '/cards/:id',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    const b = req.body ?? {};

    // Nur den Schalter umlegen: ohne Inhalt prüfen zu müssen.
    if (Object.keys(b).length === 1 && typeof b.active === 'boolean') {
      const [row] = await sql`update cards set active = ${b.active} where id = ${req.params['id']} returning *`;
      return row ? res.json(row) : res.status(404).json({ error: 'not_found' });
    }

    const fields = cardFields(b);
    if (!fields) return res.status(400).json({ error: 'invalid_card' });
    const [row] = await sql`
      update cards set kind = ${fields.kind}, theme = ${fields.theme}, lang = ${fields.lang}, data = ${sql.json(fields.data as any)},
        label = ${str(b.label, 200)}, customer_id = ${b.customer_id || null},
        active = ${typeof b.active === 'boolean' ? b.active : true}
      where id = ${req.params['id']}
      returning *`;
    return row ? res.json(row) : res.status(404).json({ error: 'not_found' });
  }),
);

/**
 * Bild für eine Karte in den eigenen Supabase-Speicher legen. Der Körper
 * sind rohe Bytes — darum ein eigener Parser; der JSON-Parser lässt fremde
 * Arten ohnehin durch. Zurück kommt nur die öffentliche Adresse.
 */
admin.post(
  '/cards/upload',
  express.raw({ type: ALLOWED_TYPES, limit: '6mb' }),
  h(async (req, res) => {
    const bytes = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    const result = await uploadImage(bytes, req.headers['content-type']);
    if (!result.ok) {
      console.error('[upload]', result.error, result.detail ?? '');
      const status = result.error === 'storage_not_configured' ? 503 : result.error === 'upload_failed' ? 502 : 400;
      return res.status(status).json({ error: result.error });
    }
    return res.status(201).json({ url: result.url, path: result.path });
  }),
);

admin.delete(
  '/cards/:id',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    await sql`delete from cards where id = ${req.params['id']}`;
    return res.status(204).end();
  }),
);

// Preise
admin.get(
  '/prices',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`select * from prices order by sort, key`);
  }),
);
admin.put(
  '/prices/:key',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const value = Number(req.body?.value);
    if (!Number.isFinite(value) || value < 0 || value > 100000) return res.status(400).json({ error: 'invalid_value' });
    const [row] = await sql`update prices set value = ${value} where key = ${req.params['key']} returning *`;
    return row ? res.json(row) : res.status(404).json({ error: 'not_found' });
  }),
);

// Bestellungen
admin.get(
  '/orders',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`select * from orders order by created_at desc limit 500`);
  }),
);
crud('orders', 'orders', ['status', 'notes']);

// Einstellungen
admin.get(
  '/settings',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const rows = await sql`select key, value from settings`;
    res.json(Object.fromEntries(rows.map((r) => [r['key'], r['value']])));
  }),
);
admin.put(
  '/settings/shop_enabled',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const value = req.body?.value === true;
    await sql`
      insert into settings (key, value) values ('shop_enabled', ${sql.json(value)})
      on conflict (key) do update set value = excluded.value`;
    res.json({ shop_enabled: value });
  }),
);

// Rechnungen
admin.use('/invoices', invoices);

/** Website neu bauen lassen, damit geänderte Preise online gehen. */
admin.post(
  '/publish',
  h(async (_req, res) => {
    if (!config.deployHookUrl) return res.status(503).json({ error: 'no_deploy_hook' });
    const r = await fetch(config.deployHookUrl, { method: 'POST' });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  }),
);

api.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'not_found' });
});

api.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[api]', err);
  const code = (err as { code?: string })?.code;
  // Eindeutigkeit (z. B. Kurzlink schon vergeben) und Prüfregeln verständlich melden.
  if (code === '23505') return res.status(409).json({ error: 'duplicate' });
  if (code === '23514' || code === '22P02' || code === '23503') return res.status(400).json({ error: 'invalid' });
  // Tabelle fehlt: eine SQL-Datei aus supabase/migrations wurde nicht ausgeführt.
  if (code === '42P01') {
    const table = /relation "(?:public\.)?([^"]+)" does not exist/.exec(String((err as Error)?.message))?.[1];
    return res.status(503).json({ error: 'missing_table', table: table ?? null });
  }
  // Nur der Fehlercode, keine Meldung — reicht zur Diagnose und verrät nichts.
  return res.status(500).json({ error: 'server_error', code: typeof code === 'string' ? code : null });
});
