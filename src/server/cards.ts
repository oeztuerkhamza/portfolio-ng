import { config } from './config';

/**
 * NFC-Karten mit eigener Seite: /k/<slug>.
 *
 * Bewusst serverseitig gebautes HTML, kein Angular. Wer eine Karte an das
 * Handy hält, soll die Seite sofort sehen — auch bei schlechtem Mobilfunk.
 * Darum: ein Dokument, Stil inline, kein JavaScript, keine Fremdanfragen
 * außer dem Bild, das der Kunde selbst hinterlegt hat.
 *
 * Aller Inhalt kommt aus der Datenbank und wird deshalb konsequent
 * maskiert (siehe esc) und jede Adresse geprüft (siehe httpsUrl).
 */

export type CardKind = 'business' | 'gift';
export const CARD_KINDS: CardKind[] = ['business', 'gift'];
export const CARD_THEMES = ['brand', 'dark', 'warm'] as const;
export type CardTheme = (typeof CARD_THEMES)[number];

/**
 * Sprache der Karte. Sie hat nichts mit der Sprache der Website zu tun: eine
 * Karte liegt beim Gast in der Hand, und der spricht die Sprache des Kunden,
 * nicht die des Shops. Bisher stand auf jeder Karte „Telefon" — auch auf der
 * eines Betriebs, dessen Gäste Französisch sprechen.
 */
export const CARD_LANGS = ['de', 'fr', 'en', 'tr', 'ku'] as const;
export type CardLang = (typeof CARD_LANGS)[number];

/** Rückmeldung zum Kontaktbogen, aus der Adresse gelesen. */
export type CardNotice = 'thanks' | 'need' | 'consent' | null;

/**
 * Die zwei Hälften des Kontaktbogens: hierher leitet der Server nach dem
 * Absenden (POST-Redirect-GET), und daraus liest die Kartenseite die
 * Rückmeldung wieder heraus. Beides steht bewusst nebeneinander — solange es
 * in zwei Dateien lag, konnte das eine sich ändern und das andere nicht.
 *
 *   'ok'      — angenommen, Bestätigung zeigen
 *   'need'    — Angabe fehlte, Bogen offen lassen und sagen, was fehlt
 *   'consent' — das Häkchen fehlte; ohne Einwilligung nehmen wir nichts an
 *   'drop'    — stillschweigend verworfen (Bot, zu viele Versuche, Karte ohne
 *               Bogen): dieselbe Adresse wie ein gewöhnlicher Aufruf
 */
export const leadRedirect = (slug: string, outcome: 'ok' | 'need' | 'consent' | 'drop'): string =>
  `/k/${slug}` +
  (outcome === 'ok' ? '?danke=1' : outcome === 'need' ? '?fehler=1' : outcome === 'consent' ? '?zustimmung=1' : '');

/** Umgekehrter Weg: die Rückmeldung aus den Parametern der Adresse. */
export const cardNotice = (query: Record<string, unknown> | undefined): CardNotice =>
  query?.['danke'] ? 'thanks' : query?.['fehler'] ? 'need' : query?.['zustimmung'] ? 'consent' : null;

/**
 * Alles, was auf einer Karte steht und nicht vom Kunden kommt.
 *
 * Die Liste ist der Vertrag: `LABELS` ist als `Record<CardLang, Record<
 * LabelKey, string>>` getippt, und damit weigert sich der Übersetzer, eine
 * Sprache mit einer fehlenden Beschriftung anzunehmen. Ein Test könnte das
 * nicht so gut — er würde eine fehlende türkische Zeile nicht sehen, weil
 * zur Laufzeit stillschweigend die deutsche einspringt.
 */
export const LABEL_KEYS = [
  'phone',
  'email',
  'web',
  'address',
  'save',
  'listen',
  'to',
  'from',
  'leadOpen',
  'leadHint',
  'leadName',
  'leadEmail',
  'leadPhone',
  'leadCompany',
  'leadMessage',
  'leadSend',
  'leadNote',
  'leadThanks',
  'leadNeed',
  'leadConsent',
  'leadConsentNeed',
  'privacy',
] as const;
export type LabelKey = (typeof LABEL_KEYS)[number];

/**
 * `{n}` wird durch den Namen ersetzt — die Wortstellung gehört der Sprache:
 * im Türkischen steht „für" hinter dem Namen, im Deutschen davor.
 *
 * `leadNote` ist kein Marketingtext, sondern die Kurzinformation nach Art. 13
 * DSGVO: sie muss sagen, wer die Angaben bekommt (der Inhaber der Karte) und
 * wozu. Der Verweis daneben führt auf die ausführliche Erklärung. Wer den
 * Wortlaut ändert, ändert eine Pflichtangabe.
 */
