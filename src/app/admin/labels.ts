/** Türkische Bezeichnungen für die Werte aus der Datenbank. */

export const ENQUIRY_STATUS: Record<string, string> = {
  neu: 'Yeni',
  kontaktiert: 'Görüşüldü',
  angebot: 'Teklif verildi',
  kunde: 'Müşteri oldu',
  abgesagt: 'Olumsuz',
};

export const ORDER_STATUS: Record<string, string> = {
  offen: 'Ödeme bekleniyor',
  bezahlt: 'Ödendi',
  in_arbeit: 'Hazırlanıyor',
  versendet: 'Gönderildi',
  storniert: 'İptal',
};

export const SUB_STATUS: Record<string, string> = {
  aktiv: 'Aktif',
  pausiert: 'Durduruldu',
  gekuendigt: 'Feshedildi',
};

export const TOPICS: Record<string, string> = {
  cards: 'Değerlendirme kartları',
  web: 'Web sitesi',
  sh: 'Smart Home',
  abo: 'Abonelik',
  other: 'Diğer',
};

export const PLANS: Record<string, string> = { basis: 'Basis', business: 'Business', premium: 'Premium' };
export const BILLING: Record<string, string> = { monthly: 'Aylık', yearly: 'Yıllık' };

export const keys = (o: Record<string, string>) => Object.keys(o);

export const eur = (v: unknown) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(Number(v ?? 0));

export const date = (v: unknown) => (v ? new Date(String(v)).toLocaleDateString('de-DE') : '—');
export const dateTime = (v: unknown) =>
  v ? new Date(String(v)).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '—';
