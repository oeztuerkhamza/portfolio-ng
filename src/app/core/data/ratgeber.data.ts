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
          'Die Plattform läuft inzwischen auch bei Benlirad in Lahr und bei Karaarslan Bike in Lünen — jeweils im eigenen Zuschnitt. Das zeigt den eigentlichen Wert: Software, die einmal sauber für einen Betrieb gebaut wurde, lässt sich auf den nächsten übertragen, ohne wieder bei null anzufangen.',
        ],
      },
    ],
  },
  {
    slug: 'fallstudie-benlirad-lahr',
    title: 'Benlirad in Lahr: eine Plattform, ein zweiter Laden — was gehört zum Kern?',
    seoTitle: 'Fallstudie Benlirad Lahr: Warenwirtschaft & Website',
    description:
      'Wie die Plattform von Bikehaus Freiburg für ein Fahrradgeschäft in Lahr zugeschnitten wurde: Live-Bestand auf der Website, Reparatur statt Verleih, vier Sprachen und Ortsseiten für die Ortenau.',
    published: '2026-10-23',
    minutes: 4,
    image: '/assets/images/benlirad.webp',
    project: 'benlirad',
    town: 'lahr',
    lead:
      'Benlirad ist ein Fahrradgeschäft in Lahr im Schwarzwald. Es bekam dieselbe Plattform wie Bikehaus Freiburg — aber nicht dieselbe Software. Die eigentliche Arbeit war eine Frage: Was gehört wirklich zum Kern, und was war nur für den ersten Kunden gebaut?',
    sections: [
      {
        h: 'Gleicher Kern, anderer Laden',
        p: [
          'Bikehaus vermietet, Benlirad repariert. Ankauf, Bestand, Verkauf, Rücknahme, Kunden, Rechnungen, Ausgaben und Statistik brauchen beide. Der Verleih mit Online-Zahlung und Mietvertrag dagegen war für Lahr überflüssig — stattdessen bekam die Website einen eigenen Bereich für den Reparatur-Service.',
          'Diese Trennung ist der Grund, warum die Plattform heute in drei Läden läuft. Was Bikehaus-spezifisch war, ist ein Modul; was alle brauchen, ist der Kern.',
        ],
      },
      {
        h: 'Der Bestand steht von selbst online',
        p: [
          'Die öffentliche Website zieht ihre Inhalte direkt aus der Warenwirtschaft. Wird im Laden ein Rad eingebucht, steht es im Showroom — samt Zähler der verfügbaren Räder. Wird es verkauft, verschwindet es. Niemand muss eine zweite Liste pflegen.',
        ],
        list: [
          'Showroom mit dem echten Bestand, Neuräder und Zubehör',
          'Reparatur-Service, Ratgeber, FAQ und Garantie-Seite',
          'Vier Sprachen (Deutsch, Englisch, Französisch, Türkisch) mit eigenen Adressen und Server-Side Rendering',
          'Stadt-Landingpages für die Orte rund um Lahr',
        ],
      },
      {
        h: 'Gefunden werden in der Ortenau',
        p: [
          'Wer in Lahr ein gebrauchtes Rad sucht, sucht nicht nur in Lahr — die Orte von Friesenheim bis Seelbach liegen nah genug. Deshalb hat die Website eigene Stadt-Landingpages für die Region und strukturierte Daten, die Google sagen, wo der Laden steht und wen er bedient.',
        ],
      },
      {
        h: 'Betrieb und Kosten',
        p: [
          'API, Admin-Oberfläche und Website laufen als getrennte Dienste mit Docker und nginx auf einem eigenen Server. Für den Rechner im Laden gibt es eine Windows-Version. Weil der Kern schon stand, musste er für Lahr nicht neu entwickelt werden — die Arbeit steckte im Zuschnitt, nicht im Fundament.',
        ],
      },
    ],
  },
];

export function articleBySlug(slug: string): RatgeberArticle | undefined {
  return RATGEBER.find((a) => a.slug === slug);
}
