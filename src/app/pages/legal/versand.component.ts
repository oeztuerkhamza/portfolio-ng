import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';

@Component({
  selector: 'app-versand',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  templateUrl: './versand.component.html',
  styleUrl: './legal.component.scss',
})
export class VersandComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Versand- und Zahlungsbedingungen — Breisgau Digital',
      description: 'Lieferzeiten, Versandkosten und Zahlungsarten für Bestellungen von Bewertungskarten bei Breisgau Digital.',
      path: '/versand',
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Versand & Zahlung', path: '/versand' },
      ]),
    );
  }
}
