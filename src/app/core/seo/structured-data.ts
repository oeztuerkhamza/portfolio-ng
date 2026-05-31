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
    jobTitle: 'Full-Stack Webentwickler',
    description:
      'Freiberuflicher Full-Stack Webentwickler aus Freiburg im Breisgau. Spezialisiert auf moderne Websites, Web-Apps und individuelle Software mit Angular, .NET und Azure.',
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
      'https://www.instagram.com/hamza_oeztuerk',
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
    name: 'Hamza Öztürk — Webentwicklung Freiburg',
    image: `${ORIGIN}/assets/images/og-cover.png`,
    url: ORIGIN,
    priceRange: '€€',
    description:
      'Freiberufliche Webentwicklung in Freiburg: neue Websites, Website-Relaunch, Web-Apps, Online-Shops und individuelle Software. Modern, schnell, SEO-optimiert.',
    founder: { '@id': `${ORIGIN}/#person` },
    areaServed: [
      { '@type': 'City', name: 'Freiburg im Breisgau' },
      { '@type': 'AdministrativeArea', name: 'Baden-Württemberg' },
      { '@type': 'Country', name: 'Deutschland' },
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
      latitude: 47.9959,
      longitude: 7.8,
    },
    telephone: '+49 155 66859378',
    email: 'hamza.oeztuerk@web.de',
    sameAs: [
      'https://github.com/oeztuerkhamza',
      'https://www.linkedin.com/in/hamzaoeztuerk/',
      'https://www.instagram.com/hamza_oeztuerk',
    ],
    knowsLanguage: ['de', 'en', 'tr'],
    serviceType: [
      'Webentwicklung',
      'Webdesign',
      'Website Relaunch',
      'Web-App Entwicklung',
      'E-Commerce',
      'SEO',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leistungen',
      itemListElement: [
        offer('Neue Website', 'Moderne, schnelle und SEO-optimierte Website von Grund auf.'),
        offer('Website Relaunch', 'Bestehende Website modernisieren — Design, Tempo und Sichtbarkeit.'),
        offer('Web-App & Software', 'Individuelle Web-Anwendungen und Geschäftssoftware nach Maß.'),
        offer('Online-Shop', 'E-Commerce-Lösungen mit Produktverwaltung und Zahlungsanbindung.'),
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
