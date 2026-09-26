import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  CARD_LANGS,
  LABEL_KEYS,
  type BusinessCardData,
  type GiftCardData,
  MAX_LINKS,
  MAX_PHOTOS,
  NETWORKS,
  cardData,
  cardSlug,
  esc,
  cardNotice,
  httpsUrl,
  label,
  leadFields,
  leadRedirect,
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

/**
 * Der Kurzname, mit dem eine bestellte Karte im Portal landet. Er ist später
 * die Adresse der Karte und muss zu dem passen, was das Portal beim Tippen
 * vorschlägt — sonst heißt dieselbe Firma zweimal verschieden.
 */
describe('cardSlug', () => {
  test('macht aus einem Firmennamen eine Adresse', () => {
    assert.match(cardSlug('Café Krone', 'a1b2'), /^cafe-krone-a1b2$/);
    assert.match(cardSlug('Bäckerei Grün & Söhne', 'x'), /^baeckerei-gruen-soehne-x$/);
  });

  test('schreibt deutsche Umlaute aus, statt sie wegzulassen', () => {
    // ü → ue: „Grün" darf nicht „grn" werden.
    assert.match(cardSlug('Grün', 'x'), /^gruen-x$/);
    assert.match(cardSlug('Weiß', 'x'), /^weiss-x$/);
  });

  test('kommt mit türkischen Buchstaben zurecht', () => {
    assert.match(cardSlug('Çiğdem Işık', 'x'), /^cigdem-isik-x$/);
    assert.match(cardSlug('Şahin Öztürk', 'x'), /^sahin-oeztuerk-x$/);
  });

  test('ergibt immer etwas, das die Datenbank annimmt', () => {
    // Prüfung der Spalte `slug`: 3–50 Zeichen, Anfang und Ende alphanumerisch.
    const ok = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
    for (const name of ['', null, undefined, '   ', '///', '😀', 'a', 'X'.repeat(300), 'Ärzte – Praxis (neu)!']) {
      const slug = cardSlug(name, 'abc123');
      assert.match(slug, ok, `unbrauchbar für „${String(name)}": ${slug}`);
      assert.ok(slug.length <= 50, `zu lang: ${slug.length}`);
    }
  });

  test('nimmt „karte" als Namen, wenn nichts Brauchbares übrig bleibt', () => {
    assert.equal(cardSlug('😀😀', 'abc'), 'karte-abc');
    assert.equal(cardSlug('', 'abc'), 'karte-abc');
  });

  test('lässt sich keinen Anhang unterschieben', () => {
    // Was im Anhang nicht erlaubt ist, fällt weg — sonst käme ein Schrägstrich
    // in die Adresse.
    assert.equal(cardSlug('K', '../../etc'), 'k-etc');
    assert.equal(cardSlug('K', ''), 'k-1');
    assert.equal(cardSlug('K', '!!!'), 'k-1');
  });
});

/**
 * Sprache der Karte. Sie hat nichts mit der Sprache der Website zu tun: die
 * Karte liegt beim Gast in der Hand, und der spricht die Sprache des Kunden.
 */
