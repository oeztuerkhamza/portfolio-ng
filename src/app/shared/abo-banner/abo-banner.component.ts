import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { SUBSCRIPTION_PRICE_FROM } from '../../core/data/subscriptions.data';
import { IconComponent } from '../icon/icon.component';

/**
 * Hinweis auf das Digital-Abo — derselbe Streifen auf Startseite,
 * Leistungen und den Produktseiten.
 */
@Component({
  selector: 'app-abo-banner',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  template: `
    <aside class="abo-banner">
      <span class="icon-badge"><app-icon name="refresh" /></span>
      <div class="copy">
        <p class="title">{{ i18n.t('abo.banner.title') }}</p>
        <p class="text">{{ i18n.tp('abo.banner.text', priceFrom) }}</p>
      </div>
      <a [routerLink]="'/abo' | localize" class="btn btn-primary">
        {{ i18n.t('abo.cta.view') }}
        <app-icon name="arrow" />
      </a>
    </aside>
  `,
  styles: [
    `
      @import '../../../styles/variables';

      :host {
        display: block;
      }

      .abo-banner {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1rem 1.1rem;
        align-items: center;
        padding: clamp(1.1rem, 3vw, 1.5rem) clamp(1.1rem, 3vw, 1.75rem);
        border: 1px solid $rule-brand;
        border-radius: $radius;
        background: $brand-tint;

        .btn {
          grid-column: 1 / -1;
        }

        @media (min-width: 760px) {
          grid-template-columns: auto 1fr auto;

          .btn {
            grid-column: auto;
          }
        }
      }

      .title {
        font-weight: 650;
        color: $text;
        line-height: 1.35;
      }

      .text {
        color: $text-dim;
        font-size: 0.94rem;
        line-height: 1.55;
        margin-top: 0.15rem;
      }
    `,
  ],
})
export class AboBannerComponent {
  readonly i18n = inject(I18nService);
  readonly priceFrom = SUBSCRIPTION_PRICE_FROM;
}
