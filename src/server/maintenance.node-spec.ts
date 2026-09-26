import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  alwaysOpen,
  langOf,
  maintenanceHtml,
  newToken,
  parseMaintenance,
  sameHash,
  sha256Hex,
} from './maintenance';

/**
 * Tests des Wartungsmodus.
 *
 * Die Freiliste ist hier das Wichtigste, und sie kann in beide Richtungen
 * falsch sein: zu eng sperrt den Inhaber aus seinem Portal aus und
 * verschluckt den Stripe-Webhook — dann hat ein Kunde bezahlt und die
 * Bestellung bleibt für immer offen. Zu weit lässt die Website offen,
 * obwohl der Schalter an ist.
 * Ausführen mit `npm run test:server`.
 */

describe('alwaysOpen — was trotz Wartung durchkommt', () => {
  test('lässt die eigene API durch — darunter den Stripe-Webhook', () => {
    for (const p of ['/api', '/api/', '/api/shop', '/api/stripe/webhook', '/api/admin/settings', '/api/cron/cleanup'])
      assert.equal(alwaysOpen(p), true, p);
  });

  test('lässt das Portal durch — sonst könnte niemand abschalten', () => {
    for (const p of ['/admin', '/admin/', '/admin/anything']) assert.equal(alwaysOpen(p), true, p);
  });

  test('lässt die Seiten verkaufter NFC-Karten durch', () => {
    for (const p of ['/k/cafe-krone', '/k/cafe-krone/kontakt', '/k/cafe-krone/kontakt.vcf', '/r/cafe-muster'])
      assert.equal(alwaysOpen(p), true, p);
  });

  test('lässt Dateien durch, damit die Wartungsseite nichts vermisst', () => {
    for (const p of ['/assets/images/logo/breisgau-digital.svg', '/main-ABC123.js', '/styles.css', '/favicon.ico', '/sitemap.xml', '/robots.txt'])
      assert.equal(alwaysOpen(p), true, p);
  });

  test('lässt /.well-known durch — daran hängen Zertifikate', () => {
    assert.equal(alwaysOpen('/.well-known/acme-challenge/xyz'), true);
  });

  test('achtet nicht auf Groß- und Kleinschreibung', () => {
    assert.equal(alwaysOpen('/API/shop'), true);
    assert.equal(alwaysOpen('/Admin'), true);
  });
});

describe('alwaysOpen — was die Wartungsseite bekommt', () => {
  test('die Seiten der Website', () => {
    for (const p of ['/', '/de', '/de/', '/de/bewertungskarten', '/de/bewertungskarten/karte', '/tr/abo', '/fr/contact', '/de/orte/freiburg'])
      assert.equal(alwaysOpen(p), false, p);
  });

  /**
   * Der Verdacht, den man prüfen muss: eine Adresse, die nur *aussieht* wie
   * eine freie. „/apitest" ist keine API, „/administrator" kein Portal.
   */
  test('nimmt keine Adresse, die nur ähnlich aussieht', () => {
    for (const p of ['/apitest', '/api-docs', '/administrator', '/admin-neu', '/kontakt', '/karten', '/reviews', '/de/api'])
      assert.equal(alwaysOpen(p), false, p);
  });

  test('nimmt keinen Punkt im Pfad für eine Dateiendung', () => {
    // Der Punkt steht nicht im letzten Abschnitt — das ist keine Datei.
    assert.equal(alwaysOpen('/de/v1.2/seite'), false);
    assert.equal(alwaysOpen('/de/seite.html'), true);
  });
});

describe('parseMaintenance', () => {
  test('liest den gespeicherten Zustand', () => {
    const s = parseMaintenance({ on: true, since: '2026-09-26T10:00:00Z', message: 'Gleich zurück', token: 'abc123' });
    assert.equal(s.on, true);
    assert.equal(s.message, 'Gleich zurück');
    assert.equal(s.token, 'abc123');
  });

  /**
   * Die wichtigste Eigenschaft: eine kaputte Zeile darf die Website nicht
   * abschalten. Im Zweifel ist sie offen.
   */
  test('bleibt bei Unsinn aus', () => {
    for (const bad of [null, undefined, {}, 'nein', 42, [], { on: 'true' }, { on: 1 }])
      assert.equal(parseMaintenance(bad).on, false, JSON.stringify(bad));
  });

  test('kürzt die Zeile und wirft Leerraum weg', () => {
    assert.equal(parseMaintenance({ message: '   ' }).message, null);
    assert.equal(parseMaintenance({ message: '  hallo  ' }).message, 'hallo');
    assert.equal(parseMaintenance({ message: 'a'.repeat(500) }).message?.length, 200);
  });
});

