import { Component, computed, inject, input } from '@angular/core';
import qrcode from 'qrcode-generator';
import { I18nService } from '../../core/i18n/i18n.service';
import { IconComponent } from '../icon/icon.component';
import { type CardKind, type CardTheme } from '../../core/cards/card-draft.model';
import { CARD_PRINT_CONTENT } from './card-print.content';

/**
 * Die gedruckte Karte — das Stück Plastik, das in den Briefkasten kommt.
 *
 * Die andere Vorschau zeigt die Seite, die aufgeht, wenn jemand die Karte
 * ans Telefon hält. Was der Kunde aber bestellt, ist zuerst einmal ein
 * Gegenstand, und den hat er bis hierher nie gesehen: er bezahlte eine
 * Karte und bekam ein Foto vom Beispielprodukt.
 *
 * Gezeichnet, nicht fotografiert, und im echten Seitenverhältnis einer
 * Scheckkarte (85,6 × 54 mm nach ISO/IEC 7810 ID-1). Ein Foto würde falsch,
 * sobald sich am Aufbau etwas ändert; hier steht immer das drauf, was der
 * Kunde gerade eingegeben hat.
 *
 * Der Aufbau folgt den Beispielkarten unter assets/images/products/examples:
 * links Name und Zeile darunter, unten der NFC-Hinweis, rechts der QR-Code.
 *
 * **Keine Druckvorlage.** Das hier beruhigt, es geht nicht in die Presse:
 * kein Anschnitt, kein Sicherheitsabstand, kein CMYK. Wer daraus einmal eine
 * Vorlage machen will, fängt besser neu an, statt diesem Bauteil Maße
 * anzuhängen, die es nicht einhalten kann.
 */

/**
 * Dieselben Farben wie THEMES in src/server/cards.ts. Absichtlich doppelt:
 * der Browser darf nichts aus src/server ziehen. Wer sie dort ändert, muss
 * sie hier ändern — sonst trägt die gedruckte Karte andere Farben als die
 * Seite, die sie aufruft.
 */
const THEMES: Record<CardTheme, { bg: string; ink: string; dim: string; accent: string }> = {
  brand: { bg: '#f6f8fb', ink: '#0e1a2b', dim: '#5d6d85', accent: '#1a4b8c' },
  dark: { bg: '#16273d', ink: '#f2f5f9', dim: '#93a1b3', accent: '#5b93d6' },
  warm: { bg: '#fbf7f1', ink: '#2b1d0e', dim: '#7a6853', accent: '#a9741f' },
};

@Component({
  selector: 'app-card-print',
  standalone: true,
  imports: [IconComponent],
  styleUrl: './card-print.component.scss',
  template: `
    @let t = colors();
    <div class="pr">
      <div
        class="pr-card"
        [style.--pr-bg]="t.bg"
        [style.--pr-ink]="t.ink"
        [style.--pr-dim]="t.dim"
        [style.--pr-accent]="t.accent"
      >
        <div class="pr-left">
          @if (logo(); as src) {
            <img class="pr-logo" [src]="src" alt="" loading="lazy" decoding="async" />
          }
          <p class="pr-title">{{ title() || i18n.t('cg.print.placeholder') }}</p>
          @if (sub(); as s) {
            <p class="pr-sub">{{ s }}</p>
          }
          <p class="pr-nfc">
            <app-icon name="nfc" [stroke]="2" />
            <span>{{ i18n.t('cg.print.tap') }}</span>
          </p>
        </div>

        <div class="pr-right">
          <img class="pr-qr" [src]="qr()" alt="" width="120" height="120" />
          <span class="pr-scan">{{ i18n.t('cg.print.scan') }}</span>
        </div>
      </div>

      <p class="pr-note">{{ i18n.t('cg.print.note') }}</p>
    </div>
  `,
})
export class CardPrintComponent {
  readonly i18n = inject(I18nService);

  readonly kind = input.required<CardKind>();
  readonly theme = input<CardTheme>('brand');
  /** Derselbe Inhalt, den auch die Bildschirmvorschau bekommt. */
  readonly data = input.required<Record<string, unknown>>();

  readonly colors = computed(() => THEMES[this.theme()] ?? THEMES.brand);

  private readonly text = (key: string): string => {
    const v = this.data()[key];
    return typeof v === 'string' ? v : '';
  };

  readonly title = computed(() => (this.kind() === 'business' ? this.text('company') : this.text('headline')));

  /** Zweite Zeile: die Kurzzeile bzw. „Für … · Von …". */
  readonly sub = computed(() =>
    this.kind() === 'business'
      ? this.text('tagline')
      : [this.text('to'), this.text('from')].filter(Boolean).join(' · '),
  );

  /** Das Logo kommt aufs Plastik, das Portrait nicht — dafür ist kein Platz. */
  readonly logo = computed(() => (this.kind() === 'business' ? this.text('logoUrl') : ''));

  /**
   * Der QR-Code zeigt auf die Website, nicht auf die Karte: deren Adresse
   * (/k/<name>) entsteht erst mit der Bestellung. Ein Code, der ins Leere
   * führt, wäre schlimmer als einer, der irgendwohin führt, wo man uns
   * findet — und der Hinweis darunter sagt es auch.
   */
  readonly qr = computed(() => {
    const code = qrcode(0, 'M');
    code.addData('https://breisgau-digital.de');
    code.make();
    const svg = code.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  });

  constructor() {
    this.i18n.register(CARD_PRINT_CONTENT);
  }
}