describe('Sprache der Karte', () => {
  const card = (lang: unknown, over: Partial<BusinessCardData> = {}) =>
    renderCard({
      slug: 's',
      kind: 'business',
      theme: 'brand',
      lang: lang as never,
      data: { company: 'Krone', phone: '0761123456', ...over },
    });

  test('beschriftet die Zeilen in der Sprache der Karte', () => {
    assert.match(card('de'), />Telefon</);
    assert.match(card('en'), />Phone</);
    assert.match(card('tr'), />Telefon</);
    assert.match(card('fr'), />Téléphone</);
    assert.match(card('ku'), />Telefon</);
  });

  test('setzt lang im html-Element — das brauchen Vorleseprogramme', () => {
    assert.match(card('tr'), /<html lang="tr">/);
    assert.match(card('fr'), /<html lang="fr">/);
  });

  test('übersetzt den Knopf für die Kontaktdatei', () => {
    assert.match(card('de'), /Zu Kontakten hinzufügen/);
    assert.match(card('tr'), /Rehbere kaydet/);
    assert.match(card('en'), /Save to contacts/);
  });

  test('fällt bei fehlender oder unbekannter Sprache auf Deutsch zurück', () => {
    assert.match(card(undefined), /<html lang="de">/);
    assert.match(card('quatsch'), /<html lang="de">/);
    assert.match(card('quatsch'), />Telefon</);
  });

  test('stellt „für" und „von" so, wie es die Sprache verlangt', () => {
    const gift = (lang: string) =>
      renderCard({ slug: 's', kind: 'gift', theme: 'warm', lang: lang as never, data: { headline: 'H', to: 'Ayşe', from: 'Hamza' } });
    assert.match(gift('de'), /Für Ayşe · von Hamza/);
    // Im Türkischen steht „için" hinter dem Namen, nicht davor.
    assert.match(gift('tr'), /Ayşe için · Hamza tarafından/);
    assert.match(gift('en'), /For Ayşe · from Hamza/);
  });

  test('übersetzt den Liedknopf, solange der Kunde keine eigene Beschriftung gibt', () => {
    const gift = (lang: string, songLabel?: string) =>
      renderCard({ slug: 's', kind: 'gift', theme: 'warm', lang: lang as never, data: { headline: 'H', songUrl: 'https://o.de/t', songLabel } });
    assert.match(gift('tr'), /Şarkıyı dinle/);
    assert.match(gift('en'), /Listen to the song/);
    // Eigene Beschriftung schlägt die Übersetzung.
    assert.match(gift('tr', 'Bizim şarkımız'), /Bizim şarkımız/);
  });
});

/**
 * Der Kontaktbogen: die Funktion, die die Anbieter digitaler Visitenkarten
 * als Hauptargument verkaufen. Bei uns ohne eine Zeile JavaScript — und nur,
 * wenn der Kunde sie für seine Karte ausdrücklich einschaltet.
 */
