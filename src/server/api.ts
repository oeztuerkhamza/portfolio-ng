import express, { type NextFunction, type Request, type Response } from 'express';
import { requireAdmin } from './auth';
import { config } from './config';
import { db } from './db';
import { createCheckoutSession, verifyWebhook } from './stripe';

/* eslint-disable @typescript-eslint/no-explicit-any */

type Handler = (req: Request, res: Response) => Promise<unknown>;
/** Express 4 fängt keine Promise-Fehler — hier werden sie weitergereicht. */
const h = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res).catch(next);
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LANGS = ['de', 'fr', 'en', 'tr', 'ku'];
const TOPICS = ['cards', 'web', 'sh', 'abo', 'other'];
const PLANS = ['basis', 'business', 'premium'];

function sqlOr503(res: Response) {
  const sql = db();
  if (!sql) res.status(503).json({ error: 'not_configured' });
  return sql;
}

const str = (v: unknown, max: number): string | null => {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
};

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

  const ua = String(req.headers['user-agent'] ?? '');
  const device = /iphone|ipad|ipod/i.test(ua) ? 'ios' : /android/i.test(ua) ? 'android' : 'other';
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

export const api = express.Router();

// Stripe braucht den unveränderten Rohtext für die Signaturprüfung.
api.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json', limit: '1mb' }),
  h(async (req, res) => {
    const secret = config.stripeWebhookSecret;
    const sig = String(req.headers['stripe-signature'] ?? '');
    if (!secret || !Buffer.isBuffer(req.body) || !verifyWebhook(req.body, sig, secret)) {
      return res.status(400).json({ error: 'bad_signature' });
    }
    const event = JSON.parse(req.body.toString('utf8'));
    const sql = sqlOr503(res);
    if (!sql) return;
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const s = event.data.object;
      const paid = s.payment_status === 'paid';
      const shipping = s.collected_information?.shipping_details ?? s.shipping_details ?? null;
      await sql`
        update orders set
          status = case when ${paid} then 'bezahlt' else status end,
          paid_at = case when ${paid} then now() else paid_at end,
          customer_email = ${s.customer_details?.email ?? null},
          customer_name = ${s.customer_details?.name ?? null},
          phone = ${s.customer_details?.phone ?? null},
          shipping = ${shipping ? sql.json(shipping) : null},
          amount_total = ${(s.amount_total ?? 0) / 100}
        where stripe_session_id = ${s.id}`;
    }
    if (event.type === 'checkout.session.expired') {
      await sql`update orders set status = 'storniert' where stripe_session_id = ${event.data.object.id} and status = 'offen'`;
    }
    return res.json({ received: true });
  }),
);

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

    const base = origin(req);
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
  return res.status(500).json({ error: 'server_error' });
});
