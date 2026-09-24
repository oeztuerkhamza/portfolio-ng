/**
 * Google-Bewertungskarten — Produktdaten.
 *
 * Preise stehen bewusst nur hier, nicht in den Übersetzungen: eine
 * Preisänderung ist damit eine Zeile und kein Suchlauf durch fünf Sprachen.
 *
 * Preislogik: gleicher Chip → gleiche Größenordnung. Karte 39 €, Anhänger
 * 29 €, Aufkleber im Zweierpack 39 €, Aufsteller 69 €. Pakete sind günstiger
 * als die Summe der Einzelteile (Team 33 € je Karte, Tresen spart 19 €).
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

/**
 * Produktformen — jede mit NFC-Chip und QR-Code, einzeln bestellbar.
 * Texte aus `rc.form.<id>.name` / `.text`.
 */
export interface ReviewCardForm {
  id: 'karte' | 'aufsteller' | 'aufkleber' | 'anhaenger';
  /** Einzelpreis in Euro. */
  price: number;
  image: string;
  imageSmall: string;
}

export const REVIEW_CARD_FORMS: ReviewCardForm[] = [
  { id: 'karte', price: 39, image: '/assets/images/products/review-card.webp', imageSmall: '/assets/images/products/review-card-800.webp' },
  { id: 'aufsteller', price: 69, image: '/assets/images/products/stand.webp', imageSmall: '/assets/images/products/stand-800.webp' },
  { id: 'aufkleber', price: 39, image: '/assets/images/products/sticker.webp', imageSmall: '/assets/images/products/sticker-800.webp' },
  { id: 'anhaenger', price: 29, image: '/assets/images/products/keychain.webp', imageSmall: '/assets/images/products/keychain-800.webp' },
];

/**
 * Beispiel-Designs für verschiedene Branchen. Bild unter
 * `/assets/images/products/examples/<id>.webp`, Branche aus `rc.ex.<id>`.
 * Die Namen auf den Karten („Café Muster" …) sind Platzhalter.
 */
export const REVIEW_CARD_EXAMPLES = ['cafe', 'salon', 'handwerk', 'praxis', 'fewo', 'restaurant'] as const;

