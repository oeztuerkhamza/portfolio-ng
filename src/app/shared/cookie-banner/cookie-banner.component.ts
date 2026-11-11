import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { I18nService, Lang } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

const TEXT: Record<Lang, { text: string; link: string; accept: string; decline: string }> = {
  de: {
    text: 'Darf ich anonymisierte Besucherstatistik mit Google Analytics erfassen? Ohne Ihre Zustimmung wird nichts geladen und nichts gespeichert.',
    link: 'Datenschutz',
    accept: 'Zustimmen',
    decline: 'Ablehnen',
  },
  en: {
    text: 'May I collect anonymised visitor statistics with Google Analytics? Without your consent nothing is loaded and nothing is stored.',
    link: 'Privacy policy',
    accept: 'Accept',
    decline: 'Decline',
  },
  tr: {
    text: 'Google Analytics ile anonim ziyaretçi istatistiği toplayabilir miyim? Onayınız olmadan hiçbir şey yüklenmez ve saklanmaz.',
    link: 'Gizlilik',
    accept: 'Kabul et',
    decline: 'Reddet',
  },
};

/** Einwilligungsabfrage für Google Analytics; "Ablehnen" ist gleichwertig sichtbar. */
@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  template: `
    @if (analytics.bannerOpen()) {
      <aside class="cookie-banner" role="dialog" aria-label="Analytics">
        <p>
          {{ t().text }}
          <a [routerLink]="'/datenschutz' | localize">{{ t().link }}</a>
        </p>
        <div class="actions">
          <button type="button" class="btn btn-secondary" (click)="analytics.decline()">
            {{ t().decline }}
          </button>
          <button type="button" class="btn btn-primary" (click)="analytics.accept()">
            {{ t().accept }}
          </button>
        </div>
      </aside>
    }
  `,
  styles: [
    `
      @import '../../../styles/variables';

      .cookie-banner {
        position: fixed;
        z-index: 1000;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        max-width: 640px;
        display: grid;
        gap: 0.85rem;
        padding: 1rem 1.15rem;
        background: #fff;
        border: 1px solid $rule-strong;
        border-radius: $radius;
        box-shadow: $shadow-md;
        font-size: 0.9rem;
        color: $text-soft;

        p {
          margin: 0;
        }

        a {
          color: $brand;
          text-decoration: underline;
        }

        .actions {
          display: flex;
          gap: 0.6rem;
          justify-content: flex-end;
        }

        @media (min-width: 760px) {
          left: 1.5rem;
          right: auto;
          bottom: 1.5rem;
        }
      }
    `,
  ],
})
export class CookieBannerComponent {
  readonly analytics = inject(AnalyticsService);
  private readonly i18n = inject(I18nService);

  t() {
    return TEXT[this.i18n.lang()];
  }
}
