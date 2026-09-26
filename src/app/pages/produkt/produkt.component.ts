import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { COMPANY } from '../../core/data/company.data';
import {
  type ReviewCardProduct,
  REVIEW_CARD_PRODUCTS,
  REVIEW_CARD_STEPS,
  productNameKey,
  productTextKey,
  reviewCardProduct,
} from '../../core/data/review-cards.data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { CartService, MAX_QTY } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { REVIEW_CARDS_CONTENT } from '../bewertungskarten/bewertungskarten.content';
import { SHOP_CONTENT } from '../shop/shop.content';
import { PRODUCT_CONTENT } from './produkt.content';

/**
 * Detailseite eines Produkts: /bewertungskarten/<kurzname>.
 *
 * Sie ersetzt den früheren WhatsApp-Knopf auf der Übersicht: wer mehr wissen
 * will, liest hier weiter, statt zu schreiben. Und sie ist die Seite, die bei
 * Google auf „NFC Schlüsselanhänger Google Bewertung" landen kann — die
 * Übersicht kann nicht für sieben Produkte gleichzeitig ranken.
 *
 * Gelegt wird direkt in den Warenkorb (src/app/core/shop/cart.service.ts).
 * Ist der Shop zu (Schalter im Admin-Portal), bleibt die E-Mail-Anfrage —
 * sonst stünde die Seite ohne jeden Weg zum Kauf da.
 */
@Component({
  selector: 'app-produkt',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  styleUrl: './produkt.component.scss',
  template: `
    @if (product(); as p) {
      <header class="page-hero">
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a [routerLink]="'/' | localize">{{ i18n.t('nav.home') }}</a>
            <span class="sep" aria-hidden="true">/</span>
            <a [routerLink]="'/bewertungskarten' | localize">{{ i18n.t('rc.label') }}</a>
            <span class="sep" aria-hidden="true">/</span>
            <span aria-current="page">{{ i18n.t(nameKey(p)) }}</span>
          </nav>

          <div class="page-hero-grid pd-grid">
            <div>
              <p class="section-label">{{ i18n.t(p.kind === 'pkg' ? 'rc.pkg.label' : 'rc.forms.label') }}</p>
              <h1 class="section-title">{{ i18n.t(nameKey(p)) }}</h1>
              <p class="section-subtitle">{{ i18n.t(textKey(p)) }}</p>

              <p class="pd-price">
                <strong>{{ p.price }} €</strong>
                @if (p.kind === 'form') { <small>{{ i18n.t('rc.form.unit') }}</small> }
              </p>

              <div class="pd-actions">
                @if (buyable()) {
                  @if (cart.qtyOf(p.key) === 0) {
                    <button type="button" class="btn btn-primary btn-large" (click)="cart.add(p.key, 1)">
                      <app-icon name="bag" /> {{ i18n.t('shop.cart.add') }}
                    </button>
                  } @else {
                    <div class="stepper pd-stepper" role="group" [attr.aria-label]="i18n.t(nameKey(p))">
                      <button type="button" (click)="cart.add(p.key, -1)" [attr.aria-label]="i18n.t('shop.minus')">−</button>
                      <output>{{ cart.qtyOf(p.key) }}</output>
                      <button type="button" (click)="cart.add(p.key, 1)" [disabled]="cart.qtyOf(p.key) >= maxQty" [attr.aria-label]="i18n.t('shop.plus')">+</button>
                    </div>
                  }
                  <a [routerLink]="'/bestellen' | localize" class="btn btn-secondary btn-large">
                    {{ i18n.t('pd.cart') }}@if (cart.count()) { <span class="pd-badge">{{ cart.count() }}</span> }
                  </a>
                } @else {
                  <a [href]="mailto(p)" class="btn btn-primary btn-large">{{ i18n.t('pd.ask') }}</a>
                }
              </div>
              @if (shop.checked() && !shop.enabled()) {
                <p class="pd-note">{{ i18n.t('pd.closed') }}</p>
              }
            </div>

            <figure class="media-frame">
              <img
                [src]="p.image"
                [srcset]="p.imageSmall + ' 800w, ' + p.image + ' 1600w'"
                sizes="(max-width: 1024px) 100vw, 45vw"
                width="1600"
                height="1200"
                [alt]="i18n.t(nameKey(p))"
              />
            </figure>
          </div>
        </div>
      </header>

      <section class="section section-white">
        <div class="container pd-body">
          <div class="pd-text">
            <p>{{ i18n.t('pd.' + p.slug + '.long') }}</p>

            <h2 class="pd-steps-title">{{ i18n.t('rc.steps.label') }}</h2>
            <ol class="pd-steps">
              @for (n of steps; track n) {
                <li>
                  <strong>{{ i18n.t('rc.step' + n + '.t') }}</strong>
                  <span>{{ i18n.t('rc.step' + n + '.d') }}</span>
                </li>
              }
            </ol>
          </div>

          <aside class="card pd-side">
            @if (p.kind === 'pkg') {
              <h2 class="pd-side-title">{{ i18n.t('pd.contains') }}</h2>
              <ul class="check-list">
                <li>{{ p.cards }}× {{ i18n.t(p.cards === 1 ? 'rc.unit.card' : 'rc.unit.cards') }}</li>
                @if (p.stand) { <li>{{ i18n.t('rc.unit.stand') }}</li> }
                @for (n of points(p); track n) {
                  <li>{{ i18n.t('rc.pkg.' + p.id + '.p' + n) }}</li>
                }
              </ul>
            }

            <h2 class="pd-side-title">{{ i18n.t('pd.incl') }}</h2>
            <ul class="check-list">
              @for (n of [1, 2, 3, 4]; track n) {
                <li>{{ i18n.t('pd.inc' + n) }}</li>
              }
            </ul>

            <p class="pd-small">{{ i18n.t('shop.vat') }}</p>
            <p class="pd-small">{{ i18n.t('shop.legal.delivery') }}</p>
            <p class="pd-small">{{ i18n.t('shop.legal.custom') }}</p>
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title pd-more-title">{{ i18n.t('pd.back') }}</h2>
          <ul class="pd-more">
            @for (o of others(p); track o.slug) {
              <li>
                <a [routerLink]="('/bewertungskarten/' + o.slug) | localize" class="card pd-more-card">
                  <img [src]="o.imageSmall" width="800" height="600" loading="lazy" [alt]="i18n.t(nameKey(o))" />
                  <span class="pd-more-name">{{ i18n.t(nameKey(o)) }}</span>
                  <span class="pd-more-price">{{ o.price }} €</span>
                </a>
              </li>
            }
          </ul>
          <p class="pd-small">
            {{ i18n.t('pd.faq') }}
            <a [routerLink]="'/bewertungskarten' | localize">{{ i18n.t('rc.label') }}</a>
          </p>
        </div>
      </section>
    } @else {
      <header class="page-hero">
        <div class="container">
          <div class="sec-head">
            <h1 class="section-title">{{ i18n.t('pd.notfound.title') }}</h1>
            <p class="section-subtitle">{{ i18n.t('pd.notfound.text') }}</p>
            <a [routerLink]="'/bewertungskarten' | localize" class="btn btn-primary btn-large">{{ i18n.t('pd.back') }}</a>
          </div>
        </div>
      </header>
    }
  `,
})
export class ProduktComponent implements OnInit {
  readonly i18n = inject(I18nService);
  readonly cart = inject(CartService);
  readonly shop = inject(ShopStatus);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  readonly product = signal<ReviewCardProduct | null>(null);
  readonly maxQty = MAX_QTY;

