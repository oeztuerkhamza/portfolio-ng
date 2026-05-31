import {
  Component,
  inject,
  signal,
  computed,
  HostListener,
  ElementRef,
} from '@angular/core';
import { I18nService, Lang } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [],
  template: `
    <div class="lang">
      <button
        type="button"
        class="lang-trigger"
        (click)="toggle()"
        [attr.aria-expanded]="open()"
        aria-label="Sprache wählen"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
        </svg>
        <span class="lang-current">{{ current().label }}</span>
        <span class="lang-caret" [class.up]="open()" aria-hidden="true">▾</span>
      </button>

      @if (open()) {
        <ul class="lang-menu" role="listbox">
          @for (opt of i18n.options; track opt.code) {
            <li>
              <button
                type="button"
                role="option"
                [class.active]="opt.code === i18n.lang()"
                [attr.aria-selected]="opt.code === i18n.lang()"
                (click)="select(opt.code)"
              >
                <span class="opt-code">{{ opt.label }}</span>
                <span class="opt-native">{{ opt.native }}</span>
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styleUrl: './lang-switcher.component.scss',
})
export class LangSwitcherComponent {
  readonly i18n = inject(I18nService);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly open = signal(false);

  readonly current = computed(
    () =>
      this.i18n.options.find((o) => o.code === this.i18n.lang()) ??
      this.i18n.options[0],
  );

  toggle() {
    this.open.update((v) => !v);
  }

  select(code: Lang) {
    this.i18n.setLang(code);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    if (!this.host.nativeElement.contains(e.target)) this.open.set(false);
  }
}
