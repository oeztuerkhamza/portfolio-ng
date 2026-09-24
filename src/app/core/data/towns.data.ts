/**
 * Ortsseiten /de/webdesign/<slug> für das Einzugsgebiet.
 *
 * Nur Deutsch: gesucht wird „Webdesign Emmendingen", nicht „web design
 * Emmendingen". Jede Seite hat eigenen Text zum Ort (Branchen, Anfahrt,
 * passende Leistungen) — reine Vorlagen mit getauschtem Ortsnamen wertet
 * Google als Doorway-Pages ab.
 *
 * Fahrzeiten sind gerundete Richtwerte ab Freiburg-Stühlinger.
 */
export type ProductFocus = 'cards' | 'web' | 'sh' | 'abo';

export interface Town {
  slug: string;
  name: string;
  /** Kurzform für Überschriften, z. B. „Breisach" statt „Breisach am Rhein". */
  short: string;
  district: string;
  region: string;
  km: number;
  minutes: number;
  lat: number;
  lng: number;
  /** Einleitung unter der H1. */
  intro: string;
  /** Absatz „Betriebe vor Ort" — was dort typisch ist und was hilft. */
  local: string;
  /** Reihenfolge der Produkte auf der Seite. */
  focus: ProductFocus[];
  /** Kurzer Satz je Produkt, auf den Ort bezogen. */
  angles: Partial<Record<ProductFocus, string>>;
  faqs: { q: string; a: string }[];
  /** Nachbarorte (Slugs) für interne Links. */
  near: string[];
}

