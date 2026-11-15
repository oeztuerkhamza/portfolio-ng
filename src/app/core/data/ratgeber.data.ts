import { WEBSITE_PRICE_FROM, formatAmount } from './company.data';
import { UPDATE_PACKAGES } from './homepage-update.data';
import { MAINTENANCE_PLANS, MAINTENANCE_PRICE_FROM } from './maintenance.data';

/**
 * Ratgeber unter /de/ratgeber — nur auf Deutsch, wie die Ortsseiten.
 *
 * Wenige Artikel, dafür aus eigener Arbeit: Fallstudien mit echten Zahlen
 * und Preise, die aus demselben Katalog kommen wie die übrige Website. Ein
 * Artikel, der „Webdesign ist wichtig" erklärt, gehört nicht hierher.
 *
 * Zahlen über Kunden nur mit deren Einverständnis. Preise nie als Zahl
 * eintippen, sondern über `eur()` aus dem Katalog — sonst steht im Ratgeber
 * ein anderer Preis als auf /leistungen, sobald sich im Admin etwas ändert.
 */

export interface RatgeberSection {
  h: string;
  p: string[];
  list?: string[];
}

export interface RatgeberArticle {
  slug: string;
  /** Überschrift auf der Seite (H1). */
  title: string;
  /** <title> — kürzer, mit Suchbegriff vorn. */
  seoTitle: string;
  description: string;
  /** ISO-Datum. */
  published: string;
  updated?: string;
  minutes: number;
  image: string;
  /** Referenz, zu der der Artikel gehört (verlinkt am Ende). */
  project?: string;
  /** Ortsseite, zu der der Artikel gehört. */
  town?: string;
  lead: string;
  sections: RatgeberSection[];
}

const eur = (n: number) => `${formatAmount(n, 'de')} €`;
const upd = (id: string) => UPDATE_PACKAGES.find((u) => u.id === id)!;
const wart = (id: string) => MAINTENANCE_PLANS.find((m) => m.id === id)!;

