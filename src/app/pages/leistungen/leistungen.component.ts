import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { TRANSLATIONS } from '../../core/i18n/translations';
import { COMPANY, PRODUCTS, whatsappUrl } from '../../core/data/company.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { LEISTUNGEN_CONTENT } from './leistungen.content';

interface ServiceDetail {
  icon: string;
  titleKey: string;
  textKey: string;
  pointKeys: string[];
}

interface ProcessStep {
  titleKey: string;
  textKey: string;
}

interface Faq {
  qKey: string;
  aKey: string;
}

@Component({
  selector: 'app-leistungen',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './leistungen.component.html',
  styleUrl: './leistungen.component.scss',
})
export class LeistungenComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();

  /** Die beiden Festpreis-Produkte neben den Projektleistungen. */
  readonly products = PRODUCTS.filter((p) => p.id !== 'web');

  readonly services: ServiceDetail[] = [
    { icon: 'monitor', titleKey: 'leist.s1.title', textKey: 'leist.s1.text', pointKeys: ['leist.s1.p1', 'leist.s1.p2', 'leist.s1.p3', 'leist.s1.p4'] },
    { icon: 'refresh', titleKey: 'leist.s2.title', textKey: 'leist.s2.text', pointKeys: ['leist.s2.p1', 'leist.s2.p2', 'leist.s2.p3', 'leist.s2.p4'] },
    { icon: 'pin', titleKey: 'svc.relaunch.title', textKey: 'leist.s5.text', pointKeys: ['leist.s5.p1', 'leist.s5.p2', 'leist.s5.p3', 'leist.s5.p4'] },
    { icon: 'grid', titleKey: 'svc.app.title', textKey: 'leist.s3.text', pointKeys: ['leist.s3.p1', 'leist.s3.p2', 'leist.s3.p3', 'leist.s3.p4'] },
    { icon: 'bag', titleKey: 'svc.shop.title', textKey: 'leist.s4.text', pointKeys: ['leist.s4.p1', 'leist.s4.p2', 'leist.s4.p3', 'leist.s4.p4'] },
  ];

  readonly reasons = [
    { n: 1, icon: 'user' },
    { n: 2, icon: 'pin' },
    { n: 3, icon: 'bolt' },
    { n: 4, icon: 'search' },
    { n: 5, icon: 'euro' },
    { n: 6, icon: 'tool' },
  ];

  readonly process: ProcessStep[] = [
    { titleKey: 'leist.p1.t', textKey: 'leist.p1.d' },
    { titleKey: 'leist.p2.t', textKey: 'leist.p2.d' },
    { titleKey: 'leist.p3.t', textKey: 'leist.p3.d' },
    { titleKey: 'leist.p4.t', textKey: 'leist.p4.d' },
  ];

  readonly faqs: Faq[] = [
    { qKey: 'leist.faq1.q', aKey: 'leist.faq1.a' },
    { qKey: 'leist.faq2.q', aKey: 'leist.faq2.a' },
    { qKey: 'leist.faq3.q', aKey: 'leist.faq3.a' },
    { qKey: 'leist.faq4.q', aKey: 'leist.faq4.a' },
    { qKey: 'leist.faq5.q', aKey: 'leist.faq5.a' },
  ];

  constructor() {
    this.i18n.register(LEISTUNGEN_CONTENT);
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.leist.title'),
      description: this.i18n.t('seo.leist.desc'),
      path: '/leistungen',
      keywords: [
        'Webseite erstellen lassen Freiburg',
        'Homepage erstellen Freiburg',
        'Webdesign Freiburg',
        'Google Unternehmensprofil einrichten',
        'Online-Shop erstellen Freiburg',
        'Website Kosten Freiburg',
      ],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Leistungen', path: '/leistungen' },
      ]),
    );

    // FAQPage — kept in German (the canonical language) for rich results.
    this.seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((f) => ({
        '@type': 'Question',
        name: TRANSLATIONS[f.qKey].de,
        acceptedAnswer: { '@type': 'Answer', text: TRANSLATIONS[f.aKey].de },
      })),
    });
  }
}
