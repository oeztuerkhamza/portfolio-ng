import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  type BusinessCardData,
  type GiftCardData,
  MAX_LINKS,
  cardData,
  esc,
  httpsUrl,
  mailAddress,
  renderCard,
  telHref,
} from './cards';

/**
 * Tests der NFC-Kartenseiten. Der Inhalt kommt aus der Datenbank und landet
 * direkt in HTML — die Maskierung ist hier das Wichtigste.
 * Ausführen mit `npm run test:server`.
 */

describe('esc', () => {
  test('maskiert alles, was HTML aufbrechen könnte', () => {
    assert.equal(esc('<script>'), '&lt;script&gt;');
    assert.equal(esc('a & b'), 'a &amp; b');
    assert.equal(esc('"quote"'), '&quot;quote&quot;');
    assert.equal(esc("it's"), 'it&#39;s');
  });

  test('maskiert das Undzeichen zuerst, sonst entsteht doppelte Maskierung', () => {
    assert.equal(esc('&lt;'), '&amp;lt;');
  });

  test('macht aus null und undefined leeren Text', () => {
    assert.equal(esc(null), '');
    assert.equal(esc(undefined), '');
  });
});

describe('httpsUrl', () => {
  test('nimmt https', () => {
    assert.equal(httpsUrl('https://example.com/a?b=c'), 'https://example.com/a?b=c');
  });

  test('lehnt alles ab, was in einem href Schaden anrichten könnte', () => {
    for (const bad of [
      'http://example.com',
      'javascript:alert(1)',
      'JavaScript:alert(1)',
      'data:text/html;base64,PHNjcmlwdD4=',
      'vbscript:msgbox',
      'file:///etc/passwd',
      '//example.com',
      'example.com',
      '',
      '   ',
      null,
      undefined,
      123,
    ]) {
      assert.equal(httpsUrl(bad), null, `angenommen: ${String(bad)}`);
    }
  });

  test('lehnt eine übermäßig lange Adresse ab', () => {
    assert.equal(httpsUrl('https://example.com/' + 'x'.repeat(2000)), null);
  });
});

describe('telHref und mailAddress', () => {
  test('nimmt eine Rufnummer und wirft den Zierrat weg', () => {
    assert.equal(telHref('+49 155 66859378'), '+4915566859378');
    assert.equal(telHref('(0761) 123 456'), '0761123456');
  });

  test('lehnt ab, was keine Rufnummer ist', () => {
    for (const bad of ['abc', '12', '', '+49-abc']) assert.equal(telHref(bad), null, bad);
  });

  test('nimmt eine E-Mail und lehnt Unsinn ab', () => {
    assert.equal(mailAddress('info@breisgau-digital.de'), 'info@breisgau-digital.de');
    for (const bad of ['kein-at', 'a@b', 'a b@c.de', '<a@b.de>', '', null]) {
      assert.equal(mailAddress(bad), null, String(bad));
    }
  });
});

describe('cardData — Firmenkarte', () => {
  test('verlangt den Firmennamen', () => {
    assert.equal(cardData('business', {}), null);
    assert.equal(cardData('business', { company: '   ' }), null);
  });

  test('übernimmt die ausgefüllten Felder und lässt die leeren weg', () => {
    const d = cardData('business', {
      company: '  Café Krone  ',
      tagline: '',
      phone: '+49 761 1',
      email: 'hallo@krone.de',
      web: 'https://krone.de',
      address: 'Hauptstr. 1',
    }) as BusinessCardData;
    assert.equal(d.company, 'Café Krone', 'wird beschnitten');
    assert.equal('tagline' in d, false, 'leeres Feld fällt weg');
    assert.equal(d.web, 'https://krone.de');
    assert.equal(d.address, 'Hauptstr. 1');
  });

  test('wirft ein Logo und eine Website ab, die nicht https sind', () => {
    const d = cardData('business', {
      company: 'X',
      logoUrl: 'javascript:alert(1)',
      web: 'http://unsicher.de',
      email: 'kaputt',
    }) as BusinessCardData;
    assert.equal('logoUrl' in d, false);
    assert.equal('web' in d, false);
    assert.equal('email' in d, false);
  });

  test('nimmt nur Links mit Bezeichnung und https-Adresse', () => {
    const d = cardData('business', {
      company: 'X',
      links: [
        { label: 'Instagram', url: 'https://instagram.com/x' },
        { label: 'Böse', url: 'javascript:alert(1)' },
        { label: '', url: 'https://ohne-label.de' },
        { url: 'https://ohne-label-2.de' },
      ],
    }) as BusinessCardData;
    assert.deepEqual(d.links, [{ label: 'Instagram', url: 'https://instagram.com/x' }]);
  });

  test('begrenzt die Zahl der Links', () => {
    const links = Array.from({ length: MAX_LINKS + 4 }, (_, i) => ({ label: `L${i}`, url: `https://e${i}.de` }));
    const d = cardData('business', { company: 'X', links }) as BusinessCardData;
    assert.equal(d.links?.length, MAX_LINKS);
  });

  test('kürzt zu lange Texte, statt sie abzulehnen', () => {
    const d = cardData('business', { company: 'C'.repeat(500), address: 'A'.repeat(500) }) as BusinessCardData;
    assert.equal(d.company.length, 120);
    assert.equal(d.address?.length, 200);
  });
});

