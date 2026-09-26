import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import { ALLOWED_TYPES, MAX_UPLOAD_BYTES, extFor, publicUrl, uploadImage } from './storage';

/**
 * Tests des Datei-Uploads. Ein lokaler Server spielt Supabase, damit auch
 * die Fehlerwege echt durchlaufen — es geht kein Byte nach draußen.
 * Ausführen mit `npm run test:server`.
 */

const KEYS = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY', 'SUPABASE_STORAGE_BUCKET'];
const SERVICE_KEY = 'eyJzZXJ2aWNlIjoiZ2VoZWltIn0';

function setEnv(vars: Record<string, string> = {}): void {
  for (const k of KEYS) delete process.env[k];
  for (const [k, v] of Object.entries(vars)) process.env[k] = v;
}
afterEach(() => setEnv());

interface Call {
  method: string;
  path: string;
  auth: string;
  type: string;
  upsert: string;
  bytes: number;
  body: string;
}

/** Supabase-Ersatz: sammelt die Anfragen und antwortet nach Vorgabe. */
async function fakeSupabase(reply: (call: Call) => { status: number; json?: unknown }) {
  const calls: Call[] = [];
  const srv = createServer((req: IncomingMessage, res: ServerResponse) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks);
      const call: Call = {
        method: req.method ?? '',
        path: req.url ?? '',
        auth: String(req.headers.authorization ?? ''),
        type: String(req.headers['content-type'] ?? ''),
        upsert: String(req.headers['x-upsert'] ?? ''),
        bytes: raw.length,
        body: raw.toString('utf8').slice(0, 400),
      };
      calls.push(call);
      const r = reply(call);
      res.statusCode = r.status;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(r.json ?? {}));
    });
  });
  await new Promise<void>((r) => srv.listen(0, '127.0.0.1', r));
  process.env['SUPABASE_URL'] = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
  process.env['SUPABASE_SERVICE_ROLE_KEY'] = SERVICE_KEY;
  return { calls, close: () => new Promise<void>((r) => srv.close(() => r())) };
}

const png = (size = 64) => Buffer.alloc(size, 7);
const isUpload = (c: Call) => c.path.startsWith('/storage/v1/object/') && !c.path.includes('/public/');
const isBucket = (c: Call) => c.path === '/storage/v1/bucket';

describe('extFor', () => {
  test('kennt die erlaubten Bildarten', () => {
    assert.equal(extFor('image/png'), 'png');
    assert.equal(extFor('image/jpeg'), 'jpg');
    assert.equal(extFor('image/webp'), 'webp');
    assert.equal(extFor('image/gif'), 'gif');
    assert.equal(extFor('image/avif'), 'avif');
  });

  test('lässt den Zusatz hinter dem Semikolon stehen und schaut nicht auf Groß/Klein', () => {
    assert.equal(extFor('image/PNG; charset=binary'), 'png');
  });

  test('lehnt SVG ab — es darf Skript enthalten', () => {
    assert.equal(extFor('image/svg+xml'), null);
    assert.equal(ALLOWED_TYPES.includes('image/svg+xml'), false);
  });

  test('lehnt alles ab, was kein erlaubtes Bild ist', () => {
    for (const bad of ['text/html', 'application/pdf', 'application/javascript', '', null, undefined, 42]) {
      assert.equal(extFor(bad), null, String(bad));
    }
  });
});

describe('uploadImage — Prüfungen vor dem Netz', () => {
  test('sagt Bescheid, wenn der Speicher nicht eingerichtet ist', async () => {
    setEnv();
    assert.deepEqual(await uploadImage(png(), 'image/png'), { ok: false, error: 'storage_not_configured' });
  });

  test('verlangt den Dienstschlüssel, nicht nur die Adresse', async () => {
    setEnv({ SUPABASE_URL: 'https://x.supabase.co' });
    assert.deepEqual(await uploadImage(png(), 'image/png'), { ok: false, error: 'storage_not_configured' });
  });

  test('lehnt eine nicht erlaubte Art ab, ohne Supabase zu fragen', async () => {
    const stripe = await fakeSupabase(() => ({ status: 200 }));
    try {
      const res = await uploadImage(Buffer.from('<svg onload=alert(1)>'), 'image/svg+xml');
      assert.deepEqual(res, { ok: false, error: 'unsupported_type' });
      assert.equal(stripe.calls.length, 0, 'es wurde nichts hochgeladen');
    } finally {
      await stripe.close();
    }
  });

  test('lehnt eine leere und eine zu große Datei ab', async () => {
    const sb = await fakeSupabase(() => ({ status: 200 }));
    try {
      assert.deepEqual(await uploadImage(Buffer.alloc(0), 'image/png'), { ok: false, error: 'empty' });
      const big = await uploadImage(Buffer.alloc(MAX_UPLOAD_BYTES + 1), 'image/png');
      assert.deepEqual(big, { ok: false, error: 'too_large' });
      assert.equal(sb.calls.length, 0);
    } finally {
      await sb.close();
    }
  });
});

