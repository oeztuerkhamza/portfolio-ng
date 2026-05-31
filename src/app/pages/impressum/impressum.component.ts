import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [],
  templateUrl: './impressum.component.html',
  styleUrl: '../legal/legal.component.scss',
})
export class ImpressumComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Impressum — Hamza Öztürk, Webentwickler Freiburg',
      description:
        'Impressum und Anbieterkennzeichnung gemäß § 5 DDG — Hamza Öztürk, freiberuflicher Webentwickler aus Freiburg im Breisgau.',
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
