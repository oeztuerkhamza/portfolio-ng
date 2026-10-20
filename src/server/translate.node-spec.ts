import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import type Anthropic from '@anthropic-ai/sdk';
import { MAX_ITEMS, TranslateFailure, parseTranslateRequest, setTranslateClient, translateTexts } from './translate';

/**
 * Tests der Übersetzung für die Einladungen.
 *
 * Es geht kein Byte nach draußen: statt des Claude-Clients steht ein
 * Stellvertreter da, der die Anfrage mitschreibt und eine feste Antwort gibt.
 * Ausführen mit `npm run test:server`.
 */

type Reply = { stop_reason: string; parsed_output: unknown } | Error;

function fakeClient(reply: Reply) {
  const calls: Record<string, unknown>[] = [];
  const client = {
    beta: {
      messages: {
        parse: async (params: Record<string, unknown>) => {
          calls.push(params);
          if (reply instanceof Error) throw reply;
          return reply;
        },
      },
    },
  } as unknown as Anthropic;
  setTranslateClient(client);
  return calls;
}

afterEach(() => setTranslateClient(null));

const code = async (p: Promise<unknown>) => {
  try {
    await p;
    return 'ok';
  } catch (err) {
    return err instanceof TranslateFailure ? err.code : String(err);
  }
};

describe('parseTranslateRequest', () => {
  test('nimmt Quelle, Ziele und Texte', () => {
    const r = parseTranslateRequest({ source: 'de', targets: ['tr', 'en', 'tr', 'de', 'xx'], items: [{ id: 'welcome', text: ' Hallo ' }, { id: 'x', text: '' }] });
    assert.equal(r.source, 'de');
    assert.deepEqual(r.targets, ['tr', 'en']);
    assert.deepEqual(r.items, [{ id: 'welcome', text: 'Hallo' }]);
  });
  test('ohne Ziel oder Text ist die Anfrage ungültig', () => {
    assert.throws(() => parseTranslateRequest({ source: 'de', targets: ['de'], items: [{ id: 'a', text: 'b' }] }), /invalid/);
    assert.throws(() => parseTranslateRequest({ source: 'de', targets: ['tr'], items: [] }), /invalid/);
    assert.throws(() => parseTranslateRequest({ source: 'xx', targets: ['tr'], items: [{ id: 'a', text: 'b' }] }), /invalid/);
  });
  test('Grenzen für Anzahl und Länge', () => {
    const many = Array.from({ length: MAX_ITEMS + 1 }, (_, i) => ({ id: `i${i}`, text: 'x' }));
    assert.throws(() => parseTranslateRequest({ source: 'de', targets: ['tr'], items: many }), /too_long/);
    assert.throws(() => parseTranslateRequest({ source: 'de', targets: ['tr'], items: [{ id: 'a', text: 'x'.repeat(200) }] }, { items: 5, chars: 100 }), /too_long/);
  });
});

describe('translateTexts', () => {
  test('ohne Schlüssel keine Anfrage', async () => {
    const saved = process.env['ANTHROPIC_API_KEY'];
    delete process.env['ANTHROPIC_API_KEY'];
    try {
      assert.equal(await code(translateTexts('de', ['tr'], [{ id: 'a', text: 'Hallo' }])), 'translate_not_configured');
    } finally {
      if (saved !== undefined) process.env['ANTHROPIC_API_KEY'] = saved;
    }
  });

  test('übernimmt nur angefragte ids und Sprachen', async () => {
    const calls = fakeClient({
      stop_reason: 'end_turn',
      parsed_output: {
        items: [
          { id: 'welcome', translations: [{ lang: 'tr', text: 'Hoş geldiniz' }, { lang: 'en', text: 'Welcome' }, { lang: 'fr', text: 'Bienvenue' }] },
          { id: 'fremd', translations: [{ lang: 'tr', text: 'x' }] },
          { id: 'story', translations: [{ lang: 'tr', text: '  ' }] },
        ],
      },
    });
    const out = await translateTexts('de', ['tr', 'en'], [{ id: 'welcome', text: 'Willkommen' }, { id: 'story', text: 'Geschichte' }]);
    assert.deepEqual(out, { welcome: { tr: 'Hoş geldiniz', en: 'Welcome' } });

    // Die Anfrage: aktuelles Modell, Fallback bei Ablehnung, Texte als JSON.
    const req = calls[0] as { model: string; fallbacks: string; betas: string[]; messages: { content: string }[] };
    assert.equal(req.model, 'claude-opus-5-5');
    assert.equal(req.fallbacks, 'default');
    assert.ok(req.betas.includes('server-side-fallback-2026-07-01'));
    const body = JSON.parse(req.messages[0].content);
    assert.equal(body.items.length, 2);
    assert.deepEqual(body.targets.map((t: { code: string }) => t.code), ['tr', 'en']);
  });

  test('Ablehnung oder abgeschnittene Antwort gilt als Fehler', async () => {
    fakeClient({ stop_reason: 'refusal', parsed_output: null });
    assert.equal(await code(translateTexts('de', ['tr'], [{ id: 'a', text: 'Hallo' }])), 'translate_failed');
    fakeClient({ stop_reason: 'max_tokens', parsed_output: null });
    assert.equal(await code(translateTexts('de', ['tr'], [{ id: 'a', text: 'Hallo' }])), 'translate_failed');
  });

  test('Netz- oder API-Fehler werden zu translate_failed, ohne zu werfen', async () => {
    fakeClient(new Error('ECONNRESET'));
    assert.equal(await code(translateTexts('de', ['tr'], [{ id: 'a', text: 'Hallo' }])), 'translate_failed');
  });
});
