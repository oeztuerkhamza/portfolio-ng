import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { fadeAnimation } from './core/animations/route.animations';

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
export class AppComponent {
  getRouteAnimationData() {
    return '';
  }
}
