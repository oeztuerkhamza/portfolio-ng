import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  guestPatch,
  inviteLinks,
  newEvent,
  newOwnerKey,
  parseRsvp,
  safeUrl,
  sanitizeEvent,
  sanitizePlan,
  validSlug,
} from './invites';
import { demoEvent } from '../app/einladung/invite-demo';
import { epcPayload, validIban } from '../app/einladung/invite.model';

/**
 * Tests der digitalen Einladungen.
 *
 * Die Einladung ist JSON, das der Gastgeber frei bearbeitet und das danach
 * jeder Gast ausgeliefert bekommt. Wichtig ist darum vor allem, was der
 * Server *nicht* durchlässt: fremde Felder, Skript-Adressen, überlange Texte.
 * Ausführen mit `npm run test:server`.
 */

describe('Slug', () => {
  test('nimmt Kleinbuchstaben, Ziffern und Bindestriche', () => {
    assert.ok(validSlug('ayse-daniel-2027'));
    assert.ok(validSlug('kina-elif'));
  });
  test('lehnt Beispiele, die Hülle und Unsinn ab', () => {
    for (const s of ['demo-klassik', 'live', 'ab', 'Ayse', 'a b', '../x', '-start', 'x'.repeat(61), 42]) {
      assert.equal(validSlug(s), false, String(s));
    }
  });
});

describe('Schlüssel', () => {
  test('ist lang, zufällig und URL-tauglich', () => {
    const a = newOwnerKey();
    const b = newOwnerKey();
    assert.notEqual(a, b);
    assert.ok(a.length >= 24);
    assert.match(a, /^[A-Za-z0-9_-]+$/);
  });
  test('steht nur im Fragment des Planer-Links', () => {
    const l = inviteLinks('ayse-daniel', 'K3y_x');
    assert.equal(l.invite, '/einladung/ayse-daniel');
    assert.equal(l.planner, '/einladung/ayse-daniel/planer#k=K3y_x');
  });
});

describe('sanitizeEvent', () => {
  test('ein Beispiel übersteht die Prüfung unverändert im Wesentlichen', () => {
    const demo = demoEvent('klassik');
    const out = sanitizeEvent(demo, 'ayse-daniel');
    assert.equal(out.slug, 'ayse-daniel');
    assert.equal(out.title, demo.title);
    assert.equal(out.schedule.length, demo.schedule.length);
    assert.equal(out.locations[0].name, demo.locations[0].name);
    assert.deepEqual(out.langs, demo.langs);
    assert.equal(out.gifts?.iban, 'DE02120300000000202051');
  });

  test('der Slug kommt vom Server, nie aus dem Inhalt', () => {
    assert.equal(sanitizeEvent({ slug: 'fremd' }, 'meins').slug, 'meins');
  });

  test('nur https-Adressen für Bilder und Musik', () => {
    const out = sanitizeEvent(
      {
        heroImage: 'javascript:alert(1)',
        musicUrl: 'http://example.com/a.mp3',
        gallery: ['https://example.com/a.jpg', 'data:image/png;base64,AAA', 'javascript:x', 7],
      },
      'x-y-z',
    );
    assert.equal(out.heroImage, undefined);
    assert.equal(out.musicUrl, undefined);
    assert.deepEqual(out.gallery, ['https://example.com/a.jpg']);
    assert.equal(safeUrl('https://ok.example/x'), 'https://ok.example/x');
  });

  test('unbekannte Felder und Werte fallen weg', () => {
    const out = sanitizeEvent({ theme: 'hacker', kind: 'party', music: 'metal', langs: ['de', 'xx', 'de'], evil: true }, 'abc') as unknown as Record<string, unknown>;
    assert.equal(out['theme'], 'klassik');
    assert.equal(out['kind'], 'wedding');
    assert.equal(out['music'], 'none');
    assert.deepEqual(out['langs'], ['de']);
    assert.equal('evil' in out, false);
  });

  test('lange Texte werden gekürzt, Listen begrenzt', () => {
    const out = sanitizeEvent({ title: 'x'.repeat(500), schedule: Array.from({ length: 100 }, () => ({ time: '12:00', title: 'a' })) }, 'abc');
    assert.equal(out.title.length, 120);
    assert.equal(out.schedule.length, 30);
  });

  test('Texte je Sprache behalten nur bekannte Sprachen', () => {
    const out = sanitizeEvent({ welcome: { de: 'Hallo', tr: 'Merhaba', xx: 'nope', en: '' } }, 'abc');
    assert.deepEqual(out.welcome, { de: 'Hallo', tr: 'Merhaba' });
  });

  test('kaputtes Datum wird ersetzt statt gespeichert', () => {
    const out = sanitizeEvent({ date: 'morgen', rsvpUntil: '1. Mai' }, 'abc');
    assert.ok(!isNaN(new Date(out.date).getTime()));
    assert.equal(out.rsvpUntil, undefined);
  });
});

