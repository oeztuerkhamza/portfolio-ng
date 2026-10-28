import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { SPEISEKARTE_CONTENT } from './speisekarte.content';

/**
 * Seite /digitale-speisekarte: die digitale Speisekarte als Leistung, mit dem
 * Divan Ocakbaşı als Referenz. Die Bildschirmfotos stammen von der echten
 * Karte (/m/divan) und liegen unter assets/images/speisekarte/.
 */
@Component({
  selector: 'app-speisekarte',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './speisekarte.component.html',
  styleUrl: './speisekarte.component.scss',
})
export class SpeisekarteComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();

  /** Die Karte des Divan: am Tisch, die ganze Karte, und die Beispielkarte zum Ausprobieren. */
  readonly live = {
    table: `${SeoService.ORIGIN}/m/divan`,
    full: `${SeoService.ORIGIN}/m/divan/karte`,
    demo: `${SeoService.ORIGIN}/m/demo`,
  };

  readonly shots = [
    { file: 'divan-1-intro', n: 1 },
    { file: 'divan-2-start', n: 2 },
    { file: 'divan-3-schritt', n: 3 },
    { file: 'divan-4-getraenke', n: 4 },
    { file: 'divan-5-auswahl', n: 5 },
  ];
  readonly features = [
    { n: 1, icon: 'layers' },
    { n: 2, icon: 'globe' },
    { n: 3, icon: 'clock' },
    { n: 4, icon: 'star' },
    { n: 5, icon: 'sparkle' },
    { n: 6, icon: 'nfc' },
    { n: 7, icon: 'template' },
    { n: 8, icon: 'instagram' },
  ];
  readonly steps = [1, 2, 3, 4];
  readonly faqs = [1, 2, 3, 4];

  constructor() {
    this.i18n.register(SPEISEKARTE_CONTENT);
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.sk.title'),
      description: this.i18n.t('seo.sk.desc'),
      path: '/digitale-speisekarte',
      keywords: [
        'Digitale Speisekarte',
        'QR-Code Speisekarte Restaurant',
        'Digitale Speisekarte Freiburg',
        'Speisekarte mehrsprachig',
        'NFC Speisekarte',
      ],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Digitale Speisekarte', path: '/digitale-speisekarte' },
      ]),
    );

    this.seo.setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Digitale Speisekarte für Restaurants',
      description: SPEISEKARTE_CONTENT['seo.sk.desc'].de,
      provider: { '@id': `${SeoService.ORIGIN}/#service` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Baden-Württemberg' },
    });

    this.seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((n) => ({
        '@type': 'Question',
        name: SPEISEKARTE_CONTENT[`sk.faq${n}.q`].de,
        acceptedAnswer: { '@type': 'Answer', text: SPEISEKARTE_CONTENT[`sk.faq${n}.a`].de },
      })),
    });
  }
}
