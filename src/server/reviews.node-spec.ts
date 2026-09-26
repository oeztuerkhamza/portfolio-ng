import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import { REVIEW_LIMIT, fetchReviews, parseReview } from './reviews';

/**
 * Tests der Google-Bewertungen.
 *
 * Zwei Dinge sind hier wichtiger als alles andere, und beide sind der Grund,
 * warum überhaupt auf dem Server geholt wird:
 *
 *   * Der Schlüssel darf nirgends herauskommen — nicht im Fehlertext, nicht
 *     im Auszug der Antwort, nicht über eine Ausnahme.
 *   * Ohne Schlüssel oder ohne Place ID darf **keine** Anfrage rausgehen.
 *
 * Es geht dabei kein Byte nach draußen: `fetch` wird ersetzt.
 * Ausführen mit `npm run test:server`.
 */

const KEY = 'AIzaSyTESTKEY_nicht_echt_1234567890';

interface Call {
  url: string;
  headers: Record<string, string>;
}

/** `fetch` ersetzen und die Anfragen mitschreiben. */
function fakeGoogle(...replies: { status?: number; body: unknown }[]) {
  const calls: Call[] = [];
  const real = globalThis.fetch;
  let n = 0;
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), headers: (init?.headers ?? {}) as Record<string, string> });
    const reply = replies[Math.min(n++, replies.length - 1)] ?? { status: 500, body: {} };
    const body = typeof reply.body === 'string' ? reply.body : JSON.stringify(reply.body);
    return {
      ok: (reply.status ?? 200) < 400,
      status: reply.status ?? 200,
      text: async () => body,
    } as Response;
  }) as typeof fetch;
  return { calls, restore: () => void (globalThis.fetch = real) };
}

/** `fetch`, das wirft — so sieht ein Netzfehler aus. */
function brokenGoogle(message: string) {
  const calls: Call[] = [];
  const real = globalThis.fetch;
  globalThis.fetch = (async (url: string | URL | Request) => {
    calls.push({ url: String(url), headers: {} });
    throw new Error(message);
  }) as typeof fetch;
  return { calls, restore: () => void (globalThis.fetch = real) };
}

afterEach(() => delete process.env['GOOGLE_API_KEY']);

const PLACE = 'ChIJN1t_tDeuEmsRUsoyG83frY4';

/** Eine Bewertung in der Schreibweise der Places API (New). */
const newReview = (over: Record<string, unknown> = {}) => ({
  name: 'places/ChIJxyz/reviews/Chdrev1',
  rating: 5,
  text: { text: 'Sehr freundlich und schnell.', languageCode: 'de' },
  authorAttribution: { displayName: 'Sabine W.' },
  publishTime: '2026-08-01T10:00:00Z',
  relativePublishTimeDescription: 'vor 2 Monaten',
  ...over,
});

/** Dieselbe Bewertung in der Schreibweise der älteren Places API. */
const oldReview = (over: Record<string, unknown> = {}) => ({
  author_name: 'Sabine W.',
  rating: 5,
  text: 'Sehr freundlich und schnell.',
  time: 1_785_000_000,
  relative_time_description: 'vor 2 Monaten',
  language: 'de',
  ...over,
});