describe('Kontaktbogen', () => {
  const card = (over: Partial<BusinessCardData> = {}, notice?: 'thanks' | 'need') =>
    renderCard(
      { slug: 'krone', kind: 'business', theme: 'brand', lang: 'de', data: { company: 'Krone', phone: '0761123456', ...over } },
      'https://breisgau-digital.de',
      notice ?? null,
    );

  test('steht nur auf Karten, für die er eingeschaltet ist', () => {
    assert.equal(/<form/.test(card()), false, 'ohne leads: kein Formular');
    assert.match(card({ leads: true }), /<form method="post" action="\/k\/krone\/kontakt">/);
  });

  test('kommt ohne JavaScript aus — die Karte lädt nie ein Skript', () => {
    const html = card({ leads: true });
    assert.equal(/<script/i.test(html), false);
    assert.equal(/ on[a-z]+=/i.test(html), false, 'keine Inline-Handler');
    // Aufklappen macht <details>, nicht JavaScript.
    assert.match(html, /<details class="lead"/);
  });

  test('fragt nach Name, E-Mail, Telefon, Firma und Nachricht', () => {
    const html = card({ leads: true });
    for (const name of ['name', 'email', 'phone', 'company', 'message']) {
      assert.match(html, new RegExp(`name="${name}"`), `Feld ${name} fehlt`);
    }
    assert.match(html, /name="name"[^>]*required/);
  });

  test('stellt Bots eine Falle, die ein Mensch nicht sieht', () => {
    const html = card({ leads: true });
    assert.match(html, /class="trap" type="text" name="website"/);
    // Aus dem Bild geschoben und nicht per Tabulator erreichbar.
    assert.match(html, /\.trap\{position:absolute;left:-9999px/);
    assert.match(html, /name="website" tabindex="-1"/);
  });

  test('nennt den Empfänger der Angaben — das ist eine Pflichtangabe', () => {
    // Art. 13 DSGVO: der Gast muss wissen, wer seine Daten bekommt. „Nur an
    // uns" wäre falsch: gedacht sind sie für den Inhaber der Karte.
    const html = card({ leads: true });
    assert.match(html, /Inhaber dieser Karte/);
    assert.match(html, /Keine Werbung/);
    assert.match(html, /href="\/de\/datenschutz"/);
  });

  test('verlinkt den Datenschutz in der Sprache der Karte', () => {
    const tr = renderCard(
      { slug: 'k', kind: 'business', theme: 'brand', lang: 'tr', data: { company: 'K', phone: '0761123456', leads: true } },
      '',
      null,
    );
    assert.match(tr, /href="\/tr\/datenschutz"/);
    assert.match(tr, /bu kartın sahibine/);
  });

  test('nennt den Empfänger in jeder Sprache', () => {
    // Ein Hinweis, der in einer Sprache fehlt, ist in dieser Sprache keine
    // Information — und damit keine erfüllte Pflicht.
    for (const lang of CARD_LANGS) {
      const note = label(lang, 'leadNote');
      assert.ok(note.length > 40, `${lang}: Hinweis zu knapp für eine Pflichtangabe`);
      assert.equal(/nur an uns|only to us|nous sont destinées uniquement/i.test(note), false, `${lang}: nennt den Empfänger falsch`);
    }
  });

  test('zeigt nach dem Absenden eine Bestätigung statt des Bogens', () => {
    const html = card({ leads: true }, 'thanks');
    assert.match(html, /class="thanks"/);
    assert.match(html, /wir melden uns/i);
    assert.equal(/<form/.test(html), false, 'nach dem Absenden kein zweites Formular');
  });

  test('lässt den Bogen offen, wenn eine Angabe fehlte', () => {
    const html = card({ leads: true }, 'need');
    assert.match(html, /<details class="lead" open>/);
    assert.match(html, /class="lead-need" role="alert"/);
  });

  test('steht nie auf einer Geschenkkarte', () => {
    const html = renderCard({
      slug: 'g',
      kind: 'gift',
      theme: 'warm',
      lang: 'de',
      data: { headline: 'H', leads: true } as never,
    });
    assert.equal(/<form/.test(html), false);
  });

  test('übersetzt den Bogen mit der Karte', () => {
    const tr = renderCard(
      { slug: 'k', kind: 'business', theme: 'brand', lang: 'tr', data: { company: 'Krone', phone: '0761123456', leads: true } },
      '',
      null,
    );
    assert.match(tr, /Bilgilerinizi bırakın/);
    assert.match(tr, />Gönder</);
  });

  test('nimmt „leads" nur als echtes Ja an', () => {
    // Was aus einem Formular oder einer alten Zeile kommt, ist oft ein String.
    assert.equal((cardData('business', { company: 'K', leads: 'true' }) as BusinessCardData).leads, undefined);
    assert.equal((cardData('business', { company: 'K', leads: 1 }) as BusinessCardData).leads, undefined);
    assert.equal((cardData('business', { company: 'K', leads: true }) as BusinessCardData).leads, true);
  });
});

/** Adresse und Vorschau — die zwei Kleinigkeiten, die im Alltag zählen. */
describe('Karte im Alltag', () => {
  test('führt die Adresse auf die Landkarte', () => {
    const html = renderCard({
      slug: 's',
      kind: 'business',
      theme: 'brand',
      data: { company: 'K', address: 'Hauptstr. 1, 79098 Freiburg' },
    });
    assert.match(html, /href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=Hauptstr\.%201%2C%2079098%20Freiburg"/);
  });

  test('gibt Messengern Titel und Bild für die Vorschau', () => {
    const html = renderCard(
      { slug: 'krone', kind: 'business', theme: 'brand', data: { company: 'Café Krone', tagline: 'Kuchen seit 1968', logoUrl: 'https://x.de/l.png' } },
      'https://breisgau-digital.de',
    );
    assert.match(html, /<meta property="og:title" content="Café Krone" \/>/);
    assert.match(html, /<meta property="og:description" content="Kuchen seit 1968" \/>/);
    assert.match(html, /<meta property="og:url" content="https:\/\/breisgau-digital\.de\/k\/krone" \/>/);
    assert.match(html, /<meta property="og:image" content="https:\/\/x\.de\/l\.png" \/>/);
  });

  test('erfindet kein Vorschaubild, wenn der Kunde keines hinterlegt hat', () => {
    const html = renderCard({ slug: 's', kind: 'business', theme: 'brand', data: { company: 'K' } });
    assert.equal(/og:image/.test(html), false);
  });

  test('nimmt als Vorschaubild nur https, nie eine untergeschobene Adresse', () => {
    const html = renderCard({
      slug: 's',
      kind: 'business',
      theme: 'brand',
      data: { company: 'K', logoUrl: 'javascript:alert(1)', avatarUrl: 'http://unsicher.de/a.png' },
    });
    assert.equal(/og:image/.test(html), false);
    assert.equal(/javascript:/i.test(html), false);
  });

  test('bleibt trotz Vorschau aus dem Suchindex', () => {
    const html = renderCard({ slug: 's', kind: 'business', theme: 'brand', data: { company: 'K', logoUrl: 'https://x.de/l.png' } });
    assert.match(html, /name="robots" content="noindex,nofollow"/);
  });
});

/**
 * Was ein Fremder auf einer Karte abschickt, ist der einzige Weg, auf dem
 * unaufgefordert Daten in die Datenbank kommen. Darum hier eng geprüft.
 */
describe('leadFields', () => {
  /** Ein Bogen, wie ihn der Browser schickt: mit gesetztem Häkchen. */
  const full = (over: Record<string, unknown> = {}) => ({ name: 'Ayşe Yıldız', email: 'a@b.de', consent: 'ja', ...over });
  const ok = (over: Record<string, unknown> = {}) => leadFields(full(over));

  test('nimmt einen vollständigen Bogen an', () => {
    const lead = leadFields(full({ name: ' Ayşe ', phone: '0761 1', company: ' Krone ', message: ' Hallo ' }));
    assert.deepEqual(lead, { name: 'Ayşe', email: 'a@b.de', phone: '0761 1', company: 'Krone', message: 'Hallo' });
  });

  test('verwirft stillschweigend, was in die Falle getreten ist', () => {
    assert.equal(leadFields(full({ name: 'Bot', website: 'http://spam.example' })), 'trap');
    // Leer gelassen ist in Ordnung — so kommt ein Mensch durch.
    assert.notEqual(ok({ website: '' }), 'trap');
    assert.notEqual(ok({ website: '   ' }), 'trap');
  });

  test('prüft die Falle vor allem anderen', () => {
    // Sonst würde ein Bot mit unvollständigem Bogen als „need" antworten und
    // damit erfahren, dass es die Falle nicht war.
    assert.equal(leadFields({ website: 'spam' }), 'trap');
  });

  test('verlangt einen Namen', () => {
    assert.equal(leadFields(full({ name: undefined })), 'need');
    assert.equal(leadFields(full({ name: '   ' })), 'need');
  });

  test('verlangt einen Rückweg — E-Mail oder Telefon', () => {
    assert.equal(leadFields(full({ email: undefined })), 'need');
    assert.equal(leadFields(full({ email: undefined, message: 'Rufen Sie mich an' })), 'need');
    assert.notEqual(leadFields(full({ email: undefined, phone: '0761 1' })), 'need');
    assert.notEqual(leadFields(full()), 'need');
  });

  test('lässt eine unbrauchbare E-Mail nicht als Rückweg gelten', () => {
    assert.equal(leadFields(full({ email: 'kein-at-zeichen' })), 'need');
    const lead = leadFields(full({ email: 'kein-at-zeichen', phone: '0761 1' }));
    assert.notEqual(lead, 'need');
    // Der Unsinn darf nicht als E-Mail in die Datenbank.
    assert.equal((lead as { email: string | null }).email, null);
  });

  test('kürzt zu lange Angaben, statt sie abzuweisen', () => {
    const lead = leadFields(full({ name: 'A'.repeat(500), message: 'M'.repeat(5000), company: 'C'.repeat(500) })) as {
      name: string;
      message: string;
      company: string;
    };
    assert.equal(lead.name.length, 120);
    assert.equal(lead.message.length, 2000);
    assert.equal(lead.company.length, 200);
  });

  test('macht aus leeren Feldern null, nicht leere Zeichenketten', () => {
    const lead = leadFields(full({ phone: '0761 1', email: '', company: '  ', message: '' })) as unknown as Record<string, unknown>;
    assert.equal(lead['email'], null);
    assert.equal(lead['company'], null);
    assert.equal(lead['message'], null);
  });

  test('nimmt nur Zeichenketten — kein untergeschobenes Objekt', () => {
    // Ein Formular kann dasselbe Feld zweimal schicken; dann kommt ein Array
    // an. Das darf nicht als Wert in die Datenbank.
    assert.equal(leadFields(full({ name: ['a', 'b'] })), 'need');
    const lead = leadFields(full({ phone: '0761 1', message: { $ne: null } })) as unknown as Record<string, unknown>;
    assert.equal(lead['message'], null);
  });

  test('kommt mit gar keinem Rumpf aus', () => {
    // Ohne Rumpf fehlt zuerst die Einwilligung — und ohne die wird sowieso
    // nichts gespeichert, egal was sonst fehlt.
    assert.equal(leadFields(undefined), 'consent');
    assert.equal(leadFields(null), 'consent');
    assert.equal(leadFields('kein Objekt'), 'consent');
  });
});

/**
 * Die Einwilligung. Seit sie die Rechtsgrundlage ist (Art. 6 Abs. 1 lit. a
 * DSGVO), hängt daran, ob wir überhaupt speichern dürfen — und Art. 7 Abs. 1
 * verlangt, dass wir sie nachweisen können.
 */
describe('Einwilligung im Kontaktbogen', () => {
  const full = (over: Record<string, unknown> = {}) => ({ name: 'Ayşe', email: 'a@b.de', consent: 'ja', ...over });

  test('nimmt ohne Häkchen nichts an', () => {
    // Der Browser schickt ein nicht gesetztes Häkchen gar nicht mit.
    assert.equal(leadFields(full({ consent: undefined })), 'consent');
    assert.equal(leadFields(full({ consent: '' })), 'consent');
    assert.equal(leadFields(full({ consent: '   ' })), 'consent');
    assert.equal(leadFields(full({ consent: false })), 'consent');
  });

  test('prüft die Einwilligung auch dann, wenn schon Angaben fehlen', () => {
    // Sonst käme ein Bogen ohne Häkchen und ohne Namen als „need" zurück und
    // der Gast würde die Einwilligung nie zu sehen bekommen.
    assert.equal(leadFields({ consent: undefined }), 'consent');
  });

  test('lässt der Bot-Falle den Vortritt', () => {
    // Ein Bot soll nicht erfahren, dass es am Häkchen lag.
    assert.equal(leadFields({ website: 'spam', consent: 'ja' }), 'trap');
  });

  test('steht im Formular, unausgefüllt und als Pflichtfeld', () => {
    const html = renderCard(
      { slug: 'k', kind: 'business', theme: 'brand', lang: 'de', data: { company: 'K', phone: '0761123456', leads: true } },
      '',
      null,
    );
    assert.match(html, /<input type="checkbox" name="consent" value="ja" required \/>/);
    // Ein vorgesetztes Häkchen wäre keine Einwilligung (Art. 4 Nr. 11 DSGVO).
    assert.equal(/name="consent"[^>]*checked/.test(html), false, 'darf nicht vorausgewählt sein');
    assert.match(html, /Ich bin damit einverstanden/);
  });

  test('setzt die Feldbeschriftungs-Gestaltung für den Häkchen-Text zurück', () => {
    // Ohne diesen Zurücksetzer gewinnt „.lead label span" und macht aus dem
    // Einwilligungssatz Großbuchstaben mit Sperrung — unlesbar für einen
    // Satz. Aufgefallen ist das erst auf dem Bild, nicht im Test.
    const html = renderCard(
      { slug: 'k', kind: 'business', theme: 'brand', lang: 'de', data: { company: 'K', phone: '0761123456', leads: true } },
      '',
      null,
    );
    assert.match(html, /\.lead \.lead-ok span\{[^}]*text-transform:none/);
    assert.match(html, /\.lead \.lead-ok\{[^}]*display:flex/);
  });

  test('sagt es, wenn das Häkchen fehlte, und lässt den Bogen offen', () => {
    const html = renderCard(
      { slug: 'k', kind: 'business', theme: 'brand', lang: 'de', data: { company: 'K', phone: '0761123456', leads: true } },
      '',
      'consent',
    );
    assert.match(html, /<details class="lead" open>/);
    assert.match(html, /class="lead-need" role="alert"/);
    assert.match(html, /ohne Ihre Einwilligung/);
  });

  test('führt über eine eigene Adresse zurück', () => {
    assert.equal(leadRedirect('krone', 'consent'), '/k/krone?zustimmung=1');
    assert.equal(cardNotice({ zustimmung: '1' }), 'consent');
  });

  test('nennt den Satz, dem zugestimmt wird, in jeder Sprache', () => {
    // Genau dieser Satz wird zur Zeile gespeichert (Art. 7 Abs. 1). Fehlt er
    // in einer Sprache, wäre die Einwilligung dort nicht informiert.
    for (const lang of CARD_LANGS) {
      const sentence = label(lang, 'leadConsent');
      assert.ok(sentence.length > 60, `${lang}: zu knapp für eine informierte Einwilligung`);
      assert.ok(label(lang, 'leadConsentNeed').length > 20, `${lang}: Fehlermeldung fehlt`);
    }
  });
});

/**
 * Hin und zurück: wohin der Server nach dem Absenden leitet, und was die
 * Kartenseite daraus wieder liest. Die zwei Hälften müssen zusammenpassen —
 * tun sie es nicht, sieht der Gast nach dem Absenden einfach wieder das
 * leere Formular und schickt es noch einmal.
 */
describe('Rückmeldung des Kontaktbogens', () => {
  test('leitet nach dem Absenden auf die Karte mit Bestätigung', () => {
    assert.equal(leadRedirect('krone', 'ok'), '/k/krone?danke=1');
  });

  test('sagt es, wenn eine Angabe fehlte', () => {
    assert.equal(leadRedirect('krone', 'need'), '/k/krone?fehler=1');
  });

  test('gibt einem Bot nichts zu erkennen', () => {
    // Genau die Adresse eines gewöhnlichen Aufrufs: kein Parameter, aus dem
    // sich ablesen ließe, was abgewiesen wurde.
    assert.equal(leadRedirect('krone', 'drop'), '/k/krone');
  });

  test('liest die Rückmeldung wieder aus der Adresse', () => {
    assert.equal(cardNotice({ danke: '1' }), 'thanks');
    assert.equal(cardNotice({ fehler: '1' }), 'need');
    assert.equal(cardNotice({}), null);
    assert.equal(cardNotice(undefined), null);
  });

  test('passt auf die Adresse, auf die der Server leitet', () => {
    // Der eigentliche Vertrag: was leadRedirect schreibt, muss cardNotice
    // verstehen. Darum hier beides zusammen.
    const query = (url: string) => Object.fromEntries(new URL(url, 'https://x.de').searchParams);
    assert.equal(cardNotice(query(leadRedirect('k', 'ok'))), 'thanks');
    assert.equal(cardNotice(query(leadRedirect('k', 'need'))), 'need');
    assert.equal(cardNotice(query(leadRedirect('k', 'drop'))), null);
  });
});

/**
 * Vollständigkeit der Beschriftungen. Sie ist der Grund, warum eine Karte auf
 * Türkisch nicht plötzlich halb deutsch aussieht: fehlt ein Schlüssel in
 * einer Sprache, fällt es hier auf und nicht beim Kunden.
 */
describe('Beschriftungen', () => {
  test('jede Sprache kennt jede Beschriftung', () => {
    // Dass keine Beschriftung *fehlt*, erzwingt der Übersetzer (LABEL_KEYS).
    // Hier wird geprüft, dass auch keine leer oder noch ein Platzhalter ist.
    for (const lang of CARD_LANGS) {
      for (const key of LABEL_KEYS) {
        const value = label(lang, key);
        assert.ok(value.trim().length > 0, `${lang}: „${key}" ist leer`);
        assert.equal(value, value.trim(), `${lang}: „${key}" hat Leerraum am Rand`);
        assert.equal(/^(TODO|—|\?\?\?)/.test(value), false, `${lang}: „${key}" ist noch nicht übersetzt`);
      }
    }
  });

  test('„für" und „von" setzen den Namen ein — in jeder Sprache', () => {
    for (const lang of CARD_LANGS) {
      for (const key of ['to', 'from'] as const) {
        assert.match(label(lang, key, 'Ayşe'), /Ayşe/, `${lang}: „${key}" verliert den Namen`);
        assert.equal(label(lang, key, 'Ayşe').includes('{n}'), false, `${lang}: „${key}" ersetzt {n} nicht`);
      }
    }
  });

  test('gibt bei einem unbekannten Schlüssel den Schlüssel zurück, nicht leer', () => {
    // So fällt ein Tippfehler beim Zeichnen auf, statt ein leeres Feld zu machen.
    assert.equal(label('de', 'gibtEsNicht' as never), 'gibtEsNicht');
  });

  test('nimmt bei unbekannter Sprache die deutsche Tabelle', () => {
    assert.equal(label('klingonisch' as never, 'phone'), label('de', 'phone'));
  });
});
