import { Component, OnInit, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';
import { breadcrumbSchema } from '../../core/seo/structured-data';
import { I18nService, Lang } from '../../core/i18n/i18n.service';
import { LocalizePipe } from '../../core/i18n/localize.pipe';
import { COMPANY, whatsappUrl } from '../../core/data/company.data';
import { INVITATION_PACKAGES, INVITATION_PRICE_FROM, InvitationPackage } from '../../core/data/invitation.data';
import { IconComponent } from '../../shared/icon/icon.component';
import { INVITE_THEMES, InviteTheme } from '../../einladung/invite-themes';
import { demoEvent, demoSlug } from '../../einladung/invite-demo';
import { GUEST_TEXT, formatDate, tx } from '../../einladung/invite-i18n';
import { ensureInviteFonts } from '../../einladung/invite-links';
import { EINLADUNG_CONTENT } from './einladung.content';
import { registerInviteIcons } from '../../einladung/invite-icons';

registerInviteIcons();

/**
 * Produktseite /digitale-einladung — die Einladungs-Websites als Leistung.
 *
 * Zeigt die zehn Gestaltungen mit Link auf das lebende Beispiel, die
 * Funktionen, Anlässe, drei Pakete und häufige Fragen. Die Suchbegriffe sind
 * die, unter denen Brautpaare suchen („digitale Einladung", „Hochzeitswebsite",
 * „Online Einladung Hochzeit", „dijital davetiye"); dazu Service-, Angebots- und
 * FAQ-Schema für Suchmaschinen und KI-Assistenten.
 */
@Component({
  selector: 'app-einladung',
  standalone: true,
  imports: [RouterLink, LocalizePipe, IconComponent],
  templateUrl: './einladung.component.html',
  styleUrl: './einladung.component.scss',
})
export class EinladungComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly meta = inject(Meta);
  readonly i18n = inject(I18nService);
  readonly company = COMPANY;

  readonly packages = INVITATION_PACKAGES;
  readonly priceFrom = INVITATION_PRICE_FROM;
  readonly themes = INVITE_THEMES.map((t) => ({ theme: t, event: demoEvent(t.id), slug: demoSlug(t.id) }));
  readonly features = [
    { id: 'rsvp', icon: 'check' },
    { id: 'guests', icon: 'users' },
    { id: 'seating', icon: 'layers' },
    { id: 'countdown', icon: 'calendar' },
    { id: 'route', icon: 'route' },
    { id: 'gift', icon: 'gift' },
    { id: 'photos', icon: 'camera' },
    { id: 'music', icon: 'music' },
    { id: 'lang', icon: 'globe' },
    { id: 'theme', icon: 'palette' },
    { id: 'plan', icon: 'list' },
    { id: 'privacy', icon: 'shield' },
  ];
  readonly occasions = [1, 2, 3, 4, 5, 6, 7];
  readonly steps = [1, 2, 3, 4];
  readonly faqs = [1, 2, 3, 4, 5, 6];

  constructor() {
    this.i18n.register(EINLADUNG_CONTENT);
    ensureInviteFonts(inject(DOCUMENT));
  }

  get whatsapp(): string {
    return whatsappUrl(this.i18n.t('inv.wa.text'));
  }

  points(p: InvitationPackage): number[] {
    return Array.from({ length: p.points }, (_, i) => i + 1);
  }

  themeName(t: InviteTheme): string {
    return t.name[this.i18n.lang() as Lang];
  }

  themeMood(t: InviteTheme): string {
    return t.mood[this.i18n.lang() as Lang];
  }

  kindLabel(kind: string): string {
    return tx(GUEST_TEXT, `kind.${kind}`, this.i18n.lang());
  }

  demoDate(iso: string): string {
    return formatDate(iso, this.i18n.lang(), false);
  }

  hideImage(ev: Event): void {
    (ev.target as HTMLElement).remove();
  }

  ngOnInit(): void {
    this.seo.update({
      title: this.i18n.tp('seo.inv.title', this.priceFrom),
      description: this.i18n.t('seo.inv.desc'),
      path: '/digitale-einladung',
      image: INVITE_THEMES[0].image,
      keywords: [
        'digitale Einladung',
        'Hochzeitseinladung online',
        'Hochzeitswebsite erstellen',
        'Online Einladung Hochzeit',
        'Einladung mit Zusage',
        'Kına Einladung',
        'Henna Abend Einladung',
        'dijital davetiye',
        'online düğün davetiyesi',
        'Firmenevent Einladung online',
        'Hochzeit Freiburg',
      ],
    });

    // Ort für Suchmaschinen, die ihn auswerten (Bing, regionale Verzeichnisse).
    this.meta.updateTag({ name: 'geo.region', content: 'DE-BW' });
    this.meta.updateTag({ name: 'geo.placename', content: 'Freiburg im Breisgau' });
    this.meta.updateTag({ name: 'geo.position', content: '47.999;7.842' });
    this.meta.updateTag({ name: 'ICBM', content: '47.999, 7.842' });

    this.seo.setJsonLd(
      'breadcrumb',
      breadcrumbSchema([
        { name: 'Start', path: '/' },
        { name: 'Digitale Einladung', path: '/digitale-einladung' },
      ]),
    );

    // Schemas deutsch, wie auf allen anderen Seiten.
    const de = (k: string) => EINLADUNG_CONTENT[k].de;
    this.seo.setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${SeoService.ORIGIN}/de/digitale-einladung#service`,
      name: 'Digitale Einladung & Hochzeitswebsite',
      alternateName: ['Online-Einladung', 'Hochzeitswebsite', 'Dijital davetiye', 'Kına davetiyesi', 'Digital wedding invitation'],
      serviceType: 'Digitale Einladung mit Online-Zusage',
      description: de('seo.inv.desc'),
      provider: { '@id': `${SeoService.ORIGIN}/#service` },
      areaServed: [
        { '@type': 'City', name: 'Freiburg im Breisgau' },
        { '@type': 'Country', name: 'Deutschland' },
        { '@type': 'Country', name: 'Österreich' },
        { '@type': 'Country', name: 'Schweiz' },
        { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: 47.999, longitude: 7.842 }, geoRadius: 100000 },
      ],
      availableLanguage: ['de', 'tr', 'en', 'fr', 'ku', 'ar'],
      audience: { '@type': 'Audience', audienceType: 'Brautpaare, Familien, Unternehmen' },
      image: INVITE_THEMES.map((t) => t.image),
      offers: this.packages.map((p) => ({
        '@type': 'Offer',
        name: `Digitale Einladung ${de(`inv.pkg.${p.id}.name`)}`,
        description: de(`inv.pkg.${p.id}.for`),
        price: p.price.toFixed(2),
        priceCurrency: 'EUR',
        url: `${SeoService.ORIGIN}/de/digitale-einladung#pakete`,
        availability: 'https://schema.org/InStock',
      })),
    });

    this.seo.setJsonLd('faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map((n) => ({
        '@type': 'Question',
        name: de(`inv.faq${n}.q`),
        acceptedAnswer: { '@type': 'Answer', text: de(`inv.faq${n}.a`) },
      })),
    });
  }
}
