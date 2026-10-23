import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { RATGEBER } from '../../core/data/ratgeber.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { dateDe } from './ratgeber-article.component';

/**
 * Übersicht /de/ratgeber. Nur auf Deutsch, wie die Ortsseiten — andere
 * Sprachen werden auf die deutsche Adresse umgeleitet.
 */
@Component({
  selector: 'app-ratgeber',
  standalone: true,
  imports: [RouterLink, IconComponent],
  styleUrl: './ratgeber.component.scss',
  template: `
    <header class="page-hero">
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a routerLink="/de">Start</a>
          <span class="sep" aria-hidden="true">/</span>
          <span aria-current="page">Ratgeber</span>
        </nav>
        <div class="sec-head">
          <p class="section-label">Ratgeber</p>
          <h1 class="section-title">Aus der Praxis — <em>für Betriebe in Südbaden</em>.</h1>
          <p class="section-subtitle">
            Keine allgemeinen Tipps, sondern das, was wir bei unseren Kunden gebaut und gelernt haben: Fallstudien mit echten
            Zahlen und Preise, die genau so auf unseren Angeboten stehen.
          </p>
        </div>
      </div>
    </header>

    <section class="section section-white">
      <div class="container">
        <ul class="grid grid-3 rg-list">
          @for (a of articles; track a.slug) {
            <li>
              <a [routerLink]="'/de/ratgeber/' + a.slug" class="card card-hover rg-card">
                <img [src]="a.image" alt="" width="1440" height="900" loading="lazy" />
                <div class="rg-body">
                  <p class="rg-meta">{{ date(a.published) }} · {{ a.minutes }} Min. Lesezeit</p>
                  <h2 class="card-title">{{ a.title }}</h2>
                  <p class="card-text">{{ a.description }}</p>
                  <span class="rg-more">Weiterlesen <app-icon name="arrow" /></span>
                </div>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
})
export class RatgeberComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  readonly articles = [...RATGEBER].sort((a, b) => b.published.localeCompare(a.published));
  readonly date = dateDe;

  ngOnInit(): void {
    if (this.i18n.lang() !== 'de') {
      this.router.navigateByUrl('/de/ratgeber');
      return;
    }
    this.seo.update({
      title: 'Ratgeber: Websites, Kosten & Fallstudien | Breisgau Digital',
      description:
        'Fallstudien und Preise aus unserer Arbeit für Betriebe in Freiburg und Südbaden: was eine Website kostet und was Warenwirtschaft, Verleih und Ortsseiten im Alltag bringen.',
      path: '/ratgeber',
      langs: ['de'],
    });
    this.seo.setJsonLd('breadcrumb', breadcrumbSchema([
      { name: 'Start', path: '/de' },
      { name: 'Ratgeber', path: '/de/ratgeber' },
    ]));
  }
}
