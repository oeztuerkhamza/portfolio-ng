import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { TRANSLATIONS } from '../../core/i18n/translations';
import { COMPANY } from '../../core/data/company.data';
import { IconComponent } from '../../shared/icon/icon.component';
import {
  REVIEW_CARD_EXAMPLES,
  REVIEW_CARD_FAQS,
  REVIEW_CARD_FORMS,
  REVIEW_CARD_PACKAGES,
  REVIEW_CARD_PRODUCTS,
  REVIEW_CARD_REASONS,
  REVIEW_CARD_STEPS,
} from '../../core/data/review-cards.data';
import { AboBannerComponent } from '../../shared/abo-banner/abo-banner.component';
import { ReviewsComponent } from '../../shared/reviews/reviews.component';
import { CartService, MAX_QTY } from '../../core/shop/cart.service';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { PRODUCT_CONTENT } from '../produkt/produkt.content';
import { SHOP_CONTENT } from '../shop/shop.content';
import { REVIEW_CARDS_CONTENT } from './bewertungskarten.content';

@Component({
  selector: 'app-bewertungskarten',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent, AboBannerComponent, ReviewsComponent],
  templateUrl: './bewertungskarten.component.html',
  styleUrl: './bewertungskarten.component.scss',
})
export class BewertungskartenComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  /**
   * Bei offenem Shop legen die Knöpfe direkt in den Warenkorb. Ist der Shop zu
   * (Schalter im Admin-Portal), bleibt die Anfrage per E-Mail — eine Seite mit
   * Preisen und ohne jeden Weg zum Kauf wäre schlimmer als ein mailto-Link.
   */
  readonly shop = inject(ShopStatus);
  readonly cart = inject(CartService);
  readonly maxQty = MAX_QTY;

  /**
   * Der Schalter des Shops wird erst im Browser abgefragt — die vorgerenderte
   * Seite weiß ihn noch nicht. Bis die Antwort da ist, zeigen wir den
   * Warenkorb-Knopf: das ist der Normalfall, es steht so im ausgelieferten
   * HTML (und damit auch im Suchindex) und es flackert nicht nachträglich um.
   * Nur eine ausdrückliche Absage schaltet auf die E-Mail-Anfrage zurück.
   */
  readonly buyable = computed(() => this.shop.enabled() || !this.shop.checked());

  readonly packages = REVIEW_CARD_PACKAGES;
  readonly steps = REVIEW_CARD_STEPS;
  readonly reasons = REVIEW_CARD_REASONS.map((n, i) => ({ n, icon: ['pin', 'star', 'bolt'][i] }));
  readonly priceFrom = Math.min(...REVIEW_CARD_PACKAGES.map((p) => p.price));
  readonly faqs = REVIEW_CARD_FAQS;
  readonly forms = REVIEW_CARD_FORMS;
  readonly examples = REVIEW_CARD_EXAMPLES;

  /** Kurzname der Detailseite je Katalogschlüssel (/bewertungskarten/<slug>). */
  private readonly slugs = new Map(REVIEW_CARD_PRODUCTS.map((p) => [p.key, p.slug]));

  formSlug(id: string): string {
    return this.slugs.get(`form.${id}`) ?? '';
  }

  pkgSlug(id: string): string {
    return this.slugs.get(`pkg.${id}`) ?? '';
  }

  constructor() {
    this.i18n.register(REVIEW_CARDS_CONTENT);
    // „In den Warenkorb" und „Details" stehen in den Tabellen von Shop und
    // Produktseite — hier nur mitregistriert, nicht doppelt gepflegt.
    this.i18n.register(SHOP_CONTENT);
    this.i18n.register(PRODUCT_CONTENT);
  }

  /**
   * Bestellanfrage per E-Mail. Betreff und Rumpf sind vorausgefüllt, damit
   * der Kunde nur noch seinen Google-Link einsetzen muss — ohne Formular,
   * ohne Backend, ohne Daten, die wir speichern müssten.
   */
  mailto(pkgId?: string): string {
    const subject = this.i18n.t('rc.mail.subject');
    const chosen = pkgId ? `${this.i18n.t('rc.mail.package')}: ${this.i18n.t('rc.pkg.' + pkgId + '.name')}\n` : '';
    const body = `${chosen}${this.i18n.t('rc.mail.body')}`;
    return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /** Anfrage für eine einzelne Produktform (Aufsteller, Anhänger …). */
  mailtoForm(formId: string): string {
    const subject = this.i18n.t('rc.mail.subject');
    const body = `${this.i18n.t('rc.mail.package')}: ${this.i18n.t('rc.form.' + formId + '.name')}\n${this.i18n.t('rc.mail.body')}`;
    return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  ngOnInit(): void {
    this.shop.check();
    this.seo.update({
      title: this.i18n.t('seo.rc.title'),
      description: this.i18n.t('seo.rc.desc'),
      path: '/bewertungskarten',
      keywords: [
        'Google Bewertungskarte',
        'NFC Bewertungskarte',
        'Google Bewertungen sammeln',
        'Google Bewertungskarte kaufen',
        'NFC Karte Google Rezension',
        'NFC Schlüsselanhänger Google Bewertung',
        'Google Bewertung Aufsteller',
        'mehr Google Bewertungen Freiburg',
      ],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Bewertungskarten', path: '/bewertungskarten' },
      ]),
    );

    // Produkt mit Preisspanne — die Angebote spiegeln exakt die Pakete.
    this.seo.setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: TRANSLATIONS['rc.title.plain'].de,
      description: TRANSLATIONS['seo.rc.desc'].de,
      brand: { '@type': 'Brand', name: 'Breisgau Digital' },
      offers: [
        ...this.packages.map((p) => ({
          name: TRANSLATIONS['rc.pkg.' + p.id + '.name'].de,
          price: p.price,
        })),
        ...this.forms.map((f) => ({
          name: REVIEW_CARDS_CONTENT['rc.form.' + f.id + '.name'].de,
          price: f.price,
        })),
      ].map((o) => ({
        '@type': 'Offer',
        name: o.name,
        price: o.price.toFixed(2),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${SeoService.ORIGIN}/de/bewertungskarten`,
      })),
    });

    this.seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((n) => ({
        '@type': 'Question',
        name: TRANSLATIONS[`rc.faq${n}.q`].de,
        acceptedAnswer: { '@type': 'Answer', text: TRANSLATIONS[`rc.faq${n}.a`].de },
      })),
    });
  }
}
