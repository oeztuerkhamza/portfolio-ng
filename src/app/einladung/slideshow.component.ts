import { Component, DestroyRef, ViewEncapsulation, ElementRef, HostListener, afterNextRender, inject, input, output, signal } from '@angular/core';
import { IconComponent } from '../shared/icon/icon.component';

/**
 * Diashow für Beamer und Fernseher: Vollbild, Überblendung alle sechs
 * Sekunden, Pfeiltasten zum Blättern, Esc zum Schließen. Neue Fotos der Gäste
 * laufen mit, sobald sie in der Liste stehen.
 */
@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="iv-show" role="dialog" aria-modal="true" [attr.aria-label]="label()">
      @for (src of slides(); track src; let i = $index) {
        <img [src]="src" alt="" [class.on]="i === index()" loading="lazy" />
      }
      @if (!slides().length) {
        <p class="iv-show-empty">{{ empty() }}</p>
      }
      <div class="iv-show-bar">
        <span class="iv-show-title">{{ label() }}</span>
        <span>{{ slides().length ? index() + 1 : 0 }} / {{ slides().length }}</span>
        <button type="button" (click)="prev()" aria-label="‹"><app-icon name="chevron" class="iv-rot90" /></button>
        <button type="button" (click)="next()" aria-label="›"><app-icon name="chevron" class="iv-rot-90" /></button>
        <button type="button" (click)="close.emit()" [attr.aria-label]="closeLabel()"><app-icon name="close" /></button>
      </div>
    </div>
  `,
  styles: `
    .iv-show { position: fixed; inset: 0; z-index: 200; background: #000; color: #fff; display: grid; place-items: center; }
    .iv-show img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 1.2s ease; }
    .iv-show img.on { opacity: 1; }
    .iv-show-empty { font-size: 1.25rem; opacity: .8; padding: 2rem; text-align: center; }
    .iv-show-bar { position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%); display: flex; align-items: center; gap: 10px;
      background: rgba(0,0,0,.55); padding: 8px 10px 8px 18px; border-radius: 999px; font: 500 .9rem/1 system-ui, sans-serif; backdrop-filter: blur(6px); }
    .iv-show-title { opacity: .8; max-width: 40vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .iv-show-bar button { width: 40px; height: 40px; border-radius: 50%; border: 0; background: rgba(255,255,255,.12); color: #fff; display: grid; place-items: center; cursor: pointer; }
    .iv-show-bar button:hover { background: rgba(255,255,255,.25); }
    .iv-rot90 { transform: rotate(90deg); }
    .iv-rot-90 { transform: rotate(-90deg); }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class SlideshowComponent {
  readonly slides = input.required<string[]>();
  readonly label = input('');
  readonly empty = input('');
  readonly closeLabel = input('Close');
  readonly close = output<void>();
  readonly index = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const timer = setInterval(() => this.next(), 6000);
      destroyRef.onDestroy(() => {
        clearInterval(timer);
        if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
      });
      this.host.nativeElement.querySelector<HTMLElement>('.iv-show')?.requestFullscreen?.().catch(() => undefined);
    });
  }

  next(): void {
    const n = this.slides().length;
    if (n) this.index.set((this.index() + 1) % n);
  }

  prev(): void {
    const n = this.slides().length;
    if (n) this.index.set((this.index() - 1 + n) % n);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.close.emit();
    else if (e.key === 'ArrowRight') this.next();
    else if (e.key === 'ArrowLeft') this.prev();
  }
}
