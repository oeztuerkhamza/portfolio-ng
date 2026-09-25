import { createHmac } from 'node:crypto';
import { createServer, type Server } from 'node:net';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

/**
 * Zusammenspiel von Webhook, Datenbank und Bestellbestätigung.
 *
 * Braucht eine echte Postgres-Datenbank, darum läuft der Block nur mit
 * gesetzter TEST_DATABASE_URL und wird sonst übersprungen:
 *
 *   TEST_DATABASE_URL=postgres://user:pass@127.0.0.1:5432/db npm run test:server
 *
 * Die Tabellen `orders` und `settings` müssen vorhanden sein
 * (siehe supabase/migrations/).
 */

const DB = (process.env['TEST_DATABASE_URL'] ?? '').trim();
const SECRET = 'whsec_test_geheim';

/** Minimaler SMTP-Server: nimmt Mails an und legt sie zum Prüfen ab. */
function fakeSmtp() {
  const mails: string[] = [];
  let connections = 0;
  const srv: Server = createServer((sock) => {
    connections++;
    let body: string[] | null = null;
    sock.write('220 localhost ESMTP\r\n');
    sock.on('error', () => undefined);
    sock.on('data', (chunk) => {
      for (const line of chunk.toString('utf8').split('\r\n')) {
        if (body) {
          if (line === '.') {
            mails.push(body.join('\n'));
            body = null;
            sock.write('250 2.0.0 Ok: queued\r\n');
          } else {
            body.push(line);
          }
          continue;
        }
        const cmd = line.slice(0, 4).toUpperCase();
        if (cmd === 'EHLO' || cmd === 'HELO') sock.write('250 localhost\r\n');
        else if (cmd === 'MAIL' || cmd === 'RCPT') sock.write('250 2.1.0 Ok\r\n');
        else if (cmd === 'DATA') {
          body = [];
          sock.write('354 End data with <CR><LF>.<CR><LF>\r\n');
        } else if (cmd === 'QUIT') {
          sock.write('221 2.0.0 Bye\r\n');
          sock.end();
        } else if (line.trim()) sock.write('250 2.0.0 Ok\r\n');
      }
    });
  });
  return {
    mails,
    get connections() {
      return connections;
    },
    listen: async () => {
      await new Promise<void>((r) => srv.listen(0, '127.0.0.1', r));
      return (srv.address() as AddressInfo).port;
    },
    close: () => new Promise<void>((r) => srv.close(() => r())),
  };
}

