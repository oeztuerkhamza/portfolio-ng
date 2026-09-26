import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { draftCards } from './api';

/**
 * Aus einer bezahlten Bestellung werden Kartenentwürfe.
 *
 * Das ist die Stelle, an der Geld in Arbeit übergeht: bestellt jemand drei
 * Karten und es entsteht eine, fehlen zwei bezahlte Karten. Darum wird hier
 * ohne Datenbank geprüft — mit einem Stellvertreter, der sich wie Postgres
 * verhält, `on conflict do nothing` eingeschlossen.
 * Ausführen mit `npm run test:server`.
 */

interface Query {
  text: string;
  params: unknown[];
}

/**
 * Stellvertreter für die Datenbank. `insert into cards` verhält sich wie mit
 * `unique (slug)` und `on conflict do nothing`: ein schon vergebener
 * Kurzname gibt keine Zeile zurück.
 *
 * `reserve` nimmt Kurznamen vorweg — damit lässt sich ein Zusammenstoß
 * erzwingen, ohne auf den Zufall zu warten.
 */
function fakeSql(opts: { reserve?: (slug: string) => boolean } = {}) {
  const queries: Query[] = [];
  const slugs: string[] = [];
  const sql = ((strings: TemplateStringsArray, ...params: unknown[]) => {
    const text = strings.join('?');
    queries.push({ text, params });
    if (/insert into cards/.test(text)) {
      const slug = String(params[0]);
      if (slugs.includes(slug) || opts.reserve?.(slug)) return Promise.resolve([]);
      slugs.push(slug);
      return Promise.resolve([{ id: `card-${slugs.length}` }]);
    }
    return Promise.resolve([]);
  }) as unknown as Parameters<typeof draftCards>[0] & { json: (v: unknown) => unknown };
  (sql as unknown as { json: (v: unknown) => unknown }).json = (v: unknown) => v;
  return { sql, queries, slugs, inserts: () => queries.filter((q) => /insert into cards/.test(q.text)) };
}

const order = (items: unknown[], over: Record<string, unknown> = {}) => ({
  id: 'order-1',
  items,
  business_name: 'Café Krone',
  lang: 'de',
  ...over,
});

/** Felder eines insert: (slug, kind, lang, data, label, order_id). */
const fields = (q: Query) => ({
  slug: String(q.params[0]),
  kind: String(q.params[1]),
  lang: String(q.params[2]),
  data: q.params[3] as Record<string, unknown>,
  label: q.params[4],
  orderId: q.params[5],
});