describe('parseReview', () => {
  test('liest die Schreibweise der Places API (New)', () => {
    const r = parseReview(newReview());
    assert.equal(r?.author, 'Sabine W.');
    assert.equal(r?.rating, 5);
    assert.equal(r?.text, 'Sehr freundlich und schnell.');
    assert.equal(r?.lang, 'de');
    assert.equal(r?.publishedLabel, 'vor 2 Monaten');
    assert.equal(r?.publishedAt, '2026-08-01T10:00:00.000Z');
    // Googles eigene Kennung, damit dieselbe Bewertung nicht zweimal ankommt.
    assert.equal(r?.externalId, 'places/ChIJxyz/reviews/Chdrev1');
  });

  test('liest die Schreibweise der älteren Places API', () => {
    const r = parseReview(oldReview());
    assert.equal(r?.author, 'Sabine W.');
    assert.equal(r?.text, 'Sehr freundlich und schnell.');
    assert.equal(r?.lang, 'de');
    // Sekunden seit 1970, nicht Millisekunden.
    assert.equal(r?.publishedAt, new Date(1_785_000_000_000).toISOString());
  });

  test('baut ohne Googles Kennung eine aus Verfasser und Zeitpunkt', () => {
    const r = parseReview(oldReview());
    assert.equal(r?.externalId, `Sabine W.|${new Date(1_785_000_000_000).toISOString()}`);
  });

  test('nimmt die Übersetzung, wenn kein Originaltext dabei ist', () => {
    const r = parseReview(newReview({ text: { text: 'Very friendly.', languageCode: 'en' } }));
    assert.equal(r?.text, 'Very friendly.');
    assert.equal(r?.lang, 'en');
  });

  test('fällt auf den Originaltext zurück, wenn der übersetzte fehlt', () => {
    const r = parseReview(newReview({ text: {}, originalText: { text: 'Çok ilgili.' } }));
    assert.equal(r?.text, 'Çok ilgili.');
  });

  test('nimmt eine Bewertung ohne Text — Sterne allein sind auch eine', () => {
    const r = parseReview(newReview({ text: undefined }));
    assert.equal(r?.text, '');
    assert.equal(r?.rating, 5);
  });

  test('verwirft, was keinen Verfasser hat', () => {
    assert.equal(parseReview(newReview({ authorAttribution: {} })), null);
    assert.equal(parseReview(oldReview({ author_name: '   ' })), null);
  });

  test('verwirft Noten außerhalb von 1 bis 5', () => {
    assert.equal(parseReview(newReview({ rating: 0 })), null);
    assert.equal(parseReview(newReview({ rating: 6 })), null);
    assert.equal(parseReview(newReview({ rating: undefined })), null);
    assert.equal(parseReview(newReview({ rating: 'gut' })), null);
  });

  test('rundet eine gebrochene Note auf einen Stern', () => {
    assert.equal(parseReview(newReview({ rating: 4.6 }))?.rating, 5);
    assert.equal(parseReview(newReview({ rating: 4.2 }))?.rating, 4);
  });

  test('kürzt den Text des Gastes nicht — Google verlangt ihn unverändert', () => {
    const long = 'a'.repeat(1200);
    assert.equal(parseReview(newReview({ text: { text: long } }))?.text, long);
    // Die alte Schreibweise liefert ihn als Zeichenkette; gleiche Regel.
    assert.equal(parseReview(oldReview({ text: long }))?.text, long);
    assert.equal(parseReview(newReview({ text: {}, originalText: { text: long } }))?.text, long);
  });

  test('lässt eine unlesbare Zeitangabe weg, statt zu raten', () => {
    assert.equal(parseReview(newReview({ publishTime: 'neulich' }))?.publishedAt, null);
    assert.equal(parseReview(oldReview({ time: 'neulich' }))?.publishedAt, null);
  });

  test('verkraftet Unsinn, ohne zu werfen', () => {
    assert.equal(parseReview(null), null);
    assert.equal(parseReview('nein'), null);
    assert.equal(parseReview(42), null);
  });
});

describe('fetchReviews — ohne Schlüssel oder Place ID', () => {
  test('geht ohne Schlüssel gar nicht erst raus', async () => {
    const g = fakeGoogle({ body: {} });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, false);
      assert.match(res.error ?? '', /GOOGLE_API_KEY/);
      // Das ist der Punkt: keine Anfrage, kein Fehlschlag bei Google.
      assert.equal(g.calls.length, 0);
    } finally {
      g.restore();
    }
  });

  test('prüft die Place ID vor der Anfrage', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ body: {} });
    try {
      for (const bad of ['', '   ', 'zu kurz', 'ChIJ mit Leerzeichen', 'a'.repeat(300)]) {
        const res = await fetchReviews(bad);
        assert.equal(res.ok, false, bad);
        assert.match(res.error ?? '', /Place ID/);
      }
      assert.equal(g.calls.length, 0);
    } finally {
      g.restore();
    }
  });
});

