import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROJECTS, Project } from '../../core/data/project.data';
import { Location } from '@angular/common';
import { LiveDemoComponent } from '../../shared/live-demo/live-demo.component';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema, projectSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, LiveDemoComponent, LocalizePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  project = signal<Project | null>(null);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    const found = PROJECTS.find((p) => p.slug === slug) ?? null;
    this.project.set(found);
    this.applySeo(found);
  }

  private applySeo(p: Project | null): void {
    if (!p) {
      this.seo.update({
        title: 'Eintrag nicht gefunden — Hamza Öztürk',
        description: 'Das gesuchte Projekt existiert nicht im Verzeichnis.',
        path: '/projects',
        noIndex: true,
      });
      return;
    }

    const subtitle = this.i18n.ptx(p.slug, 'subtitle', p.subtitle);
    const description = this.i18n.ptx(p.slug, 'description', p.description);
    this.seo.update({
      title: `${p.title} — ${subtitle} | Hamza Öztürk`,
      description,
      path: `/projects/${p.slug}`,
      image: this.seo.absolute(p.image),
      type: 'article',
      keywords: [...p.tags, p.category, 'Hamza Öztürk', 'Freiburg'],
    });

    this.seo.setJsonLd('project', projectSchema(p));
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Projekte', path: '/projects' },
        { name: p.title, path: `/projects/${p.slug}` },
      ]),
    );
  }

  goBack() {
    this.location.back();
  }
}
