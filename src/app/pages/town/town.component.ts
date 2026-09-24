import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { COMPANY, PRODUCTS, whatsappUrl } from '../../core/data/company.data';
import { SUBSCRIPTION_PRICE_FROM } from '../../core/data/subscriptions.data';
import { ProductFocus, TOWNS, Town, townBySlug } from '../../core/data/towns.data';
import { IconComponent } from '../../shared/icon/icon.component';

interface Card {
  id: ProductFocus;
  title: string;
  price: string;
  link: string;
  icon: string;
  text: string;
}

const PRODUCT_META: Record<ProductFocus, { title: string; link: string; icon: string; price: () => string }> = {
  cards: {
    title: 'Google-Bewertungskarten',
    link: '/de/bewertungskarten',
    icon: 'star',
    price: () => `ab ${PRODUCTS.find((p) => p.id === 'cards')!.priceFrom} €`,
  },
  web: {
    title: 'Website & Relaunch',
    link: '/de/leistungen',
    icon: 'monitor',
    price: () => `ab ${PRODUCTS.find((p) => p.id === 'web')!.priceFrom.toLocaleString('de-DE')} €`,
  },
  sh: {
    title: 'Smart Home',
    link: '/de/smart-home',
    icon: 'bulb',
    price: () => `ab ${PRODUCTS.find((p) => p.id === 'sh')!.priceFrom} €`,
  },
  abo: {
    title: 'Digital-Abo',
    link: '/de/abo',
    icon: 'refresh',
    price: () => `ab ${SUBSCRIPTION_PRICE_FROM} € / Monat`,
  },
};

/**
 * Ortsseite /de/webdesign/<ort>. Nur auf Deutsch, Inhalte aus towns.data.ts.
 */