export const TOWNS: Town[] = [
  {
    slug: 'freiburg',
    name: 'Freiburg im Breisgau',
    short: 'Freiburg',
    district: 'Stadtkreis Freiburg',
    region: 'Breisgau',
    km: 0,
    minutes: 0,
    lat: 47.999,
    lng: 7.842,
    intro:
      'Breisgau Digital sitzt in Freiburg. Wir bauen Websites für Betriebe aus der Stadt, richten Google-Bewertungskarten ein und automatisieren Heizung, Licht und Zutritt — persönlich, meist direkt bei Ihnen im Laden, in der Praxis oder im Büro.',
    local:
      'Ob Café in der Altstadt, Friseur in der Wiehre, Physiopraxis in Herdern, Werkstatt in Haslach oder Ferienwohnung in St. Georgen: In Freiburg entscheidet Google oft darüber, wer angerufen wird. Viele Suchen enden in der Karte mit drei Einträgen — dort stehen die Betriebe mit gepflegtem Profil, aktuellen Fotos und vielen frischen Bewertungen. Genau da setzen wir an. Termine vor Ort machen wir im ganzen Stadtgebiet, von Zähringen bis Vauban, von Littenweiler bis Landwasser.',
    focus: ['cards', 'web', 'abo', 'sh'],
    angles: {
      cards: 'Karte auf den Tresen, Gäste halten das Handy dran — so kommen in der Innenstadt schnell neue Google-Bewertungen zusammen.',
      web: 'Eine Website, die auf dem Handy in Sekunden lädt und bei „… in Freiburg" gefunden wird, mit Ortsbezug statt Baukasten-Vorlage.',
      abo: 'Website, Karten und Pflege zum festen Monatspreis — ohne große Anfangsinvestition.',
      sh: 'Heizung nach Öffnungszeiten, Self-Check-in für Ferienwohnungen, Licht fürs Schaufenster.',
    },
    faqs: [
      {
        q: 'Kommen Sie für ein Gespräch zu uns in den Betrieb?',
        a: 'Ja. In Freiburg kommen wir grundsätzlich vorbei — das Erstgespräch ist kostenlos und dauert meist 30 bis 45 Minuten.',
      },
      {
        q: 'Wie schnell steht eine Website für einen Freiburger Betrieb?',
        a: 'Eine übersichtliche Website mit bis zu fünf Seiten ist in der Regel in drei bis vier Wochen online, abhängig davon, wie schnell Texte und Fotos vorliegen.',
      },
    ],
    near: ['emmendingen', 'bad-krozingen', 'waldkirch', 'breisach'],
  },
  {
    slug: 'emmendingen',
    name: 'Emmendingen',
    short: 'Emmendingen',
    district: 'Landkreis Emmendingen',
    region: 'Breisgau',
    km: 18,
    minutes: 20,
    lat: 48.121,
    lng: 7.849,
    intro:
      'Websites, Google-Bewertungskarten und Smart Home für Betriebe in Emmendingen und im Landkreis — von Freiburg aus in rund 20 Minuten bei Ihnen.',
    local:
      'Emmendingen lebt vom Handel in der Innenstadt, von Handwerksbetrieben und Praxen, die ihre Kundschaft aus dem ganzen Landkreis holen — aus Teningen, Denzlingen, Kenzingen oder Herbolzheim. Wer dort sucht, tippt oft „in der Nähe" statt eines Ortsnamens. Damit Sie dann oben erscheinen, braucht es ein vollständiges Google-Profil, eine Website mit klaren Angaben zu Ort und Leistungen und regelmäßig neue Bewertungen.',
    focus: ['cards', 'web', 'abo', 'sh'],
    angles: {
      cards: 'Für Handwerker als Schlüsselanhänger: nach dem Auftrag kurz hinhalten, der Kunde bewertet direkt vor Ort.',
      web: 'Eine Website, die Ihre Leistungen und Ihr Einzugsgebiet im Landkreis klar benennt — so findet Google Sie auch in Teningen oder Kenzingen.',
      abo: 'Für Betriebe, die sich um nichts kümmern wollen: Website, Karten und Pflege in einem Monatsbetrag.',
      sh: 'Smarte Heizung und Zutritt für Praxen und Büros, funkbasiert nachgerüstet.',
    },
    faqs: [
      {
        q: 'Betreuen Sie auch Betriebe in Teningen, Denzlingen oder Kenzingen?',
        a: 'Ja, den ganzen Landkreis Emmendingen. Termine vor Ort sind ohne Anfahrtspauschale möglich.',
      },
      {
        q: 'Lohnen sich Bewertungskarten für einen Handwerksbetrieb?',
        a: 'Gerade dort: Kunden sind nach einem guten Auftrag zufrieden, vergessen die Bewertung aber. Mit dem Schlüsselanhänger ist sie in 30 Sekunden erledigt, solange Sie noch vor Ort sind.',
      },
    ],
    near: ['freiburg', 'waldkirch', 'lahr'],
  },
  {
    slug: 'waldkirch',
    name: 'Waldkirch',
    short: 'Waldkirch',
    district: 'Landkreis Emmendingen',
    region: 'Elztal',
    km: 18,
    minutes: 25,
    lat: 48.093,
    lng: 7.962,
    intro:
      'Digitale Sichtbarkeit für Betriebe in Waldkirch und im Elztal: Websites, Google-Bewertungskarten und Smart Home — persönlich betreut aus Freiburg.',
    local:
      'Im Elztal treffen Handwerk und Tourismus aufeinander: Gastgeber am Kandel und im Simonswälder Tal, Gasthäuser, Werkstätten und Läden in der Waldkircher Altstadt. Gäste planen ihren Ausflug auf dem Handy und wählen nach Bewertungen und Fotos. Ein aktuelles Google-Profil mit Öffnungszeiten, Bildern und ehrlichen Bewertungen ist hier oft wichtiger als jede Anzeige.',
    focus: ['cards', 'web', 'sh', 'abo'],
    angles: {
      cards: 'Tischaufsteller im Gasthaus oder Karte an der Rezeption — Gäste bewerten noch am Tisch.',
      web: 'Eine Website, die auch Ausflügler und Wanderer abholt: Anfahrt, Öffnungszeiten und Angebote auf einen Blick.',
      sh: 'Self-Check-in und Heizung nach Belegung für Ferienwohnungen im Elztal — keine Schlüsselübergabe, keine Heizkosten für leere Zimmer.',
      abo: 'Ein fester Monatsbetrag für Website, Karten und Pflege des Google-Profils.',
    },
    faqs: [
      {
        q: 'Richten Sie Self-Check-in für Ferienwohnungen ein?',
        a: 'Ja. Wir bauen funkbasierte Türschlösser und Heizungsthermostate ein und verbinden sie mit Ihrem Belegungskalender. Alles, was fest an 230 V angeschlossen wird, übernimmt ein Elektrofachbetrieb.',
      },
      {
        q: 'Kommen Sie auch ins Simonswälder Tal oder nach Elzach?',
        a: 'Ja, das ganze Elztal gehört zu unserem Einzugsgebiet für Termine vor Ort.',
      },
    ],
    near: ['emmendingen', 'freiburg', 'titisee-neustadt'],
  },
  {
    slug: 'breisach',
    name: 'Breisach am Rhein',
    short: 'Breisach',
    district: 'Landkreis Breisgau-Hochschwarzwald',
    region: 'Kaiserstuhl',
    km: 27,
    minutes: 30,
    lat: 48.029,
    lng: 7.583,
    intro:
      'Websites, Bewertungskarten und Smart Home für Betriebe in Breisach und am Kaiserstuhl — mehrsprachig, damit auch Gäste aus Frankreich Sie finden.',
    local:
      'Breisach liegt direkt an der Grenze, Colmar ist näher als Karlsruhe. Weingüter, Straußwirtschaften, Hotels und Läden rund um das Münster haben viele Gäste aus dem Elsass und aus der Schweiz. Wer seine Website auch auf Französisch anbietet und auf Google gute Bewertungen in mehreren Sprachen sammelt, gewinnt diese Gäste. Genau das richten wir ein — vom Weingut in Ihringen bis zur Pension in Vogtsburg.',
    focus: ['web', 'cards', 'abo', 'sh'],
    angles: {
      web: 'Website auf Deutsch und Französisch, mit Weinverkauf, Öffnungszeiten der Straußi oder Zimmeranfrage.',
      cards: 'Bewertungskarte auf dem Probiertisch — Gäste aus dem Elsass bewerten in ihrer Sprache, das hilft bei der Suche von drüben.',
      abo: 'Website, Karten und Pflege zum Monatspreis, gerade für die Saison planbar.',
      sh: 'Smarte Heizung und Zutritt für Ferienwohnungen und Gästezimmer am Kaiserstuhl.',
    },
    faqs: [
      {
        q: 'Können Sie die Website auch auf Französisch umsetzen?',
        a: 'Ja. Unsere Websites sind von Grund auf mehrsprachig gebaut; Französisch, Englisch oder weitere Sprachen lassen sich ergänzen, jeweils mit eigener Adresse für Google.',
      },
      {
        q: 'Betreuen Sie Weingüter am ganzen Kaiserstuhl?',
        a: 'Ja, von Ihringen und Vogtsburg bis Endingen und Sasbach — Termine vor Ort sind kein Problem.',
      },
    ],
    near: ['freiburg', 'bad-krozingen', 'emmendingen'],
  },
  {
    slug: 'bad-krozingen',
    name: 'Bad Krozingen',
    short: 'Bad Krozingen',
    district: 'Landkreis Breisgau-Hochschwarzwald',
    region: 'Markgräflerland',
    km: 20,
    minutes: 25,
    lat: 47.917,
    lng: 7.702,
    intro:
      'Websites, Google-Bewertungskarten und Smart Home für Praxen, Kurbetriebe, Gastgeber und Handel in Bad Krozingen.',
    local:
      'Als Kurort hat Bad Krozingen viele Praxen, Therapie- und Gesundheitsbetriebe, dazu Cafés, Hotels und Ferienwohnungen für Kurgäste. Wer neu in der Stadt ist, sucht auf dem Handy nach „Physiotherapie in der Nähe" oder „Café Bad Krozingen" und entscheidet nach Bewertungen. Eine klare Website mit Terminhinweisen und ein gepflegtes Google-Profil bringen hier direkt Anrufe.',
    focus: ['cards', 'web', 'sh', 'abo'],
    angles: {
      cards: 'Karte am Empfang der Praxis — Patienten bewerten nach dem Termin, ohne zu suchen.',
      web: 'Eine Website mit Leistungen, Terminhinweisen und Anfahrt, barrierearm und auf dem Handy schnell.',
      sh: 'Heizung nach Sprechzeiten und Self-Check-in für Ferienwohnungen von Kurgästen.',
      abo: 'Website, Karten und Pflege Ihres Google-Profils zum festen Monatspreis.',
    },
    faqs: [
      {
        q: 'Dürfen Praxen Bewertungskarten auslegen?',
        a: 'Ja, solange Sie für eine Bewertung nichts anbieten und alle Patienten gleich fragen. Die Karte führt nur zum Bewertungsformular; was jemand schreibt, entscheidet er selbst.',
      },
      {
        q: 'Betreuen Sie auch Hartheim, Ehrenkirchen oder Heitersheim?',
        a: 'Ja, das ganze südliche Breisgau und das Markgräflerland gehören zu unserem Gebiet.',
      },
    ],
    near: ['staufen', 'muellheim', 'freiburg', 'breisach'],
  },
  {
    slug: 'staufen',
    name: 'Staufen im Breisgau',
    short: 'Staufen',
    district: 'Landkreis Breisgau-Hochschwarzwald',
    region: 'Markgräflerland',
    km: 22,
    minutes: 30,
    lat: 47.882,
    lng: 7.731,
    intro:
      'Digitale Sichtbarkeit für Cafés, Weingüter, Läden und Gastgeber in Staufen und im Münstertal — Websites, Bewertungskarten und Smart Home aus einer Hand.',
    local:
      'Die Fauststadt mit ihrer Altstadt und der Burgruine zieht Tagesgäste und Wanderer an, dazu kommen Weingüter und Gastgeber im Münstertal. Die meisten Besucher planen spontan auf dem Handy: Wo gibt es Kaffee, wo ist heute geöffnet, wo schmeckt es? Wer dort mit Fotos, Öffnungszeiten und vielen Bewertungen auftaucht, bekommt die Gäste.',
    focus: ['cards', 'web', 'sh', 'abo'],
    angles: {
      cards: 'Tischaufsteller im Café oder Weinstube — Tagesgäste bewerten, bevor sie weiterziehen.',
      web: 'Eine schlanke Website mit Öffnungszeiten, Karte und Anfahrt, die auch im Funkloch am Berg schnell lädt.',
      sh: 'Self-Check-in und Heizung nach Belegung für Ferienwohnungen im Münstertal.',
      abo: 'Ein Monatsbetrag für Website, Karten und Google-Profil — planbar über die Saison.',
    },
    faqs: [
      {
        q: 'Wie schnell bringen Bewertungskarten Ergebnisse?',
        a: 'Das hängt von der Zahl Ihrer Gäste ab. Betriebe mit Laufkundschaft sehen oft schon in den ersten Wochen mehr neue Bewertungen als im ganzen Jahr davor.',
      },
      {
        q: 'Kommen Sie auch ins Münstertal?',
        a: 'Ja, Staufen, Münstertal und das Umland besuchen wir regelmäßig vor Ort.',
      },
    ],
    near: ['bad-krozingen', 'muellheim', 'freiburg'],
  },
  {
    slug: 'muellheim',
    name: 'Müllheim',
    short: 'Müllheim',
    district: 'Landkreis Breisgau-Hochschwarzwald',
    region: 'Markgräflerland',
    km: 32,
    minutes: 30,
    lat: 47.808,
    lng: 7.63,
    intro:
      'Websites, Google-Bewertungskarten und Smart Home für Betriebe in Müllheim und im Markgräflerland — Weingüter, Handwerk, Praxen und Handel.',
    local:
      'Das Markgräflerland ist Weinland, und Müllheim ist sein Mittelpunkt: Weingüter mit Hofverkauf, Gasthäuser, dazu Handwerk und Handel für die Orte ringsum bis Neuenburg am Rhein. Viele Kunden kommen aus der Schweiz und aus Frankreich. Eine Website mit Onlineshop oder Weinbestellung, mehrsprachig und mit klaren Öffnungszeiten, holt diese Kunden ab — Bewertungskarten sorgen dafür, dass man Sie auf Google wiederfindet.',
    focus: ['web', 'cards', 'abo', 'sh'],
    angles: {
      web: 'Website mit Weinbestellung oder Onlineshop, auf Wunsch auf Deutsch, Französisch und Englisch.',
      cards: 'Karte im Hofladen oder auf der Weinprobe — Gäste bewerten, solange der Eindruck frisch ist.',
      abo: 'Website, Karten und Pflege zum Monatspreis, ohne große Anfangsinvestition.',
      sh: 'Smarte Heizung und Zutritt für Gästezimmer und Ferienwohnungen.',
    },
    faqs: [
      {
        q: 'Können Kunden über die Website Wein bestellen?',
        a: 'Ja. Wir bauen einen einfachen Shop mit Bezahlung, Abholung oder Versand — und Sie pflegen Sortiment und Preise selbst.',
      },
      {
        q: 'Betreuen Sie auch Neuenburg, Auggen oder Badenweiler?',
        a: 'Ja, das ganze Markgräflerland gehört zu unserem Gebiet für Termine vor Ort.',
      },
    ],
    near: ['bad-krozingen', 'staufen', 'loerrach'],
  },
  {
    slug: 'loerrach',
    name: 'Lörrach',
    short: 'Lörrach',
    district: 'Landkreis Lörrach',
    region: 'Dreiländereck',
    km: 65,
    minutes: 50,
    lat: 47.614,
    lng: 7.664,
    intro:
      'Websites, Bewertungskarten und Smart Home für Betriebe in Lörrach und im Dreiländereck — sichtbar für Kunden aus Deutschland, der Schweiz und Frankreich.',
    local:
      'In Lörrach, Weil am Rhein und Rheinfelden kaufen viele Kunden aus Basel und dem Elsass ein. Sie suchen auf Google, oft auf Französisch oder Englisch, und vergleichen Bewertungen, Preise und Öffnungszeiten. Handel, Gastronomie und Dienstleister, die dort mehrsprachig und mit vielen guten Bewertungen auftauchen, holen sich diese Kunden. Termine in Lörrach machen wir gern vor Ort, alles Weitere läuft per Video und Telefon.',
    focus: ['web', 'cards', 'abo', 'sh'],
    angles: {
      web: 'Mehrsprachige Website für Kunden aus drei Ländern, mit eigener Adresse je Sprache für Google.',
      cards: 'Bewertungskarte an der Kasse — auch Schweizer und französische Kunden bewerten mit einem Handgriff.',
      abo: 'Ein fester Monatsbetrag für Website, Karten und Pflege.',
      sh: 'Heizung nach Öffnungszeiten und Energieübersicht für Läden und Büros.',
    },
    faqs: [
      {
        q: 'Kommen Sie für Termine bis nach Lörrach?',
        a: 'Ja. Erstgespräch und Einrichtung machen wir gern vor Ort, die laufende Betreuung meist per Video und Telefon.',
      },
      {
        q: 'Hilft eine französische Seite wirklich bei Kunden aus dem Elsass?',
        a: 'Ja: Google zeigt Nutzern bevorzugt Seiten in ihrer Sprache. Eine eigene französische Version mit passenden Suchbegriffen macht Sie für diese Kunden erst sichtbar.',
      },
    ],
    near: ['muellheim', 'bad-krozingen', 'freiburg'],
  },
  {
    slug: 'offenburg',
    name: 'Offenburg',
    short: 'Offenburg',
    district: 'Ortenaukreis',
    region: 'Ortenau',
    km: 70,
    minutes: 45,
    lat: 48.473,
    lng: 7.944,
    intro:
      'Websites, Google-Bewertungskarten und Smart Home für Mittelstand, Handwerk und Handel in Offenburg und der Ortenau.',
    local:
      'Die Ortenau ist stark im Mittelstand: Handwerksbetriebe, Dienstleister und Einzelhandel mit Kundschaft aus dem ganzen Kreis zwischen Kehl und Gengenbach. Viele haben eine Website, die seit Jahren nicht angepasst wurde, langsam lädt und auf dem Handy schwer zu bedienen ist. Ein Relaunch mit klaren Leistungen, Referenzen und Kontaktwegen bringt hier oft schnell mehr Anfragen.',
    focus: ['web', 'cards', 'abo', 'sh'],
    angles: {
      web: 'Relaunch der bestehenden Website: moderner, schneller, mit Ihren Referenzen — ohne Ihre bisherigen Google-Platzierungen zu verlieren.',
      cards: 'Schlüsselanhänger für Monteure und Außendienst: Bewertung direkt nach dem Auftrag.',
      abo: 'Website, Hosting, Pflege und Bewertungskarten zum Monatspreis.',
      sh: 'Heizung, Licht und Zutritt für Büros und Werkstätten, nachgerüstet ohne Umbau.',
    },
    faqs: [
      {
        q: 'Verlieren wir bei einem Relaunch unsere Google-Platzierungen?',
        a: 'Nicht, wenn man es richtig macht: Wir übernehmen bestehende Adressen oder leiten sie sauber weiter und behalten gut rankende Inhalte.',
      },
      {
        q: 'Betreuen Sie auch Lahr, Kehl oder Gengenbach?',
        a: 'Ja, die ganze Ortenau. Erstgespräche machen wir vor Ort, laufende Abstimmung meist per Video.',
      },
    ],
    near: ['lahr', 'emmendingen', 'freiburg'],
  },
  {
    slug: 'lahr',
    name: 'Lahr/Schwarzwald',
    short: 'Lahr',
    district: 'Ortenaukreis',
    region: 'Ortenau',
    km: 50,
    minutes: 40,
    lat: 48.339,
    lng: 7.873,
    intro:
      'Websites, Bewertungskarten und Smart Home für Betriebe in Lahr und der südlichen Ortenau — persönlich betreut, auch vor Ort.',
    local:
      'Lahr verbindet eine lebendige Innenstadt mit Handel und Gastronomie mit vielen Handwerks- und Dienstleistungsbetrieben im Umland, von Friesenheim bis Seelbach. Hier zählt, wer bei Google zuerst mit guten Bewertungen erscheint, und wer eine Website hat, die auf dem Handy in Sekunden die wichtigsten Fragen beantwortet: Was bieten Sie an, wann haben Sie geöffnet, wie erreicht man Sie?',
    focus: ['cards', 'web', 'abo', 'sh'],
    angles: {
      cards: 'Karte oder Aufkleber an der Kasse — so wachsen Ihre Google-Bewertungen ohne Nachfragen.',
      web: 'Eine Website, die Leistungen, Öffnungszeiten und Kontakt auf dem Handy sofort zeigt.',
      abo: 'Ein fester Monatsbetrag für Website, Karten und Pflege.',
      sh: 'Smarte Heizung und Energieübersicht für Läden und Büros.',
    },
    faqs: [
      {
        q: 'Wie viel kostet eine Website für einen kleinen Betrieb in Lahr?',
        a: 'Eine Firmen-Website gibt es bei uns zum Festpreis; alternativ im Digital-Abo zum Monatspreis, dann ohne große Anfangsinvestition.',
      },
      {
        q: 'Machen Sie Termine vor Ort in Lahr?',
        a: 'Ja, Erstgespräch und Einrichtung gern bei Ihnen im Betrieb.',
      },
    ],
    near: ['offenburg', 'emmendingen', 'freiburg'],
  },
  {
    slug: 'titisee-neustadt',
    name: 'Titisee-Neustadt',
    short: 'Titisee-Neustadt',
    district: 'Landkreis Breisgau-Hochschwarzwald',
    region: 'Hochschwarzwald',
    km: 32,
    minutes: 35,
    lat: 47.918,
    lng: 8.214,
    intro:
      'Websites, Google-Bewertungskarten und Smart Home für Gastgeber, Gastronomie und Handel in Titisee-Neustadt und im Hochschwarzwald.',
    local:
      'Am Titisee und im Hochschwarzwald hängt fast alles am Tourismus: Hotels, Pensionen, Ferienwohnungen, Restaurants und Läden an der Seestraße. Gäste buchen und wählen nach Bewertungen auf Google und Buchungsportalen. Wer selbst eine gute Website mit Direktanfrage hat, spart Provisionen — und wer seine Ferienwohnung mit Self-Check-in betreibt, spart sich die Schlüsselübergabe am Abend.',
    focus: ['sh', 'cards', 'web', 'abo'],
    angles: {
      sh: 'Self-Check-in per Code, Heizung nach Belegung und Meldungen bei offenem Fenster — für Ferienwohnungen ohne Anreise am Abend.',
      cards: 'Karte in der Ferienwohnung oder am Tisch — Gäste bewerten noch während des Urlaubs.',
      web: 'Eigene Website mit Zimmern, Preisen und Direktanfrage — weniger Provision an Buchungsportale.',
      abo: 'Website, Karten und Pflege zum festen Monatspreis, auch für kleine Gastgeber.',
    },
    faqs: [
      {
        q: 'Funktioniert Self-Check-in auch bei schwachem Internet?',
        a: 'Ja. Wir setzen Schlösser ein, die Codes auch ohne dauerhafte Internetverbindung prüfen; Internet braucht es nur zum Übertragen neuer Codes.',
      },
      {
        q: 'Betreuen Sie auch Hinterzarten, Schluchsee oder Lenzkirch?',
        a: 'Ja, der Hochschwarzwald gehört zu unserem Gebiet für Termine vor Ort.',
      },
    ],
    near: ['freiburg', 'waldkirch', 'staufen'],
  },
];

export function townBySlug(slug: string): Town | undefined {
  return TOWNS.find((t) => t.slug === slug);
}
