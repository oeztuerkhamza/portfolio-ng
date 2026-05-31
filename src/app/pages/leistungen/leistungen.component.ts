import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { TRANSLATIONS } from '../../core/i18n/translations';

interface ServiceDetail {
  num: string;
  titleKey: string;
  textKey: string;
  pointKeys: string[];
}

interface ProcessStep {
  num: string;
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
  imports: [RouterLink, LocalizePipe],
  templateUrl: './leistungen.component.html',
  styleUrl: './leistungen.component.scss',
})
export class LeistungenComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  services: ServiceDetail[] = [
    { num: '01', titleKey: 'svc.new.title', textKey: 'leist.s1.text', pointKeys: ['leist.s1.p1', 'leist.s1.p2', 'leist.s1.p3', 'leist.s1.p4'] },
    { num: '02', titleKey: 'svc.relaunch.title', textKey: 'leist.s2.text', pointKeys: ['leist.s2.p1', 'leist.s2.p2', 'leist.s2.p3', 'leist.s2.p4'] },
    { num: '03', titleKey: 'svc.app.title', textKey: 'leist.s3.text', pointKeys: ['leist.s3.p1', 'leist.s3.p2', 'leist.s3.p3', 'leist.s3.p4'] },
    { num: '04', titleKey: 'svc.shop.title', textKey: 'leist.s4.text', pointKeys: ['leist.s4.p1', 'leist.s4.p2', 'leist.s4.p3', 'leist.s4.p4'] },
  ];

  process: ProcessStep[] = [
    { num: '01', titleKey: 'leist.p1.t', textKey: 'leist.p1.d' },
    { num: '02', titleKey: 'leist.p2.t', textKey: 'leist.p2.d' },
    { num: '03', titleKey: 'leist.p3.t', textKey: 'leist.p3.d' },
    { num: '04', titleKey: 'leist.p4.t', textKey: 'leist.p4.d' },
  ];

  faqs: Faq[] = [
    { qKey: 'leist.faq1.q', aKey: 'leist.faq1.a' },
    { qKey: 'leist.faq2.q', aKey: 'leist.faq2.a' },
    { qKey: 'leist.faq3.q', aKey: 'leist.faq3.a' },
    { qKey: 'leist.faq4.q', aKey: 'leist.faq4.a' },
    { qKey: 'leist.faq5.q', aKey: 'leist.faq5.a' },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.leist.title'),
      description: this.i18n.t('seo.leist.desc'),
      path: '/leistungen',
      keywords: [
        'Webseite erstellen lassen Freiburg',
        'Webentwickler Freiburg',
        'Webdesign Freiburg',
        'Homepage erstellen Freiburg',
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
