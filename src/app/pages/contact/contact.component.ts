import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.contact.title'),
      description: this.i18n.t('seo.contact.desc'),
      path: '/contact',
      keywords: [
        'Webentwickler Freiburg beauftragen',
        'Webseite erstellen lassen Freiburg',
        'Kontakt Webentwicklung',
        'Freelancer Webentwicklung Freiburg',
      ],
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
