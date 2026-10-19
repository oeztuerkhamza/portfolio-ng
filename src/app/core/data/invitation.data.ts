import { price } from './catalog';

/**
 * Digitale Einladung — drei Pakete, einmaliger Preis je Event.
 *
 * Preise kommen aus catalog.json (Schlüssel `inv.*`, im Admin-Portal unter
 * „Fiyatlar" pflegbar). Texte: `inv.pkg.<id>.name` / `.for` / `.p1`…`.pN`
 * in einladung.content.ts.
 */
export type InvitationPackageId = 'basis' | 'premium' | 'komplett';

export interface InvitationPackage {
  id: InvitationPackageId;
  price: number;
  points: number;
  featured?: boolean;
}

export const INVITATION_PACKAGES: InvitationPackage[] = [
  { id: 'basis', price: price('inv.basis'), points: 5 },
  { id: 'premium', price: price('inv.premium'), points: 6, featured: true },
  { id: 'komplett', price: price('inv.komplett'), points: 6 },
];

export const INVITATION_PRICE_FROM = Math.min(...INVITATION_PACKAGES.map((p) => p.price));
