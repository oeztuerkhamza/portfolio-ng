import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  templateUrl: './datenschutz.component.html',
  styleUrl: '../legal/legal.component.scss',
})
export class DatenschutzComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Datenschutzerklärung — Breisgau Digital, Freiburg im Breisgau',
      description:
        'Datenschutzerklärung gemäß DSGVO — Hosting, lokal ausgelieferte Schriften, Kontakt per E-Mail, Telefon und WhatsApp sowie Ihre Rechte.',
      path: '/datenschutz',
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Datenschutz', path: '/datenschutz' },
      ]),
    );
  }
}
