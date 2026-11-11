import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

export const GA_MEASUREMENT_ID = 'G-D3L87X0FW1';

const STORAGE_KEY = 'bd-analytics-consent';

type Choice = 'granted' | 'denied';

/**
 * Google Analytics 4 — erst nach ausdrücklicher Einwilligung.
 * Vorher wird weder gtag.js geladen noch ein Cookie gesetzt. Die Wahl liegt in
 * localStorage; "Ablehnen" und "Widerrufen" entfernen auch die GA-Cookies.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Banner sichtbar, solange noch keine Wahl getroffen wurde (oder neu geöffnet). */
  readonly bannerOpen = signal(false);
  private loaded = false;

  init(): void {
    if (!this.browser) return;
    const choice = this.read();
    if (choice === 'granted') this.load();
    else if (choice === null) this.bannerOpen.set(true);

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      // Kurz warten: der Seitentitel wird erst nach NavigationEnd gesetzt.
      const url = (e as NavigationEnd).urlAfterRedirects;
      if (this.loaded) setTimeout(() => this.pageView(url), 300);
    });
  }

  accept(): void {
    this.write('granted');
    this.bannerOpen.set(false);
    (this.doc.defaultView as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] =
      false;
    this.load();
  }

  decline(): void {
    this.write('denied');
    this.bannerOpen.set(false);
    // Bereits geladenes gtag.js bis zum nächsten Seitenaufruf stummschalten.
    (this.doc.defaultView as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] =
      true;
    this.clearCookies();
    this.loaded = false;
  }

  reopen(): void {
    this.bannerOpen.set(true);
  }

  private load(): void {
    if (this.loaded) return;
    this.loaded = true;
    const w = this.doc.defaultView as unknown as {
      dataLayer?: unknown[];
      gtag?: (...a: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      // gtag.js erwartet das Objekt `arguments`, kein Array.
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag('js', new Date());
    w.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
    const s = this.doc.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    this.doc.head.appendChild(s);
    this.pageView(this.router.url);
  }

  private pageView(url: string): void {
    // Admin-Portal und persönliche Einladungslinks nicht messen.
    if (/^\/(admin|einladung\/)/.test(url)) return;
    const w = this.doc.defaultView as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.('event', 'page_view', {
      page_path: url,
      page_location: this.doc.location.origin + url,
      page_title: this.doc.title,
    });
  }

  private clearCookies(): void {
    const host = this.doc.location.hostname;
    const domains = [host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    for (const part of this.doc.cookie.split(';')) {
      const name = part.split('=')[0].trim();
      if (!name.startsWith('_ga')) continue;
      for (const d of domains) {
        this.doc.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
      }
    }
  }

  private read(): Choice | null {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'granted' || v === 'denied' ? v : null;
    } catch {
      return null;
    }
  }

  private write(v: Choice): void {
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* Speicher gesperrt: Wahl gilt nur für diese Sitzung. */
    }
  }
}