  /**
   * Der Schalter des Shops wird erst im Browser abgefragt — die vorgerenderte
   * Seite weiß ihn noch nicht. Bis die Antwort da ist, zeigen wir den
   * Warenkorb-Knopf: das ist der Normalfall, es steht so im ausgelieferten
   * HTML (und damit auch im Suchindex) und es flackert nicht nachträglich um.
   * Nur eine ausdrückliche Absage schaltet auf die E-Mail-Anfrage zurück.
   */
  readonly buyable = computed(() => this.shop.enabled() || !this.shop.checked());

  readonly nameKey = productNameKey;
  readonly steps = REVIEW_CARD_STEPS;
  readonly textKey = productTextKey;

  /** Die anderen Produkte, für die Reihe unten. */
  others(p: ReviewCardProduct): ReviewCardProduct[] {
    return REVIEW_CARD_PRODUCTS.filter((o) => o.slug !== p.slug);
  }

  constructor() {
    // Namen, Kurztexte und Paketpunkte stehen in den Tabellen der
    // Übersichtsseite und des Shops — hier nur die eigenen Texte dazu.
    this.i18n.register(REVIEW_CARDS_CONTENT);
    this.i18n.register(SHOP_CONTENT);
    this.i18n.register(PRODUCT_CONTENT);
  }

  /** Punkte eines Pakets: 1…points. */
  points(p: ReviewCardProduct): number[] {
    return [1, 2, 3, 4].slice(0, p.points ?? 0);
  }

  /** Nur solange der Shop zu ist: Anfrage per E-Mail mit vorgefülltem Betreff. */
  mailto(p: ReviewCardProduct): string {
    const subject = this.i18n.t('rc.mail.subject');
    const body = `${this.i18n.t('rc.mail.package')}: ${this.i18n.t(productNameKey(p))}\n${this.i18n.t('rc.mail.body')}`;
    return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  ngOnInit(): void {
    this.shop.check();
    const p = reviewCardProduct(this.route.snapshot.paramMap.get('produkt'));
    this.product.set(p);

    if (!p) {
      this.seo.update({
        title: `${this.i18n.t('pd.notfound.title')} — Breisgau Digital`,
        description: this.i18n.t('pd.notfound.text'),
        path: '/bewertungskarten',
        noIndex: true,
      });
      return;
    }

    const name = this.i18n.t(productNameKey(p));
    const long = this.i18n.t(`pd.${p.slug}.long`);
    this.seo.update({
      title: `${name} — ${this.i18n.t('rc.label')} | Breisgau Digital`,
      // Erster Satz des Fließtexts: je Produkt eine eigene Beschreibung,
      // ohne sie ein zweites Mal pflegen zu müssen.
      description: long.split('. ')[0].slice(0, 300) + '.',
      path: `/bewertungskarten/${p.slug}`,
      image: this.seo.absolute(p.image),
      keywords: [name, 'NFC', 'Google Bewertung', 'Bewertungskarte', 'Freiburg'],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Bewertungskarten', path: '/bewertungskarten' },
        { name: name, path: `/bewertungskarten/${p.slug}` },
      ]),
    );

    this.seo.setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description: long,
      image: this.seo.absolute(p.image),
      brand: { '@type': 'Brand', name: 'Breisgau Digital' },
      offers: {
        '@type': 'Offer',
        price: p.price.toFixed(2),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${SeoService.ORIGIN}/de/bewertungskarten/${p.slug}`,
      },
    });
  }
}
