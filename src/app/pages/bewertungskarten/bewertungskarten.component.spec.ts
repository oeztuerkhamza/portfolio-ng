import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { REVIEW_CARD_FORMS, REVIEW_CARD_PACKAGES, REVIEW_CARD_PRODUCTS } from '../../core/data/review-cards.data';
import { CartService } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { expectNoBorrowedRatings } from '../../../testing/no-borrowed-ratings';
import { BewertungskartenComponent } from './bewertungskarten.component';

/**
 * Tests der Übersichtsseite. Sie bestellte früher per E-Mail und WhatsApp;
 * jetzt legen die Knöpfe direkt in den Warenkorb und führen auf die
 * Produktseite. Geprüft wird, dass dabei kein Produkt verwechselt wird und
 * dass bei geschlossenem Shop ein Weg zum Bestellen bleibt.
 * Ausführen mit `npm test`.
 */

class ShopStatusStub {
  readonly enabled = signal(true);
  readonly checked = signal(true);
  check(): void {
    /* im Test schon entschieden */
  }
}

describe('BewertungskartenComponent', () => {
  let fixture: ComponentFixture<BewertungskartenComponent>;
  let shop: ShopStatusStub;
  let cart: CartService;

  beforeEach(() => {
    localStorage.removeItem('bd.cart.v1');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [BewertungskartenComponent],
      providers: [provideRouter([]), { provide: ShopStatus, useClass: ShopStatusStub }],
    });
    fixture = TestBed.createComponent(BewertungskartenComponent);
    shop = TestBed.inject(ShopStatus) as unknown as ShopStatusStub;
    cart = TestBed.inject(CartService);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('bd.cart.v1'));

  const el = <T extends Element>(sel: string): T | null => fixture.nativeElement.querySelector(sel);
  const all = (sel: string): Element[] => Array.from(fixture.nativeElement.querySelectorAll(sel));
  const html = () => (fixture.nativeElement as HTMLElement).innerHTML;
  const hrefs = () => all('a[href]').map((a) => a.getAttribute('href')!);

  it('bietet jede Form und jedes Paket zum Hinzufügen an', () => {
    // Ein Knopf je Produkt — Formen und Pakete zusammen.
    expect(all('.form-foot button, .pkg-actions button').length).toBe(REVIEW_CARD_FORMS.length + REVIEW_CARD_PACKAGES.length);
  });

  it('legt beim Klick genau das geklickte Produkt in den Warenkorb', () => {
    const buttons = all('.form-foot button') as HTMLButtonElement[];
    buttons[2].click();
    fixture.detectChanges();
    // Dritte Karte der Reihe — dieselbe Reihenfolge wie im Katalog.
    expect(cart.lines().map((l) => l.key)).toEqual([`form.${REVIEW_CARD_FORMS[2].id}`]);
  });

  it('legt aus der Paketspalte den Paketschlüssel in den Korb', () => {
    (all('.pkg-actions button')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(cart.lines().map((l) => l.key)).toEqual([`pkg.${REVIEW_CARD_PACKAGES[1].id}`]);
  });

  it('tauscht den Knopf des Produkts gegen einen Mengenwähler — nur dort', () => {
    (all('.form-foot button')[0] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(all('.form-foot .stepper').length).toBe(1);
    expect(all('.form-foot button').length).toBe(REVIEW_CARD_FORMS.length - 1 + 2);
  });

  it('verlinkt für jedes Produkt die Detailseite', () => {
    const links = all('.form-details, .pkg-details').map((a) => a.getAttribute('href'));
    expect(links.length).toBe(REVIEW_CARD_PRODUCTS.length);
    for (const p of REVIEW_CARD_PRODUCTS) expect(links).toContain(`/de/bewertungskarten/${p.slug}`);
  });

  it('schickt niemanden mehr für ein Produkt zu WhatsApp', () => {
    // Die Leisten oben und unten dürfen WhatsApp behalten — hier geht es um
    // die Produktknöpfe, und die sind eigene Klassen.
    expect(all('.pkg-wa, .page-hero-actions a[href*="wa.me"], .cta-actions a[href*="wa.me"]').length).toBe(0);
  });

  it('zeigt die Anzahl im Korb am Bestellknopf', () => {
    expect(el('.page-hero-actions .rc-badge')).toBeNull();
    (all('.form-foot button')[0] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el('.page-hero-actions .rc-badge')!.textContent!.trim()).toBe('1');
  });

  /**
   * Auf dieser Seite stehen die Google-Bewertungen *und* ein Product-Schema.
   * Genau hier wäre es verlockend, die Gesamtnote in die strukturierten Daten
   * zu schreiben — self-serving markup kostet alle Rich Results.
   */
  it('hängt keine geliehene Gesamtnote an das Product-Schema', () => {
    expectNoBorrowedRatings();
  });

  describe('geschlossener Shop', () => {
    beforeEach(() => {
      shop.enabled.set(false);
      fixture.detectChanges();
    });

    it('fällt auf die Anfrage per E-Mail zurück', () => {
      expect(all('.form-foot button, .pkg-actions button').length).toBe(0);
      expect(hrefs().filter((h) => h.startsWith('mailto:')).length).toBeGreaterThan(REVIEW_CARD_FORMS.length);
    });

    it('behält die Detailseiten', () => {
      expect(all('.form-details, .pkg-details').length).toBe(REVIEW_CARD_PRODUCTS.length);
    });

    it('führt nicht mehr in den Warenkorb', () => {
      expect(html()).not.toContain('/de/bestellen');
    });
  });

  describe('Shop-Antwort steht noch aus', () => {
    beforeEach(() => {
      shop.checked.set(false);
      shop.enabled.set(false);
      fixture.detectChanges();
    });

    it('zeigt die Warenkorb-Knöpfe — so geht die Seite auch in den Index', () => {
      expect(all('.form-foot button, .pkg-actions button').length).toBe(REVIEW_CARD_FORMS.length + REVIEW_CARD_PACKAGES.length);
    });
  });
});
