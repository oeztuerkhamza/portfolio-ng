import { TOWNS } from '../data/towns.data';
import { SeoService } from './seo.service';

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
    description:
      'Gründer von Breisgau Digital in Freiburg im Breisgau. Digitalisiert kleine und mittlere Betriebe: Google-Bewertungskarten, Websites und Smart Home.',
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
      'https://www.instagram.com/breisgau_digital',
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
    priceRange: '€€',
    description:
      'Breisgau Digital digitalisiert kleine und mittlere Betriebe in Freiburg und Baden-Württemberg: NFC-Bewertungskarten für mehr Google-Bewertungen, Websites und Relaunch, Smart Home und Automatisierung, digitale Abläufe sowie Shop und Buchung.',
    founder: { '@id': `${ORIGIN}/#person` },
    logo: `${ORIGIN}/assets/images/logo/breisgau-digital.svg`,
    areaServed: [
      ...TOWNS.map((t) => ({ '@type': 'City', name: t.name, url: `${ORIGIN}/de/webdesign/${t.slug}` })),
      { '@type': 'AdministrativeArea', name: 'Landkreis Breisgau-Hochschwarzwald' },
      { '@type': 'AdministrativeArea', name: 'Landkreis Emmendingen' },
      { '@type': 'AdministrativeArea', name: 'Landkreis Lörrach' },
      { '@type': 'AdministrativeArea', name: 'Ortenaukreis' },
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
    email: 'info@breisgau-digital.de',
    sameAs: [
      'https://github.com/oeztuerkhamza',
      'https://www.linkedin.com/in/hamzaoeztuerk/',
      'https://www.instagram.com/breisgau_digital',
    ],
    knowsLanguage: ['de', 'en', 'tr'],
    serviceType: [
      'Digitalisierung KMU',
      'Webentwicklung',
      'Website Relaunch',
      'Local SEO',
      'Web-App Entwicklung',
      'E-Commerce',
      'Google-Bewertungskarten',
      'Smart Home Einrichtung',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leistungen',
      itemListElement: [
        offer('Website & Relaunch', 'Website, die den Betrieb erklärt, auf dem Handy funktioniert und bei Google gefunden wird.'),
        offer('Lokal gefunden werden', 'Google-Unternehmensprofil, Ortsseiten und Bewertungen für die Suche in der Umgebung.'),
        offer('Abläufe digitalisieren', 'Bestand, Termine, Angebote und Rechnungen in einer Oberfläche, die das Team bedienen kann.'),
        offer('Shop, Buchung & Verleih', 'Online verkaufen, vermieten oder Termine vergeben — inklusive Bezahlung und Verwaltung.'),
        offer('Google-Bewertungskarten', 'NFC- und QR-Karten, eingerichtet auf das Google-Profil des Betriebs.'),
        offer('Smart Home & Automatisierung', 'Heizung, Licht und Zutritt für Läden, Praxen, Büros und Ferienwohnungen — funkbasiert und lokal gesteuert.'),
        offer('Digital-Abo', 'Bewertungskarten, Website und laufende Pflege zum festen Monatspreis.'),
      ],
    },
  };
}

function offer(name: string, description: string): Record<string, unknown> {
  return {
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name, description },
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
