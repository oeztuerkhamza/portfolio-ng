import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { TRANSLATIONS } from '../../core/i18n/translations';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import {
  Billing,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_PRICE_FROM,
  SubscriptionPlan,
  planPrice,
} from '../../core/data/subscriptions.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { ABO_CONTENT } from './abo.content';

@Component({
  selector: 'app-abo',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './abo.component.html',
  styleUrl: './abo.component.scss',
})
export class AboComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();

  readonly plans = SUBSCRIPTION_PLANS;
  readonly billing = signal<Billing>('monthly');
  readonly steps = [1, 2, 3, 4];
  readonly faqs = [1, 2, 3, 4, 5];

  constructor() {
    this.i18n.register(ABO_CONTENT);
  }

  priceOf(plan: SubscriptionPlan): number {
    return planPrice(plan, this.billing());
  }

  pointList(plan: SubscriptionPlan): number[] {
    return Array.from({ length: plan.points }, (_, i) => i + 1);
  }

  setupText(plan: SubscriptionPlan): string {
    return plan.setupFee ? this.i18n.tp('abo.setup', plan.setupFee) : this.i18n.t('abo.setup.none');
  }

  termText(plan: SubscriptionPlan): string {
    return this.i18n.t('abo.term').replace('{n}', String(plan.minTermMonths));
  }

  /** Zahlungslink (z. B. Stripe) für die gewählte Zahlweise, falls hinterlegt. */
  checkoutUrl(plan: SubscriptionPlan): string | null {
    return plan.checkoutUrl?.[this.billing()] ?? null;
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.tp('seo.abo.title', SUBSCRIPTION_PRICE_FROM),
      description: this.i18n.t('seo.abo.desc'),
      path: '/abo',
      keywords: [
        'Website Abo',
        'Webseite mieten Freiburg',
        'Homepage monatlich bezahlen',
        'Google Bewertungskarte Abo',
        'Digitalisierung kleine Unternehmen Abo',
      ],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Abo & Preise', path: '/abo' },
      ]),
    );

    // Pakete als Angebote mit Monatspreis — deutsch, wie alle Schemas.
    this.seo.setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Digital-Abo für Betriebe',
      description: ABO_CONTENT['seo.abo.desc'].de,
      provider: { '@id': `${SeoService.ORIGIN}/#service` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Baden-Württemberg' },
      offers: this.plans.map((p) => ({
        '@type': 'Offer',
        name: TRANSLATIONS['abo.plan.' + p.id + '.name'].de,
        price: p.monthly.toFixed(2),
        priceCurrency: 'EUR',
        url: `${SeoService.ORIGIN}/de/abo`,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: p.monthly.toFixed(2),
          priceCurrency: 'EUR',
          referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
        },
      })),
    });

    this.seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((n) => ({
        '@type': 'Question',
        name: ABO_CONTENT[`abo.faq${n}.q`].de,
        acceptedAnswer: { '@type': 'Answer', text: ABO_CONTENT[`abo.faq${n}.a`].de },
      })),
    });
  }
}
