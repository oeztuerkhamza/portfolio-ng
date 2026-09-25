import { createHmac } from 'node:crypto';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import {
  CANCELLED_EVENTS,
  PAID_EVENTS,
  WEBHOOK_EVENTS,
  checkStripe,
  createCheckoutSession,
  verifyWebhook,
} from './stripe';

/**
 * Tests der Stripe-Anbindung. Kein Netz nach draußen: ein lokaler Server
 * spielt Stripe, damit auch die Fehlerfälle echt durchlaufen.
 * Ausführen mit `npm run test:server`.
 */

const KEYS = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_API_BASE'];

/** Umgebung pro Test frisch setzen, damit Tests sich nicht beeinflussen. */
function setEnv(vars: Record<string, string> = {}): void {
  for (const k of KEYS) delete process.env[k];
  for (const [k, v] of Object.entries(vars)) process.env[k] = v;
}

afterEach(() => setEnv());

interface Call {
  method: string;
  path: string;
  auth: string;
  contentType: string;
  body: string;
}

interface Reply {
  status?: number;
  json?: unknown;
  /** Rohtext, wenn die Antwort absichtlich kein gültiges JSON sein soll. */
  raw?: string;
}

/**
 * Startet einen lokalen Stripe-Ersatz, zeigt `config.stripeApiBase` darauf
 * und sammelt die eingegangenen Anfragen.
 */
async function fakeStripe(reply: (call: Call) => Reply) {
  const calls: Call[] = [];
  const srv = createServer((req: IncomingMessage, res: ServerResponse) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const call: Call = {
        method: req.method ?? '',
        path: req.url ?? '',
        auth: String(req.headers.authorization ?? ''),
        contentType: String(req.headers['content-type'] ?? ''),
        body,
      };
      calls.push(call);
      const r = reply(call);
      res.statusCode = r.status ?? 200;
      res.setHeader('content-type', 'application/json');
      res.end(r.raw ?? JSON.stringify(r.json ?? {}));
    });
  });
  await new Promise<void>((resolve) => srv.listen(0, '127.0.0.1', resolve));
  process.env['STRIPE_API_BASE'] = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
  return { calls, close: () => new Promise<void>((resolve) => srv.close(() => resolve())) };
}

/** Eine Adresse, auf der niemand lauscht — für den Fall „Stripe nicht erreichbar". */
async function deadAddress(): Promise<string> {
  const srv = createServer();
  await new Promise<void>((resolve) => srv.listen(0, '127.0.0.1', resolve));
  const port = (srv.address() as AddressInfo).port;
  await new Promise<void>((resolve) => srv.close(() => resolve()));
  return `http://127.0.0.1:${port}`;
}

