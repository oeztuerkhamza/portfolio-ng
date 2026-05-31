import { Component, HostListener, signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { I18nService } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { LangSwitcherComponent } from '../lang-switcher/lang-switcher.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, LangSwitcherComponent, LocalizePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly i18n = inject(I18nService);
  scrolled = signal(false);
  mobileMenuOpen = signal(false);

  navLinks = [
    { num: '01', path: '/', key: 'nav.home', exact: true },
    { num: '02', path: '/leistungen', key: 'nav.leistungen', exact: false },
    { num: '03', path: '/projects', key: 'nav.projects', exact: false },
    { num: '04', path: '/experience', key: 'nav.experience', exact: false },
    { num: '05', path: '/lebenslauf', key: 'nav.resume', exact: false },
    { num: '06', path: '/contact', key: 'nav.contact', exact: false },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
  }

  toggleMobile() {
    this.mobileMenuOpen.update((v) => !v);
    document.body.style.overflow = this.mobileMenuOpen() ? 'hidden' : '';
  }

  closeMobile() {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }
}