describe('fetchReviews — die neue API', () => {
  test('holt Bewertungen, Note und Anzahl', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ body: { reviews: [newReview()], rating: 4.85, userRatingCount: 27 } });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, true);
      assert.equal(res.via, 'places-new');
      assert.equal(res.reviews.length, 1);
      assert.equal(res.reviews[0]?.author, 'Sabine W.');
      // Eine Stelle hinter dem Komma, wie Google die Note nennt.
      assert.equal(res.rating, 4.9);
      assert.equal(res.total, 27);
      assert.equal(res.error, undefined);
      assert.equal(g.calls.length, 1, 'die zweite Strecke bleibt unbenutzt');
    } finally {
      g.restore();
    }
  });

  test('schickt den Schlüssel im Kopf, nicht in der Adresse', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ body: { reviews: [newReview()], rating: 5, userRatingCount: 3 } });
    try {
      await fetchReviews(PLACE);
      const call = g.calls[0]!;
      assert.equal(call.headers['X-Goog-Api-Key'], KEY);
      assert.ok(!call.url.includes(KEY), 'der Schlüssel darf nicht in der Adresse stehen');
      // Ohne Feldmaske liefert die neue API keine Bewertungen.
      assert.match(call.headers['X-Goog-FieldMask'] ?? '', /reviews/);
      assert.match(call.url, /places\.googleapis\.com\/v1\/places\//);
    } finally {
      g.restore();
    }
  });

  test('fragt in der gewünschten Sprache', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ body: { reviews: [newReview()], rating: 5, userRatingCount: 3 } });
    try {
      await fetchReviews(PLACE, 'tr');
      assert.match(g.calls[0]?.url ?? '', /languageCode=tr/);
    } finally {
      g.restore();
    }
  });

  test('nimmt eine Note ohne Bewertungstexte an', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ body: { rating: 4.9, userRatingCount: 27 } });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, true);
      assert.equal(res.reviews.length, 0);
      assert.equal(res.rating, 4.9);
    } finally {
      g.restore();
    }
  });

  test('zählt dieselbe Bewertung nur einmal', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ body: { reviews: [newReview(), newReview()], rating: 5, userRatingCount: 2 } });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.reviews.length, 1);
    } finally {
      g.restore();
    }
  });

  test('nimmt nie mehr als REVIEW_LIMIT', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const many = Array.from({ length: REVIEW_LIMIT + 8 }, (_, i) =>
      newReview({ name: `places/x/reviews/r${i}`, authorAttribution: { displayName: `Gast ${i}` } }),
    );
    const g = fakeGoogle({ body: { reviews: many, rating: 5, userRatingCount: 99 } });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.reviews.length, REVIEW_LIMIT);
    } finally {
      g.restore();
    }
  });

  test('überspringt unbrauchbare Einträge, statt alles zu verwerfen', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({
      body: {
        reviews: [{ rating: 5 }, newReview(), null, newReview({ name: 'r2', rating: 0 })],
        rating: 5,
        userRatingCount: 4,
      },
    });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.reviews.length, 1);
      assert.equal(res.reviews[0]?.author, 'Sabine W.');
    } finally {
      g.restore();
    }
  });
});

