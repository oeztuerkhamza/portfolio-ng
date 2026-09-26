import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CUSTOM_CARDS } from '../data/cards.data';
import { price } from '../data/catalog';
import { REVIEW_CARD_FORMS, REVIEW_CARD_PACKAGES } from '../data/review-cards.data';

/**
 * Warenkorb des Shops.
 *
 * Er merkt sich nur Schlüssel und Menge — die Preise rechnet immer der Server
 * aus der Tabelle `prices` nach (src/server/api.ts). Was hier steht, ist also
 * reine Anzeige und kann nichts am Rechnungsbetrag ändern.
 *
 * Der Inhalt liegt im localStorage, damit ein Neuladen oder ein Abstecher auf
 * eine andere Seite die Auswahl nicht wegwirft. Auf dem Server (Prerendering)
 * gibt es keinen Speicher: dort bleibt der Korb leer.
 */

export interface ShopProduct {
  /** Schlüssel wie in der Tabelle `prices`, z. B. `form.karte`. */
  key: string;
  /** i18n-Schlüssel des Namens. */
  nameKey: string;
  unitPrice: number;
  image?: string;
  /** Überschrift der Gruppe in der Liste. */
  group: 'shop.forms' | 'shop.packages' | 'shop.cards';
}

/** Alles, was der Shop verkauft — dieselbe Reihenfolge wie auf der Seite. */
export const SHOP_PRODUCTS: ShopProduct[] = [
  ...REVIEW_CARD_FORMS.map(
    (f): ShopProduct => ({ key: `form.${f.id}`, nameKey: `rc.form.${f.id}.name`, unitPrice: f.price, image: f.imageSmall, group: 'shop.forms' }),
  ),
  ...REVIEW_CARD_PACKAGES.map(
    (p): ShopProduct => ({ key: `pkg.${p.id}`, nameKey: `rc.pkg.${p.id}.name`, unitPrice: p.price, group: 'shop.packages' }),
  ),
  ...CUSTOM_CARDS.map(
    (c): ShopProduct => ({ key: `card.${c.id}`, nameKey: `shop.card.${c.id}`, unitPrice: c.price, image: c.imageSmall, group: 'shop.cards' }),
  ),
];

export interface CartLine extends ShopProduct {
  qty: number;
  /** Menge × Einzelpreis. */
  sum: number;
}

/** Grenzen des Servers: mehr nimmt /api/checkout nicht an. */
export const MAX_QTY = 20;
export const MAX_LINES = 10;

const STORE_KEY = 'bd.cart.v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly byKey = new Map(SHOP_PRODUCTS.map((p) => [p.key, p]));

  /** Menge je Produktschlüssel; nur Werte über 0 stehen drin. */
  private readonly qty = signal<Record<string, number>>(this.restore());

  /** Versandkosten aus dem Katalog; 0 = im Preis enthalten. */
  readonly shipping = price('shop.shipping');

  /**
   * Nur bekannte Produkte, in der Reihenfolge des Katalogs. Damit räumt sich
   * ein alter Korb selbst auf, wenn ein Produkt aus dem Shop genommen wurde.
   */
  readonly lines = computed<CartLine[]>(() => {
    const q = this.qty();
    return SHOP_PRODUCTS.filter((p) => (q[p.key] ?? 0) > 0).map((p) => ({ ...p, qty: q[p.key], sum: q[p.key] * p.unitPrice }));
  });

  /** Anzahl der Stücke insgesamt — die Zahl am Korb-Symbol. */
  readonly count = computed(() => this.lines().reduce((n, l) => n + l.qty, 0));
  readonly empty = computed(() => this.lines().length === 0);
  readonly subtotal = computed(() => this.lines().reduce((s, l) => s + l.sum, 0));
  /** Versand kommt erst auf einen gefüllten Korb. */
  readonly total = computed(() => (this.empty() ? 0 : this.subtotal() + this.shipping));

  /** Menge eines Produkts im Korb. */
  qtyOf(key: string): number {
    return this.qty()[key] ?? 0;
  }

  /** Um `delta` ändern; begrenzt auf 0…MAX_QTY. */
  add(key: string, delta: number): void {
    this.setQty(key, this.qtyOf(key) + delta);
  }

  /**
   * Menge setzen. 0 nimmt das Produkt heraus. Ein unbekannter Schlüssel und
   * ein voller Korb (MAX_LINES verschiedene Produkte) werden abgewiesen, damit
   * der Server die Bestellung nicht später als `invalid_items` ablehnt.
   */
  setQty(key: string, value: number): void {
    if (!this.byKey.has(key)) return;
    const next = Math.max(0, Math.min(MAX_QTY, Math.floor(value) || 0));
    const current = this.qtyOf(key);
    if (next === current) return;
    if (next > 0 && current === 0 && this.lines().length >= MAX_LINES) return;

    this.qty.update((q) => {
      const out = { ...q };
      if (next > 0) out[key] = next;
      else delete out[key];
      return out;
    });
    this.persist();
  }

  remove(key: string): void {
    this.setQty(key, 0);
  }

  clear(): void {
    if (this.empty()) return;
    this.qty.set({});
    this.persist();
  }

  /** Was `/api/checkout` erwartet. */
  payload(): { key: string; qty: number }[] {
    return this.lines().map((l) => ({ key: l.key, qty: l.qty }));
  }

  // ── Speicher ────────────────────────────────────────────
  private restore(): Record<string, number> {
    if (!this.browser) return {};
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const out: Record<string, number> = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (!this.byKey.has(key)) continue;
        const n = Math.floor(Number(value));
        if (n > 0) out[key] = Math.min(MAX_QTY, n);
        if (Object.keys(out).length >= MAX_LINES) break;
      }
      return out;
    } catch {
      return {};
    }
  }

  /** Ein blockierter oder voller Speicher darf den Korb nicht lahmlegen. */
  private persist(): void {
    if (!this.browser) return;
    try {
      const q = this.qty();
      if (Object.keys(q).length) localStorage.setItem(STORE_KEY, JSON.stringify(q));
      else localStorage.removeItem(STORE_KEY);
    } catch {
      /* privates Fenster, gesperrter Speicher — Korb lebt dann nur im Tab */
    }
  }
}