describe('draftCards', () => {
  test('legt für eine bestellte Firmenkarte genau einen Entwurf an', async () => {
    const db = fakeSql();
    const made = await draftCards(db.sql, order([{ key: 'card.business', qty: 1 }]));
    assert.equal(made, 1);
    assert.equal(db.inserts().length, 1);

    const f = fields(db.inserts()[0]);
    assert.equal(f.kind, 'business');
    assert.equal(f.lang, 'de');
    assert.equal(f.label, 'Café Krone');
    assert.equal(f.orderId, 'order-1');
    // Der Name aus der Bestellung steht schon auf der Karte.
    assert.equal(f.data['company'], 'Café Krone');
    assert.match(f.slug, /^cafe-krone-[a-z0-9]{1,8}$/);
  });

  test('schaltet die Karte nicht scharf — erst wird sie gefüllt', async () => {
    const db = fakeSql();
    await draftCards(db.sql, order([{ key: 'card.business', qty: 1 }]));
    assert.match(db.inserts()[0].text, /active\)/);
    assert.match(db.inserts()[0].text, /false\)/);
  });

  test('legt für eine Geschenkkarte eine Überschrift an, keinen Firmennamen', async () => {
    const db = fakeSql();
    await draftCards(db.sql, order([{ key: 'card.gift', qty: 1 }]));
    const f = fields(db.inserts()[0]);
    assert.equal(f.kind, 'gift');
    assert.ok(f.data['headline'], 'Geschenkkarte braucht eine Überschrift');
    assert.equal(f.data['company'], undefined);
  });

  test('legt bei drei bestellten Karten drei Entwürfe mit eigenen Kurznamen an', async () => {
    const db = fakeSql();
    const made = await draftCards(db.sql, order([{ key: 'card.business', qty: 3 }]));
    assert.equal(made, 3);
    assert.equal(new Set(db.slugs).size, 3);
  });

  test('rührt Bewertungskarten nicht an', async () => {
    const db = fakeSql();
    const made = await draftCards(
      db.sql,
      order([
        { key: 'form.karte', qty: 5 },
        { key: 'pkg.team', qty: 1 },
      ]),
    );
    assert.equal(made, 0);
    assert.equal(db.inserts().length, 0);
  });

  test('nimmt aus einer gemischten Bestellung nur die Karten', async () => {
    const db = fakeSql();
    const made = await draftCards(
      db.sql,
      order([
        { key: 'form.karte', qty: 2 },
        { key: 'card.business', qty: 1 },
        { key: 'card.gift', qty: 2 },
      ]),
    );
    assert.equal(made, 3);
    assert.deepEqual(
      db.inserts().map((q) => fields(q).kind),
      ['business', 'gift', 'gift'],
    );
  });

  test('übernimmt die Sprache der Bestellung', async () => {
    const db = fakeSql();
    await draftCards(db.sql, order([{ key: 'card.business', qty: 1 }], { lang: 'tr' }));
    assert.equal(fields(db.inserts()[0]).lang, 'tr');
  });

  test('nimmt keine Sprache, die die Spaltenprüfung ablehnen würde', async () => {
    // Sonst würde die Zeile abgewiesen und eine bezahlte Karte verschwinden.
    for (const lang of ['klingonisch', '', null, undefined, 42, 'DE']) {
      const db = fakeSql();
      const made = await draftCards(db.sql, order([{ key: 'card.business', qty: 1 }], { lang }));
      assert.equal(made, 1, `Sprache „${String(lang)}" darf die Karte nicht verschlucken`);
      assert.equal(fields(db.inserts()[0]).lang, 'de');
    }
  });

  test('kommt ohne Namen des Betriebs aus', async () => {
    const db = fakeSql();
    const made = await draftCards(db.sql, order([{ key: 'card.business', qty: 1 }], { business_name: null }));
    assert.equal(made, 1);
    const f = fields(db.inserts()[0]);
    assert.match(f.slug, /^karte-[a-z0-9]{1,8}$/);
    assert.equal(f.label, null);
    // Ohne Firmennamen wäre der Inhalt ungültig — ein Platzhalter muss her.
    assert.ok(f.data['company'], 'Firmenkarte ohne company wäre kein gültiger Inhalt');
  });

  test('sucht einen neuen Kurznamen, wenn der erste schon vergeben ist', async () => {
    let first = true;
    const db = fakeSql({
      reserve: () => {
        // Nur der allererste Versuch stößt zusammen.
        if (!first) return false;
        first = false;
        return true;
      },
    });
    const made = await draftCards(db.sql, order([{ key: 'card.business', qty: 1 }]));
    assert.equal(made, 1, 'ein Zusammenstoß darf die Karte nicht verschlucken');
    assert.equal(db.inserts().length, 2, 'zweiter Versuch mit neuem Anhang');
  });

  test('gibt nach mehreren Zusammenstößen auf, statt endlos zu drehen', async () => {
    const db = fakeSql({ reserve: () => true });
    const made = await draftCards(db.sql, order([{ key: 'card.business', qty: 1 }]));
    assert.equal(made, 0);
    assert.ok(db.inserts().length <= 5, `höchstens fünf Versuche, waren: ${db.inserts().length}`);
  });

  test('nimmt keine unsinnigen Stückzahlen an', async () => {
    const db = fakeSql();
    // Mehr als der Shop zulässt, Bruchzahlen, Negatives, Unsinn.
    const made = await draftCards(
      db.sql,
      order([
        { key: 'card.business', qty: 999 },
        { key: 'card.gift', qty: -3 },
        { key: 'card.gift', qty: 2.7 },
        { key: 'card.gift', qty: 'viele' as unknown as number },
      ]),
    );
    assert.equal(made, 22, '20 (gedeckelt) + 0 + 2 (abgerundet) + 0');
  });

  test('kommt mit einer Bestellung ohne Positionen aus', async () => {
    const db = fakeSql();
    assert.equal(await draftCards(db.sql, order([])), 0);
    assert.equal(await draftCards(db.sql, { id: 'o', items: null }), 0);
    assert.equal(await draftCards(db.sql, { id: 'o' }), 0);
    assert.equal(db.inserts().length, 0);
  });

  test('lässt sich von einer kaputten Position nicht aus der Bahn werfen', async () => {
    const db = fakeSql();
    const made = await draftCards(db.sql, order([null, {}, { key: null }, { key: 'card.business', qty: 1 }]));
    assert.equal(made, 1);
  });
});
