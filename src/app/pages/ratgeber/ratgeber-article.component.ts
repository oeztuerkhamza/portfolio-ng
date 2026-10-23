import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import { PROJECTS } from '../../core/data/project.data';
import { RATGEBER, RatgeberArticle, articleBySlug } from '../../core/data/ratgeber.data';
import { townBySlug } from '../../core/data/towns.data';
import { IconComponent } from '../../shared/icon/icon.component';

/** „2026-10-23" → „23. Oktober 2026". */
export function dateDe(iso: string): string {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Artikel /de/ratgeber/<slug>. Nur auf Deutsch, Inhalte aus ratgeber.data.ts. */
@Component({
  selector: 'app-ratgeber-article',
  standalone: true,
  imports: [RouterLink, IconComponent],
  styleUrl: './ratgeber.component.scss',
  template: `
    @if (article; as a) {
      <header class="page-hero">
        <div class="container">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a routerLink="/de">Start</a>
            <span class="sep" aria-hidden="true">/</span>
            <a routerLink="/de/ratgeber">Ratgeber</a>
            <span class="sep" aria-hidden="true">/</span>
            <span aria-current="page">{{ a.title }}</span>
          </nav>
          <div class="sec-head rg-head">
            <p class="section-label">{{ a.project ? 'Fallstudie' : 'Ratgeber' }}</p>
            <h1 class="section-title">{{ a.title }}</h1>
            <p class="rg-meta">
              <time [attr.datetime]="a.published">{{ date(a.published) }}</time> · {{ a.minutes }} Min. Lesezeit · Hamza Öztürk
            </p>
          </div>
        </div>
      </header>

      <article class="section section-white">
        <div class="container">
          <div class="prose rg-prose">
            <p class="rg-lead">{{ a.lead }}</p>
            <figure class="media-frame rg-figure">
              <img [src]="a.image" [alt]="a.title" width="1440" height="900" fetchpriority="high" />
            </figure>
            @for (s of a.sections; track s.h) {
              <h2>{{ s.h }}</h2>
              @for (p of s.p; track p) {
                <p>{{ p }}</p>
              }
              @if (s.list) {
                <ul>
                  @for (li of s.list; track li) {
                    <li>{{ li }}</li>
                  }
                </ul>
              }
            }
          </div>

          @if (project || town) {
            <div class="rg-links">
              @if (project; as p) {
                <a [routerLink]="'/de/projects/' + p.slug" class="card card-hover">
                  <p class="section-label">Referenz</p>
                  <h3 class="card-title">{{ p.title }}</h3>
                  <p class="card-text">{{ p.subtitle }}</p>
                  <span class="rg-more">Zur Fallstudie mit Technik <app-icon name="arrow" /></span>
                </a>
              }
              @if (town; as t) {
                <a [routerLink]="'/de/webdesign/' + t.slug" class="card card-hover">
                  <p class="section-label">Vor Ort</p>
                  <h3 class="card-title">Webdesign {{ t.short }}</h3>
                  <p class="card-text">Was wir für Betriebe in {{ t.short }} und Umgebung tun.</p>
                  <span class="rg-more">Mehr erfahren <app-icon name="arrow" /></span>
                </a>
              }
            </div>
          }
        </div>
      </article>

      @if (more.length) {
        <section class="section">
          <div class="container">
            <p class="section-label">Weiterlesen</p>
            <ul class="grid grid-2 rg-list">
              @for (m of more; track m.slug) {
                <li>
                  <a [routerLink]="'/de/ratgeber/' + m.slug" class="card card-hover rg-card">
                    <div class="rg-body">
                      <p class="rg-meta">{{ m.minutes }} Min. Lesezeit</p>
                      <h3 class="card-title">{{ m.title }}</h3>
                      <span class="rg-more">Weiterlesen <app-icon name="arrow" /></span>
                    </div>
                  </a>
                </li>
              }
            </ul>
          </div>
        </section>
      }

      <section class="final-cta">
        <div class="container">
          <div class="cta-box">
            <div>
              <h2 class="cta-title">Ihr Betrieb — <em>Ihre Fallstudie</em>?</h2>
              <p class="cta-text">Im kostenlosen Erstgespräch schauen wir uns an, was Ihre Website und Ihre Abläufe heute leisten — und was sie leisten könnten.</p>
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
export class RatgeberArticleComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();
  readonly date = dateDe;
  readonly article: RatgeberArticle | undefined = articleBySlug(inject(ActivatedRoute).snapshot.paramMap.get('slug') ?? '');
  readonly project = PROJECTS.find((p) => p.slug === this.article?.project);
  readonly town = this.article?.town ? townBySlug(this.article.town) : undefined;
  readonly more = RATGEBER.filter((a) => a.slug !== this.article?.slug);

  ngOnInit(): void {
    const a = this.article;
    if (!a) {
      this.router.navigateByUrl('/de/ratgeber');
      return;
    }
    const path = `/ratgeber/${a.slug}`;
    if (this.i18n.lang() !== 'de') {
      this.router.navigateByUrl('/de' + path);
      return;
    }
    this.seo.update({
      title: `${a.seoTitle} | Breisgau Digital`,
      description: a.description,
      path,
      image: a.image,
      type: 'article',
      langs: ['de'],
    });
    this.seo.setJsonLd('breadcrumb', breadcrumbSchema([
      { name: 'Start', path: '/de' },
      { name: 'Ratgeber', path: '/de/ratgeber' },
      { name: a.title, path: `/de${path}` },
    ]));
    this.seo.setJsonLd('article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.description,
      image: this.seo.absolute(a.image),
      datePublished: a.published,
      dateModified: a.updated ?? a.published,
      inLanguage: 'de',
      author: { '@id': `${SeoService.ORIGIN}/#person` },
      publisher: { '@id': `${SeoService.ORIGIN}/#service` },
      mainEntityOfPage: `${SeoService.ORIGIN}/de${path}`,
      ...(this.project ? { about: { '@id': `${SeoService.ORIGIN}/projects/${this.project.slug}#project` } } : {}),
    });
  }
}
