import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { IconComponent } from '../icon/icon.component';

/**
 * Hinweis auf die digitale Speisekarte — derselbe Streifen auf Startseite und
 * Leistungen, mit zwei Bildschirmen der Referenz (Divan, /m/divan).
 */
@Component({
  selector: 'app-speisekarte-teaser',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  template: `
    <aside class="sk-teaser">
      <div class="phones" aria-hidden="true">
        <img src="/assets/images/speisekarte/divan-2-start.webp" width="540" height="1168" loading="lazy" decoding="async" alt="" />
        <img src="/assets/images/speisekarte/divan-3-schritt.webp" width="540" height="1168" loading="lazy" decoding="async" alt="" />
      </div>
      <div class="copy">
        <p class="label">{{ i18n.t('sk.teaser.label') }}</p>
        <p class="title">{{ i18n.t('sk.teaser.title') }}</p>
        <p class="text">{{ i18n.t('sk.teaser.text') }}</p>
        <a [routerLink]="'/digitale-speisekarte' | localize" class="btn btn-primary">
          {{ i18n.t('sk.teaser.cta') }}
          <app-icon name="arrow" />
        </a>
      </div>
    </aside>
  `,
  styles: [
    `
      @import '../../../styles/variables';

      :host {
        display: block;
      }

      .sk-teaser {
        display: grid;
        gap: 1.5rem;
        align-items: center;
        padding: clamp(1.25rem, 3vw, 2rem);
        border-radius: $radius-lg;
        background: linear-gradient(150deg, #7d1a2c, #2c0611);
        color: #fbeabb;
        overflow: hidden;

        @media (min-width: 760px) {
          grid-template-columns: minmax(220px, 0.9fr) 1.1fr;
          gap: 2.25rem;
        }
      }

      .phones {
        display: flex;
        justify-content: center;
        gap: 0.9rem;

        img {
          width: min(42%, 170px);
          height: auto;
          border-radius: 18px;
          border: 5px solid #1b1b1b;
          box-shadow: 0 0 0 1px rgba(227, 180, 76, 0.55), 0 18px 34px -16px rgba(0, 0, 0, 0.7);
        }

        img:last-child {
          transform: translateY(18px);
        }
      }

      .label {
        margin: 0 0 0.4rem;
        color: #e3b44c;
        font-size: 0.74rem;
        font-weight: 700;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .title {
        margin: 0;
        color: #fff6dc;
        font-size: clamp(1.35rem, 3vw, 1.75rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.2;
      }

      .text {
        margin: 0.7rem 0 1.25rem;
        color: rgba(251, 234, 187, 0.85);
        font-size: 0.98rem;
        line-height: 1.6;
      }

      .btn {
        background: linear-gradient(180deg, #fdeeb4, #e3b44c 55%, #b98322);
        border-color: #f4d98a;
        color: #3a0814;
      }
    `,
  ],
})
export class SpeisekarteTeaserComponent {
  readonly i18n = inject(I18nService);
}
