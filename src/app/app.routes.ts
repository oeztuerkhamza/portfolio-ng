import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LANG_CODES, DEFAULT_LANG, Lang } from './core/i18n/i18n.service';

/** Validates the :locale segment; unknown prefixes redirect under the default locale. */
const localeGuard: CanActivateFn = (route, state) => {
  const locale = route.paramMap.get('locale');
  if (locale && LANG_CODES.includes(locale as Lang)) return true;
  const router = inject(Router);
  return router.parseUrl('/' + DEFAULT_LANG + state.url);
};

const localeChildren: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { animation: 'Home' },
  },
  {
    path: 'leistungen',
    loadComponent: () =>
      import('./pages/leistungen/leistungen.component').then(
        (m) => m.LeistungenComponent,
      ),
    data: { animation: 'Leistungen' },
  },
  {
    path: 'bewertungskarten',
    loadComponent: () =>
      import('./pages/bewertungskarten/bewertungskarten.component').then(
        (m) => m.BewertungskartenComponent,
      ),
    data: { animation: 'ReviewCards' },
  },
  {
    path: 'smart-home',
    loadComponent: () =>
      import('./pages/smart-home/smart-home.component').then(
        (m) => m.SmartHomeComponent,
      ),
    data: { animation: 'SmartHome' },
  },
  {
    path: 'abo',
    loadComponent: () =>
      import('./pages/abo/abo.component').then((m) => m.AboComponent),
    data: { animation: 'Abo' },
  },
  {
    path: 'ueber-uns',
    loadComponent: () =>
      import('./pages/ueber-uns/ueber-uns.component').then(
        (m) => m.UeberUnsComponent,
      ),
    data: { animation: 'About' },
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.component').then(
        (m) => m.ProjectsComponent,
      ),
    data: { animation: 'Projects' },
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent,
      ),
    data: { animation: 'ProjectDetail' },
  },
  {
    path: 'webdesign/:town',
    loadComponent: () => import('./pages/town/town.component').then((m) => m.TownComponent),
    data: { animation: 'Town' },
  },
  {
    path: 'bestellen',
    loadComponent: () => import('./pages/shop/shop.component').then((m) => m.ShopComponent),
    data: { animation: 'Shop' },
  },
  {
    path: 'bestellen/danke',
    loadComponent: () => import('./pages/shop/shop.component').then((m) => m.ShopComponent),
    data: { animation: 'ShopThanks', thanks: true },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
    data: { animation: 'Contact' },
  },
  // Die persoenlichen Seiten sind in /ueber-uns aufgegangen. Die alten Pfade
  // bleiben als Weiterleitung bestehen, damit verlinkte URLs nicht ins Leere
  // laufen; den echten 301 setzt vercel.json davor.
  { path: 'experience', redirectTo: 'ueber-uns', pathMatch: 'full' },
  { path: 'lebenslauf', redirectTo: 'ueber-uns', pathMatch: 'full' },
  {
    path: 'impressum',
    loadComponent: () =>
      import('./pages/impressum/impressum.component').then(
        (m) => m.ImpressumComponent,
      ),
    data: { animation: 'Impressum' },
  },
  {
    path: 'datenschutz',
    loadComponent: () =>
      import('./pages/datenschutz/datenschutz.component').then(
        (m) => m.DatenschutzComponent,
      ),
    data: { animation: 'Datenschutz' },
  },
];

export const routes: Routes = [
  { path: '', redirectTo: '/' + DEFAULT_LANG, pathMatch: 'full' },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
    data: { animation: 'Admin', bare: true },
  },
  {
    path: ':locale',
    canActivate: [localeGuard],
    children: localeChildren,
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
    data: { animation: 'NotFound' },
  },
];
