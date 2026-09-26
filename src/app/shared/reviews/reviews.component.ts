import { Component, ElementRef, computed, inject, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import reviewData from '../../core/data/reviews.json';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { REVIEWS_CONTENT } from './reviews.content';

/** Der Stand, den scripts/fetch-reviews.mjs zur Bauzeit hinterlässt. */
export interface ReviewData {
  rating: number | null;
  total: number | null;
  placeId: string;
  items: { author: string; rating: number; text: string; date: string | null; label: string | null }[];
}

/**
 * Google-Bewertungen auf der Website.
 *
 * Die Texte stecken zur Bauzeit in reviews.json (scripts/fetch-reviews.mjs
 * holt sie aus unserer Datenbank, der Tageslauf füllt die von Google). Damit:
 *
 *   * stehen sie im ausgelieferten HTML — Suchmaschinen sehen sie, und es
 *     wird nichts nachgeladen,
 *   * stellt der Besucher keine Anfrage an Google. Kein Skript, kein Bild von
 *     googleusercontent.com, keine IP-Adresse dorthin — und darum auch kein
 *     Einwilligungsbanner für diesen Abschnitt.
 *
 * Statt der Profilbilder stehen die Anfangsbuchstaben in einem Kreis. Das ist
 * nicht Geschmack, sondern derselbe Grund: ein Bild von Google wäre eine
 * Anfrage des Besuchers an Google.
 *
 * **Kein Review-Schema.** Bewertungen, die von einer fremden Plattform
 * stammen, dürfen nicht als eigenes AggregateRating ausgezeichnet werden —
 * Google nennt das self-serving markup und ahndet es. Darum steht hier
 * bewusst kein JSON-LD.
 *
 * Gedreht wird mit CSS-Schnappscrollen und zwei Knöpfen, die scrollen — nicht
 * mit einem Zeitgeber. Ohne JavaScript sind alle Bewertungen da und mit
 * Wischen oder Pfeiltasten erreichbar; es bewegt sich nichts von selbst. Ein
 * Karussell, das von allein weiterläuft, ist für niemanden gut, der langsam
 * liest, und für Vorleseprogramme ohnehin nicht.
 */
@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  styleUrl: './reviews.component.scss',
  template: `
    @if (items().length) {
      <section class="section rv">
        <div class="container">
          <header class="sec-head">
            <p class="section-label">{{ i18n.t('rv.label') }}</p>
            <h2 class="section-title" [innerHTML]="i18n.t('rv.title')"></h2>
            @if (rating()) {
              <p class="rv-score">
                <span class="rv-stars" [attr.aria-hidden]="true">{{ stars(rating()!) }}</span>
                <strong>{{ rating()!.toFixed(1).replace('.', ',') }}</strong>
                <span class="rv-of">{{ i18n.t('rv.of5') }}</span>
                @if (total()) {
                  <span class="rv-count">{{ i18n.tp('rv.count', total()!) }}</span>
                }
              </p>
            }
          </header>

          @if (items().length > 1) {
            <div class="rv-nav">
              <button type="button" class="rv-arrow" [attr.aria-label]="i18n.t('rv.prev')" (click)="turn(-1)">‹</button>
              <button type="button" class="rv-arrow" [attr.aria-label]="i18n.t('rv.next')" (click)="turn(1)">›</button>
            </div>
          }

          <!-- Schnappscrollen: ohne JavaScript alle Bewertungen erreichbar -->
          <ul class="rv-track" #track tabindex="0" [attr.aria-label]="i18n.t('rv.label')">
            @for (r of items(); track $index) {
              <li class="card rv-card">
                <p class="rv-head">
                  <span class="rv-initials" aria-hidden="true">{{ initials(r.author) }}</span>
                  <span class="rv-who">
                    <strong>{{ r.author }}</strong>
                    <span class="rv-when">{{ r.label || r.date }}</span>
                  </span>
                </p>
                <p class="rv-rating">
                  <span aria-hidden="true">{{ stars(r.rating) }}</span>
                  <span class="visually-hidden">{{ i18n.tp('rv.stars', r.rating) }}</span>
                </p>
                <blockquote class="rv-text">{{ r.text }}</blockquote>
              </li>
            }
          </ul>

          <div class="rv-foot">
            <p class="rv-source">
              {{ i18n.t('rv.source') }}
              @if (profile(); as url) {
                <a [href]="url" target="_blank" rel="noopener nofollow">{{ i18n.t('rv.open') }}</a>
              }
            </p>
            <a [routerLink]="'/bewertungskarten' | localize" class="rv-more">{{ i18n.t('rv.own') }}</a>
          </div>
        </div>
      </section>
    }
  `,
})
export class ReviewsComponent {
  readonly i18n = inject(I18nService);
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  /**
   * Standardmäßig der Stand aus der Bauzeit. Als Eingabe, damit der Abschnitt
   * auch mit einer Auswahl aufgerufen werden kann — und damit die Tests ihn
   * mit Daten sehen, ohne die Datei zu fälschen.
   */
  readonly source = input<ReviewData>(reviewData as ReviewData);

  /** Nur Bewertungen mit Text — eine leere Karte sagt nichts. */
  readonly items = computed(() => this.source().items.filter((r) => r.text.trim().length > 0));
  readonly rating = computed(() => this.source().rating);
  readonly total = computed(() => this.source().total);

  /**
   * Das eigene Google-Profil, aus der Place ID gebaut. Ohne Place ID gibt es
   * keinen Verweis — lieber keinen als einen, der irgendwo hinführt.
   */
  readonly profile = computed(() => {
    const id = this.source().placeId?.trim();
    return id ? `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(id)}` : null;
  });

  constructor() {
    this.i18n.register(REVIEWS_CONTENT);
  }

  /** Sterne als Zeichen — für Vorleseprogramme steht der Text daneben. */
  stars(n: number): string {
    const full = Math.max(0, Math.min(5, Math.round(n)));
    return '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
  }

  /**
   * Eine Karte weiter blättern. Gescrollt wird, nicht umgebaut: wer die Liste
   * schon von Hand verschoben hat, verliert seine Stelle nicht, und ohne
   * JavaScript bleibt die Liste trotzdem scrollbar.
   */
  turn(dir: -1 | 1): void {
    const el = this.track()?.nativeElement;
    if (!el) return;
    const card = el.querySelector('li');
    // Kartenbreite plus Abstand; ohne Karte die halbe Sichtbreite.
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth / 2;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  /**
   * Anfangsbuchstaben statt Profilbild. Ein Bild von googleusercontent.com
   * wäre eine Anfrage des Besuchers an Google — genau das, was dieser
   * Abschnitt vermeidet.
   */
  initials(author: string): string {
    return (
      author
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => [...w][0]?.toUpperCase() ?? '')
        .join('') || '·'
    );
  }
}
