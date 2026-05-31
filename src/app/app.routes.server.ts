import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from './core/data/project.data';
import { LANG_CODES } from './core/i18n/i18n.service';

const localeParams = async () => LANG_CODES.map((locale) => ({ locale }));

// Every known page is prerendered once per locale → static, fully crawlable
// HTML in each language. Unknown URLs are server-rendered (real 404 / redirect).
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Server },
  { path: ':locale', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/leistungen', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/projects', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  {
    path: ':locale/projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      LANG_CODES.flatMap((locale) =>
        PROJECTS.map((p) => ({ locale, slug: p.slug })),
      ),
  },
  { path: ':locale/experience', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/contact', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/lebenslauf', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/impressum', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: ':locale/datenschutz', renderMode: RenderMode.Prerender, getPrerenderParams: localeParams },
  { path: '**', renderMode: RenderMode.Server },
];
