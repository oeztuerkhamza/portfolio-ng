import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { REVIEW_CARD_PRODUCTS } from '../../core/data/review-cards.data';
import { TRANSLATIONS } from '../../core/i18n/translations';
import { CartService } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { ProduktComponent } from './produkt.component';

/**
 * Tests der Produktseite /bewertungskarten/<kurzname>.
 *
 * Wichtig sind drei Dinge: der Knopf legt die richtige Zeile in den Warenkorb
 * (ein falscher Schlüssel würde beim Bezahlen ein anderes Produkt abrechnen),
 * ein unbekannter Kurzname landet nicht im Suchindex, und bei geschlossenem
 * Shop bleibt ein Weg zum Bestellen übrig.
 * Ausführen mit `npm test`.
 */

/** Ersatz für den Shop-Schalter, der sonst /api/shop abfragt. */
class ShopStatusStub {
  readonly enabled = signal(true);
  readonly checked = signal(true);
  check(): void {
    /* im Test schon entschieden */
  }
}

describe('ProduktComponent', () => {
  let fixture: ComponentFixture<ProduktComponent>;
  let component: ProduktComponent;
  let shop: ShopStatusStub;
  let cart: CartService;

  function mount(produkt: string): void {
    localStorage.removeItem('bd.cart.v1');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ProduktComponent],
      providers: [
        provideRouter([]),
        { provide: ShopStatus, useClass: ShopStatusStub },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['produkt', produkt]]) } } },
      ],
    });
    fixture = TestBed.createComponent(ProduktComponent);
    component = fixture.componentInstance;
    shop = TestBed.inject(ShopStatus) as unknown as ShopStatusStub;
    cart = TestBed.inject(CartService);
    fixture.detectChanges();
  }

  afterEach(() => localStorage.removeItem('bd.cart.v1'));

  const el = <T extends Element>(sel: string): T | null => fixture.nativeElement.querySelector(sel);
  const all = (sel: string): Element[] => Array.from(fixture.nativeElement.querySelectorAll(sel));
  const text = (sel: string) => el(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const html = () => (fixture.nativeElement as HTMLElement).innerHTML;

  const keychain = REVIEW_CARD_PRODUCTS.find((p) => p.slug === 'schluesselanhaenger')!;
  const bundle = REVIEW_CARD_PRODUCTS.find((p) => p.slug === 'paket-tresen')!;

  describe('vorhandenes Produkt', () => {
    beforeEach(() => mount('schluesselanhaenger'));

    it('zeigt Name, Preis und den eigenen Text', () => {
      expect(text('h1')).toBe('Schlüsselanhänger');
      expect(text('.pd-price')).toContain(String(keychain.price));
      expect(text('.pd-text')).toContain('unterwegs');
    });

    it('legt genau die Katalogzeile dieses Produkts in den Warenkorb', () => {
      el<HTMLButtonElement>('.pd-actions button')!.click();
      fixture.detectChanges();
      expect(cart.qtyOf(keychain.key)).toBe(1);
      // Nichts anderes darf mitgewandert sein.
      expect(cart.lines().map((l) => l.key)).toEqual([keychain.key]);
    });

    it('tauscht den Knopf gegen den Mengenwähler, sobald etwas im Korb ist', () => {
      expect(el('.pd-stepper')).toBeNull();
      el<HTMLButtonElement>('.pd-actions button')!.click();
      fixture.detectChanges();
      const stepper = el('.pd-stepper')!;
      expect(stepper).not.toBeNull();
      expect(stepper.querySelector('output')!.textContent!.trim()).toBe('1');
    });

    it('zählt mit dem Mengenwähler hoch und wieder auf null herunter', () => {
      el<HTMLButtonElement>('.pd-actions button')!.click();
      fixture.detectChanges();
      const plus = all('.pd-stepper button')[1] as HTMLButtonElement;
      plus.click();
      fixture.detectChanges();
      expect(cart.qtyOf(keychain.key)).toBe(2);

      const minus = () => all('.pd-stepper button')[0] as HTMLButtonElement;
      minus().click();
      fixture.detectChanges();
      minus().click();
      fixture.detectChanges();
      expect(cart.qtyOf(keychain.key)).toBe(0);
      expect(el('.pd-stepper')).toBeNull();
    });

    it('verlinkt jedes andere Produkt, aber nicht sich selbst', () => {
      const hrefs = all('.pd-more a').map((a) => a.getAttribute('href'));
      expect(hrefs.length).toBe(REVIEW_CARD_PRODUCTS.length - 1);
      expect(hrefs).not.toContain('/de/bewertungskarten/schluesselanhaenger');
      expect(hrefs).toContain('/de/bewertungskarten/paket-team');
    });

    it('bietet keine E-Mail-Anfrage an, solange der Shop offen ist', () => {
      expect(html()).not.toContain('mailto:');
    });
  });

  describe('Paket', () => {
    beforeEach(() => mount('paket-tresen'));

    it('listet auf, was drin ist', () => {
      const items = all('.pd-side .check-list li').map((li) => li.textContent!.replace(/\s+/g, ' ').trim());
      expect(items[0]).toContain(String(bundle.cards));
      // Das Tresen-Paket bringt einen Aufsteller mit. Verglichen wird mit dem
      // Text aus der Tabelle, nicht mit einer abgeschriebenen Zeile — sonst
      // bricht der Test, sobald jemand die Formulierung glättet.
      expect(items).toContain(TRANSLATIONS['rc.unit.stand'].de);
      // Die Punkte des Pakets stehen alle da.
      for (let n = 1; n <= bundle.points!; n++) {
        expect(items).toContain(TRANSLATIONS[`rc.pkg.${bundle.id}.p${n}`].de);
      }
    });

    it('legt den Paketschlüssel in den Korb, nicht den einer Einzelkarte', () => {
      el<HTMLButtonElement>('.pd-actions button')!.click();
      fixture.detectChanges();
      expect(cart.qtyOf(bundle.key)).toBe(1);
      expect(bundle.key.startsWith('pkg.')).toBeTrue();
    });
  });

  describe('geschlossener Shop', () => {
    beforeEach(() => {
      mount('karte');
      shop.enabled.set(false);
      fixture.detectChanges();
    });

    it('lässt die Anfrage per E-Mail übrig, statt die Seite ohne Weg zu lassen', () => {
      const ask = el<HTMLAnchorElement>('.pd-actions a[href^="mailto:"]');
      expect(ask).not.toBeNull();
      expect(decodeURIComponent(ask!.href)).toContain('NFC-Karte');
      expect(text('.pd-note')).toContain('geschlossen');
    });

    it('zeigt keinen Warenkorb-Knopf', () => {
      expect(el('.pd-actions button')).toBeNull();
    });
  });

  describe('Shop-Antwort steht noch aus', () => {
    beforeEach(() => {
      mount('karte');
      shop.checked.set(false);
      shop.enabled.set(false);
      fixture.detectChanges();
    });

    it('zeigt den Warenkorb-Knopf — so steht er auch im ausgelieferten HTML', () => {
      expect(el('.pd-actions button')).not.toBeNull();
      expect(el('.pd-actions a[href^="mailto:"]')).toBeNull();
    });

    it('behauptet noch nicht, der Shop sei zu', () => {
      expect(el('.pd-note')).toBeNull();
    });
  });

  describe('unbekannter Kurzname', () => {
    beforeEach(() => mount('gibt-es-nicht'));

    it('sagt es und führt zurück zur Übersicht', () => {
      expect(text('h1')).toContain('gibt es nicht');
      expect(el<HTMLAnchorElement>('a.btn')!.getAttribute('href')).toBe('/de/bewertungskarten');
    });

    it('hält die Seite aus dem Suchindex', () => {
      expect(document.querySelector('meta[name="robots"]')!.getAttribute('content')).toContain('noindex');
    });

    it('legt nichts in den Korb und zeigt keinen Preis', () => {
      expect(el('.pd-price')).toBeNull();
      expect(cart.count()).toBe(0);
    });
  });

  it('hat für jedes Produkt einen langen Text', () => {
    for (const p of REVIEW_CARD_PRODUCTS) {
      mount(p.slug);
      const long = text('.pd-text');
      expect(long.length).toBeGreaterThan(200);
      // Kein fehlender Übersetzungsschlüssel, der als Rohtext durchrutscht.
      expect(long).not.toContain('pd.');
    }
  });
});