const LABELS: Record<CardLang, Record<LabelKey, string>> = {
  de: {
    phone: 'Telefon', email: 'E-Mail', web: 'Web', address: 'Adresse',
    save: 'Zu Kontakten hinzufügen', listen: 'Lied anhören',
    to: 'Für {n}', from: 'von {n}',
    leadOpen: 'Ihre Daten dalassen', leadHint: 'Wir melden uns bei Ihnen.',
    leadName: 'Name', leadEmail: 'E-Mail', leadPhone: 'Telefon', leadCompany: 'Firma',
    leadMessage: 'Nachricht', leadSend: 'Absenden',
    leadNote: 'Ihre Angaben gehen an den Inhaber dieser Karte, damit er sich bei Ihnen melden kann. Keine Werbung, keine Weitergabe an Dritte.',
    leadThanks: 'Danke — wir melden uns bei Ihnen.',
    leadNeed: 'Bitte Name und E-Mail oder Telefon angeben.',
    leadConsent: 'Ich bin damit einverstanden, dass meine Angaben gespeichert und an den Inhaber dieser Karte weitergegeben werden, damit er sich bei mir melden kann.',
    leadConsentNeed: 'Bitte stimmen Sie der Speicherung zu — ohne Ihre Einwilligung dürfen wir die Angaben nicht annehmen.',
    privacy: 'Datenschutz',
  },
  fr: {
    phone: 'Téléphone', email: 'E-mail', web: 'Site', address: 'Adresse',
    save: 'Ajouter aux contacts', listen: 'Écouter la chanson',
    to: 'Pour {n}', from: 'de {n}',
    leadOpen: 'Laisser vos coordonnées', leadHint: 'Nous vous recontactons.',
    leadName: 'Nom', leadEmail: 'E-mail', leadPhone: 'Téléphone', leadCompany: 'Société',
    leadMessage: 'Message', leadSend: 'Envoyer',
    leadNote: 'Vos coordonnées vont au titulaire de cette carte, afin qu’il puisse vous recontacter. Aucune publicité, aucune transmission à des tiers.',
    leadThanks: 'Merci — nous vous recontactons.',
    leadNeed: 'Merci d’indiquer un nom et un e-mail ou un téléphone.',
    leadConsent: 'J’accepte que mes coordonnées soient enregistrées et transmises au titulaire de cette carte afin qu’il puisse me recontacter.',
    leadConsentNeed: 'Merci de donner votre accord — sans votre consentement, nous ne pouvons pas enregistrer ces données.',
    privacy: 'Confidentialité',
  },
  en: {
    phone: 'Phone', email: 'Email', web: 'Web', address: 'Address',
    save: 'Save to contacts', listen: 'Listen to the song',
    to: 'For {n}', from: 'from {n}',
    leadOpen: 'Leave your details', leadHint: 'We will get back to you.',
    leadName: 'Name', leadEmail: 'Email', leadPhone: 'Phone', leadCompany: 'Company',
    leadMessage: 'Message', leadSend: 'Send',
    leadNote: 'Your details go to the holder of this card so they can get back to you. No advertising, no passing on to third parties.',
    leadThanks: 'Thank you — we will get back to you.',
    leadNeed: 'Please give a name and an email or phone number.',
    leadConsent: 'I agree that my details may be stored and passed to the holder of this card so that they can get back to me.',
    leadConsentNeed: 'Please agree to the storage — without your consent we may not accept the details.',
    privacy: 'Privacy',
  },
  tr: {
    phone: 'Telefon', email: 'E-posta', web: 'Web', address: 'Adres',
    save: 'Rehbere kaydet', listen: 'Şarkıyı dinle',
    to: '{n} için', from: '{n} tarafından',
    leadOpen: 'Bilgilerinizi bırakın', leadHint: 'Size geri döneriz.',
    leadName: 'Ad', leadEmail: 'E-posta', leadPhone: 'Telefon', leadCompany: 'Firma',
    leadMessage: 'Mesaj', leadSend: 'Gönder',
    leadNote: 'Bilgileriniz, size dönebilmesi için bu kartın sahibine gider. Reklam yok, üçüncü kişilerle paylaşım yok.',
    leadThanks: 'Teşekkürler — size geri döneceğiz.',
    leadNeed: 'Lütfen ad ve e-posta ya da telefon yazın.',
    leadConsent: 'Bilgilerimin saklanmasını ve bana dönebilmesi için bu kartın sahibine iletilmesini kabul ediyorum.',
    leadConsentNeed: 'Lütfen saklanmasını onaylayın — onayınız olmadan bilgileri alamayız.',
    privacy: 'Gizlilik',
  },
  ku: {
    phone: 'Telefon', email: 'E-name', web: 'Malper', address: 'Navnîşan',
    save: 'Têxe nav pêwendiyan', listen: 'Li stranê guhdarî bike',
    to: 'Ji bo {n}', from: 'ji {n}',
    leadOpen: 'Agahiyên xwe bihêlin', leadHint: 'Em ê bi we re têkilî daynin.',
    leadName: 'Nav', leadEmail: 'E-name', leadPhone: 'Telefon', leadCompany: 'Şirket',
    leadMessage: 'Peyam', leadSend: 'Bişîne',
    leadNote: 'Agahiyên we ji xwediyê vê kartê re diçin, ku ew bikaribe bi we re têkilî daynin. Ne reklam, ne dayîna kesên sêyem.',
    leadThanks: 'Spas — em ê bi we re têkilî daynin.',
    leadNeed: 'Ji kerema xwe nav û e-name an telefonê binivîsin.',
    leadConsent: 'Ez razî me ku agahiyên min werin tomarkirin û ji xwediyê vê kartê re werin dayîn, ku ew bikaribe bi min re têkilî daynin.',
    leadConsentNeed: 'Ji kerema xwe razîbûna xwe bidin — bêyî razîbûna we em nikarin agahiyan bigirin.',
    privacy: 'Parastina daneyan',
  },
};

