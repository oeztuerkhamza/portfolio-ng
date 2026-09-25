import express from 'express';
import nodemailer from 'nodemailer';
import { config } from './config';
import { h, sqlOr503, str, UUID } from './http';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Rechnungen im Admin-Portal (/api/admin/invoices).
 *
 * Ablauf: Entwurf anlegen und bearbeiten → festschreiben (bekommt die
 * nächste Nummer, danach unveränderbar) → als bezahlt markieren. Falsche
 * Rechnungen werden nicht gelöscht, sondern per Stornorechnung aufgehoben.
 */
export const invoices = express.Router();

export interface InvoiceItem {
  description: string;
  qty: number;
  unit: string;
  unit_price: number;
}

const PROFILE_TEXT: Record<string, number> = {
  company: 200,
  owner: 200,
  street: 200,
  city: 120,
  phone: 60,
  email: 200,
  web: 200,
  tax_number: 40,
  vat_id: 20,
  bank: 120,
  iban: 42,
  bic: 11,
  intro: 2000,
  closing: 200,
};

type Sql = NonNullable<ReturnType<typeof sqlOr503>>;

const round2 = (n: number) => Math.round(n * 100) / 100;

function num(v: unknown, min: number, max: number): number | null {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function cleanItems(v: unknown): InvoiceItem[] | null {
  if (!Array.isArray(v) || v.length > 40) return null;
  const out: InvoiceItem[] = [];
  for (const raw of v) {
    const description = str(raw?.description, 500);
    const qty = num(raw?.qty, -10000, 10000);
    const price = num(raw?.unit_price, -1_000_000, 1_000_000);
    if (!description || qty === null || price === null) return null;
    out.push({ description, qty: round2(qty), unit: str(raw?.unit, 20) ?? '', unit_price: round2(price) });
  }
  return out;
}

export function totals(items: InvoiceItem[], vatRate: number, smallBusiness: boolean) {
  const net = round2(items.reduce((s, i) => s + round2(i.qty * i.unit_price), 0));
  const vat = smallBusiness ? 0 : round2((net * vatRate) / 100);
  return { net_total: net, vat_total: vat, gross_total: round2(net + vat) };
}

/** Felder eines Entwurfs aus dem Request übernehmen und prüfen. */
function draftFields(sql: Sql, b: any): Record<string, unknown> | null {
  const items = cleanItems(b?.items ?? []);
  if (!items) return null;
  const small = b?.small_business !== false;
  const vatRate = small ? 0 : [0, 7, 19].includes(Number(b?.vat_rate)) ? Number(b.vat_rate) : 19;
  const dueDays = num(b?.due_days ?? 14, 0, 120);
  const issue = typeof b?.issue_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.issue_date) ? b.issue_date : null;
  const customer = typeof b?.customer_id === 'string' && UUID.test(b.customer_id) ? b.customer_id : null;
  return {
    customer_id: customer,
    recipient_name: str(b?.recipient_name, 200) ?? '',
    recipient_business: str(b?.recipient_business, 200),
    recipient_street: str(b?.recipient_street, 200),
    recipient_city: str(b?.recipient_city, 120),
    recipient_email: str(b?.recipient_email, 200),
    ...(issue ? { issue_date: issue } : {}),
    service_period: str(b?.service_period, 120),
    due_days: dueDays === null ? 14 : Math.round(dueDays),
    items: sql.json(items as any),
    vat_rate: vatRate,
    small_business: small,
    intro: str(b?.intro, 2000),
    notes: str(b?.notes, 2000),
    ...totals(items, vatRate, small),
  };
}

/** Nächste freie Nummer im Jahr; Rechnungen und Stornos teilen sich den Zähler. */
async function nextNumber(tx: Sql, prefix: 'RE' | 'ST', year: number): Promise<string> {
  // Sperre bis Transaktionsende, damit zwei gleichzeitige Aufrufe nicht dieselbe Nummer ziehen.
  await tx`select pg_advisory_xact_lock(hashtext('invoice_number'), ${year}::int)`;
  const [row] = await tx`
    select coalesce(max(substring(number from 9)::int), 0) + 1 as n
    from invoices where number ~ ${`^(RE|ST)-${year}-`}`;
  return `${prefix}-${year}-${String(row['n']).padStart(4, '0')}`;
}

async function profile(sql: Sql): Promise<Record<string, unknown>> {
  const [row] = await sql`select value from settings where key = 'invoice_profile'`;
  return (row?.['value'] as Record<string, unknown>) ?? {};
}

// ── Absenderdaten ──────────────────────────────────────────
invoices.get(
  '/profile',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await profile(sql));
  }),
);

