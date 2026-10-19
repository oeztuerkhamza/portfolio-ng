import { Directive, ElementRef, OnDestroy, PLATFORM_ID, afterNextRender, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Blendet ein Element ein, sobald es ins Bild scrollt.
 *
 * Versteckt wird nur, solange die Seite `.iv-js` trägt (setzt die Einladung
 * im Browser). Ohne Skript — oder im vorgerenderten HTML — ist alles sichtbar.
 * `prefers-reduced-motion` schaltet die Bewegung im CSS ab.
 */
@Directive({
  selector: '[ivReveal]',
  standalone: true,
  host: { class: 'ivr', '[style.--ivr-delay]': 'delay() + "ms"' },
})
export class RevealDirective implements OnDestroy {
  readonly delay = input(0, { alias: 'ivReveal', transform: (v: unknown) => Number(v) || 0 });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    afterNextRender(() => {
      const node = this.el.nativeElement;
      if (!('IntersectionObserver' in window)) {
        node.classList.add('ivr-in');
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            node.classList.add('ivr-in');
            this.observer?.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
