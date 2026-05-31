import {
  Component,
  Input,
  signal,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProjectDemo } from '../../core/data/project.data';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * "Browser/phone frame" live-demo viewer.
 *
 * - iframe: shows a poster + "Demo starten"; the external site is only loaded
 *   after an explicit click (keeps the page fast and sidesteps eager loading of
 *   sites that block framing). An "open in new tab" escape hatch always exists,
 *   so an X-Frame-Options block degrades gracefully to the poster + link.
 * - image / mobile: screenshot gallery inside browser- or phone-chrome.
 * - video: autoplaying, muted, looped screencast.
 */
@Component({
  selector: 'app-live-demo',
  standalone: true,
  imports: [NgClass],
  templateUrl: './live-demo.component.html',
  styleUrl: './live-demo.component.scss',
})
export class LiveDemoComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly i18n = inject(I18nService);

  @Input({ required: true }) demo!: ProjectDemo;
  @Input() title = '';

  readonly loaded = signal(false);
  /** True once the iframe fires its load event (preview likely rendered). */
  readonly frameLoaded = signal(false);
  readonly activeScreen = signal(0);

  onFrameLoad(): void {
    this.frameLoaded.set(true);
  }

  get displayUrl(): string {
    if (!this.demo.url) return 'localhost:4200';
    return this.demo.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  readonly safeUrl = computed<SafeResourceUrl | null>(() => {
    if (!this.loaded() || !this.demo.url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.demo.url);
  });

  readonly screens = computed(() => this.demo.screens ?? []);

  startDemo(): void {
    if (this.isBrowser) this.loaded.set(true);
  }

  prev(): void {
    const n = this.screens().length;
    if (n) this.activeScreen.update((i) => (i - 1 + n) % n);
  }

  next(): void {
    const n = this.screens().length;
    if (n) this.activeScreen.update((i) => (i + 1) % n);
  }

  go(i: number): void {
    this.activeScreen.set(i);
  }
}
