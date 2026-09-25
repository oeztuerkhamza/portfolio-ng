import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { CartService } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { ShopComponent } from './shop.component';

/**
 * Tests der Bestellseite: Warenkorb, Pflichtangaben und das Abschicken.
 * Der Shop-Schalter und `fetch` werden ersetzt, damit kein Netz und keine
 * Datenbank nötig sind.
 * Ausführen mit `npm test` — die Server-API testet `npm run test:server`.
 */

/** Ersatz für den Shop-Schalter, der sonst /api/shop abfragt. */
class ShopStatusStub {
  readonly enabled = signal(false);
  readonly checked = signal(true);
  check(): void {
    /* im Test schon entschieden */
  }
}

describe('ShopComponent', () => {
  let fixture: ComponentFixture<ShopComponent>;
  let component: ShopComponent;
  let shop: ShopStatusStub;
  let cart: CartService;

  /** Komponente neu bauen, Speicher unangetastet — stellt ein Neuladen nach. */
  function mount(routeData: Record<string, unknown> = {}): void {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ShopComponent],
      providers: [
        provideRouter([]),
        { provide: ShopStatus, useClass: ShopStatusStub },
        { provide: ActivatedRoute, useValue: { snapshot: { data: routeData } } },
      ],
    });
    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    shop = TestBed.inject(ShopStatus) as unknown as ShopStatusStub;
    cart = TestBed.inject(CartService);
  }

  /** Frischer Start: leerer Korb, neue Komponente. */
  function setup(routeData: Record<string, unknown> = {}): void {
    localStorage.removeItem('bd.cart.v1');
    mount(routeData);
  }

  afterEach(() => localStorage.removeItem('bd.cart.v1'));

  /** Erstes Produkt des Katalogs — so bleibt der Test von Preisen frei. */
  const first = () => component.groups[0].items[0];
  const second = () => component.groups[0].items[1];

  const el = <T extends Element>(sel: string): T | null => fixture.nativeElement.querySelector(sel);
  const all = (sel: string): Element[] => Array.from(fixture.nativeElement.querySelectorAll(sel));
  const text = (sel: string) => el(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  /** Shop offen und gerendert. */
  function openShop(): void {
    shop.enabled.set(true);
    fixture.detectChanges();
  }

  describe('offener Shop', () => {
    beforeEach(() => {
      setup();
      openShop();
    });

    it('zeigt das Bestellformular', () => {
      expect(el('form.shop')).not.toBeNull();
    });

    it('bietet jedes Produkt mit einem Knopf „In den Warenkorb" an', () => {
      expect(all('.shop-add').length).toBe(component.groups.flatMap((g) => g.items).length);
      expect(all('.stepper').length).toBe(0);
    });

    it('macht aus dem Knopf einen Mengenzähler, sobald das Produkt im Korb ist', () => {
      (el('.shop-add') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(cart.qtyOf(first().key)).toBe(1);
      expect(all('.stepper').length).toBe(1);
      expect(el('.shop-line.picked')).not.toBeNull();
    });

    it('sagt, dass der Korb leer ist, und sperrt den Bestellknopf', () => {
      expect(el('.cart-empty')).not.toBeNull();
      expect(el('.cart-items')).toBeNull();
      expect(el<HTMLButtonElement>('form.shop button.btn-primary')!.disabled).toBeTrue();
    });
  });

  describe('Warenkorb auf der Seite', () => {
    beforeEach(() => {
      setup();
      openShop();
      cart.add(first().key, 2);
      cart.add(second().key, 1);
      fixture.detectChanges();
    });

    it('listet jede Position mit Menge, Einzelpreis und Zeilensumme', () => {
      const items = all('.cart-items li');
      expect(items.length).toBe(2);
      const row = items[0].textContent?.replace(/\s+/g, ' ') ?? '';
      expect(row).toContain('2 ×');
      expect(row).toContain(String(first().unitPrice));
      expect(row).toContain(String(2 * first().unitPrice));
    });

    it('zeigt die Gesamtsumme samt Versand', () => {
      expect(text('.sum-total')).toContain(String(cart.total()));
      expect(cart.total()).toBe(2 * first().unitPrice + second().unitPrice + cart.shipping);
    });

    it('gibt den Bestellknopf frei', () => {
      expect(el<HTMLButtonElement>('form.shop button.btn-primary')!.disabled).toBeFalse();
    });

    it('nimmt eine Position über das Kreuz heraus', () => {
      (all('.cart-remove')[0] as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(all('.cart-items li').length).toBe(1);
      expect(cart.qtyOf(first().key)).toBe(0);
    });

    it('leert den ganzen Korb', () => {
      (el('.cart-clear') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(cart.empty()).toBeTrue();
      expect(el('.cart-empty')).not.toBeNull();
    });

    it('übersteht ein Neuladen der Seite', () => {
      // Neue Komponente, Speicher bleibt: der Inhalt kommt aus dem localStorage.
      mount();
      openShop();
      expect(cart.count()).toBe(3);
      expect(all('.cart-items li').length).toBe(2);
    });
  });

  describe('Pflichtangaben', () => {
    beforeEach(() => {
      setup();
      openShop();
    });

    it('verlinkt AGB, Widerruf und Versand mit Sprachpräfix', () => {
      expect(all('.shop-legal-links a').map((a) => a.getAttribute('href'))).toEqual(['/de/agb', '/de/widerruf', '/de/versand']);
    });

    it('öffnet die Rechtsseiten in einem neuen Tab, ohne Referrer-Leck', () => {
      for (const a of all('.shop-legal-links a')) {
        expect(a.getAttribute('target')).toBe('_blank');
        expect(a.getAttribute('rel')).toBe('noopener');
      }
    });

    it('macht die Zustimmung zum Pflichtfeld und lässt sie leer', () => {
      const box = el<HTMLInputElement>('.shop-consent input')!;
      expect(box.type).toBe('checkbox');
      expect(box.required).toBeTrue();
      expect(box.checked).toBeFalse();
    });

    it('stellt die Pflichtangaben über den Bestellknopf', () => {
      const legal = el('.shop-legal')!;
      const button = el('form.shop button.btn-primary')!;
      expect(legal.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('nennt Lieferzeit und Widerrufs-Ausnahme im Text', () => {
      const t = el('form.shop')!.textContent ?? '';
      expect(t).toContain('5–10 Werktage');
      expect(t).toContain('312g');
    });

    it('verschweigt den Sprachhinweis auf der deutschen Seite', () => {
      expect(el('.shop-legal .langnote')).toBeNull();
    });
  });

  describe('geschlossener Shop', () => {
    beforeEach(() => {
      setup();
      shop.enabled.set(false);
      fixture.detectChanges();
    });

    it('zeigt statt des Formulars den Hinweis auf die Anfrage', () => {
      expect(el('form.shop')).toBeNull();
      expect(el('aside.note')).not.toBeNull();
    });
  });

  describe('Dankeseite', () => {
    it('leert den Korb, weil bezahlt bezahlt ist', () => {
      setup();
      cart.add(first().key, 2);
      // Dankeseite mit vollem Korb betreten (Rückkehr von Stripe).
      mount({ thanks: true });
      expect(cart.count()).toBe(2);
      fixture.detectChanges();
      expect(cart.empty()).toBeTrue();
      expect(el('form.shop')).toBeNull();
    });
  });

  describe('order()', () => {
    let fetchSpy: jasmine.Spy;

    beforeEach(() => {
      setup();
      openShop();
      // Antwort ohne url: die Seite bricht ab, statt zu Stripe zu wechseln —
      // ein echter Wechsel würde den Testlauf verlassen.
      fetchSpy = spyOn(window, 'fetch').and.resolveTo(
        new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } }),
      );
    });

    /** Auf das Ergebnis von order() warten — dispatchEvent liefert kein Promise. */
    async function settle(done: () => boolean, tries = 50): Promise<void> {
      for (let i = 0; i < tries; i++) {
        if (done()) return;
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
      }
      throw new Error('order() ist nicht fertig geworden');
    }

    function fill(opts: { consent: boolean; business?: string; google?: string }): HTMLFormElement {
      cart.add(first().key, 1);
      fixture.detectChanges();
      const form = el<HTMLFormElement>('form.shop')!;
      (form.elements.namedItem('business') as HTMLInputElement).value = opts.business ?? 'Testbetrieb';
      (form.elements.namedItem('google') as HTMLInputElement).value = opts.google ?? '';
      (form.elements.namedItem('consent') as HTMLInputElement).checked = opts.consent;
      return form;
    }

    it('meldet einen leeren Korb und fragt den Server nicht', async () => {
      el<HTMLFormElement>('form.shop')!.dispatchEvent(new Event('submit', { cancelable: true }));
      await settle(() => component.error() !== '');
      expect(component.error()).not.toBe('');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('bestellt nicht ohne Zustimmung zu AGB und Widerruf', async () => {
      fill({ consent: false }).dispatchEvent(new Event('submit', { cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(component.busy()).toBeFalse();
    });

    it('schickt den Korbinhalt, die Sprache und die Angaben', async () => {
      cart.add(second().key, 2);
      const form = fill({ consent: true, business: 'Café Krone', google: 'https://g.page/krone' });
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      await settle(() => fetchSpy.calls.count() > 0);

      const [url, init] = fetchSpy.calls.mostRecent().args as [string, RequestInit];
      expect(url).toBe('/api/checkout');
      expect(init.method).toBe('POST');
      const body = JSON.parse(String(init.body));
      expect(body.items).toEqual([
        { key: first().key, qty: 1 },
        { key: second().key, qty: 2 },
      ]);
      expect(body.lang).toBe('de');
      expect(body.businessName).toBe('Café Krone');
      expect(body.googleLink).toBe('https://g.page/krone');
    });

    it('behält den Korb, wenn der Server keine Bezahladresse liefert', async () => {
      fill({ consent: true }).dispatchEvent(new Event('submit', { cancelable: true }));
      await settle(() => component.error() !== '');
      expect(component.error()).not.toBe('');
      expect(component.busy()).toBeFalse();
      // Nichts ist bezahlt — der Kunde soll es erneut versuchen können.
      expect(cart.empty()).toBeFalse();
    });
  });
});
