import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
export class ResumeComponent {
  pdfUrl = 'assets/pdf/Hamza_Oeztuerk_Lebenslauf_Fullstack_Entwickler.pdf';
  safePdfUrl: SafeResourceUrl;

  documents: DocumentItem[] = [
    {
      label: 'Arbeitszeugnis — Dicom GmbH',
      url: 'assets/pdf/bewerbung_software_entwickler_herr_öztürk_arbeitszeugnis.pdf',
      category: 'Arbeit',
    },
    {
      label: 'IHK Zeugnis — Fachinformatiker',
      url: 'assets/pdf/bewerbung_software_entwickler_herr_öztürk_IHK_zeugnis.pdf',
      category: 'Ausbildung',
    },
    {
      label: 'Berufschule Zeugnis',
      url: 'assets/pdf/bewerbung_software_entwickler_herr_öztürk_berufschule_zeugnis.pdf',
      category: 'Ausbildung',
    },
    {
      label: 'Data Analyst Zertifikate — Clarusway',
      url: 'assets/pdf/bewerbung_software_entwickler_herr_öztürk_data_analyst _zertifikate.pdf',
      category: 'Zertifikate',
    },
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.pdfUrl,
    );
  }
}
