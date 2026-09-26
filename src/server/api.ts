import express, { type NextFunction, type Request, type Response } from 'express';
import { requireAdmin } from './auth';
import { config } from './config';
import { db } from './db';
import { CARD_KINDS, CARD_THEMES, type CardKind, type CardTheme, cardData, renderCard } from './cards';
import { h, sqlOr503, str, UUID } from './http';
import { ALLOWED_TYPES, uploadImage } from './storage';
import { invoices } from './invoices';
import { type OrderMailItem, mailer, orderConfirmation } from './mail';
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

  try {
    const [row] = await sql`
      with c as (select id, slug, kind, theme, data from cards where slug = ${slug} and active),
           s as (insert into scans (card_id, device) select id, ${deviceOf(req)} from c)
      select slug, kind, theme, data from c`;
    if (!row) return res.redirect(302, '/');
    return res.type('html').send(
      renderCard(
        {
          slug: String(row['slug']),
          kind: row['kind'] as CardKind,
          theme: row['theme'] as CardTheme,
          data: row['data'] as never,
        },
        origin(req),
      ),
    );
  } catch (err) {
    console.error('[k]', err);
    return res.redirect(302, '/');
  }
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
          returning id, items, amount_total, customer_email, customer_name`;
        if (order) await confirmOrder(sql, order, origin(req));
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

// NFC-Karten mit eigener Seite (/k/<slug>)
admin.get(
  '/cards',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`
      select k.*, c.name as customer_name,
        count(s.id)::int as scans_total,
        (count(s.id) filter (where s.scanned_at > now() - interval '30 days'))::int as scans_30d,
        max(s.scanned_at) as last_scan
      from cards k
      left join scans s on s.card_id = k.id
      left join customers c on c.id = k.customer_id
      group by k.id, c.name
      order by k.created_at desc`);
  }),
);

/** Art, Thema und Inhalt zusammen prüfen — der Inhalt hängt an der Art. */
function cardFields(body: any): { kind: CardKind; theme: CardTheme; data: unknown } | null {
  const kind = CARD_KINDS.find((k) => k === body?.kind);
  if (!kind) return null;
  const data = cardData(kind, body?.data);
  if (!data) return null;
  const theme = (CARD_THEMES as readonly string[]).includes(body?.theme) ? (body.theme as CardTheme) : 'brand';
  return { kind, theme, data };
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
        insert into cards (slug, kind, theme, data, label, customer_id)
        values (${slug}, ${fields.kind}, ${fields.theme}, ${sql.json(fields.data as any)},
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
      update cards set kind = ${fields.kind}, theme = ${fields.theme}, data = ${sql.json(fields.data as any)},
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
