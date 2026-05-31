import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS, Project } from '../../core/data/project.data';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, LocalizePipe],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  projects: Project[] = PROJECTS;

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.t('seo.projects.title'),
      description: this.i18n.t('seo.projects.desc'),
      path: '/projects',
      keywords: [
        'Webentwicklung Projekte Freiburg',
        'Referenzen Webentwickler',
        'Portfolio Webentwicklung',
        'Angular .NET Projekte',
      ],
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Projekte', path: '/projects' },
      ]),
    );
  }
}
