import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { I18nService, Lang, LANGS } from '../i18n/i18n.service';

export interface SeoConfig {
  title: string;
  description: string;
  /** Locale-agnostic path, e.g. "/projects/benlirad" or "/". SeoService adds the locale prefix. */
  path?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Locale-aware, SSR-safe SEO writer.
 *
 * Canonical URLs carry the locale prefix (/de, /fr, …) and every page emits a
 * full set of hreflang alternates, so each language is its own crawlable,
 * rankable URL. All tags are written through Angular's Title/Meta + DOCUMENT,
 * so they appear in the server-rendered/prerendered HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly i18n = inject(I18nService);

  static readonly ORIGIN = 'https://hamzaoeztuerk.de';
  static readonly DEFAULT_IMAGE = `${SeoService.ORIGIN}/assets/images/og-cover.png`;
  static readonly SITE_NAME = 'Hamza Öztürk — Webentwickler Freiburg';

  update(config: SeoConfig): void {
    const {
      title,
      description,
      path = '/',
      image = SeoService.DEFAULT_IMAGE,
      type = 'website',
      keywords,
      noIndex = false,
    } = config;

    const lang = this.i18n.lang();
    const url = this.localeUrl(lang, path);
    const imageUrl = image.startsWith('http') ? image : this.absolute(image);

    this.title.setTitle(title);
    this.setName('description', description);
    if (keywords?.length) this.setName('keywords', keywords.join(', '));
    this.setName(
      'robots',
      noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    );

    this.setProperty('og:title', title);
    this.setProperty('og:description', description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', imageUrl);
    this.setProperty('og:type', type);
    this.setProperty('og:site_name', SeoService.SITE_NAME);
    this.setProperty('og:locale', this.ogLocale(lang));

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', title);
    this.setName('twitter:description', description);
    this.setName('twitter:image', imageUrl);

    this.setCanonical(url);
    this.setHreflang(path, noIndex);
    this.doc.documentElement.setAttribute('lang', lang);
  }

  setJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]): void {
    const head = this.doc.head;
    head.querySelector(`script[data-jsonld="${id}"]`)?.remove();
    const script = this.doc.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-jsonld', id);
    script.textContent = JSON.stringify(data);
    head.appendChild(script);
  }

  absolute(path: string): string {
    if (path.startsWith('http')) return path;
    return `${SeoService.ORIGIN}${path.startsWith('/') ? path : '/' + path}`;
  }

  /** Build an absolute, locale-prefixed URL for a locale-agnostic path. */
  localeUrl(locale: Lang, path: string): string {
    const clean = path === '/' || path === '' ? '' : path.startsWith('/') ? path : '/' + path;
    return `${SeoService.ORIGIN}/${locale}${clean}`;
  }

  // --- internals -------------------------------------------------------------

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }
  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }
  private ogLocale(locale: Lang): string {
    return { de: 'de_DE', fr: 'fr_FR', en: 'en_US', tr: 'tr_TR', ku: 'ku_TR' }[locale];
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /** Full hreflang set: one per locale + x-default (German). */
  private setHreflang(path: string, noIndex: boolean): void {
    this.doc.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.remove());
    if (noIndex) return;

    const add = (hreflang: string, href: string) => {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      this.doc.head.appendChild(link);
    };

    for (const l of LANGS) add(l.code, this.localeUrl(l.code, path));
    add('x-default', this.localeUrl('de', path));
  }
}
