import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { CUSTOM_CARDS } from '../../core/data/cards.data';
import { CartService } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { expectNoBorrowedRatings } from '../../../testing/no-borrowed-ratings';
import { KartenComponent } from './karten.component';

/**
 * Tests der zwei Seiten für die eigenen NFC-Karten.
 *
 * Der wichtigste Punkt ist derselbe wie bei den Bewertungskarten: der Knopf
 * muss genau die Katalogzeile in den Korb legen, die der Server später
 * abrechnet. Ein falscher Schlüssel hieße, dass der Kunde eine Geschenkkarte
 * bezahlt und eine Visitenkarte bekommt.
 * Ausführen mit `npm test`.
 */

class ShopStatusStub {
  readonly enabled = signal(true);
  readonly checked = signal(true);
  check(): void {
    /* im Test schon entschieden */
  }
}

describe('KartenComponent', () => {
  let fixture: ComponentFixture<KartenComponent>;
  let shop: ShopStatusStub;
  let cart: CartService;

  const business = CUSTOM_CARDS.find((c) => c.id === 'business')!;
  const gift = CUSTOM_CARDS.find((c) => c.id === 'gift')!;

  function mount(slug: string): void {
    localStorage.removeItem('bd.cart.v1');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [KartenComponent],
      providers: [
        provideRouter([]),
        { provide: ShopStatus, useClass: ShopStatusStub },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { slug } } } },
      ],
    });
    fixture = TestBed.createComponent(KartenComponent);
    shop = TestBed.inject(ShopStatus) as unknown as ShopStatusStub;
    cart = TestBed.inject(CartService);
    fixture.detectChanges();
  }

  afterEach(() => localStorage.removeItem('bd.cart.v1'));

  const el = <T extends Element>(sel: string): T | null => fixture.nativeElement.querySelector(sel);
  const all = (sel: string): Element[] => Array.from(fixture.nativeElement.querySelectorAll(sel));
  const text = (sel: string) => el(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const html = () => (fixture.nativeElement as HTMLElement).innerHTML;

  describe('Digitale Visitenkarte', () => {
    beforeEach(() => mount('digitale-visitenkarte'));

    it('zeigt Titel, Preis und den eigenen Text', () => {
      expect(text('h1')).toContain('Visitenkarte');
      expect(text('.kt-price')).toContain(String(business.price));
      expect(text('.kt-text p').length).toBeGreaterThan(200);
    });

    it('legt genau die Katalogzeile dieser Karte in den Warenkorb', () => {
      el<HTMLButtonElement>('.kt-actions button')!.click();
      fixture.detectChanges();
      expect(cart.lines().map((l) => l.key)).toEqual(['card.business']);
    });

    it('tauscht den Knopf gegen den Mengenwähler', () => {
      expect(el('.kt-stepper')).toBeNull();
      el<HTMLButtonElement>('.kt-actions button')!.click();
      fixture.detectChanges();
      expect(el('.kt-stepper output')!.textContent!.trim()).toBe('1');
    });

    it('listet auf, was auf der Karte steht', () => {
      const points = all('.kt-side .check-list li').map((li) => li.textContent!.trim());
      expect(points.length).toBe(6);
      for (const p of points) expect(p.length).toBeGreaterThan(10);
    });

    it('erklärt den Ablauf in vier Schritten', () => {
      expect(all('.kt-steps li').length).toBe(4);
    });

    it('verweist auf die Geschenkkarte und auf die Bewertungskarten', () => {
      const hrefs = all('.kt-more a').map((a) => a.getAttribute('href'));
      expect(hrefs).toContain('/de/geschenkkarte');
      expect(hrefs).toContain('/de/bewertungskarten');
    });

    it('zeigt das Schema der Kartenseite, nicht ein Foto', () => {
      // Ein Foto würde veralten; das Schema zeigt immer die echte Form.
      expect(el('.kt-preview .kt-card')).not.toBeNull();
      expect(el('.kt-preview img')).toBeNull();
      expect(el('.kt-preview')!.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Geschenkkarte', () => {
    beforeEach(() => mount('geschenkkarte'));

    it('zeigt den eigenen Titel und Preis', () => {
      expect(text('.kt-price')).toContain(String(gift.price));
      expect(text('h1')).not.toContain('Visitenkarte');
    });

    it('legt den Schlüssel der Geschenkkarte in den Korb, nicht den der Visitenkarte', () => {
      el<HTMLButtonElement>('.kt-actions button')!.click();
      fixture.detectChanges();
      expect(cart.lines().map((l) => l.key)).toEqual(['card.gift']);
    });

    it('zeigt die Bildergalerie im Schema, kein Portrait', () => {
      expect(el('.kt-photos')).not.toBeNull();
      expect(el('.kt-avatar')).toBeNull();
    });

    it('verweist zurück auf die Visitenkarte', () => {
      expect(all('.kt-more a').map((a) => a.getAttribute('href'))).toContain('/de/digitale-visitenkarte');
    });
  });

  /** Dieselbe Regel wie auf den anderen Produktseiten. */
  it('hängt keine geliehene Gesamtnote an das Product-Schema', () => {
    mount('digitale-visitenkarte');
    expectNoBorrowedRatings();
  });

  describe('geschlossener Shop', () => {
    beforeEach(() => {
      mount('digitale-visitenkarte');
      shop.enabled.set(false);
      fixture.detectChanges();
    });

    it('lässt die Anfrage per E-Mail übrig', () => {
      expect(el('.kt-actions a[href^="mailto:"]')).not.toBeNull();
      expect(el('.kt-actions button')).toBeNull();
      expect(text('.kt-note')).toContain('geschlossen');
    });
  });

  describe('Shop-Antwort steht noch aus', () => {
    beforeEach(() => {
      mount('digitale-visitenkarte');
      shop.checked.set(false);
      shop.enabled.set(false);
      fixture.detectChanges();
    });

    it('zeigt den Warenkorb-Knopf — so steht er auch im ausgelieferten HTML', () => {
      expect(el('.kt-actions button')).not.toBeNull();
      expect(el('.kt-note')).toBeNull();
    });
  });

  it('lässt keinen Übersetzungsschlüssel durchrutschen', () => {
    for (const c of CUSTOM_CARDS) {
      mount(c.slug);
      // Ein fehlender Schlüssel käme als „kt.…" oder „shop.card.…" im Text an.
      expect(html()).not.toMatch(/>\s*(kt|shop|pd)\.[a-z]/i);
    }
  });

  it('fällt auf die Visitenkarte zurück, wenn die Route keine Karte nennt', () => {
    mount('');
    expect(text('.kt-price')).toContain(String(business.price));
  });

  /** Dieselben Pflichtangaben wie auf den anderen Produktseiten. */
  describe('Pflichtangaben', () => {
    beforeEach(() => mount('digitale-visitenkarte'));

    it('nennt § 19 UStG, Versand, Lieferzeit und die Widerrufs-Ausnahme', () => {
      const side = text('.kt-side');
      expect(side).toContain('19 UStG');
      expect(side).toMatch(/inklusive|Versand: /);
      expect(side).toMatch(/Lieferzeit/);
      expect(side).toContain('312g');
    });
  });
});
