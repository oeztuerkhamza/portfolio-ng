import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { ALLERGENS, buildOrder, parseTags, tagsText, demoMenu, localize, menuData, menuText, newTableToken, parseMenuText, priceCents, renderMenu, type Menu } from './menus';

/**
 * Tests der Kunden-Speisekarten (/m/<slug>). Der Inhalt kommt aus der
 * Datenbank und landet direkt in HTML — die Maskierung ist das Wichtigste.
 * Ausführen mit `npm run test:server`.
 */

const SRC = `# Vorspeisen | kalt & warm
Tomatensuppe | 6,50 | mit Basilikum
Bruschetta | 7,00

# Hauptgerichte
Schnitzel | 16,90 | mit Pommes | und Salat
Ohne Preis`;

describe('parseMenuText', () => {
  test('Rubriken, Gerichte, Preis und Beschreibung', () => {
    const cats = parseMenuText(SRC);
    assert.equal(cats.length, 2);
    assert.deepEqual(cats[0], {
      title: 'Vorspeisen',
      note: 'kalt & warm',
      items: [
        { name: 'Tomatensuppe', price: '6,50', desc: 'mit Basilikum' },
        { name: 'Bruschetta', price: '7,00', desc: undefined },
      ],
    });
    assert.equal(cats[1]!.items[0]!.desc, 'mit Pommes | und Salat');
    assert.deepEqual(cats[1]!.items[1], { name: 'Ohne Preis', price: undefined, desc: undefined });
  });

  test('Zeilen vor der ersten Rubrik fallen weg', () => {
    assert.deepEqual(parseMenuText('Verirrt | 1\n# A\nB | 2'), [{ title: 'A', note: undefined, items: [{ name: 'B', price: '2', desc: undefined }] }]);
  });

  test('Foto als letzte https-Spalte', () => {
    const [cat] = parseMenuText('# A\nSchäufele | 14,80 | mit Brägele | https://x.de/a.jpg\nKäsespätzle | 12,80 | https://x.de/b.jpg\nNur Text | 1 | siehe https://x.de');
    assert.equal(cat!.items[0]!.img, 'https://x.de/a.jpg');
    assert.equal(cat!.items[0]!.desc, 'mit Brägele');
    assert.equal(cat!.items[1]!.img, 'https://x.de/b.jpg');
    assert.equal(cat!.items[1]!.desc, undefined);
    assert.equal(cat!.items[2]!.img, undefined);
    const once = menuText([cat!]);
    assert.deepEqual(parseMenuText(once)[0], cat);
  });

  test('Text → Karte → Text bleibt stabil', () => {
    const once = menuText(parseMenuText(SRC));
    assert.equal(menuText(parseMenuText(once)), once);
  });
});

describe('menuData', () => {
  test('ohne Namen keine Karte', () => {
    assert.equal(menuData({ categories: [] }), null);
    assert.equal(menuData(null), null);
  });

  test('verwirft unsichere Adressen und ungültige Telefonnummern', () => {
    const d = menuData({ name: 'X', logoUrl: 'javascript:alert(1)', reviewUrl: 'http://x.de', phone: 'abc', email: 'kein-mail' })!;
    assert.equal(d.logoUrl, undefined);
    assert.equal(d.reviewUrl, undefined);
    assert.equal(d.phone, undefined);
    assert.equal(d.email, undefined);
    assert.equal(menuData({ name: 'X', reviewUrl: 'https://breisgaudigital.de/r/x' })!.reviewUrl, 'https://breisgaudigital.de/r/x');
  });

  test('Rubriken ohne Titel und Gerichte ohne Namen fallen weg', () => {
    const d = menuData({ name: 'X', categories: [{ title: '', items: [] }, { title: 'A', items: [{ name: '' }, { name: 'B' }] }] })!;
    assert.equal(d.categories.length, 1);
    assert.equal(d.categories[0]!.items.length, 1);
  });
});

const menu = (over: Partial<Menu['data']> = {}, preview = false): Menu => ({
  slug: 'sichelschmiede',
  lang: 'de',
  theme: 'warm',
  preview,
  data: menuData({ name: 'Sichelschmiede', tagline: 'Speisekarte', categories: parseMenuText(SRC), ...over })!,
});

