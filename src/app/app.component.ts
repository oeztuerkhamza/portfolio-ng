import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MobileBarComponent } from './shared/mobile-bar/mobile-bar.component';
import { fadeAnimation } from './core/animations/route.animations';
import { SeoService } from './core/seo/seo.service';
import {
  personSchema,
  professionalServiceSchema,
  websiteSchema,
} from './core/seo/structured-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MobileBarComponent],
  template: `
    @if (bare()) {
      <router-outlet />
    } @else {
      <app-navbar />
      <main class="page-wrapper" [@routeAnimations]="getRouteAnimationData()">
        <router-outlet #outlet="outlet" />
      </main>
      <app-footer />
      <app-mobile-bar />
    }
  `,
  styles: [],
  animations: [fadeAnimation],
})
export class AppComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);

  /** Admin-Portal ohne Navigation, Footer und Handy-Leiste. */
  readonly bare = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/admin')),
    ),
    { initialValue: false },
  );

  ngOnInit(): void {
    // Site-wide identity graph — rendered once into <head> on the server.
    this.seo.setJsonLd('person', personSchema());
    this.seo.setJsonLd('service', professionalServiceSchema());
    this.seo.setJsonLd('website', websiteSchema());
  }

  getRouteAnimationData() {
    return '';
  }
}
