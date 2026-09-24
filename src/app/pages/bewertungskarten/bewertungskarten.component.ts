import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { TRANSLATIONS } from '../../core/i18n/translations';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import { IconComponent } from '../../shared/icon/icon.component';
import {
  REVIEW_CARD_EXAMPLES,
  REVIEW_CARD_FAQS,
  REVIEW_CARD_FORMS,
  REVIEW_CARD_PACKAGES,
  REVIEW_CARD_REASONS,
  REVIEW_CARD_STEPS,
} from '../../core/data/review-cards.data';
import { AboBannerComponent } from '../../shared/abo-banner/abo-banner.component';
import { ShopStatus } from '../../core/shop/shop-status.service';
import { REVIEW_CARDS_CONTENT } from './bewertungskarten.content';

@Component({
  selector: 'app-bewertungskarten',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent, AboBannerComponent],
  templateUrl: './bewertungskarten.component.html',
  styleUrl: './bewertungskarten.component.scss',
})
export class BewertungskartenComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  /** Button 'Online bestellen' nur bei offenem Shop (Schalter im Admin-Portal). */
  readonly shop = inject(ShopStatus);

  readonly packages = REVIEW_CARD_PACKAGES;
  readonly steps = REVIEW_CARD_STEPS;
  readonly reasons = REVIEW_CARD_REASONS.map((n, i) => ({ n, icon: ['pin', 'star', 'bolt'][i] }));
  readonly priceFrom = Math.min(...REVIEW_CARD_PACKAGES.map((p) => p.price));
  readonly faqs = REVIEW_CARD_FAQS;
  readonly forms = REVIEW_CARD_FORMS;
  readonly examples = REVIEW_CARD_EXAMPLES;

  constructor() {
    this.i18n.register(REVIEW_CARDS_CONTENT);
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

  whatsapp(pkgId?: string): string {
    const chosen = pkgId ? `${this.i18n.t('rc.pkg.' + pkgId + '.name')} — ` : '';
    return whatsappUrl(chosen + this.i18n.t('rc.mail.subject'));
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
