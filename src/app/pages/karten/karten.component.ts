import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { COMPANY } from '../../core/data/company.data';
import { type CustomCardProduct, CUSTOM_CARDS, customCard } from '../../core/data/cards.data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { CartService, MAX_QTY } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { SHOP_CONTENT } from '../shop/shop.content';
import { PRODUCT_CONTENT } from '../produkt/produkt.content';
import { CARDS_CONTENT } from './karten.content';

/**
 * Die zwei Seiten der eigenen NFC-Karten: /digitale-visitenkarte und
 * /geschenkkarte. Welche es ist, steht in `data.kind` der Route.
 *
 * Bis hierher waren die beiden Produkte nur zwei Zeilen in der Bestellliste:
 * bestellbar, aber nirgends erklärt, nicht in der Navigation, nicht in der
 * Sitemap. Wer eine digitale Visitenkarte sucht, hat uns nicht gefunden.
 *
 * Die Vorschau ist bewusst ein aus CSS gebautes Schema und kein Foto: so
 * zeigt sie immer das, was die Karte wirklich kann, und wird nicht falsch,
 * wenn sich das Aussehen ändert.
 */
@Component({
  selector: 'app-karten',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  styleUrl: './karten.component.scss',
  template: `
    @let p = product();
    <header class="page-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a [routerLink]="'/' | localize">{{ i18n.t('nav.home') }}</a>
          <span class="sep" aria-hidden="true">/</span>
          <span aria-current="page">{{ i18n.t('shop.card.' + p.id) }}</span>
        </nav>

        <div class="page-hero-grid kt-grid">
          <div>
            <p class="section-label">{{ i18n.t('kt.label') }}</p>
            <h1 class="section-title" [innerHTML]="i18n.t('kt.' + p.id + '.title')"></h1>
            <p class="section-subtitle">{{ i18n.t('kt.' + p.id + '.intro') }}</p>

            <p class="kt-price"><strong>{{ p.price }} €</strong></p>

            <div class="kt-actions">
              @if (buyable()) {
                @if (cart.qtyOf(key()) === 0) {
                  <button type="button" class="btn btn-primary btn-large" (click)="cart.add(key(), 1)">
                    <app-icon name="bag" /> {{ i18n.t('shop.cart.add') }}
                  </button>
                } @else {
                  <div class="stepper kt-stepper" role="group" [attr.aria-label]="i18n.t('shop.card.' + p.id)">
                    <button type="button" (click)="cart.add(key(), -1)" [attr.aria-label]="i18n.t('shop.minus')">−</button>
                    <output>{{ cart.qtyOf(key()) }}</output>
                    <button type="button" (click)="cart.add(key(), 1)" [disabled]="cart.qtyOf(key()) >= maxQty" [attr.aria-label]="i18n.t('shop.plus')">+</button>
                  </div>
                }
                <a [routerLink]="'/bestellen' | localize" class="btn btn-secondary btn-large">
                  {{ i18n.t('pd.cart') }}@if (cart.count()) { <span class="rc-badge">{{ cart.count() }}</span> }
                </a>
              } @else {
                <a [href]="mailto(p)" class="btn btn-primary btn-large">{{ i18n.t('pd.ask') }}</a>
              }
            </div>
            @if (shop.checked() && !shop.enabled()) {
              <p class="kt-note">{{ i18n.t('pd.closed') }}</p>
            }
          </div>

          <!-- Schema der Kartenseite, aus CSS gebaut: kein Foto, das veralten kann -->
          <figure class="kt-preview" aria-hidden="true">
            <div class="kt-phone">
              <div class="kt-card" [class.gift]="p.id === 'gift'">
                @if (p.id === 'business') {
                  <span class="kt-avatar"></span>
                  <span class="kt-line w60 tall"></span>
                  <span class="kt-line w40 dim"></span>
                  <span class="kt-rows">
                    <span class="kt-row"><i></i><b class="w50"></b></span>
                    <span class="kt-row"><i></i><b class="w70"></b></span>
                    <span class="kt-row"><i></i><b class="w40"></b></span>
                  </span>
                  <span class="kt-btn"></span>
                  <span class="kt-btn ghost"></span>
                } @else {
                  <span class="kt-photos"><i></i><i></i><i></i></span>
                  <span class="kt-line w70 tall"></span>
                  <span class="kt-line w45 dim"></span>
                  <span class="kt-line w90 dim"></span>
                  <span class="kt-line w80 dim"></span>
                  <span class="kt-btn"></span>
                }
              </div>
            </div>
          </figure>
        </div>
      </div>
    </header>

    <section class="section section-white">
      <div class="container kt-body">
        <div class="kt-text">
          <p>{{ i18n.t('kt.' + p.id + '.long') }}</p>

          <h2 class="kt-h2">{{ i18n.t('kt.how') }}</h2>
          <ol class="kt-steps">
            @for (n of steps; track n) {
              <li>
                <strong>{{ i18n.t('kt.step' + n + '.t') }}</strong>
                <span>{{ i18n.t('kt.step' + n + '.d') }}</span>
              </li>
            }
          </ol>
        </div>

        <aside class="card kt-side">
          <h2 class="kt-side-title">{{ i18n.t('kt.' + p.id + '.onit') }}</h2>
          <ul class="check-list">
            @for (n of points; track n) {
              <li>{{ i18n.t('kt.' + p.id + '.p' + n) }}</li>
            }
          </ul>
          <p class="kt-small">{{ i18n.t('shop.vat') }}</p>
          <p class="kt-small">{{ i18n.t('shop.legal.delivery') }}</p>
          <p class="kt-small">{{ i18n.t('shop.legal.custom') }}</p>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card kt-own">
          <h2 class="kt-h2">{{ i18n.t('kt.own.t') }}</h2>
          <p>{{ i18n.t('kt.own.d') }}</p>
        </div>

        <div class="kt-more">
          <a [routerLink]="('/' + other().slug) | localize" class="card kt-more-card">
            <strong>{{ i18n.t('kt.other.' + p.id) }}</strong>
            <span>{{ i18n.t('shop.card.' + other().id) }} · {{ other().price }} €</span>
          </a>
          <a [routerLink]="'/bewertungskarten' | localize" class="card kt-more-card">
            <strong>{{ i18n.t('nav.cards') }}</strong>
            <span>{{ i18n.t('kt.review') }}</span>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class KartenComponent implements OnInit {
  readonly i18n = inject(I18nService);
  readonly cart = inject(CartService);
  readonly shop = inject(ShopStatus);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  readonly maxQty = MAX_QTY;
  readonly steps = [1, 2, 3, 4] as const;
  readonly points = [1, 2, 3, 4, 5, 6] as const;

  /**
   * Das Produkt dieser Seite. Die Route gibt die Art mit; ohne sie wäre die
   * Seite leer, darum als letzter Ausweg die Visitenkarte.
   */
  readonly product = signal<CustomCardProduct>(
    customCard(String(inject(ActivatedRoute).snapshot.data['slug'] ?? '')) ?? CUSTOM_CARDS[0],
  );

  /** Katalogschlüssel für den Warenkorb — `card.<art>`. */
  readonly key = computed(() => `card.${this.product().id}`);

  /** Das jeweils andere Produkt, für den Verweis unten. */
  readonly other = computed(() => CUSTOM_CARDS.find((c) => c.id !== this.product().id) ?? CUSTOM_CARDS[0]);

  /**
   * Bis die Antwort von /api/shop da ist, zeigen wir den Warenkorb: so steht
   * er im ausgelieferten HTML und flackert nicht nachträglich um.
   */
  readonly buyable = computed(() => this.shop.enabled() || !this.shop.checked());

  constructor() {
    this.i18n.register(SHOP_CONTENT);
    this.i18n.register(PRODUCT_CONTENT);
    this.i18n.register(CARDS_CONTENT);
  }

  /** Nur solange der Shop zu ist: Anfrage per E-Mail. */
  mailto(p: CustomCardProduct): string {
    const subject = this.i18n.t('shop.card.' + p.id);
    return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}`;
  }

  ngOnInit(): void {
    this.shop.check();
    const p = this.product();
    const long = this.i18n.t(`kt.${p.id}.long`);

    this.seo.update({
      title: this.i18n.t(`seo.kt.${p.id}.title`),
      description: this.i18n.t(`kt.${p.id}.intro`).slice(0, 300),
      path: `/${p.slug}`,
      image: this.seo.absolute(p.image),
      keywords:
        p.id === 'business'
          ? ['digitale Visitenkarte', 'NFC Visitenkarte', 'digitale Visitenkarte NFC', 'Visitenkarte Freiburg', 'NFC Karte Kontakt']
          : ['NFC Geschenkkarte', 'Geschenkkarte mit Fotos', 'digitale Geburtstagskarte', 'Geschenkidee NFC', 'Karte mit Musik'],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: this.i18n.t('shop.card.' + p.id), path: `/${p.slug}` },
      ]),
    );

    this.seo.setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: this.i18n.t('shop.card.' + p.id),
      description: long,
      image: this.seo.absolute(p.image),
      brand: { '@type': 'Brand', name: 'Breisgau Digital' },
      offers: {
        '@type': 'Offer',
        price: p.price.toFixed(2),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${SeoService.ORIGIN}/de/${p.slug}`,
      },
    });
  }
}
