import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';

@Component({
  selector: 'app-widerruf',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  templateUrl: './widerruf.component.html',
  styleUrl: './legal.component.scss',
})
export class WiderrufComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Widerrufsbelehrung und Muster-Widerrufsformular — Breisgau Digital',
      description: 'Widerrufsrecht, Fristen und Muster-Widerrufsformular für Bestellungen bei Breisgau Digital, Freiburg im Breisgau.',
      path: '/widerruf',
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Widerrufsbelehrung', path: '/widerruf' },
      ]),
    );
  }
}
