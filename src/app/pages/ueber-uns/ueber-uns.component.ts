import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { EXPERIENCES } from '../../core/data/experience.data';
import { PROJECTS } from '../../core/data/project.data';
import { COMPANY } from '../../core/data/company.data';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-ueber-uns',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './ueber-uns.component.html',
  styleUrl: './ueber-uns.component.scss',
})
export class UeberUnsComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  /** Werdegang, kompakt: Arbeit und Ausbildung, ohne Zertifikatsliste. */
  readonly milestones = EXPERIENCES.filter((e) => e.type !== 'certificate').slice(0, 4);

  /** Belegzahlen für den Zahlenblock — alles aus den echten Projektdaten. */
  readonly liveCount = PROJECTS.filter((p) => !!p.liveUrl).length;
  readonly projectCount = PROJECTS.length;

  readonly company = COMPANY;

  readonly principles = [
    { n: 1, icon: 'euro' },
    { n: 2, icon: 'key' },
    { n: 3, icon: 'globe' },
    { n: 4, icon: 'tool' },
  ];
  readonly process = [1, 2, 3, 4] as const;

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.about.title'),
      description: this.i18n.t('seo.about.desc'),
      path: '/ueber-uns',
      keywords: [
        'Digitalagentur Freiburg',
        'Digitalisierung Mittelstand Freiburg',
        'IT Dienstleister Freiburg',
        'Webentwicklung Südbaden',
      ],
    });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Über uns', path: '/ueber-uns' },
      ]),
    );
  }
}
