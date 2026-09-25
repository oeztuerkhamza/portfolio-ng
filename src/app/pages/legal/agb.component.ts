import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';

@Component({
  selector: 'app-agb',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  templateUrl: './agb.component.html',
  styleUrl: './legal.component.scss',
})
export class AgbComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Allgemeine Geschäftsbedingungen — Breisgau Digital',
      description: 'Allgemeine Geschäftsbedingungen für Bestellungen von NFC- und QR-Bewertungskarten bei Breisgau Digital, Freiburg im Breisgau.',
      path: '/agb',
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'AGB', path: '/agb' },
      ]),
    );
  }
}
