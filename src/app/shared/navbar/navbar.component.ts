import { Component, HostListener, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService, Lang } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import { CartService } from '../../core/shop/cart.service';
import { LangSwitcherComponent } from '../lang-switcher/lang-switcher.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LangSwitcherComponent, LocalizePipe, IconComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly doc = inject(DOCUMENT);
  readonly i18n = inject(I18nService);
  readonly cart = inject(CartService);
  readonly company = COMPANY;
  readonly whatsapp = whatsappUrl();

  scrolled = signal(false);
  mobileMenuOpen = signal(false);

  /** Desktop: „Kontakt" steckt im Button „Erstgespräch" rechts daneben. */
  readonly navLinks = [
    { path: '/leistungen', key: 'nav.leistungen' },
    { path: '/bewertungskarten', key: 'nav.cards' },
    { path: '/digitale-visitenkarte', key: 'nav.nfc' },
    { path: '/smart-home', key: 'nav.smarthome' },
    { path: '/abo', key: 'nav.abo' },
    { path: '/projects', key: 'nav.references' },
    { path: '/ueber-uns', key: 'nav.about' },
  ];

  readonly drawerLinks = [...this.navLinks, { path: '/contact', key: 'nav.contact' }];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 16);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.mobileMenuOpen()) this.closeMobile();
  }

  toggleMobile() {
    this.mobileMenuOpen.update((v) => !v);
    this.doc.body.style.overflow = this.mobileMenuOpen() ? 'hidden' : '';
  }

  switchLang(lang: Lang) {
    this.closeMobile();
    this.i18n.setLang(lang);
  }

  closeMobile() {
    this.mobileMenuOpen.set(false);
    this.doc.body.style.overflow = '';
  }
}
