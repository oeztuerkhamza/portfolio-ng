import {
  Component,
  signal,
  AfterViewInit,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { EXPERIENCES, ExperienceItem } from '../../core/data/experience.data';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [NgClass],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  experiences: ExperienceItem[] = EXPERIENCES;
  selectedImage = signal<string | null>(null);
  visibleItems = signal<Set<number>>(new Set());
  private observer!: IntersectionObserver;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit() {
    this.seo.update({
      title: this.i18n.t('seo.exp.title'),
      description: this.i18n.t('seo.exp.desc'),
      path: '/experience',
      keywords: ['Werdegang', 'Erfahrung Webentwickler', 'Fachinformatiker Freiburg'],
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Werdegang', path: '/experience' },
      ]),
    );
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute('data-id'));
            this.visibleItems.update((set) => {
              const newSet = new Set(set);
              newSet.add(id);
              return newSet;
            });
          }
        });
      },
      { threshold: 0.2 },
    );

    document.querySelectorAll('.timeline-card').forEach((el) => {
      this.observer.observe(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  isVisible(id: number): boolean {
    return this.visibleItems().has(id);
  }

  openLightbox(image: string) {
    this.selectedImage.set(image);
  }

  closeLightbox() {
    this.selectedImage.set(null);
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'work':
        return this.i18n.t('exp.type.work');
      case 'education':
        return this.i18n.t('exp.type.education');
      case 'certificate':
        return this.i18n.t('exp.type.certificate');
      default:
        return '';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'work':
        return '💼';
      case 'education':
        return '🎓';
      case 'certificate':
        return '📜';
      default:
        return '📌';
    }
  }
}
