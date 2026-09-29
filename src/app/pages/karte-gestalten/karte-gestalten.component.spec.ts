import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { CUSTOM_CARDS } from '../../core/data/cards.data';
import { CardDraftService } from '../../core/cards/card-draft.service';
import { CartService } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { KarteGestaltenComponent } from './karte-gestalten.component';

/**
 * Der Kartengestalter.
 *
 * Zwei Dinge dürfen hier nicht schiefgehen. Der Knopf muss dieselbe
 * Katalogzeile in den Korb legen, die der Server abrechnet — sonst gestaltet
 * jemand eine Visitenkarte und bezahlt eine Geschenkkarte. Und der Bogen muss
 * die Felder der richtigen Art zeigen: die zwei Karten haben nichts
 * gemeinsam außer dem Chip.
 * Ausführen mit `npm test`.
 */

class ShopStatusStub {
  readonly enabled = signal(true);
  readonly checked = signal(true);
  check(): void {
    /* im Test schon entschieden */
  }
}

describe('KarteGestaltenComponent', () => {
  let fixture: ComponentFixture<KarteGestaltenComponent>;
  let cart: CartService;
  let drafts: CardDraftService;

  const business = CUSTOM_CARDS.find((c) => c.id === 'business')!;
  const gift = CUSTOM_CARDS.find((c) => c.id === 'gift')!;

  function mount(slug: string): void {
    localStorage.removeItem('bd.cart.v1');
    localStorage.removeItem('bd.carddraft.v1');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [KarteGestaltenComponent],
      providers: [
        provideRouter([]),
        { provide: ShopStatus, useClass: ShopStatusStub },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { slug } } } },
      ],
    });
    fixture = TestBed.createComponent(KarteGestaltenComponent);
    cart = TestBed.inject(CartService);
    drafts = TestBed.inject(CardDraftService);
    fixture.detectChanges();
  }

  beforeEach(() => {
    // Die Vorschau holt sich ihre Karte vom Server; hier geht nichts ins Netz.
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ html: '<p>Karte</p>' }) } as Response),
    );
  });

  afterEach(() => {
    localStorage.removeItem('bd.cart.v1');
    localStorage.removeItem('bd.carddraft.v1');
  });

  const el = <T extends Element>(sel: string): T | null => fixture.nativeElement.querySelector(sel);
  const all = (sel: string): Element[] => Array.from(fixture.nativeElement.querySelectorAll(sel));
  const text = (sel: string) => el(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  /** In ein Feld tippen, wie es der Kunde täte. */
  function fill(sel: string, value: string): void {
    const input = el<HTMLInputElement>(sel)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  describe('Digitale Visitenkarte', () => {
    beforeEach(() => mount('digitale-visitenkarte'));

    it('zeigt Titel, Preis und die Vorschau', () => {
      expect(text('h1')).toContain('Visitenkarte');
      expect(text('.cg-price')).toContain(String(business.price));
      expect(el('app-card-preview')).not.toBeNull();
    });

    it('trägt ein, was getippt wird', () => {
      fill('.cg-form input[type="text"]', 'Café Krone');
      expect(drafts.draft().business.company).toBe('Café Krone');
    });

    it('reicht der Vorschau genau den Inhalt dieser Art', () => {
      fill('.cg-form input[type="text"]', 'Café Krone');
      const data = fixture.componentInstance.data();
      expect(data['company']).toBe('Café Krone');
      expect('headline' in data).toBeFalse();
    });

    it('legt genau die Katalogzeile dieser Karte in den Warenkorb', () => {
      el<HTMLButtonElement>('.cg-buy button')!.click();
      fixture.detectChanges();
      expect(cart.qtyOf('card.business')).toBe(1);
      expect(cart.qtyOf('card.gift')).toBe(0);
    });

    it('schaltet das Farbschema um', () => {
      const dark = all('.cg-theme')[1] as HTMLButtonElement;
      dark.click();
      fixture.detectChanges();
      expect(drafts.theme()).toBe('dark');
      expect(dark.getAttribute('aria-pressed')).toBe('true');
    });

    it('legt Linkzeilen an und entfernt sie wieder', () => {
      expect(all('.cg-row').length).toBe(0);
      const add = all('.cg-add').at(-1) as HTMLButtonElement;
      add.click();
      fixture.detectChanges();
      expect(all('.cg-row').length).toBe(1);

      (el('.cg-row .cg-drop') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(all('.cg-row').length).toBe(0);
    });

    it('zeigt den Kontaktbogen als Schalter, der ausdrücklich an muss', () => {
      const box = el<HTMLInputElement>('.cg-check input')!;
      expect(box.checked).toBeFalse();
      box.click();
      fixture.detectChanges();
      expect(drafts.draft().business.leads).toBeTrue();
    });

    it('leert nur diese Art, nicht die andere', () => {
      fill('.cg-form input[type="text"]', 'Café Krone');
      drafts.setGift('headline', 'Alles Gute!');
      (el('.cg-reset') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(drafts.draft().business.company).toBe('');
      expect(drafts.draft().gift.headline).toBe('Alles Gute!');
    });

    it('bleibt aus dem Suchindex — der Gestalter ist ein Werkzeug, kein Inhalt', () => {
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
    });
  });

  describe('Geschenkkarte', () => {
    beforeEach(() => mount('geschenkkarte'));

    it('zeigt die Felder der Geschenkkarte, nicht die der Visitenkarte', () => {
      expect(text('.cg-form')).toContain('Überschrift');
      expect(text('.cg-form')).not.toContain('Name des Betriebs');
      expect(el('textarea')).not.toBeNull();
    });

    it('legt genau die Katalogzeile dieser Karte in den Warenkorb', () => {
      el<HTMLButtonElement>('.cg-buy button')!.click();
      fixture.detectChanges();
      expect(cart.qtyOf('card.gift')).toBe(1);
      expect(cart.qtyOf('card.business')).toBe(0);
    });

    it('zeigt den Preis der Geschenkkarte', () => {
      expect(text('.cg-price')).toContain(String(gift.price));
    });

    it('legt Bildzeilen an', () => {
      const add = all('.cg-add')[0] as HTMLButtonElement;
      add.click();
      fixture.detectChanges();
      expect(drafts.draft().gift.photos.length).toBe(1);
    });
  });

  it('fällt bei einer unbekannten Adresse auf die Visitenkarte zurück', () => {
    mount('gibtsnicht');
    expect(text('.cg-price')).toContain(String(business.price));
  });
});
