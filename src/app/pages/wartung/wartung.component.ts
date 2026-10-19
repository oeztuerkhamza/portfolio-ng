import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, formatAmount, whatsappUrl } from '../../core/data/company.data';
import {
  MAINTENANCE_PLANS,
  MAINTENANCE_PRICE_FROM,
  MaintenancePlan,
} from '../../core/data/maintenance.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { WARTUNG_CONTENT } from './wartung.content';

/**
 * Wartungsseite /wartung — drei Monatspakete für Hosting, Updates, Backups und
 * kleine Änderungen. Ersetzt das frühere Digital-Abo unter /abo (die alte
 * Adresse leitet per vercel.json hierher um).
 */
@Component({
  selector: 'app-wartung',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './wartung.component.html',
  styleUrl: './wartung.component.scss',
})
export class WartungComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();

  readonly plans = MAINTENANCE_PLANS;
  readonly steps = [1, 2, 3, 4];
  readonly faqs = [1, 2, 3, 4, 5];

  constructor() {
    this.i18n.register(WARTUNG_CONTENT);
  }

  pointList(plan: MaintenancePlan): number[] {
    return Array.from({ length: plan.points }, (_, i) => i + 1);
  }

  /** Betrag im Zahlenformat der Sprache. */
  fmt(amount: number): string {
    return formatAmount(amount, this.i18n.lang());
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.tp('seo.wart.title', MAINTENANCE_PRICE_FROM),
      description: this.i18n.t('seo.wart.desc'),
      path: '/wartung',
      keywords: [
        'Website Wartung Freiburg',
        'Homepage Wartung Preise',
        'Website Pflege monatlich',
        'Webseite betreuen lassen',
        'Website Hosting und Wartung',
      ],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Wartung & Pflege', path: '/wartung' },
      ]),
    );

    // Pakete als Angebote mit Monatspreis — deutsch, wie alle Schemas.
    this.seo.setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Website-Wartung für Betriebe',
      description: WARTUNG_CONTENT['seo.wart.desc'].de,
      provider: { '@id': `${SeoService.ORIGIN}/#service` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Baden-Württemberg' },
      offers: this.plans.map((p) => ({
        '@type': 'Offer',
        name: WARTUNG_CONTENT[`wart.plan.${p.id}.name`].de,
        price: p.monthly.toFixed(2),
        priceCurrency: 'EUR',
        url: `${SeoService.ORIGIN}/de/wartung`,
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
        name: WARTUNG_CONTENT[`wart.faq${n}.q`].de,
        acceptedAnswer: { '@type': 'Answer', text: WARTUNG_CONTENT[`wart.faq${n}.a`].de },
      })),
    });
  }
}