@Component({
  selector: 'app-town',
  standalone: true,
  imports: [RouterLink, IconComponent],
  styleUrl: './town.component.scss',
  template: `
    @if (town; as t) {
      <header class="page-hero">
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a routerLink="/de">Start</a>
            <span class="sep" aria-hidden="true">/</span>
            <span aria-current="page">Webdesign {{ t.short }}</span>
          </nav>
          <div class="sec-head town-head">
            <p class="section-label">{{ t.region }} · {{ t.district }}</p>
            <h1 class="section-title">
              Webdesign &amp; Google-Bewertungen<br /><em>in {{ t.short }}</em>.
            </h1>
            <p class="section-subtitle">{{ t.intro }}</p>
            <ul class="chips town-facts">
              <li class="chip chip-outline"><app-icon name="pin" />
                @if (t.km) { rund {{ t.km }} km · ca. {{ t.minutes }} Min. ab Freiburg } @else { Unser Standort }
              </li>
              <li class="chip chip-outline"><app-icon name="user" /> Termine vor Ort</li>
              <li class="chip chip-outline"><app-icon name="euro" /> Festpreis oder Monatsabo</li>
            </ul>
            <div class="page-hero-actions">
              <a routerLink="/de/contact" fragment="anfrage" class="btn btn-primary btn-large">
                Kostenloses Erstgespräch <app-icon name="arrow" />
              </a>
              <a [href]="company.phoneHref" class="btn btn-secondary btn-large"><app-icon name="phone" /> {{ company.phoneDisplay }}</a>
            </div>
          </div>
        </div>
      </header>

      <section class="section section-white">
        <div class="container town-local">
          <div>
            <p class="section-label">Betriebe vor Ort</p>
            <h2 class="section-title">Digital sichtbar <em>in {{ t.short }}</em>.</h2>
          </div>
          <p class="town-text">{{ t.local }}</p>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <header class="sec-head">
            <p class="section-label">Leistungen</p>
            <h2 class="section-title">Was wir für Betriebe <em>in {{ t.short }}</em> tun.</h2>
          </header>
          <div class="grid grid-2">
            @for (c of cards; track c.id) {
              <a [routerLink]="c.link" class="card card-hover town-card">
                <span class="icon-badge"><app-icon [name]="c.icon" /></span>
                <h3 class="card-title">{{ c.title }} <span class="town-price">{{ c.price }}</span></h3>
                <p class="card-text">{{ c.text }}</p>
                <span class="town-more">Mehr erfahren <app-icon name="arrow" /></span>
              </a>
            }
          </div>
        </div>
      </section>

      <section class="section section-white">
        <div class="container faq-layout">
          <header class="sec-head">
            <p class="section-label">Häufige Fragen</p>
            <h2 class="section-title">Fragen aus <em>{{ t.short }}</em>.</h2>
          </header>
          <div class="faq-list">
            @for (f of t.faqs; track f.q) {
              <details class="faq-item">
                <summary>{{ f.q }}</summary>
                <p>{{ f.a }}</p>
              </details>
            }
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <p class="section-label">Auch in der Nähe</p>
          <ul class="chips town-near">
            @for (n of near; track n.slug) {
              <li><a class="chip chip-outline" [routerLink]="'/de/webdesign/' + n.slug">Webdesign {{ n.short }}</a></li>
            }
          </ul>
        </div>
      </section>

      <section class="final-cta">
        <div class="container">
          <div class="cta-box">
            <div>
              <h2 class="cta-title">Ihr Betrieb in {{ t.short }} — <em>sichtbar bei Google</em>.</h2>
              <p class="cta-text">Rufen Sie an oder schreiben Sie uns. Im kostenlosen Erstgespräch schauen wir uns Ihr Google-Profil und Ihre Website gemeinsam an.</p>
            </div>
            <div class="cta-actions">
              <a routerLink="/de/contact" fragment="anfrage" class="btn btn-light btn-large">Erstgespräch anfragen <app-icon name="arrow" /></a>
              <div class="cta-direct">
                <a [href]="company.phoneHref" class="btn btn-outline-light"><app-icon name="phone" /> Anrufen</a>
                <a [href]="whatsapp" target="_blank" rel="noopener" class="btn btn-outline-light"><app-icon name="chat" /> WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    }
  `,
})
export class TownComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();
  readonly town: Town | undefined = townBySlug(inject(ActivatedRoute).snapshot.paramMap.get('town') ?? '');
  readonly cards: Card[] = (this.town?.focus ?? []).map((id) => ({
    id,
    title: PRODUCT_META[id].title,
    link: PRODUCT_META[id].link,
    icon: PRODUCT_META[id].icon,
    price: PRODUCT_META[id].price(),
    text: this.town!.angles[id] ?? '',
  }));
  readonly near: Town[] = (this.town?.near ?? []).map((s) => townBySlug(s)!).filter(Boolean);

  ngOnInit(): void {
    const t = this.town;
    if (!t) {
      this.router.navigateByUrl('/de');
      return;
    }
    const path = `/webdesign/${t.slug}`;
    this.seo.update({
      title: `Webdesign ${t.short} & Google-Bewertungen | Breisgau Digital`,
      description: `Websites, NFC-Bewertungskarten und Smart Home für Betriebe in ${t.short}${
        t.km ? ` – persönlich vor Ort, ca. ${t.minutes} Min. ab Freiburg` : ' – persönlich vor Ort'
      }. Festpreis oder Monatsabo, Erstgespräch kostenlos.`,
      path,
      langs: ['de'],
      keywords: [`Webdesign ${t.short}`, `Website erstellen lassen ${t.short}`, `Google Bewertungen ${t.short}`, `Digitalagentur ${t.short}`],
    });
    this.seo.setJsonLd('breadcrumb', breadcrumbSchema([
      { name: 'Start', path: '/de' },
      { name: `Webdesign ${t.short}`, path: `/de${path}` },
    ]));
    this.seo.setJsonLd('town', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Webdesign, Google-Bewertungskarten und Smart Home in ${t.name}`,
      serviceType: ['Webdesign', 'Google-Bewertungskarten', 'Smart Home', 'Local SEO'],
      provider: { '@id': `${SeoService.ORIGIN}/#service` },
      areaServed: {
        '@type': 'City',
        name: t.name,
        containedInPlace: { '@type': 'AdministrativeArea', name: t.district },
        geo: { '@type': 'GeoCoordinates', latitude: t.lat, longitude: t.lng },
      },
      url: `${SeoService.ORIGIN}/de${path}`,
    });
    this.seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: t.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
  }
}

export const TOWN_SLUGS = TOWNS.map((t) => t.slug);
