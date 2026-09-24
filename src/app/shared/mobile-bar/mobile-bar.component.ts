import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import { IconComponent } from '../icon/icon.component';

/**
 * Feste Aktionsleiste am unteren Rand — nur auf dem Handy und kleinen
 * Tablets. Die meisten Anfragen kleiner Betriebe kommen vom Telefon; der
 * Weg zum Anruf oder zu WhatsApp soll nie weiter als ein Daumen entfernt sein.
 */
@Component({
  selector: 'app-mobile-bar',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  template: `
    <nav class="mbar" [attr.aria-label]="i18n.t('nav.contact')">
      <a [href]="company.phoneHref" class="mbar-item">
        <app-icon name="phone" />
        <span>{{ i18n.t('cta.call') }}</span>
      </a>
      <a [href]="whatsapp" target="_blank" rel="noopener" class="mbar-item">
        <app-icon name="chat" />
        <span>WhatsApp</span>
      </a>
      <a [routerLink]="'/contact' | localize" class="mbar-item mbar-primary">
        <app-icon name="mail" />
        <span>{{ i18n.t('cta.request_short') }}</span>
      </a>
    </nav>
  `,
  styleUrl: './mobile-bar.component.scss',
})
export class MobileBarComponent {
  readonly i18n = inject(I18nService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();
}