invoices.put(
  '/profile',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const b = req.body ?? {};
    const value: Record<string, unknown> = {};
    for (const [k, max] of Object.entries(PROFILE_TEXT)) value[k] = str(b[k], max) ?? '';
    value['iban'] = String(value['iban']).replace(/\s+/g, '').toUpperCase();
    value['bic'] = String(value['bic']).replace(/\s+/g, '').toUpperCase();
    if (value['iban'] && !/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(String(value['iban'])))
      return res.status(400).json({ error: 'invalid_iban' });
    value['small_business'] = b.small_business !== false;
    value['due_days'] = Math.round(num(b.due_days, 0, 120) ?? 14);
    await sql`
      insert into settings (key, value) values ('invoice_profile', ${sql.json(value as any)})
      on conflict (key) do update set value = excluded.value`;
    return res.json(value);
  }),
);

// ── Rechnungen ─────────────────────────────────────────────
invoices.get(
  '/',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    res.json(await sql`
      select i.*, (i.issue_date + i.due_days)::date as due_date
      from invoices i
      order by (i.number is null) desc, i.issue_date desc, i.number desc nulls first, i.created_at desc
      limit 1000`);
  }),
);

invoices.post(
  '/',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const data = draftFields(sql, req.body);
    if (!data) return res.status(400).json({ error: 'invalid_items' });
    const [row] = await sql`insert into invoices ${sql(data as any)} returning *, (issue_date + due_days)::date as due_date`;
    return res.status(201).json(row);
  }),
);

invoices.patch(
  '/:id',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    const data = draftFields(sql, req.body);
    if (!data) return res.status(400).json({ error: 'invalid_items' });
    const [row] = await sql`
      update invoices set ${sql(data as any)}
      where id = ${req.params['id']} and status = 'entwurf'
      returning *, (issue_date + due_days)::date as due_date`;
    return row ? res.json(row) : res.status(409).json({ error: 'locked' });
  }),
);

invoices.delete(
  '/:id',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    const rows = await sql`delete from invoices where id = ${req.params['id']} and status = 'entwurf' returning id`;
    return rows.length ? res.status(204).end() : res.status(409).json({ error: 'locked' });
  }),
);

/** Entwurf festschreiben: Nummer vergeben, Absender einfrieren. */
invoices.post(
  '/:id/finalize',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    const sender = await profile(sql);
    if (!String(sender['tax_number'] ?? '').trim() && !String(sender['vat_id'] ?? '').trim())
      return res.status(400).json({ error: 'missing_tax_number' });

    const result = await sql.begin(async (tx) => {
      const [inv] = await tx`select *, to_char(issue_date, 'DD.MM.YYYY') as issue_de, extract(year from issue_date)::int as issue_year from invoices where id = ${req.params['id']} for update`;
      if (!inv) return { status: 404, body: { error: 'not_found' } };
      if (inv['status'] !== 'entwurf') return { status: 409, body: { error: 'locked' } };
      if (!String(inv['recipient_name'] ?? '').trim()) return { status: 400, body: { error: 'missing_recipient' } };
      if (!(inv['items'] as unknown[]).length) return { status: 400, body: { error: 'missing_items' } };
      const year = Number(inv['issue_year']);
      const number = await nextNumber(tx as unknown as Sql, 'RE', year);
      const [row] = await tx`
        update invoices set number = ${number}, status = 'offen', finalized_at = now(), sender = ${tx.json(sender as any)}
        where id = ${inv['id']}
        returning *, (issue_date + due_days)::date as due_date`;
      return { status: 200, body: row };
    });
    return res.status(result.status).json(result.body);
  }),
);

/** Bezahlt / wieder offen. */
invoices.post(
  '/:id/status',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    const status = req.body?.status;
    if (!['offen', 'bezahlt'].includes(status)) return res.status(400).json({ error: 'invalid' });
    const paid =
      status === 'bezahlt'
        ? typeof req.body?.paid_at === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.body.paid_at)
          ? req.body.paid_at
          : new Date().toISOString().slice(0, 10)
        : null;
    const [row] = await sql`
      update invoices set status = ${status}, paid_at = ${paid}
      where id = ${req.params['id']} and kind = 'rechnung' and status in ('offen', 'bezahlt')
      returning *, (issue_date + due_days)::date as due_date`;
    return row ? res.json(row) : res.status(409).json({ error: 'locked' });
  }),
);

