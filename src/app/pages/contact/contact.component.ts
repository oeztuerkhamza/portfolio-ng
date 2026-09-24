import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { CONTACT_CONTENT } from './contact.content';

type Interest = 'cards' | 'web' | 'sh' | 'other';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();

  readonly interests: Interest[] = ['cards', 'web', 'sh', 'other'];

  // Formularzustand. Es gibt kein Backend: die Anfrage wird als fertig
  // ausgefüllte E-Mail bzw. WhatsApp-Nachricht geöffnet und vom Kunden
  // selbst abgeschickt — auf dieser Website wird nichts gespeichert.
  readonly name = signal('');
  readonly business = signal('');
  readonly reach = signal('');
  readonly message = signal('');
  readonly chosen = signal<Interest[]>([]);
  readonly sent = signal(false);

  constructor() {
    this.i18n.register(CONTACT_CONTENT);
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.contact.title'),
      description: this.i18n.t('seo.contact.desc'),
      path: '/contact',
      keywords: [
        'Digitalagentur Freiburg Kontakt',
        'Webseite erstellen lassen Freiburg',
        'Google Bewertungskarte bestellen',
        'Smart Home Beratung Freiburg',
      ],
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Kontakt', path: '/contact' },
      ]),
    );
  }

  value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  toggle(option: Interest): void {
    this.chosen.update((list) =>
      list.includes(option) ? list.filter((o) => o !== option) : [...list, option],
    );
  }

  sendMail(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.reportValidity()) return;
    const subject = this.i18n.t('contact.mail.subject');
    window.location.href =
      `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(this.compose())}`;
    this.sent.set(true);
  }

  sendWhatsApp(form: HTMLFormElement): void {
    if (!form.reportValidity()) return;
    window.open(whatsappUrl(this.compose()), '_blank', 'noopener');
    this.sent.set(true);
  }

  /** Nachrichtentext in der Sprache der Seite. */
  private compose(): string {
    const t = (key: string) => this.i18n.t(key);
    const topics = this.chosen().map((o) => t('contact.f.opt.' + o)).join(', ');
    const lines = [t('contact.mail.greeting'), ''];
    if (this.message().trim()) lines.push(this.message().trim(), '');
    if (topics) lines.push(`${t('contact.f.interest')} ${topics}`);
    lines.push(`${t('contact.f.name')}: ${this.name().trim()}`);
    if (this.business().trim()) lines.push(`${t('contact.f.business.short')}: ${this.business().trim()}`);
    lines.push(`${t('contact.f.reach')}: ${this.reach().trim()}`);
    return lines.join('\n');
  }
}
