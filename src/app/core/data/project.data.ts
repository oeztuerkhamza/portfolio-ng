export interface Project {
  slug: string;
  title: string;
  subtitle: string;
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
}

export const PROJECTS: Project[] = [
  {
    slug: 'bikehaus-freiburg',
    title: 'Bikehaus Freiburg',
    subtitle: 'Digitale Warenwirtschaft für ein Fahrradgeschäft',
    tags: ['Full-Stack', 'Angular 19', '.NET 10'],
    image: 'assets/images/bikehaus.png',
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
    screenshots: ['assets/images/bikehaus.png'],
    role: 'Full-Stack Developer & Architekt',
    duration: '2026/3 – Heute',
  },
  {
    slug: 'kulturplattform-freiburg',
    title: 'Kulturplattform Freiburg',
    subtitle: 'Vereinswebsite mit CMS und Newsletter',
    tags: ['Web-App', 'React 19', '.NET 10', 'CMS'],
    image: 'assets/images/kulturplattform.png',
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
      'Responsive Design für alle Geräte',
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
    screenshots: ['assets/images/kulturplattform.png'],
    role: 'Full-Stack Developer',
    duration: '2025',
  },
  {
    slug: 'bewerbungs-manager',
    title: 'Bewerbungs-Manager',
    subtitle: 'KI-gestützte Bewerbungsautomatisierung',
    tags: ['Python', 'KI', 'Automation', 'PDF'],
    image: 'assets/images/bewerbung.png',
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
      'Batch-Bewerbung an mehrere Stellen',
      'Dashboard mit Bewerbungs-Tracking',
      'Export in verschiedene Formate',
    ],
    techStack: [
      { name: 'Python', icon: '🐍' },
      { name: 'FastAPI', icon: '⚡' },
      { name: 'OpenAI', icon: '🤖' },
      { name: 'SQLite', icon: '🗃️' },
      { name: 'React', icon: '⚛️' },
    ],
    screenshots: [],
    role: 'Solo Developer',
    duration: '2025',
  },
  {
    slug: 'benlirad',
    title: 'Benlirad',
    subtitle: 'Fahrrad-Plattform mit Showroom, Verleih & Service',
    tags: ['Full-Stack', 'Angular 19', '.NET 10', 'i18n'],
    image: 'assets/images/benlirad.png',
    liveUrl: 'https://benlirad.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Moderne Fahrrad-Plattform für Verkauf, Verleih und Reparatur-Service in Lahr/Schwarzwald. Mehrsprachig mit Showroom und Kundenbewertungen.',
    longDescription: `Benlirad ist eine umfassende Web-Plattform für ein Fahrradgeschäft in Lahr/Schwarzwald. Die Anwendung vereint einen Showroom für neue und gebrauchte Fahrräder, ein Verleihsystem, einen Reparatur-Service und ein vollständiges CMS – alles in einer modernen, responsiven Oberfläche.

Die Plattform unterstützt vier Sprachen (Deutsch, Englisch, Französisch, Türkisch) und integriert externe APIs für automatisierte Produktlistings. Über 500 zufriedene Kunden nutzen das Angebot, und der Showroom wird regelmäßig mit aktuellen Rädern aktualisiert. Das Backend basiert auf .NET 10 mit Clean Architecture, das Frontend auf Angular 19 mit SSR für optimale SEO und Performance.`,
    features: [
      'Showroom mit Produktkatalog und Filterfunktionen',
      'Viersprachig: Deutsch, Englisch, Französisch, Türkisch',
      'Fahrradverleih-System mit Online-Buchung',
      'Reparatur- & Service-Terminbuchung',
      'Integration mit Kleinanzeigen-API für automatisierte Listings',
      'Kundenbewertungen und Testimonials',
      'Galerie mit Laden-Impressionen',
      'Responsive Design für alle Geräte',
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
    screenshots: [],
    role: 'Full-Stack Developer & Architekt',
    duration: '2025 – Heute',
  },
  {
    slug: 'di-flux',
    title: 'Di-Flux',
    subtitle: 'Intelligentes Zeiterfassungssystem für Unternehmen',
    tags: ['Full-Stack', 'Angular 19', '.NET', 'Enterprise'],
    image: 'assets/images/diflux-1.png',
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
      'Fehlende Einträge erkennen und nachpflegen',
      'Externe API-Anbindung für Datenimport',
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
    screenshots: [
      'assets/images/diflux-1.png',
      'assets/images/diflux-2.png',
      'assets/images/diflux-3.png',
    ],
    role: 'Full-Stack Developer',
    duration: '2025 – 2026',
  },
  {
    slug: 'hochzeitseinladung',
    title: 'Digitale Hochzeitseinladung',
    subtitle: 'Interaktive Einladungswebsite mit Countdown & Galerie',
    tags: ['Angular 19', 'Frontend', 'SSR', 'Netlify'],
    image: 'assets/images/hohezeit.png',
    liveUrl: 'https://melike-ve-musa-evleniyor.netlify.app/',
    githubUrl: 'https://github.com/oeztuerkhamza/dugun',
    description:
      'Elegante digitale Hochzeitseinladung mit Countdown, Fotogalerie, Veranstaltungsort-Karte, Geschenke-Bereich und Sprachwechsler.',
    longDescription: `Eine elegante digitale Hochzeitseinladung, die als Single-Page-Application mit Angular 19 entwickelt wurde. Die Anwendung ersetzt klassische Papier-Einladungen durch ein interaktives, modernes Web-Erlebnis mit Animationen und Echtzeit-Countdown.

Die Seite umfasst einen Hero-Bereich mit Splash-Screen, einen Live-Countdown bis zur Hochzeit, eine Fotogalerie, YouTube-Video-Integration, interaktive Veranstaltungsort-Karte, Geschenke-Bereich mit IBAN- und PayPal-QR-Codes sowie einen Sprachwechsler für mehrsprachige Gäste. Deployment erfolgt automatisiert über GitHub Actions auf Netlify mit eigener Custom Domain.`,
    features: [
      'Animierter Splash-Screen und Hero-Bereich',
      'Echtzeit-Countdown bis zur Hochzeit',
      'Fotogalerie mit Lightbox-Effekt',
      'Geschenke-Bereich mit IBAN & PayPal QR-Codes',
      'Interaktive Veranstaltungsort-Karte',
      'YouTube-Video-Integration',
      'Sprachwechsler für mehrsprachige Gäste',
      'Custom Domain mit GitHub Actions CI/CD',
      'Responsive Design für alle Geräte',
    ],
    techStack: [
      { name: 'Angular 19', icon: '🅰️' },
      { name: 'TypeScript', icon: '📘' },
      { name: 'SCSS', icon: '🎨' },
      { name: 'Netlify', icon: '🚀' },
      { name: 'SSR', icon: '⚡' },
      { name: 'GitHub Actions', icon: '🔄' },
    ],
    screenshots: [],
    role: 'Full-Stack Developer',
    duration: '2025',
  },
];
