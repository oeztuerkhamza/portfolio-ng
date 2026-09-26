import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  AfterViewInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOWNS } from '../../core/data/towns.data';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { STATS } from '../../core/data/skills.data';
import { PROJECTS, Project } from '../../core/data/project.data';
import {
  COMPANY,
  PRODUCTS,
  TOWNS_ONSITE,
  TOWNS_REMOTE,
  WEBSITE_PRICE_FROM,
  whatsappUrl,
} from '../../core/data/company.data';
import { fadeIn } from '../../core/animations/shared.animations';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { HOME_CONTENT } from './home.content';
import { AboBannerComponent } from '../../shared/abo-banner/abo-banner.component';
import { ReviewsComponent } from '../../shared/reviews/reviews.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent, AboBannerComponent, ReviewsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [fadeIn],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly seo = inject(SeoService);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly i18n = inject(I18nService);

  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();
  readonly products = PRODUCTS;
  readonly stats = STATS;
  /** Drei Betriebe aus drei Branchen — Handel, Hotellerie, Dienstleistung. */
  readonly references = ['bikehaus-freiburg', 'hotel-bergfrieden', 'gkn-portraits']
    .map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is Project => !!p);
  readonly townsOnsite = TOWNS_ONSITE;
  /** Ortsseite zum Ortsnamen, z. B. „Breisach" → breisach. */
  townSlug(name: string): string | undefined {
    return TOWNS.find((t) => t.short === name || t.name === name)?.slug;
  }
  readonly townsRemote = TOWNS_REMOTE;
  readonly websitePrice = WEBSITE_PRICE_FROM;

  readonly trust = ['home.trust1', 'home.trust2', 'home.trust3', 'home.trust4'];
  readonly more = ['home.more1', 'home.more2', 'home.more3', 'home.more4'];
  readonly reasons = [
    { n: 1, icon: 'euro' },
    { n: 2, icon: 'pin' },
    { n: 3, icon: 'layers' },
    { n: 4, icon: 'shield' },
  ];
  readonly industries = [
    { n: 1, icon: 'cup' },
    { n: 2, icon: 'hammer' },
    { n: 3, icon: 'bag' },
    { n: 4, icon: 'scissors' },
    { n: 5, icon: 'briefcase' },
    { n: 6, icon: 'bed' },
  ];
  readonly steps = [1, 2, 3, 4];
  readonly faqs = [1, 2, 3, 4, 5];

  constructor() {
    this.i18n.register(HOME_CONTENT);
  }

  /** Abschnitte, die beim Scrollen eingeblendet werden. */
  readonly visible = signal<Set<string>>(new Set());
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.home.title'),
      description: this.i18n.t('seo.home.desc'),
      path: '/',
      keywords: [
        'Digitalisierung Freiburg',
        'Google Bewertungskarte Freiburg',
        'NFC Bewertungskarte',
        'Webseite erstellen lassen Freiburg',
        'Smart Home Freiburg',
        'Digitalisierung kleine Unternehmen Baden-Württemberg',
      ],
    });
    this.seo.setJsonLd('breadcrumb', breadcrumbSchema([{ name: 'Start', path: '/' }]));

    // FAQ als Rich Result — immer deutsch, wie die übrigen Schemas der Seite.
    const de = (key: string) =>
      HOME_CONTENT[key].de.replace('{p}', WEBSITE_PRICE_FROM.toLocaleString('de-DE'));
    this.seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((n) => ({
        '@type': 'Question',
        name: de(`home.faq${n}.q`),
        acceptedAnswer: { '@type': 'Answer', text: de(`home.faq${n}.a`) },
      })),
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !('IntersectionObserver' in window)) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).id;
          this.visible.update((set) => new Set(set).add(id));
          this.observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    this.doc.querySelectorAll('[data-reveal]').forEach((el) => this.observer!.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /**
   * Ohne JavaScript (SSR-HTML, Crawler) ist alles sichtbar; erst im Browser
   * werden noch nicht gesehene Abschnitte für die Einblendung zurückgesetzt.
   */
  shown(id: string): boolean {
    return !this.isBrowser || this.visible().has(id);
  }

  scrollTo(id: string): void {
    this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