describe('Kennwort für die Umgehung', () => {
  test('ist lang genug und nicht zu erraten', () => {
    const a = newToken();
    assert.match(a, /^[0-9a-f]{32}$/);
    assert.notEqual(a, newToken());
  });

  test('der Hashwert ist stabil und verrät das Kennwort nicht', async () => {
    const token = 'geheim123';
    const hash = await sha256Hex(token);
    assert.match(hash, /^[0-9a-f]{64}$/);
    assert.equal(hash, await sha256Hex(token));
    assert.notEqual(hash, await sha256Hex('geheim124'));
    assert.ok(!hash.includes(token));
  });

  test('vergleicht gleiche Werte als gleich und andere als anders', () => {
    assert.equal(sameHash('abc', 'abc'), true);
    assert.equal(sameHash('abc', 'abd'), false);
    assert.equal(sameHash('', ''), true);
  });

  /**
   * Beide Richtungen, und die zweite ist die gefährliche: ohne die
   * Längenprüfung liefe der Vergleich nur über den kürzeren Wert und ein
   * Anfangsstück würde als Treffer gelten.
   */
  test('nimmt kein Anfangsstück für den ganzen Wert', () => {
    assert.equal(sameHash('abc', 'ab'), false);
    assert.equal(sameHash('ab', 'abc'), false);
    assert.equal(sameHash('', 'a'), false);
    assert.equal(sameHash('a', ''), false);
  });
});

describe('langOf', () => {
  test('erkennt die fünf Sprachen am Präfix', () => {
    for (const l of ['de', 'fr', 'en', 'tr', 'ku'] as const) {
      assert.equal(langOf(`/${l}`), l);
      assert.equal(langOf(`/${l}/bewertungskarten`), l);
    }
  });

  test('fällt auf Deutsch zurück, statt zu raten', () => {
    for (const p of ['/', '/xx/seite', '/bewertungskarten', '/deutsch/seite']) assert.equal(langOf(p), 'de');
  });
});

describe('maintenanceHtml', () => {
  test('spricht die Sprache des Besuchers', () => {
    assert.match(maintenanceHtml('/tr/abo', null), /Hemen döneceğiz/);
    assert.match(maintenanceHtml('/fr/contact', null), /reviendrons|revenons/);
    assert.match(maintenanceHtml('/de/', null), /Wir sind gleich zurück/);
    assert.match(maintenanceHtml('/de/', null), /<html lang="de">/);
    assert.match(maintenanceHtml('/ku/', null), /<html lang="ku">/);
  });

  test('zeigt die eigene Zeile, wenn eine da ist', () => {
    assert.match(maintenanceHtml('/de/', 'Ab 14 Uhr wieder da'), /Ab 14 Uhr wieder da/);
    assert.ok(!maintenanceHtml('/de/', null).includes('class="note"'));
  });

  test('maskiert die eigene Zeile — sie kommt aus einem Eingabefeld', () => {
    const html = maintenanceHtml('/de/', '<script>alert(1)</script>');
    assert.ok(!html.includes('<script>alert'));
    assert.match(html, /&lt;script&gt;/);
  });

  /**
   * Bei Wartungsarbeiten ist eine Seite, die noch Dateien nachladen muss,
   * das Letzte, was man haben will.
   */
  test('lädt nichts nach', () => {
    const html = maintenanceHtml('/de/', 'Text');
    assert.ok(!/<img|<script src|<link rel="stylesheet"/.test(html));
    assert.match(html, /<style>/);
  });

  test('nennt einen Weg, uns zu erreichen', () => {
    assert.match(maintenanceHtml('/de/', null), /info@breisgau-digital\.de/);
  });
});
