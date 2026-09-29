import type { Lang } from '../i18n/i18n.service';
import { REVIEW_CARD_PACKAGES } from './review-cards.data';
import { SMART_HOME_PACKAGES } from './smart-home.data';
import { price } from './catalog';

/**
 * Stammdaten des Unternehmens — eine Stelle für Telefon, WhatsApp und E-Mail,
 * damit Navigation, Aktionsleiste, Footer und Produktseiten nicht
 * auseinanderlaufen.
 */
export const COMPANY = {
  name: 'Breisgau Digital',
  email: 'info@breisgau-digital.de',
  phoneDisplay: '+49 155 66859378',
  phoneHref: 'tel:+4915566859378',
  whatsapp: '4915566859378',
  instagram: 'https://www.instagram.com/breisgau_digital',
  street: 'Bissierstr. 16',
  city: '79114 Freiburg im Breisgau',
} as const;

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${COMPANY.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Einstiegspreis Firmen-Website (Festpreis, „ab"), aus catalog.json. */
export const WEBSITE_PRICE_FROM = price('web.from');

/**
 * Smart Home ist vorübergehend abgeschaltet: die Leistung wird derzeit nicht
 * angeboten. Alles dazu bleibt im Code stehen — Seite, Texte, Preise, Bilder —
 * und hängt an diesem einen Schalter.
 *
 * **Wieder einschalten:** hier auf `true` setzen *und* die beiden
 * Weiterleitungen für `/:locale/smart-home` aus `vercel.json` entfernen.
 * Bleibt die Weiterleitung stehen, ist die Seite trotz Schalter nicht
 * erreichbar — sie greift vor dem Routing.
 */
export const SMART_HOME_ENABLED = false;

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
const ALL_PRODUCTS: Product[] = [
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

/** Was gerade angeboten wird. Smart Home fällt über den Schalter heraus. */
export const PRODUCTS: Product[] = ALL_PRODUCTS.filter((p) => p.id !== 'sh' || SMART_HOME_ENABLED);

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
