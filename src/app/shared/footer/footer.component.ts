import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, whatsappUrl, SMART_HOME_ENABLED } from '../../core/data/company.data';
import { IconComponent } from '../icon/icon.component';
import { TOWNS } from '../../core/data/towns.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly i18n = inject(I18nService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();
  /** Interne Links auf die Ortsseiten (nur Deutsch). */
  readonly towns = TOWNS;
  /** Siehe SMART_HOME_ENABLED in company.data.ts. */
  readonly smartHome = SMART_HOME_ENABLED;
  currentYear = new Date().getFullYear();
}
