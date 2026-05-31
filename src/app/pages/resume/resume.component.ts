import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';

interface DocumentItem {
  label: string;
  url: string;
  category: string;
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
})
export class ResumeComponent implements OnInit {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  pdfUrl = '/assets/pdf/Hamza_Oeztuerk_Lebenslauf_Fullstack_Entwickler.pdf';
  safePdfUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.pdfUrl,
  );

  documents: DocumentItem[] = [
    {
      label: 'Arbeitszeugnis — Dicom GmbH',
      url: '/assets/pdf/bewerbung_software_entwickler_herr_öztürk_arbeitszeugnis.pdf',
      category: 'Arbeit',
    },
  ];

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.resume.title'),
      description: this.i18n.t('seo.resume.desc'),
      path: '/lebenslauf',
      type: 'profile',
      keywords: ['Lebenslauf', 'Full-Stack Entwickler Freiburg', 'CV Hamza Öztürk'],
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Lebenslauf', path: '/lebenslauf' },
      ]),
    );
  }
}
