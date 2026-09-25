import nodemailer from 'nodemailer';
import { config } from './config';

/**
 * Gemeinsamer Postausgang: Rechnungen (src/server/invoices.ts) und die
 * Bestellbestätigung des Shops (src/server/api.ts) verschicken über dasselbe
 * Postfach. Fehlen die SMTP-Angaben, gibt mailer() null zurück und der
 * Aufrufer verschickt einfach nichts.
 */
export function mailer() {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) return null;
  return nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465,
    auth: { user: config.smtpUser, pass: config.smtpPass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

export const euro = (n: unknown) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(n) || 0);

export interface OrderMailItem {
  label: string;
  qty: number;
  unit_price: number;
}

export interface OrderMailData {
  orderId: string;
  customerName?: string | null;
  items: OrderMailItem[];
  amountTotal: number;
  /** Öffentliche Adresse für die Links auf die Pflichtseiten. */
  siteUrl: string;
  /** Absenderangaben aus dem Rechnungsprofil (settings.invoice_profile). */
  sender: Record<string, string>;
}

/**
 * Text der Bestellbestätigung. Sie ist zugleich die Bestätigung des
 * Vertrages in Textform (§ 312f BGB): darum stehen Bestellnummer, Positionen,
 * Gesamtbetrag, der Hinweis auf § 19 UStG, der weitere Ablauf und die Links
 * auf AGB, Widerrufsbelehrung und Versandbedingungen darin.
 *
 * Reine Funktion ohne Netz und Datenbank — so ist sie testbar.
 */
export function orderConfirmation(d: OrderMailData): { subject: string; text: string } {
  const company = d.sender['company'] || 'Breisgau Digital';
  const short = d.orderId.slice(0, 8);
  const site = d.siteUrl.replace(/\/+$/, '');
  const name = (d.customerName ?? '').trim();

  const lines = d.items.map((i) => `  ${i.qty} × ${i.label} — ${euro(i.qty * i.unit_price)}`);

  const text = [
    name ? `Guten Tag ${name},` : 'Guten Tag,',
    '',
    'vielen Dank für Ihre Bestellung. Ihre Zahlung ist bei uns eingegangen.',
    '',
    `Bestellnummer: ${d.orderId}`,
    '',
    ...lines,
    `  Gesamt: ${euro(d.amountTotal)}`,
    '',
    'Als Kleinunternehmer nach § 19 UStG wird keine Umsatzsteuer berechnet.',
    '',
    'Wie es weitergeht: Wir richten Ihre Karten auf Ihr Google-Profil ein und',
    'schicken Ihnen den Entwurf per E-Mail zur Freigabe. Bis zu Ihrer Freigabe',
    'können Sie die Bestellung kostenlos stornieren. Mit der Freigabe beginnt die',
    'Herstellung; ab dann besteht für die auf Sie zugeschnittenen Karten kein',
    'Widerrufsrecht (§ 312g Abs. 2 Nr. 1 BGB). Die Lieferzeit beträgt danach 5 bis',
    '10 Werktage.',
    '',
    'Unsere Bedingungen zum Nachlesen:',
    `  AGB: ${site}/de/agb`,
    `  Widerrufsbelehrung: ${site}/de/widerruf`,
    `  Versand und Zahlung: ${site}/de/versand`,
    '',
    d.sender['closing'] || 'Mit freundlichen Grüßen',
    ...[d.sender['owner'], company, d.sender['phone'], d.sender['web']].filter(Boolean),
  ].join('\n');

  return { subject: `Bestellbestätigung ${short} – ${company}`, text };
}