describe('Webhook mit Datenbank', { skip: DB ? false : 'TEST_DATABASE_URL nicht gesetzt' }, () => {
  const smtp = fakeSmtp();
  let app: http.Server;
  let base = '';
  let sql: any;

  before(async () => {
    const port = await smtp.listen();
    process.env['DATABASE_URL'] = DB;
    process.env['STRIPE_WEBHOOK_SECRET'] = SECRET;
    process.env['SITE_URL'] = 'https://breisgau-digital.de';
    process.env['SMTP_HOST'] = '127.0.0.1';
    process.env['SMTP_PORT'] = String(port);
    process.env['SMTP_USER'] = 'info@breisgau-digital.de';
    process.env['SMTP_PASS'] = 'x';

    const express = (await import('express')).default;
    const { api } = await import('./api');
    const { db } = await import('./db');
    sql = db();
    await sql`delete from orders where stripe_session_id like 'cs_test_spec%'`;
    await sql`
      insert into settings (key, value) values ('invoice_profile', ${sql.json({ company: 'Breisgau Digital', owner: 'Hamza Öztürk' })})
      on conflict (key) do update set value = excluded.value`;

    const server = express();
    server.use('/api', api);
    app = server.listen(0, '127.0.0.1');
    await new Promise<void>((r) => app.once('listening', () => r()));
    base = `http://127.0.0.1:${(app.address() as AddressInfo).port}`;
  });

  after(async () => {
    if (sql) {
      await sql`delete from orders where stripe_session_id like 'cs_test_spec%'`;
      await sql.end({ timeout: 5 });
    }
    app?.close();
    await smtp.close();
  });

  /** Ereignis so signieren, wie Stripe es tut. */
  async function send(event: unknown) {
    const raw = JSON.stringify(event);
    const t = Math.floor(Date.now() / 1000);
    const sig = createHmac('sha256', SECRET).update(`${t}.${raw}`).digest('hex');
    return fetch(`${base}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Stripe-Signature': `t=${t},v1=${sig}` },
      body: raw,
    });
  }

  const paidEvent = (session: string) => ({
    type: 'checkout.session.completed',
    data: {
      object: {
        id: session,
        payment_status: 'paid',
        amount_total: 14700,
        customer_details: { email: 'kunde@example.com', name: 'Café Krone', phone: '+49 761 1234' },
        collected_information: { shipping_details: { address: { city: 'Freiburg' } } },
      },
    },
  });

  test('bezahlte Bestellung wird gebucht und genau einmal bestätigt', async () => {
    const session = 'cs_test_spec_paid';
    const [order] = await sql`
      insert into orders (stripe_session_id, items, amount_total, lang)
      values (${session}, ${sql.json([{ label: 'NFC-Karte', qty: 2, unit_price: 39 }, { label: 'Tischaufsteller', qty: 1, unit_price: 69 }])}, 147, 'de')
      returning id`;

    const first = await send(paidEvent(session));
    assert.equal(first.status, 200);

    const [afterFirst] = await sql`select status, paid_at, customer_email, customer_name, phone, amount_total from orders where id = ${order.id}`;
    assert.equal(afterFirst.status, 'bezahlt');
    assert.notEqual(afterFirst.paid_at, null);
    assert.equal(afterFirst.customer_email, 'kunde@example.com');
    assert.equal(afterFirst.customer_name, 'Café Krone');
    assert.equal(Number(afterFirst.amount_total), 147);

    // Auf die Mail warten: confirmOrder läuft im Anfrage-Ablauf, der SMTP-
    // Dialog kann aber ein paar Millisekunden nachhängen.
    for (let i = 0; i < 100 && smtp.mails.length < 1; i++) await new Promise((r) => setTimeout(r, 20));
    assert.equal(smtp.mails.length, 1, 'genau eine Bestätigung');
    const mail = smtp.mails[0];
    assert.match(mail, /kunde@example\.com/);
    assert.match(mail, /Bestellbest/);
    assert.match(mail, /312g/);

    // Stripe stellt dasselbe Ereignis erneut zu.
    const again = await send(paidEvent(session));
    assert.equal(again.status, 200);
    await new Promise((r) => setTimeout(r, 400));

    const [afterSecond] = await sql`select status from orders where id = ${order.id}`;
    assert.equal(afterSecond.status, 'bezahlt');
    assert.equal(smtp.mails.length, 1, 'keine zweite Bestätigung bei erneuter Zustellung');
  });

  test('eine bereits bearbeitete Bestellung wird nicht zurückgesetzt', async () => {
    const session = 'cs_test_spec_inarbeit';
    const before = smtp.mails.length;
    const [order] = await sql`
      insert into orders (stripe_session_id, items, amount_total, status)
      values (${session}, '[]'::jsonb, 39, 'in_arbeit') returning id`;

    assert.equal((await send(paidEvent(session))).status, 200);
    await new Promise((r) => setTimeout(r, 400));

    const [row] = await sql`select status from orders where id = ${order.id}`;
    assert.equal(row.status, 'in_arbeit', 'Status bleibt, wie das Portal ihn gesetzt hat');
    assert.equal(smtp.mails.length, before, 'und es geht keine weitere Mail raus');
  });

  test('verzögert fehlgeschlagene Zahlung storniert die offene Bestellung', async () => {
    const session = 'cs_test_spec_failed';
    const [order] = await sql`
      insert into orders (stripe_session_id, items, amount_total)
      values (${session}, '[]'::jsonb, 39) returning id`;

    const res = await send({ type: 'checkout.session.async_payment_failed', data: { object: { id: session } } });
    assert.equal(res.status, 200);

    const [row] = await sql`select status from orders where id = ${order.id}`;
    assert.equal(row.status, 'storniert');
  });

  test('eine falsch signierte Nachricht ändert nichts', async () => {
    const session = 'cs_test_spec_badsig';
    const [order] = await sql`
      insert into orders (stripe_session_id, items, amount_total)
      values (${session}, '[]'::jsonb, 39) returning id`;

    const raw = JSON.stringify(paidEvent(session));
    const res = await fetch(`${base}/api/stripe/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Stripe-Signature': 't=1,v1=deadbeef' },
      body: raw,
    });
    assert.equal(res.status, 400);

    const [row] = await sql`select status from orders where id = ${order.id}`;
    assert.equal(row.status, 'offen');
  });
});
