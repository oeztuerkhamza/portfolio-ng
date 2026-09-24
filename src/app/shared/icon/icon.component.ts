import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Strich-Icons (24 × 24, currentColor). Die Pfade sind statische Konstanten
 * aus diesem File — deshalb ist bypassSecurityTrustHtml hier unbedenklich.
 */
const ICONS: Record<string, string> = {
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  phone: '<path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/>',
  chat: '<path d="M20 11.5a8 8 0 0 1-11.7 7.1L4 20l1.4-4.1A8 8 0 1 1 20 11.5z"/><path d="M9 10h6M9 13.5h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
  nfc: '<path d="M7 8.5a5 5 0 0 1 0 7"/><path d="M10.5 6a9 9 0 0 1 0 12"/><path d="M14 3.5a13 13 0 0 1 0 17"/>',
  star: '<path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.2 6.1L12 17l-5.5 2.9 1.2-6.1-4.5-4.2 6.1-.8z"/>',
  euro: '<path d="M17.5 6.5A7 7 0 1 0 17.5 17.5"/><path d="M4 10.5h9M4 13.5h9"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z"/><circle cx="12" cy="10" r="2.3"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6L12 3z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
  flame: '<path d="M12 21a6 6 0 0 0 6-6c0-3.5-2.5-5.5-3.5-8-1.2 1.6-2 2.4-3.3 2.9C11.8 7.5 11 5 9 3c.3 3-3 5.8-3 10a6 6 0 0 0 6 8z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5M14 9l2 2"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.1 1.3 1.1 2.2h5c0-.9.3-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
  bolt: '<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6l1-8z"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  cup: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3.5c0 1.2 1 1.3 1 2.5M12 3.5c0 1.2 1 1.3 1 2.5"/>',
  hammer: '<path d="M14 6.5l3.5 3.5"/><path d="M11.5 4l6 6-2 2-6-6z"/><path d="M11 9.5L4 16.5a1.8 1.8 0 0 0 2.5 2.5l7-7"/>',
  bag: '<path d="M5 8h14l-1.2 12H6.2L5 8z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
  scissors: '<circle cx="6.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><path d="M8.6 8L20 18M8.6 16L20 6"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12.5h18"/>',
  bed: '<path d="M3 18V6M3 14h18v4M21 14v-2.5a3 3 0 0 0-3-3h-7V14"/><circle cx="7" cy="11" r="1.8"/>',
  store: '<path d="M4 9l1.3-4.5h13.4L20 9"/><path d="M4 9h16v1.3a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0z"/><path d="M5.5 13v7h13v-7M10 20v-4h4v4"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  // Das komplette <svg> wird als HTML in das Host-Element geschrieben:
  // innerHTML direkt auf einem SVG-Element kann der Server-Renderer (Domino)
  // nicht, auf einem HTML-Element schon.
  host: { class: 'app-icon', 'aria-hidden': 'true', '[innerHTML]': 'markup()' },
  template: '',
  styles: [
    `:host { display: inline-flex; width: 1.25em; height: 1.25em; flex: none; }
     :host ::ng-deep svg { width: 100%; height: 100%; display: block; }`,
  ],
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input.required<string>();
  readonly stroke = input(1.7);
  readonly markup = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${this.stroke()}" ` +
        `stroke-linecap="round" stroke-linejoin="round" focusable="false">${ICONS[this.name()] ?? ''}</svg>`,
    ),
  );
}
