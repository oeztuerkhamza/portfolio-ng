import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import {
  SMART_HOME_FAQS,
  SMART_HOME_PACKAGES,
  SMART_HOME_STEPS,
  SMART_HOME_USES,
} from '../../core/data/smart-home.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { SMART_HOME_CONTENT } from './smart-home.content';

const USE_ICONS = ['flame', 'key', 'bulb', 'bolt', 'bell', 'grid'];

@Component({
  selector: 'app-smart-home',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './smart-home.component.html',
  styleUrl: './smart-home.component.scss',
})
export class SmartHomeComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  readonly packages = SMART_HOME_PACKAGES;
  readonly uses = SMART_HOME_USES.map((n, i) => ({ n, icon: USE_ICONS[i] }));
  readonly steps = SMART_HOME_STEPS;
  readonly faqs = SMART_HOME_FAQS;
  readonly priceFrom = Math.min(...SMART_HOME_PACKAGES.map((p) => p.price));

  constructor() {
    this.i18n.register(SMART_HOME_CONTENT);
  }

  /** Anfrage per E-Mail, vorausgefüllt — wie bei den Bewertungskarten. */
  mailto(pkgId?: string): string {
    const subject = this.i18n.t('sh.mail.subject');
    const chosen = pkgId ? `${this.i18n.t('sh.mail.package')}: ${this.i18n.t('sh.pkg.' + pkgId + '.name')}\n` : '';
    const body = `${chosen}${this.i18n.t('sh.mail.body')}`;
    return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  whatsapp(pkgId?: string): string {
    const chosen = pkgId ? `${this.i18n.t('sh.pkg.' + pkgId + '.name')} — ` : '';
    return whatsappUrl(chosen + this.i18n.t('sh.mail.subject'));
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.sh.title'),
      description: this.i18n.t('seo.sh.desc'),
      path: '/smart-home',
      image: '/assets/images/products/smart-home.webp',
      keywords: [
        'Smart Home Freiburg',
        'Smart Home Einrichtung',
        'smarte Heizung Gewerbe',
        'Self-Check-in Ferienwohnung',
        'Home Automation Baden-Württemberg',
        'Smart Home Installation Freiburg',
      ],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Smart Home', path: '/smart-home' },
      ]),
    );

    this.seo.setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: SMART_HOME_CONTENT['sh.title.plain'].de,
      description: SMART_HOME_CONTENT['seo.sh.desc'].de,
      provider: { '@id': `${SeoService.ORIGIN}/#service` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Baden-Württemberg' },
      offers: this.packages.map((p) => ({
        '@type': 'Offer',
        name: SMART_HOME_CONTENT['sh.pkg.' + p.id + '.name'].de,
        price: p.price.toFixed(2),
        priceCurrency: 'EUR',
        url: `${SeoService.ORIGIN}/de/smart-home`,
      })),
    });

    this.seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((n) => ({
        '@type': 'Question',
        name: SMART_HOME_CONTENT[`sh.faq${n}.q`].de,
        acceptedAnswer: { '@type': 'Answer', text: SMART_HOME_CONTENT[`sh.faq${n}.a`].de },
      })),
    });
  }
}
