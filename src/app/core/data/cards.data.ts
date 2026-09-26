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
  /** Endpreis in Euro, aus dem Katalog. */
  price: number;
  image: string;
  imageSmall: string;
}

export const CUSTOM_CARDS: CustomCardProduct[] = [
  {
    id: 'business',
    price: price('card.business'),
    image: '/assets/images/products/review-card.webp',
    imageSmall: '/assets/images/products/review-card-800.webp',
  },
  {
    id: 'gift',
    price: price('card.gift'),
    image: '/assets/images/products/keychain.webp',
    imageSmall: '/assets/images/products/keychain-800.webp',
  },
];
