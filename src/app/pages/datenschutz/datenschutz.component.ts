import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';

@Component({
  selector: 'app-datenschutz',
  standalone: true,
  imports: [],
  templateUrl: './datenschutz.component.html',
  styleUrl: '../legal/legal.component.scss',
})
export class DatenschutzComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Datenschutzerklärung — Hamza Öztürk, Webentwickler Freiburg',
      description:
        'Datenschutzerklärung gemäß DSGVO für hamzaoeztuerk.de — Informationen zur Verarbeitung personenbezogener Daten, Hosting, Web-Fonts und Ihren Rechten.',
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