describe('renderMenu', () => {
  test('zeigt Name, Rubriken, Gerichte und Preise', () => {
    const html = renderMenu(menu(), 'https://breisgaudigital.de');
    for (const s of ['Sichelschmiede', 'Vorspeisen', 'Tomatensuppe', '6,50', 'Hauptgerichte', 'href="#k2"']) assert.ok(html.includes(s), s);
    assert.ok(!html.includes('menu-order'));
  });

  test('maskiert Inhalt aus der Datenbank', () => {
    const html = renderMenu(menu({ name: '<script>x</script>' }));
    assert.ok(!html.includes('<script>x'));
    assert.ok(html.includes('&lt;script&gt;'));
  });

  test('Bewertungsknopf nur mit gültiger Adresse', () => {
    assert.ok(renderMenu(menu({ reviewUrl: 'https://breisgaudigital.de/r/x' })).includes('Bewerten Sie uns auf Google'));
    assert.ok(!renderMenu(menu()).includes('Bewerten Sie uns auf Google'));
  });

  test('leere Karte und Vorschau', () => {
    const html = renderMenu(menu({ categories: [] }, true));
    assert.ok(html.includes('wird gerade vorbereitet'));
    assert.ok(html.includes('role="status"'));
  });

  test('Gerichtfoto nur mit https-Adresse', () => {
    const html = renderMenu(menu({ categories: [{ title: 'A', items: [{ name: 'X', img: 'https://x.de/a.jpg' }, { name: 'Y', img: 'javascript:1' }] }] }));
    assert.ok(html.includes('src="https://x.de/a.jpg"'));
    assert.ok(!html.includes('javascript:1'));
  });

  test('noindex', () => {
    assert.ok(renderMenu(menu()).includes('noindex'));
  });
});

describe('demoMenu', () => {
  test('Beispielkarte ist gültig, mit Fotos auf der eigenen Domain', () => {
    const m = demoMenu('https://breisgau-digital.de');
    assert.equal(menuData(m.data)?.categories.length, m.data.categories.length);
    const html = renderMenu(m, 'https://breisgau-digital.de');
    assert.ok(html.includes('src="https://breisgau-digital.de/demo-menu/suppe.svg"'));
    assert.ok(html.includes('alle Gerichte und Preise sind erfunden'));
  });
});

describe('Übersetzungen', () => {
  const base = menuData({
    name: 'Test',
    translations: { en: '# Starters\nTomato soup | 99 | with basil' },
    categories: parseMenuText('# Vorspeisen\nTomatensuppe | 6,50 | mit Basilikum | https://x.de/s.jpg\nBrot | 2,00'),
  })!;

  test('Texte aus der Übersetzung, Preis und Foto vom Original', () => {
    const [cat] = localize(base, 'en');
    assert.equal(cat!.title, 'Starters');
    assert.equal(cat!.items[0]!.name, 'Tomato soup');
    assert.equal(cat!.items[0]!.price, '6,50');
    assert.equal(cat!.items[0]!.img, 'https://x.de/s.jpg');
  });

  test('fehlende Zeilen bleiben im Original', () => {
    assert.equal(localize(base, 'en')[0]!.items[1]!.name, 'Brot');
    assert.deepEqual(localize(base, 'tr'), base.categories);
  });

  test('?l= wählt nur angebotene Sprachen', () => {
    const menu: Menu = { slug: 'x', lang: 'de', theme: 'warm', preview: false, data: base };
    assert.match(renderMenu(menu, '', { lang: 'en' }), /Tomato soup/);
    assert.match(renderMenu(menu, '', { lang: 'tr' }), /Tomatensuppe/);
    assert.match(renderMenu(menu, '', { lang: '<script>' }), /Tomatensuppe/);
    assert.match(renderMenu(menu), /hreflang="en"/);
  });
});

