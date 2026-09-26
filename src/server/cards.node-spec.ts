import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  type BusinessCardData,
  type GiftCardData,
  MAX_LINKS,
  MAX_PHOTOS,
  NETWORKS,
  cardData,
  esc,
  httpsUrl,
  mailAddress,
  renderCard,
  telHref,
  vcard,
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

describe('cardData — Profil: Portrait und Netzwerke', () => {
  test('nimmt ein Portrait als https-Adresse', () => {
    const d = cardData('business', { company: 'X', avatarUrl: 'https://cdn.example/me.jpg' }) as BusinessCardData;
    assert.equal(d.avatarUrl, 'https://cdn.example/me.jpg');
  });

  test('wirft ein Portrait ab, das nicht https ist', () => {
    const d = cardData('business', { company: 'X', avatarUrl: 'javascript:alert(1)' }) as BusinessCardData;
    assert.equal('avatarUrl' in d, false);
  });

  test('merkt sich das Netzwerk und beschriftet es von selbst', () => {
    const d = cardData('business', {
      company: 'X',
      links: [{ net: 'instagram', url: 'https://instagram.com/x' }],
    }) as BusinessCardData;
    assert.deepEqual(d.links, [{ label: NETWORKS.instagram, url: 'https://instagram.com/x', net: 'instagram' }]);
  });

  test('lässt eine eigene Beschriftung vor dem Netzwerknamen stehen', () => {
    const d = cardData('business', {
      company: 'X',
      links: [{ net: 'instagram', label: 'Unser Insta', url: 'https://instagram.com/x' }],
    }) as BusinessCardData;
    assert.equal(d.links?.[0].label, 'Unser Insta');
    assert.equal(d.links?.[0].net, 'instagram');
  });

  test('wirft ein unbekanntes Netzwerk weg, behält aber den Link mit Beschriftung', () => {
    const d = cardData('business', {
      company: 'X',
      links: [{ net: 'myspace', label: 'MySpace', url: 'https://myspace.com/x' }],
    }) as BusinessCardData;
    assert.deepEqual(d.links, [{ label: 'MySpace', url: 'https://myspace.com/x' }]);
  });

  test('lässt einen Link ohne Beschriftung und ohne Netzwerk fallen', () => {
    const d = cardData('business', { company: 'X', links: [{ url: 'https://nix.de' }] }) as BusinessCardData;
    assert.equal('links' in d, false);
  });
});

