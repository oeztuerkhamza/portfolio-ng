import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import middleware from '../../middleware';
import { sha256Hex } from './maintenance';

/**
 * Tests der Wartungs-Middleware, die Vercel vor jeder Seite ausführt.
 *
 * Die eine Regel, die über allem steht: **im Zweifel offen.** Eine Website,
 * die wegen einer langsamen oder kaputten Abfrage in den Wartungsmodus
 * fällt, wäre schlimmer als der Fehler, den sie verbergen soll. Darum steht
 * dieser Fall hier zuerst und in jeder Variante.
 * Ausführen mit `npm run test:server`.
 */

const TOKEN = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
const SITE = 'https://breisgau-digital.de';

const real = globalThis.fetch;
afterEach(() => void (globalThis.fetch = real));

/** `fetch` ersetzen: die Middleware fragt die eigene API nach dem Schalter. */
function flag(reply: { on?: boolean; message?: string | null; bypass?: string | null } | 'fehler' | 'kaputt' | 'status500') {
  const calls: string[] = [];
  globalThis.fetch = (async (url: string | URL | Request) => {
    calls.push(String(url));
    if (reply === 'fehler') throw new Error('getaddrinfo ENOTFOUND');
    if (reply === 'kaputt') return { ok: true, status: 200, json: async () => { throw new Error('kein JSON'); } } as unknown as Response;
    if (reply === 'status500') return { ok: false, status: 500, json: async () => ({}) } as unknown as Response;
    return { ok: true, status: 200, json: async () => reply } as unknown as Response;
  }) as typeof fetch;
  return calls;
}

const get = (path: string, headers: Record<string, string> = {}) =>
  middleware(new Request(SITE + path, { headers }));

describe('Wartung aus', () => {
  test('lässt die Seite durch', async () => {
    flag({ on: false });
    const res = await get('/de/');
    assert.notEqual(res.status, 503);
  });
});

describe('im Zweifel offen', () => {
  test('bei einem Netzfehler', async () => {
    flag('fehler');
    assert.notEqual((await get('/de/')).status, 503);
  });

  test('bei unlesbarer Antwort', async () => {
    flag('kaputt');
    assert.notEqual((await get('/de/')).status, 503);
  });

  test('wenn die eigene API mit 500 antwortet', async () => {
    flag('status500');
    assert.notEqual((await get('/de/')).status, 503);
  });

  test('wenn die Antwort den Schalter gar nicht nennt', async () => {
    flag({});
    assert.notEqual((await get('/de/')).status, 503);
  });
});

describe('Wartung an', () => {
  test('antwortet mit 503 und Retry-After, nicht mit 200', async () => {
    flag({ on: true, message: null, bypass: null });
    const res = await get('/de/bewertungskarten');
    // 200 wäre der Fehler: Google nimmt die Wartungsseite dann als Inhalt.
    assert.equal(res.status, 503);
    assert.ok(Number(res.headers.get('retry-after')) > 0);
    assert.match(res.headers.get('content-type') ?? '', /text\/html/);
    assert.equal(res.headers.get('cache-control'), 'no-store');
  });

  test('zeigt die Wartungsseite in der Sprache der Adresse', async () => {
    flag({ on: true, message: null, bypass: null });
    assert.match(await (await get('/tr/abo')).text(), /Hemen döneceğiz/);
    flag({ on: true, message: null, bypass: null });
    assert.match(await (await get('/de/')).text(), /gleich zurück/);
  });

  test('zeigt die eigene Zeile des Inhabers mit', async () => {
    flag({ on: true, message: 'Ab 14 Uhr wieder da', bypass: null });
    assert.match(await (await get('/de/')).text(), /Ab 14 Uhr wieder da/);
  });

  test('fragt die Auskunft nicht für Adressen, die ohnehin durchkommen', async () => {
    const calls = flag({ on: true, bypass: null });
    for (const p of ['/api/shop', '/admin', '/k/cafe-krone', '/r/muster']) {
      const res = await get(p);
      assert.notEqual(res.status, 503, p);
    }
    // Der Stripe-Webhook soll nicht auf unsere eigene API warten.
    assert.equal(calls.length, 0);
  });
});

describe('der Inhaber sieht seine Seite trotzdem', () => {
  test('mit dem Kennwort in der Adresse: Cookie setzen und weiterleiten', async () => {
    flag({ on: true, bypass: await sha256Hex(TOKEN) });
    const res = await get(`/de/?wartung=${TOKEN}`);
    assert.equal(res.status, 302);
    const cookie = res.headers.get('set-cookie') ?? '';
    assert.match(cookie, /bd-wartung=/);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /Secure/);
    // Das Kennwort darf nicht in der Adresse stehen bleiben.
    assert.equal(res.headers.get('location'), '/de/');
    assert.ok(!(res.headers.get('location') ?? '').includes(TOKEN));
  });

  test('mit dem Cookie: einfach durchlassen', async () => {
    flag({ on: true, bypass: await sha256Hex(TOKEN) });
    const res = await get('/de/', { cookie: `bd-wartung=${TOKEN}` });
    assert.notEqual(res.status, 503);
  });

  test('ein falsches Kennwort hilft nicht', async () => {
    flag({ on: true, bypass: await sha256Hex(TOKEN) });
    assert.equal((await get('/de/?wartung=falsch')).status, 503);
    flag({ on: true, bypass: await sha256Hex(TOKEN) });
    assert.equal((await get('/de/', { cookie: 'bd-wartung=falsch' })).status, 503);
  });

  test('ohne hinterlegtes Kennwort kommt niemand durch', async () => {
    flag({ on: true, bypass: null });
    assert.equal((await get(`/de/?wartung=${TOKEN}`)).status, 503);
  });

  test('lässt andere Abfragewerte in der Adresse stehen', async () => {
    flag({ on: true, bypass: await sha256Hex(TOKEN) });
    const res = await get(`/de/bestellen?ref=abc&wartung=${TOKEN}`);
    assert.equal(res.headers.get('location'), '/de/bestellen?ref=abc');
  });
});
