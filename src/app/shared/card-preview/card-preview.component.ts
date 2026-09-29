import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { I18nService } from '../../core/i18n/i18n.service';
import { type CardKind, type CardTheme, payloadReady } from '../../core/cards/card-draft.model';
import { CARD_PREVIEW_CONTENT } from './card-preview.content';

/**
 * Lebende Vorschau einer NFC-Karte.
 *
 * Gezeichnet wird die Karte nicht hier, sondern auf dem Server: der Entwurf
 * geht an /api/card-preview, und zurück kommt dieselbe Seite, die später unter
 * /k/<name> steht. Eine im Browser nachgebaute Vorschau wäre flüssiger, würde
 * aber mit jeder Änderung an der echten Karte ein Stück weiter danebenliegen —
 * und eine Vorschau, der man nicht trauen kann, ist schlimmer als keine.
 *
 * Der Rahmen ist vollständig abgeschottet (`sandbox` ohne Werte): kein
 * JavaScript, keine Formulare, keine Navigation. Der Kontaktbogen und der
 * „Zu Kontakten hinzufügen"-Knopf sind darum nur zu sehen, nicht zu benutzen —
 * was richtig ist, denn die Karte gibt es noch nicht.
 */
type State = 'empty' | 'loading' | 'ready' | 'error';

/** So lange nach dem letzten Tastendruck wird gewartet, bevor es losgeht. */
const DEBOUNCE_MS = 400;

@Component({
  selector: 'app-card-preview',
  standalone: true,
  styleUrl: './card-preview.component.scss',
  template: `
    <div class="cp">
      <div class="cp-phone" [class.cp-busy]="state() === 'loading'">
        @if (html(); as doc) {
          <iframe
            class="cp-frame"
            [srcdoc]="doc"
            sandbox
            loading="lazy"
            referrerpolicy="no-referrer"
            [title]="i18n.t('cg.preview.title')"
          ></iframe>
        } @else {
          <p class="cp-hint">
            {{ state() === 'error' ? i18n.t('cg.preview.error') : i18n.t('cg.preview.' + kind() + '.empty') }}
          </p>
        }
      </div>

      <p class="cp-note" role="status">
        @switch (state()) {
          @case ('loading') { {{ i18n.t('cg.preview.loading') }} }
          @case ('error') { {{ i18n.t('cg.preview.error') }} }
          @case ('ready') { {{ i18n.t('cg.preview.note') }} }
          @default { {{ i18n.t('cg.preview.' + kind() + '.empty') }} }
        }
      </p>
    </div>
  `,
})
export class CardPreviewComponent {
  readonly i18n = inject(I18nService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly kind = input.required<CardKind>();
  readonly theme = input<CardTheme>('brand');
  /** Der Inhalt, wie ihn der Server als `data` erwartet (siehe cardPayload). */
  readonly data = input.required<Record<string, unknown>>();

  readonly state = signal<State>('empty');
  readonly html = signal<SafeHtml | null>(null);

  /**
   * Die ganze Anfrage als Text. Wechselt sie nicht, ist auch nichts neu zu
   * zeichnen — beim Tippen in einem Feld, das die Karte gar nicht kennt,
   * bleibt sie gleich und es geht keine Anfrage raus.
   */
  private readonly request = computed(() =>
    JSON.stringify({ kind: this.kind(), theme: this.theme(), lang: this.i18n.lang(), data: this.data() }),
  );

  /**
   * Eigene Rechnung statt eines Blicks in `data()` im Effekt: sonst hinge der
   * Effekt an der Eingabe selbst und liefe bei jedem neuen Objekt los, auch
   * wenn daraus dieselbe Anfrage würde.
   */
  private readonly ready = computed(() => payloadReady(this.kind(), this.data()));

  private timer: ReturnType<typeof setTimeout> | null = null;
  private inFlight: AbortController | null = null;

  constructor() {
    this.i18n.register(CARD_PREVIEW_CONTENT);

    const destroy = inject(DestroyRef);
    destroy.onDestroy(() => this.stop());

    effect(() => {
      const body = this.request();
      const ready = this.ready();
      // Beim Vorrendern gibt es niemanden, der zusieht, und keinen Entwurf:
      // die Vorschau beginnt im Browser.
      if (!this.browser) return;

      this.stop();
      if (!ready) {
        this.html.set(null);
        this.state.set('empty');
        return;
      }

      this.state.set('loading');
      this.timer = setTimeout(() => this.load(body), DEBOUNCE_MS);
    });
  }

  private async load(body: string): Promise<void> {
    const ctrl = new AbortController();
    this.inFlight = ctrl;
    try {
      const res = await fetch('/api/card-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: ctrl.signal,
      });
      // Überholt: der Entwurf hat sich weitergedreht, während diese Antwort
      // unterwegs war. `abort` allein genügt nicht — eine Anfrage, die schon
      // beantwortet ist, lässt sich nicht mehr zurückholen, und dann stünde
      // am Ende die ältere Karte im Rahmen.
      if (this.inFlight !== ctrl) return;

      // 422 heißt „noch nicht genug" — das ist kein Fehler, sondern der
      // Zustand, in dem jeder Entwurf anfängt.
      if (res.status === 422) {
        this.html.set(null);
        this.state.set('empty');
        return;
      }
      const payload = (await res.json()) as { html?: string };
      if (this.inFlight !== ctrl) return;
      if (!res.ok || !payload.html) throw new Error('preview');
      // Der Text kommt aus unserem eigenen `renderCard`; alles, was der Kunde
      // eingegeben hat, ist dort durch `esc` gelaufen. Angulars Reinigung würde
      // <head> und <style> entfernen und damit gerade das wegwerfen, was die
      // Karte ausmacht. Sicher ist das, weil der Rahmen abgeschottet ist: ohne
      // `allow-scripts` führt der Browser darin kein JavaScript aus.
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(payload.html));
      this.state.set('ready');
    } catch (err) {
      if ((err as Error)?.name === 'AbortError' || this.inFlight !== ctrl) return;
      this.state.set('error');
    } finally {
      if (this.inFlight === ctrl) this.inFlight = null;
    }
  }

  /** Wartende und laufende Anfrage abbrechen — die Antwort ist überholt. */
  private stop(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    this.inFlight?.abort();
    this.inFlight = null;
  }
}