/**
 * Beschriftung in der Sprache der Karte. Eine Sprache, die es nicht gibt,
 * fällt auf Deutsch zurück — `lang` kommt aus der Datenbank und kann dort
 * älter sein als dieser Code.
 */
export const label = (lang: CardLang, key: LabelKey, name?: string): string => {
  const table = LABELS[lang] ?? LABELS.de;
  // Der Schlüssel ist getippt; der Rückfall fängt nur einen Aufruf ohne
  // Übersetzer ab (gebündeltes JavaScript) und darf nie leer liefern.
  const value = table[key] ?? LABELS.de[key] ?? key;
  return name === undefined ? value : value.replace('{n}', name);
};

/**
 * Bekannte Netzwerke. Steht `net` an einem Link, wird er als Konto dieses
 * Netzwerks gezeichnet (eigene Beschriftung); sonst als gewöhnlicher Knopf.
 */
export const NETWORKS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  x: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  whatsapp: 'WhatsApp',
  spotify: 'Spotify',
  google: 'Google',
  web: 'Website',
} as const;
export type Network = keyof typeof NETWORKS;

export interface CardLink {
  label: string;
  url: string;
  /** Netzwerk, falls es eines ist. */
  net?: Network;
}

export interface BusinessCardData {
  company: string;
  tagline?: string;
  /** Logo des Betriebs — quer, wird oben gezeigt. */
  logoUrl?: string;
  /** Portrait der Person — rund, für die persönliche Karte. */
  avatarUrl?: string;
  phone?: string;
  email?: string;
  web?: string;
  address?: string;
  links?: CardLink[];
  /**
   * Kontaktbogen anzeigen: der Gast kann seine eigenen Daten dalassen. Muss
   * je Karte ausdrücklich eingeschaltet werden — wir sammeln keine Daten,
   * weil es technisch geht, sondern weil der Kunde es will.
   */
  leads?: boolean;
}

export interface GiftCardData {
  headline: string;
  to?: string;
  from?: string;
  message?: string;
  /** Mehrere Bilder, in der eingegebenen Reihenfolge. */
  photos?: string[];
  songUrl?: string;
  songLabel?: string;
}

export interface Card {
  slug: string;
  kind: CardKind;
  theme: CardTheme;
  /** Sprache der Beschriftungen. Fehlt sie, gilt Deutsch. */
  lang?: CardLang;
  data: BusinessCardData | GiftCardData;
}

/** Maximal so viele Links je Karte — mehr wird abgeschnitten. */
export const MAX_LINKS = 8;
/** Maximal so viele Bilder je Geschenkkarte. */
export const MAX_PHOTOS = 8;

// ── Maskieren und prüfen ───────────────────────────────────
/** Alles, was in HTML landet, läuft hier durch. */
export function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Nur https-Adressen. Damit ist `javascript:`, `data:` und alles andere
 * ausgeschlossen, was in einem href Schaden anrichten könnte.
 */
export function httpsUrl(value: unknown, max = 1000): string | null {
  const raw = String(value ?? '').trim();
  if (!raw || raw.length > max) return null;
  try {
    return new URL(raw).protocol === 'https:' ? raw : null;
  } catch {
    return null;
  }
}

const text = (value: unknown, max: number): string | null => {
  const s = String(value ?? '').trim();
  return s ? s.slice(0, max) : null;
};

/** Telefonnummer für den tel:-Link — nur Ziffern, Plus, Leerraum, Klammern. */
export function telHref(phone: string): string | null {
  const clean = phone.replace(/[^\d+]/g, '');
  return /^\+?\d{4,20}$/.test(clean) ? clean : null;
}

/** E-Mail sehr grob prüfen; sie landet nur in einem mailto:-Link. */
export function mailAddress(value: unknown): string | null {
  const s = String(value ?? '').trim();
  return /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(s) && s.length <= 200 ? s : null;
};

