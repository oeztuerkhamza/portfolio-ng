import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { COMPANY, PRODUCTS, WEBSITE_PRICE_FROM, whatsappUrl, REVIEW_CARDS_ENABLED, SMART_HOME_ENABLED } from '../../core/data/company.data';
import { MAINTENANCE_PRICE_FROM } from '../../core/data/maintenance.data';
import { UPDATE_PACKAGES } from '../../core/data/homepage-update.data';
import { PROJECTS } from '../../core/data/project.data';
import { ProductFocus, TOWNS, Town, townBySlug } from '../../core/data/towns.data';
import { RATGEBER } from '../../core/data/ratgeber.data';
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
    title: 'Webdesign, Entwicklung & SEO',
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
    title: 'Wartung & Pflege',
    link: '/de/wartung',
    icon: 'refresh',
    price: () => `ab ${MAINTENANCE_PRICE_FROM} € / Monat`,
  },
};

const FOCUS_ORDER: ProductFocus[] = ['web', 'abo', 'cards', 'sh'];

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
              @if (t.h1) {
                {{ t.h1[0] }}<br /><em>{{ t.h1[1] }}</em>.
              } @else {
                Webdesign &amp; Webentwicklung<br /><em>in {{ t.short }}</em>.
              }
            </h1>
            <p class="section-subtitle">{{ t.intro }}</p>
            <ul class="chips town-facts">
              <li class="chip chip-outline"><app-icon name="pin" />
                @if (t.isRegion) { Von Kehl bis Hausach } @else if (t.km) { rund {{ t.km }} km · ca. {{ t.minutes }} Min. ab Freiburg } @else { Unser Standort }
              </li>
              <li class="chip chip-outline"><app-icon name="user" /> Termine vor Ort</li>
              <li class="chip chip-outline"><app-icon name="euro" /> Festpreis, Wartung monatlich kündbar</li>
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
          <div>
            <p class="town-text">{{ t.local }}</p>
            @if (districts) {
              <p class="town-text">Termine machen wir im ganzen Stadtgebiet — auch in {{ districts }}.</p>
            }
          </div>
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

      @if (refs.length) {
        <section class="section section-white">
          <div class="container">
            <header class="sec-head">
              <p class="section-label">Referenzen aus {{ t.short }}</p>
              <h2 class="section-title">Webdesign aus {{ t.short }}: <em>Betriebe, für die wir gebaut haben</em>.</h2>
            </header>
            <div class="grid grid-2">
              @for (p of refs; track p.slug) {
                <a [routerLink]="'/de/projects/' + p.slug" class="card card-hover town-card">
                  <img class="town-ref-img" [src]="p.image" [alt]="'Website ' + p.title" width="1440" height="900" loading="lazy" />
                  <h3 class="card-title">{{ p.title }}</h3>
                  <p class="card-text">{{ p.description }}</p>
                  <span class="town-more">Referenz ansehen <app-icon name="arrow" /></span>
                </a>
              }
            </div>
          </div>
        </section>
      }

      @if (t.detail) {
        <section class="section">
          <div class="container town-local">
            <div>
              <p class="section-label">Preise</p>
              <h2 class="section-title">Was kostet eine Website <em>in {{ t.short }}</em>?</h2>
            </div>
            <div>
              <p class="town-text">Wir arbeiten zum Festpreis. Sie bekommen vor Projektstart ein schriftliches Angebot, und dabei bleibt es. Alle Preise sind Endpreise.</p>
              <ul class="town-list">
                <li>Neue Firmen-Website: ab {{ priceNew }} €</li>
                @for (u of updates; track u.name) {
                  <li>Homepage-Update {{ u.name }}: {{ u.price }} €, fertig in {{ u.days }} Werktagen</li>
                }
                <li>Wartung und Pflege: ab {{ priceCare }} € im Monat, monatlich kündbar</li>
              </ul>
              <p class="town-text">Shop, Online-Buchung oder mehrere Sprachen kalkulieren wir nach dem Erstgespräch einzeln. Wovon der Preis abhängt, steht im Ratgeber: <a routerLink="/de/ratgeber/website-kosten-freiburg">Was kostet eine Website für einen kleinen Betrieb in Freiburg?</a></p>
            </div>
          </div>
        </section>

        <section class="section section-white">
          <div class="container town-local">
            <div>
              <p class="section-label">Ablauf</p>
              <h2 class="section-title">Website erstellen lassen <em>in {{ t.short }}</em>: so läuft es ab.</h2>
            </div>
            <ol class="town-list">
              <li><strong>Erstgespräch bei Ihnen im Betrieb.</strong> Kostenlos, meist 30 bis 45 Minuten. Wir schauen uns Ihre bestehende Website und Ihr Google-Profil gemeinsam an.</li>
              <li><strong>Schriftliches Angebot zum Festpreis.</strong> Sie wissen vor dem Start, was gebaut wird und was es kostet.</li>
              <li><strong>Entwurf und Umsetzung.</strong> Jede Seite wird programmiert, nicht aus einem Baukasten geklickt. Eine Firmen-Website steht meist nach zwei bis vier Wochen.</li>
              <li><strong>Start und Betreuung.</strong> Domain und Zugänge laufen auf Ihren Namen. Wartung gibt es auf Wunsch als Monatspaket — Pflicht ist sie nicht.</li>
            </ol>
          </div>
        </section>
      }
      @for (s of stories; track s.slug) {
        <section class="section section-white">
          <div class="container town-local">
            <div>
              <p class="section-label">Aus {{ t.short }}</p>
              <h2 class="section-title">{{ s.title }}</h2>
            </div>
            <div>
              <p class="town-text">{{ s.lead }}</p>
              <p><a [routerLink]="'/de/ratgeber/' + s.slug" class="btn btn-secondary">Fallstudie lesen <app-icon name="arrow" /></a></p>
            </div>
          </div>
        </section>
      }

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
              <p class="cta-text">Rufen Sie an oder schreiben Sie uns. Im kostenlosen Erstgespräch schauen wir uns Ihre Website und Ihr Google-Profil gemeinsam an.</p>
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
  readonly cards: Card[] = [...(this.town?.focus ?? [])]
    .filter((id) => (id !== 'sh' || SMART_HOME_ENABLED) && (id !== 'cards' || REVIEW_CARDS_ENABLED))
    // Websites zuerst — danach die Wartung, die Karten als Ergänzung.
    .sort((a, b) => FOCUS_ORDER.indexOf(a) - FOCUS_ORDER.indexOf(b))
    .map((id) => ({
    id,
    title: PRODUCT_META[id].title,
    link: PRODUCT_META[id].link,
    icon: PRODUCT_META[id].icon,
    price: PRODUCT_META[id].price(),
    text: this.town!.angles[id] ?? '',
  }));
  /** Referenzen aus dem Ort, in der Reihenfolge aus towns.data.ts. */
  readonly refs = (this.town?.references ?? [])
    .map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);
  /** Preise aus dem Katalog, im deutschen Zahlenformat. */
  readonly priceNew = WEBSITE_PRICE_FROM.toLocaleString('de-DE');
  readonly priceCare = MAINTENANCE_PRICE_FROM;
  readonly updates = UPDATE_PACKAGES.map((u) => ({
    name: u.id[0].toUpperCase() + u.id.slice(1),
    price: u.price.toLocaleString('de-DE'),
    days: u.days,
  }));  /** „A, B und C" — die Ortsteile als Satzteil. */
  readonly districts = new Intl.ListFormat('de', { type: 'conjunction' }).format(this.town?.districts ?? []);
  /** Ratgeber-Artikel aus diesem Ort — echte Arbeit vor Ort statt Vorlagentext. */
  readonly stories = RATGEBER.filter((a) => a.town === this.town?.slug);
  readonly near: Town[] = (this.town?.near ?? []).map((s) => townBySlug(s)!).filter(Boolean);

  ngOnInit(): void {
    const t = this.town;
    if (!t) {
      this.router.navigateByUrl('/de');
      return;
    }
    const path = `/webdesign/${t.slug}`;
    this.seo.update({
      title: t.seoTitle ?? `Webdesign & SEO ${t.short} – Webagentur | Breisgau Digital`,
      description: `Webdesign & SEO für Betriebe in ${t.short}${
        t.km && !t.isRegion ? ` – persönlich vor Ort, ca. ${t.minutes} Min. ab Freiburg` : ' – persönlich vor Ort'
      }. Websites und Shops zum Festpreis, Erstgespräch kostenlos.`,
      path,
      langs: ['de'],
      keywords: [...(t.isRegion ? [`Webdesign ${t.district}`, `Online-Shop erstellen ${t.short}`] : []), `Webdesign ${t.short}`, `Webagentur ${t.short}`, `Website erstellen lassen ${t.short}`, `SEO ${t.short}`, `Homepage erstellen lassen ${t.short}`, `Website Wartung ${t.short}`],
    });
    this.seo.setJsonLd('breadcrumb', breadcrumbSchema([
      { name: 'Start', path: '/de' },
      { name: `Webdesign ${t.short}`, path: `/de${path}` },
    ]));
    this.seo.setJsonLd('town', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Webdesign, Webentwicklung und SEO in ${t.name}`,
      // Smart Home nur, wenn wir es anbieten — siehe SMART_HOME_ENABLED.
      serviceType: [
        'Webdesign',
        'Webentwicklung',
        ...(REVIEW_CARDS_ENABLED ? ['Google-Bewertungskarten'] : []),
        ...(SMART_HOME_ENABLED ? ['Smart Home'] : []),
        'Local SEO',
      ],
      provider: { '@id': `${SeoService.ORIGIN}/#service` },
      areaServed: {
        '@type': t.isRegion ? 'AdministrativeArea' : 'City',
        name: t.name,
        ...(t.isRegion ? {} : { containedInPlace: { '@type': 'AdministrativeArea', name: t.district } }),
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
