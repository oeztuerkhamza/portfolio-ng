import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  scrolled = signal(false);
  mobileMenuOpen = signal(false);

  navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/projects', label: 'Projekte', exact: false },
    { path: '/experience', label: 'Werdegang', exact: false },
    { path: '/lebenslauf', label: 'Lebenslauf', exact: false },
    { path: '/contact', label: 'Kontakt', exact: false },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 50);
  }

  toggleMobile() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobile() {
    this.mobileMenuOpen.set(false);
  }
}
