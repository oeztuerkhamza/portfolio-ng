import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  AfterViewInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { SKILL_CATEGORIES, STATS, Stat } from '../../core/data/skills.data';
import { PROJECTS } from '../../core/data/project.data';
import { fadeIn, staggerFadeIn } from '../../core/animations/shared.animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [fadeIn, staggerFadeIn],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  skills = SKILL_CATEGORIES;
  stats = STATS;
  featuredProjects = PROJECTS.slice(0, 3);

  counterValues = signal<number[]>(STATS.map(() => 0));
  private countersStarted = false;

  typedText = signal('');
  private textArray = [
    'Full-Stack Developer',
    'Software Engineer',
    '.NET & Angular Experte',
    'Cloud Architekt',
  ];
  private textIndex = 0;
  private charIndex = 0;
  private isErasing = false;
  private typingTimer: any;

  visibleSections = signal<Set<string>>(new Set());
  private observer!: IntersectionObserver;

  ngOnInit() {
    this.startTyping();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.visibleSections.update((set) => {
              const newSet = new Set(set);
              newSet.add(entry.target.id);
              return newSet;
            });
            if (entry.target.id === 'stats-section' && !this.countersStarted) {
              this.countersStarted = true;
              this.animateCounters();
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      this.observer.observe(el);
    });
  }

  ngOnDestroy() {
    clearTimeout(this.typingTimer);
    this.observer?.disconnect();
  }

  isVisible(id: string): boolean {
    return this.visibleSections().has(id);
  }

  private animateCounters() {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);

      this.counterValues.set(
        this.stats.map((stat) => Math.round(eased * stat.target)),
      );

      if (step >= steps) {
        clearInterval(timer);
        this.counterValues.set(this.stats.map((stat) => stat.target));
      }
    }, interval);
  }

  private startTyping() {
    if (!this.isErasing) {
      if (this.charIndex < this.textArray[this.textIndex].length) {
        this.typedText.set(
          this.textArray[this.textIndex].substring(0, this.charIndex + 1),
        );
        this.charIndex++;
        this.typingTimer = setTimeout(() => this.startTyping(), 80);
      } else {
        this.isErasing = true;
        this.typingTimer = setTimeout(() => this.startTyping(), 2000);
      }
    } else {
      if (this.charIndex > 0) {
        this.typedText.set(
          this.textArray[this.textIndex].substring(0, this.charIndex - 1),
        );
        this.charIndex--;
        this.typingTimer = setTimeout(() => this.startTyping(), 40);
      } else {
        this.isErasing = false;
        this.textIndex = (this.textIndex + 1) % this.textArray.length;
        this.typingTimer = setTimeout(() => this.startTyping(), 500);
      }
    }
  }
}
