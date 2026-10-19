import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { RequestWizardComponent } from '../../shared/request-wizard/request-wizard.component';
import { CONTACT_CONTENT } from './contact.content';

/**
 * Kontaktseite: oben die direkten Wege (Telefon, WhatsApp, E-Mail), darunter
 * der Anfrage-Assistent. Er führt in drei kurzen Schritten zur Anfrage und
 * versteht Links wie /contact?thema=wartung&paket=pflege.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent, RequestWizardComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();

  constructor() {
    this.i18n.register(CONTACT_CONTENT);
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.contact.title'),
      description: this.i18n.t('seo.contact.desc'),
      path: '/contact',
      keywords: ['Digitalagentur Freiburg Kontakt', 'Webseite erstellen lassen Freiburg', 'Webdesign Anfrage'],
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Kontakt', path: '/contact' },
      ]),
    );
  }
}
