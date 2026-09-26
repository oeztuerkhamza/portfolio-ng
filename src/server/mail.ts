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
  /**
   * Katalogschlüssel der Position. Daran hängt, wie es weitergeht: eine
   * Bewertungskarte richten wir auf das Google-Profil ein, eine eigene
   * NFC-Karte braucht zuerst Inhalte vom Kunden. Ältere Bestellungen haben
   * den Schlüssel nicht — die gelten als Bewertungskarten, wie bisher.
   */
  key?: string;
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

/** Ein Kontakt, den ein Gast auf einer Karte hinterlassen hat. */
export interface LeadMailData {
  /** Firmen- oder Personenname auf der Karte — welche Karte war es. */
  cardTitle: string;
  cardSlug: string;
  lang: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  /** Öffentliche Adresse, für die Verweise auf Karte und Portal. */
  siteUrl: string;
}

/**
 * Nachricht an uns, wenn jemand seine Daten auf einer Karte dalässt.
 *
 * Ohne sie erfährt niemand davon, bis das Portal das nächste Mal geöffnet
 * wird — ein Interessent, der Tage wartet, ist keiner mehr. Darum steht alles
 * Nötige schon im Betreff und in den ersten Zeilen: wer, von welcher Karte,
 * und wie man ihn erreicht.
 *
 * `reply-to` setzt der Aufrufer auf die Adresse des Gastes, damit ein
 * Antworten-Klick genügt.
 *
 * Reine Funktion ohne Netz und Datenbank — so ist sie testbar.
 */
export function leadNotification(d: LeadMailData): { subject: string; text: string } {
  const site = d.siteUrl.replace(/\/+$/, '');
  const reach = [d.email, d.phone].filter(Boolean).join(' · ');

  const text = [
    `${d.name} hat Daten auf Ihrer Karte „${d.cardTitle}" hinterlassen.`,
    '',
    `Name:     ${d.name}`,
    ...(d.company ? [`Firma:    ${d.company}`] : []),
    ...(d.email ? [`E-Mail:   ${d.email}`] : []),
    ...(d.phone ? [`Telefon:  ${d.phone}`] : []),
    ...(d.message ? ['', 'Nachricht:', d.message] : []),
    '',
    `Karte:    ${site}/k/${d.cardSlug}`,
    `Portal:   ${site}/admin (Reiter „NFC kartları")`,
    '',
    'Auf diese E-Mail antworten geht direkt an den Gast, falls er eine',
    'Adresse hinterlassen hat. Im Portal können Sie den Eintrag abhaken,',
    'sobald Sie sich gemeldet haben.',
  ].join('\n');

  // Der Betreff muss im Postfach allein schon reichen: Name und Rückweg.
  return { subject: `Neuer Kontakt über „${d.cardTitle}": ${d.name}${reach ? ` (${reach})` : ''}`, text };
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

  // Zwei Produktwelten, zwei nächste Schritte. Wer beides bestellt, bekommt
  // beides zu lesen; wer eine alte Bestellung hat (ohne `key`), den Absatz
  // zu den Bewertungskarten.
  const isCard = (i: OrderMailItem) => (i.key ?? '').startsWith('card.');
  const cards = d.items.filter(isCard);
  const next: string[] = [];

  if (d.items.some((i) => !isCard(i))) {
    next.push(
      'Wir richten Ihre Karten auf Ihr Google-Profil ein und schicken Ihnen den',
      'Entwurf per E-Mail zur Freigabe.',
    );
  }
  if (cards.length) {
    if (next.length) next.push('');
    next.push(
      'Für Ihre NFC-Karte brauchen wir noch die Inhalte. Antworten Sie einfach auf',
      'diese E-Mail mit:',
    );
    if (cards.some((i) => i.key === 'card.business')) {
      next.push(
        '  • Logo oder Foto, Firmen- oder Personenname',
        '  • Telefon, E-Mail, Adresse und Website',
        '  • die Links, die auf der Karte stehen sollen (Instagram, WhatsApp …)',
      );
    }
    if (cards.some((i) => i.key === 'card.gift')) {
      next.push(
        '  • Überschrift, für wen und von wem',
        '  • Ihre Fotos und, wenn Sie mögen, der Link zu einem Lied',
      );
    }
    next.push(
      'Wir bauen daraus die Seite Ihrer Karte, schicken Ihnen die Adresse zur',
      'Freigabe und programmieren danach den Chip.',
    );
  }

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
    'Wie es weitergeht:',
    ...next,
    '',
    'Bis zu Ihrer Freigabe können Sie die Bestellung kostenlos stornieren. Mit der',
    'Freigabe beginnt die Herstellung; ab dann besteht für die auf Sie',
    'zugeschnittenen Karten kein Widerrufsrecht (§ 312g Abs. 2 Nr. 1 BGB). Die',
    'Lieferzeit beträgt danach 5 bis 10 Werktage.',
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
