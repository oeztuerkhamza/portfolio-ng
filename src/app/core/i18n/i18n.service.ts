import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TRANSLATIONS, Entry } from './translations';
import { PROJECT_CONTENT, ProjectTx } from './project-content';
import { EXPERIENCE_CONTENT, ExperienceTx } from './experience-content';
import { formatAmount } from '../data/company.data';

export type Lang = 'de' | 'fr' | 'en' | 'tr' | 'ku';

export interface LangOption {
  code: Lang;
  label: string;
  native: string;
}

export const LANGS: LangOption[] = [
  { code: 'de', label: 'DE', native: 'Deutsch' },
  { code: 'fr', label: 'FR', native: 'Français' },
  { code: 'en', label: 'EN', native: 'English' },
  { code: 'tr', label: 'TR', native: 'Türkçe' },
  { code: 'ku', label: 'KU', native: 'Kurdî' },
];

export const DEFAULT_LANG: Lang = 'de';
export const LANG_CODES = LANGS.map((l) => l.code);

/**
 * URL-driven i18n. The active language is the first path segment
 * (`/de/...`, `/fr/...`). Because the locale lives in the URL, each language
 * is a distinct, server-rendered/prerendered page — fully crawlable per locale.
 *
 * On the server a fresh instance is created per request, so reading the URL at
 * construction renders the correct language. In the browser we also follow
 * router navigations so the `lang` signal stays in sync.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly lang = signal<Lang>(this.readLangFromUrl());
  readonly options = LANGS;

  /** Seitentexte, die mit dem Lazy-Chunk ihrer Seite kommen (siehe register). */
  private readonly pageTexts = new Map<string, Entry>();

  constructor() {
    if (this.isBrowser) {
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => this.lang.set(this.readLangFromUrl()));
    }
  }

  private readLangFromUrl(): Lang {
    try {
      const path = this.isBrowser
        ? this.router.url
        : new URL(this.doc.location.href).pathname;
      const seg = path.split('/').filter(Boolean)[0];
      if (this.isLang(seg)) return seg;
    } catch {
      /* fall through */
    }
    return DEFAULT_LANG;
  }

  private isLang(v: string | null | undefined): v is Lang {
    return !!v && LANG_CODES.includes(v as Lang);
  }

  /** Switch language: navigate to the same page under the new locale prefix. */
  setLang(lang: Lang): void {
    const url = this.isBrowser ? this.router.url : '/';
    const [, , ...rest] = url.split('/'); // ['', '<locale>', ...rest]
    const target = '/' + [lang, ...rest].join('/');
    this.router.navigateByUrl(target.split('?')[0]);
  }

  /** Prefix an absolute app path with the active locale. */
  localizePath(path: string): string {
    const lang = this.lang();
    if (path === '/' || path === '') return `/${lang}`;
    return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /**
   * Make a page's own text table available to `t()`. Pages call this in
   * their constructor, so long texts ship with the page's lazy chunk instead
   * of the initial bundle. Registering the same table twice is harmless.
   */
  register(table: Record<string, Entry>): void {
    for (const [key, entry] of Object.entries(table)) this.pageTexts.set(key, entry);
  }

  /** Translate a key. Falls back to German, then the key itself. */
  t(key: string): string {
    const l = this.lang();
    const entry = TRANSLATIONS[key] ?? this.pageTexts.get(key);
    return entry?.[l] ?? entry?.de ?? key;
  }

  /**
   * Translate a key whose text carries a `{p}` price placeholder, formatted
   * for the active language: `tp('price.from', 1290)` → „ab 1.290 €".
   */
  tp(key: string, amount: number): string {
    return this.t(key).replace('{p}', formatAmount(amount, this.lang()));
  }

  /**
   * Localized project field with German fallback. German lives in
   * project.data.ts (`fallback`); other locales come from PROJECT_CONTENT.
   *
   *   i18n.ptx(p.slug, 'subtitle', p.subtitle)
   *   i18n.ptx(p.slug, 'long', p.longDescription)
   *   i18n.ptx(p.slug, 'features', p.features)
   */
  ptx<T>(slug: string, field: keyof ProjectTx, fallback: T): T {
    const l = this.lang();
    if (l === 'de') return fallback;
    return (PROJECT_CONTENT[slug]?.[l]?.[field] as T) ?? fallback;
  }

  /** Localized experience-entry field with German fallback. */
  etx<T>(id: number, field: keyof ExperienceTx, fallback: T): T {
    const l = this.lang();
    if (l === 'de') return fallback;
    return (EXPERIENCE_CONTENT[id]?.[l]?.[field] as T) ?? fallback;
  }
}
