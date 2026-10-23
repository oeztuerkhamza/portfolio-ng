import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from './core/data/project.data';
import { LANG_CODES } from './core/i18n/i18n.service';
import { REVIEW_CARD_PRODUCTS } from './core/data/review-cards.data';
import { TOWNS } from './core/data/towns.data';
import { RATGEBER } from './core/data/ratgeber.data';
import { REVIEW_CARDS_ENABLED, SMART_HOME_ENABLED } from './core/data/company.data';
import { INVITE_THEMES } from './einladung/invite-themes';
import { demoSlug } from './einladung/invite-demo';

const localeParams = async () => LANG_CODES.map((locale) => ({ locale }));
const inviteParams = async () => [...INVITE_THEMES.map((t) => ({ slug: demoSlug(t.id) })), { slug: 'live' }];

// Every known page is prerendered once per locale → static, fully crawlable
// HTML in each language. Unknown URLs are server-rendered (real 404 / redirect).
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  // Admin-Portal: als leere Hülle vorgerendert (Vercel liefert nur fertige
  // Seiten aus); Anmeldung und Daten laufen danach im Browser.
  { path: 'admin', renderMode: RenderMode.Prerender },
  /**
   * Einladungen: die zehn Beispiele fertig im HTML, dazu eine Hülle „live",
   * auf die vercel.json alle echten Einladungen umschreibt — deren Daten
   * kommen erst im Browser aus der API.
   */
  { path: 'einladung/:slug', renderMode: RenderMode.Prerender, getPrerenderParams: inviteParams },
  { path: 'einladung/:slug/planer', renderMode: RenderMode.Prerender, getPrerenderParams: inviteParams },
  { path: ':locale', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/leistungen', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  // Kartenprodukte und Shop: nur mit REVIEW_CARDS_ENABLED (siehe company.data.ts).
  ...(REVIEW_CARDS_ENABLED
    ? ([
  { path: ':locale/bewertungskarten', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  // Sieben Produkte × drei Sprachen, alle fertig ausgeliefert.
  {
    path: ':locale/bewertungskarten/:produkt',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      LANG_CODES.flatMap((locale) => REVIEW_CARD_PRODUCTS.map((p) => ({ locale, produkt: p.slug }))),
  },
  { path: ':locale/digitale-visitenkarte', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/geschenkkarte', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  // Der Gestalter ist ein Werkzeug: die Hülle wird vorgerendert, der Entwurf
  // entsteht im Browser. Im Index steht er nicht (noIndex in der Komponente).
  { path: ':locale/karte-gestalten/digitale-visitenkarte', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/karte-gestalten/geschenkkarte', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
      ] as ServerRoute[])
    : []),
  ...(SMART_HOME_ENABLED
    ? [{ path: ':locale/smart-home', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams } as ServerRoute]
    : []),
  { path: ':locale/digitale-einladung', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/wartung', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
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
  // Ratgeber und Ortsseiten gibt es nur auf Deutsch.
  { path: ':locale/ratgeber', renderMode: RenderMode.Prerender, getPrerenderParams: async () => [{ locale: 'de' }] },
  {
    path: ':locale/ratgeber/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => RATGEBER.map((a) => ({ locale: 'de', slug: a.slug })),
  },
  {
    path: ':locale/webdesign/:town',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => TOWNS.map((t) => ({ locale: 'de', town: t.slug })),
  },
  ...(REVIEW_CARDS_ENABLED
    ? ([
  { path: ':locale/bestellen', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/bestellen/danke', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
      ] as ServerRoute[])
    : []),
  { path: ':locale/impressum', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/datenschutz', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/agb', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/widerruf', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/versand', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: '**', renderMode: RenderMode.Server },
];
