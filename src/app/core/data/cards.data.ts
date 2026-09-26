import { price } from './catalog';

/**
 * Eigene NFC-Karten — nicht zu verwechseln mit den Bewertungskarten.
 *
 * Eine Bewertungskarte zeigt auf ein fremdes Ziel (das Google-Profil). Diese
 * Karten haben eine eigene Seite auf unserer Domain: /k/<name>. Was darauf
 * steht, pflegen wir im Portal (src/app/admin/tabs/cards.tab.ts).
 *
 * `id` ist dieselbe Art wie im Server (src/server/cards.ts) und im
 * Katalogschlüssel `card.<id>`. Daran erkennt der Server nach der Bezahlung,
 * welche Art Kartenentwurf er anlegen muss — die Namen dürfen sich also nicht
 * auseinanderentwickeln.
 */
export interface CustomCardProduct {
  id: 'business' | 'gift';
  /**
   * Eigene Seite: /digitale-visitenkarte bzw. /geschenkkarte. Die Adressen
   * sind die Suchbegriffe, unter denen die Produkte gefunden werden — sie
   * dürfen sich nicht mehr ändern.
   */
  slug: string;
  /** Endpreis in Euro, aus dem Katalog. */
  price: number;
  image: string;
  imageSmall: string;
}

export const CUSTOM_CARDS: CustomCardProduct[] = [
  {
    id: 'business',
    slug: 'digitale-visitenkarte',
    price: price('card.business'),
    image: '/assets/images/products/review-card.webp',
    imageSmall: '/assets/images/products/review-card-800.webp',
  },
  {
    id: 'gift',
    slug: 'geschenkkarte',
    price: price('card.gift'),
    image: '/assets/images/products/keychain.webp',
    imageSmall: '/assets/images/products/keychain-800.webp',
  },
];

/** Produkt zu einer Adresse — null, wenn es die Seite nicht gibt. */
export const customCard = (slug: string | null): CustomCardProduct | null =>
  CUSTOM_CARDS.find((c) => c.slug === slug) ?? null;
