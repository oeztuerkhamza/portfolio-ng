import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { ALLERGENS, buildOrder, hoursSpec, openAt, parseSteps, parseTags, tagsText, demoMenu, localize, menuData, menuText, newTableToken, parseMenuText, priceCents, renderMenu, type Menu } from './menus';

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

  test('Nummer vor dem Namen: „M4. Salat", „37. Musakka"', () => {
    const [c] = parseMenuText(['# Mittag', 'M4. Salata Spezial | 10,90 | mit Avocado', '37. Musakka | 20,90', '1/8 Wein | 5,50', 'Pide 2. Wahl | 9,00'].join('\n'));
    assert.deepEqual(c!.items.map((i) => [i.num, i.name]), [['M4', 'Salata Spezial'], ['37', 'Musakka'], [undefined, '1/8 Wein'], [undefined, 'Pide 2. Wahl']]);
    const text = menuText([c!]);
    assert.ok(text.includes('M4. Salata Spezial | 10,90'));
    assert.equal(menuText(parseMenuText(text)), text);
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

  test('zeigt die Nummer vor dem Namen, auch in einer Übersetzung', () => {
    const data = menuData({ name: 'X', translations: { en: '# Lunch\nSalad | 10,90' }, categories: [{ title: 'Mittag', items: [{ name: 'Salat', num: 'M1', price: '10,90' }, { name: 'Suppe', num: '<b>' }] }] })!;
    assert.equal(data.categories[0]!.items[0]!.num, 'M1');
    assert.equal(data.categories[0]!.items[1]!.num, undefined);
    const m: Menu = { slug: 'x', lang: 'de', theme: 'orient', preview: false, data };
    assert.ok(renderMenu(m, 'https://breisgaudigital.de').includes('<span class="num">M1</span>Salat'));
    assert.ok(renderMenu({ ...m, lang: 'en' }, 'https://breisgaudigital.de', { lang: 'en' } as never).includes('<span class="num">M1</span>Salad'));
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

  test('Bildnachweis-Link nur mit https-Adresse', () => {
    assert.equal(menuData({ name: 'X', creditsUrl: 'http://x.de/b.html' })!.creditsUrl, undefined);
    const html = renderMenu(menu({ creditsUrl: 'https://breisgaudigital.de/menu/x/bildnachweis.html' }));
    assert.ok(html.includes('href="https://breisgaudigital.de/menu/x/bildnachweis.html"'));
    assert.ok(html.includes('Bildnachweis'));
    assert.ok(!renderMenu(menu()).includes('Bildnachweis'));
  });

  test('Theme „orient" bringt eigene Regeln mit, die anderen nicht', () => {
    const orient = renderMenu({ ...menu(), theme: 'orient' });
    assert.ok(orient.includes('.hero::before'));
    assert.ok(orient.includes('data:image/svg+xml,'));
    assert.ok(!renderMenu(menu()).includes('.hero::before'));
  });

  test('Arabisch und Russisch als Übersetzung, Arabisch von rechts nach links', () => {
    const d = { translations: { ar: '# مقبلات\nحساء الطماطم | | بالريحان', ru: '# Закуски\nТоматный суп | | с базиликом' } };
    const ar = renderMenu(menu(d), 'https://breisgaudigital.de', { lang: 'ar' });
    assert.ok(ar.includes('<html lang="ar" dir="rtl">'));
    assert.ok(ar.includes('حساء الطماطم'));
    assert.ok(ar.includes('6,50'));
    const ru = renderMenu(menu(d), 'https://breisgaudigital.de', { lang: 'ru' });
    assert.ok(ru.includes('<html lang="ru">'));
    assert.ok(ru.includes('Томатный суп'));
    assert.ok(ru.includes('Русский') && ru.includes('العربية'));
  });

  test('Rubriken zuklappbar, sonst wie bisher offen', () => {
    const open = renderMenu(menu());
    assert.ok(!open.includes('<details class="cat"'));
    assert.ok(open.includes('<section><h2 id="k1">Vorspeisen</h2>'));
    const fold = renderMenu(menu({ sections: 'collapsed' }));
    assert.ok(fold.includes('<details class="cat" name="cats"><summary><h2 id="k1">Vorspeisen</h2><span class="cnt">2</span></summary>'));
    assert.equal(fold.split('<details class="cat"').length - 1, 2);
    assert.ok(fold.includes('</ul></details></section>'));
    assert.equal(menuData({ name: 'X', sections: 'irgendwas' })!.sections, undefined);
  });

  test('Schritt-für-Schritt-Auswahl nur mit gültigen Schritten', () => {
    assert.deepEqual(parseSteps('start:1; main:2', 2), [{ kind: 'start', cats: [0] }, { kind: 'main', cats: [1] }]);
    assert.deepEqual(parseSteps('start:1-3, 5; bogus:2; drinks:9; main:2-1', 5), [{ kind: 'start', cats: [0, 1, 2, 4] }]);
    assert.deepEqual(parseSteps(undefined, 3), []);
    assert.ok(!renderMenu(menu()).includes('id="wiz"'));
    const html = renderMenu(menu({ steps: 'start:1; main:2' }), 'https://breisgaudigital.de');
    assert.ok(html.includes('<button type="button" class="btn" id="wopen" hidden>Schritt für Schritt wählen</button>'));
    assert.ok(html.includes('data-t="Vorspeisen &amp; Salate"') && html.includes('data-t="Hauptgerichte"') && html.includes('data-t="Ihre Auswahl"'));
    assert.equal(html.split('class="wi"').length - 1, 4);
    assert.ok(html.includes('data-n="Tomatensuppe" data-c="650"'));
    assert.ok(!html.includes('id="wsend"'));
  });

  test('Schritt-für-Schritt-Auswahl bestellt nur mit Tischkürzel', () => {
    const html = renderMenu(menu({ steps: 'start:1-2' }), 'https://breisgaudigital.de', { table: { label: '4', token: 'abc' } });
    assert.ok(html.includes('id="wsend"'));
    assert.ok(html.includes('"t":"abc"'));
  });

  test('Rubrikbild: Textformat, nur https, Bildkarte oder Banner', () => {
    const cats = parseMenuText('# Vorspeisen | kalt | https://x.de/v.jpg\nSuppe | 5\n\n# Salate | https://x.de/s.jpg\nGrün | 4\n\n# Dessert\nEis | 3');
    assert.equal(cats[0]!.img, 'https://x.de/v.jpg');
    assert.equal(cats[0]!.note, 'kalt');
    assert.equal(cats[1]!.img, 'https://x.de/s.jpg');
    assert.equal(cats[1]!.note, undefined);
    assert.ok(menuText(cats).startsWith('# Vorspeisen | kalt | https://x.de/v.jpg\n'));
    assert.equal(menuData({ name: 'X', categories: [{ title: 'A', img: 'http://x.de/a.jpg', items: [{ name: 'B' }] }] })!.categories[0]!.img, undefined);
    const fold = renderMenu(menu({ categories: cats, sections: 'collapsed' }));
    assert.ok(fold.includes('<details class="cat card" name="cats"><summary><span class="ci"><img src="https://x.de/v.jpg"'));
    assert.ok(fold.includes('<details class="cat card" name="cats"><summary><h2 id="k3">Dessert</h2>'));
    const open = renderMenu(menu({ categories: cats }));
    assert.ok(open.includes('<section><span class="cban"><img src="https://x.de/v.jpg"'));
    assert.ok(!renderMenu(menu({ sections: 'collapsed' })).includes('cat card'));
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

describe('Getränke und Rechts-nach-links', () => {
  const data = menuData({
    name: 'X',
    phone: '0761 2927151',
    steps: 'start:1; drinks:2',
    translations: { ar: '# Food\nSuppe\n\n# Drinks\nWasser' },
    categories: [{ title: 'Essen', items: [{ name: 'Suppe', price: '5,00' }] }, { title: 'Getränke', items: [{ name: 'Wasser', price: '3,00' }] }],
  })!;
  const m: Menu = { slug: 'x', lang: 'de', theme: 'orient', preview: false, data };
  test('Getränke zeigen den Originalnamen unter der Übersetzung, Speisen nicht', () => {
    const html = renderMenu({ ...m, data: { ...data, translations: { en: '# Food\nSoup | | x\n\n# Drinks\nWater' } } }, 'https://breisgaudigital.de', { lang: 'en' } as never);
    assert.ok(html.includes('<p class="orig" lang="de" dir="ltr">Wasser</p>'));
    assert.ok(!html.includes('>Suppe</p>'));
    assert.ok(!renderMenu(m, 'https://breisgaudigital.de').includes('class="orig"'));
  });
  test('Telefonnummer bleibt auf Arabisch in ihrer Reihenfolge', () => {
    const html = renderMenu(m, 'https://breisgaudigital.de', { lang: 'ar' } as never);
    assert.ok(html.includes('dir="rtl"'));
    assert.ok(html.includes('<bdi dir="ltr">0761 2927151</bdi>'));
  });
});

describe('Rubrik mit Zeitraum (Mittagsmenü)', () => {
  const at = (h: number, m: number) => new Date(Date.UTC(2026, 9, 27, h - 1, m)); // 27.10.2026: MEZ = UTC+1
  test('openAt: nur im Zeitraum, Berliner Zeit', () => {
    assert.equal(openAt('11:30-16:00', at(11, 29)), false);
    assert.equal(openAt('11:30-16:00', at(11, 30)), true);
    assert.equal(openAt('11:30-16:00', at(15, 59)), true);
    assert.equal(openAt('11:30-16:00', at(16, 0)), false);
    assert.equal(openAt('22:00-02:00', at(1, 0)), true);
    assert.equal(openAt(undefined, at(3, 0)), true);
  });
  test('hoursSpec nimmt nur echte Zeiträume', () => {
    assert.equal(hoursSpec('9:05 - 16:00'), '09:05-16:00');
    assert.equal(hoursSpec('25:00-16:00'), undefined);
    assert.equal(hoursSpec('mittags'), undefined);
  });
  test('Textformat: @Zeitraum an der Rubrik', () => {
    const cats = parseMenuText('# Mittag | 10,90 € | @11:30-16:00\nSalat | 10,90');
    assert.equal(cats[0]!.hours, '11:30-16:00');
    assert.equal(cats[0]!.note, '10,90 €');
    assert.equal(menuText(cats).split('\n')[0], '# Mittag | 10,90 € | @11:30-16:00');
  });
  test('Seite: Zeitraum am Titel, außerhalb versteckt, mit Skript zum Nachführen', () => {
    const data = menuData({ name: 'X', categories: [{ title: 'Mittag', hours: '11:30-16:00', items: [{ name: 'Salat' }] }, { title: 'Abend', items: [{ name: 'Suppe' }] }] })!;
    const m: Menu = { slug: 'x', lang: 'de', theme: 'orient', preview: false, data };
    const html = renderMenu(m, 'https://breisgaudigital.de');
    assert.ok(html.includes('<small class="hrs">Täglich 11:30–16:00</small>'));
    assert.ok(html.includes('data-hrs="11:30-16:00"'));
    assert.ok(html.includes('Europe/Berlin'));
    assert.ok(!renderMenu({ ...m, data: menuData({ name: 'X', categories: [{ title: 'Abend', items: [{ name: 'Suppe' }] }] })! }, 'https://breisgaudigital.de').includes('Europe/Berlin'));
  });
});
