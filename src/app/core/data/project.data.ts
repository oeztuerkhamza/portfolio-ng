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
    subtitle: 'Wie ein Fahrradgeschäft Ankauf, Verkauf, Verleih und Onlineauftritt in ein System bekam',
    category: 'Full-Stack Plattform',
    tags: ['Full-Stack', 'Angular 17', '.NET 8', 'Verleih & Shop', '12 Sprachen'],
    image: '/assets/images/bikehaus.webp',
    liveUrl: 'https://bikehausfreiburg.com',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Ein Fahrradgeschäft in Freiburg, in dem dasselbe Rad angekauft, verkauft, vermietet und online angeboten wird. Heute läuft alles in einem System — samt Website mit Online-Verleih in zwölf Sprachen.',
    longDescription: `Bikehaus Freiburg ist ein Fahrradgeschäft mit mehreren Standbeinen: Räder werden angekauft, aufbereitet, verkauft, vermietet und wieder zurückgenommen. Jeder dieser Schritte braucht einen Beleg, eine Unterschrift, oft ein PDF — und das Ganze soll auch noch online sichtbar sein, für Einheimische und Gäste in vielen Sprachen. Wer das mit Tabellen, Zetteln und einem Baukasten-Auftritt stemmt, verbringt seine Zeit mit Verwaltung statt mit Rädern.

Unsere Antwort war deshalb keine Website, sondern ein Abbild des Betriebs. Im Verwaltungsbereich hat jedes Rad seinen Weg: Ankauf, Bestand, Verkauf oder Verleih, Rücknahme — jede Station mit eigener Belegnummer, Unterschrift und PDF. Rund 28 Bereiche decken ab, was ein Laden täglich braucht, von Kunden und Rechnungen über Ausgaben und Renovierungskosten bis zu Statistik, Export und Backup. Was früher an mehreren Orten stand, steht jetzt an einem.

Nach außen spricht die Seite zwölf Sprachen, jede mit eigenen Adressen: Showroom, E-Bikes, neue Räder, Zubehör, Service, Ratgeber und Seiten für die Orte rund um Freiburg. Der Verleih ist komplett online — Verfügbarkeit prüfen, Zubehör wählen, per Mollie bezahlen. Die Buchung landet zur Freigabe im Verwaltungsbereich und wird dort zum Mietvertrag. Niemand muss mehr zurückrufen, um zu fragen, ob am Samstag noch ein Rad frei ist.

Dazu kommt, was ein Laden sonst von Hand erledigt: Alle vier Stunden gleicht ein Hintergrunddienst die Kleinanzeigen-Inserate ab, eine Chrome-Erweiterung bearbeitet sie in Massen, Kundenanfragen laufen als Chat über das angebundene Postfach. Für den Ladentisch gibt es eine Windows-Version, und alles läuft auf einem eigenen, überwachten Server. Das Ergebnis: ein Betrieb mit einem System statt vieler Werkzeuge — und eine Plattform, die sich so bewährt hat, dass sie heute auch in weiteren Läden läuft.`,
    features: [
      'Jedes Rad hat seinen Weg: Ankauf, Bestand, Verkauf oder Verleih, Rücknahme — mit Belegnummer, Unterschrift und PDF',
      'Verleih online: Verfügbarkeit, Zubehör und Bezahlung per Mollie — die Buchung wird zum Mietvertrag',
      'Zwölf Sprachen mit eigenen Adressen, für Einheimische und Gäste',
      'Kleinanzeigen-Inserate gleichen sich alle vier Stunden ab, Massenbearbeitung per Chrome-Erweiterung',
      'Kundenanfragen als Chat im Verwaltungsbereich statt in verstreuten Postfächern',
      'Rund 28 Bereiche: Kunden, Rechnungen, Ausgaben, Renovierung, Statistik, Export, Backup',
      'Windows-Version für den Ladentisch',
      'Eigener Server, überwacht und gesichert — keine Abhängigkeit von Baukasten-Anbietern',
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
    slug: 'benlirad',
    title: 'Benlirad',
    subtitle: 'Ein Fahrradladen in Lahr, dessen Bestand ohne Umwege online steht',
    category: 'Website & Warenwirtschaft',
    tags: ['Fahrradhandel', 'Live-Bestand', 'Reparatur-Termin', '4 Sprachen'],
    image: '/assets/images/benlirad.webp',
    liveUrl: 'https://benlirad.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Familienbetrieb in Lahr: Was im Laden eingebucht wird, steht ohne Zwischenschritt im Online-Showroom. Dazu Reparatur-Termine, Garantie, vier Sprachen und ein klar benanntes Einzugsgebiet.',
    longDescription: `Benlirad ist ein Familienbetrieb in Lahr im Schwarzwald, seit 2021 mit neuen und geprüften gebrauchten Fahrrädern. Der Laden hatte ein Problem, das viele kleine Händler kennen: Räder kommen und gehen jeden Tag, und eine Website, die von Hand nachgepflegt werden muss, ist immer ein paar Tage hinterher. Gebraucht wurde ein Online-Auftritt, der so aktuell ist wie die Ladenfläche — ohne dass jemand nebenbei eine zweite Liste führt.

Unsere Antwort: Warenwirtschaft und Website sind miteinander verbunden. Wird im Laden ein Rad eingebucht, steht es im Showroom, mit Fotos, Preis und einem Zähler, wie viele Räder gerade verfügbar sind. Wird es verkauft, verschwindet es wieder. Kundinnen und Kunden filtern nach Zustand, Kategorie und Reifengröße und finden ihr Rad, ohne vorher anrufen zu müssen. Die Grundlage dafür entstand bei Bikehaus Freiburg; für Lahr haben wir sie auf einen Laden zugeschnitten, der verkauft und repariert statt vermietet.

Rund um den Showroom steht, was Vertrauen schafft: der Reparatur-Service mit Terminanfrage, eine eigene Seite zur Garantie, das Angebot für den Fahrradankauf, Öffnungszeiten, WhatsApp-Kontakt und eine klare Aussage, für wen der Laden da ist — von Lahr bis Offenburg. Die Seite gibt es auf Deutsch, Englisch, Französisch und Türkisch, damit auch Kundschaft, die lieber in ihrer Sprache liest, sich zurechtfindet.`,
    features: [
      'Online-Showroom mit dem echten Bestand: Fotos, Preise und ein Zähler der verfügbaren Räder',
      'Kein doppeltes Pflegen: eingebucht im Laden heißt sichtbar im Netz, verkauft heißt verschwunden',
      'Passendes Rad finden: Filter nach Zustand, Kategorie und Reifengröße',
      'Reparatur-Service mit Terminanfrage direkt auf der Startseite',
      'Eigene Garantie-Seite — klar, was bei neuen und gebrauchten Rädern gilt',
      'Fahrradankauf als eigenes Angebot, Kontakt auch per WhatsApp',
      'Vier Sprachen: Deutsch, Englisch, Französisch, Türkisch',
      'Einzugsgebiet von Lahr bis Offenburg benannt, damit der Laden regional gefunden wird',
    ],
    techStack: [
      { name: 'Eigene Warenwirtschaft', icon: '🗃️' },
      { name: 'Live-Bestand', icon: '⚡' },
      { name: 'Angular', icon: '🅰️' },
      { name: '.NET', icon: '🔷' },
    ],
    screenshots: [
      '/assets/images/benlirad.webp',
      '/assets/images/benlirad-2.webp',
      '/assets/images/benlirad-3.webp',
    ],
    role: 'Konzept, Entwicklung & Betrieb',
    duration: '2025 – Heute',
    demo: {
      type: 'image',
      url: 'https://benlirad.de',
      screens: [
        '/assets/images/benlirad.webp',
        '/assets/images/benlirad-2.webp',
        '/assets/images/benlirad-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
  {
    slug: 'karaarslan-bike',
    title: 'Karaarslan Bike',
    subtitle: 'Ein Familienbetrieb in Lünen stellt sein Rad-Lager ins Schaufenster des Internets',
    category: 'Full-Stack Web-App',
    tags: ['Full-Stack', 'Angular 17', '.NET 9', 'SSR', '4 Sprachen'],
    image: '/assets/images/karaarslan-bike.webp',
    liveUrl: 'https://karaarslan-bike.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Ein Familienbetrieb in Lünen bekam, was große Händler längst haben: einen Online-Showroom mit dem echten Bestand, eine Verwaltung, die Kosten pro Rad zeigt, und automatische Bewertungsanfragen.',
    longDescription: `Karaarslan Bike ist ein Fahrradladen in Lünen im Ruhrgebiet, ein Familienbetrieb seit 2021. Wie viele kleine Händler verkauft er gebrauchte und neue Räder — und wie viele kleine Händler hing er davon ab, dass Kundschaft ihn über Anzeigenportale findet. Dort gewinnt, wer billig ist; ein eigenes Schaufenster, in dem der Laden selbst bestimmt, wie er auftritt, fehlte. Gebraucht wurde ein Online-Auftritt, der dem Betrieb Gesicht gibt, vor Ort gefunden wird und nie eine Seite zeigt, die nicht mehr stimmt.

Unsere Antwort: Der Showroom zeigt den echten Bestand — derzeit rund 90 Räder — mit Filtern nach Zustand, Kategorie und Preis. Was im Laden eingebucht wird, steht ohne Zwischenschritt online; was verkauft ist, verschwindet. Dazu kommen Zubehör, Neuräder, Ratgeber, FAQ und eine Garantie-Seite, die Vertrauen schafft, bevor jemand anruft. Eigene Seiten für die Orte rund um Lünen sorgen dafür, dass der Laden dort auftaucht, wo Menschen wirklich suchen — und das in vier Sprachen, weil die Kundschaft im Ruhrgebiet nicht nur Deutsch liest.

Hinter dem Schaufenster arbeitet die Verwaltung: Ankauf, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben und Statistik — und pro Rad die Renovierungskosten und eingebauten Teile. So sieht der Inhaber bei jedem Rad, was es wirklich gekostet hat und was es bringt, statt es nur zu vermuten. Nach dem Kauf bittet eine E-Mail-Kampagne die Kundschaft um eine Google-Bewertung, damit aus zufriedenen Käufern sichtbare Empfehlungen werden.

Das Besondere an diesem Projekt: Es ist die Probe aufs Exempel. Dieselbe Plattform, die bei Bikehaus Freiburg entstand, musste sich auf einen neuen Betrieb übertragen lassen — anderer Name, andere Stadt, anderes Sortiment, derselbe Kern. Sie tat es, auf einem eigenen Server mit eigenem Mailserver und ohne Abhängigkeit von Baukasten-Anbietern.`,
    features: [
      'Online-Showroom mit dem echten Bestand und Filtern nach Zustand, Kategorie und Preis',
      'Eingebucht im Laden heißt sichtbar im Netz — verkauft heißt verschwunden',
      'Garantie-Seite, FAQ und Ratgeber, die Fragen beantworten, bevor jemand anruft',
      'Eigene Seiten für die Orte rund um Lünen, in vier Sprachen',
      'Renovierungskosten und Teile pro Rad: Der Inhaber sieht, was ein Rad wirklich bringt',
      'Verwaltung für Ankauf, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben, Statistik',
      'Automatische Bitte um eine Google-Bewertung nach dem Kauf',
      'Eigener Server und eigener Mailserver statt Baukasten-Abhängigkeit',
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
    subtitle: 'Zeiterfassung, die das Arbeitszeitgesetz selbst im Blick hat',
    category: 'Enterprise Software',
    tags: ['Full-Stack', 'Angular 19', '.NET', 'Enterprise'],
    image: '/assets/images/diflux-1.png',
    githubUrl: 'https://github.com/oeztuerkhamza/di-flux-web',
    description:
      'Ein Zeiterfassungssystem, das Pausen, Höchstarbeitszeiten und Jugendschutz automatisch prüft — damit Personalabteilung und Mitarbeitende nicht mehr rechnen und nachschlagen müssen. Entstanden im Team bei Dicom GmbH.',
    longDescription: `Wer Arbeitszeit erfasst, steht schnell zwischen zwei Seiten: Mitarbeitende wollen schnell stempeln, die Personalabteilung muss das Arbeitszeitgesetz einhalten — gesetzliche Pausen, Höchstarbeitszeiten, besondere Regeln für Jugendliche. Mit Tabellen und Handrechnung ist das fehleranfällig und im Prüfungsfall unangenehm. Bei der Dicom GmbH entstand Di-Flux, um diese Last dem System zu geben statt den Menschen.

Unsere Antwort: Das System kennt die Regeln. Es erkennt gesetzlich vorgeschriebene Pausen automatisch, warnt bei Überschreitungen der Höchstarbeitszeit und berücksichtigt altersabhängige Schutzvorschriften. Mitarbeitende sehen in einem übersichtlichen Dashboard ihre Zeiten im Kalender, planen Urlaub, melden Abwesenheiten und bekommen Benachrichtigungen in Echtzeit. Die Personalabteilung verwaltet Mitarbeitende und Rollen und kann Einträge in großen Mengen korrigieren, statt jede Zeile einzeln anzufassen.

Was bei solcher Software den Unterschied macht, liegt unter der Oberfläche: Eine Zeiterfassung, die falsch rechnet, ist schlimmer als keine. Deshalb folgt das Backend einer klaren Schichtenarchitektur mit vollständig durch Unit-Tests abgedeckter Fachlogik, und die Anmeldung läuft abgesichert über Tokens. Das Ergebnis ist ein System, dem man seine Arbeitszeitdaten anvertrauen kann — und das mit jeder Gesetzesänderung nachvollziehbar angepasst werden kann.`,
    features: [
      'Pausen nach Arbeitszeitgesetz werden automatisch erkannt und berechnet',
      'Schutzregeln für Jugendliche werden altersabhängig berücksichtigt',
      'Urlaub und Abwesenheiten im Kalender planen und genehmigen',
      'Überstunden und Statistiken auf einen Blick',
      'Masseneinträge für die Personalabteilung statt Zeile für Zeile',
      'Mitarbeiter und Rollen zentral verwalten',
      'Benachrichtigungen in Echtzeit, abgesicherte Anmeldung',
      'Fachlogik vollständig mit Unit-Tests abgesichert',
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
    subtitle: 'Ein Fotostudio, das seine Termine nicht mehr am Telefon verhandelt',
    category: 'Website & Buchungssystem',
    tags: ['Next.js 16', 'React 19', 'Buchungssystem', '15 Sprachen', 'Local SEO'],
    image: '/assets/images/gkn-portraits.webp',
    liveUrl: 'https://gknportraits.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Ein Bewerbungsfoto-Studio in Freiburg bucht seine Kundschaft heute in drei Klicks — in 15 Sprachen, mit einem Kalender, in dem nie ein Termin doppelt vergeben wird.',
    longDescription: `GKN Portraits ist ein Fotostudio in Freiburg, spezialisiert auf Bewerbungs- und Businessporträts. Solche Shootings sind kurz — und genau deshalb frisst die Terminfindung per Telefon und Nachricht überproportional viel Zeit: Wann passt es, wer kommt wann, hat jemand abgesagt? Gebraucht wurde eine Website, die weniger Imagebroschüre ist als Buchungsschalter: Paket wählen, freien Termin anklicken, Kontaktdaten eintragen, fertig.

Genau so läuft es heute. Drei Schritte, Bestätigung per E-Mail, ein Stornolink für alle, die doch verschieben müssen. Preise gibt es in zwei Listen — privat und geschäftlich —, weil sich nicht der Aufwand unterscheidet, sondern die Nutzung des Bildes. Wer in Freiburg ein Bewerbungsfoto braucht, spricht nicht nur Deutsch: Die Seite gibt es in 15 Sprachen mit übersetzten Adressen, Arabisch mit Rechts-nach-links-Layout. Ein Ratgeber zu Kleidung, Ablauf und Bildauswahl nimmt die Unsicherheit vor dem ersten Termin, und Seiten für die Städte rund um Freiburg sorgen für Sichtbarkeit in der Region.

Die eigentliche Herausforderung lag hinter den Kulissen: Das Studio hat einen Raum und einen Terminplan, und bei kurzen Shootings entscheiden Minuten. Die Buchung prüft deshalb jeden Termin gegen den Kalender, und technisch ist ausgeschlossen, dass derselbe Zeitraum zweimal bestätigt wird — auch wenn zwei Anfragen im selben Moment eingehen. Verwaltet wird alles an einer Stelle, mit einem Login per Einmal-Link statt Passwort, das niemand vergessen oder weitergeben kann.

Das Ergebnis: weniger Telefon, keine Doppelbuchungen, und eine Seite, die in der Region gefunden wird — mit rund 285 indexierbaren Adressen.`,
    features: [
      'Buchung in drei Schritten mit Bestätigungsmail und Stornolink',
      'Studiokalender mit freien Terminen — doppelte Buchung technisch ausgeschlossen',
      '15 Sprachen mit übersetzten Adressen, Arabisch mit Rechts-nach-links-Layout',
      'Zwei Preislisten (privat und geschäftlich) mit drei Paketen',
      'Ratgeber zu Kleidung, Ablauf und Bildauswahl',
      'Seiten für die Städte rund um Freiburg',
      'Login ohne Passwort per Einmal-Link für die Verwaltung',
      'Rund 285 auffindbare Adressen mit sauberer Suchmaschinen-Auszeichnung',
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
    subtitle: 'Ein Hochzeits-DJ wird in einem umkämpften Markt gefunden — und pflegt seine Seite selbst',
    category: 'Website & CMS',
    tags: ['Next.js 16', 'Payload CMS', '8 Sprachen', 'SEO', 'Self-Hosting'],
    image: '/assets/images/dj-veys.webp',
    liveUrl: 'https://dj-veys.de',
    githubUrl: 'https://github.com/oeztuerkhamza/veysl-music',
    description:
      'Ein Hochzeits-DJ aus Stuttgart, der in drei Sprachen durch den Abend führt, hat eine Website bekommen, die in der Suche gegen bezahlte Anzeigen besteht: rund 270 Seiten, acht Sprachen, vom Kunden selbst pflegbar.',
    longDescription: `DJ Veys ist Hochzeits-DJ in Stuttgart. Er führt auf Deutsch, Türkisch und Englisch durch den Abend und spielt live an Saz und Gitarre — für Paare, deren Familien oft mehrere Sprachen und Traditionen zusammenbringen. Der Markt für Hochzeitsdienstleister ist umkämpft: Die Konkurrenz schaltet seit Jahren Anzeigen und füllt die ersten Suchergebnisse. Eine alte Domain mit wenigen Seiten reicht dagegen nicht. Gebraucht wurde ein Auftritt, der gefunden wird, wo Paare tatsächlich suchen — und der vom DJ selbst gepflegt werden kann, ohne bei jeder Änderung einen Entwickler anzurufen.

Unsere Antwort: rund 270 Seiten in acht Sprachen, jede mit übersetzten Adressen. Eigene Seiten für die Städte in Baden-Württemberg und für türkische und islamische Hochzeiten holen genau die Paare ab, die nach genau dieser Kombination suchen. Dahinter steht ein Redaktionssystem unter /admin: Galerie, echte Hochzeiten, Bewertungen, Ratgeber-Artikel und selbst die Bildplätze der Seite pflegt der DJ in einer einzigen Oberfläche. Anfragen, WhatsApp-Kontakte und Terminwünsche laufen dort zusammen — keine Anfrage geht in einem Postfach verloren.

Weil ein DJ von seinem Klang lebt, hört man ihn auf der Seite: Ein Player macht Mixe direkt hörbar. Für Presse und Veranstalter gibt es eine eigene Informationsseite, Fotos übergibt er privat per Link. Und weil Vertrauen im Hochzeitsgeschäft alles ist, stehen Preise bewusst auf Anfrage, und Bewertungszahlen werden erst gezeigt, wenn sie belegt sind.

Betrieben wird die Seite auf einem eigenen Server mit automatisch erneuertem Zertifikat, strenger Sicherheitsrichtlinie und eigenem Mailversand. Das Ergebnis: ein Auftritt, der in Stuttgart und darüber hinaus sichtbar ist — und den sein Besitzer in der Hand hat.`,
    features: [
      'Acht Sprachen mit übersetzten Adressen, für Paare und Familien aller Hintergründe',
      'Rund 270 Seiten: Städte in Baden-Württemberg, Europa-Seiten, türkische und islamische Hochzeiten',
      'Redaktionssystem unter /admin: Galerie, echte Hochzeiten, Bewertungen und Blog selbst pflegbar',
      'Anfragen, Verfügbarkeit und WhatsApp-Kontakt in einer Strecke — nichts geht verloren',
      'Mixe direkt auf der Seite hörbar',
      'Eigene Seite für Presse und Veranstalter, private Foto-Übergabe per Link',
      'Preise auf Anfrage, Bewertungszahlen nur mit Beleg',
      'Eigener Server mit Zertifikats-Automatik, strenger Sicherheitsrichtlinie und eigenem Mailversand',
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
    subtitle: 'Ein Juwelier macht seinen Tagespreis sichtbar — und gewinnt damit Vertrauen',
    category: 'Premium-Website',
    tags: ['Next.js 16', 'React 19', 'Live-Preise', '7 Sprachen', 'Prisma'],
    image: '/assets/images/zerin-gold.webp',
    liveUrl: 'https://zerin-gold.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Goldhändler, Juwelier und Atelier in Freiburg: Eine ruhige Schwarz-Gold-Seite mit Live-Edelmetallpreisen, vier Rechnern und einem Aufschlagsystem, das der Händler selbst steuert — in sieben Sprachen.',
    longDescription: `Zerin Gold ist Goldhändler, Juwelier und Schmuck-Atelier in Freiburg im Breisgau. Beim Gold fragt jede Kundin und jeder Kunde zuerst dasselbe: Was ist mein Stück heute wert, und kann ich dem Händler glauben? Wer nur eine Visitenkarten-Seite hat, beantwortet das nicht. Gebraucht wurde ein Auftritt, der Solidität ausstrahlt, den Tagespreis offen zeigt und Menschen verschiedener Sprachen abholt — denn auch Kundschaft, die lieber auf Türkisch oder Arabisch fragt, kommt mit Altgold und Trauringen.

Unsere Antwort: eine ruhige Schwarz-Gold-Seite mit feiner Serifenschrift und sanften Bewegungen — bei Gold verkauft nicht die Lautstärke, sondern der Eindruck von Verlässlichkeit. Der Preis ist das Herzstück: Die Seite liest die Edelmetallkurse live, rechnet sie über den aktuellen Euro-Kurs in Cent pro Gramm Feingewicht um und zeigt sie als Ticker im Kopf der Seite. Vier Rechner machen daraus Antworten: Was ist mein Altgold wert? Was heißt 585 oder 750 in Karat? Was kostet ein Krügerrand? Und was bringt ein Sparplan? Wer vor dem Besuch weiß, womit er rechnen kann, kommt mit Vertrauen statt mit Skepsis.

Der Händler bleibt dabei Herr seiner Preise: Seine Aufschläge steuert er selbst im geschützten Verwaltungsbereich, abgesichert mit starkem Passwortschutz und Zweitfaktor. Formulare schützt ein unsichtbarer Spamschutz statt nerviger Bilderrätsel. Sieben Sprachen, Arabisch mit Rechts-nach-links-Layout, und rund 290 Seiten für die Suchbegriffe, die in dieser Branche wirklich gesucht werden — von „Gramm Altın“ bis Trauringe.

Das Ergebnis ist sichtbar: Die Seite gilt als Referenz für den Betrieb, und Zerin Gold wie Bikehaus haben ihre Zufriedenheit öffentlich bei Google bewertet. Gehostet wird sie in Deutschland, getestet vor jeder Änderung.`,
    features: [
      'Live-Edelmetallpreise als Ticker, umgerechnet in Cent pro Gramm Feingewicht',
      'Vier Rechner: Altgold-Wert, Karat-Umrechnung, Krügerrand, Sparplan',
      'Aufschläge steuert der Händler selbst im Verwaltungsbereich',
      'Sieben Sprachen, Arabisch mit Rechts-nach-links-Layout',
      'Ruhige Schwarz-Gold-Gestaltung mit feiner Typografie und sanften Bewegungen',
      'Geschützter Verwaltungsbereich mit starkem Passwortschutz und Zweitfaktor',
      'Formulare mit unsichtbarem Spamschutz statt Bilderrätseln',
      'Rund 290 Seiten für die Suchbegriffe der Branche, vor jeder Änderung getestet',
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
    subtitle: 'Eine Hausarztpraxis, die ihre Patientinnen und Patienten in deren Sprache abholt',
    category: 'Praxis-Website',
    tags: ['Astro', 'Statische Website', '10 Sprachen', 'Local SEO', 'DSGVO'],    image: '/assets/images/praxis-gueltekin.webp',
    liveUrl: 'https://www.praxis-gueltekin.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Eine Hausarztpraxis in Hofheim am Taunus beantwortet die wichtigsten Fragen schon vor dem Anruf: wer behandelt, was wird angeboten, wann ist offen — in zehn Sprachen, schnell und datenschutzfreundlich.',
    longDescription: `Die Hausarztpraxis von Fazilet Gültekin liegt in Hofheim am Taunus und betreut gesetzlich wie privat Versicherte — auf Deutsch und Türkisch, in einer Region mit vielen Menschen, die ihre Gesundheitsfragen lieber in ihrer eigenen Sprache nachlesen. Eine Praxis-Website hat eine klare Aufgabe: Fragen beantworten, bevor das Telefon klingelt. Wer behandelt hier? Was wird angeboten? Wann ist geöffnet? Wie komme ich an einen Termin? Und: Kann ich dieser Praxis vertrauen?

Unsere Antwort: eine Seite, die genau das abbildet — und das in zehn Sprachen, Arabisch mit Rechts-nach-links-Layout. Eine Leistungsübersicht stellt den Schwerpunkt Infektiologie und die Diagnostik in der Praxis heraus. Sprechzeiten, der Hinweis auf den Bereitschaftsdienst und der Link zur Terminvereinbarung stehen auf jeder Seite, nicht versteckt in einem Menü. Ein Gesundheitsratgeber mit Fachartikeln und häufigen Fragen beantwortet, was Patientinnen und Patienten ohnehin googeln — und zeigt ihnen dabei, dass hier jemand mit Fachwissen spricht.

Weil es um Gesundheit geht, nimmt die Seite Datenschutz ernst: Die Besucherstatistik läuft erst nach aktiver Einwilligung und lässt sich jederzeit widerrufen, Schriften und Bilder liegen auf dem eigenen Server statt bei Dritten. Gebaut ist sie bewusst schlicht — als schnelle, statische Seite ohne Datenbank und fast ohne Skripte, mit Sicherheits-Einstellungen auf dem Server. Schnell lädt sie auch auf dem Handy im Wartezimmer.

Ergebnis: 93 auffindbare Seiten, die Ärztin, Praxis und Sprechzeiten für Suchmaschinen verständlich auszeichnen — und eine Praxis, die in ihrer Region auch dort gefunden wird, wo man nicht auf Deutsch sucht.`,
    features: [
      'Zehn Sprachen mit übersetzten Adressen, Arabisch mit Rechts-nach-links-Layout',
      'Leistungsübersicht mit Schwerpunkt Infektiologie und Diagnostik in der Praxis',
      'Sprechzeiten, Bereitschaftsdienst-Hinweis und Terminlink auf jeder Seite',
      'Gesundheitsratgeber mit Fachartikeln und häufigen Fragen',
      '93 auffindbare Seiten mit sauberer Auszeichnung für Arzt, Praxis und Sprechzeiten',
      'Besucherstatistik erst nach Einwilligung, jederzeit widerrufbar',
      'Schnelle statische Seite ohne Datenbank, kaum Skripte',
      'Schriften und Bilder vom eigenen Server, Sicherheits-Einstellungen inklusive',
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
    slug: 'seelenfreunde-coaching',
    title: 'Seelenfreunde-Coaching',
    subtitle: 'Eine Website, die Vertrauen schafft: Tierkommunikation und Coaching mit Jessica Hug',
    category: 'Coaching-Website',
    tags: ['Coaching', 'Tierkommunikation', 'Terminanfrage', 'Kursseite', 'Markenauftritt'],
    image: '/assets/images/seelenfreunde-coaching.webp',
    liveUrl: 'https://seelenfreunde-coaching.de',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Jessica Hug begleitet Menschen und ihre Tiere. Ihre Website erklärt ruhig, was ein Tiergespräch ist, schafft Vertrauen und führt mit wenigen Klicks zur Terminanfrage.',
    longDescription: `Jessica Hug begleitet seit 2018 Menschen und ihre Tiere — mit Tierkommunikation, Coaching und Kursen. Ihr Angebot ist erklärungsbedürftig und sehr persönlich: Wer sich auf ein Tiergespräch einlässt, muss zuerst Vertrauen fassen. Gebraucht wurde deshalb keine laute Verkaufsseite, sondern ein Auftritt, der ihre Ruhe und Wärme spürbar macht und Besucherinnen und Besuchern ohne Vorwissen den Einstieg leicht macht.

Unsere Antwort: Die Seite ist wie ein erstes Gespräch aufgebaut. Sie beginnt bei dem, was Tierhalter beschäftigt — plötzliche Unruhe, veränderte Verhaltensweisen, das Gefühl, das eigene Tier nicht ganz zu verstehen — und zeigt dann drei klare Wege: Coaching, Tiergespräch und Kurse. „So läuft ein Tiergespräch ab“ erklärt in drei Schritten, was nach der ersten Nachricht passiert, und der Unterschied zwischen Protokoll und LIVE-Gespräch steht in einfachen Worten da. Qualifikationen, Kundenstimmen und häufige Fragen beantworten Zweifel, bevor sie jemand aussprechen muss.

Jedes Angebot hat seine eigene Seite mit genau einem nächsten Schritt. Die Terminseite führt mit einem Klick zur Anfrage, auch für Pakete. Der Tierkommunikationskurs zeigt seine drei Module und nimmt Interessierte auf eine Warteliste, solange er überarbeitet wird. Das jährliche Seminar „Open Heart“ bekommt seine eigene Bühne. Farben, Schrift und sanfte Bewegung folgen der Marke: warm, erdig, ruhig. Datenschutz, Cookie-Hinweis und der Hinweis, dass die Angebote keine tierärztliche Behandlung ersetzen, gehören von Anfang an dazu.`,
    features: [
      'Einstieg über die Fragen der Tierhalter statt über Fachbegriffe',
      'Drei klare Wege — Coaching, Tiergespräch, Kurse — jeweils mit einem nächsten Schritt',
      '„So läuft ein Tiergespräch ab“: drei Schritte, Protokoll oder LIVE',
      'Vertrauen durch Qualifikationen, Kundenstimmen und häufige Fragen',
      'Terminanfrage mit einem Klick, auch für Pakete',
      'Kursseite mit drei Modulen und Warteliste mit Bonus',
      'Eigene Seite für das jährliche Seminar „Open Heart“',
      'Warme Markenwelt: Farben, Schrift und Bewegung wie ein ruhiger Raum',
      'Datenschutz, Cookie-Hinweis und Haftungshinweis von Anfang an',
    ],
    techStack: [
      { name: 'Statische Website', icon: '🚀' },
      { name: 'Eigene Schriften', icon: '🔤' },
      { name: 'Strukturierte Daten (SEO)', icon: '🧬' },
    ],
    screenshots: [
      '/assets/images/seelenfreunde-coaching.webp',
      '/assets/images/seelenfreunde-coaching-2.webp',
      '/assets/images/seelenfreunde-coaching-3.webp',
    ],
    role: 'Konzept, Design & Umsetzung',
    duration: '2026',
    demo: {
      type: 'image',
      url: 'https://seelenfreunde-coaching.de',
      screens: [
        '/assets/images/seelenfreunde-coaching.webp',
        '/assets/images/seelenfreunde-coaching-2.webp',
        '/assets/images/seelenfreunde-coaching-3.webp',
      ],
      note: 'Live-System — Einbettung serverseitig gesperrt, daher Screenshots',
    },
  },
  {
    slug: 'kulturplattform-freiburg',
    title: 'Kulturplattform Freiburg',
    subtitle: 'Ein Kulturverein pflegt seine Plattform selbst — ohne für jeden Text einen Entwickler zu brauchen',
    category: 'Web-App / CMS',
    tags: ['Web-App', 'React', '.NET 10', 'CQRS', 'CMS'],
    image: '/assets/images/kulturplattform.webp',
    liveUrl: 'https://kulturplattformfreiburg.org',
    githubUrl: 'https://github.com/oeztuerkhamza',
    description:
      'Ein Kulturverein in Freiburg verwaltet Veranstaltungen, Kurse, Ehrenamt und Newsletter an einem Ort. Der Vorstand pflegt Inhalte und Übersetzungen selbst, der Newsletter ist rechtssicher aufgebaut.',
    longDescription: `Die Kulturplattform Freiburg e. V. organisiert Veranstaltungen, Kurse und Begegnungsformate in Freiburg — getragen von Menschen, die das neben Beruf und Familie tun. Für so einen Verein ist eine Website nur dann eine Hilfe, wenn der Vorstand sie selbst pflegen kann: ein neuer Termin, ein geänderter Kurs, ein Text auf Deutsch und Türkisch — ohne jedes Mal jemanden zu fragen, der programmieren kann. Und der Newsletter, der Menschen zusammenhält, muss rechtlich einwandfrei laufen.

Unsere Antwort: eine Plattform, die abbildet, was der Verein tatsächlich tut. Aktivitäten mit Kategorien, Suche und Detailseiten, Kursangebote, Partner, Satzung, Spenden und ein Formular für Menschen, die sich ehrenamtlich engagieren möchten. Der Vorstand pflegt alles im Verwaltungsbereich, auch die Übersetzungen: Sie liegen in der Datenbank, nicht im Programmtext. Ein neuer Text auf Deutsch und Türkisch braucht damit keine Programmierung und keine Veröffentlichung durch einen Entwickler.

Der Newsletter ist kein Mailto-Link, sondern ein vollständiger Ablauf: Wer sich einträgt, bestätigt per Link (Double-Opt-in), jede Mail enthält eine Abmeldemöglichkeit, Kampagnen gibt es pro Sprache und der Versand läuft in Stapeln, damit Postfächer nicht überlastet werden. Fällt der Hauptversanddienst aus, springt ein zweiter ein. So kommt, was der Verein sagen will, auch an.

Weil ein Verein auf Jahre plant, ist die Technik darunter auf Wartbarkeit gebaut: klare Schichten und getestete Fachlogik, damit spätere Änderungen nicht alles Bestehende gefährden. Betrieben wird die Plattform auf einem eigenen Server mit eigenen Postfächern, mit Sicherungs- und Wiederherstellungsskripten. Das Ergebnis: ein Verein, der seine digitale Arbeit selbst in der Hand hat.`,
    features: [
      'Aktivitäten mit Kategorien, Suche und Detailseiten',
      'Kursangebote, Partner, Satzung, Spenden und Formular für Ehrenamtliche',
      'Zweisprachig (Deutsch und Türkisch) — Übersetzungen pflegt der Vorstand selbst im Verwaltungsbereich',
      'Newsletter mit Bestätigung per Link, Abmeldung in jeder Mail und Kampagnen pro Sprache',
      'Versand in Stapeln mit zweitem Versandweg als Rückfall',
      'Klare Struktur und getestete Fachlogik für spätere Änderungen',
      'Eigener Server mit eigenen Postfächern',
      'Sicherungs- und Wiederherstellungsskripte inklusive',
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
