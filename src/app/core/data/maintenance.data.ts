import { price } from './catalog';

/**
 * Website-Wartung — drei Pakete zum Monatspreis, monatlich kündbar.
 *
 * Preise kommen aus catalog.json (Schlüssel `wart.*`, im Admin-Portal unter
 * „Fiyatlar“ pflegbar). Texte: `wart.plan.<id>.name` / `.for` / `.p1`…`.pN`
 * in wartung.content.ts.
 *
 * Das frühere Digital-Abo (Schlüssel `abo.*`) wird nicht mehr angeboten; seine
 * Preise bleiben im Katalog, damit bestehende Verträge im Portal und auf
 * Rechnungen lesbar bleiben.
 */
export type MaintenanceId = 'basis' | 'pflege' | 'plus';

export interface MaintenancePlan {
  id: MaintenanceId;
  /** Euro pro Monat. */
  monthly: number;
  /** Anzahl der Leistungspunkte `wart.plan.<id>.p*`. */
  points: number;
  featured?: boolean;
}

export const MAINTENANCE_PLANS: MaintenancePlan[] = [
  { id: 'basis', monthly: price('wart.basis'), points: 4 },
  { id: 'pflege', monthly: price('wart.pflege'), points: 4, featured: true },
  { id: 'plus', monthly: price('wart.plus'), points: 4 },
];

export const MAINTENANCE_PRICE_FROM = Math.min(...MAINTENANCE_PLANS.map((p) => p.monthly));
