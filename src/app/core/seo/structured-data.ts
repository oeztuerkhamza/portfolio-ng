import { TOWNS } from '../data/towns.data';
import { SeoService } from './seo.service';
import { OPENING_HOURS, REVIEW_CARDS_ENABLED, SMART_HOME_ENABLED, WEBSITE_PRICE_FROM } from '../data/company.data';
import { UPDATE_PACKAGES } from '../data/homepage-update.data';
import { MAINTENANCE_PRICE_FROM } from '../data/maintenance.data';

const ORIGIN = SeoService.ORIGIN;

/** Personal identity graph — drives the Google knowledge panel / rich results. */
export function personSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${ORIGIN}/#person`,
    name: 'Hamza Öztürk',
    givenName: 'Hamza',
    familyName: 'Öztürk',
    url: ORIGIN,
    image: `${ORIGIN}/assets/images/profile.jpg`,
    jobTitle: 'Gründer & Full-Stack-Entwickler',
    worksFor: { '@id': `${ORIGIN}/#service` },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Berufsabschluss',
      name: 'Fachinformatiker (IHK)',
      recognizedBy: { '@type': 'Organization', name: 'Industrie- und Handelskammer (IHK)' },
    },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Walther-Rathenau-Gewerbeschule Freiburg' },
      { '@type': 'CollegeOrUniversity', name: 'Technische Universität Istanbul (İTÜ)' },
    ],
    description:
      'Gründer von Breisgau Digital in Freiburg im Breisgau. Entwirft und entwickelt Websites, Online-Shops und Web-Apps für kleine und mittlere Betriebe in Südbaden.',
    knowsAbout: [
      'Webentwicklung',
      'Webdesign',
      'Angular',
      'React',
      'C# / .NET',
      'TypeScript',
      'Azure Cloud',
      'SEO',
      'E-Commerce',
      'Progressive Web Apps',
    ],
    knowsLanguage: ['de', 'en', 'tr'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Freiburg im Breisgau',
      addressRegion: 'Baden-Württemberg',
      addressCountry: 'DE',
    },
    sameAs: [
      'https://github.com/oeztuerkhamza',
      'https://www.linkedin.com/in/hamzaoeztuerk/',
      'https://www.instagram.com/breisgaudigital',
    ],
  };
}

/**
 * Local business graph. This is what makes "Webentwickler Freiburg" /
 * "Webseite erstellen lassen Freiburg" surface in local results.
 */
