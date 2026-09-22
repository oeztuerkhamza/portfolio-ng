export type DemoType = 'iframe' | 'video' | 'image' | 'mobile';

export interface ProjectDemo {
  /** How the live demo renders inside the browser/phone frame. */
  type: DemoType;
  /** iframe source — normally the live URL. */
  url?: string;
  /** Screencast (mp4/webm) shown for `video` or as iframe fallback. */
  videoUrl?: string;
  /** Still shown before load / when iframe is blocked by X-Frame-Options. */
  poster?: string;
  /** Gallery (and phone screens for `mobile`). */
  screens?: string[];
  /** Small caption, e.g. "Live-System mit echten Daten". */
  note?: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  description: string;
  longDescription: string;
  features: string[];
  techStack: { name: string; icon: string }[];
  screenshots: string[];
  role: string;
  duration: string;
  /** Surface in the home "Live-Demos" showcase. */
  featured?: boolean;
  /** Drives the interactive browser/phone-frame demo. */
  demo?: ProjectDemo;
}

export const PROJECTS: Project[] = [
  {
    slug: 'bikehaus-freiburg',
    title: 'Bikehaus Freiburg',
    subtitle: 'Digitale Warenwirtschaft für ein Fahrradgeschäft',
    category: 'Full-Stack Web-App',
    tags: ['Full-Stack', 'Angular 19', '.NET 10', 'E-Commerce'],
    image: '/assets/images/bikehaus.png',
    liveUrl: 'https://bikehausfreiburg.com',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Digitale Warenwirtschaft für ein Fahrradgeschäft. C#/.NET-API, Angular 19 Admin-Client und Chrome Extension.',
    longDescription: `Bikehaus Freiburg ist ein umfassendes digitales Warenwirtschaftssystem, das speziell für ein lokales Fahrradgeschäft entwickelt wurde. Das System vereint eine moderne Web-Oberfläche, eine Desktop-Anwendung und eine Chrome-Erweiterung, um den gesamten Geschäftsprozess zu digitalisieren – von der Bestandsverwaltung über den Verkauf bis hin zur Kundenkommunikation.

Das Backend basiert auf .NET 10 mit Clean Architecture und bietet RESTful APIs mit JWT-Authentifizierung. Das Frontend nutzt Angular 19 mit Server-Side Rendering für optimale Performance und SEO.`,
    features: [
      'Vollständige Bestandsverwaltung mit Echtzeit-Tracking',
      'Angular 19 Admin-Dashboard mit responsivem Design',
      'Chrome Extension für schnelle Preisvergleiche',
      'JWT-basierte Authentifizierung & Autorisierung',
      'Mehrsprachig (DE, EN, FR, TR)',
      'Automatisierte CI/CD-Pipeline via Azure DevOps',
      'PDF-Generierung für Rechnungen und Angebote',
    ],
    techStack: [
      { name: 'Angular 19', icon: '🅰️' },
      { name: '.NET 10', icon: '🔷' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Azure', icon: '☁️' },
      { name: 'Docker', icon: '🐳' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'SCSS', icon: '🎨' },
    ],
    screenshots: ['/assets/images/bikehaus.png'],
    role: 'Full-Stack Developer & Architekt',
    duration: '2026/3 – Heute',
    featured: true,
    demo: {
      type: 'iframe',
      url: 'https://bikehausfreiburg.com',
      poster: '/assets/images/bikehaus.png',
      note: 'Live-System — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'benlirad',
    title: 'Benlirad',
    subtitle: 'Fahrrad-Plattform mit Showroom, Verleih & Service',
    category: 'Full-Stack Web-App',
    tags: ['Full-Stack', 'Angular 19', '.NET 10', 'i18n'],
    image: '/assets/images/benlirad.png',
    liveUrl: 'https://benlirad.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Moderne Fahrrad-Plattform für Verkauf, Verleih und Reparatur-Service in Lahr/Schwarzwald. Mehrsprachig mit Showroom und Kundenbewertungen.',
    longDescription: `Benlirad ist eine umfassende Web-Plattform für ein Fahrradgeschäft in Lahr/Schwarzwald. Die Anwendung vereint einen Showroom für neue und gebrauchte Fahrräder, ein Verleihsystem, einen Reparatur-Service und ein vollständiges CMS – alles in einer modernen, responsiven Oberfläche.

Die Plattform unterstützt vier Sprachen (Deutsch, Englisch, Französisch, Türkisch) und integriert externe APIs für automatisierte Produktlistings. Das Backend basiert auf .NET 10 mit Clean Architecture, das Frontend auf Angular 19 mit SSR für optimale SEO und Performance.`,
    features: [
      'Showroom mit Produktkatalog und Filterfunktionen',
      'Viersprachig: Deutsch, Englisch, Französisch, Türkisch',
      'Fahrradverleih-System mit Online-Buchung',
      'Reparatur- & Service-Terminbuchung',
      'Integration mit Kleinanzeigen-API für automatisierte Listings',
      'Kundenbewertungen und Testimonials',
      'Galerie mit Laden-Impressionen',
      'SEO-optimiert mit Server-Side Rendering',
    ],
    techStack: [
      { name: 'Angular 19', icon: '🅰️' },
      { name: '.NET 10', icon: '🔷' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'SCSS', icon: '🎨' },
      { name: 'Docker', icon: '🐳' },
      { name: 'Azure', icon: '☁️' },
      { name: 'i18n', icon: '🌍' },
    ],
    screenshots: ['/assets/images/benlirad.png'],
    role: 'Full-Stack Developer & Architekt',
    duration: '2025 – Heute',
    featured: true,
    demo: {
      type: 'iframe',
      url: 'https://benlirad.de',
      poster: '/assets/images/benlirad.png',
      note: 'Live-System — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'di-flux',
    title: 'Di-Flux',
    subtitle: 'Intelligentes Zeiterfassungssystem für Unternehmen',
    category: 'Enterprise Software',
    tags: ['Full-Stack', 'Angular 19', '.NET', 'Enterprise'],
    image: '/assets/images/diflux-1.png',
    githubUrl: 'https://github.com/oeztuerkhamza/di-flux-web',
    description:
      'Intelligentes Zeiterfassungssystem mit automatischer Pausenberechnung, Arbeitszeitgesetz-Compliance und Mitarbeiterverwaltung. Entwickelt bei Dicom GmbH.',
    longDescription: `Di-Flux ist ein Enterprise-Zeiterfassungssystem, das bei Dicom GmbH entwickelt wurde. Es digitalisiert die komplette Arbeitszeiterfassung, von der Stempeluhr bis zum Überstunden-Reporting – und sorgt automatisch für die Einhaltung des deutschen Arbeitszeitgesetzes (ArbZG).

Das System erkennt automatisch gesetzlich vorgeschriebene Pausen, validiert maximale Arbeitszeiten und unterstützt altersabhängige Arbeitsschutzregelungen. Das Angular-19-Frontend bietet ein intuitives Dashboard mit Kalender, Urlaubs- und Abwesenheitsverwaltung und Echtzeit-Benachrichtigungen. Das .NET-Backend folgt Clean Architecture mit vollständiger Unit-Test-Abdeckung.`,
    features: [
      'Automatische Pausenberechnung nach ArbZG',
      'Altersabhängige Arbeitsschutz-Compliance (JArbSchG)',
      'Urlaubs- und Abwesenheitsverwaltung mit Kalender',
      'Überstunden-Tracking und Statistiken',
      'Bulk-Operationen für Masseneinträge',
      'Mitarbeiter- und Rollenverwaltung',
      'JWT-basierte Authentifizierung mit Interceptor',
      'Echtzeit-Benachrichtigungssystem',
    ],
    techStack: [
      { name: 'Angular 19', icon: '🅰️' },
      { name: 'C# / .NET', icon: '🔷' },
      { name: 'SQL Server', icon: '🗄️' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'Tailwind', icon: '💨' },
      { name: 'Entity Framework', icon: '📦' },
      { name: 'xUnit', icon: '🧪' },
      { name: 'Docker', icon: '🐳' },
    ],
    screenshots: ['/assets/images/diflux-1.png'],
    role: 'Full-Stack Developer',
    duration: '2025 – 2026',
    featured: true,
    demo: {
      type: 'image',
      screens: ['/assets/images/diflux-1.png'],
      note: 'Internes Enterprise-System — Screenshot der Live-Anwendung',
    },
  },
  {
    slug: 'gkn-portraits',
    title: 'GKN Portraits',
    subtitle: 'Bewerbungsfoto-Studio in Freiburg mit Online-Terminbuchung',
    category: 'Website & Buchungssystem',
    tags: ['Next.js 16', 'React 19', 'Buchungssystem', '15 Sprachen', 'Local SEO'],
    image: '/assets/images/gkn-portraits.png',
    liveUrl: 'https://gknportraits.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Website und Terminbuchung für ein Bewerbungsfoto-Studio in Freiburg. Next.js 16, 15 Sprachen, Buchung in drei Schritten — mit einem Studiokalender, den sich zwei Marken teilen.',
    longDescription: `GKN Portraits ist die Website eines Fotostudios in Freiburg, das auf Bewerbungs- und Businessporträts spezialisiert ist. Der Kern ist keine Imageseite, sondern eine Buchung: Paket wählen, freien Termin im Kalender anklicken, Kontaktdaten eintragen — drei Schritte, Bestätigung per E-Mail, Stornolink inklusive. Damit fällt das Telefonieren über freie Termine weg, das bei kurzen Shootings den größten Teil des Aufwands ausmacht.

Technisch läuft die Seite auf Next.js 16 mit React 19 und Tailwind 4. Fünfzehn Sprachen mit übersetzten URLs decken ab, wer in Freiburg ein Bewerbungsfoto braucht — inklusive Rechts-nach-Links-Layout für Arabisch. Preise gibt es in zwei Listen (privat und geschäftlich), weil sich nicht der Aufwand unterscheidet, sondern die Nutzung des Bildes.

Die Besonderheit liegt hinter den Kulissen: Das Studio betreibt zwei Marken — Porträt und Hochzeit — aber es gibt nur einen Raum und einen Terminplan. Beide Websites buchen deshalb in denselben Kalender, und jede Buchung merkt sich, über welche Marke sie hereinkam. Ein Datenbank-Index stellt sicher, dass derselbe Slot nie zweimal bestätigt wird. Verwaltet wird alles über einen gemeinsamen Bereich mit passwortlosem Login per Einmal-Link.`,
    features: [
      'Online-Terminbuchung in drei Schritten mit Bestätigungsmail und Stornolink',
      'Ein gemeinsamer Studiokalender für zwei Marken — doppelte Buchung technisch ausgeschlossen',
      '15 Sprachen mit übersetzten URLs, inkl. RTL-Layout für Arabisch',
      'Zwei Preislisten (privat / geschäftlich) mit drei Paketen',
      'Lokale Landingpages für die Städte rund um Freiburg',
      'Ratgeber-Bereich zu Kleidung, Ablauf und Bildauswahl',
      'Passwortloses Login für den Verwaltungsbereich (Einmal-Link, JWT-Cookie)',
      'Rund 285 indexierbare URLs mit hreflang, JSON-LD und eigener Sitemap',
    ],
    techStack: [
      { name: 'Next.js 16', icon: '▲' },
      { name: 'React 19', icon: '⚛️' },
      { name: 'Tailwind 4', icon: '💨' },
      { name: 'next-intl', icon: '🌍' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Drizzle ORM', icon: '🌧️' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'Docker', icon: '🐳' },
    ],
    screenshots: [
      '/assets/images/gkn-portraits.png',
      '/assets/images/gkn-portraits-2.png',
      '/assets/images/gkn-portraits-3.png',
    ],
    role: 'Full-Stack Developer & Designer',
    duration: '2026 – Heute',
    featured: true,
    demo: {
      type: 'iframe',
      url: 'https://gknportraits.de',
      poster: '/assets/images/gkn-portraits.png',
      note: 'Live-System — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'dj-veys',
    title: 'DJ Veys',
    subtitle: 'Website und Anfragesystem für einen Hochzeits-DJ',
    category: 'Website & CMS',
    tags: ['Next.js 16', 'Payload CMS', '8 Sprachen', 'SEO', 'Self-Hosting'],
    image: '/assets/images/dj-veys.png',
    liveUrl: 'https://dj-veys.de',
    githubUrl: 'https://github.com/oeztuerkhamza/veysl-music',
    description:
      'Website für einen Hochzeits-DJ aus Stuttgart: Next.js 16 mit Payload CMS, acht Sprachen, rund 270 Seiten für die lokale Suche — selbst gehostet auf einem eigenen Server.',
    longDescription: `DJ Veys ist ein Hochzeits-DJ aus Stuttgart, der auf Deutsch, Türkisch und Englisch durch den Abend führt und live an Saz und Gitarre spielt. Die Website löst die alte Domain ab und ist darauf gebaut, in einem Markt gefunden zu werden, in dem die Konkurrenz seit Jahren Anzeigen schaltet: rund 270 Seiten, acht Sprachen mit übersetzten URLs, eigene Seiten für die Städte in Baden-Württemberg sowie für türkische und islamische Hochzeiten.

Inhaltlich pflegt der Kunde alles selbst. Payload CMS läuft im selben Next.js-Prozess unter /admin und verwaltet Galerie, echte Hochzeiten, Bewertungen, Ratgeber-Artikel und die Bildplätze der Website. Anfragen, WhatsApp-Kontakte und Terminwünsche laufen in dieselbe Oberfläche, sodass keine Anfrage in einem Postfach verloren geht. Ein Waveform-Player macht Mixe direkt auf der Seite hörbar.

Betrieben wird das Ganze auf einem eigenen Server: Docker Compose mit nginx und automatisch erneuertem Zertifikat, SQLite auf einem persistenten Volume, Deployment über GitHub Actions — dazu eine strenge Content-Security-Policy und ein eigener Mailversand. Preise stehen bewusst auf Anfrage, und Bewertungszahlen werden erst ausgespielt, wenn sie belegt sind.`,
    features: [
      'Acht Sprachen (DE, TR, KU, AR, EN, NL, FR, ES) mit pro Sprache übersetzten URLs',
      'Rund 270 Seiten: Städte in Baden-Württemberg, Europa-Seiten, Themenseiten',
      'Payload CMS unter /admin — Galerie, Referenzen, Bewertungen und Blog selbst pflegbar',
      'Anfrage- und Verfügbarkeitsstrecke mit Kalender und WhatsApp-Abkürzung',
      'Waveform-Player für Mixe (wavesurfer.js)',
      'EPK-Seite für Presse und Veranstalter, private Foto-Übergabe per Link',
      'Self-Hosting: Docker Compose, nginx, automatische TLS-Erneuerung, Deploy per GitHub Actions',
      'Strikte Content-Security-Policy und eigener Mailversand',
    ],
    techStack: [
      { name: 'Next.js 16', icon: '▲' },
      { name: 'React 19', icon: '⚛️' },
      { name: 'Payload CMS', icon: '📦' },
      { name: 'Tailwind 4', icon: '💨' },
      { name: 'SQLite', icon: '🗃️' },
      { name: 'next-intl', icon: '🌍' },
      { name: 'Docker', icon: '🐳' },
      { name: 'nginx', icon: '🔀' },
    ],
    screenshots: [
      '/assets/images/dj-veys.png',
      '/assets/images/dj-veys-2.png',
      '/assets/images/dj-veys-3.png',
    ],
    role: 'Full-Stack Developer & Designer',
    duration: '2026',
    featured: true,
    demo: {
      type: 'image',
      screens: [
        '/assets/images/dj-veys.png',
        '/assets/images/dj-veys-2.png',
        '/assets/images/dj-veys-3.png',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
  {
    slug: 'zerin-gold',
    title: 'Zerin Gold',
    subtitle: 'Premium-Website für Goldhändler & Juwelier in Freiburg',
    category: 'Premium Website',
    tags: ['Next.js 16', 'React 19', 'Tailwind 4', 'i18n', 'E-Commerce'],
    image: '/assets/images/zerin-gold.svg',
    liveUrl: 'https://zerin-gold.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Award-grade Premium-Website für einen Goldhändler in Freiburg. Next.js 16, mehrsprachig (7 Sprachen inkl. RTL-Arabisch), white-label aufgebaut.',
    longDescription: `Zerin Gold ist eine Premium-Website für einen Goldhändler, Juwelier und Schmuck-Atelier in Freiburg im Breisgau. Das Projekt setzt auf ein „award-grade" Design mit feinster Typografie, sanften Scroll-Animationen und einer eleganten Schwarz-Gold-Ästhetik, die das Vertrauen und die Wertigkeit der Marke transportiert.

Technisch basiert die Seite auf Next.js 16 mit React 19 und Tailwind 4. Sie ist vollständig mehrsprachig (7 Sprachen, inklusive Rechts-nach-Links-Layout für Arabisch) und white-label aufgebaut, sodass sie als wiederverwendbare Vorlage für weitere Händler dient. Authentifizierung mit NextAuth, Datenhaltung über Prisma/PostgreSQL, transaktionale E-Mails über Resend und ein Live-Goldpreis-Bereich runden das System ab.`,
    features: [
      'Award-grade Premium-Design (Schwarz-Gold-Ästhetik)',
      '7 Sprachen inkl. RTL-Layout für Arabisch',
      'White-Label-Architektur für Wiederverwendung',
      'Next.js 16 mit React Server Components',
      'NextAuth-Authentifizierung & Prisma/PostgreSQL',
      'Sanfte Scroll-Animationen mit Framer Motion & Lenis',
      'Kontaktformulare mit Spam-Schutz (hCaptcha)',
      'Voll SEO-optimiert & blitzschnell',
    ],
    techStack: [
      { name: 'Next.js 16', icon: '▲' },
      { name: 'React 19', icon: '⚛️' },
      { name: 'Tailwind 4', icon: '💨' },
      { name: 'Prisma', icon: '🔺' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'NextAuth', icon: '🔐' },
      { name: 'Framer Motion', icon: '🎞️' },
      { name: 'TypeScript', icon: '📘' },
    ],
    screenshots: ['/assets/images/zerin-gold.svg'],
    role: 'Solo Developer & Designer',
    duration: '2025',
    featured: true,
    demo: {
      type: 'iframe',
      url: 'https://zerin-gold.de',
      poster: '/assets/images/zerin-gold.svg',
      note: 'Live-System — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'hotel-bergfrieden',
    title: 'Hotel Bergfrieden',
    subtitle: 'Webseite für ein Hotel im Schwarzwald (Löffingen)',
    category: 'Website',
    tags: ['Angular 21', 'SSG', 'Tailwind', 'SEO'],
    image: '/assets/images/hbf-hotel.svg',
    liveUrl: 'https://oeztuerkhamza.github.io/bergfrieden-hotel/',
    githubUrl: 'https://github.com/oeztuerkhamza/bergfrieden-hotel',
    description:
      'Moderne, statisch gerenderte Webseite für das Hotel Bergfrieden in Löffingen. Angular 21 mit Prerendering, vollständig SEO-optimiert.',
    longDescription: `Eine moderne, warm-luxuriöse Webseite für das Hotel Bergfrieden im Schwarzwald (Löffingen). Das Design ist inspiriert von einer „luxuriös, aber warm"-Ästhetik mit einer Black-Forest-Palette aus Forest-Grün, Cream und Bronze sowie klassischer Cormorant-Garamond-Typografie.

Technisch ist die Seite mit Angular 21 (Standalone Components & Signals) umgesetzt und wird vollständig statisch gerendert (Static Site Generation) – alle Routen werden zu HTML vorgerendert und ohne Server-Runtime auf GitHub Pages gehostet. Pro-Route Meta-Tags, Hotel-Schema.org JSON-LD, sitemap.xml und OG/Twitter-Cards sorgen für maximale Sichtbarkeit in Suchmaschinen.`,
    features: [
      'Warm-luxuriöses Design mit Black-Forest-Palette',
      'Static Site Generation — blitzschnell, kein Server nötig',
      'Pro-Route SEO mit Hotel-Schema.org JSON-LD',
      'sitemap.xml, robots.txt, OG/Twitter-Cards',
      'Zimmer-, Angebots- und Galerie-Seiten',
      'Automatisches Deployment via GitHub Actions',
      'Responsives Design für alle Geräte',
    ],
    techStack: [
      { name: 'Angular 21', icon: '🅰️' },
      { name: 'Tailwind', icon: '💨' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'SSG / Prerender', icon: '⚡' },
      { name: 'GitHub Actions', icon: '🔄' },
      { name: 'Schema.org', icon: '🔍' },
    ],
    screenshots: ['/assets/images/hbf-hotel.svg'],
    role: 'Full-Stack Developer & Designer',
    duration: '2025',
    featured: true,
    demo: {
      type: 'iframe',
      url: 'https://oeztuerkhamza.github.io/bergfrieden-hotel/',
      poster: '/assets/images/hbf-hotel.svg',
      note: 'Live-System — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'kulturplattform-freiburg',
    title: 'Kulturplattform Freiburg',
    subtitle: 'Vereinswebsite mit CMS und Newsletter',
    category: 'Web-App / CMS',
    tags: ['Web-App', 'React 19', '.NET 10', 'CMS'],
    image: '/assets/images/kulturplattform.png',
    liveUrl: 'https://kulturplattformfreiburg.org',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Vereinswebsite mit Admin-Panel, Newsletter und Zweisprachigkeit. Entwickelt mit .NET 10 Clean Architecture und React 19.',
    longDescription: `Die Kulturplattform Freiburg ist eine moderne Vereinswebsite, die kulturelle Veranstaltungen und Initiativen in Freiburg fördert. Das Projekt umfasst ein vollständiges Content-Management-System, Newsletter-Management und mehrsprachige Unterstützung.

Die Architektur folgt Clean Architecture-Prinzipien mit einem .NET 10 Backend und React 19 Frontend. Das CMS ermöglicht es dem Verein, selbstständig Inhalte zu pflegen, Events zu erstellen und Newsletter an Abonnenten zu versenden.`,
    features: [
      'Content-Management-System (CMS) für Vereinsinhalte',
      'Newsletter-System mit automatischer Versendung',
      'Zweisprachig: Deutsch & Türkisch',
      'Event-Kalender mit Registrierung',
      'Admin-Panel für Vorstandsmitglieder',
      'SEO-optimiert mit SSR',
      'Integration mit E-Mail-Diensten',
    ],
    techStack: [
      { name: 'React 19', icon: '⚛️' },
      { name: '.NET 10', icon: '🔷' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'Azure', icon: '☁️' },
      { name: 'Docker', icon: '🐳' },
      { name: 'Tailwind', icon: '💨' },
      { name: 'SendGrid', icon: '📧' },
    ],
    screenshots: ['/assets/images/kulturplattform.png'],
    role: 'Full-Stack Developer',
    duration: '2025',
    demo: {
      type: 'iframe',
      url: 'https://kulturplattformfreiburg.org',
      poster: '/assets/images/kulturplattform.png',
      note: 'Live-System — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'hochzeitseinladung',
    title: 'Digitale Hochzeitseinladung',
    subtitle: 'Interaktive Einladungswebsite mit Countdown & Galerie',
    category: 'Website',
    tags: ['Angular 19', 'Frontend', 'SSR', 'Netlify'],
    image: '/assets/images/hohezeit.png',
    liveUrl: 'https://melike-ve-musa-evleniyor.netlify.app/',
    githubUrl: 'https://github.com/oeztuerkhamza/dugun',
    description:
      'Elegante digitale Hochzeitseinladung mit Countdown, Fotogalerie, Veranstaltungsort-Karte, Geschenke-Bereich und Sprachwechsler.',
    longDescription: `Eine elegante digitale Hochzeitseinladung, die als Single-Page-Application mit Angular 19 entwickelt wurde. Die Anwendung ersetzt klassische Papier-Einladungen durch ein interaktives, modernes Web-Erlebnis mit Animationen und Echtzeit-Countdown.

Die Seite umfasst einen Hero-Bereich mit Splash-Screen, einen Live-Countdown bis zur Hochzeit, eine Fotogalerie, YouTube-Video-Integration, interaktive Veranstaltungsort-Karte, Geschenke-Bereich mit IBAN- und PayPal-QR-Codes sowie einen Sprachwechsler. Deployment erfolgt automatisiert über GitHub Actions auf Netlify mit eigener Custom Domain.`,
    features: [
      'Animierter Splash-Screen und Hero-Bereich',
      'Echtzeit-Countdown bis zur Hochzeit',
      'Fotogalerie mit Lightbox-Effekt',
      'Geschenke-Bereich mit IBAN & PayPal QR-Codes',
      'Interaktive Veranstaltungsort-Karte',
      'YouTube-Video-Integration',
      'Custom Domain mit GitHub Actions CI/CD',
    ],
    techStack: [
      { name: 'Angular 19', icon: '🅰️' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'SCSS', icon: '🎨' },
      { name: 'Netlify', icon: '🚀' },
      { name: 'SSR', icon: '⚡' },
      { name: 'GitHub Actions', icon: '🔄' },
    ],
    screenshots: ['/assets/images/hohezeit.png'],
    role: 'Full-Stack Developer',
    duration: '2025',
    featured: true,
    demo: {
      type: 'iframe',
      url: 'https://melike-ve-musa-evleniyor.netlify.app/',
      poster: '/assets/images/hohezeit.png',
      note: 'Live-Demo — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'bewerbungs-manager',
    title: 'Bewerbungs-Manager',
    subtitle: 'KI-gestützte Bewerbungsautomatisierung',
    category: 'Tool / Automation',
    tags: ['Python', 'KI', 'Automation', 'PDF'],
    image: '/assets/images/bewerbung.png',
    githubUrl: 'https://github.com/oeztuerkhamza/bewerbungs-manager',
    description:
      'KI-gestützte Bewerbungsautomatisierung. Python-App für PDF-Generierung, Profilverwaltung und KI-gestützte Stellenanalyse.',
    longDescription: `Der Bewerbungs-Manager ist ein intelligentes Bewerbungstool, das den gesamten Bewerbungsprozess automatisiert. Von der Stellenanalyse über die Anpassung des Lebenslaufs bis hin zur PDF-Generierung – alles wird KI-gestützt optimiert.

Das System analysiert Stellenausschreibungen, extrahiert relevante Keywords und passt Bewerbungsunterlagen automatisch an. Machine-Learning-Modelle bewerten die Passgenauigkeit und generieren maßgeschneiderte Anschreiben.`,
    features: [
      'KI-gestützte Analyse von Stellenausschreibungen',
      'Automatische Keyword-Extraktion und -Matching',
      'PDF-Generierung für Lebenslauf und Anschreiben',
      'Profilverwaltung mit mehreren Templates',
      'Passgenauigkeits-Score für jede Stelle',
      'Dashboard mit Bewerbungs-Tracking',
    ],
    techStack: [
      { name: 'Python', icon: '🐍' },
      { name: 'FastAPI', icon: '⚡' },
      { name: 'OpenAI', icon: '🤖' },
      { name: 'SQLite', icon: '🗃️' },
      { name: 'React', icon: '⚛️' },
    ],
    screenshots: ['/assets/images/bewerbung.png'],
    role: 'Solo Developer',
    duration: '2025',
    demo: {
      type: 'image',
      screens: ['/assets/images/bewerbung.png'],
      note: 'Desktop-Tool — Screenshot',
    },
  },
];

/** Projects surfaced in the home "Live-Demos" showcase, in order. */
export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
