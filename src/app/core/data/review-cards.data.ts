/**
 * Google-Bewertungskarten — Produktdaten.
 *
 * Preise stehen bewusst nur hier, nicht in den Übersetzungen: eine
 * Preisänderung ist damit eine Zeile und kein Suchlauf durch fünf Sprachen.
 *
 * TODO(hamza): Preise vor dem Livegang bestätigen. Die Werte unten sind ein
 * Vorschlag am Marktniveau (Einzelkarte 25–45 €, Sets 90–160 €) und keine
 * abgestimmte Kalkulation. Einkauf NFC-Rohlinge + Druck + Einrichtungszeit
 * gegenrechnen, bevor die Seite öffentlich wird.
 *
 * Kleinunternehmer nach § 19 UStG: Preise sind Endpreise ohne ausgewiesene
 * Umsatzsteuer. Der Hinweis dazu steht als `rc.price.note` in den
 * Übersetzungen und MUSS neben den Preisen sichtbar bleiben (PAngV).
 */
export interface ReviewCardPackage {
  /** i18n-Schlüssel-Präfix: `rc.pkg.<id>.name` / `.for` / `.p1`…`.p4`. */
  id: 'einzel' | 'team' | 'tresen';
  /** Endpreis in Euro. */
  price: number;
  /** Anzahl der enthaltenen Karten — steuert die Stückzahl-Zeile. */
  cards: number;
  /** Zusätzlicher Aufsteller für den Tresen. */
  stand?: boolean;
  /** Hervorgehoben in der Preistabelle. */
  featured?: boolean;
  /** Wie viele Punkte aus `rc.pkg.<id>.p*` gerendert werden. */
  points: number;
}

export const REVIEW_CARD_PACKAGES: ReviewCardPackage[] = [
  { id: 'einzel', price: 39, cards: 1, points: 4 },
  { id: 'team', price: 99, cards: 3, featured: true, points: 4 },
  { id: 'tresen', price: 149, cards: 3, stand: true, points: 4 },
];

/** Schritte des Ablaufs — Texte kommen aus `rc.step<N>.t` / `.d`. */
export const REVIEW_CARD_STEPS = [1, 2, 3, 4] as const;

/** Argumente-Kacheln — Texte aus `rc.why<N>.t` / `.d`. */
export const REVIEW_CARD_REASONS = [1, 2, 3] as const;

/** FAQ-Einträge — Texte aus `rc.faq<N>.q` / `.a`. */
export const REVIEW_CARD_FAQS = [1, 2, 3, 4, 5] as const;
