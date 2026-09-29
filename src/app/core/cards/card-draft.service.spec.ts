import { TestBed } from '@angular/core/testing';
import { MAX_LINKS, MAX_PHOTOS } from './card-draft.model';
import { CardDraftService } from './card-draft.service';

/**
 * Der Entwurf des Kartengestalters.
 *
 * Zwei Dinge sind hier wichtig genug für Tests. Erstens der Speicher: wer
 * einen Bogen mit Logo, Adresse und acht Links gefüllt hat und die Seite neu
 * lädt, darf nicht von vorn anfangen — und ein alter oder mutwillig
 * veränderter Speicher darf den Bogen nicht mit `undefined` in Eingabefeldern
 * begrüßen. Zweitens `payload()`: was dort herauskommt, fährt mit der
 * Bestellung mit und wird zur Karte, die der Kunde bekommt.
 * Ausführen mit `npm test`.
 */

const STORE_KEY = 'bd.carddraft.v1';

describe('CardDraftService', () => {
  let drafts: CardDraftService;

  function mount(stored?: unknown): void {
    localStorage.removeItem(STORE_KEY);
    if (stored !== undefined) localStorage.setItem(STORE_KEY, JSON.stringify(stored));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    drafts = TestBed.inject(CardDraftService);
  }

  afterEach(() => localStorage.removeItem(STORE_KEY));

  describe('Entwurf füllen', () => {
    beforeEach(() => mount());

    it('beginnt leer und ohne fertige Art', () => {
      expect(drafts.draft().business.company).toBe('');
      expect(drafts.draft().gift.headline).toBe('');
      expect(drafts.ready()).toEqual([]);
      expect(drafts.payload()).toEqual({});
    });

    it('hält beide Arten nebeneinander — ein Wechsel wirft nichts weg', () => {
      drafts.setBusiness('company', 'Café Krone');
      drafts.setGift('headline', 'Alles Gute!');
      expect(drafts.draft().business.company).toBe('Café Krone');
      expect(drafts.draft().gift.headline).toBe('Alles Gute!');
    });

    it('meldet eine Art erst als fertig, wenn ihr Pflichtfeld steht', () => {
      expect(drafts.readyFor('business')).toBeFalse();
      drafts.setBusiness('tagline', 'Kaffee seit 1931');
      expect(drafts.readyFor('business')).toBeFalse();
      drafts.setBusiness('company', 'Café Krone');
      expect(drafts.readyFor('business')).toBeTrue();
    });

    it('zählt Leerzeichen nicht als Firmenname', () => {
      drafts.setBusiness('company', '   ');
      expect(drafts.readyFor('business')).toBeFalse();
    });

    it('nimmt nur bekannte Farbschemata an', () => {
      drafts.setTheme('dark');
      expect(drafts.theme()).toBe('dark');
      drafts.setTheme('regenbogen' as never);
      expect(drafts.theme()).toBe('dark');
    });

    it('setzt eine Art zurück und lässt die andere stehen', () => {
      drafts.setBusiness('company', 'Café Krone');
      drafts.setGift('headline', 'Alles Gute!');
      drafts.reset('business');
      expect(drafts.draft().business.company).toBe('');
      expect(drafts.draft().gift.headline).toBe('Alles Gute!');
    });
  });

  describe('Links und Bilder', () => {
    beforeEach(() => mount());

    it('legt Links an, ändert und entfernt sie', () => {
      drafts.addLink();
      drafts.setLink(0, { net: 'instagram', url: 'https://instagram.com/krone' });
      expect(drafts.draft().business.links[0].net).toBe('instagram');
      drafts.removeLink(0);
      expect(drafts.draft().business.links.length).toBe(0);
    });

    it('lässt einen Griff ins Leere nichts kaputt machen', () => {
      drafts.setLink(3, { url: 'https://example.com' });
      drafts.removeLink(3);
      drafts.setPhoto(2, 'https://example.com/a.jpg');
      drafts.removePhoto(2);
      expect(drafts.draft().business.links).toEqual([]);
      expect(drafts.draft().gift.photos).toEqual([]);
    });

    it('hält sich an die Grenzen des Servers', () => {
      for (let n = 0; n < MAX_LINKS + 3; n++) drafts.addLink();
      for (let n = 0; n < MAX_PHOTOS + 3; n++) drafts.addPhoto();
      expect(drafts.draft().business.links.length).toBe(MAX_LINKS);
      expect(drafts.draft().gift.photos.length).toBe(MAX_PHOTOS);
    });
  });

  describe('payload — was mit der Bestellung mitfährt', () => {
    beforeEach(() => mount());

    it('schickt nur Arten, deren Pflichtfeld steht', () => {
      drafts.setBusiness('company', 'Café Krone');
      drafts.setGift('to', 'Mira');
      expect(Object.keys(drafts.payload())).toEqual(['business']);
    });

    it('lässt leere Felder weg, statt leere Zeichenketten zu schicken', () => {
      drafts.setBusiness('company', 'Café Krone');
      const data = drafts.payloadFor('business');
      expect(data['company']).toBe('Café Krone');
      expect('tagline' in data).toBeFalse();
      expect('leads' in data).toBeFalse();
    });

    it('schneidet Leerzeichen ab', () => {
      drafts.setBusiness('company', '  Café Krone  ');
      expect(drafts.payloadFor('business')['company']).toBe('Café Krone');
    });

    it('lässt Links ohne Adresse weg — das ist eine leere Zeile, kein Link', () => {
      drafts.setBusiness('company', 'Café Krone');
      drafts.addLink();
      drafts.addLink();
      drafts.setLink(1, { url: 'https://instagram.com/krone', net: 'instagram' });
      const links = drafts.payloadFor('business')['links'] as unknown[];
      expect(links.length).toBe(1);
    });

    it('nimmt den Schalter für den Kontaktbogen nur mit, wenn er an ist', () => {
      drafts.setBusiness('company', 'Café Krone');
      expect('leads' in drafts.payloadFor('business')).toBeFalse();
      drafts.setBusiness('leads', true);
      expect(drafts.payloadFor('business')['leads']).toBeTrue();
    });

    it('lässt leere Bildzeilen weg', () => {
      drafts.setGift('headline', 'Alles Gute!');
      drafts.addPhoto();
      drafts.addPhoto();
      drafts.setPhoto(0, 'https://example.com/a.jpg');
      expect(drafts.payloadFor('gift')['photos']).toEqual(['https://example.com/a.jpg']);
    });
  });

  describe('Speicher', () => {
    it('findet den Entwurf nach einem Neuladen wieder', () => {
      mount();
      drafts.setBusiness('company', 'Café Krone');
      drafts.setTheme('warm');
      mount(JSON.parse(localStorage.getItem(STORE_KEY)!));
      expect(drafts.draft().business.company).toBe('Café Krone');
      expect(drafts.theme()).toBe('warm');
    });

    it('füllt fehlende Felder eines alten Speichers auf', () => {
      mount({ business: { company: 'Café Krone' } });
      expect(drafts.draft().business.tagline).toBe('');
      expect(drafts.draft().business.links).toEqual([]);
      expect(drafts.draft().gift.headline).toBe('');
      expect(drafts.theme()).toBe('brand');
    });

    it('wirft weg, was im Speicher nicht hingehört', () => {
      mount({
        theme: 'regenbogen',
        business: { company: 42, leads: 'ja', links: [{ net: 'myspace', url: 'https://x' }] },
        gift: { photos: 'kein array' },
      });
      expect(drafts.draft().theme).toBe('brand');
      expect(drafts.draft().business.company).toBe('');
      expect(drafts.draft().business.leads).toBeFalse();
      expect(drafts.draft().business.links[0].net).toBe('');
      expect(drafts.draft().gift.photos).toEqual([]);
    });

    it('beginnt leer, wenn im Speicher Unsinn steht', () => {
      localStorage.setItem(STORE_KEY, '{kaputt');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      expect(TestBed.inject(CardDraftService).draft().business.company).toBe('');
    });

    it('kappt zu lange Listen aus dem Speicher', () => {
      mount({
        business: { links: Array.from({ length: 30 }, () => ({ url: 'https://x' })) },
        gift: { photos: Array.from({ length: 30 }, () => 'https://x') },
      });
      expect(drafts.draft().business.links.length).toBe(MAX_LINKS);
      expect(drafts.draft().gift.photos.length).toBe(MAX_PHOTOS);
    });
  });
});