/**
 * Nimmt, was im Portal eingegeben wurde, und gibt genau die Felder zurück,
 * die die Karte kennt — leere weg, zu lange gekürzt, Adressen geprüft.
 * Fehlt das Pflichtfeld der Art, kommt null zurück.
 */
export function cardData(kind: CardKind, input: unknown): BusinessCardData | GiftCardData | null {
  const b = (input ?? {}) as Record<string, unknown>;

  if (kind === 'business') {
    const company = text(b['company'], 120);
    if (!company) return null;
    const links = (Array.isArray(b['links']) ? b['links'] : [])
      .map((l) => {
        const item = (l ?? {}) as Record<string, unknown>;
        const url = httpsUrl(item['url']);
        if (!url) return null;
        const net = (Object.keys(NETWORKS) as Network[]).find((n) => n === item['net']);
        // Ohne eigene Beschriftung tut es der Name des Netzwerks.
        const label = text(item['label'], 60) ?? (net ? NETWORKS[net] : null);
        return label ? { label, url, ...(net ? { net } : {}) } : null;
      })
      .filter((l): l is CardLink => l !== null)
      .slice(0, MAX_LINKS);

    const out: BusinessCardData = { company };
    const tagline = text(b['tagline'], 160);
    if (tagline) out.tagline = tagline;
    const logoUrl = httpsUrl(b['logoUrl']);
    if (logoUrl) out.logoUrl = logoUrl;
    const avatarUrl = httpsUrl(b['avatarUrl']);
    if (avatarUrl) out.avatarUrl = avatarUrl;
    const phone = text(b['phone'], 40);
    if (phone) out.phone = phone;
    const email = mailAddress(b['email']);
    if (email) out.email = email;
    const web = httpsUrl(b['web']);
    if (web) out.web = web;
    const address = text(b['address'], 200);
    if (address) out.address = address;
    if (links.length) out.links = links;
    if (b['leads'] === true) out.leads = true;
    return out;
  }

  const headline = text(b['headline'], 120);
  if (!headline) return null;
  const out: GiftCardData = { headline };
  const to = text(b['to'], 80);
  if (to) out.to = to;
  const from = text(b['from'], 80);
  if (from) out.from = from;
  const message = text(b['message'], 1200);
  if (message) out.message = message;
  const photos = (Array.isArray(b['photos']) ? b['photos'] : [])
    .map((u) => httpsUrl(u))
    .filter((u): u is string => u !== null)
    .slice(0, MAX_PHOTOS);
  if (photos.length) out.photos = photos;
  const songUrl = httpsUrl(b['songUrl']);
  if (songUrl) out.songUrl = songUrl;
  const songLabel = text(b['songLabel'], 120);
  if (songLabel) out.songLabel = songLabel;
  return out;
}

/**
 * Kurzname für eine Karte aus dem Namen des Betriebs.
 *
 * Buchstabe für Buchstabe dasselbe wie im Portal (suggestSlug in
 * src/app/admin/tabs/cards.tab.ts) — sonst heißt die Karte des „Café Grün"
 * einmal `cafe-gruen` und einmal `caf-grn`. Reihenfolge ist wichtig:
 *
 *   1. deutsche Umlaute ausschreiben (ü → ue, nicht u),
 *   2. türkische Buchstaben ersetzen (ı → i, ş → s …),
 *   3. was dann noch Akzente trägt, auf den Grundbuchstaben bringen
 *      (é → e) — erst hier, sonst wäre aus ü schon u geworden.
 *
 * Der Anhang hält den Namen eindeutig: zwei Kunden dürfen „Krone" heißen,
 * zwei Karten nicht denselben Kurznamen tragen. Das Ergebnis passt immer auf
 * die Prüfung der Datenbank (3–50 Zeichen, Anfang und Ende alphanumerisch).
 */