export function professionalServiceSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${ORIGIN}/#service`,
    name: 'Breisgau Digital',
    legalName: 'Hamza Öztürk — Breisgau Digital',
    alternateName: 'Breisgau Digital — Digitalisierung für den Mittelstand',
    image: `${ORIGIN}/assets/images/og-cover.jpg`,
    url: ORIGIN,
    // Echte Spanne statt „€€": vom kleinsten Homepage-Update bis zur neuen Website.
    priceRange: `${eur(Math.min(...UPDATE_PACKAGES.map((u) => u.price)))}–${eur(Math.max(WEBSITE_PRICE_FROM, ...UPDATE_PACKAGES.map((u) => u.price)))} €`,
    description:
      'Breisgau Digital ist eine IT- und Webagentur in Freiburg: Webdesign, Webentwicklung, Relaunch und SEO, Online-Shops, Buchungssysteme und Web-Apps für kleine und mittlere Betriebe in Freiburg, der Ortenau und Südbaden.',
    founder: { '@id': `${ORIGIN}/#person` },
    logo: `${ORIGIN}/assets/images/logo/breisgau-digital.svg`,
    areaServed: [
      // Freiburg hat keine Ortsseite — die Startseite ist die Freiburg-Seite.
      { '@type': 'City', name: 'Freiburg im Breisgau', url: `${ORIGIN}/de` },
      ...TOWNS.filter((t) => !t.isRegion).map((t) => ({ '@type': 'City', name: t.name, url: `${ORIGIN}/de/webdesign/${t.slug}` })),
      { '@type': 'AdministrativeArea', name: 'Landkreis Breisgau-Hochschwarzwald' },
      { '@type': 'AdministrativeArea', name: 'Ortenaukreis', url: `${ORIGIN}/de/webdesign/ortenau` },
      { '@type': 'AdministrativeArea', name: 'Landkreis Emmendingen' },
      { '@type': 'AdministrativeArea', name: 'Landkreis Lörrach' },
      {
        '@type': 'GeoCircle',
        geoMidpoint: { '@type': 'GeoCoordinates', latitude: 47.999, longitude: 7.842 },
        geoRadius: 70000,
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bissierstr. 16',
      addressLocality: 'Freiburg im Breisgau',
      addressRegion: 'Baden-Württemberg',
      postalCode: '79114',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 47.999,
      longitude: 7.842,
    },
    telephone: '+49 155 66859378',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...OPENING_HOURS.days],
      opens: OPENING_HOURS.opens,
      closes: OPENING_HOURS.closes,
    },
    email: 'info@breisgau-digital.de',
    sameAs: [
      'https://github.com/oeztuerkhamza',
      'https://www.linkedin.com/in/hamzaoeztuerk/',
      'https://www.instagram.com/breisgaudigital',
    ],
    knowsLanguage: ['de', 'en', 'tr'],
    serviceType: [
      'Digitalisierung KMU',
      'Webentwicklung',
      'Website Relaunch',
      'Local SEO',
      'Web-App Entwicklung',
      'E-Commerce',
      ...(REVIEW_CARDS_ENABLED ? ['Google-Bewertungskarten'] : []),
      // Smart Home fehlt hier bewusst: siehe SMART_HOME_ENABLED in company.data.ts.
      ...(SMART_HOME_ENABLED ? ['Smart Home Einrichtung'] : []),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leistungen',
      itemListElement: [
        offer('Neue Website', 'Firmen-Website zum Festpreis: erklärt den Betrieb, funktioniert auf dem Handy und wird bei Google gefunden.', WEBSITE_PRICE_FROM),
        ...UPDATE_PACKAGES.map((u) => offer(`Homepage-Update ${u.id[0].toUpperCase()}${u.id.slice(1)}`, `Überarbeitung einer bestehenden Website, fertig in ${u.days} Werktagen.`, u.price)),
        offer('Lokal gefunden werden', 'Google-Unternehmensprofil, Ortsseiten und Bewertungen für die Suche in der Umgebung.'),
        offer('Abläufe digitalisieren', 'Bestand, Termine, Angebote und Rechnungen in einer Oberfläche, die das Team bedienen kann.'),
        offer('Shop, Buchung & Verleih', 'Online verkaufen, vermieten oder Termine vergeben — inklusive Bezahlung und Verwaltung.'),
        ...(REVIEW_CARDS_ENABLED ? [offer('Google-Bewertungskarten', 'NFC- und QR-Karten, eingerichtet auf das Google-Profil des Betriebs.')] : []),
        /**
         * Ein Offer im Schema ist ein Angebot, auch wenn es auf der Seite
         * nicht mehr steht — Google liest genau das. Es muss mit dem
         * Schalter verschwinden, sonst widerspricht die Maschinenlesung der
         * Website.
         */
        ...(SMART_HOME_ENABLED
          ? [offer('Smart Home & Automatisierung', 'Heizung, Licht und Zutritt für Läden, Praxen, Büros und Ferienwohnungen — funkbasiert und lokal gesteuert.')]
          : []),
        offer('Website-Wartung', 'Hosting, Updates, Backups und kleine Änderungen zum festen Monatspreis, monatlich kündbar.', MAINTENANCE_PRICE_FROM, 'MON'),
      ],
    },
  };
}

const eur = (n: number) => n.toLocaleString('de-DE');

/** Mit Preis wird es ein „ab"-Preis in Euro; mit Einheit (MON) ein Monatspreis. */
function offer(name: string, description: string, from?: number, unit?: 'MON'): Record<string, unknown> {
  return {
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name, description },
    ...(from
      ? {
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            minPrice: from,
            priceCurrency: 'EUR',
            ...(unit ? { unitCode: unit } : {}),
          },
        }
      : {}),
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${ORIGIN}/#website`,
    url: ORIGIN,
    name: SeoService.SITE_NAME,
    inLanguage: ['de', 'en', 'tr'],
    publisher: { '@id': `${ORIGIN}/#person` },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${ORIGIN}${item.path}`,
    })),
  };
}

export function projectSchema(p: {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${ORIGIN}/projects/${p.slug}#project`,
    name: p.title,
    description: p.description,
    url: `${ORIGIN}/projects/${p.slug}`,
    image: p.image.startsWith('http') ? p.image : `${ORIGIN}/${p.image}`,
    keywords: p.tags.join(', '),
    creator: { '@id': `${ORIGIN}/#person` },
    ...(p.liveUrl ? { sameAs: p.liveUrl } : {}),
  };
}