describe('uploadImage — Ablegen', () => {
  test('legt die Datei ab und gibt die öffentliche Adresse zurück', async () => {
    const sb = await fakeSupabase(() => ({ status: 200, json: { Key: 'ok' } }));
    try {
      const res = await uploadImage(png(128), 'image/png');
      assert.equal(res.ok, true);
      if (!res.ok) return;

      const [call] = sb.calls;
      assert.equal(call.method, 'POST');
      assert.match(call.path, /^\/storage\/v1\/object\/cards\//);
      assert.equal(call.auth, `Bearer ${SERVICE_KEY}`);
      assert.equal(call.type, 'image/png');
      assert.equal(call.upsert, 'false', 'nichts überschreiben');
      assert.equal(call.bytes, 128);
      assert.equal(res.url, publicUrl('cards', res.path));
      assert.match(res.url, /\/storage\/v1\/object\/public\/cards\//);
    } finally {
      await sb.close();
    }
  });

  test('vergibt den Namen selbst — der Browser bestimmt ihn nie', async () => {
    const sb = await fakeSupabase(() => ({ status: 200 }));
    try {
      const res = await uploadImage(png(), 'image/jpeg');
      assert.equal(res.ok, true);
      if (!res.ok) return;
      // Jahr / UUID.endung — kein Punkt-Punkt, kein fremder Name.
      assert.match(res.path, /^\d{4}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/);
      assert.equal(res.path.includes('..'), false);
    } finally {
      await sb.close();
    }
  });

  test('zwei Uploads bekommen verschiedene Namen', async () => {
    const sb = await fakeSupabase(() => ({ status: 200 }));
    try {
      const a = await uploadImage(png(), 'image/png');
      const b = await uploadImage(png(), 'image/png');
      assert.equal(a.ok && b.ok && a.path !== b.path, true);
    } finally {
      await sb.close();
    }
  });

  test('legt den Eimer beim ersten Mal selbst an und lädt danach hoch', async () => {
    let bucketExists = false;
    const sb = await fakeSupabase((call) => {
      if (isBucket(call)) {
        bucketExists = true;
        return { status: 200, json: { name: 'cards' } };
      }
      return bucketExists ? { status: 200 } : { status: 404, json: { message: 'Bucket not found' } };
    });
    try {
      const res = await uploadImage(png(), 'image/png');
      assert.equal(res.ok, true);
      assert.equal(sb.calls.filter(isBucket).length, 1, 'Eimer einmal angelegt');
      assert.equal(sb.calls.filter(isUpload).length, 2, 'erst vergeblich, dann erfolgreich');
      const [bucket] = sb.calls.filter(isBucket);
      assert.match(bucket.body, /"public":true/);
    } finally {
      await sb.close();
    }
  });

  test('nimmt einen schon vorhandenen Eimer (409) ebenfalls an', async () => {
    let tries = 0;
    const sb = await fakeSupabase((call) => {
      if (isBucket(call)) return { status: 409, json: { message: 'already exists' } };
      return ++tries === 1 ? { status: 404 } : { status: 200 };
    });
    try {
      assert.equal((await uploadImage(png(), 'image/png')).ok, true);
    } finally {
      await sb.close();
    }
  });

  test('meldet einen Fehlschlag, wenn auch der Eimer nicht angelegt werden kann', async () => {
    const sb = await fakeSupabase((call) => (isBucket(call) ? { status: 403 } : { status: 404 }));
    try {
      const res = await uploadImage(png(), 'image/png');
      assert.equal(res.ok, false);
      if (res.ok) return;
      assert.equal(res.error, 'upload_failed');
    } finally {
      await sb.close();
    }
  });

  test('meldet einen Serverfehler von Supabase', async () => {
    const sb = await fakeSupabase(() => ({ status: 500 }));
    try {
      const res = await uploadImage(png(), 'image/png');
      assert.equal(res.ok, false);
      if (res.ok) return;
      assert.equal(res.error, 'upload_failed');
      assert.match(String(res.detail), /500/);
    } finally {
      await sb.close();
    }
  });

  test('meldet einen Fehlschlag, wenn Supabase nicht erreichbar ist', async () => {
    const dead = await fakeSupabase(() => ({ status: 200 }));
    const url = process.env['SUPABASE_URL'];
    await dead.close();
    setEnv({ SUPABASE_URL: String(url), SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY });

    const res = await uploadImage(png(), 'image/png');
    assert.equal(res.ok, false);
    if (res.ok) return;
    assert.equal(res.error, 'upload_failed');
  });

  test('verrät den Dienstschlüssel nie im Ergebnis', async () => {
    const sb = await fakeSupabase(() => ({ status: 500, json: { message: `bad key ${SERVICE_KEY}` } }));
    try {
      const dump = JSON.stringify(await uploadImage(png(), 'image/png'));
      assert.equal(dump.includes(SERVICE_KEY), false);
    } finally {
      await sb.close();
    }
  });

  test('nimmt einen anderen Eimer aus der Umgebung', async () => {
    const sb = await fakeSupabase(() => ({ status: 200 }));
    process.env['SUPABASE_STORAGE_BUCKET'] = 'karten';
    try {
      const res = await uploadImage(png(), 'image/png');
      assert.equal(res.ok, true);
      if (!res.ok) return;
      assert.match(res.url, /\/public\/karten\//);
    } finally {
      await sb.close();
    }
  });
});
