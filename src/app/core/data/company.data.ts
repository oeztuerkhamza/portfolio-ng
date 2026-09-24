import type { Lang } from '../i18n/i18n.service';
import { REVIEW_CARD_PACKAGES } from './review-cards.data';
import { SMART_HOME_PACKAGES } from './smart-home.data';

/**
 * Stammdaten des Unternehmens — eine Stelle für Telefon, WhatsApp und E-Mail,
 * damit Navigation, Aktionsleiste, Footer und Produktseiten nicht
 * auseinanderlaufen.
 */
export const COMPANY = {
  name: 'Breisgau Digital',
  email: 'hamza.oeztuerk@web.de',
  phoneDisplay: '+49 155 66859378',
  phoneHref: 'tel:+4915566859378',
  whatsapp: '4915566859378',
  instagram: 'https://www.instagram.com/hamza_oeztuerk',
  street: 'Bissierstr. 16',
  city: '79114 Freiburg im Breisgau',
} as const;

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${COMPANY.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/**
 * Einstiegspreis Firmen-Website (Festpreis, „ab").
 *
 * TODO(hamza): vor dem Livegang bestätigen. Die Leistungsseite spricht vom
 * „niedrigen vierstelligen Bereich"; der Wert hier muss dazu passen.
 */
export const WEBSITE_PRICE_FROM = 1290;

export type ProductId = 'cards' | 'web' | 'sh';

export interface Product {
  id: ProductId;
  /** Zielseite (ohne Sprachpräfix). */
  path: string;
  /** Produktfoto, 1600 px breit; `imageSmall` ist die 800-px-Fassung. */
  image: string;
  imageSmall: string;
  /** Einstiegspreis in Euro. */
  priceFrom: number;
  featured?: boolean;
}

/**
 * Die drei Produkte der Startseite. Texte kommen aus `home.prod.<id>.*`.
 * Die Fotos sind gerenderte Produktaufnahmen und können 1:1 durch echte
 * Fotos gleichen Namens (4:3, 1600 × 1200) ersetzt werden.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'cards',
    path: '/bewertungskarten',
    image: '/assets/images/products/review-card.webp',
    imageSmall: '/assets/images/products/review-card-800.webp',
    priceFrom: Math.min(...REVIEW_CARD_PACKAGES.map((p) => p.price)),
    featured: true,
  },
  {
    id: 'web',
    path: '/leistungen',
    image: '/assets/images/products/website.webp',
    imageSmall: '/assets/images/products/website-800.webp',
    priceFrom: WEBSITE_PRICE_FROM,
  },
  {
    id: 'sh',
    path: '/smart-home',
    image: '/assets/images/products/smart-home.webp',
    imageSmall: '/assets/images/products/smart-home-800.webp',
    priceFrom: Math.min(...SMART_HOME_PACKAGES.map((p) => p.price)),
  },
];

/** Orte, in die wir persönlich fahren — und der Rest des Landes per Video. */
export const TOWNS_ONSITE = [
  'Freiburg',
  'Emmendingen',
  'Waldkirch',
  'Breisach',
  'Bad Krozingen',
  'Staufen',
  'Müllheim',
  'Lörrach',
  'Offenburg',
  'Lahr',
  'Titisee-Neustadt',
];
export const TOWNS_REMOTE = ['Karlsruhe', 'Stuttgart', 'Mannheim', 'Heidelberg', 'Ulm', 'Konstanz'];

const NUMBER_LOCALE: Record<Lang, string> = {
  de: 'de-DE',
  fr: 'fr-FR',
  en: 'en-GB',
  tr: 'tr-TR',
  ku: 'de-DE',
};

/** Betrag ohne Nachkommastellen im Zahlenformat der Sprache: 1290 → „1.290" / „1,290". */
export function formatAmount(value: number, lang: Lang): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[lang], { maximumFractionDigits: 0 }).format(value);
}
