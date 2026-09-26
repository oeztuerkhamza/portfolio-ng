import { TestBed } from '@angular/core/testing';
import { AdminApi } from '../admin-api.service';
import { CardsTab } from './cards.tab';

/**
 * Tests der Kartenverwaltung. Geprüft wird vor allem, was am Ende an
 * /api/admin/cards geschickt wird — dort steckt die Logik: je Art andere
 * Felder, leere weg, Listen gefiltert.
 */
/** Was die Oberfläche an /api/admin/cards schickt. */
interface CardData {
  company?: string;
  tagline?: string;
  phone?: string;
  headline?: string;
  to?: string;
  songUrl?: string;
  links?: { url: string; label: string; net?: string }[];
  photos?: string[];
  leads?: boolean;
}
/**
 * Eine Karte, wie der Server sie liefert. Die Tests nennen nur, worauf es
 * ihnen ankommt — sonst müsste jeder Test bei jedem neuen Feld nachziehen.
 */
type ServerCard = Parameters<CardsTab['openEdit']>[0];
const cardFixture = (over: Partial<ServerCard> = {}): ServerCard => ({
  id: 'id-1',
  slug: 'k',
  kind: 'business',
  theme: 'brand',
  lang: 'de',
  label: null,
  customer_id: null,
  customer_name: null,
  order_id: null,
  data: {},
  active: true,
  scans_total: 0,
  scans_30d: 0,
  last_scan: null,
  leads_total: 0,
  leads_open: 0,
  ...over,
});

interface CardPayload {
  slug: string;
  label: string | null;
  customer_id: string | null;
  kind: string;
  theme: string;
  lang: string;
  data: CardData;
}

