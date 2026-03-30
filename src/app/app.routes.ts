import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { animation: 'Home' },
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
  { path: '**', redirectTo: '' },
];