export function cardSlug(label: unknown, suffix: string): string {
  const base = String(label ?? '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '');
  const tail = String(suffix).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || '1';
  return `${base || 'karte'}-${tail}`;
}

/** Was ein Gast auf einer Karte hinterlassen hat, geprüft und gekürzt. */
export interface LeadInput {
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
}

/**
 * Den abgeschickten Kontaktbogen prüfen.
 *
 *   'trap'    — das versteckte Feld war gefüllt: ein Bot. Wird stillschweigend
 *               verworfen, damit er nicht lernt, woran es lag.
 *   'consent' — das Häkchen fehlt. Geprüft wird es hier und nicht nur im
 *               Browser: `required` im Formular hält niemanden auf, der das
 *               Formular umgeht, und ohne Einwilligung dürfen wir nichts
 *               speichern (Art. 6 Abs. 1 lit. a DSGVO).
 *   'need'    — Name fehlt, oder es gibt keinen Rückweg (weder E-Mail noch
 *               Telefon). Ein Name ohne Rückweg nützt niemandem.
 *
 * Gekürzt wird hier, nicht in der Datenbank: eine abgewiesene Zeile wäre für
 * den Gast ein Fehler, obwohl er nur zu viel geschrieben hat.
 */
export function leadFields(input: unknown): LeadInput | 'trap' | 'consent' | 'need' {
  const b = (input ?? {}) as Record<string, unknown>;
  const cut = (value: unknown, max: number): string | null => {
    if (typeof value !== 'string') return null;
    const s = value.trim();
    return s ? s.slice(0, max) : null;
  };

  if (cut(b['website'], 200)) return 'trap';
  // Ein nicht gesetztes Häkchen schickt der Browser gar nicht mit.
  if (!cut(b['consent'], 20)) return 'consent';

  const name = cut(b['name'], 120);
  const email = mailAddress(b['email']);
  const phone = cut(b['phone'], 40);
  if (!name || (!email && !phone)) return 'need';

  return { name, email, phone, company: cut(b['company'], 200), message: cut(b['message'], 2000) };
}

// ── Darstellung ────────────────────────────────────────────
// Zweiter Riegel: jede Adresse wird auch beim Zeichnen noch geprüft, nicht
// nur beim Speichern. Stünde durch einen alten Datensatz oder einen Eingriff
// an der Datenbank eine `javascript:`-Adresse im Feld, käme sie sonst bis in
// ein href.
/**
 * Text für eine vCard-Zeile entschärfen: Backslash, Semikolon und Komma
 * trennen dort Felder, ein Zeilenumbruch beendet die Eigenschaft. Ohne das
 * hier könnte ein Firmenname eine weitere Eigenschaft in die Datei schreiben.
 * Reihenfolge ist wichtig: erst der Backslash, sonst würde das `\n` am Ende
 * gleich wieder verdoppelt.
 */
const vEsc = (value: string): string =>
  String(value)
    .replace(/\\/g, '\\\\')
    .replace(/([;,])/g, '\\$1')
    .replace(/\r\n|[\r\n]/g, '\\n');

/**
 * Zeilen auf 75 Oktett falten, wie RFC 2426 es verlangt — die Fortsetzung
 * beginnt mit einem Leerzeichen. Gezählt werden Bytes, geschnitten wird an
 * Zeichengrenzen, sonst zerfällt ein Umlaut in zwei halbe Bytes und das
 * Adressbuch zeigt Kauderwelsch.
 */
function fold(line: string): string {
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = Buffer.byteLength(ch);
    if (bytes + n > 75) {
      out.push(cur);
      cur = ' ';
      bytes = 1;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join('\r\n');
}

/**
 * Die Karte als vCard 3.0 — das ist das Format, das iPhone, Android und
 * Outlook ohne Nachfragen in die Kontakte übernehmen. 4.0 kann Android bis
 * heute nicht zuverlässig lesen.
 *
 * Geprüft wird hier noch einmal alles, genau wie beim Zeichnen der Seite:
 * Was in der Datenbank steht, kann aus einer älteren Version stammen oder von
 * Hand geändert worden sein.
 *
 * Gibt null zurück, wenn es nichts zu speichern gibt — ein Knopf, der nur
 * einen Namen in die Kontakte legt, hilft niemandem.
 */
export function vcard(d: BusinessCardData): string | null {
  const tel = d.phone ? telHref(d.phone) : null;
  const mail = mailAddress(d.email);
  const web = httpsUrl(d.web);
  const address = text(d.address, 300);
  if (!tel && !mail && !web && !address) return null;

  const company = text(d.company, 120) ?? '';
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  lines.push(`FN:${vEsc(company)}`);
  // N ist in vCard 3.0 Pflicht. Wir führen einen Betrieb, keine Person —
  // darum alle fünf Namensteile leer.
  lines.push('N:;;;;');
  lines.push(`ORG:${vEsc(company)}`);
  if (d.tagline) lines.push(`NOTE:${vEsc(text(d.tagline, 200) ?? '')}`);
  if (tel) lines.push(`TEL;TYPE=WORK,VOICE:${vEsc(tel)}`);
  if (mail) lines.push(`EMAIL;TYPE=INTERNET,WORK:${vEsc(mail)}`);
  if (web) lines.push(`URL:${vEsc(web)}`);
  // Unsere Adresse ist ein Freitextfeld; in der vCard steht sie deshalb
  // komplett im Straßenfeld statt zerlegt auf Straße/Ort/PLZ.
  if (address) lines.push(`ADR;TYPE=WORK:;;${vEsc(address)};;;;`);
  for (const l of d.links ?? []) {
    const url = httpsUrl(l?.url);
    if (url) lines.push(`URL:${vEsc(url)}`);
  }
  const photo = httpsUrl(d.avatarUrl) ?? httpsUrl(d.logoUrl);
  if (photo) lines.push(`PHOTO;VALUE=URI:${vEsc(photo)}`);
  lines.push('END:VCARD');

  return lines.map(fold).join('\r\n') + '\r\n';
}

const THEMES: Record<CardTheme, { bg: string; panel: string; ink: string; dim: string; accent: string; onAccent: string }> = {
  brand: { bg: '#f6f8fb', panel: '#ffffff', ink: '#0e1a2b', dim: '#5d6d85', accent: '#1a4b8c', onAccent: '#ffffff' },
  dark: { bg: '#0e1a2b', panel: '#16273d', ink: '#f2f5f9', dim: '#93a1b3', accent: '#5b93d6', onAccent: '#0e1a2b' },
  warm: { bg: '#fbf7f1', panel: '#ffffff', ink: '#2b1d0e', dim: '#7a6853', accent: '#a9741f', onAccent: '#ffffff' },
};

const styles = (t: (typeof THEMES)[CardTheme]) => `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:${t.bg};color:${t.ink};font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-text-size-adjust:100%;padding:24px 16px 40px;display:flex;justify-content:center}
.card{width:100%;max-width:420px;background:${t.panel};border-radius:20px;padding:28px 24px 24px;
  box-shadow:0 1px 2px rgba(14,26,43,.06),0 12px 32px rgba(14,26,43,.10)}
.logo{display:block;max-width:160px;max-height:90px;margin:0 auto 14px;object-fit:contain}
.avatar{display:block;width:104px;height:104px;border-radius:999px;object-fit:cover;margin:0 auto 16px;
  box-shadow:0 0 0 4px ${t.panel},0 0 0 5px rgba(147,161,179,.35)}
.gallery{display:grid;gap:8px;margin:0 0 18px}
.gallery.multi{grid-template-columns:1fr 1fr}
.gallery img{display:block;width:100%;height:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px}
.gallery.multi img:first-child:nth-last-child(odd){grid-column:span 2}
h1{margin:0 0 4px;font-size:1.5rem;line-height:1.25;letter-spacing:-.01em}
.tagline,.who{margin:0 0 20px;color:${t.dim};font-size:.95rem}
.msg{margin:0 0 22px;white-space:pre-line}
.rows{margin:0 0 20px;padding:0;list-style:none;display:grid;gap:2px}
.rows a,.rows span{display:block;padding:11px 0;color:${t.ink};text-decoration:none;border-bottom:1px solid rgba(147,161,179,.28)}
.rows li:last-child a,.rows li:last-child span{border-bottom:0}
.rows b{display:block;font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${t.dim}}
.btn{display:block;text-align:center;padding:14px 18px;border-radius:999px;background:${t.accent};color:${t.onAccent};
  text-decoration:none;font-weight:600;margin:0 0 10px}
.btn.ghost{background:transparent;color:${t.accent};border:1px solid ${t.accent}}
.thanks{margin:18px 0 0;padding:14px 16px;border-radius:14px;background:${t.accent};color:${t.onAccent};text-align:center;font-weight:600}
.lead{margin:6px 0 0;border-top:1px solid rgba(147,161,179,.28);padding-top:14px}
.lead summary{cursor:pointer;font-weight:600;color:${t.accent};list-style:none;padding:6px 0}
.lead summary::-webkit-details-marker{display:none}
.lead summary::after{content:" +";font-weight:400}
.lead[open] summary::after{content:" −"}
.lead-hint{margin:2px 0 12px;color:${t.dim};font-size:.9rem}
.lead-need{margin:2px 0 12px;padding:10px 12px;border-radius:12px;border:1px solid ${t.accent};color:${t.ink};font-size:.9rem}
.lead label{display:block;margin:0 0 10px}
.lead label span{display:block;font-size:.72rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${t.dim};margin:0 0 4px}
.lead input,.lead textarea{width:100%;font:inherit;color:${t.ink};background:${t.bg};border:1px solid rgba(147,161,179,.5);
  border-radius:12px;padding:11px 12px;-webkit-appearance:none}
.lead textarea{resize:vertical}
.lead input:focus-visible,.lead textarea:focus-visible,.lead button:focus-visible,.lead summary:focus-visible{outline:2px solid ${t.accent};outline-offset:2px}
.lead button{width:100%;font:inherit;font-weight:600;cursor:pointer;border:0;border-radius:999px;padding:14px 18px;
  background:${t.accent};color:${t.onAccent}}
/* Zwei Klassen, weil ".lead label" (Klasse + Typ) sonst gewinnt und aus dem
   Haekchen-Text eine Feldbeschriftung in Grossbuchstaben macht. */
.lead .lead-ok{display:flex;gap:10px;align-items:flex-start;margin:4px 0 14px}
.lead .lead-ok input{flex:0 0 auto;width:20px;height:20px;margin:1px 0 0;accent-color:${t.accent}}
.lead .lead-ok span{display:inline;margin:0;font-size:.8rem;font-weight:400;line-height:1.45;
  letter-spacing:normal;text-transform:none;color:${t.ink}}
.lead-note{margin:10px 0 0;color:${t.dim};font-size:.75rem;line-height:1.5}
/* Ohne eigene Farbe nimmt der Verweis das Browserblau — auf dem warmen
   Thema zu schwach für 0,75rem Schrift (unter 4,5:1). */
.lead-note a{color:${t.dim}}
.trap{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.foot{margin:22px 0 0;text-align:center;font-size:.72rem;color:${t.dim}}
.foot a{color:${t.dim}}
@media(prefers-reduced-motion:no-preference){.card{animation:in .28s ease-out}@keyframes in{from{opacity:0;transform:translateY(6px)}}}
`;

const row = (label: string, value: string, href?: string | null) =>
  `<li>${href ? `<a href="${esc(href)}">` : '<span>'}<b>${esc(label)}</b>${esc(value)}${href ? '</a>' : '</span>'}</li>`;

function businessBody(d: BusinessCardData, slug: string, lang: CardLang, notice: CardNotice): string {
  const t = (key: LabelKey, name?: string) => label(lang, key, name);
  const rows: string[] = [];
  if (d.phone) {
    const tel = telHref(d.phone);
    rows.push(row(t('phone'), d.phone, tel ? `tel:${tel}` : null));
  }
  const mail = mailAddress(d.email);
  if (mail) rows.push(row(t('email'), mail, `mailto:${mail}`));
  const web = httpsUrl(d.web);
  if (web) rows.push(row(t('web'), web.replace(/^https:\/\//, ''), web));
  // Die Adresse führt auf die Karte — am Handy landet man damit direkt in der
  // Navigation. Der Dienst bekommt nur die Adresse, keine Kennung von uns.
  if (d.address) rows.push(row(t('address'), d.address, `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`));

  const logo = httpsUrl(d.logoUrl);
  const links = (d.links ?? [])
    .map((l) => ({ label: l?.label, url: httpsUrl(l?.url) }))
    .filter((l): l is { label: string; url: string } => !!l.url && !!l.label);

  const avatar = httpsUrl(d.avatarUrl);

  /**
   * Der Knopf erscheint nur, wenn es etwas zu speichern gibt — sonst legt er
   * einen Kontakt ohne Telefon und ohne Mail ins Adressbuch. `download` macht
   * aus dem Klick auf dem Rechner einen Download; das Handy öffnet die Datei
   * direkt in den Kontakten.
   */
  const save = vcard(d) ? `<a class="btn" href="/k/${esc(slug)}/kontakt.vcf" download>${esc(t('save'))}</a>` : '';

  return [
    logo ? `<img class="logo" src="${esc(logo)}" alt="" />` : '',
    avatar ? `<img class="avatar" src="${esc(avatar)}" alt="" />` : '',
    `<h1>${esc(d.company)}</h1>`,
    d.tagline ? `<p class="tagline">${esc(d.tagline)}</p>` : '',
    rows.length ? `<ul class="rows">${rows.join('')}</ul>` : '',
    save,
    links.map((l) => `<a class="btn ghost" href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a>`).join(''),
    d.leads ? leadForm(slug, lang, notice) : '',
  ].join('');
}

function giftBody(d: GiftCardData, lang: CardLang): string {
  const t = (key: LabelKey, name?: string) => label(lang, key, name);
  const who = [d.to ? t('to', d.to) : '', d.from ? t('from', d.from) : ''].filter(Boolean).join(' · ');
  const photos = (d.photos ?? []).map((u) => httpsUrl(u)).filter((u): u is string => u !== null);
  const song = httpsUrl(d.songUrl);
  const gallery = photos.length
    ? `<div class="gallery${photos.length > 1 ? ' multi' : ''}">${photos.map((u) => `<img src="${esc(u)}" alt="" loading="lazy" />`).join('')}</div>`
    : '';
  return [
    gallery,
    `<h1>${esc(d.headline)}</h1>`,
    who ? `<p class="who">${esc(who)}</p>` : '',
    d.message ? `<p class="msg">${esc(d.message)}</p>` : '',
    song ? `<a class="btn" href="${esc(song)}" rel="noopener">${esc(d.songLabel || t('listen'))}</a>` : '',
  ].join('');
}

/**
 * Kontaktbogen — ohne eine Zeile JavaScript.
 *
 * `<details>` klappt von sich aus auf, das Formular schickt einen
 * gewöhnlichen POST. Danach leitet der Server auf dieselbe Seite zurück
 * (POST-Redirect-GET), damit ein Neuladen nicht ein zweites Mal abschickt.
 *
 * Das Feld `website` ist eine Falle: es steht aus dem Bild geschoben in der
 * Seite, ein Mensch sieht es nicht, ein Formular-Bot füllt es aus. Ist es
 * gefüllt, nimmt der Server den Eintrag nicht an.
 */
function leadForm(slug: string, lang: CardLang, notice: CardNotice): string {
  const t = (key: LabelKey) => esc(label(lang, key));
  if (notice === 'thanks') return `<p class="thanks" role="status">${t('leadThanks')}</p>`;

  const field = (name: string, key: LabelKey, type: string, extra: string) =>
    `<label><span>${t(key)}</span><input type="${type}" name="${name}" ${extra} /></label>`;

  // Fehlte eine Angabe oder das Häkchen, bleibt der Bogen offen — sonst
  // müsste der Gast ihn erst wieder aufklappen, um zu sehen, was schiefging.
  const need = notice === 'need';
  const missingConsent = notice === 'consent';
  const open = need || missingConsent;

  return `<details class="lead"${open ? ' open' : ''}>
<summary>${t('leadOpen')}</summary>
<form method="post" action="/k/${esc(slug)}/kontakt">
${need ? `<p class="lead-need" role="alert">${t('leadNeed')}</p>` : ''}
${missingConsent ? `<p class="lead-need" role="alert">${t('leadConsentNeed')}</p>` : ''}
<p class="lead-hint">${t('leadHint')}</p>
${field('name', 'leadName', 'text', 'required maxlength="120" autocomplete="name"')}
${field('email', 'leadEmail', 'email', 'maxlength="200" autocomplete="email"')}
${field('phone', 'leadPhone', 'tel', 'maxlength="40" autocomplete="tel"')}
${field('company', 'leadCompany', 'text', 'maxlength="200" autocomplete="organization"')}
<label><span>${t('leadMessage')}</span><textarea name="message" rows="3" maxlength="2000"></textarea></label>
<input class="trap" type="text" name="website" tabindex="-1" autocomplete="off" />
<label class="lead-ok"><input type="checkbox" name="consent" value="ja" required /><span>${t('leadConsent')}</span></label>
<button type="submit">${t('leadSend')}</button>
<p class="lead-note">${t('leadNote')} <a href="/${lang}/datenschutz" rel="noopener">${t('privacy')}</a></p>
</form>
</details>`;
}

/** Bild für die Vorschau in Messengern — nur, was der Kunde selbst hinterlegt hat. */
const previewImage = (d: BusinessCardData & GiftCardData): string | null =>
  httpsUrl(d.logoUrl) ?? httpsUrl(d.avatarUrl) ?? httpsUrl((d.photos ?? [])[0]);

/**
 * Die ganze Seite einer Karte. `base` ist die öffentliche Adresse der
 * Website — sie steht klein im Fuß, damit man sieht, wer die Seite zeigt.
 *
 * `notice` ist die Rückmeldung zum Kontaktbogen: `thanks` nach dem Absenden,
 * `need`, wenn eine Angabe fehlte. Beides kommt nach dem Weiterleiten aus der
 * Adresse — die Seite wird also ein zweites Mal gezeichnet.
 *
 * Die og:-Angaben sind für Messenger, nicht für Suchmaschinen: wer die
 * Adresse seiner Karte per WhatsApp schickt, soll Name und Bild in der
 * Vorschau sehen. `noindex` bleibt davon unberührt.
 */
export function renderCard(card: Card, base = config.siteUrl || '', notice: CardNotice = null): string {
  const t = THEMES[card.theme] ?? THEMES.brand;
  const lang: CardLang = CARD_LANGS.includes(card.lang as CardLang) ? (card.lang as CardLang) : 'de';
  const business = card.kind === 'business';
  const d = card.data as BusinessCardData & GiftCardData;
  const title = business ? d.company : d.headline;
  const subtitle = business ? d.tagline : [d.to, d.from].filter(Boolean).join(' · ');
  const site = base.replace(/\/+$/, '');
  const image = previewImage(d);

  return `<!doctype html>
<html lang="${lang}"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<meta name="referrer" content="no-referrer" />
<title>${esc(title)}</title>
<meta property="og:type" content="profile" />
<meta property="og:title" content="${esc(title)}" />${
    subtitle ? `\n<meta property="og:description" content="${esc(subtitle)}" />` : ''
  }${site ? `\n<meta property="og:url" content="${esc(`${site}/k/${card.slug}`)}" />` : ''}${
    image ? `\n<meta property="og:image" content="${esc(image)}" />\n<meta name="twitter:card" content="summary" />` : ''
  }
<style>${styles(t)}</style>
</head><body>
<main class="card">
${business ? businessBody(d, card.slug, lang, notice) : giftBody(d, lang)}
<p class="foot">${site ? `<a href="${esc(site)}" rel="noopener">${esc(site.replace(/^https:\/\//, ''))}</a>` : 'Breisgau Digital'}</p>
</main>
</body></html>`;
}
