import assert from 'node:assert/strict';
import { afterEach, describe, test } from 'node:test';
import { euro, mailer, orderConfirmation, type OrderMailData } from './mail';

/**
 * Tests des Postausgangs und der Bestellbestätigung.
 * Ausführen mit `npm run test:server`.
 */

const SMTP = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'SMTP_PORT'];
afterEach(() => {
  for (const k of SMTP) delete process.env[k];
});

const base: OrderMailData = {
  orderId: '11111111-2222-3333-4444-555555555555',
  customerName: 'Café Krone',
  items: [
    { label: 'NFC-Karte', qty: 2, unit_price: 39 },
    { label: 'Tischaufsteller', qty: 1, unit_price: 69 },
  ],
  amountTotal: 147,
  siteUrl: 'https://breisgau-digital.de',
  sender: {
    company: 'Breisgau Digital',
    owner: 'Hamza Öztürk',
    phone: '+49 155 66859378',
    web: 'breisgau-digital.de',
  },
};

describe('mailer', () => {
  test('bleibt aus, solange SMTP nicht vollständig eingerichtet ist', () => {
    assert.equal(mailer(), null);

    process.env['SMTP_HOST'] = 'mail.example.com';
    assert.equal(mailer(), null, 'nur Host reicht nicht');

    process.env['SMTP_USER'] = 'info@example.com';
    assert.equal(mailer(), null, 'ohne Passwort kein Versand');
  });

  test('richtet den Postausgang ein, sobald alles gesetzt ist', () => {
    process.env['SMTP_HOST'] = 'mail.example.com';
    process.env['SMTP_USER'] = 'info@example.com';
    process.env['SMTP_PASS'] = 'geheim';
    assert.notEqual(mailer(), null);
  });
});

describe('euro', () => {
  test('schreibt Beträge deutsch', () => {
    assert.match(euro(147), /147,00/);
    assert.match(euro(0), /0,00/);
    assert.match(euro('39'), /39,00/);
    assert.match(euro(undefined), /0,00/);
  });
});

describe('orderConfirmation', () => {
  test('nennt Bestellnummer und Firma im Betreff', () => {
    const { subject } = orderConfirmation(base);
    assert.equal(subject, 'Bestellbestätigung 11111111 – Breisgau Digital');
  });

  test('führt jede Position mit Menge und Zeilensumme auf', () => {
    const { text } = orderConfirmation(base);
    assert.match(text, /2 × NFC-Karte — 78,00/);
    assert.match(text, /1 × Tischaufsteller — 69,00/);
    assert.match(text, /Gesamt: 147,00/);
  });

  test('nennt die volle Bestellnummer im Text', () => {
    assert.match(orderConfirmation(base).text, /Bestellnummer: 11111111-2222-3333-4444-555555555555/);
  });

  test('erfüllt die Bestätigung in Textform: § 19 UStG, Ablauf, Widerrufs-Ausnahme', () => {
    const { text } = orderConfirmation(base);
    assert.match(text, /§ 19 UStG/);
    assert.match(text, /Freigabe/);
    assert.match(text, /kostenlos stornieren/);
    assert.match(text, /§ 312g Abs\. 2 Nr\. 1 BGB/);
    assert.match(text, /5 bis\n10 Werktage|5 bis 10 Werktage/);
  });

  test('verlinkt die drei Pflichtseiten', () => {
    const { text } = orderConfirmation(base);
    assert.match(text, /AGB: https:\/\/breisgau-digital\.de\/de\/agb/);
    assert.match(text, /Widerrufsbelehrung: https:\/\/breisgau-digital\.de\/de\/widerruf/);
    assert.match(text, /Versand und Zahlung: https:\/\/breisgau-digital\.de\/de\/versand/);
  });

  test('doppelt den Schrägstrich der Adresse nicht', () => {
    const { text } = orderConfirmation({ ...base, siteUrl: 'https://breisgau-digital.de/' });
    assert.match(text, /https:\/\/breisgau-digital\.de\/de\/agb/);
    assert.equal(text.includes('.de//de/'), false);
  });

  test('grüßt mit Namen, wenn Stripe einen geliefert hat', () => {
    assert.match(orderConfirmation(base).text, /^Guten Tag Café Krone,/);
  });

  test('grüßt ohne Namen, wenn keiner da ist', () => {
    for (const name of [null, undefined, '', '   ']) {
      const { text } = orderConfirmation({ ...base, customerName: name });
      assert.match(text, /^Guten Tag,/, `Name: ${JSON.stringify(name)}`);
    }
  });

  test('setzt die Absenderangaben unter den Gruß', () => {
    const { text } = orderConfirmation(base);
    assert.match(text, /Mit freundlichen Grüßen\nHamza Öztürk\nBreisgau Digital/);
    assert.match(text, /\+49 155 66859378/);
  });

  test('lässt leere Absenderfelder weg, statt Leerzeilen zu schreiben', () => {
    const { text, subject } = orderConfirmation({ ...base, sender: {} });
    assert.equal(subject, 'Bestellbestätigung 11111111 – Breisgau Digital');
    assert.match(text, /Mit freundlichen Grüßen\nBreisgau Digital$/);
  });

  test('übernimmt einen eigenen Grußtext aus dem Profil', () => {
    const { text } = orderConfirmation({ ...base, sender: { ...base.sender, closing: 'Herzliche Grüße' } });
    assert.match(text, /Herzliche Grüße\nHamza Öztürk/);
  });

  test('kommt mit einer leeren Positionsliste aus', () => {
    const { text } = orderConfirmation({ ...base, items: [], amountTotal: 0 });
    assert.match(text, /Gesamt: 0,00/);
  });
});
