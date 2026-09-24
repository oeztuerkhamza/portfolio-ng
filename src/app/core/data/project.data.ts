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
      type: 'iframe',
      url: 'https://bikehausfreiburg.com',
      poster: '/assets/images/bikehaus.webp',
      note: 'Live-System — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'benlirad',
    title: 'Benlirad',
    subtitle: 'Warenwirtschaft und Website für ein Fahrradgeschäft in Lahr',
    category: 'Full-Stack Web-App',
    tags: ['Full-Stack', 'Angular 17', '.NET 9', 'SSR', '4 Sprachen'],
    image: '/assets/images/benlirad.webp',
    liveUrl: 'https://benlirad.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Zweiter Laden, dieselbe Plattform: .NET-9-API, Angular-Admin und öffentliche SSR-Website mit Showroom, Zubehör und Reparatur-Service — viersprachig, auf eigenem Server.',
    longDescription: `Benlirad ist ein Fahrradgeschäft in Lahr im Schwarzwald. Die Plattform, die für Bikehaus Freiburg entstanden ist, läuft hier in einem eigenen Zuschnitt: derselbe Kern — Ankauf, Bestand, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben und Statistik — aber zugeschnitten auf einen Laden, der verkauft und repariert statt vermietet. Genau darin lag die Arbeit: Was gehört wirklich zum Kern und was war nur für den ersten Kunden?

Die öffentliche Seite läuft auf Angular 17 mit Server-Side Rendering in vier Sprachen (DE, EN, FR, TR). Sie zieht ihre Inhalte direkt aus der Warenwirtschaft: Der Showroom zeigt den echten Bestand samt Zähler der verfügbaren Räder, dazu neue Fahrräder, Zubehör, Reparatur-Service, Ratgeber, FAQ, Garantie und Stadt-Landingpages für die Region. Was im Laden eingebucht wird, steht ohne Zwischenschritt online.

Betrieben wird das Ganze auf einem eigenen Server mit Docker und nginx: API, Admin-Oberfläche und SSR-Frontend als getrennte Dienste, SQLite als Datenbank, JWT für die Anmeldung. Dazu kommen dieselben Werkzeuge wie beim Schwesterprojekt — Kleinanzeigen-Abgleich, Chrome-Erweiterung und eine Windows-Version für den Rechner im Laden.`,
    features: [
      'Warenwirtschaft: Ankauf, Bestand, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben',
      'Öffentliche Website mit Live-Bestand aus derselben Datenbank',
      'Vier Sprachen (DE, EN, FR, TR) mit eigenen URLs und SSR',
      'Showroom, Neuräder, Zubehör, Reparatur-Service, Ratgeber und FAQ',
      'Stadt-Landingpages für die lokale Suche rund um Lahr',
      'Kleinanzeigen-Abgleich plus Chrome-Erweiterung für die Inserate',
      'Windows-Desktop-Variante mit gebündelter API',
      'Self-Hosting: Docker, nginx, Let’s-Encrypt-Automatik',
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
      '/assets/images/benlirad.webp',
      '/assets/images/benlirad-2.webp',
      '/assets/images/benlirad-3.webp',
    ],
    role: 'Full-Stack Developer & Architekt',
    duration: '2025 – Heute',
    demo: {
      type: 'iframe',
      url: 'https://benlirad.de',
      poster: '/assets/images/benlirad.webp',
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
      type: 'iframe',
      url: 'https://gknportraits.de',
      poster: '/assets/images/gkn-portraits.webp',
      note: 'Live-System — geöffnet im eingebetteten Browser',
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
      type: 'iframe',
      url: 'https://zerin-gold.de',
      poster: '/assets/images/zerin-gold.webp',
      note: 'Live-System — geöffnet im eingebetteten Browser',
    },
  },
  {
    slug: 'hotel-bergfrieden',
    title: 'Hotel Bergfrieden',
    subtitle: 'Statisch gerenderte Hotel-Website im Hochschwarzwald',
    category: 'Website',
    tags: ['Angular 21', 'SSG', 'Tailwind', '4 Sprachen', 'SEO'],
    image: '/assets/images/hbf-hotel.webp',
    liveUrl: 'https://oeztuerkhamza.github.io/bergfrieden-hotel/',
    githubUrl: 'https://github.com/oeztuerkhamza/bergfrieden-hotel',
    description:
      'Website für ein familiengeführtes Hotel in Löffingen. Angular 21, jede Route als fertiges HTML vorgerendert, vier Sprachen — ohne Server-Runtime.',
    longDescription: `Das Hotel Bergfrieden ist ein familiengeführtes Haus in Löffingen im Hochschwarzwald. Der Entwurf folgt einer Vorgabe, die leichter gesagt als gebaut ist: luxuriös, aber warm. Das trägt eine Black-Forest-Palette aus Waldgrün, Cream und Bronze, dazu Cormorant Garamond für die Überschriften und Inter für den Fließtext — großzügige Bilder, viel Weißraum, kein Effektgewitter.

Inhaltlich deckt die Seite ab, was ein Haus dieser Größe wirklich braucht: fünf Zimmertypen mit Anfrage-Button, das Bio-Regiofrühstück mit Bezugsquellen, eine Region-Seite mit Hochschwarzwald-Card, Galerie mit Lightbox, Blog, Kontakt mit Anfrage und WhatsApp — in vier Sprachen. Für ein Hotel, das seine Buchungen über Portale und Direktanfragen bekommt, ist das der richtige Zuschnitt: keine Buchungsmaschine, die gepflegt werden will, sondern eine Seite, die überzeugt und die Anfrage auslöst.

Technisch ist es bewusst die einfachste tragfähige Lösung. Angular 21 mit Standalone Components und Signals, beim Build werden alle Routen zu fertigem HTML vorgerendert und liegen auf GitHub Pages — kein Server, keine Laufzeitkosten, nichts, was nachts ausfallen könnte. Meta-Tags pro Route, Hotel-Schema.org als JSON-LD, sitemap.xml, robots.txt und ein PWA-Manifest sind eingebaut, das Deployment läuft automatisch bei jedem Push.`,
    features: [
      'Warm-luxuriöses Design: Black-Forest-Palette, Cormorant Garamond + Inter',
      'Static Site Generation — jede Route als fertiges HTML, kein Server nötig',
      'Vier Sprachen (DE, EN, FR, TR) mit eigenen URLs',
      'Zimmer, Bio-Regiofrühstück, Region mit Hochschwarzwald-Card, Galerie, Blog',
      'Anfragestrecke mit WhatsApp-Abkürzung statt Buchungsmaschine',
      'Pro-Route-SEO mit Hotel-Schema.org JSON-LD, sitemap.xml, OG/Twitter-Cards',
      'PWA-Manifest und llms.txt',
      'Automatisches Deployment über GitHub Actions auf GitHub Pages',
    ],
    techStack: [
      { name: 'Angular 21', icon: '🅰️' },
      { name: 'Tailwind', icon: '💨' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'SSG / Prerender', icon: '⚡' },
      { name: 'GitHub Actions', icon: '🔄' },
      { name: 'Schema.org', icon: '🔍' },
    ],
    screenshots: [
      '/assets/images/hbf-hotel.webp',
      '/assets/images/hbf-hotel-2.webp',
      '/assets/images/hbf-hotel-3.webp',
    ],
    role: 'Full-Stack Developer & Designer',
    duration: '2025 – Heute',
    demo: {
      type: 'iframe',
      url: 'https://oeztuerkhamza.github.io/bergfrieden-hotel/',
      poster: '/assets/images/hbf-hotel.webp',
      note: 'Live-System — geöffnet im eingebetteten Browser',
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
      type: 'iframe',
      url: 'https://kulturplattformfreiburg.org',
      poster: '/assets/images/kulturplattform.webp',
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
