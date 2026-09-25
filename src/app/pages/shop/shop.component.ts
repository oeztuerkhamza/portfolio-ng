import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { SeoService } from '../../core/seo/seo.service';
import { CartService, MAX_QTY, SHOP_PRODUCTS } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { REVIEW_CARDS_CONTENT } from '../bewertungskarten/bewertungskarten.content';
import { SHOP_CONTENT } from './shop.content';

/**
 * Online-Bestellung der Bewertungskarten. Bezahlt wird auf Stripe; die
 * Preise rechnet der Server selbst nach (Tabelle `prices`).
 *
 * Die Auswahl steht im Warenkorb (src/app/core/shop/cart.service.ts) und
 * übersteht Neuladen und Seitenwechsel. Nach der Bezahlung leert die
 * Dankeseite ihn.
 *
 * AGB, Widerrufsbelehrung und Versand- und Zahlungsbedingungen liegen unter
 * /agb, /widerruf und /versand und sind hier direkt über dem Bestellknopf
 * verlinkt; die Zustimmung ist Pflichtfeld (§ 312j BGB).
 */
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  styleUrl: './shop.component.scss',
  template: `
    <header class="page-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a [routerLink]="'/' | localize">{{ i18n.t('nav.home') }}</a>
          <span class="sep" aria-hidden="true">/</span>
          <a [routerLink]="'/bewertungskarten' | localize">{{ i18n.t('rc.label') }}</a>
          <span class="sep" aria-hidden="true">/</span>
          <span aria-current="page">{{ i18n.t('shop.label') }}</span>
        </nav>
        @if (thanks) {
          <div class="sec-head">
            <p class="section-label">{{ i18n.t('shop.label') }}</p>
            <h1 class="section-title">{{ i18n.t('shop.thanks.title') }}</h1>
            <p class="section-subtitle">{{ i18n.t('shop.thanks.text') }}</p>
            <a [routerLink]="'/' | localize" class="btn btn-primary btn-large">{{ i18n.t('shop.thanks.back') }}</a>
          </div>
        } @else {
          <div class="sec-head">
            <p class="section-label">{{ i18n.t('shop.label') }}</p>
            <h1 class="section-title" [innerHTML]="i18n.t('shop.title')"></h1>
            <p class="section-subtitle">{{ i18n.t('shop.intro') }}</p>
          </div>
        }
      </div>
    </header>

    @if (!thanks) {
      <section class="section section-white">
        <div class="container">
          @if (!shop.checked()) {
            <p class="muted">…</p>
          } @else if (!shop.enabled()) {
            <aside class="note">
              <p class="note-title">{{ i18n.t('shop.soon.title') }}</p>
              <p class="note-text">{{ i18n.t('shop.soon.text') }}</p>
              <a [routerLink]="'/contact' | localize" [queryParams]="{ thema: 'cards' }" fragment="anfrage" class="btn btn-primary">
                {{ i18n.t('cta.consult') }} <app-icon name="arrow" />
              </a>
            </aside>
          } @else {
            <form class="shop" (submit)="order($event)">
              <div class="shop-lines">
                @for (group of groups; track group.title) {
                  <h2 class="shop-group">{{ i18n.t(group.title) }}</h2>
                  @for (p of group.items; track p.key) {
                    <div class="card shop-line" [class.picked]="cart.qtyOf(p.key) > 0">
                      @if (p.image) { <img [src]="p.image" width="120" height="90" alt="" loading="lazy" /> }
                      <div class="shop-name">
                        <strong>{{ i18n.t(p.nameKey) }}</strong>
                        <span>{{ p.unitPrice }} €</span>
                      </div>
                      @if (cart.qtyOf(p.key) === 0) {
                        <button type="button" class="btn btn-secondary shop-add" (click)="cart.add(p.key, 1)">
                          <app-icon name="bag" /> {{ i18n.t('shop.cart.add') }}
                        </button>
                      } @else {
                        <div class="stepper">
                          <button type="button" (click)="cart.add(p.key, -1)" [attr.aria-label]="i18n.t('shop.minus')">−</button>
                          <output [attr.aria-label]="i18n.t(p.nameKey)">{{ cart.qtyOf(p.key) }}</output>
                          <button type="button" (click)="cart.add(p.key, 1)" [disabled]="cart.qtyOf(p.key) >= maxQty" [attr.aria-label]="i18n.t('shop.plus')">+</button>
                        </div>
                      }
                    </div>
                  }
                }
              </div>

              <aside class="card shop-sum">
                <div class="cart-head">
                  <h2 class="shop-group">{{ i18n.t('shop.cart') }}</h2>
                  @if (!cart.empty()) {
                    <button type="button" class="cart-clear" (click)="cart.clear()">{{ i18n.t('shop.cart.clear') }}</button>
                  }
                </div>

                @if (cart.empty()) {
                  <p class="sum-note cart-empty">{{ i18n.t('shop.cart.empty') }}</p>
                } @else {
                  <ul class="cart-items">
                    @for (l of cart.lines(); track l.key) {
                      <li>
                        <span class="cart-qty">{{ l.qty }} ×</span>
                        <span class="cart-label">{{ i18n.t(l.nameKey) }}<em>{{ l.unitPrice }} € {{ i18n.t('shop.cart.each') }}</em></span>
                        <span class="cart-sum">{{ l.sum }} €</span>
                        <button type="button" class="cart-remove" (click)="cart.remove(l.key)" [attr.aria-label]="i18n.t('shop.cart.remove') + ': ' + i18n.t(l.nameKey)">
                          <app-icon name="close" />
                        </button>
                      </li>
                    }
                  </ul>
                }

                <h2 class="shop-group">{{ i18n.t('shop.details') }}</h2>
                <div class="field">
                  <label for="s-business">{{ i18n.t('shop.business') }}</label>
                  <input id="s-business" name="business" required maxlength="200" />
                </div>
                <div class="field">
                  <label for="s-google">{{ i18n.t('shop.google') }}</label>
                  <input id="s-google" name="google" type="url" maxlength="500" placeholder="https://" />
                </div>

                <p class="sum-row"><span>{{ i18n.t('shop.shipping') }}</span><span>{{ cart.shipping ? cart.shipping + ' €' : i18n.t('shop.shipping.free') }}</span></p>
                <p class="sum-total"><span>{{ i18n.t('shop.total') }}</span><strong>{{ cart.total() }} €</strong></p>
                <p class="sum-note">{{ i18n.t('shop.vat') }}</p>
                <p class="sum-note">{{ i18n.t('shop.legal.delivery') }}</p>

                <div class="shop-legal">
                  <p class="sum-note">{{ i18n.t('shop.legal.custom') }}</p>
                  <p class="shop-legal-links">
                    <a [routerLink]="'/agb' | localize" target="_blank" rel="noopener">{{ i18n.t('nav.agb') }}</a>
                    <a [routerLink]="'/widerruf' | localize" target="_blank" rel="noopener">{{ i18n.t('nav.widerruf') }}</a>
                    <a [routerLink]="'/versand' | localize" target="_blank" rel="noopener">{{ i18n.t('nav.versand') }}</a>
                  </p>
                  <label class="shop-consent">
                    <input type="checkbox" name="consent" required />
                    <span>{{ i18n.t('shop.legal.consent') }}</span>
                  </label>
                  @if (i18n.lang() !== 'de') {
                    <p class="sum-note langnote">{{ i18n.t('shop.legal.langnote') }}</p>
                  }
                </div>

                @if (error()) { <p class="sum-error" role="alert">{{ error() }}</p> }
                <button class="btn btn-primary btn-block btn-large" [disabled]="busy() || cart.empty()">{{ i18n.t('shop.submit') }}</button>
                <p class="sum-note">{{ i18n.t('shop.pay') }}</p>
              </aside>
            </form>
          }
        </div>
      </section>
    }
  `,
})
export class ShopComponent implements OnInit {
  readonly i18n = inject(I18nService);
  readonly shop = inject(ShopStatus);
  readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);
  readonly thanks = inject(ActivatedRoute).snapshot.data['thanks'] === true;
  readonly maxQty = MAX_QTY;

  /** Katalog, gruppiert wie auf der Seite: erst einzeln, dann Pakete. */
  readonly groups = [
    { title: 'shop.forms' as const, items: SHOP_PRODUCTS.filter((p) => p.group === 'shop.forms') },
    { title: 'shop.packages' as const, items: SHOP_PRODUCTS.filter((p) => p.group === 'shop.packages') },
  ];

  readonly busy = signal(false);
  readonly error = signal('');

  constructor() {
    this.i18n.register(REVIEW_CARDS_CONTENT);
    this.i18n.register(SHOP_CONTENT);
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.shop.title'),
      description: this.i18n.t('shop.intro'),
      path: this.thanks ? '/bestellen/danke' : '/bestellen',
      noIndex: true,
    });
    // Bezahlt ist bezahlt: der Korb darf nach der Rückkehr nicht noch voll sein.
    if (this.thanks) this.cart.clear();
    else this.shop.check();
  }

  async order(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const items = this.cart.payload();
    if (!items.length) return this.error.set(this.i18n.t('shop.empty'));
    if (!form.reportValidity()) return;

    this.busy.set(true);
    this.error.set('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          lang: this.i18n.lang(),
          businessName: (form.elements.namedItem('business') as HTMLInputElement).value,
          googleLink: (form.elements.namedItem('google') as HTMLInputElement).value,
        }),
      });
      const data = (await res.json()) as { url?: string };
      if (!res.ok || !data.url) throw new Error('checkout');
      window.location.href = data.url;
    } catch {
      this.error.set(this.i18n.t('shop.error'));
      this.busy.set(false);
    }
  }
}
