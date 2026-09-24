import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  templateUrl: './impressum.component.html',
  styleUrl: '../legal/legal.component.scss',
})
export class ImpressumComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Impressum — Breisgau Digital, Freiburg im Breisgau',
      description:
        'Impressum und Anbieterkennzeichnung gemäß § 5 DDG — Breisgau Digital, Inhaber Hamza Öztürk, Freiburg im Breisgau.',
      path: '/impressum',
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Impressum', path: '/impressum' },
      ]),
    );
  }
}