describe('Bestellen am Tisch', () => {
  const data = menuData({
    name: 'Test',
    categories: parseMenuText('# A\nSuppe | 6,50\nSchäufele | 21,90 | mit Brägele\nWein | 0,2 l 4,80'),
  })!;
  const menu: Menu = { slug: 'x', lang: 'de', theme: 'warm', preview: false, data };

  test('Preise in Cent; unklare Preise ergeben keine Summe', () => {
    assert.equal(priceCents('21,90'), 2190);
    assert.equal(priceCents('7'), 700);
    assert.equal(priceCents('5,5 €'), 550);
    assert.equal(priceCents('ab 12'), null);
    assert.equal(priceCents('0,2 l 4,80'), null);
    assert.equal(priceCents(undefined), null);
  });

  test('gültige Bestellung: Preise von der Karte, nicht vom Gast', () => {
    const o = buildOrder(data, { items: [{ name: 'Suppe', qty: 2, price: '0,01' }, { name: 'Schäufele', qty: 1 }], note: ' ohne Zwiebeln ' })!;
    assert.deepEqual(o.lines, [{ name: 'Suppe', price: '6,50', qty: 2 }, { name: 'Schäufele', price: '21,90', qty: 1 }]);
    assert.equal(o.totalCents, 2 * 650 + 2190);
    assert.equal(o.note, 'ohne Zwiebeln');
    assert.equal(buildOrder(data, { items: [{ name: 'Wein', qty: 1 }] })!.totalCents, null);
  });

  test('abgelehnt: unbekanntes Gericht, doppelt, Menge, leer, zu viel', () => {
    assert.equal(buildOrder(data, { items: [{ name: 'Pizza', qty: 1 }] }), null);
    assert.equal(buildOrder(data, { items: [{ name: 'Suppe', qty: 1 }, { name: 'Suppe', qty: 1 }] }), null);
    for (const qty of [0, -1, 1.5, 21, '2', null]) assert.equal(buildOrder(data, { items: [{ name: 'Suppe', qty }] }), null);
    assert.equal(buildOrder(data, { items: [] }), null);
    assert.equal(buildOrder(data, {}), null);
    assert.equal(buildOrder(data, null), null);
    assert.equal(buildOrder(data, { items: [{ name: 'Suppe', qty: 20 }, { name: 'Schäufele', qty: 20 }, { name: 'Wein', qty: 20 }, { name: 'Suppe', qty: 1 }] }), null);
  });

  test('Gesamtmenge ist begrenzt', () => {
    assert.equal(buildOrder(data, { items: [{ name: 'Suppe', qty: 20 }, { name: 'Schäufele', qty: 20 }, { name: 'Wein', qty: 20 }] })!.lines.length, 3);
    assert.equal(buildOrder(data, { items: [{ name: 'Suppe', qty: 20 }, { name: 'Schäufele', qty: 20 }, { name: 'Wein', qty: 20 }, { name: 'X', qty: 1 }] }), null);
  });

  test('Bestell-Knöpfe nur mit Tischkürzel und nicht in der Vorschau', () => {
    assert.doesNotMatch(renderMenu(menu), /class="add"|menu-order/);
    const html = renderMenu(menu, '', { table: { label: '5', token: 'abc' } });
    assert.match(html, /class="add"/);
    assert.match(html, /menu-order/);
    assert.doesNotMatch(renderMenu({ ...menu, preview: true }, '', { table: { label: '5', token: 'abc' } }), /class="add"/);
  });

  test('Tischname und Kürzel werden maskiert', () => {
    const html = renderMenu(menu, '', { table: { label: '<img src=x onerror=1>', token: '</script><b>' } });
    assert.doesNotMatch(html, /<img src=x/);
    assert.doesNotMatch(html, /<\/script><b>/);
  });

  test('Tischkürzel sind lang und verschieden', () => {
    const a = newTableToken();
    assert.ok(a.length >= 20);
    assert.notEqual(a, newTableToken());
    assert.match(a, /^[A-Za-z0-9_-]+$/);
  });
});

