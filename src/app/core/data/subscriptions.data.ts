import { price } from './catalog';

/**
 * Digital-Abo — drei Pakete zum Monatspreis.
 *
 * Preislogik: Business über 24 Monate (≈ 2.050 €) entspricht etwa Website
 * (ab 1.290 €) plus Hosting und laufender Pflege; Premium enthält zusätzlich
 * Beiträge, Antwortentwürfe und einen Vor-Ort-Termin pro Quartal.
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
  { id: 'basis', monthly: price('abo.basis.monthly'), setupFee: price('abo.basis.setup'), minTermMonths: price('abo.basis.term'), points: 5 },
  { id: 'business', monthly: price('abo.business.monthly'), setupFee: price('abo.business.setup'), minTermMonths: price('abo.business.term'), points: 6, featured: true },
  { id: 'premium', monthly: price('abo.premium.monthly'), setupFee: price('abo.premium.setup'), minTermMonths: price('abo.premium.term'), points: 6 },
];

export const SUBSCRIPTION_PRICE_FROM = Math.min(...SUBSCRIPTION_PLANS.map((p) => p.monthly));

export function planPrice(plan: SubscriptionPlan, billing: Billing): number {
  return billing === 'yearly' ? plan.monthly * YEARLY_MONTHS_CHARGED : plan.monthly;
}
