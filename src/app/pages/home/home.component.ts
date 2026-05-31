import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  AfterViewInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { SKILL_CATEGORIES, STATS, Stat } from '../../core/data/skills.data';
import { PROJECTS, FEATURED_PROJECTS } from '../../core/data/project.data';
import { fadeIn, staggerFadeIn } from '../../core/animations/shared.animations';
import { LiveDemoComponent } from '../../shared/live-demo/live-demo.component';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgClass, LiveDemoComponent, LocalizePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [fadeIn, staggerFadeIn],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);
  skills = SKILL_CATEGORIES;
  stats = STATS;
  featuredProjects = PROJECTS.slice(0, 3);
  /** Projects shown in the interactive "Live-Demos" showcase. */
  demoProjects = FEATURED_PROJECTS;
  activeDemo = signal(0);

  counterValues = signal<number[]>(STATS.map(() => 0));
  private countersStarted = false;

  private textArray = [
    'Full-Stack Developer',
    'Software Engineer',
    '.NET & Angular Experte',
    'Cloud Architekt',
  ];
  // Render the first phrase server-side so there is meaningful, crawlable text
  // and no layout shift before hydration.
  typedText = signal(this.textArray[0]);
  private textIndex = 0;
  private charIndex = 0;
  private isErasing = false;
  private typingTimer: any;

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  visibleSections = signal<Set<string>>(new Set());
  private observer!: IntersectionObserver;

  ngOnInit() {
    this.seo.update({
      title: this.i18n.t('seo.home.title'),
      description: this.i18n.t('seo.home.desc'),
      path: '/',
      keywords: [
        'Webentwickler Freiburg',
        'Webseite erstellen lassen Freiburg',
        'Webdesign Freiburg',
        'Website Relaunch Freiburg',
        'Freelancer Webentwicklung',
        'Angular .NET Entwickler Freiburg',
      ],
    });
    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([{ name: 'Start', path: '/' }]),
    );

    if (this.isBrowser) {
      this.charIndex = this.textArray[0].length;
      this.startTyping();
    }
  }

  selectDemo(i: number): void {
    this.activeDemo.set(i);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;
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
