/**
 * Digital-Abo — drei Pakete zum Monatspreis.
 *
 * TODO(hamza): Preise, Einrichtungsgebühr und Mindestlaufzeit bestätigen.
 * Die Werte sind ein Vorschlag, keine Kalkulation.
 *
 * Online-Abschluss: Sobald es für ein Paket einen Zahlungslink gibt (z. B.
 * Stripe Payment Link für ein Abo), hier unter `checkoutUrl` eintragen — der
 * Button wird dann zu „Jetzt abonnieren" und führt direkt zur Zahlung. Ohne
 * Link führt er ins Anfrageformular, das Paket ist dort schon ausgewählt.
 */
export type Billing = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  /** i18n-Präfix `abo.plan.<id>.name` / `.for` / `.p1`…`.pN`. */
  id: 'basis' | 'business' | 'premium';
  /** Preis pro Monat bei monatlicher Zahlung, in Euro. */
  monthly: number;
  /** Einmalige Einrichtung in Euro (0 = keine). */
  setupFee: number;
  /** Mindestlaufzeit in Monaten, danach monatlich kündbar. */
  minTermMonths: number;
  /** Anzahl der Leistungspunkte `abo.plan.<id>.p*`. */
  points: number;
  featured?: boolean;
  checkoutUrl?: Partial<Record<Billing, string>>;
}

/** Bei jährlicher Zahlung werden zehn statt zwölf Monate berechnet. */
export const YEARLY_MONTHS_CHARGED = 10;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: 'basis', monthly: 19, setupFee: 0, minTermMonths: 12, points: 5 },
  { id: 'business', monthly: 49, setupFee: 290, minTermMonths: 24, points: 6, featured: true },
  { id: 'premium', monthly: 99, setupFee: 290, minTermMonths: 24, points: 6 },
];

export const SUBSCRIPTION_PRICE_FROM = Math.min(...SUBSCRIPTION_PLANS.map((p) => p.monthly));

export function planPrice(plan: SubscriptionPlan, billing: Billing): number {
  return billing === 'yearly' ? plan.monthly * YEARLY_MONTHS_CHARGED : plan.monthly;
}
