import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
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
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="noise-overlay"></div>
    <app-navbar />
    <main class="page-wrapper" [@routeAnimations]="getRouteAnimationData()">
      <router-outlet #outlet="outlet" />
    </main>
    <app-footer />
  `,
  styles: [],
  animations: [fadeAnimation],
})
export class AppComponent implements OnInit {
  private readonly seo = inject(SeoService);

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