// ── Signaturprüfung ────────────────────────────────────────
describe('verifyWebhook', () => {
  const SECRET = 'whsec_geheim';
  const RAW = '{"id":"evt_1","type":"checkout.session.completed"}';

  const header = (raw: string, secret: string, timestamp = Math.floor(Date.now() / 1000)) =>
    `t=${timestamp},v1=${createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex')}`;

  test('akzeptiert eine korrekt signierte Nachricht', () => {
    assert.equal(verifyWebhook(Buffer.from(RAW), header(RAW, SECRET), SECRET), true);
  });

  test('lehnt ein falsches Geheimnis ab', () => {
    assert.equal(verifyWebhook(Buffer.from(RAW), header(RAW, 'whsec_falsch'), SECRET), false);
  });

  test('lehnt einen veränderten Rohtext ab', () => {
    const sig = header(RAW, SECRET);
    const tampered = RAW.replace('completed', 'expired');
    assert.equal(verifyWebhook(Buffer.from(tampered), sig, SECRET), false);
  });

  test('lehnt einen zu alten Zeitstempel ab (Replay-Schutz)', () => {
    const old = Math.floor(Date.now() / 1000) - 301;
    assert.equal(verifyWebhook(Buffer.from(RAW), header(RAW, SECRET, old), SECRET), false);
  });

  test('lehnt einen Zeitstempel aus der Zukunft ab', () => {
    const future = Math.floor(Date.now() / 1000) + 301;
    assert.equal(verifyWebhook(Buffer.from(RAW), header(RAW, SECRET, future), SECRET), false);
  });

  test('akzeptiert innerhalb der Toleranz', () => {
    const almost = Math.floor(Date.now() / 1000) - 299;
    assert.equal(verifyWebhook(Buffer.from(RAW), header(RAW, SECRET, almost), SECRET), true);
  });

  test('akzeptiert, wenn eine von mehreren Signaturen passt (Schlüsselwechsel)', () => {
    const t = Math.floor(Date.now() / 1000);
    const good = createHmac('sha256', SECRET).update(`${t}.${RAW}`).digest('hex');
    const other = createHmac('sha256', 'whsec_alt').update(`${t}.${RAW}`).digest('hex');
    assert.equal(verifyWebhook(Buffer.from(RAW), `t=${t},v1=${other},v1=${good}`, SECRET), true);
  });

  test('lehnt einen Kopf ohne v1-Signatur ab', () => {
    const t = Math.floor(Date.now() / 1000);
    assert.equal(verifyWebhook(Buffer.from(RAW), `t=${t},v0=abc`, SECRET), false);
  });

  test('lehnt einen leeren oder unsinnigen Kopf ab, ohne zu werfen', () => {
    for (const bad of ['', 'kaputt', 't=,v1=', 't=abc,v1=def', 'v1=nur-signatur']) {
      assert.equal(verifyWebhook(Buffer.from(RAW), bad, SECRET), false, `Kopf: ${bad}`);
    }
  });

  test('lehnt eine Signatur falscher Länge ab, ohne zu werfen', () => {
    const t = Math.floor(Date.now() / 1000);
    assert.equal(verifyWebhook(Buffer.from(RAW), `t=${t},v1=ff`, SECRET), false);
  });
});

// ── Ereignislisten ────────────────────────────────────────
describe('Webhook-Ereignisse', () => {
  test('behandelt die verzögert fehlgeschlagene Zahlung als Storno', () => {
    // Klarna, PayPal und SEPA bestätigen später; fehlt dieses Ereignis,
    // bleibt die Bestellung für immer auf „offen" stehen.
    assert.ok(CANCELLED_EVENTS.includes('checkout.session.async_payment_failed'));
    assert.ok(CANCELLED_EVENTS.includes('checkout.session.expired'));
  });

  test('behandelt beide Erfolgsmeldungen als bezahlt', () => {
    assert.deepEqual(PAID_EVENTS, [
      'checkout.session.completed',
      'checkout.session.async_payment_succeeded',
    ]);
  });

  test('WEBHOOK_EVENTS ist die Vereinigung, ohne Überschneidung und Dopplung', () => {
    assert.deepEqual(WEBHOOK_EVENTS, [...PAID_EVENTS, ...CANCELLED_EVENTS]);
    assert.equal(new Set(WEBHOOK_EVENTS).size, WEBHOOK_EVENTS.length);
    assert.equal(PAID_EVENTS.filter((e) => CANCELLED_EVENTS.includes(e)).length, 0);
  });
});

