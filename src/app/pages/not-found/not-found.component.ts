import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  template: `
    <header class="page-hero nf">
      <div class="container">
        <p class="section-label">404</p>
        <h1 class="section-title">Seite nicht<br /><em>gefunden</em>.</h1>
        <p class="section-subtitle">
          Diese Seite gibt es nicht (mehr). Vielleicht hilft einer dieser Wege weiter:
        </p>
        <div class="page-hero-actions">
          <a [routerLink]="'/' | localize" class="btn btn-primary btn-large">Zur Startseite</a>
          <a [routerLink]="'/leistungen' | localize" class="btn btn-secondary btn-large">Leistungen</a>
          <a [routerLink]="'/contact' | localize" class="btn btn-secondary btn-large">Kontakt</a>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      @import '../../../styles/variables';
      .container { @include container; }
      .nf { min-height: 70vh; display: flex; align-items: center; }
    `,
  ],
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Seite nicht gefunden (404) — Breisgau Digital',
      description: 'Die angeforderte Seite existiert nicht.',
      path: '/404',
      noIndex: true,
    });
  }
}
