import { Directive, ElementRef, NgZone, OnDestroy, PLATFORM_ID, afterNextRender, inject, input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Bewegung, die dem Scrollen folgt.
 *
 * Das Element bekommt `--p` (0 … 1): wie weit es durch den sichtbaren
 * Bereich gewandert ist. Was daraus wird — wachsender Bogen, Namen, die
 * auseinandergehen, Wörter, die aufleuchten, eine Linie, die sich füllt —
 * steht im CSS (invitation-scroll.scss). So bleibt die Seite ohne Skript und
 * beim Vorrendern vollständig; dort gilt der Ersatzwert in `var(--p, …)`.
 *
 * Alle Elemente teilen eine Schleife: ein requestAnimationFrame, nur während
 * sich etwas bewegt, außerhalb der Angular-Zone. Werte werden weich
 * nachgezogen, damit es auch bei ruckigem Scrollen gleitet.
 *
 *   leave   — 0 in Ruhe, 1 wenn das Element (fast) aus dem Bild ist (Kopf)
 *   enter   — 0 wenn es unten auftaucht, 1 wenn es im oberen Drittel ist
 *   through — 0 unten herein, 1 oben hinaus (Parallaxe)
 *   line    — die Bildmitte wandert durch das Element (Ablauf)
 *   page    — Fortschritt der ganzen Seite
 *   pin     — Fortschritt durch ein hohes Element mit angeheftetem Inhalt:
 *             0 wenn es oben anstößt, 1 wenn sein Ende unten ankommt
 *             (Startseite: Referenzen, die seitwärts laufen)
 *
 * Bei „Bewegung reduzieren" läuft nur `page`; alles andere bleibt in Ruhe.
 */
export type ScrollFxMode = 'leave' | 'enter' | 'through' | 'line' | 'page' | 'pin';

interface Entry {
  el: HTMLElement;
  mode: ScrollFxMode;
  cur: number;
  target: number;
}

const entries = new Set<Entry>();
let frame = 0;
let listening = false;

function measure(e: Entry, vh: number): number {
  if (e.mode === 'page') {
    const max = document.documentElement.scrollHeight - vh;
    return max > 0 ? window.scrollY / max : 0;
  }
  const r = e.el.getBoundingClientRect();
  switch (e.mode) {
    case 'leave':
      return -r.top / Math.max(1, r.height * 0.85);
    case 'enter':
      return (vh * 0.95 - r.top) / (vh * 0.6);
    case 'through':
      return (vh - r.top) / (vh + r.height);
    case 'line':
      return (vh * 0.6 - r.top) / Math.max(1, r.height);
    case 'pin':
      return -r.top / Math.max(1, r.height - vh);
  }
}

const clamp = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function tick(): void {
  frame = 0;
  const vh = window.innerHeight;
  let moving = false;
  for (const e of entries) {
    e.target = clamp(measure(e, vh));
    const d = e.target - e.cur;
    // Weich nachziehen; die Seitenleiste folgt direkt.
    e.cur = Math.abs(d) < 0.0008 || e.mode === 'page' ? e.target : e.cur + d * 0.16;
    if (e.cur !== e.target) moving = true;
    e.el.style.setProperty('--p', e.cur.toFixed(4));
  }
  if (moving) schedule();
}

function schedule(): void {
  if (!frame) frame = requestAnimationFrame(tick);
}

function listen(zone: NgZone): void {
  if (listening) return;
  listening = true;
  zone.runOutsideAngular(() => {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  });
}

@Directive({
  selector: '[ivScroll]',
  standalone: true,
})
export class ScrollFxDirective implements OnDestroy {
  readonly mode = input<ScrollFxMode>('through', { alias: 'ivScroll' });
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private entry?: Entry;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const zone = inject(NgZone);
    afterNextRender(() => {
      const mode = this.mode();
      if (mode !== 'page' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const entry: Entry = { el: this.el.nativeElement, mode, cur: 0, target: 0 };
      entry.cur = clamp(measure(entry, window.innerHeight));
      entry.el.style.setProperty('--p', entry.cur.toFixed(4));
      this.entry = entry;
      entries.add(entry);
      listen(zone);
      schedule();
    });
  }

  ngOnDestroy(): void {
    if (this.entry) entries.delete(this.entry);
  }
}

/**
 * Leichtes Nachgeben zum Mauszeiger (nur mit Maus): setzt `--mx`/`--my`
 * (−1 … 1) auf dem Element. Der Bogen kippt, die Zweige weichen aus.
 */
@Directive({
  selector: '[ivPointer]',
  standalone: true,
})
export class PointerFxDirective {
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const zone = inject(NgZone);
    afterNextRender(() => {
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let raf = 0;
      let x = 0;
      let y = 0;
      const apply = () => {
        raf = 0;
        el.style.setProperty('--mx', x.toFixed(3));
        el.style.setProperty('--my', y.toFixed(3));
      };
      zone.runOutsideAngular(() => {
        el.addEventListener('pointermove', (ev: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x = ((ev.clientX - r.left) / r.width) * 2 - 1;
          y = ((ev.clientY - r.top) / r.height) * 2 - 1;
          if (!raf) raf = requestAnimationFrame(apply);
        });
        el.addEventListener('pointerleave', () => {
          x = 0;
          y = 0;
          if (!raf) raf = requestAnimationFrame(apply);
        });
      });
    });
  }
}