// ── Checkout-Sitzung ──────────────────────────────────────
describe('createCheckoutSession', () => {
  const opts = {
    lines: [
      { name: 'Einzelkarte', unitAmountCents: 3900, quantity: 2 },
      { name: 'Versand', unitAmountCents: 490, quantity: 1 },
    ],
    orderId: '11111111-2222-3333-4444-555555555555',
    successUrl: 'https://breisgau-digital.de/de/bestellen/danke',
    cancelUrl: 'https://breisgau-digital.de/de/bestellen',
    locale: 'de',
  };

  test('schickt Positionen, Bestellnummer und Vorgaben an Stripe', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_test_abc' });
    const stripe = await fakeStripe(() => ({ json: { id: 'cs_1', url: 'https://checkout.stripe.com/c/pay/cs_1' } }));
    try {
      const session = await createCheckoutSession(opts);
      assert.deepEqual(session, { id: 'cs_1', url: 'https://checkout.stripe.com/c/pay/cs_1' });

      const [call] = stripe.calls;
      assert.equal(call.method, 'POST');
      assert.equal(call.path, '/v1/checkout/sessions');
      assert.equal(call.auth, 'Bearer sk_test_abc');
      assert.match(call.contentType, /application\/x-www-form-urlencoded/);

      const p = new URLSearchParams(call.body);
      assert.equal(p.get('mode'), 'payment');
      assert.equal(p.get('locale'), 'de');
      assert.equal(p.get('success_url'), opts.successUrl);
      assert.equal(p.get('cancel_url'), opts.cancelUrl);

      // Die Bestellnummer muss an allen drei Stellen stehen, sonst findet
      // der Webhook die Bestellung nicht wieder.
      assert.equal(p.get('client_reference_id'), opts.orderId);
      assert.equal(p.get('metadata[order_id]'), opts.orderId);
      assert.equal(p.get('payment_intent_data[metadata][order_id]'), opts.orderId);

      // Nur Deutschland, Rechnungsadresse und Telefon werden erhoben.
      assert.equal(p.get('shipping_address_collection[allowed_countries][0]'), 'DE');
      assert.equal(p.get('billing_address_collection'), 'required');
      assert.equal(p.get('phone_number_collection[enabled]'), 'true');
    } finally {
      await stripe.close();
    }
  });

  test('nummeriert die Positionen durch und rechnet in Cent', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_test_abc' });
    const stripe = await fakeStripe(() => ({ json: { id: 'cs_1', url: 'https://x/y' } }));
    try {
      await createCheckoutSession(opts);
      const p = new URLSearchParams(stripe.calls[0].body);
      assert.equal(p.get('line_items[0][price_data][product_data][name]'), 'Einzelkarte');
      assert.equal(p.get('line_items[0][price_data][unit_amount]'), '3900');
      assert.equal(p.get('line_items[0][quantity]'), '2');
      assert.equal(p.get('line_items[0][price_data][currency]'), 'eur');
      assert.equal(p.get('line_items[1][price_data][product_data][name]'), 'Versand');
      assert.equal(p.get('line_items[1][price_data][unit_amount]'), '490');
      assert.equal(p.get('line_items[1][quantity]'), '1');
    } finally {
      await stripe.close();
    }
  });

  test('wirft mit der Begründung von Stripe', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_test_abc' });
    const stripe = await fakeStripe(() => ({ status: 400, json: { error: { message: 'Amount must be at least 50 cents' } } }));
    try {
      await assert.rejects(createCheckoutSession(opts), /Amount must be at least 50 cents/);
    } finally {
      await stripe.close();
    }
  });

  test('wirft, wenn Stripe keine Bezahladresse liefert', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_test_abc' });
    const stripe = await fakeStripe(() => ({ json: { id: 'cs_1' } }));
    try {
      await assert.rejects(createCheckoutSession(opts), /Stripe/);
    } finally {
      await stripe.close();
    }
  });
});