export const RATGEBER: RatgeberArticle[] = [
  {
    slug: 'website-kosten-freiburg',
    title: 'Was kostet eine Website für einen kleinen Betrieb in Freiburg?',
    seoTitle: 'Website Kosten Freiburg: Festpreise für kleine Betriebe',
    description: `Was eine Firmen-Website in Freiburg kostet: neue Website ab ${eur(WEBSITE_PRICE_FROM)}, Homepage-Update ab ${eur(upd('start').price)}, Wartung ab ${eur(MAINTENANCE_PRICE_FROM)} im Monat — und wovon der Preis abhängt.`,
    published: '2026-10-23',
    minutes: 6,
    image: '/assets/images/stock/designer-laptop.webp',
    town: 'freiburg',
    lead:
      'Die ehrliche Antwort ist „kommt darauf an" — aber nicht so sehr, wie viele denken. Hier steht, was eine Website bei uns kostet, wovon der Preis abhängt und welche Kosten danach noch kommen. Alle Preise sind Endpreise; als Kleinunternehmer (§ 19 UStG) weisen wir keine Umsatzsteuer aus.',
    sections: [
      {
        h: 'Die Preise auf einen Blick',
        p: [
          'Wir arbeiten zum Festpreis. Sie bekommen vor Projektstart ein schriftliches Angebot, und dabei bleibt es — auch wenn wir länger brauchen als geplant.',
        ],
        list: [
          `Neue Firmen-Website: ab ${eur(WEBSITE_PRICE_FROM)}`,
          `Homepage-Update Start (bis zu 3 Seiten aktualisiert, Handy-Ansicht, Impressum und Datenschutz auf Stand): ${eur(upd('start').price)}, fertig in ${upd('start').days} Werktagen`,
          `Homepage-Update Standard (bis zu 5 Seiten neu gestaltet, Basis-SEO, Google-Profil geprüft): ${eur(upd('standard').price)}, fertig in ${upd('standard').days} Werktagen`,
          `Homepage-Update Komplett (Relaunch mit bis zu 10 Seiten, Ratgeber-Bereich und zwei Ortsseiten): ${eur(upd('komplett').price)}, fertig in ${upd('komplett').days} Werktagen`,
          `Wartung und Pflege: ${eur(wart('basis').monthly)}, ${eur(wart('pflege').monthly)} oder ${eur(wart('plus').monthly)} im Monat, monatlich kündbar`,
        ],
      },
      {
        h: 'Wovon der Preis abhängt',
        p: [
          'Die Zahl der Seiten ist selten der große Posten. Teurer wird eine Website durch Funktionen, die mit Ihrem Betrieb zusammenarbeiten müssen — und durch Inhalte, die noch niemand geschrieben hat.',
        ],
        list: [
          'Funktionen: Online-Terminbuchung, Shop, Verleih oder ein Kundenbereich sind eigene Software, kein Baustein. Das kalkulieren wir nach dem Erstgespräch einzeln.',
          'Sprachen: Jede weitere Sprache braucht eigene Adressen und übersetzte Texte, damit sie bei Google auch gefunden wird.',
          'Texte und Fotos: Liegen sie vor, geht es schnell. Schreiben oder fotografieren wir, kommt das als eigener Posten dazu.',
          'Anbindungen: Warenwirtschaft, Kalender, Zahlungsanbieter oder Kleinanzeigen — alles, was Daten mit einem anderen System austauscht.',
        ],
      },
      {
        h: 'Festpreis oder Stundensatz?',
        p: [
          'Beim Stundensatz trägt der Kunde das Risiko: Jede Rückfrage und jede Korrektur kostet. Beim Festpreis tragen wir es. Das zwingt uns, vorher genau zu klären, was gebaut wird — und genau das wollen Betriebe, die keine eigene IT haben.',
          'Größere Agenturen beginnen oft mit einer bezahlten Konzeptphase, bevor überhaupt eine Seite entsteht. Für einen Konzern ist das sinnvoll. Für ein Café, eine Praxis oder einen Handwerksbetrieb reicht meist ein ausführliches Erstgespräch vor Ort — und das ist bei uns kostenlos.',
        ],
      },
      {
        h: 'Was nach dem Start noch kostet',
        p: [
          'Domain und Hosting kosten meist wenige Euro im Monat. Eine Wartung ist kein Muss — aber eine Website, an der zwei Jahre niemand etwas tut, wird langsam, unsicher und bei Google schwächer.',
          `Unsere Wartungspakete beginnen bei ${eur(MAINTENANCE_PRICE_FROM)} im Monat: Hosting, Updates, Backups und kleine Änderungen sind darin enthalten, kündbar zum Monatsende.`,
        ],
      },
      {
        h: 'Baukasten oder programmiert?',
        p: [
          'Ein Baukasten ist billig im ersten Jahr. Er wird teuer, wenn der Betrieb etwas braucht, das der Baukasten nicht kann — und wenn er umziehen will, denn die Seite gehört dem Anbieter, nicht Ihnen.',
          'Wir programmieren jede Website selbst. Sie ist danach schnell, weil sie nur lädt, was sie braucht. Und Sie bleiben unabhängig: Domain und Zugänge laufen auf Ihren Namen, nicht auf unseren.',
        ],
      },
    ],
  },
  {
    slug: 'fallstudie-bikehaus-freiburg',
    title: 'Bikehaus Freiburg: von 30 auf 210 Google-Bewertungen — und ein Verleih, der online läuft',
    seoTitle: 'Fallstudie Bikehaus Freiburg: Website, Verleih & Warenwirtschaft',
    description:
      'Wie ein Freiburger Fahrradgeschäft Ankauf, Verkauf und Verleih in einer Plattform bündelt — mit öffentlicher Website in zwölf Sprachen, Online-Buchung und inzwischen 210 Google-Bewertungen.',
    published: '2026-10-23',
    minutes: 5,
    image: '/assets/images/bikehaus.webp',
    project: 'bikehaus-freiburg',
    town: 'freiburg',
    lead:
      'Bikehaus Freiburg kauft gebrauchte Räder an, macht sie fertig, verkauft und vermietet sie. Für all das gibt es heute eine eigene Plattform. Seit Projektstart ist die Zahl der Google-Bewertungen von 30 auf 210 gestiegen — und der Verleih wird online gebucht und bezahlt.',
    sections: [
      {
        h: 'Die Ausgangslage',
        p: [
          'Ein Gebrauchtradladen hat mehr Papierkram, als man denkt: Jedes angekaufte Rad braucht einen Beleg mit Unterschrift, jeder Verkauf eine Rechnung, jede Vermietung einen Vertrag. Dazu kommen die Inserate auf Kleinanzeigen, die zum Bestand passen müssen, und Anfragen über mehrere Kanäle.',
          'Ein Shop-Baukasten hätte davon nur den Verkauf abgedeckt. Deshalb haben wir die Software um den Betrieb herum gebaut, nicht umgekehrt.',
        ],
      },
      {
        h: 'Was entstanden ist',
        p: ['Eine Plattform mit einer .NET-API in der Mitte und mehreren Oberflächen drumherum:'],
        list: [
          'Warenwirtschaft mit rund 28 Bereichen: Ankauf, Bestand, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben, Statistik, Export und Backup — jeder Schritt mit eigener Belegnummer und PDF.',
          'Öffentliche Website mit Angular und Server-Side Rendering in zwölf Sprachen, rund 100 vorgerenderten Seiten und eigenen Stadt-Landingpages für die Umgebung.',
          'Online-Verleih: Verfügbarkeit prüfen, Zubehör wählen, per Mollie bezahlen. Die Buchung landet im Adminbereich zur Freigabe und wird dort zum Mietvertrag.',
          'Kleinanzeigen-Abgleich alle vier Stunden und eine Chrome-Erweiterung, mit der sich Inserate in Massen bearbeiten lassen.',
          'Eine Windows-Version für den Rechner im Laden, die die API gleich mitbringt.',
        ],
      },
      {
        h: 'Von 30 auf 210 Bewertungen',
        p: [
          'Bewertungen kommen nicht von der Website allein. Sie kommen von zufriedenen Kunden, die im richtigen Moment gefragt werden — und die den Weg zum Google-Profil schnell finden. Beides lässt sich unterstützen: mit einem gepflegten Profil, mit einer Website, die auf das Profil verweist, und mit Abläufen, in denen die Frage nach der Bewertung nicht vergessen wird.',
          'Heute steht Bikehaus Freiburg mit 210 Bewertungen bei Google. Für einen einzelnen Laden ist das ein Vorsprung, den die Konkurrenz in der Karte sieht — und den Kunden sehen, bevor sie anrufen.',
        ],
      },
      {
        h: 'Betrieb auf eigenem Server',
        p: [
          'Alles läuft auf einem eigenen Server: Docker Compose mit fünf Diensten, nginx davor, Zertifikate werden automatisch erneuert, eine tägliche Prüfung per GitHub Actions meldet, wenn etwas hakt. Der Betrieb zahlt keine Lizenzgebühren pro Nutzer.',
        ],
      },
      {
        h: 'Was andere Betriebe daraus mitnehmen können',
        p: [
          'Die Plattform läuft inzwischen auch bei Karaarslan Bike in Lünen — im eigenen Zuschnitt. Das zeigt den eigentlichen Wert: Software, die einmal sauber für einen Betrieb gebaut wurde, lässt sich auf den nächsten übertragen, ohne wieder bei null anzufangen.',
        ],
      },
    ],
  },
  {
    slug: 'homepage-update-oder-neue-website',
    title: 'Homepage-Update oder neue Website? So entscheiden wir das im Erstgespräch',
    seoTitle: 'Homepage-Update oder neue Website? Kosten & Entscheidung',
    description: `Alte Website auffrischen oder neu bauen? Woran wir das festmachen, was ein Update kostet (ab ${eur(upd('start').price)}) und wann sich nur ein Neubau lohnt.`,
    published: '2026-11-15',
    minutes: 5,
    image: '/assets/images/stock/designer-imac.webp',
    lead:
      'Die häufigste Frage im Erstgespräch ist nicht „Was kostet eine Website?“, sondern: „Muss ich wirklich alles neu machen?“ Meistens nicht. Aber manchmal doch — und dann ist es besser, das vorher zu wissen als nach dem dritten Flicken.',
    sections: [
      {
        h: 'Vier Fragen, die wir zuerst stellen',
        p: [
          'Wir schauen uns die bestehende Seite gemeinsam an, am liebsten auf dem Handy des Inhabers. Dabei geht es um vier Dinge:',
        ],
        list: [
          'Lässt sich die Seite auf dem Handy bedienen, ohne zu zoomen? Wenn nein, ist das der erste Punkt — die meisten Besucher kommen vom Handy.',
          'Können Sie selbst etwas ändern, oder brauchen Sie dafür jemanden, den es nicht mehr gibt? Verlorene Zugänge sind der häufigste Grund für einen Neubau.',
          'Stimmt der Inhalt noch? Öffnungszeiten, Leistungen, Team, Preise. Eine technisch gute Seite mit falschen Öffnungszeiten schadet mehr, als sie nützt.',
          'Findet Google die Seite für das, was Sie anbieten — mit Ortsnamen? Oder nur, wenn man den Firmennamen eintippt?',
        ],
      },
      {
        h: 'Wann ein Update reicht',
        p: [
          'Wenn das Grundgerüst trägt: Die Seite lädt halbwegs schnell, die Technik ist nicht aus der Zeit gefallen, und Sie kommen an die Zugänge. Dann lohnt es nicht, alles wegzuwerfen. Wir überarbeiten, was Besucher und Google sehen — Texte, Bilder, Handy-Ansicht, Titel und Beschreibungen.',
          'Dafür gibt es drei Pakete zum Festpreis. Nichts davon ist ein Abo.',
        ],
        list: [
          `Update Start, ${eur(upd('start').price)}, fertig in ${upd('start').days} Werktagen: bis zu drei Seiten inhaltlich aktualisiert, Handy-Ansicht korrigiert, SSL, Impressum und Datenschutz auf Stand.`,
          `Update Standard, ${eur(upd('standard').price)}, fertig in ${upd('standard').days} Werktagen: bis zu fünf Seiten neu gestaltet, Basis-SEO, Google-Unternehmensprofil geprüft, zwei Korrekturrunden.`,
          `Update Komplett, ${eur(upd('komplett').price)}, fertig in ${upd('komplett').days} Werktagen: Relaunch mit bis zu zehn Seiten, Ratgeber-Bereich, zwei Ortsseiten und vier Wochen Nachbetreuung.`,
        ],
      },
      {
        h: 'Wann wir zum Neubau raten',
        p: [
          'Es gibt Fälle, in denen ein Update Geld verbrennt. Dann sagen wir das auch, selbst wenn das kleinere Paket schneller verkauft wäre.',
        ],
        list: [
          'Die Seite hängt an einem Baukasten, der das Gewünschte nicht kann — Terminbuchung, Shop, mehrere Sprachen mit eigenen Adressen.',
          'Niemand hat mehr Zugang zum System, oder es bekommt seit Jahren keine Sicherheitsupdates.',
          'Der Betrieb hat sich geändert: neue Leistungen, neuer Standort, anderer Schwerpunkt. Dann passt die Struktur nicht mehr, nicht nur der Text.',
          'Die Website soll mit dem Betrieb arbeiten — Bestand anzeigen, Buchungen annehmen, Rechnungen schreiben. Das ist Software und kein Anstrich.',
        ],
      },
      {
        h: 'Was beim Wechsel nicht verloren gehen darf',
        p: [
          'Egal ob Update oder Neubau: Adressen, die bei Google schon gefunden werden, bleiben bestehen oder werden sauber weitergeleitet. Wer das vergisst, fängt in der Suche wieder von vorn an.',
          `Eine neue Firmen-Website beginnt bei uns bei ${eur(WEBSITE_PRICE_FROM)}. Was davon für Ihren Betrieb nötig ist, klären wir im Erstgespräch — das kostet nichts, und Sie bekommen danach ein schriftliches Angebot mit festem Preis.`,
        ],
      },
    ],
  },
  {
    slug: 'website-wartung-kosten',
    title: 'Website-Wartung: was sie kostet und was passiert, wenn man sie weglässt',
    seoTitle: 'Website-Wartung Kosten: was kleine Betriebe wirklich brauchen',
    description: `Was Website-Wartung für einen kleinen Betrieb kostet (ab ${eur(MAINTENANCE_PRICE_FROM)} im Monat), was darin steckt und woran man merkt, dass eine Seite zu lange liegen geblieben ist.`,
    published: '2026-11-15',
    minutes: 4,
    image: '/assets/images/stock/einzelhandel.webp',
    lead:
      'Eine Website ist kein Schild, das man einmal anschraubt. Sie läuft auf einem Server, mit Software, die altert. Die gute Nachricht: Für einen kleinen Betrieb ist Wartung weder kompliziert noch teuer. Man muss nur wissen, was man bezahlt.',
    sections: [
      {
        h: 'Was Wartung eigentlich ist',
        p: [
          'Vier Dinge, mehr nicht: Die Seite muss erreichbar sein, es muss Sicherungen geben, die Software muss aktuell bleiben, und jemand muss merken, wenn etwas ausfällt. Alles Weitere — Texte ändern, Bilder tauschen, bei Google besser werden — ist Pflege und kommt obendrauf.',
        ],
      },
      {
        h: 'Was es bei uns kostet',
        p: ['Drei Pakete, monatlich kündbar, ohne Einrichtungsgebühr:'],
        list: [
          `Basis, ${eur(wart('basis').monthly)} im Monat: Hosting auf deutschem Server mit SSL, tägliche Backups, Sicherheits- und Software-Updates, Überwachung mit Alarm. Für alle, die ihre Inhalte selbst pflegen.`,
          `Pflege, ${eur(wart('pflege').monthly)} im Monat: alles aus Basis, dazu bis zu 30 Minuten Änderungen im Monat, ein monatlicher Bericht zu Besuchern und Suchanfragen und Antwort innerhalb eines Werktags.`,
          `Plus, ${eur(wart('plus').monthly)} im Monat: bis zu zwei Stunden Änderungen, eine SEO-Verbesserung pro Monat und die Pflege des Google-Unternehmensprofils, Antwort am selben Werktag.`,
        ],
      },
      {
        h: 'Woran man merkt, dass eine Seite zu lange lag',
        p: [
          'Die Anzeichen sind fast immer dieselben. Dem Inhaber fallen sie selten auf, weil er seine eigene Seite kaum besucht:',
        ],
        list: [
          'Der Browser warnt vor einer unsicheren Verbindung, weil das Zertifikat abgelaufen ist.',
          'Das Kontaktformular schickt nichts mehr ab — und niemand weiß, seit wann.',
          'Öffnungszeiten auf der Website und im Google-Profil widersprechen sich.',
          'Im Impressum steht eine alte Adresse.',
          'Die Seite braucht auf dem Handy mehrere Sekunden, bis überhaupt etwas erscheint.',
        ],
      },
      {
        h: 'Was Sie selbst machen können',
        p: [
          'Nicht jeder Betrieb braucht ein Paket. Wer eine einfache, statische Seite hat und sich einmal im Quartal zehn Minuten nimmt, kommt weit: Seite auf dem Handy öffnen, Formular testen, Öffnungszeiten mit dem Google-Profil vergleichen, nachsehen, ob die Domain bald verlängert werden muss.',
          'Schwierig wird es bei Systemen mit Erweiterungen, Shop oder Buchung. Dort sind Updates Pflicht, und ein Update ohne Sicherung davor ist ein Risiko, das wir niemandem empfehlen.',
        ],
      },
      {
        h: 'Auch für Seiten, die nicht von uns sind',
        p: [
          'Wir übernehmen bestehende Websites nach einem kurzen Check. Manche Systeme lassen sich nicht sauber betreuen — das sagen wir dann vorher und nennen eine Alternative. In jedem Fall bleiben Domain und Zugänge auf Ihren Namen. Wenn Sie kündigen, übergeben wir alles vollständig.',
        ],
      },
    ],
  },
  {
    slug: 'fallstudie-praxis-website-mehrsprachig',
    title: 'Eine Hausarztpraxis in zehn Sprachen: was eine Praxis-Website leisten muss',
    seoTitle: 'Fallstudie Praxis-Website: zehn Sprachen, schnell, datenschutzfreundlich',
    description:
      'Wie die Hausarztpraxis Gültekin die wichtigsten Fragen schon vor dem Anruf beantwortet — in zehn Sprachen, auf 93 auffindbaren Seiten, mit Statistik erst nach Einwilligung.',
    published: '2026-11-15',
    minutes: 4,
    image: '/assets/images/praxis-gueltekin.webp',
    project: 'praxis-gueltekin',
    lead:
      'Eine Praxis-Website hat eine einzige Aufgabe: Fragen beantworten, bevor das Telefon klingelt. Wer behandelt hier, was wird angeboten, wann ist offen, wie komme ich an einen Termin? Bei der Hausarztpraxis Gültekin in Hofheim am Taunus kam eine Frage dazu: in welcher Sprache?',
    sections: [
      {
        h: 'Die Ausgangslage',
        p: [
          'Die Praxis von Fazilet Gültekin betreut gesetzlich und privat Versicherte, auf Deutsch und Türkisch. In der Region leben viele Menschen, die Gesundheitsfragen lieber in ihrer eigenen Sprache nachlesen.',
        ],
      },
      {
        h: 'Was wir gebaut haben',
        p: ['Eine schlichte, schnelle Seite, die genau diese Fragen abbildet:'],
        list: [
          'Zehn Sprachen mit eigenen, übersetzten Adressen — Arabisch mit Rechts-nach-links-Layout.',
          'Eine Leistungsübersicht, die den Schwerpunkt Infektiologie und die Diagnostik in der Praxis herausstellt.',
          'Sprechzeiten, der Hinweis auf den Bereitschaftsdienst und der Link zur Terminvereinbarung auf jeder Seite, nicht versteckt im Menü.',
          'Ein Gesundheitsratgeber mit Fachartikeln und häufigen Fragen — also dem, was Patientinnen und Patienten ohnehin googeln.',
        ],
      },
      {
        h: 'Datenschutz, wenn es um Gesundheit geht',
        p: [
          'Bei einer Praxis schaut man genauer hin, zu Recht. Die Besucherstatistik läuft erst nach aktiver Einwilligung und lässt sich jederzeit widerrufen. Schriften und Bilder liegen auf dem eigenen Server statt bei Dritten.',
          'Technisch ist die Seite bewusst einfach gehalten: statisch, ohne Datenbank, fast ohne Skripte. Sie lädt auch auf dem Handy im Wartezimmer schnell.',
        ],
      },
      {
        h: 'Das Ergebnis',
        p: [
          '93 auffindbare Seiten, auf denen Ärztin, Praxis und Sprechzeiten so ausgezeichnet sind, dass Suchmaschinen sie verstehen. Die Praxis wird damit auch dort gefunden, wo jemand nicht auf Deutsch sucht.',
        ],
      },
      {
        h: 'Was andere Praxen daraus mitnehmen können',
        p: [
          'Zehn Sprachen braucht nicht jede Praxis. Aber die Reihenfolge stimmt fast immer: erst Sprechzeiten, Termin und Anfahrt auf jeder Seite, dann die Leistungen, dann alles andere. Und eine zweite Sprache lohnt sich überall dort, wo ein spürbarer Teil der Patienten sie spricht — als eigene Seite mit eigener Adresse, nicht als automatische Übersetzung per Knopf.',
        ],
      },
    ],
  },
  {
    slug: 'digitale-speisekarte-restaurant-freiburg',
    title: 'Digitale Speisekarte im Restaurant: so ist die Karte von Divan Ocakbaşı in Freiburg aufgebaut',
    seoTitle: 'Digitale Speisekarte für Restaurants in Freiburg: Praxisbericht',
    description:
      'QR-Code am Tisch, 14 Sprachen, eigene Fotos: wie die digitale Speisekarte von Divan Ocakbaşı in Freiburg aufgebaut ist — und worauf Restaurants achten sollten.',
    published: '2026-11-15',
    minutes: 4,
    image: '/assets/images/speisekarte/divan-2-start.webp',
    town: 'freiburg',
    lead:
      'Ein PDF hinter einem QR-Code ist keine digitale Speisekarte. Es ist die Papierkarte, nur kleiner und schwerer zu lesen. Für Divan Ocakbaşı in Freiburg haben wir es anders gebaut. Hier steht, wie — und was davon für andere Restaurants taugt.',
    sections: [
      {
        h: 'Warum das PDF nicht reicht',
        p: [
          'Auf dem Handy muss man ein PDF zoomen und schieben. Es lädt langsam, wenn der Empfang im Gastraum schwach ist. Und es spricht nur eine Sprache.',
        ],
      },
      {
        h: 'Wie die Karte bei Divan funktioniert',
        p: [
          'Der Gast scannt den QR-Code oder hält das Handy an den NFC-Aufsteller. Es öffnet sich eine Seite, keine App. Dann wählt er Schritt für Schritt, mit Fotos und in seiner Sprache.',
        ],
        list: [
          '14 Sprachen, von Arabisch bis Koreanisch, mit Rechts-nach-links-Darstellung. In der Auswahl steht zusätzlich der deutsche Name — der Service muss ja wissen, was gemeint ist.',
          'Die Nummern der gedruckten Karte bleiben. So findet das Personal jedes Gericht sofort.',
          'Rubriken erscheinen nur zu ihrer Zeit: das Mittagsmenü zum Beispiel von 11:30 bis 16:00 Uhr.',
          'Die Fotos stammen aus dem Haus. Farben, Muster und der Eingang mit den zwei Türen passen zum Restaurant.',
          'Am Anfang und am Ende stehen Knöpfe zu Instagram und zur Google-Bewertung.',
        ],
      },
      {
        h: 'Zwei Seiten statt einer',
        p: [
          'Am Tisch sieht der Gast die Auswahl, Schritt für Schritt. Wer von außen kommt — über die Website, das Google-Profil oder Instagram — bekommt die ganze Karte auf einen Blick. Das sind zwei verschiedene Situationen: Der eine sitzt schon und hat Hunger, der andere überlegt noch, ob er kommt.',
        ],
      },
      {
        h: 'Was sich im Alltag ändert',
        p: [
          'Ein Preis ändert sich, ein Gericht fällt weg: Eine kurze Nachricht genügt, und die neue Fassung steht sofort am Tisch. Die QR-Codes bleiben dieselben, es wird nichts neu gedruckt.',
          'Die Gäste stellen ihre Auswahl zusammen und zeigen sie dem Service. Auf Wunsch geht die Bestellung auch direkt vom Tisch ans Personal — das muss aber zum Ablauf im Haus passen.',
        ],
      },
      {
        h: 'Worauf Restaurants achten sollten',
        p: ['Unabhängig davon, wer die Karte baut:'],
        list: [
          'Eine Seite statt einer App. Niemand lädt für ein Abendessen etwas herunter.',
          'Eigene Fotos. Bilder von anderswo versprechen ein Gericht, das so nicht auf den Tisch kommt.',
          'Der Code führt auf eine feste Adresse, deren Inhalt sich ändern lässt. Sonst druckt man bei jeder Preisänderung neu.',
          'Die Papierkarte bleibt. Es gibt immer Gäste, die lieber blättern — und das ist in Ordnung.',
        ],
      },
    ],
  },
];

export function articleBySlug(slug: string): RatgeberArticle | undefined {
  return RATGEBER.find((a) => a.slug === slug);
}
