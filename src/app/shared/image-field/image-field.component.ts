import { Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { IMAGE_FIELD_CONTENT } from './image-field.content';

/**
 * Ein Bildfeld: Datei aussuchen, hochladen, Vorschaubild, wieder entfernen.
 *
 * Vorher stand hier ein Eingabefeld für eine Adresse. Das setzt voraus, dass
 * das Logo schon irgendwo im Netz liegt und man weiß, wie man an seine
 * Adresse kommt — für einen Handwerksbetrieb, der eine Datei auf dem Rechner
 * hat, ist das keine Frage, die man ihm stellen sollte.
 *
 * Hochgeladen wird sofort, nicht erst beim Bestellen: die Vorschau daneben
 * soll das Bild zeigen, und dafür braucht sie eine Adresse. Wer danach nicht
 * bestellt, hinterlässt eine Datei, die der tägliche Lauf nach zwei Wochen
 * wieder wegräumt (UPLOAD_RETENTION_DAYS in src/server/api.ts).
 *
 * Die Prüfung von Art und Größe läuft auch hier, obwohl der Server sie
 * ohnehin macht: eine 40-MB-Datei erst hochzuladen, um dann „zu groß" zu
 * sagen, wäre am mobilen Netz eine Zumutung.
 */

/** Muss zu ALLOWED_TYPES in src/server/storage.ts passen — SVG fehlt dort bewusst. */
const TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif'];

/** Wie MAX_UPLOAD_BYTES im Server. */
const MAX_BYTES = 5 * 1024 * 1024;

@Component({
  selector: 'app-image-field',
  standalone: true,
  styleUrl: './image-field.component.scss',
  template: `
    <div class="if-field">
      <span class="if-label">{{ label() }}</span>

      @if (url()) {
        <div class="if-have">
          <img class="if-thumb" [src]="url()" [alt]="label()" loading="lazy" decoding="async" />
          <div class="if-actions">
            <button type="button" class="if-link" [disabled]="busy()" (click)="pick()">
              {{ i18n.t('cg.img.replace') }}
            </button>
            <button type="button" class="if-link" [disabled]="busy()" (click)="clear()">
              {{ i18n.t('cg.img.remove') }}
            </button>
          </div>
        </div>
      } @else {
        <button type="button" class="if-drop" [disabled]="busy()" (click)="pick()">
          {{ busy() ? i18n.t('cg.img.uploading') : i18n.t('cg.img.choose') }}
        </button>
      }

      @if (error(); as e) {
        <p class="if-error" role="alert">{{ i18n.t(e) }}</p>
      }

      <input
        #file
        type="file"
        class="if-input"
        [accept]="accept"
        (change)="chosen($event)"
        tabindex="-1"
        aria-hidden="true"
      />
    </div>
  `,
})
export class ImageFieldComponent {
  readonly i18n = inject(I18nService);

  readonly label = input.required<string>();
  readonly url = input<string>('');
  readonly urlChange = output<string>();

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);

  readonly accept = TYPES.join(',');

  private readonly file = viewChild.required<ElementRef<HTMLInputElement>>('file');

  constructor() {
    this.i18n.register(IMAGE_FIELD_CONTENT);
  }

  pick(): void {
    this.error.set(null);
    this.file().nativeElement.click();
  }

  clear(): void {
    this.error.set(null);
    this.urlChange.emit('');
  }

  async chosen(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Das Feld wird sofort geleert: wer dieselbe Datei erneut aussucht, soll
    // wieder ein `change` auslösen.
    input.value = '';
    if (!file) return;

    if (!TYPES.includes(file.type)) return this.error.set('cg.img.err.type');
    if (file.size > MAX_BYTES) return this.error.set('cg.img.err.size');

    this.error.set(null);
    this.busy.set(true);
    try {
      // Der Rohinhalt als Körper, die Art im Kopf — genau das, was
      // /api/card-image erwartet (express.raw). Kein FormData: dann müsste
      // der Server eine Mehrteil-Nachricht auseinandernehmen, und die
      // Dateiendung käme aus der Anfrage statt vom Server.
      const res = await fetch('/api/card-image', {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !body.url) {
        this.error.set(
          body.error === 'too_large' ? 'cg.img.err.size'
          : body.error === 'unsupported_type' ? 'cg.img.err.type'
          : res.status === 429 ? 'cg.img.err.often'
          : 'cg.img.err.failed',
        );
        return;
      }
      this.urlChange.emit(body.url);
    } catch {
      this.error.set('cg.img.err.failed');
    } finally {
      this.busy.set(false);
    }
  }
}
