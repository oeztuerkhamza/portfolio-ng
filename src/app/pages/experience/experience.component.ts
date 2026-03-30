import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { EXPERIENCES, ExperienceItem } from '../../core/data/experience.data';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [NgClass],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  experiences: ExperienceItem[] = EXPERIENCES;
  selectedImage = signal<string | null>(null);
  visibleItems = signal<Set<number>>(new Set());
  private observer!: IntersectionObserver;

  ngAfterViewInit() {
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
        return 'Berufserfahrung';
      case 'education':
        return 'Ausbildung';
      case 'certificate':
        return 'Zertifikat';
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
