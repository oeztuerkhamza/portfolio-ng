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
  /** Drives the interactive browser/phone-frame demo. */
  demo?: ProjectDemo;
}

export const PROJECTS: Project[] = [
  {
    slug: 'bikehaus-freiburg',
    title: 'Bikehaus Freiburg',
    subtitle: 'Warenwirtschaft, Website und Online-Verleih für ein Fahrradgeschäft',
    category: 'Full-Stack Plattform',
    tags: ['Full-Stack', 'Angular 17', '.NET 8', 'Verleih & Shop', '12 Sprachen'],
    image: '/assets/images/bikehaus.webp',
    liveUrl: 'https://bikehausfreiburg.com',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Warenwirtschaft, öffentliche Website und Online-Verleih für ein Fahrradgeschäft in Freiburg. .NET-API, zwei Angular-Frontends, Chrome-Erweiterung und Windows-App — selbst gehostet.',
    longDescription: `Bikehaus Freiburg ist kein Shop-Template, sondern der Betrieb selbst: Ein Rad wird angekauft, kommt in den Bestand, wird verkauft, vermietet oder zurückgenommen — und jeder dieser Schritte hat eine eigene Belegnummer, eine Unterschrift und am Ende ein PDF. Die Admin-Oberfläche bildet das in rund 28 Bereichen ab, von Kunden und Rechnungen über Ausgaben und Renovierungskosten bis zu Statistik, Export und Backup.

Nach außen steht die öffentliche Seite: Angular 17 mit Server-Side Rendering, zwölf Sprachen mit eigenen URLs und rund 100 beim Build vorgerenderten Routen — Showroom, E-Bikes, neue Räder, Zubehör, Service, Ratgeber und Stadt-Landingpages für die Umgebung. Der Verleih ist komplett online: Verfügbarkeit prüfen, Zubehör wählen, per Mollie bezahlen. Die Buchung landet im Adminbereich zur Freigabe und wird dort zum Mietvertrag.

Dazu kommt, was ein einzelner Laden sonst von Hand macht: Ein Hintergrunddienst gleicht alle vier Stunden die Kleinanzeigen-Inserate ab (Playwright-Scraper), eine Chrome-Erweiterung bearbeitet sie in Massen, Kundenanfragen laufen als Chat über ein angebundenes Postfach. Betrieben wird alles auf einem eigenen Server: Docker Compose mit fünf Diensten, nginx davor, Zertifikate automatisch erneuert und täglich per GitHub Actions überwacht. Für den Ladentisch gibt es zusätzlich eine Windows-Version, die die API gleich mitbringt.`,
    features: [
      'Kompletter Warenfluss: Ankauf → Bestand → Verkauf → Rücknahme, mit Belegnummern und Unterschrift',
      'Öffentliche Verleih-Buchung mit Verfügbarkeitsprüfung und Online-Zahlung (Mollie)',
      '12 Sprachen mit eigenen URLs, rund 100 vorgerenderte Routen (Angular SSR)',
      'Kleinanzeigen-Abgleich alle vier Stunden plus Chrome-Erweiterung für Massenbearbeitung',
      'Admin-Bereich mit ~28 Modulen: Kunden, Rechnungen, Ausgaben, Statistik, Export, Backup',
      'PDF-Erzeugung für Mietverträge, Rechnungen und Belege',
      'Windows-Desktop-Version (Electron) mit gebündelter API für den Betrieb im Laden',
      'Self-Hosting: Docker Compose mit fünf Diensten, nginx, TLS-Automatik, eigener Mailserver',
    ],
    techStack: [
      { name: 'Angular 17', icon: '🅰️' },
      { name: '.NET 8', icon: '🔷' },
      { name: 'SQLite', icon: '🗃️' },
      { name: 'Entity Framework', icon: '📦' },
      { name: 'Docker', icon: '🐳' },
      { name: 'nginx', icon: '🔀' },
      { name: 'Playwright', icon: '🎭' },
      { name: 'Electron', icon: '🖥️' },
    ],
    screenshots: [
      '/assets/images/bikehaus.webp',
      '/assets/images/bikehaus-2.webp',
      '/assets/images/bikehaus-3.webp',
    ],
    role: 'Full-Stack Developer & Architekt',
    duration: '2026/3 – Heute',
    demo: {
      type: 'image',
      url: 'https://bikehausfreiburg.com',
      screens: [
        '/assets/images/bikehaus.webp',
        '/assets/images/bikehaus-2.webp',
        '/assets/images/bikehaus-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
  {
    slug: 'karaarslan-bike',
    title: 'Karaarslan Bike',
    subtitle: 'Warenwirtschaft und Website für einen Fahrradladen in Lünen',
    category: 'Full-Stack Web-App',
    tags: ['Full-Stack', 'Angular 17', '.NET 9', 'SSR', '4 Sprachen'],
    image: '/assets/images/karaarslan-bike.webp',
    liveUrl: 'https://karaarslan-bike.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Zweiter Laden, dieselbe Plattform: .NET-9-API, Angular-Admin und öffentliche SSR-Website mit Live-Bestand für einen Familienbetrieb in Lünen — viersprachig, auf eigenem Server.',
    longDescription: `Karaarslan Bike ist ein Fahrradladen in Lünen im Ruhrgebiet, ein Familienbetrieb seit 2021. Er bekommt dieselbe Plattform wie Bikehaus Freiburg — und genau das war der Test, ob sie sich wirklich auf einen neuen Betrieb übertragen lässt: anderer Name, andere Stadt, andere Region, anderes Sortiment, derselbe Kern aus Ankauf, Bestand, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben und Statistik.

Die öffentliche Seite läuft auf Angular 17 mit Server-Side Rendering in vier Sprachen (DE, EN, FR, TR). Sie zieht ihre Inhalte direkt aus der Warenwirtschaft: Der Showroom zeigt den echten Bestand mit Filtern nach Zustand, Kategorie und Preis, dazu Zubehör, Neuräder, Ratgeber, FAQ, Garantie und Stadt-Landingpages für die Orte rund um Lünen. Was im Laden eingebucht wird, steht ohne Zwischenschritt online — derzeit rund 90 Räder.

Dahinter liegt der Verwaltungsbereich mit Modulen für Ankauf, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben, Renovierungskosten, Teile und Statistik, dazu eine E-Mail-Kampagne, die Kunden nach dem Kauf um eine Google-Bewertung bittet. Betrieben wird alles auf einem eigenen Server mit Docker und nginx: API, Admin-Oberfläche und SSR-Frontend als getrennte Dienste, eigener Mailserver, automatische Zertifikatserneuerung.`,
    features: [
      'Warenwirtschaft: Ankauf, Bestand, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben',
      'Öffentlicher Showroom mit Live-Bestand und Filtern nach Zustand, Kategorie und Preis',
      'Vier Sprachen (DE, EN, FR, TR) mit eigenen URLs und SSR',
      'Zubehör, Neuräder, Ratgeber, FAQ und Garantie-Seite',
      'Stadt-Landingpages und strukturierte Daten für die lokale Suche rund um Lünen',
      'E-Mail-Kampagne, die Kunden nach dem Kauf um eine Google-Bewertung bittet',
      'Renovierungskosten und Teile pro Rad in der Verwaltung',
      'Self-Hosting: Docker, nginx, eigener Mailserver, Zertifikats-Automatik',
    ],
    techStack: [
      { name: 'Angular 17', icon: '🅰️' },
      { name: '.NET 9', icon: '🔷' },
      { name: 'SQLite', icon: '🗃️' },
      { name: 'Entity Framework', icon: '📦' },
      { name: 'Angular SSR', icon: '⚡' },
      { name: 'Docker', icon: '🐳' },
      { name: 'nginx', icon: '🔀' },
      { name: 'TypeScript', icon: '📘' },
    ],
    screenshots: [
      '/assets/images/karaarslan-bike.webp',
      '/assets/images/karaarslan-bike-2.webp',
      '/assets/images/karaarslan-bike-3.webp',
    ],
    role: 'Full-Stack Developer & Architekt',
    duration: '2026 – Heute',
    demo: {
      type: 'image',
      url: 'https://karaarslan-bike.de',
      screens: [
        '/assets/images/karaarslan-bike.webp',
        '/assets/images/karaarslan-bike-2.webp',
        '/assets/images/karaarslan-bike-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
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
    image: '/assets/images/gkn-portraits.webp',
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
      '/assets/images/gkn-portraits.webp',
      '/assets/images/gkn-portraits-2.webp',
      '/assets/images/gkn-portraits-3.webp',
    ],
    role: 'Full-Stack Developer & Designer',
    duration: '2026 – Heute',
    demo: {
      type: 'image',
      url: 'https://gknportraits.de',
      screens: [
        '/assets/images/gkn-portraits.webp',
        '/assets/images/gkn-portraits-2.webp',
        '/assets/images/gkn-portraits-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
  {
    slug: 'dj-veys',
    title: 'DJ Veys',
    subtitle: 'Website und Anfragesystem für einen Hochzeits-DJ',
    category: 'Website & CMS',
    tags: ['Next.js 16', 'Payload CMS', '8 Sprachen', 'SEO', 'Self-Hosting'],
    image: '/assets/images/dj-veys.webp',
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
      '/assets/images/dj-veys.webp',
      '/assets/images/dj-veys-2.webp',
      '/assets/images/dj-veys-3.webp',
    ],
    role: 'Full-Stack Developer & Designer',
    duration: '2026',
    demo: {
      type: 'image',
      url: 'https://dj-veys.de',
      screens: [
        '/assets/images/dj-veys.webp',
        '/assets/images/dj-veys-2.webp',
        '/assets/images/dj-veys-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
  {
    slug: 'zerin-gold',
    title: 'Zerin Gold',
    subtitle: 'Premium-Website mit Live-Edelmetallpreisen für einen Juwelier',
    category: 'Premium-Website',
    tags: ['Next.js 16', 'React 19', 'Live-Preise', '7 Sprachen', 'Prisma'],
    image: '/assets/images/zerin-gold.webp',
    liveUrl: 'https://zerin-gold.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Website für Goldhändler, Juwelier und Atelier in Freiburg: Live-Edelmetallpreise, Rechner und Produktkatalog. Next.js 16, sieben Sprachen inkl. RTL-Arabisch.',
    longDescription: `Zerin Gold ist Goldhändler, Juwelier und Schmuck-Atelier in Freiburg im Breisgau. Die Seite setzt auf eine ruhige Schwarz-Gold-Ästhetik mit feiner Serifen-Typografie und sanften Scroll-Animationen — bei Gold verkauft nicht die Lautstärke, sondern der Eindruck von Solidität. Sieben Sprachen decken die Kundschaft ab, Arabisch inklusive Rechts-nach-links-Layout.

Der technisch interessante Teil ist der Preis. Ein eigener Provider liest die Edelmetall-Quotes von Kitco, rechnet Bid/Ask je Feinunze über den EZB-Wechselkurs in Cent pro Gramm Feingewicht um und cacht das Ergebnis zwei Minuten lang — die Seite zeigt also belastbare Zahlen, ohne den Anbieter bei jedem Aufruf zu treffen. Darauf setzen eine Margen-Engine, die der Händler im Adminbereich steuert, und vier Rechner: Altgold-Wert, Karat-Umrechner, Krügerrand und Sparplan. Der Ticker im Kopf der Seite kommt aus derselben Quelle.

Darunter liegt Next.js 16 mit React Server Components und Server Actions, Prisma 7 auf PostgreSQL, Redis als Cache, Auth.js v5 mit Argon2 und TOTP-Zweitfaktor für den Adminbereich, Resend für E-Mails und Cloudflare Turnstile gegen Formular-Spam. Rund 290 URLs mit eigenen Landingpages für die Suchbegriffe, die hier wirklich gesucht werden — von „Gramm Altın" bis Trauringe — dazu Vitest- und Playwright-Tests, gehostet in Deutschland hinter Cloudflare.`,
    features: [
      'Live-Edelmetallpreise: Kitco-Quotes + EZB-Kurs → Cent pro Gramm Feingewicht, 2-Minuten-Cache',
      'Vier Rechner: Altgold-Wert, Karat-Umrechner, Krügerrand, Sparplan',
      'Margen-Engine — der Händler steuert seine Aufschläge selbst im Adminbereich',
      '7 Sprachen inkl. RTL-Layout für Arabisch, white-label aufgebaut',
      'Next.js 16 mit Server Components, Prisma 7/PostgreSQL und Redis',
      'Admin-Login mit Argon2 und TOTP-Zweitfaktor (Auth.js v5)',
      'Formulare mit Cloudflare Turnstile statt Captcha-Rätseln',
      'Rund 290 URLs mit Keyword-Landingpages, Tests mit Vitest und Playwright',
    ],
    techStack: [
      { name: 'Next.js 16', icon: '▲' },
      { name: 'React 19', icon: '⚛️' },
      { name: 'Tailwind 4', icon: '💨' },
      { name: 'Prisma 7', icon: '🔺' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'Redis', icon: '🧰' },
      { name: 'Auth.js', icon: '🔐' },
      { name: 'Playwright', icon: '🎭' },
    ],
    screenshots: [
      '/assets/images/zerin-gold.webp',
      '/assets/images/zerin-gold-2.webp',
      '/assets/images/zerin-gold-3.webp',
    ],
    role: 'Solo Developer & Designer',
    duration: '2025 – Heute',
    demo: {
      type: 'image',
      url: 'https://zerin-gold.de',
      screens: [
        '/assets/images/zerin-gold.webp',
        '/assets/images/zerin-gold-2.webp',
        '/assets/images/zerin-gold-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
  {
    slug: 'praxis-gueltekin',
    title: 'Hausarztpraxis Gültekin',
    subtitle: 'Mehrsprachige Praxis-Website für eine Hausärztin in Hofheim am Taunus',
    category: 'Praxis-Website',
    tags: ['Astro', 'Statische Website', '10 Sprachen', 'Local SEO', 'DSGVO'],    image: '/assets/images/praxis-gueltekin.webp',
    liveUrl: 'https://www.praxis-gueltekin.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Website für eine Hausarztpraxis in Hofheim am Taunus: Allgemeinmedizin, Innere Medizin und Infektiologie in zehn Sprachen, mit Gesundheitsratgeber, FAQ und Einwilligung für Statistik — als schnelle statische Seite.',
    longDescription: `Die Hausarztpraxis von Fazilet Gültekin liegt in Hofheim am Taunus und betreut gesetzlich wie privat Versicherte — auf Deutsch und Türkisch, in der Region aber auch für Patientinnen und Patienten, die lieber in ihrer eigenen Sprache nachlesen. Die Website setzt deshalb auf Sprache: zehn Sprachen (DE, TR, EN, AR, RU, UK, PL, RO, IT, ES) mit eigenen, übersetzten URLs, Arabisch mit Rechts-nach-links-Layout, insgesamt 93 indexierbare Seiten samt hreflang-Verweisen und Sitemap.

Inhaltlich bildet sie ab, was eine Praxis wirklich beantworten muss: Wer behandelt hier, was wird angeboten, wann ist geöffnet, wie komme ich an einen Termin? Dazu kommen Leistungsübersicht mit Schwerpunkt Infektiologie, häufige Fragen und ein Gesundheitsratgeber mit Artikeln zu Themen wie Bluthochdruck, Eisenmangel, Impfungen für Erwachsene oder Vorsorge. Sprechzeiten, Notdienst-Hinweis (116 117) und Kontaktwege stehen auf jeder Seite im Kopf bzw. Fuß.

Technisch ist die Seite bewusst schlicht gehalten: Astro erzeugt beim Build reines HTML mit minimalem JavaScript, Schriften und Bilder werden selbst ausgeliefert, auf nginx mit Sicherheits-Headern. Statistik über den Google Tag Manager läuft erst nach aktiver Einwilligung, die jederzeit widerrufbar ist — ein Muss bei einer Arztpraxis. Impressum und Datenschutzerklärung gibt es in allen Sprachen.`,
    features: [
      'Zehn Sprachen mit übersetzten URLs, inkl. RTL-Layout für Arabisch',
      '93 indexierbare Seiten mit hreflang, Sitemap und strukturierten Daten (Arzt, Praxis, Sprechzeiten)',
      'Leistungsübersicht mit Schwerpunkt Infektiologie und Diagnostik in der Praxis',
      'Gesundheitsratgeber mit Fachartikeln und FAQ für Patientinnen und Patienten',
      'Sprechzeiten, Bereitschaftsdienst-Hinweis und Termin-Link auf jeder Seite',
      'Einwilligungsbanner: Google Tag Manager erst nach Zustimmung, jederzeit widerrufbar',
      'Statisch gebaut mit Astro — schnell, ohne Datenbank, kaum JavaScript',
      'Selbst ausgelieferte Schriften und Bilder, Sicherheits-Header auf nginx',
    ],
    techStack: [
      { name: 'Astro', icon: '🚀' },
      { name: 'nginx', icon: '🔀' },
      { name: 'Schema.org / JSON-LD', icon: '🧬' },
      { name: 'Google Tag Manager', icon: '🏷️' },
      { name: 'hreflang / SEO', icon: '🌍' },
    ],
    screenshots: [
      '/assets/images/praxis-gueltekin.webp',
      '/assets/images/praxis-gueltekin-2.webp',
      '/assets/images/praxis-gueltekin-3.webp',
    ],
    role: 'Full-Stack Developer & Designer',
    duration: '2026',
    demo: {
      type: 'image',
      url: 'https://www.praxis-gueltekin.de',
      screens: [
        '/assets/images/praxis-gueltekin.webp',
        '/assets/images/praxis-gueltekin-2.webp',
        '/assets/images/praxis-gueltekin-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
  {
    slug: 'kulturplattform-freiburg',
    title: 'Kulturplattform Freiburg',
    subtitle: 'Vereinsplattform mit CMS, Kursen und Newsletter',
    category: 'Web-App / CMS',
    tags: ['Web-App', 'React', '.NET 10', 'CQRS', 'CMS'],
    image: '/assets/images/kulturplattform.webp',
    liveUrl: 'https://kulturplattformfreiburg.org',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Plattform für einen Kulturverein in Freiburg: Veranstaltungen, Kursangebote, Ehrenamt und Newsletter mit Double-Opt-in. .NET-10-Backend mit CQRS, React-Frontend, zweisprachig.',
    longDescription: `Die Kulturplattform Freiburg e. V. organisiert Veranstaltungen, Kurse und Begegnungsformate in Freiburg. Die Plattform bildet das ab, was der Verein tatsächlich tut: Aktivitäten mit Kategorien, Suche und Detailseiten, Kursangebote, Partner, Satzung, Spenden und ein Formular für Ehrenamtliche. Gepflegt wird alles vom Vorstand selbst — auch die Übersetzungen, die als Ressourcen in der Datenbank liegen und im Adminbereich bearbeitet werden. Ein neuer Text auf Deutsch und Türkisch braucht damit kein Deployment.

Das Backend ist ein .NET-10-Dienst nach Clean Architecture mit CQRS über MediatR, FluentValidation für die Eingaben, JWT und BCrypt für die Anmeldung und Entity Framework Core auf SQL Server — rund 22 Controller, dazu Tests auf Domänen-, Anwendungs- und Integrationsebene. Der Newsletter ist kein Mailto-Link, sondern ein eigener Ablauf: Double-Opt-in mit Bestätigungslink, Abmelde-Token in jeder Mail, Kampagnen pro Sprache und Versand in Stapeln, mit Azure Communication Services und SMTP als Rückfallebene.

Betrieben wird das Ganze auf einem eigenen Server: Docker Compose mit SQL Server, API und nginx, eigene Postfächer für den Versand, Backup- und Restore-Skripte daneben. Das Frontend ist eine React-Single-Page-App, die gegen dieselbe API läuft.`,
    features: [
      'Aktivitäten mit Kategorie-Filter, Suche und Detailseiten',
      'Kursangebote, Partner, Satzung, Spenden und Ehrenamt-Formular',
      'Zweisprachig (DE/TR) — Übersetzungen liegen in der Datenbank, nicht im Code',
      'Newsletter mit Double-Opt-in, Abmelde-Token und Kampagnen pro Sprache',
      'Versand über Azure Communication Services mit SMTP-Rückfallebene',
      'Clean Architecture mit CQRS (MediatR) und FluentValidation',
      'Tests auf Domänen-, Anwendungs- und Integrationsebene',
      'Self-Hosting: Docker Compose mit SQL Server, API und nginx, eigene Postfächer',
    ],
    techStack: [
      { name: 'React', icon: '⚛️' },
      { name: '.NET 10', icon: '🔷' },
      { name: 'SQL Server', icon: '🗄️' },
      { name: 'MediatR / CQRS', icon: '🧩' },
      { name: 'Entity Framework', icon: '📦' },
      { name: 'Docker', icon: '🐳' },
      { name: 'nginx', icon: '🔀' },
      { name: 'xUnit', icon: '🧪' },
    ],
    screenshots: [
      '/assets/images/kulturplattform.webp',
      '/assets/images/kulturplattform-2.webp',
      '/assets/images/kulturplattform-3.webp',
    ],
    role: 'Full-Stack Developer',
    duration: '2025 – Heute',
    demo: {
      type: 'image',
      url: 'https://kulturplattformfreiburg.org',
      screens: [
        '/assets/images/kulturplattform.webp',
        '/assets/images/kulturplattform-2.webp',
        '/assets/images/kulturplattform-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
];
