import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { ShopComponent } from './shop.component';

/**
 * Tests der Bestellseite. Der Schalter des Shops und `fetch` werden ersetzt,
 * damit kein Netz und keine Datenbank nötig sind.
 * Ausführen mit `npm test` (Karma) — die Server-API testet `npm run test:server`.
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

  function setup(routeData: Record<string, unknown> = {}): void {
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
  }

  /** Erste Position der Seite — so bleibt der Test von Preisänderungen frei. */
  function firstLine() {
    return component.groups[0].lines[0];
  }

  const el = <T extends Element>(sel: string): T | null => fixture.nativeElement.querySelector(sel);
  const all = (sel: string): Element[] => Array.from(fixture.nativeElement.querySelectorAll(sel));

  // ── Rechnen ────────────────────────────────────────────
  describe('Summe und Mengen', () => {
    beforeEach(() => setup());

    it('beginnt bei null, ohne Versand aufzuschlagen', () => {
      expect(component.total()).toBe(0);
    });

    it('rechnet Menge mal Preis und schlägt den Versand auf', () => {
      const line = firstLine();
      component.add(line.key, 2);
      expect(component.total()).toBe(2 * line.price + component.shipping);
    });

    it('fällt auf null zurück, wenn der Korb wieder leer ist', () => {
      const line = firstLine();
      component.add(line.key, 1);
      component.add(line.key, -1);
      expect(component.qty()[line.key]).toBe(0);
      expect(component.total()).toBe(0);
    });

    it('begrenzt die Menge auf 0 bis 20', () => {
      const line = firstLine();
      component.add(line.key, 50);
      expect(component.qty()[line.key]).toBe(20);
      component.add(line.key, -100);
      expect(component.qty()[line.key]).toBe(0);
    });

    it('löscht eine Fehlermeldung, sobald die Menge sich ändert', () => {
      component.error.set('irgendwas');
      component.add(firstLine().key, 1);
      expect(component.error()).toBe('');
    });
  });

  // ── Pflichtangaben ─────────────────────────────────────
  describe('Pflichtangaben im offenen Shop', () => {
    beforeEach(() => {
      setup();
      shop.enabled.set(true);
      fixture.detectChanges();
    });

    it('zeigt das Bestellformular', () => {
      expect(el('form.shop')).not.toBeNull();
    });

    it('verlinkt AGB, Widerruf und Versand mit Sprachpräfix', () => {
      const hrefs = all('.shop-legal-links a').map((a) => a.getAttribute('href'));
      expect(hrefs).toEqual(['/de/agb', '/de/widerruf', '/de/versand']);
    });

    it('öffnet die Rechtsseiten in einem neuen Tab, ohne Referrer-Leck', () => {
      for (const a of all('.shop-legal-links a')) {
        expect(a.getAttribute('target')).toBe('_blank');
        expect(a.getAttribute('rel')).toBe('noopener');
      }
    });

    it('macht die Zustimmung zum Pflichtfeld und lässt sie leer', () => {
      const box = el<HTMLInputElement>('.shop-consent input');
      expect(box).not.toBeNull();
      expect(box!.type).toBe('checkbox');
      expect(box!.required).toBeTrue();
      expect(box!.checked).toBeFalse();
    });

    it('stellt die Pflichtangaben über den Bestellknopf', () => {
      const legal = el('.shop-legal')!;
      const button = fixture.nativeElement.querySelector('form.shop button.btn-primary')!;
      expect(legal.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('nennt Lieferzeit und Widerrufs-Ausnahme im Text', () => {
      const text = el('form.shop')!.textContent ?? '';
      expect(text).toContain('5–10 Werktage');
      expect(text).toContain('312g');
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
    beforeEach(() => {
      setup({ thanks: true });
      fixture.detectChanges();
    });

    it('zeigt den Dank und kein Formular', () => {
      expect(component.thanks).toBeTrue();
      expect(el('form.shop')).toBeNull();
    });
  });

  // ── Bestellung abschicken ──────────────────────────────
  describe('order()', () => {
    let fetchSpy: jasmine.Spy;

    beforeEach(() => {
      setup();
      shop.enabled.set(true);
      fixture.detectChanges();
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

    /** Formular so füllen, wie ein Kunde es tut. */
    function fill(opts: { consent: boolean; business?: string; google?: string }): HTMLFormElement {
      const form = el<HTMLFormElement>('form.shop')!;
      component.add(firstLine().key, 1);
      fixture.detectChanges();
      (form.elements.namedItem('business') as HTMLInputElement).value = opts.business ?? 'Testbetrieb';
      (form.elements.namedItem('google') as HTMLInputElement).value = opts.google ?? '';
      (form.elements.namedItem('consent') as HTMLInputElement).checked = opts.consent;
      return form;
    }

    it('meldet einen leeren Korb und fragt den Server nicht', async () => {
      const form = el<HTMLFormElement>('form.shop')!;
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      await settle(() => component.error() !== '');
      expect(component.error()).not.toBe('');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('bestellt nicht ohne Zustimmung zu AGB und Widerruf', async () => {
      const form = fill({ consent: false });
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      // Kein Zustand ändert sich, also kurz warten und dann prüfen.
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(component.busy()).toBeFalse();
    });

    it('schickt Positionen, Sprache und Angaben, sobald zugestimmt wurde', async () => {
      const line = firstLine();
      const form = fill({ consent: true, business: 'Café Krone', google: 'https://g.page/krone' });
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      await settle(() => fetchSpy.calls.count() > 0);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, init] = fetchSpy.calls.mostRecent().args as [string, RequestInit];
      expect(url).toBe('/api/checkout');
      expect(init.method).toBe('POST');
      const body = JSON.parse(String(init.body));
      expect(body.items).toEqual([{ key: line.key, qty: 1 }]);
      expect(body.lang).toBe('de');
      expect(body.businessName).toBe('Café Krone');
      expect(body.googleLink).toBe('https://g.page/krone');
    });

    it('zeigt eine Fehlermeldung, wenn der Server keine Bezahladresse liefert', async () => {
      const form = fill({ consent: true });
      form.dispatchEvent(new Event('submit', { cancelable: true }));
      await settle(() => component.error() !== '');
      expect(component.error()).not.toBe('');
      expect(component.busy()).toBeFalse();
    });
  });
});