describe('Ernährung und Allergene', () => {
  test('Angaben in eckigen Klammern', () => {
    assert.deepEqual(parseTags('[vegetarisch; Milch, Eier, Gluten]'), { diet: 'vegetarian', allergens: ['gluten', 'eier', 'milch'] });
    assert.deepEqual(parseTags('[vegan]'), { diet: 'vegan' });
    assert.deepEqual(parseTags('[keine]'), { allergens: [] });
    assert.deepEqual(parseTags('[vegan; vegetarisch]'), { diet: 'vegan' });
    assert.deepEqual(parseTags('[Erdnüsse, Schalenfrüchte, Unsinn]'), { allergens: ['erdnuesse', 'schalenfruechte'] });
    assert.deepEqual(parseTags('[]'), {});
  });

  test('Text → Karte → Text bleibt stabil, mit Foto', () => {
    const src = '# A\nSuppe | 5,00 | mit Brot | [vegetarisch; gluten] | https://x.de/s.jpg\nWasser | 2,00 | | [vegan; keine]\nNur Preis | 3,00\nOhne Preis | | | [milch]';
    const [cat] = parseMenuText(src);
    assert.deepEqual(cat!.items[0], { name: 'Suppe', price: '5,00', desc: 'mit Brot', img: 'https://x.de/s.jpg', diet: 'vegetarian', allergens: ['gluten'] });
    assert.deepEqual(cat!.items[1]!.allergens, []);
    assert.equal(cat!.items[2]!.allergens, undefined);
    assert.deepEqual(cat!.items[3]!.allergens, ['milch']);
    const again = parseMenuText(menuText([cat!]));
    assert.deepEqual(again[0], cat);
    assert.equal(tagsText({}), '');
  });

  test('menuData übernimmt nur bekannte Werte', () => {
    const data = menuData({ name: 'T', categories: [{ title: 'A', items: [{ name: 'X', diet: 'vegan', allergens: ['gluten', 'quatsch'] }, { name: 'Y', diet: 'bio' }] }] })!;
    assert.equal(data.categories[0]!.items[0]!.diet, 'vegan');
    assert.deepEqual(data.categories[0]!.items[0]!.allergens, ['gluten']);
    assert.equal(data.categories[0]!.items[1]!.diet, undefined);
    assert.equal(data.categories[0]!.items[1]!.allergens, undefined);
    assert.equal(ALLERGENS.length, 14);
  });

  test('Filterleiste nur, wenn Angaben da sind; Gerichte tragen ihre Angaben', () => {
    const plain = renderMenu({ slug: 'x', lang: 'de', theme: 'warm', preview: false, data: menuData({ name: 'T', categories: parseMenuText('# A\nX | 1') })! });
    assert.doesNotMatch(plain, /class="filters"|FILTER|data-f=/);
    const tagged = renderMenu({ slug: 'x', lang: 'de', theme: 'warm', preview: false, data: menuData({ name: 'T', categories: parseMenuText('# A\nX | 1 | | [vegan; keine]\nY | 2 | | [milch, gluten]\nZ | 3') })! });
    assert.match(tagged, /class="filters"/);
    assert.match(tagged, /data-f="vegan"/);
    assert.match(tagged, /data-d="vegan" data-a=""/);
    assert.match(tagged, /data-a="gluten milch"/);
    assert.match(tagged, /Enthält: Gluten, Milch/);
    assert.match(tagged, /value="gluten"/);
    // Z hat keine Angaben: kein data-a, damit der Filter es nie als „ohne Allergen" zeigt
    assert.ok(/<li><div class="txt"><div class="row"><span class="name">Z/.test(tagged));
  });

  test('nur Ernährung angegeben: keine Allergen-Auswahl', () => {
    const html = renderMenu({ slug: 'x', lang: 'de', theme: 'warm', preview: false, data: menuData({ name: 'T', categories: parseMenuText('# A\nX | 1 | | [vegan]') })! });
    assert.match(html, /data-f="vegetarian"/);
    assert.doesNotMatch(html, /class="al"/);
  });

  test('Demo-Karte zeigt die Filter', () => {
    const html = renderMenu(demoMenu('https://x.de'));
    assert.match(html, /class="filters"/);
    assert.match(html, /ohne Sulfite/);
  });
});
