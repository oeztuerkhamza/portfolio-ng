import { price } from './catalog';

/**
 * Homepage-Update: drei Festpreis-Pakete für Betriebe, die schon eine Website
 * haben. Preise kommen aus catalog.json (Schlüssel `upd.*`), Texte aus
 * `upd.<id>.*` in leistungen.content.ts.
 *
 * Werktage zählen ab dem Zeitpunkt, an dem Zugänge, Texte und Fotos vorliegen.
 */
export type UpdateId = 'start' | 'standard' | 'komplett';

export interface UpdatePackage {
  id: UpdateId;
  price: number;
  /** Zusage in Werktagen ab vollständigen Unterlagen. */
  days: number;
  featured?: boolean;
}

export const UPDATE_PACKAGES: UpdatePackage[] = [
  { id: 'start', price: price('upd.start'), days: 3 },
  { id: 'standard', price: price('upd.standard'), days: 7, featured: true },
  { id: 'komplett', price: price('upd.komplett'), days: 14 },
];

/** Einstiegspreis für Hinweise außerhalb der Paketkarten. */
export const UPDATE_PRICE_FROM = Math.min(...UPDATE_PACKAGES.map((p) => p.price));
