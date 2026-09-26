import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from './core/data/project.data';
import { LANG_CODES } from './core/i18n/i18n.service';
import { REVIEW_CARD_PRODUCTS } from './core/data/review-cards.data';
import { TOWNS } from './core/data/towns.data';

const localeParams = async () => LANG_CODES.map((locale) => ({ locale }));

// Every known page is prerendered once per locale → static, fully crawlable
// HTML in each language. Unknown URLs are server-rendered (real 404 / redirect).
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  // Admin-Portal: als leere Hülle vorgerendert (Vercel liefert nur fertige
  // Seiten aus); Anmeldung und Daten laufen danach im Browser.
  { path: 'admin', renderMode: RenderMode.Prerender },
  { path: ':locale', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/leistungen', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/bewertungskarten', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  // Sieben Produkte × fünf Sprachen, alle fertig ausgeliefert.
  {
    path: ':locale/bewertungskarten/:produkt',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      LANG_CODES.flatMap((locale) => REVIEW_CARD_PRODUCTS.map((p) => ({ locale, produkt: p.slug }))),
  },
  { path: ':locale/smart-home', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/abo', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/ueber-uns', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/projects', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  {
    path: ':locale/projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      LANG_CODES.flatMap((locale) =>
        PROJECTS.map((p) => ({ locale, slug: p.slug })),
      ),
  },
  { path: ':locale/contact', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  // Ortsseiten gibt es nur auf Deutsch.
  {
    path: ':locale/webdesign/:town',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => TOWNS.map((t) => ({ locale: 'de', town: t.slug })),
  },
  { path: ':locale/bestellen', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/bestellen/danke', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/impressum', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/datenschutz', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/agb', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/widerruf', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/versand', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: '**', renderMode: RenderMode.Server },
];