/** Stornorechnung erzeugen: gleiche Positionen mit negativer Menge. */
invoices.post(
  '/:id/cancel',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    const sender = await profile(sql);

    const result = await sql.begin(async (tx) => {
      const [inv] = await tx`select *, to_char(issue_date, 'DD.MM.YYYY') as issue_de, extract(year from issue_date)::int as issue_year from invoices where id = ${req.params['id']} for update`;
      if (!inv) return { status: 404, body: { error: 'not_found' } };
      if (inv['kind'] !== 'rechnung' || !['offen', 'bezahlt'].includes(String(inv['status'])))
        return { status: 409, body: { error: 'locked' } };
      const items = (inv['items'] as InvoiceItem[]).map((i) => ({ ...i, qty: -i.qty }));
      const t = totals(items, Number(inv['vat_rate']), !!inv['small_business']);
      const [{ today, year }] = await tx`select current_date::text as today, extract(year from current_date)::int as year`;
      const number = await nextNumber(tx as unknown as Sql, 'ST', Number(year));
      const [storno] = await tx`
        insert into invoices ${tx({
          number,
          status: 'storniert',
          kind: 'storno',
          cancels_id: inv['id'],
          customer_id: inv['customer_id'],
          recipient_name: inv['recipient_name'],
          recipient_business: inv['recipient_business'],
          recipient_street: inv['recipient_street'],
          recipient_city: inv['recipient_city'],
          recipient_email: inv['recipient_email'],
          issue_date: today,
          service_period: inv['service_period'],
          due_days: 0,
          items: tx.json(items as any),
          vat_rate: inv['vat_rate'],
          small_business: inv['small_business'],
          intro: `hiermit storniere ich die Rechnung ${inv['number']} vom ${inv['issue_de']} in voller Höhe.`,
          notes: null,
          sender: tx.json(sender as any),
          finalized_at: new Date(),
          ...t,
        } as any)}
        returning *, (issue_date + due_days)::date as due_date`;
      await tx`update invoices set status = 'storniert' where id = ${inv['id']}`;
      return { status: 201, body: storno };
    });
    return res.status(result.status).json(result.body);
  }),
);

// ── Versand per E-Mail ─────────────────────────────────────
function mailer() {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) return null;
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: { user: config.smtpUser, pass: config.smtpPass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

const euro = (n: unknown) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(n) || 0);

/**
 * Festgeschriebene Rechnung an den Kunden schicken. Das PDF erzeugt das
 * Admin-Portal aus derselben Seite wie Vorschau und Druck; der Server hängt
 * es nur an. Eine Kopie geht per BCC ans eigene Postfach, weil SMTP nichts
 * in „Gesendet" ablegt.
 */
invoices.post(
  '/:id/send',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    if (!UUID.test(req.params['id'])) return res.status(400).json({ error: 'invalid_id' });
    const transport = mailer();
    if (!transport) return res.status(503).json({ error: 'mail_not_configured' });
    const pdf = typeof req.body?.pdf === 'string' ? Buffer.from(req.body.pdf, 'base64') : null;
    if (!pdf || pdf.length < 1000 || pdf.length > 3_000_000 || pdf.subarray(0, 5).toString() !== '%PDF-')
      return res.status(400).json({ error: 'invalid_pdf' });

    const [inv] = await sql`
      select *, to_char(issue_date + due_days, 'DD.MM.YYYY') as due_de
      from invoices where id = ${req.params['id']}`;
    if (!inv) return res.status(404).json({ error: 'not_found' });
    if (inv['status'] === 'entwurf') return res.status(409).json({ error: 'not_final' });
    const to = String(inv['recipient_email'] ?? '').trim();
    if (!to) return res.status(400).json({ error: 'missing_email' });

    const s = { ...(await profile(sql)), ...((inv['sender'] as Record<string, unknown>) ?? {}) } as Record<string, string>;
    const storno = inv['kind'] === 'storno';
    const what = storno ? 'Stornorechnung' : 'Rechnung';
    const due = !storno && inv['status'] === 'offen' ? `, zahlbar bis zum ${inv['due_de']}` : '';
    const text =
      `Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie ${storno ? 'die Stornorechnung' : 'die Rechnung'} ${inv['number']} ` +
      `über ${euro(inv['gross_total'])}${due}.\n\nVielen Dank für Ihren Auftrag!\n\n` +
      [s['closing'] || 'Mit freundlichen Grüßen', s['owner'] || s['company'], s['company'], s['phone'], s['web']].filter(Boolean).join('\n');
    const from = { name: s['company'] || 'Breisgau Digital', address: config.smtpUser };

    try {
      await transport.sendMail({
        from,
        to,
        bcc: config.smtpUser,
        subject: `${what} ${inv['number']} – ${from.name}`,
        text,
        attachments: [{ filename: `${what}_${inv['number']}.pdf`, content: pdf, contentType: 'application/pdf' }],
      });
    } catch (err) {
      console.error('[invoices] Versand', err);
      const e = err as { code?: string; responseCode?: number };
      return res.status(502).json({ error: 'mail_failed', code: e.code ?? null, smtp: e.responseCode ?? null });
    }

    // Die Mail ist raus — ein Fehler beim Vermerken (etwa Spalte noch nicht
    // angelegt) darf das nicht als Fehlschlag melden.
    const [row] = await sql`update invoices set sent_at = now() where id = ${inv['id']} returning sent_at`.catch((err) => {
      console.error('[invoices] sent_at', err);
      return [];
    });
    return res.json({ sent_at: row?.['sent_at'] ?? null });
  }),
);