describe('cardData — Geschenkkarte: Bildergalerie', () => {
  test('nimmt mehrere Bilder in der eingegebenen Reihenfolge', () => {
    const d = cardData('gift', {
      headline: 'H',
      photos: ['https://cdn.example/1.jpg', 'https://cdn.example/2.jpg'],
    }) as GiftCardData;
    assert.deepEqual(d.photos, ['https://cdn.example/1.jpg', 'https://cdn.example/2.jpg']);
  });

  test('siebt Bilder aus, die nicht https sind', () => {
    const d = cardData('gift', {
      headline: 'H',
      photos: ['https://cdn.example/1.jpg', 'javascript:alert(1)', 'http://unsicher/2.jpg', ''],
    }) as GiftCardData;
    assert.deepEqual(d.photos, ['https://cdn.example/1.jpg']);
  });

  test('begrenzt die Zahl der Bilder', () => {
    const photos = Array.from({ length: MAX_PHOTOS + 5 }, (_, i) => `https://cdn.example/${i}.jpg`);
    const d = cardData('gift', { headline: 'H', photos }) as GiftCardData;
    assert.equal(d.photos?.length, MAX_PHOTOS);
  });

  test('lässt das Feld weg, wenn kein Bild übrig bleibt', () => {
    const d = cardData('gift', { headline: 'H', photos: ['nix', 'http://auch-nix'] }) as GiftCardData;
    assert.equal('photos' in d, false);
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

  test('zeichnet das Portrait rund und das Logo quer', () => {
    const html = business({ logoUrl: 'https://cdn.example/logo.png', avatarUrl: 'https://cdn.example/me.jpg' });
    assert.match(html, /class="logo" src="https:\/\/cdn\.example\/logo\.png"/);
    assert.match(html, /class="avatar" src="https:\/\/cdn\.example\/me\.jpg"/);
  });

  test('zeichnet ein einzelnes Bild ohne zweispaltige Galerie', () => {
    const html = renderCard({ slug: 's', kind: 'gift', theme: 'brand', data: { headline: 'H', photos: ['https://cdn.example/1.jpg'] } });
    assert.match(html, /class="gallery"/);
    assert.equal(/gallery multi/.test(html), false);
  });

  test('zeichnet mehrere Bilder zweispaltig', () => {
    const html = renderCard({
      slug: 's',
      kind: 'gift',
      theme: 'brand',
      data: { headline: 'H', photos: ['https://cdn.example/1.jpg', 'https://cdn.example/2.jpg'] },
    });
    assert.match(html, /class="gallery multi"/);
    assert.equal((html.match(/<img src="https:\/\/cdn\.example/g) ?? []).length, 2);
  });

  test('lässt ein gefährliches Bild auch beim Zeichnen nicht durch', () => {
    const html = renderCard({
      slug: 's',
      kind: 'gift',
      theme: 'brand',
      data: { headline: 'H', photos: ['javascript:alert(1)'] } as GiftCardData,
    });
    assert.equal(/javascript:/i.test(html), false);
    assert.equal(/class="gallery/.test(html), false);
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

/**
 * Die Kontaktdatei hinter dem Knopf „Zu Kontakten hinzufügen". In einer vCard
 * trennen Semikolon und Komma die Felder und ein Zeilenumbruch beendet die
 * Eigenschaft — steht so etwas unmaskiert in einem Firmennamen, schreibt der
 * Kunde sich seine eigenen Einträge ins Adressbuch des Besuchers.
 */
describe('vcard', () => {
  const vc = (over: Partial<BusinessCardData> = {}) => vcard({ company: 'Café Krone', phone: '+49 761 123456', ...over });

  test('baut eine vollständige vCard 3.0', () => {
    const out = vc({ email: 'hallo@krone.de', web: 'https://krone.de', address: 'Hauptstr. 1, 79098 Freiburg' })!;
    assert.match(out, /^BEGIN:VCARD\r\nVERSION:3\.0\r\n/);
    assert.match(out, /\r\nEND:VCARD\r\n$/);
    assert.match(out, /\r\nFN:Café Krone\r\n/);
    assert.match(out, /\r\nORG:Café Krone\r\n/);
    // N ist in 3.0 Pflicht, auch wenn wir keine Person führen.
    assert.match(out, /\r\nN:;;;;\r\n/);
    assert.match(out, /\r\nTEL;TYPE=WORK,VOICE:\+49761123456\r\n/);
    assert.match(out, /\r\nEMAIL;TYPE=INTERNET,WORK:hallo@krone\.de\r\n/);
    assert.match(out, /\r\nURL:https:\/\/krone\.de\r\n/);
  });

  test('trennt Zeilen mit CRLF, wie es der Standard verlangt', () => {
    const out = vc()!;
    assert.equal(/[^\r]\n/.test(out), false, 'jedes \\n muss ein \\r vor sich haben');
  });

  test('maskiert Semikolon, Komma und Backslash im Text', () => {
    const out = vc({ company: 'Meier; Sohn, GmbH \\ Co' })!;
    assert.match(out, /\r\nFN:Meier\\; Sohn\\, GmbH \\\\ Co\r\n/);
  });

  test('lässt keine zweite Eigenschaft in ein Feld schmuggeln', () => {
    const out = vc({ company: 'Krone\r\nTEL:666', tagline: 'gut\nEMAIL:b\u00f6se@x.de' })!;
    // Der Umbruch wird zu \n im Wert — keine eigene Zeile daraus.
    assert.equal(/\r\nTEL:666/.test(out), false);
    assert.equal(/\r\nEMAIL:böse@x\.de/.test(out), false);
    assert.match(out, /\r\nFN:Krone\\nTEL:666\r\n/);
    assert.match(out, /NOTE:gut\\nEMAIL:böse@x\.de/);
  });

  test('faltet lange Zeilen auf 75 Oktett mit führendem Leerzeichen', () => {
    const long = 'https://krone.de/' + 'a'.repeat(120);
    const out = vcard({ company: 'K', web: long })!;
    for (const line of out.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, `zu lang: ${line}`);
    // Zusammengeklebt muss die Adresse wieder vollständig sein.
    assert.match(out.replace(/\r\n /g, ''), new RegExp(`URL:${long.replace(/[.*+?^$()|[\]\\]/g, '\\$&')}`));
  });

  test('zerschneidet beim Falten kein Zeichen', () => {
    // Umlaut = 2 Bytes, Emoji = 4 Bytes und in JS zwei Zeichen. Wer nach
    // Bytes schneidet, zerlegt hier ein Zeichen in Hälften; wer nach Zeichen
    // schneidet, wird zu lang. Beides fällt unten auf.
    const name = 'Bäckerei 🥨 Löwen '.repeat(6).trim();
    const out = vcard({ company: name, phone: '0761123456' })!;
    assert.ok(Buffer.byteLength(`FN:${name}`) > 75, 'Testname muss lang genug zum Falten sein');
    for (const line of out.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, `zu lang: ${Buffer.byteLength(line)}`);
    // Entfalten (CRLF + Leerzeichen weg) muss den Namen Zeichen für Zeichen
    // zurückgeben — und kein ersetztes Zeichen enthalten.
    assert.match(out.replace(/\r\n /g, ''), new RegExp(`\r\nFN:${name}\r\n`));
    assert.equal(out.includes('\ufffd'), false);
  });

  test('nimmt nur https-Adressen auf', () => {
    const out = vcard({
      company: 'K',
      phone: '0761123456',
      web: 'javascript:alert(1)',
      links: [{ label: 'X', url: 'http://unsicher.de' }, { label: 'I', url: 'https://instagram.com/k' }],
      avatarUrl: 'data:image/png;base64,AAA',
    })!;
    assert.equal(/javascript:/i.test(out), false);
    assert.equal(/http:\/\/unsicher/.test(out), false);
    assert.equal(/data:image/.test(out), false);
    assert.match(out, /\r\nURL:https:\/\/instagram\.com\/k\r\n/);
  });

  test('schreibt die Adresse ins Straßenfeld', () => {
    const out = vc({ address: 'Hauptstr. 1, 79098 Freiburg' })!;
    assert.match(out, /\r\nADR;TYPE=WORK:;;Hauptstr\. 1\\, 79098 Freiburg;;;;\r\n/);
  });

  test('nimmt das Portrait, sonst das Logo als Bild', () => {
    assert.match(vc({ avatarUrl: 'https://x.de/p.jpg', logoUrl: 'https://x.de/l.png' })!, /PHOTO;VALUE=URI:https:\/\/x\.de\/p\.jpg/);
    assert.match(vc({ logoUrl: 'https://x.de/l.png' })!, /PHOTO;VALUE=URI:https:\/\/x\.de\/l\.png/);
  });

  test('gibt null zurück, wenn es nichts zu speichern gibt', () => {
    // Nur ein Name: ein Kontakt ohne Telefon und Mail nützt niemandem.
    assert.equal(vcard({ company: 'Café Krone' }), null);
    assert.equal(vcard({ company: 'Café Krone', tagline: 'Kuchen' }), null);
    // Unbrauchbare Nummer zählt nicht als Kontaktdatum.
    assert.equal(vcard({ company: 'K', phone: 'ruf mal an' }), null);
    // Eine Adresse allein genügt schon.
    assert.notEqual(vcard({ company: 'K', address: 'Hauptstr. 1' }), null);
  });
});

/**
 * Der Knopf auf der Seite selbst — er darf nur erscheinen, wenn die
 * Kontaktdatei auch etwas enthält.
 */
describe('Kontaktknopf auf der Karte', () => {
  test('verlinkt die Kontaktdatei der eigenen Karte', () => {
    const html = renderCard({ slug: 'cafe-krone', kind: 'business', theme: 'brand', data: { company: 'Café Krone', phone: '0761123456' } });
    assert.match(html, /href="\/k\/cafe-krone\/kontakt\.vcf" download/);
    assert.match(html, /Zu Kontakten hinzufügen/);
  });

  test('bleibt weg, wenn die Karte keine Kontaktdaten hat', () => {
    const html = renderCard({ slug: 'nur-name', kind: 'business', theme: 'brand', data: { company: 'Café Krone' } });
    assert.equal(/kontakt\.vcf/.test(html), false);
  });

  test('steht nicht auf einer Geschenkkarte', () => {
    const html = renderCard({ slug: 'gb', kind: 'gift', theme: 'warm', data: { headline: 'Alles Gute' } });
    assert.equal(/kontakt\.vcf/.test(html), false);
  });
});