// ── Selbstprüfung der Einrichtung ─────────────────────────
describe('checkStripe', () => {
  const account = { charges_enabled: true, settings: { dashboard: { display_name: 'Breisgau Digital' } } };

  test('meldet den fehlenden Schlüssel, ohne Stripe zu fragen', async () => {
    setEnv();
    const status = await checkStripe();
    assert.equal(status.keyPresent, false);
    assert.equal(status.ready, false);
    assert.equal(status.mode, null);
    assert.equal(status.error, 'STRIPE_SECRET_KEY fehlt');
  });

  test('ist erst „ready", wenn Schlüssel und Webhook-Geheimnis gesetzt sind', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_test_abc' });
    let stripe = await fakeStripe(() => ({ json: account }));
    try {
      const onlyKey = await checkStripe();
      assert.equal(onlyKey.ready, false);
      assert.equal(onlyKey.webhookSecretPresent, false);
      assert.equal(onlyKey.error, null);
    } finally {
      await stripe.close();
    }

    setEnv({ STRIPE_SECRET_KEY: 'sk_test_abc', STRIPE_WEBHOOK_SECRET: 'whsec_x' });
    stripe = await fakeStripe(() => ({ json: account }));
    try {
      const both = await checkStripe();
      assert.equal(both.ready, true);
      assert.equal(both.webhookSecretPresent, true);
    } finally {
      await stripe.close();
    }
  });

  test('erkennt Test- und Echtbetrieb am Präfix', async () => {
    for (const [key, mode] of [
      ['sk_test_abc', 'test'],
      ['sk_live_abc', 'live'],
      ['rk_test_abc', 'test'],
      ['sk_eigenartig', null],
    ] as const) {
      setEnv({ STRIPE_SECRET_KEY: key });
      const stripe = await fakeStripe(() => ({ json: account }));
      try {
        assert.equal((await checkStripe()).mode, mode, `Schlüssel: ${key}`);
      } finally {
        await stripe.close();
      }
    }
  });

  test('übernimmt Kontoname und Freischaltung', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_live_abc' });
    const stripe = await fakeStripe(() => ({ json: account }));
    try {
      const status = await checkStripe();
      assert.equal(status.account, 'Breisgau Digital');
      assert.equal(status.chargesEnabled, true);
      assert.equal(status.error, null);
      assert.equal(stripe.calls[0].path, '/v1/account');
      assert.equal(stripe.calls[0].auth, 'Bearer sk_live_abc');
    } finally {
      await stripe.close();
    }
  });

  test('nimmt den Namen aus dem Geschäftsprofil, wenn das Dashboard keinen hat', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_live_abc' });
    const stripe = await fakeStripe(() => ({ json: { charges_enabled: false, business_profile: { name: 'Zweitname' } } }));
    try {
      const status = await checkStripe();
      assert.equal(status.account, 'Zweitname');
      assert.equal(status.chargesEnabled, false);
    } finally {
      await stripe.close();
    }
  });

  test('meldet einen ungültigen Schlüssel, ohne ihn oder Stripes Wortlaut zu verraten', async () => {
    const key = 'sk_live_SUPERGEHEIM';
    setEnv({ STRIPE_SECRET_KEY: key });
    const stripe = await fakeStripe(() => ({
      status: 401,
      json: { error: { message: `Invalid API Key provided: ${key}` } },
    }));
    try {
      const status = await checkStripe();
      assert.equal(status.error, 'STRIPE_SECRET_KEY ungültig');
      // Der Schlüssel darf nirgends in der Antwort auftauchen: das Ergebnis
      // geht ins Admin-Portal.
      const dump = JSON.stringify(status);
      assert.equal(dump.includes(key), false, 'Schlüssel steckt in der Antwort');
      assert.equal(dump.includes('SUPERGEHEIM'), false);
      assert.equal(dump.includes('Invalid API Key'), false, 'Stripes Wortlaut steckt in der Antwort');
    } finally {
      await stripe.close();
    }
  });

  test('erklärt einen eingeschränkten Schlüssel (403)', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'rk_live_abc' });
    const stripe = await fakeStripe(() => ({ status: 403, json: { error: { message: 'insufficient permissions' } } }));
    try {
      assert.equal((await checkStripe()).error, 'Schlüssel darf das Konto nicht lesen (403)');
    } finally {
      await stripe.close();
    }
  });

  test('nennt bei anderen Fehlern den Status', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_live_abc' });
    const stripe = await fakeStripe(() => ({ status: 503, json: {} }));
    try {
      assert.equal((await checkStripe()).error, 'Stripe antwortet mit 503');
    } finally {
      await stripe.close();
    }
  });

  test('meldet eine unerreichbare Stripe-API, ohne zu werfen', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_live_abc', STRIPE_API_BASE: await deadAddress() });
    const status = await checkStripe();
    assert.equal(status.error, 'Stripe nicht erreichbar');
    assert.equal(status.chargesEnabled, null);
  });

  test('meldet unlesbares JSON als unerreichbar, statt zu werfen', async () => {
    setEnv({ STRIPE_SECRET_KEY: 'sk_live_abc' });
    const stripe = await fakeStripe(() => ({ raw: 'kein json' }));
    try {
      assert.equal((await checkStripe()).error, 'Stripe nicht erreichbar');
    } finally {
      await stripe.close();
    }
  });
});
