import { Component, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { COMPANY, formatAmount, whatsappUrl } from '../../core/data/company.data';
import { UPDATE_CONTENT } from '../../core/data/homepage-update.content';
import { UPDATE_PACKAGES, UPDATE_PRICE_FROM } from '../../core/data/homepage-update.data';
import { MAINTENANCE_PLANS, MAINTENANCE_PRICE_FROM } from '../../core/data/maintenance.data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { WARTUNG_CONTENT } from '../../pages/wartung/wartung.content';
import { IconComponent } from '../icon/icon.component';
import { REQUEST_WIZARD_CONTENT } from './request-wizard.content';

type Service = 'new' | 'update' | 'wartung' | 'other';
type Status = 'idle' | 'sending' | 'done' | 'error';

interface Choice {
  id: string;
  /** i18n-Schlüssel für Titel und Beschreibung, oder direkt ein Text. */
  title: string;
  text?: string;
  /** Zeile mit Preis bzw. Lieferzeit, wenn das Paket eine hat. */
  meta?: string;
}

/** Deutsche Bezeichnungen für die Nachricht an uns — wir lesen sie, nicht der Kunde. */
const DE: Record<string, Record<string, string>> = {
  new: {
    small: 'Klein (bis 5 Seiten)',
    company: 'Firmen-Website (bis ca. 15 Seiten)',
    custom: 'Mit Shop, Buchung oder App',
    unsure: 'Weiß ich noch nicht',
  },
  other: { shop: 'Online-Shop', app: 'Web-App oder Software', booking: 'Buchungssystem', invite: 'Digitale Einladung (Hochzeit, Kına, Event)', question: 'Nur eine Frage' },
};
const DE_SERVICE: Record<Service, string> = {
  new: 'Neue Website',
  update: 'Bestehende Website aufbessern (Homepage-Update)',
  wartung: 'Website-Wartung',
  other: 'Etwas anderes',
};
const DE_SLOT: Record<string, string> = { any: 'egal', morning: 'vormittags', afternoon: 'nachmittags', evening: 'abends' };
const TOPIC: Record<Service, string> = { new: 'web', update: 'update', wartung: 'wartung', other: 'other' };

/**
 * Anfrage-Assistent: drei kurze Schritte statt eines langen Formulars.
 *
 * 1. Was möchten Sie?        — ein Tipp
 * 2. Paket bzw. Größe        — ein Tipp (entfällt, wenn schon über einen Link gewählt)
 * 3. Wie erreichen wir Sie?  — Name und Telefon/E-Mail, alles andere freiwillig
 *
 * Die Anfrage geht an /api/enquiry (landet im Portal und als E-Mail bei uns).
 * Scheitert das, bekommt der Kunde E-Mail und WhatsApp mit fertigem Text —
 * eine Anfrage darf nie an einem Netzfehler verloren gehen.
 */
@Component({
  selector: 'app-request-wizard',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './request-wizard.component.html',
  styleUrl: './request-wizard.component.scss',
})
export class RequestWizardComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  readonly company = COMPANY;

  private readonly card = viewChild<ElementRef<HTMLElement>>('card');
  private readonly heading = viewChild<ElementRef<HTMLElement>>('heading');

  readonly updateFrom = UPDATE_PRICE_FROM;
  readonly wartungFrom = MAINTENANCE_PRICE_FROM;

  readonly step = signal<1 | 2 | 3>(1);
  readonly service = signal<Service | null>(null);
  readonly detail = signal<string | null>(null);
  readonly name = signal('');
  readonly reach = signal('');
  readonly business = signal('');
  readonly website = signal('');
  readonly slot = signal('any');
  readonly note = signal('');
  readonly status = signal<Status>('idle');
  readonly invalid = signal(false);

  readonly services: { id: Service; icon: string }[] = [
    { id: 'new', icon: 'monitor' },
    { id: 'update', icon: 'refresh' },
    { id: 'wartung', icon: 'shield' },
    { id: 'other', icon: 'grid' },
  ];
  readonly slots = ['any', 'morning', 'afternoon', 'evening'];

  /** Schritt 2 hängt von der gewählten Leistung ab. */
  readonly choices = computed<Choice[]>(() => {
    const unsure: Choice = { id: 'unsure', title: this.i18n.t('rw.unsure'), text: this.i18n.t('rw.unsure.d') };
    switch (this.service()) {
      case 'new':
        return [
          ...['small', 'company', 'custom'].map((id) => ({
            id,
            title: this.i18n.t(`rw.size.${id}.t`),
            text: this.i18n.t(`rw.size.${id}.d`),
          })),
          unsure,
        ];
      case 'update':
        return [
          ...UPDATE_PACKAGES.map((p) => ({
            id: p.id,
            title: this.i18n.t(`upd.${p.id}.name`),
            text: this.i18n.t(`upd.${p.id}.tag`),
            meta: `${this.fmt(p.price)} € · ${this.i18n.tp('rw.pkg.days', p.days)}`,
          })),
          unsure,
        ];
      case 'wartung':
        return [
          ...MAINTENANCE_PLANS.map((p) => ({
            id: p.id,
            title: this.i18n.t(`wart.plan.${p.id}.name`),
            text: this.i18n.t(`wart.plan.${p.id}.for`),
            meta: this.i18n.tp('rw.pkg.month', p.monthly),
          })),
          unsure,
        ];
      case 'other':
        return ['shop', 'app', 'booking', 'invite', 'question'].map((id) => ({ id, title: this.i18n.t(`rw.other.${id}`) }));
      default:
        return [];
    }
  });

  /** Für Aktualisierung und Wartung fragen wir nach der jetzigen Adresse. */
  readonly asksWebsite = computed(() => this.service() === 'update' || this.service() === 'wartung');

  constructor() {
    this.i18n.register(REQUEST_WIZARD_CONTENT);
    this.i18n.register(UPDATE_CONTENT);
    this.i18n.register(WARTUNG_CONTENT);
  }

  ngOnInit(): void {
    // Links wie /contact?thema=wartung&paket=pflege überspringen die ersten Schritte.
    const q = this.route.snapshot.queryParamMap;
    const topic = q.get('thema');
    const map: Record<string, Service> = { web: 'new', new: 'new', update: 'update', wartung: 'wartung', other: 'other' };
    const service = topic ? map[topic] : undefined;
    if (!service) return;
    this.service.set(service);
    this.step.set(2);
    const pkg = q.get('paket');
    if (pkg && this.choices().some((c) => c.id === pkg)) {
      this.detail.set(pkg);
      this.step.set(3);
    }
  }

  fmt(amount: number): string {
    return formatAmount(amount, this.i18n.lang());
  }

  /** Beschreibung der Leistung auf der Auswahlkarte; Preise stehen nur dort, wo es einen gibt. */
  serviceText(id: Service): string {
    if (id === 'update') return this.i18n.tp('rw.s.update.d', this.updateFrom);
    if (id === 'wartung') return this.i18n.tp('rw.s.wartung.d', this.wartungFrom);
    return this.i18n.t(`rw.s.${id}.d`);
  }

  progress(): string {
    return this.i18n.t('rw.progress').replace('{n}', String(this.step())).replace('{t}', '3');
  }

  pickService(id: Service): void {
    if (this.service() !== id) this.detail.set(null);
    this.service.set(id);
    this.go(2);
  }

  pickDetail(id: string): void {
    this.detail.set(id);
    this.go(3);
  }

  back(): void {
    const s = this.step();
    if (s > 1) this.go((s - 1) as 1 | 2);
  }

  private go(step: 1 | 2 | 3): void {
    this.step.set(step);
    this.status.set('idle');
    // Fokus auf die neue Frage und oben im Kasten beginnen: wer mit der
    // Tastatur oder dem Screenreader arbeitet, landet an der richtigen Stelle.
    setTimeout(() => {
      this.heading()?.nativeElement.focus({ preventScroll: true });
      this.card()?.nativeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  value(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  async submit(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!this.name().trim() || !this.reach().trim()) {
      this.invalid.set(true);
      return;
    }
    this.invalid.set(false);
    this.status.set('sending');
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value ?? '';
    const service = this.service() ?? 'other';
    const detail = this.detail();
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name().trim(),
          business: this.business().trim(),
          reach: this.reach().trim(),
          message: this.messageForUs(),
          topics: [TOPIC[service]],
          plan: detail && ['start', 'standard', 'komplett', 'basis', 'pflege', 'plus'].includes(detail) ? detail : null,
          lang: this.i18n.lang(),
          // Honeypot: das Feld heißt für Bots „website". Die echte Adresse
          // steht in der Nachricht, nicht hier.
          website: honeypot,
        }),
      });
      this.status.set(res.ok ? 'done' : 'error');
    } catch {
      this.status.set('error');
    }
    if (this.status() === 'done') {
      setTimeout(() => {
        this.heading()?.nativeElement.focus({ preventScroll: true });
        this.card()?.nativeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    }
  }

  /** Was der Kunde gewählt hat, auf Deutsch — so lesen wir es im Portal und in der E-Mail. */
  messageForUs(): string {
    const service = this.service() ?? 'other';
    const detail = this.detail();
    const lines: string[] = [];
    lines.push(`Leistung: ${DE_SERVICE[service]}`);
    if (detail) lines.push(`Auswahl: ${this.detailDe(service, detail)}`);
    if (this.website().trim()) lines.push(`Website: ${this.website().trim()}`);
    lines.push(`Rückruf: ${DE_SLOT[this.slot()] ?? this.slot()}`);
    if (this.note().trim()) lines.push('', this.note().trim());
    return lines.join('\n');
  }

  private detailDe(service: Service, detail: string): string {
    if (detail === 'unsure') return 'Noch unsicher — bitte beraten';
    if (service === 'update') {
      const p = UPDATE_PACKAGES.find((u) => u.id === detail);
      return p ? `Update ${detail[0].toUpperCase()}${detail.slice(1)} (${p.price} €, ${p.days} Werktage)` : detail;
    }
    if (service === 'wartung') {
      const p = MAINTENANCE_PLANS.find((m) => m.id === detail);
      return p ? `Wartung ${detail[0].toUpperCase()}${detail.slice(1)} (${p.monthly} € pro Monat)` : detail;
    }
    return DE[service]?.[detail] ?? detail;
  }

  /** Ausgewählte Leistung und Auswahl in der Sprache des Kunden, für die Bestätigung. */
  summary(): string {
    const service = this.service() ?? 'other';
    const parts = [this.i18n.t(`rw.s.${service}.t`)];
    const detail = this.detail();
    if (detail) {
      const choice = this.choices().find((c) => c.id === detail);
      if (choice) parts.push(choice.title);
    }
    return parts.join(' — ');
  }

  /** Fertiger Text für E-Mail und WhatsApp, wenn das Absenden nicht geklappt hat. */
  fallbackText(): string {
    return [
      'Guten Tag,',
      '',
      this.messageForUs(),
      '',
      `Name: ${this.name().trim()}`,
      ...(this.business().trim() ? [`Betrieb: ${this.business().trim()}`] : []),
      `Erreichbar: ${this.reach().trim()}`,
    ].join('\n');
  }

  mailHref(): string {
    return `mailto:${COMPANY.email}?subject=${encodeURIComponent('Anfrage über die Website')}&body=${encodeURIComponent(this.fallbackText())}`;
  }

  waHref(): string {
    return whatsappUrl(this.fallbackText());
  }
}
