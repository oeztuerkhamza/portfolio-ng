import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  template: `
    <section class="not-found">
      <div class="container">
        <p class="folio-line"><span>Folio &numero;404</span></p>
        <h1 class="nf-title">Seite nicht<br /><em>gefunden</em>.</h1>
        <p class="nf-text">
          Diese Seite existiert nicht (mehr). Vielleicht hilft einer dieser Wege
          weiter:
        </p>
        <div class="nf-actions">
          <a [routerLink]="'/' | localize" class="btn btn-primary">Zur Startseite</a>
          <a [routerLink]="'/leistungen' | localize" class="btn btn-secondary">Leistungen</a>
          <a [routerLink]="'/projects' | localize" class="btn btn-secondary">Projekte</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      @import '../../../styles/variables';
      .not-found {
        min-height: 70vh;
        display: flex;
        align-items: center;
        padding: clamp(120px, 20vh, 220px) 0;
      }
      .folio-line {
        @include mono-label;
        color: $gold;
        margin-bottom: 1.5rem;
      }
      .nf-title {
        font-family: $font-display;
        font-weight: 300;
        font-size: clamp(2.8rem, 9vw, 6rem);
        line-height: 1;
        color: $paper;
        margin-bottom: 1.5rem;
        em { font-style: italic; color: $gold; }
      }
      .nf-text { color: $paper-dim; font-size: 1.1rem; max-width: 48ch; margin-bottom: 2rem; }
      .nf-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    `,
  ],
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Seite nicht gefunden (404) — Hamza Öztürk',
      description: 'Die angeforderte Seite existiert nicht.',
      path: '/404',
      noIndex: true,
    });
  }
}