describe('CardsTab', () => {
  let sent: { method: string; path: string; body?: unknown }[];
  /** Was der Server auf die beiden GETs von load() antwortet. */
  let loaded: { cards?: unknown[]; leads?: unknown[] };
  let uploads: { path: string; type: string; size: number }[];
  let uploadFails: boolean;
  let tab: CardsTab;

  class ApiStub {
    async req<T>(method: string, path: string, body?: unknown): Promise<T> {
      sent.push({ method, path, body });
      if (method === 'GET') {
        if (path === '/cards') return (loaded.cards ?? []) as T;
        if (path === '/leads') return (loaded.leads ?? []) as T;
        return [] as T;
      }
      return {} as T;
    }
    async upload<T>(path: string, file: File): Promise<T> {
      uploads.push({ path, type: file.type, size: file.size });
      if (uploadFails) throw new Error('upload_failed');
      return { url: `https://x.supabase.co/storage/v1/object/public/cards/2026/${uploads.length}.png` } as T;
    }
  }

  /** Dateiauswahl nachstellen: `files` ist normalerweise nicht setzbar. */
  function pick(type = 'image/png'): Event {
    const file = new File([new Uint8Array([1, 2, 3, 4])], 'egal.png', { type });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file], writable: true });
    return { target: input } as unknown as Event;
  }

  function emptyPick(): Event {
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [], writable: true });
    return { target: input } as unknown as Event;
  }

  beforeEach(() => {
    sent = [];
    uploads = [];
    uploadFails = false;
    loaded = {};
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CardsTab],
      providers: [{ provide: AdminApi, useClass: ApiStub }],
    });
    tab = TestBed.createComponent(CardsTab).componentInstance;
  });

  /** Absenden nachstellen, ohne ein echtes Formular zu brauchen. */
  async function submit(): Promise<CardPayload> {
    sent = [];
    await tab.save(new Event('submit', { cancelable: true }));
    const post = sent.find((s) => s.method === 'POST');
    expect(post).withContext('POST wurde nicht geschickt').toBeTruthy();
    return post!.body as CardPayload;
  }

  describe('Profil', () => {
    beforeEach(() => {
      tab.kind.set('business');
      tab.slug.set('cafe-krone');
      tab.label.set('Tresen Café Krone');
    });

    it('schickt nur die ausgefüllten Felder', async () => {
      tab.setF('company', 'Café Krone');
      tab.setF('phone', '  +49 761 1  ');
      tab.setF('tagline', '   ');
      const body = await submit();

      expect(body.kind).toBe('business');
      expect(body.slug).toBe('cafe-krone');
      expect(body.data.company).toBe('Café Krone');
      expect(body.data.phone).toBe('+49 761 1', 'wird beschnitten');
      expect('tagline' in body.data).toBeFalse();
    });

    it('nimmt nur Bağlantılar mit Adresse mit und behält das Netzwerk', async () => {
      tab.setF('company', 'X');
      tab.addLink();
      tab.setLink(0, 'net', 'instagram');
      tab.setLink(0, 'url', ' https://instagram.com/x ');
      tab.addLink();
      tab.setLink(1, 'label', 'Ohne Adresse');
      const body = await submit();

      expect(body.data.links).toEqual([{ url: 'https://instagram.com/x', label: '', net: 'instagram' }]);
    });

    it('schickt kein Netzwerk, wenn keines gewählt ist', async () => {
      tab.setF('company', 'X');
      tab.addLink();
      tab.setLink(0, 'label', 'Speisekarte');
      tab.setLink(0, 'url', 'https://krone.de/karte');
      const body = await submit();

      expect(body.data.links?.[0]).toEqual({ url: 'https://krone.de/karte', label: 'Speisekarte' });
    });

    it('entfernt eine Zeile wieder', async () => {
      tab.setF('company', 'X');
      tab.addLink();
      tab.setLink(0, 'url', 'https://a.de');
      tab.addLink();
      tab.setLink(1, 'url', 'https://b.de');
      tab.removeLink(0);
      const body = await submit();

      expect(body.data.links?.map((l) => l.url)).toEqual(['https://b.de']);
    });

    it('schickt keine Geschenkfelder mit', async () => {
      tab.setF('company', 'X');
      tab.setF('headline', 'Sollte nicht mitkommen');
      const body = await submit();
      expect('headline' in body.data).toBeFalse();
    });
  });

  describe('Özel gün', () => {
    beforeEach(() => {
      tab.kind.set('gift');
      tab.slug.set('dogum-gunu');
    });

    it('schickt Überschrift, Namen und Lied', async () => {
      tab.setF('headline', 'Alles Liebe!');
      tab.setF('to', 'Ayşe');
      tab.setF('songUrl', 'https://open.spotify.com/track/abc');
      const body = await submit();

      expect(body.kind).toBe('gift');
      expect(body.data.headline).toBe('Alles Liebe!');
      expect(body.data.to).toBe('Ayşe');
      expect(body.data.songUrl).toBe('https://open.spotify.com/track/abc');
    });

    it('lässt leere Fotozeilen weg', async () => {
      tab.setF('headline', 'H');
      tab.addPhoto();
      tab.setPhoto(0, ' https://cdn.example/1.jpg ');
      tab.addPhoto();
      tab.addPhoto();
      tab.setPhoto(2, 'https://cdn.example/3.jpg');
      const body = await submit();

      expect(body.data.photos).toEqual(['https://cdn.example/1.jpg', 'https://cdn.example/3.jpg']);
    });
  });

  describe('Kurzname vorschlagen', () => {
    it('macht aus deutschen und türkischen Zeichen einen sauberen Kurznamen', () => {
      // Umlaute werden deutsch umschrieben (ü → ue), wie in „NFC linkleri";
      // türkische Buchstaben ohne deutsche Entsprechung werden vereinfacht
      // (ş → s, ğ → g, ı → i, ç → c).
      tab.label.set('Café Müller & Şişli Güneş');
      tab.suggestSlug();
      expect(tab.slug()).toBe('cafe-mueller-sisli-guenes');
    });

    it('lässt einen schon getippten Kurznamen in Ruhe', () => {
      tab.slug.set('selbst-gesetzt');
      tab.label.set('Ganz was anderes');
      tab.suggestSlug();
      expect(tab.slug()).toBe('selbst-gesetzt');
    });

    it('ändert den Kurznamen einer bestehenden Karte nicht', () => {
      tab.editId.set('abc');
      tab.slug.set('');
      tab.label.set('Neue Beschreibung');
      tab.suggestSlug();
      expect(tab.slug()).toBe('');
    });
  });

  describe('Bild yükleme', () => {
    it('yüklenen görselin adresini alana yazar', async () => {
      await tab.upload('avatarUrl', pick());
      expect(uploads.length).toBe(1);
      expect(uploads[0].path).toBe('/cards/upload');
      expect(uploads[0].type).toBe('image/png');
      expect(tab.f('avatarUrl')).toContain('/storage/v1/object/public/cards/');
      expect(tab.uploading()).toBe('', 'bitince kilit açılır');
    });

    it('galeride doğru satıra yazar', async () => {
      tab.addPhoto();
      tab.addPhoto();
      await tab.uploadPhoto(1, pick());
      expect(tab.photos()[0]).toBe('', 'ilk satır dokunulmaz');
      expect(tab.photos()[1]).toContain('/public/cards/');
    });

    it('dosya seçilmediyse hiçbir şey yapmaz', async () => {
      await tab.upload('logoUrl', emptyPick());
      expect(uploads.length).toBe(0);
      expect(tab.f('logoUrl')).toBe('');
    });

    it('hata olursa alanı bozmaz ve hatayı gösterir', async () => {
      tab.setF('logoUrl', 'https://eski.example/logo.png');
      uploadFails = true;
      await tab.upload('logoUrl', pick());
      expect(tab.f('logoUrl')).toBe('https://eski.example/logo.png', 'eski adres korunur');
      expect(tab.error()).not.toBe('');
      expect(tab.uploading()).toBe('', 'hata sonrası da kilit açılır');
    });
  });

  describe('Thema', () => {
    it('nimmt nur bekannte Themen', () => {
      tab.setTheme('dark');
      expect(tab.theme()).toBe('dark');
      tab.setTheme('quatsch');
      expect(tab.theme()).toBe('dark', 'unbekanntes Thema wird ignoriert');
    });
  });

  describe('Bearbeiten', () => {
    it('lädt eine Karte ins Formular und schickt sie unverändert zurück', async () => {
      const card = cardFixture({
        id: 'id-1',
        slug: 'cafe-krone',
        kind: 'business' as const,
        theme: 'dark' as const,
        label: 'Tresen',
        customer_id: null,
        customer_name: null,
        active: true,
        scans_total: 0,
        scans_30d: 0,
        last_scan: null,
        data: {
          company: 'Café Krone',
          phone: '+49 761 1',
          links: [{ net: 'instagram', label: 'Insta', url: 'https://instagram.com/x' }],
        },
      });
      await tab.openEdit(card);

      expect(tab.kind()).toBe('business');
      expect(tab.theme()).toBe('dark');
      expect(tab.f('company')).toBe('Café Krone');
      expect(tab.links()).toEqual([{ net: 'instagram', label: 'Insta', url: 'https://instagram.com/x' }]);

      sent = [];
      await tab.save(new Event('submit', { cancelable: true }));
      const patch = sent.find((s) => s.method === 'PATCH');
      expect(patch?.path).toBe('/cards/id-1', 'bestehende Karte wird geändert, nicht neu angelegt');
      const body = patch!.body as CardPayload;
      expect(body.data.company).toBe('Café Krone');
      expect(body.data.links).toEqual([{ url: 'https://instagram.com/x', label: 'Insta', net: 'instagram' }]);
    });

    it('lädt die Bildergalerie einer Geschenkkarte', async () => {
      await tab.openEdit(
        cardFixture({
          id: 'id-2', slug: 'g', kind: 'gift', theme: 'warm',
          data: { headline: 'H', photos: ['https://cdn.example/1.jpg', 'https://cdn.example/2.jpg'] },
        }),
      );
      expect(tab.photos()).toEqual(['https://cdn.example/1.jpg', 'https://cdn.example/2.jpg']);
      expect(tab.f('headline')).toBe('H');
    });
  });

  describe('Kart dili', () => {
    beforeEach(() => {
      tab.kind.set('business');
      tab.slug.set('k');
      tab.setF('company', 'Krone');
    });

    it('schickt Deutsch, solange nichts gewählt wurde', async () => {
      expect((await submit()).lang).toBe('de');
    });

    it('schickt die gewählte Sprache mit', async () => {
      tab.setLang('tr');
      expect((await submit()).lang).toBe('tr');
    });

    it('nimmt keine Sprache an, die die Karte nicht kennt', async () => {
      tab.setLang('tr');
      tab.setLang('klingonisch');
      expect(tab.lang()).toBe('tr', 'unbekannte Sprache darf die gewählte nicht überschreiben');
    });

    it('lädt die Sprache einer bestehenden Karte in das Formular', async () => {
      await tab.openEdit(cardFixture({ lang: 'fr', data: { company: 'K' } }));
      expect(tab.lang()).toBe('fr');
    });

    it('nimmt Deutsch an, wenn eine alte Karte keine Sprache hat', async () => {
      await tab.openEdit(cardFixture({ lang: undefined as never, data: { company: 'K' } }));
      expect(tab.lang()).toBe('de');
    });
  });

  describe('Ziyaretçi bilgi formu', () => {
    beforeEach(() => {
      tab.kind.set('business');
      tab.slug.set('k');
      tab.setF('company', 'Krone');
    });

    it('ist aus, solange niemand ihn einschaltet', async () => {
      const body = await submit();
      expect('leads' in body.data).withContext('wir sammeln keine Daten, weil es technisch geht').toBeFalse();
    });

    it('schickt ein echtes Ja, wenn er eingeschaltet ist', async () => {
      tab.leads.set(true);
      expect((await submit()).data.leads).toBeTrue();
    });

    it('lädt den Schalter aus einer bestehenden Karte', async () => {
      await tab.openEdit(cardFixture({ data: { company: 'K', leads: true } }));
      expect(tab.leads()).toBeTrue();

      await tab.openEdit(cardFixture({ data: { company: 'K' } }));
      expect(tab.leads()).toBeFalse();
    });

    it('bleibt auf einer Geschenkkarte weg', async () => {
      tab.kind.set('gift');
      tab.setF('headline', 'Alles Gute');
      tab.leads.set(true);
      const body = await submit();
      expect('leads' in body.data).withContext('eine Geschenkkarte sammelt keine Kontakte').toBeFalse();
    });

    it('setzt den Schalter für eine neue Karte zurück', async () => {
      tab.leads.set(true);
      await tab.openNew();
      expect(tab.leads()).toBeFalse();
    });
  });

  describe('Bırakılan bilgiler', () => {
    const lead = (over: Record<string, unknown> = {}) => ({
      id: 'l1',
      created_at: '2026-09-26T10:00:00Z',
      card_id: 'id-1',
      card_slug: 'k',
      card_label: null,
      name: 'Ayşe',
      email: 'a@b.de',
      phone: null,
      company: null,
      message: null,
      device: 'ios',
      handled: false,
      ...over,
    });

    it('holt Karten und Kontakte in einem Rutsch', async () => {
      loaded = { cards: [], leads: [lead()] };
      await tab.ngOnInit();
      expect(sent.filter((s) => s.method === 'GET').map((s) => s.path)).toEqual(['/cards', '/leads']);
      expect(tab.leadList().length).toBe(1);
    });

    it('zählt, wie viele noch offen sind', async () => {
      loaded = { cards: [], leads: [lead({ id: 'a' }), lead({ id: 'b', handled: true }), lead({ id: 'c' })] };
      await tab.ngOnInit();
      expect(tab.openLeads()).toBe(2);
    });

    it('hakt einen Kontakt ab und lädt danach neu', async () => {
      loaded = { cards: [], leads: [lead()] };
      await tab.ngOnInit();
      sent = [];
      await tab.markLead(tab.leadList()[0], true);

      const patch = sent.find((s) => s.method === 'PATCH');
      expect(patch?.path).toBe('/leads/l1');
      expect(patch?.body).toEqual({ handled: true });
      // Nach dem Abhaken muss die Zahl am Kärtchen stimmen: also neu laden.
      expect(sent.some((s) => s.method === 'GET' && s.path === '/leads')).toBeTrue();
    });

    it('löscht nur nach Rückfrage', async () => {
      loaded = { cards: [], leads: [lead()] };
      await tab.ngOnInit();

      spyOn(window, 'confirm').and.returnValue(false);
      sent = [];
      await tab.removeLead(tab.leadList()[0]);
      expect(sent.some((s) => s.method === 'DELETE')).toBeFalse();

      (window.confirm as jasmine.Spy).and.returnValue(true);
      await tab.removeLead(tab.leadList()[0]);
      expect(sent.find((s) => s.method === 'DELETE')?.path).toBe('/leads/l1');
    });

    it('bleibt ohne Kontakte still', async () => {
      loaded = { cards: [], leads: [] };
      await tab.ngOnInit();
      expect(tab.leadList()).toEqual([]);
      expect(tab.openLeads()).toBe(0);
    });
  });
});
