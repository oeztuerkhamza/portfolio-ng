/**
 * Smart Home für Betriebe und Vermieter — Produktdaten.
 *
 * Wie bei den Bewertungskarten stehen Preise nur hier, nicht in den
 * Übersetzungen.
 *
 * TODO(hamza): Preise vor dem Livegang bestätigen. Die Werte sind „ab"-Preise
 * für Einrichtung und Konfiguration; Geräte werden nach Bedarf zum
 * Einkaufspreis weitergegeben (siehe `sh.price.note`). Stundensatz und
 * Anfahrtspauschale gegenrechnen.
 *
 * Abgrenzung: Wir bauen nur funkbasierte Geräte ein (Batterie, Steckdose,
 * Zwischenstecker). Alles, was fest an 230 V angeschlossen wird, macht ein
 * Elektrofachbetrieb (DIN VDE 0100 / DGUV V3) — so steht es auch in der FAQ.
 */
export interface SmartHomePackage {
  /** i18n-Schlüssel-Präfix: `sh.pkg.<id>.name` / `.for` / `.p1`…`.p4`. */
  id: 'check' | 'start' | 'betrieb';
  /** „ab"-Endpreis in Euro. */
  price: number;
  /** Preis ist ein Einstiegspreis („ab"). */
  from?: boolean;
  featured?: boolean;
  /** Wie viele Punkte aus `sh.pkg.<id>.p*` gerendert werden. */
  points: number;
}

export const SMART_HOME_PACKAGES: SmartHomePackage[] = [
  { id: 'check', price: 79, points: 4 },
  { id: 'start', price: 490, from: true, featured: true, points: 4 },
  { id: 'betrieb', price: 1290, from: true, points: 4 },
];

/** Anwendungsfälle — Texte aus `sh.use<N>.t` / `.d`. */
export const SMART_HOME_USES = [1, 2, 3, 4, 5, 6] as const;

/** Ablauf — Texte aus `sh.step<N>.t` / `.d`. */
export const SMART_HOME_STEPS = [1, 2, 3, 4] as const;

/** FAQ — Texte aus `sh.faq<N>.q` / `.a`. */
export const SMART_HOME_FAQS = [1, 2, 3, 4, 5] as const;