describe('cardData — Geschenkkarte', () => {
  test('verlangt die Überschrift', () => {
    assert.equal(cardData('gift', { message: 'nur Text' }), null);
  });

  test('übernimmt Anlass, Namen, Text und Lied', () => {
    const d = cardData('gift', {
      headline: 'Alles Gute zum Geburtstag!',
      to: 'Ayşe',
      from: 'Hamza',
      message: 'Zeile 1\nZeile 2',
      songUrl: 'https://open.spotify.com/track/abc',
      songLabel: 'Unser Lied',
    }) as GiftCardData;
    assert.equal(d.headline, 'Alles Gute zum Geburtstag!');
    assert.equal(d.to, 'Ayşe');
    assert.match(String(d.message), /Zeile 1\nZeile 2/);
    assert.equal(d.songUrl, 'https://open.spotify.com/track/abc');
  });

  test('wirft ein Lied ab, das keine https-Adresse ist', () => {
    const d = cardData('gift', { headline: 'H', songUrl: 'javascript:alert(1)' }) as GiftCardData;
    assert.equal('songUrl' in d, false);
  });
});

describe('renderCard', () => {
  const business = (over: Partial<BusinessCardData> = {}) =>
    renderCard({ slug: 's', kind: 'business', theme: 'brand', data: { company: 'Café Krone', ...over } }, 'https://breisgau-digital.de');

  test('zeigt Name, Telefon, E-Mail und Website an', () => {
    const html = business({ phone: '+49 761 123456', email: 'hallo@krone.de', web: 'https://krone.de' });
    assert.match(html, /Café Krone/);
    assert.match(html, /href="tel:\+49761123456"/);
    assert.match(html, /href="mailto:hallo@krone\.de"/);
    assert.match(html, /href="https:\/\/krone\.de"/);
  });

  test('maskiert einen Firmennamen mit HTML darin', () => {
    const html = business({ company: '<script>alert(1)</script>' });
    assert.equal(html.includes('<script>alert(1)</script>'), false, 'unmaskiert im Dokument');
    assert.match(html, /&lt;script&gt;/);
  });

  test('bricht das Dokument nicht mit einem Anführungszeichen auf', () => {
    const html = business({ company: 'a" onload="alert(1)' });
    assert.equal(html.includes('onload="alert(1)"'), false);
    assert.match(html, /&quot;/);
  });

  test('lässt eine gefährliche Adresse nicht bis ins href', () => {
    // cardData wirft sie weg; hier der zweite Riegel: selbst wenn so etwas
    // in der Datenbank steht, darf es nicht als href erscheinen.
    const html = renderCard({
      slug: 's',
      kind: 'business',
      theme: 'brand',
      data: { company: 'X', links: [{ label: 'L', url: 'javascript:alert(1)' }] } as BusinessCardData,
    });
    assert.equal(/href="javascript:/i.test(html), false);
  });

  test('bittet Suchmaschinen, die Karte nicht aufzunehmen', () => {
    assert.match(business(), /name="robots" content="noindex,nofollow"/);
    assert.match(business(), /name="referrer" content="no-referrer"/);
  });

  test('zeigt den Liedknopf nur, wenn ein Lied da ist', () => {
    const withSong = renderCard({ slug: 's', kind: 'gift', theme: 'warm', data: { headline: 'H', songUrl: 'https://o.de/t', songLabel: 'Unser Lied' } });
    assert.match(withSong, /Unser Lied/);
    assert.match(withSong, /href="https:\/\/o\.de\/t"/);

    const without = renderCard({ slug: 's', kind: 'gift', theme: 'warm', data: { headline: 'H' } });
    assert.equal(/class="btn"/.test(without), false);
  });

  test('nennt Empfänger und Absender der Geschenkkarte', () => {
    const html = renderCard({ slug: 's', kind: 'gift', theme: 'brand', data: { headline: 'H', to: 'Ayşe', from: 'Hamza' } });
    assert.match(html, /Für Ayşe · von Hamza/);
  });

  test('nimmt das gewählte Thema', () => {
    assert.match(renderCard({ slug: 's', kind: 'gift', theme: 'dark', data: { headline: 'H' } }), /#0e1a2b/);
    assert.match(renderCard({ slug: 's', kind: 'gift', theme: 'warm', data: { headline: 'H' } }), /#fbf7f1/);
  });

  test('fällt auf das Markenthema zurück, wenn das Thema unbekannt ist', () => {
    const html = renderCard({ slug: 's', kind: 'gift', theme: 'quatsch' as never, data: { headline: 'H' } });
    assert.match(html, /#f6f8fb/);
  });

  test('setzt den Titel aus dem Inhalt', () => {
    assert.match(business({ company: 'Krone' }), /<title>Krone<\/title>/);
    assert.match(renderCard({ slug: 's', kind: 'gift', theme: 'brand', data: { headline: 'Hoch soll sie leben' } }), /<title>Hoch soll sie leben<\/title>/);
  });
});
