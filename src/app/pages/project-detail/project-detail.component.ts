import { AfterViewInit, Component, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PROJECTS, Project } from '../../core/data/project.data';
import { LiveDemoComponent } from '../../shared/live-demo/live-demo.component';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema, projectSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, LiveDemoComponent, LocalizePipe, IconComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: IntersectionObserver;

  project = signal<Project | null>(null);

  /** Kapitel der Geschichte: ein Absatz je Kapitel, Titel nach Position (drei oder vier Kapitel). */
  readonly chapters = computed(() => {
    const p = this.project();
    if (!p) return [];
    this.i18n.lang();
    const paras = this.i18n.ptx(p.slug, 'long', p.longDescription).split('\n\n');
    const keys =
      paras.length >= 4
        ? ['pd.ch.problem', 'pd.ch.answer', 'pd.ch.diff', 'pd.ch.result']
        : ['pd.ch.problem', 'pd.ch.answer', 'pd.ch.result'];
    // Das Kapitel heißt schon „Unsere Antwort“ — der Satzanfang im Text würde es wiederholen.
    const clean = (t: string) =>
      t.replace(/^(Unsere Antwort|Our answer|Cevabımız):\s*/, (_m) => '').replace(/^./, (c) => c.toUpperCase());
    return paras.map((text, i) => ({
      key: keys[Math.min(i, keys.length - 1)],
      text: clean(text),
      image: p.screenshots[i % p.screenshots.length],
    }));
  });

  /** Mit mehreren Screenshots wechselt das Bild beim Scrollen mit dem Kapitel. */
  readonly hasStage = computed(() => (this.project()?.screenshots.length ?? 0) > 1);
  readonly active = signal(0);
  /** Erst im Browser abdunkeln wir inaktive Kapitel — ohne JavaScript bleibt alles lesbar. */
  readonly enhanced = signal(false);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    const found = PROJECTS.find((p) => p.slug === slug) ?? null;
    this.project.set(found);
    this.applySeo(found);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !('IntersectionObserver' in window)) return;
    const steps = this.doc.querySelectorAll('.cs-step');
    if (!steps.length) return;
    this.enhanced.set(true);
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) this.active.set(Number((e.target as HTMLElement).dataset['i']));
        }
      },
      { rootMargin: '-42% 0px -42% 0px' },
    );
    steps.forEach((el) => this.observer!.observe(el));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private applySeo(p: Project | null): void {
    if (!p) {
      this.seo.update({
        title: 'Referenz nicht gefunden — Breisgau Digital',
        description: 'Diese Referenz gibt es nicht (mehr). Alle aktuellen Projekte finden Sie in der Übersicht.',
        path: '/projects',
        noIndex: true,
      });
      return;
    }

    const subtitle = this.i18n.ptx(p.slug, 'subtitle', p.subtitle);
    const description = this.i18n.ptx(p.slug, 'description', p.description);
    this.seo.update({
      title: `${p.title} — ${subtitle} | Breisgau Digital`,
      description,
      path: `/projects/${p.slug}`,
      image: this.seo.absolute(p.image),
      type: 'article',
      keywords: [...p.tags, p.category, 'Breisgau Digital', 'Referenz', 'Freiburg'],
    });

    this.seo.setJsonLd('project', projectSchema(p));
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Referenzen', path: '/projects' },
        { name: p.title, path: `/projects/${p.slug}` },
      ]),
    );
  }
}