describe('newEvent', () => {
  test('übernimmt Gestaltung und Titel, lässt Geschenke und Kontakte leer', () => {
    const e = newEvent('kina-elif', { title: 'Elif & Emre', theme: 'kina', date: '2027-07-09T19:00:00+02:00' });
    assert.equal(e.theme, 'kina');
    assert.equal(e.kind, 'henna');
    assert.equal(e.title, 'Elif & Emre');
    assert.equal(e.gifts, undefined);
    assert.deepEqual(e.contacts, []);
    assert.equal(e.sections.gifts, false);
  });
});

describe('sanitizePlan', () => {
  test('Zahlen begrenzt, Datumsangaben geprüft', () => {
    const p = sanitizePlan({
      tasks: [{ title: 'Location', due: '2027-01-01', done: true }, { title: 'x', due: 'bald' }],
      budget: [{ item: 'DJ', planned: -5, paid: '300' }],
      tables: [{ name: 'Familie', seats: 999 }],
      budgetTotal: 'viel',
    });
    assert.equal(p.tasks[0].done, true);
    assert.equal(p.tasks[1].due, undefined);
    assert.equal(p.budget[0].planned, 0);
    assert.equal(p.budget[0].paid, 300);
    assert.equal(p.tables[0].seats, 100);
    assert.equal(p.budgetTotal, 0);
    assert.ok(p.tasks[0].id.length > 0);
    assert.equal(p.setupDone, false);
  });
  test('merkt sich den abgeschlossenen Einrichtungsassistenten', () => {
    assert.equal(sanitizePlan({ setupDone: true }).setupDone, true);
    assert.equal(sanitizePlan({ setupDone: 'ja' }).setupDone, false);
  });
});

describe('parseRsvp', () => {
  test('Zusage mit Personen und Menü', () => {
    const r = parseRsvp({ name: ' Merve Demir ', status: 'yes', adults: 2, children: 1, menu: 'veggie', song: 'Tarkan' });
    assert.deepEqual(r && { name: r.name, adults: r.adults, children: r.children, menu: r.menu, song: r.song }, {
      name: 'Merve Demir',
      adults: 2,
      children: 1,
      menu: 'veggie',
      song: 'Tarkan',
    });
  });
  test('Absage setzt Personen und Wünsche zurück', () => {
    const r = parseRsvp({ name: 'Clara', status: 'no', adults: 4, menu: 'fish', song: 'x', message: 'Schade!' })!;
    assert.equal(r.adults, 0);
    assert.equal(r.menu, '');
    assert.equal(r.song, null);
    assert.equal(r.message, 'Schade!');
  });
  test('ohne Namen oder Antwort keine Zusage', () => {
    assert.equal(parseRsvp({ name: 'A', status: 'yes' }), null);
    assert.equal(parseRsvp({ name: 'Anna', status: 'invited' }), null);
    assert.equal(parseRsvp(null), null);
  });
  test('Personen nicht über das Maximum der Einladung', () => {
    assert.equal(parseRsvp({ name: 'Familie', status: 'yes', adults: 50 }, 6)!.adults, 6);
  });
  test('nur gültige Codes', () => {
    assert.equal(parseRsvp({ name: 'Anna', status: 'yes', code: "x' or 1=1" })!.code, undefined);
    assert.equal(parseRsvp({ name: 'Anna', status: 'yes', code: 'ab12cd' })!.code, 'ab12cd');
  });
});

describe('guestPatch', () => {
  test('nur übergebene Felder, Spaltennamen der Tabelle', () => {
    assert.deepEqual(guestPatch({ status: 'yes', table: 't1', group: 'Braut' }), { status: 'yes', table_id: 't1', grp: 'Braut' });
    assert.deepEqual(guestPatch({ status: 'boss', id: 'x', event_id: 'y' }), { status: 'invited' });
  });
});

describe('Geschenke', () => {
  test('IBAN-Prüfsumme', () => {
    assert.ok(validIban('DE02 1203 0000 0000 2020 51'));
    assert.equal(validIban('DE02120300000000202052'), false);
  });
  test('GiroCode enthält Empfänger, IBAN und Zweck in der EPC-Reihenfolge', () => {
    const lines = epcPayload({ accountHolder: 'Ayşe Yılmaz', iban: 'DE02 1203 0000 0000 2020 51', bic: 'BYLADEM1001', reference: 'Hochzeit' })!.split('\n');
    assert.equal(lines[0], 'BCD');
    assert.equal(lines[5], 'Ayşe Yılmaz');
    assert.equal(lines[6], 'DE02120300000000202051');
    assert.equal(lines[10], 'Hochzeit');
    assert.equal(epcPayload({ paypal: 'x' }), null);
  });
});
