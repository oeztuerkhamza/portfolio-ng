/** Datenformen und Rechenhilfen für Rechnungen im Admin-Portal. */

export interface InvoiceItem {
  description: string;
  qty: number;
  unit: string;
  unit_price: number;
}

export interface InvoiceProfile {
  company: string;
  owner: string;
  street: string;
  city: string;
  phone: string;
  email: string;
  web: string;
  tax_number: string;
  vat_id: string;
  bank: string;
  iban: string;
  bic: string;
  small_business: boolean;
  due_days: number;
  intro: string;
  closing: string;
}

export interface Invoice {
  id?: string;
  number: string | null;
  status: 'entwurf' | 'offen' | 'bezahlt' | 'storniert';
  kind: 'rechnung' | 'storno';
  cancels_id?: string | null;
  customer_id: string | null;
  recipient_name: string;
  recipient_business: string | null;
  recipient_street: string | null;
  recipient_city: string | null;
  recipient_email: string | null;
  issue_date: string;
  service_period: string | null;
  due_days: number;
  due_date?: string;
  items: InvoiceItem[];
  vat_rate: number;
  small_business: boolean;
  intro: string | null;
  notes: string | null;
  net_total?: number | string;
  vat_total?: number | string;
  gross_total?: number | string;
  sender?: InvoiceProfile | null;
  paid_at?: string | null;
  created_at?: string;
}

export const INVOICE_STATUS: Record<Invoice['status'], string> = {
  entwurf: 'Taslak',
  offen: 'Ödeme bekleniyor',
  bezahlt: 'Ödendi',
  storniert: 'İptal (Storno)',
};

export const EMPTY_PROFILE: InvoiceProfile = {
  company: 'Breisgau Digital',
  owner: '',
  street: '',
  city: '',
  phone: '',
  email: '',
  web: '',
  tax_number: '',
  vat_id: '',
  bank: '',
  iban: '',
  bic: '',
  small_business: true,
  due_days: 14,
  intro: '',
  closing: 'Mit freundlichen Grüßen',
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Gleiche Rechnung wie auf dem Server (src/server/invoices.ts). */
export function totals(items: InvoiceItem[], vatRate: number, smallBusiness: boolean) {
  const net = round2(items.reduce((s, i) => s + round2((Number(i.qty) || 0) * (Number(i.unit_price) || 0)), 0));
  const vat = smallBusiness ? 0 : round2((net * vatRate) / 100);
  return { net, vat, gross: round2(net + vat) };
}

/** 'YYYY-MM-DD…' → Date in lokaler Zeit, ohne Zeitzonenverschiebung. */
export function day(v: unknown): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v ?? ''));
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
}

export const deDate = (v: unknown) => day(v)?.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) ?? '—';

export function addDays(v: unknown, n: number): Date | null {
  const d = day(v);
  if (!d) return null;
  d.setDate(d.getDate() + n);
  return d;
}

export const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const money = (v: unknown) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(v ?? 0));

export const qtyText = (v: unknown) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(Number(v ?? 0));

/** IBAN in Vierergruppen. */
export const ibanText = (v: string) => v.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
