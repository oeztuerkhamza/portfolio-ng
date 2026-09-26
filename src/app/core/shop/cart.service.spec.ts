import { TestBed } from '@angular/core/testing';
import { CartService, MAX_LINES, MAX_QTY, SHOP_PRODUCTS } from './cart.service';

/**
 * Tests des Warenkorbs. Läuft im Browser (Karma), weil der Korb den
 * localStorage benutzt.
 */
describe('CartService', () => {
  const STORE_KEY = 'bd.cart.v1';
  const A = SHOP_PRODUCTS[0];
  const B = SHOP_PRODUCTS[1];

  /** Neue Instanz, die den Speicher frisch einliest. */
  function fresh(): CartService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(CartService);
  }

  let cart: CartService;

  beforeEach(() => {
    localStorage.removeItem(STORE_KEY);
    cart = fresh();
  });

  afterEach(() => localStorage.removeItem(STORE_KEY));

  describe('Mengen', () => {
    it('beginnt leer', () => {
      expect(cart.empty()).toBeTrue();
      expect(cart.count()).toBe(0);
      expect(cart.lines()).toEqual([]);
      expect(cart.total()).toBe(0);
    });

    it('legt ein Produkt hinein und zählt die Stücke', () => {
      cart.add(A.key, 2);
      expect(cart.count()).toBe(2);
      expect(cart.qtyOf(A.key)).toBe(2);
      expect(cart.empty()).toBeFalse();
    });

    it('begrenzt die Menge auf die Grenze des Servers', () => {
      cart.add(A.key, MAX_QTY + 5);
      expect(cart.qtyOf(A.key)).toBe(MAX_QTY);
    });

    it('nimmt das Produkt bei Menge 0 heraus, statt eine 0-Zeile zu behalten', () => {
      cart.add(A.key, 1);
      cart.add(A.key, -1);
      expect(cart.qtyOf(A.key)).toBe(0);
      expect(cart.lines().length).toBe(0);
      expect(cart.empty()).toBeTrue();
    });

    it('geht nicht unter null', () => {
      cart.add(A.key, -3);
      expect(cart.qtyOf(A.key)).toBe(0);
    });

    it('entfernt und leert', () => {
      cart.add(A.key, 2);
      cart.add(B.key, 1);
      cart.remove(A.key);
      expect(cart.lines().length).toBe(1);
      cart.clear();
      expect(cart.empty()).toBeTrue();
    });

    it('ignoriert einen unbekannten Schlüssel', () => {
      cart.setQty('form.gibtesnicht', 3);
      expect(cart.empty()).toBeTrue();
    });

    it('nimmt nicht mehr verschiedene Produkte als der Server annimmt', () => {
      // Es gibt weniger Produkte als die Grenze — also bis zur Grenze füllen
      // und prüfen, dass danach keins mehr dazukommt.
      const keys = SHOP_PRODUCTS.map((p) => p.key).slice(0, MAX_LINES);
      for (const k of keys) cart.add(k, 1);
      expect(cart.lines().length).toBe(Math.min(keys.length, MAX_LINES));
      if (keys.length >= MAX_LINES) {
        cart.add(SHOP_PRODUCTS[MAX_LINES].key, 1);
        expect(cart.lines().length).toBe(MAX_LINES);
      }
    });
  });

  describe('Zeilen und Summen', () => {
    it('löst Name und Preis aus dem Katalog auf', () => {
      cart.add(A.key, 3);
      const [line] = cart.lines();
      expect(line.key).toBe(A.key);
      expect(line.nameKey).toBe(A.nameKey);
      expect(line.unitPrice).toBe(A.unitPrice);
      expect(line.qty).toBe(3);
      expect(line.sum).toBe(3 * A.unitPrice);
    });

    it('hält die Reihenfolge des Katalogs, nicht die des Hinzufügens', () => {
      cart.add(B.key, 1);
      cart.add(A.key, 1);
      expect(cart.lines().map((l) => l.key)).toEqual([A.key, B.key]);
    });

    it('rechnet die Zwischensumme', () => {
      cart.add(A.key, 2);
      cart.add(B.key, 1);
      expect(cart.subtotal()).toBe(2 * A.unitPrice + B.unitPrice);
    });

    it('schlägt den Versand nur auf einen gefüllten Korb', () => {
      // Im Katalog ist der Versand derzeit 0 € — dann prüfte der Test nichts.
      // Also einen eigenen Betrag setzen und die Regel selbst prüfen.
      (cart as unknown as { shipping: number }).shipping = 7;

      expect(cart.empty()).toBeTrue();
      expect(cart.total()).toBe(0, 'leerer Korb kostet keinen Versand');

      cart.add(A.key, 2);
      expect(cart.total()).toBe(2 * A.unitPrice + 7);

      cart.clear();
      expect(cart.total()).toBe(0);
    });

    it('liefert für /api/checkout nur Schlüssel und Menge', () => {
      cart.add(A.key, 2);
      expect(cart.payload()).toEqual([{ key: A.key, qty: 2 }]);
    });
  });

  describe('Speicher', () => {
    it('übersteht ein Neuladen', () => {
      cart.add(A.key, 2);
      cart.add(B.key, 1);
      const again = fresh();
      expect(again.qtyOf(A.key)).toBe(2);
      expect(again.qtyOf(B.key)).toBe(1);
      expect(again.count()).toBe(3);
    });

    it('räumt den Speicher, wenn der Korb geleert wird', () => {
      cart.add(A.key, 1);
      expect(localStorage.getItem(STORE_KEY)).not.toBeNull();
      cart.clear();
      expect(localStorage.getItem(STORE_KEY)).toBeNull();
    });

    it('räumt den Speicher auch, wenn die letzte Position entfernt wird', () => {
      // Sonst bliebe eine 0-Zeile im Speicher stehen und wüchse mit der Zeit.
      cart.add(A.key, 2);
      cart.remove(A.key);
      expect(localStorage.getItem(STORE_KEY)).toBeNull();
    });

    it('schreibt Fremdschlüssel aus altem Speicher nicht zurück', () => {
      localStorage.setItem(STORE_KEY, JSON.stringify({ [A.key]: 1, 'form.abgeschafft': 3 }));
      const again = fresh();
      again.add(A.key, 1);
      const stored = JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}') as Record<string, number>;
      expect(Object.keys(stored)).toEqual([A.key]);
      expect(stored[A.key]).toBe(2);
    });

    it('wirft unbekannte und unsinnige Einträge aus altem Speicher weg', () => {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({ [A.key]: 2, 'form.abgeschafft': 5, [B.key]: 0, kaputt: 'viele' }),
      );
      const again = fresh();
      expect(again.lines().map((l) => l.key)).toEqual([A.key]);
      expect(again.qtyOf(A.key)).toBe(2);
    });

    it('begrenzt auch eine überhöhte Menge aus dem Speicher', () => {
      localStorage.setItem(STORE_KEY, JSON.stringify({ [A.key]: 9999 }));
      expect(fresh().qtyOf(A.key)).toBe(MAX_QTY);
    });

    it('kommt mit kaputtem JSON im Speicher aus', () => {
      localStorage.setItem(STORE_KEY, '{kein json');
      expect(fresh().empty()).toBeTrue();
    });

    it('bleibt benutzbar, wenn der Speicher gesperrt ist (privates Fenster)', () => {
      const spy = spyOn(localStorage, 'setItem').and.throwError('QuotaExceededError');
      expect(() => cart.add(A.key, 1)).not.toThrow();
      expect(cart.qtyOf(A.key)).toBe(1);
      expect(spy).toHaveBeenCalled();
    });
  });

  /**
   * Die eigenen NFC-Karten sind seit dieser Änderung im Shop bestellbar. Der
   * Schlüssel `card.<art>` ist nicht beliebig: der Server liest daraus nach
   * der Bezahlung, welche Art Kartenentwurf er anlegen muss.
   */
  describe('Eigene NFC-Karten im Katalog', () => {
    const cards = () => SHOP_PRODUCTS.filter((p) => p.group === 'shop.cards');

    it('stehen als eigene Gruppe im Katalog', () => {
      expect(cards().length).toBe(2);
      expect(cards().map((p) => p.key)).toEqual(['card.business', 'card.gift']);
    });

    it('heißen genau `card.<art>` — daran hängt der Kartenentwurf', () => {
      for (const p of cards()) {
        expect(p.key).toMatch(/^card\.(business|gift)$/);
      }
    });

    it('lassen sich in den Korb legen und richtig rechnen', () => {
      const card = cards()[0];
      cart.add(card.key, 2);
      expect(cart.qtyOf(card.key)).toBe(2);
      expect(cart.subtotal()).toBe(2 * card.unitPrice);
      expect(cart.payload()).toEqual([{ key: card.key, qty: 2 }]);
    });

    it('haben einen Preis aus dem Katalog, keinen erfundenen', () => {
      for (const p of cards()) {
        expect(p.unitPrice).toBeGreaterThan(0);
        expect(Number.isFinite(p.unitPrice)).toBeTrue();
      }
    });

    it('lassen sich mit Bewertungskarten zusammen bestellen', () => {
      cart.add('form.karte', 1);
      cart.add('card.business', 1);
      expect(cart.count()).toBe(2);
      expect(cart.payload().map((i) => i.key).sort()).toEqual(['card.business', 'form.karte']);
    });
  });
});