describe('fetchReviews — Rückfall auf die ältere API', () => {
  test('versucht die alte Strecke, wenn der Schlüssel die neue nicht darf', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle(
      { status: 403, body: { error: { message: 'Places API (New) has not been used' } } },
      { body: { status: 'OK', result: { reviews: [oldReview()], rating: 4.8, user_ratings_total: 12 } } },
    );
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, true);
      assert.equal(res.via, 'places-legacy');
      assert.equal(res.reviews.length, 1);
      assert.equal(res.rating, 4.8);
      assert.equal(res.total, 12);
      assert.equal(g.calls.length, 2);
      assert.match(g.calls[1]?.url ?? '', /maps\.googleapis\.com/);
    } finally {
      g.restore();
    }
  });

  test('behält den Grund der letzten Strecke, wenn beide scheitern', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ status: 403, body: { error: 'nein' } }, { status: 400, body: { error: 'auch nein' } });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, false);
      assert.match(res.error ?? '', /400/);
      assert.match(res.error ?? '', /Place ID/);
      assert.deepEqual(res.reviews, []);
      assert.equal(res.rating, null);
      assert.equal(res.via, null);
    } finally {
      g.restore();
    }
  });

  test('erklärt eine 403 so, dass man weiß, wo man nachsieht', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ status: 403, body: { error: 'nein' } });
    try {
      const res = await fetchReviews(PLACE);
      assert.match(res.error ?? '', /403/);
      assert.match(res.error ?? '', /Console/);
    } finally {
      g.restore();
    }
  });

  test('erkennt den Fehler der alten API, die mit 200 antwortet', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle(
      { body: { reviews: [], rating: null } },
      { body: { status: 'REQUEST_DENIED', error_message: 'API project is not authorized' } },
    );
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, false);
      assert.match(res.error ?? '', /REQUEST_DENIED/);
    } finally {
      g.restore();
    }
  });

  test('sagt bei einer Antwort ohne Bewertungen, woran es liegt', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ body: {} });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, false);
      assert.match(res.error ?? '', /Feldfreigabe/);
    } finally {
      g.restore();
    }
  });

  test('unterscheidet unlesbare Antwort von nicht erreichbar', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ body: '<html>502 Bad Gateway</html>' });
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, false);
      assert.match(res.error ?? '', /nicht lesbar/);
      assert.match(res.detail ?? '', /Bad Gateway/);
    } finally {
      g.restore();
    }
  });

  /**
   * Die Regel dahinter: **jeder** Fehlschlag der ersten Strecke führt zur
   * zweiten. Sonst verschenkt ein Zwischenserver mit HTML-Fehlerseite die
   * Strecke, die funktioniert hätte.
   */
  test('gibt nach keinem Fehlschlag der ersten Strecke auf', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const legacyOk = { body: { status: 'OK', result: { reviews: [oldReview()], rating: 4.8, user_ratings_total: 12 } } };
    const firstFails: { was: string; reply: { status?: number; body: unknown } }[] = [
      { was: 'HTTP-Fehler', reply: { status: 403, body: { error: 'nein' } } },
      { was: 'kein JSON', reply: { body: '<html>502 Bad Gateway</html>' } },
      { was: 'Status im Rumpf', reply: { body: { status: 'REQUEST_DENIED' } } },
      { was: 'Antwort ohne alles', reply: { body: {} } },
    ];
    for (const { was, reply } of firstFails) {
      const g = fakeGoogle(reply, legacyOk);
      try {
        const res = await fetchReviews(PLACE);
        assert.equal(res.ok, true, was);
        assert.equal(res.via, 'places-legacy', was);
        assert.equal(g.calls.length, 2, was);
      } finally {
        g.restore();
      }
    }
  });

  test('nennt einen Netzfehler einen Netzfehler', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = brokenGoogle('getaddrinfo ENOTFOUND places.googleapis.com');
    try {
      const res = await fetchReviews(PLACE);
      assert.equal(res.ok, false);
      assert.match(res.error ?? '', /nicht erreichbar/);
      // Beide Strecken wurden versucht, bevor aufgegeben wurde.
      assert.equal(g.calls.length, 2);
    } finally {
      g.restore();
    }
  });
});

describe('fetchReviews — der Schlüssel bleibt drin', () => {
  test('ersetzt ihn im Auszug der Antwort', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ status: 400, body: { error: { message: `key=${KEY} ist ungültig` } } });
    try {
      const res = await fetchReviews(PLACE);
      assert.ok(!(res.detail ?? '').includes(KEY), 'der Schlüssel steckt im Auszug');
      assert.match(res.detail ?? '', /\[SCHLÜSSEL\]/);
    } finally {
      g.restore();
    }
  });

  test('ersetzt ihn auch in der Meldung einer Ausnahme', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    // Node hängt bei manchen Netzfehlern die ganze Adresse an — und in der
    // Adresse der alten API steht der Schlüssel.
    const g = brokenGoogle(`request to https://maps.googleapis.com/…&key=${KEY} failed`);
    try {
      const res = await fetchReviews(PLACE);
      assert.ok(!(res.detail ?? '').includes(KEY));
      assert.match(res.detail ?? '', /\[SCHLÜSSEL\]/);
    } finally {
      g.restore();
    }
  });

  test('steht in keinem Feld des Ergebnisses', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ status: 403, body: { error: { message: KEY, details: [{ key: KEY }] } } });
    try {
      const res = await fetchReviews(PLACE);
      assert.ok(!JSON.stringify(res).includes(KEY));
    } finally {
      g.restore();
    }
  });

  test('kürzt einen ausufernden Auszug', async () => {
    process.env['GOOGLE_API_KEY'] = KEY;
    const g = fakeGoogle({ status: 500, body: { error: 'x'.repeat(5000) } });
    try {
      const res = await fetchReviews(PLACE);
      assert.ok((res.detail ?? '').length <= 300, `Auszug ist ${res.detail?.length} Zeichen lang`);
    } finally {
      g.restore();
    }
  });
});
