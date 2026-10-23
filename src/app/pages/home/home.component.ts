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
  formatAmount,
  whatsappUrl,
  SMART_HOME_ENABLED,
} from '../../core/data/company.data';
import { fadeIn } from '../../core/animations/shared.animations';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { IconComponent } from '../../shared/icon/icon.component';
import { HOME_CONTENT } from './home.content';
import { UPDATE_CONTENT } from '../../core/data/homepage-update.content';
import { UPDATE_PACKAGES, UPDATE_PRICE_FROM } from '../../core/data/homepage-update.data';
import { WartungBannerComponent } from '../../shared/wartung-banner/wartung-banner.component';
import { ReviewsComponent } from '../../shared/reviews/reviews.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent, WartungBannerComponent, ReviewsComponent],
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
  /**
   * Drei echte Kundenbetriebe aus drei Branchen — Fahrradhandel, Juwelier,
   * Arztpraxis. Alle drei laufen auf eigener Domain; Zerin Gold und Bike Haus
   * haben ihre Bewertung öffentlich bei Google hinterlassen. Die Referenzen
   * stehen gleich hinter den Leistungen — bei Webentwicklung zählen
   * Projekte, die im Betrieb laufen.
   */
  readonly references = ['zerin-gold', 'bikehaus-freiburg', 'praxis-gueltekin', 'karaarslan-bike', 'dj-veys']
    .map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is Project => !!p);
  /** Drei echte Seiten als „Wand“ im Kopf der Startseite — jede führt zur Fallstudie. */
  readonly wall = ['zerin-gold', 'praxis-gueltekin', 'bikehaus-freiburg']
    .map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is Project => !!p);
  readonly updates = UPDATE_PACKAGES;
  readonly updateFrom = UPDATE_PRICE_FROM;
  /** Betrag im Zahlenformat der Sprache: 1690 → „1.690“. */
  fmt(amount: number): string {
    return formatAmount(amount, this.i18n.lang());
  }
  /** Adresse ohne Protokoll, für die Browserleiste im Bild. */
  host(p: Project): string {
    return (p.liveUrl ?? '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  }
  /** Siehe SMART_HOME_ENABLED in company.data.ts. */
  readonly smartHome = SMART_HOME_ENABLED;
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
  /**
   * Branchen mit Foto. Die Bilder sind freie Stockfotos (Pexels-Lizenz, siehe
   * src/assets/images/stock/CREDITS.md) und zeigen die Branche, nicht unsere
   * Kunden — darum bleibt der Alternativtext leer, die Überschrift trägt.
   */
  readonly industries = [
    { n: 1, img: 'cafe', pos: '50% 30%' },
    { n: 2, img: 'handwerk', pos: '30% 40%' },
    { n: 3, img: 'einzelhandel', pos: '50% 35%' },
    { n: 4, img: 'friseur', pos: '50% 40%' },
    { n: 5, img: 'praxis', pos: '50% 50%' },
    { n: 6, img: 'ferien', pos: '50% 55%' },
  ];
  readonly steps = [1, 2, 3, 4];
  readonly faqs = [1, 2, 3, 4, 5, 6];

  constructor() {
    this.i18n.register(HOME_CONTENT);
    this.i18n.register(UPDATE_CONTENT);
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
        'Webdesign Freiburg',
        'Webagentur Freiburg',
        'IT-Agentur Freiburg',
        'Webentwicklung Freiburg',
        'Website erstellen lassen Freiburg',
        'Webdesign Ortenau',
        'SEO Südbaden',
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
