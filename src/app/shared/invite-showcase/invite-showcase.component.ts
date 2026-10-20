import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { I18nService, Lang } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { INVITATION_PRICE_FROM } from '../../core/data/invitation.data';
import { INVITE_THEMES } from '../../einladung/invite-themes';
import { DEMO_TITLES } from '../../einladung/invite-demo-titles';
import { IconComponent } from '../icon/icon.component';
import { INVITE_SHOWCASE_CONTENT } from './invite-showcase.content';

/**
 * Startseite: die digitale Einladung zum Anfassen.
 *
 * Rechts ein Handy mit der echten Beispiel-Einladung im Rahmen (?embed=1,
 * ohne Vorschau-Leiste), links die Designs zum Umschalten. Der Rahmen lädt
 * erst, wenn der Abschnitt ins Bild kommt — bis dahin (und im vorgerenderten
 * HTML) steht ein gezeichnetes Titelbild in den Farben des Designs da.
 */
@Component({
  selector: 'app-invite-showcase',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './invite-showcase.component.html',
  styleUrl: './invite-showcase.component.scss',
})
export class InviteShowcaseComponent {
  readonly i18n = inject(I18nService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly priceFrom = INVITATION_PRICE_FROM;
  readonly themes = INVITE_THEMES.map((t) => ({ theme: t, title: DEMO_TITLES[t.id], slug: `demo-${t.id}` }));
  readonly selected = signal(0);
  readonly active = computed(() => this.themes[this.selected()]);

  /** Der Rahmen lädt erst, wenn der Abschnitt sichtbar ist. */
  readonly inView = signal(false);
  readonly frameReady = signal(false);

  readonly frameUrl = computed<SafeResourceUrl | null>(() => {
    if (!this.inView()) return null;
    const lang = this.i18n.lang() as Lang;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`/einladung/${this.active().slug}?embed=1&lang=${lang}`);
  });

  readonly fullUrl = computed(() => `/einladung/${this.active().slug}`);

  constructor() {
    this.i18n.register(INVITE_SHOWCASE_CONTENT);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        this.inView.set(true);
        return;
      }
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          this.inView.set(true);
          io.disconnect();
        },
        { rootMargin: '200px 0px' },
      );
      io.observe(this.host.nativeElement);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }

  pick(i: number): void {
    if (i === this.selected()) return;
    this.frameReady.set(false);
    this.selected.set(i);
  }

  themeName(i: number): string {
    return this.themes[i].theme.name[this.i18n.lang() as Lang];
  }
}
