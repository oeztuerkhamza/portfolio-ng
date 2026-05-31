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
    path: 'experience',
    loadComponent: () =>
      import('./pages/experience/experience.component').then(
        (m) => m.ExperienceComponent,
      ),
    data: { animation: 'Experience' },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
    data: { animation: 'Contact' },
  },
  {
    path: 'lebenslauf',
    loadComponent: () =>
      import('./pages/resume/resume.component').then((m) => m.ResumeComponent),
    data: { animation: 'Resume' },
  },
];

export const routes: Routes = [
  { path: '', redirectTo: '/' + DEFAULT_LANG, pathMatch: 'full' },
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
