import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { menuData, menuText, parseMenuText, renderMenu, type Menu } from './menus';

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
    assert.ok(!html.includes('<script'));
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
