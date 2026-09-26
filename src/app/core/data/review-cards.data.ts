import { price } from './catalog';

/**
 * Google-Bewertungskarten — Produktdaten.
 *
 * Preise kommen aus catalog.json (im Admin-Portal unter „Fiyatlar" pflegbar),
 * nie aus den Übersetzungen.
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
  { id: 'einzel', price: price('pkg.einzel'), cards: 1, points: 4 },
  { id: 'team', price: price('pkg.team'), cards: 3, featured: true, points: 4 },
  { id: 'tresen', price: price('pkg.tresen'), cards: 3, stand: true, points: 4 },
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
  { id: 'karte', price: price('form.karte'), image: '/assets/images/products/review-card.webp', imageSmall: '/assets/images/products/review-card-800.webp' },
  { id: 'aufsteller', price: price('form.aufsteller'), image: '/assets/images/products/stand.webp', imageSmall: '/assets/images/products/stand-800.webp' },
  { id: 'aufkleber', price: price('form.aufkleber'), image: '/assets/images/products/sticker.webp', imageSmall: '/assets/images/products/sticker-800.webp' },
  { id: 'anhaenger', price: price('form.anhaenger'), image: '/assets/images/products/keychain.webp', imageSmall: '/assets/images/products/keychain-800.webp' },
];

/**
 * Alle Produkte mit eigener Detailseite unter /bewertungskarten/<slug>.
 *
 * Formen und Pakete stehen hier in einer Liste, weil Detailseite und
 * „In den Warenkorb"-Knopf beides gleich behandeln. `key` ist derselbe
 * Schlüssel wie in der Tabelle `prices` — nur damit landet im Warenkorb die
 * Zeile, die der Server später auch abrechnet.
 *
 * Die Kurznamen stehen hier fest und dürfen sich nicht mehr ändern: sie sind
 * die Adresse der Seite und stehen irgendwann in Suchergebnissen.
 */
export interface ReviewCardProduct {
  /** Adresse der Detailseite: /bewertungskarten/<slug>. */
  slug: string;
  /** Zeile im Shop-Katalog, z. B. `form.karte`. */
  key: string;
  /** Einzelprodukt oder Paket — entscheidet, welche i18n-Schlüssel gelten. */
  kind: 'form' | 'pkg';
  /** id innerhalb der Art, für `rc.form.<id>.*` bzw. `rc.pkg.<id>.*`. */
  id: string;
  price: number;
  image: string;
  imageSmall: string;
  /** Pakete: enthaltene Karten. */
  cards?: number;
  /** Pakete: zusätzlicher Tischaufsteller. */
  stand?: boolean;
  /** Pakete: wie viele Punkte aus `rc.pkg.<id>.p*` gelten. */
  points?: number;
}

/** Kurzname je Form. `anhaenger` heißt in der Adresse ausgeschrieben. */
const FORM_SLUGS: Record<ReviewCardForm['id'], string> = {
  karte: 'karte',
  aufsteller: 'aufsteller',
  aufkleber: 'aufkleber',
  anhaenger: 'schluesselanhaenger',
};

const byForm = (id: ReviewCardForm['id']) => REVIEW_CARD_FORMS.find((f) => f.id === id)!;

export const REVIEW_CARD_PRODUCTS: ReviewCardProduct[] = [
  ...REVIEW_CARD_FORMS.map(
    (f): ReviewCardProduct => ({
      slug: FORM_SLUGS[f.id],
      key: `form.${f.id}`,
      kind: 'form',
      id: f.id,
      price: f.price,
      image: f.image,
      imageSmall: f.imageSmall,
    }),
  ),
  ...REVIEW_CARD_PACKAGES.map((p): ReviewCardProduct => {
    // Pakete haben kein eigenes Foto: das Tresen-Paket zeigt den Aufsteller,
    // die anderen die Karte — das ist jeweils das Hauptstück darin.
    const shown = byForm(p.stand ? 'aufsteller' : 'karte');
    return {
      slug: `paket-${p.id}`,
      key: `pkg.${p.id}`,
      kind: 'pkg',
      id: p.id,
      price: p.price,
      image: shown.image,
      imageSmall: shown.imageSmall,
      cards: p.cards,
      stand: p.stand,
      points: p.points,
    };
  }),
];

/** Produkt zu einem Kurznamen — null, wenn es die Adresse nicht gibt. */
export const reviewCardProduct = (slug: string | null): ReviewCardProduct | null =>
  REVIEW_CARD_PRODUCTS.find((p) => p.slug === slug) ?? null;

/** i18n-Schlüssel des Namens, je Art unterschiedlich. */
export const productNameKey = (p: ReviewCardProduct): string =>
  p.kind === 'form' ? `rc.form.${p.id}.name` : `rc.pkg.${p.id}.name`;

/** i18n-Schlüssel der Kurzbeschreibung. */
export const productTextKey = (p: ReviewCardProduct): string =>
  p.kind === 'form' ? `rc.form.${p.id}.text` : `rc.pkg.${p.id}.for`;

/**
 * Beispiel-Designs für verschiedene Branchen. Bild unter
 * `/assets/images/products/examples/<id>.webp`, Branche aus `rc.ex.<id>`.
 * Die Namen auf den Karten („Café Muster" …) sind Platzhalter.
 */
export const REVIEW_CARD_EXAMPLES = ['cafe', 'salon', 'handwerk', 'praxis', 'fewo', 'restaurant'] as const;

