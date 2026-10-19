/**
 * Datenmodell der digitalen Einladungen.
 *
 * Eine Einladung ist eine Konfiguration (`InviteEvent`) plus das, was Gäste
 * und Gastgeber dazutun: Zusagen (`InviteGuest`), Fotos (`InvitePhoto`) und
 * der private Plan des Gastgebers (`InvitePlan`). Dieselben Typen benutzt der
 * Server (src/server/invites.ts) — darum steht hier nichts, was Angular braucht.
 */

/** Sprachen der Einladungsseiten. Mehr als die Website: Arabisch für Gäste aus dem Nahen Osten. */
export type InviteLang = 'de' | 'tr' | 'en' | 'fr' | 'ku' | 'ar';
export const INVITE_LANGS: InviteLang[] = ['de', 'tr', 'en', 'fr', 'ku', 'ar'];
export const INVITE_LANG_NAMES: Record<InviteLang, string> = {
  de: 'Deutsch',
  tr: 'Türkçe',
  en: 'English',
  fr: 'Français',
  ku: 'Kurdî',
  ar: 'العربية',
};
/** Sprachen, die von rechts nach links laufen. */
export const RTL_LANGS: InviteLang[] = ['ar'];

/** Text, den der Gastgeber pro Sprache pflegen kann. Ein einfacher String gilt für alle Sprachen. */
export type LocalText = string | Partial<Record<InviteLang, string>>;

export type EventKind = 'wedding' | 'henna' | 'engagement' | 'birthday' | 'corporate' | 'other';
export const EVENT_KINDS: EventKind[] = ['wedding', 'henna', 'engagement', 'birthday', 'corporate', 'other'];

export type ThemeId =
  | 'klassik'
  | 'garten'
  | 'minimal'
  | 'kina'
  | 'orient'
  | 'rosa'
  | 'rustikal'
  | 'mediterran'
  | 'mitternacht'
  | 'business';

export type MusicId = 'none' | 'piano' | 'strings' | 'oud' | 'guitar' | 'lounge' | 'ambient';
export const MUSIC_IDS: MusicId[] = ['none', 'piano', 'strings', 'oud', 'guitar', 'lounge', 'ambient'];

export interface ScheduleItem {
  time: string; // "14:30"
  title: LocalText;
  text?: LocalText;
  /** Verweist auf `InviteLocation.id` — dann gibt es dort einen Routen-Knopf. */
  location?: string;
  icon?: 'ring' | 'glass' | 'dinner' | 'music' | 'camera' | 'heart' | 'cake' | 'mic' | 'henna' | 'coffee';
}

export interface InviteLocation {
  id: string;
  label: LocalText; // „Trauung", „Feier"
  name: string; // „Schlossgut Ebringen"
  address: string;
  lat?: number;
  lng?: number;
}

export interface InviteContact {
  role: LocalText;
  name: string;
  phone?: string;
}

export interface InviteGifts {
  text?: LocalText;
  accountHolder?: string;
  iban?: string;
  bic?: string;
  bank?: string;
  /** PayPal.me-Name oder vollständige paypal.me-Adresse. */
  paypal?: string;
  /** Verwendungszweck, der beim Kopieren und im GiroCode mitgeht. */
  reference?: string;
}

export interface InviteFaq {
  q: LocalText;
  a: LocalText;
}

export interface InviteEvent {
  slug: string;
  kind: EventKind;
  theme: ThemeId;
  music: MusicId;
  /** Eigene Musikdatei (mp3), überschreibt `music`. */
  musicUrl?: string;
  /** Angebotene Sprachen; die erste ist die Vorgabe. */
  langs: InviteLang[];
  /** „Ayşe & Mehmet" — oder der Titel eines Firmenevents. */
  title: string;
  /** Kleine Zeile über dem Titel: „Wir heiraten", „Kına Gecesi" … Leer = Vorgabe zur Art. */
  eyebrow?: LocalText;
  hosts?: LocalText; // „Die Familien Yılmaz und Demir laden ein"
  /** Datum und Uhrzeit des Beginns, ISO mit Offset: 2027-06-12T14:00:00+02:00 */
  date: string;
  /** Bis wann zugesagt werden soll (YYYY-MM-DD). */
  rsvpUntil?: string;
  welcome?: LocalText;
  story?: LocalText;
  dressCode?: LocalText;
  schedule: ScheduleItem[];
  locations: InviteLocation[];
  contacts: InviteContact[];
  faq: InviteFaq[];
  gifts?: InviteGifts;
  /** Titelbild und Galerie des Gastgebers (Adressen). */
  heroImage?: string;
  gallery: string[];
  /** Welche Abschnitte zu sehen sind. */
  sections: {
    countdown: boolean;
    story: boolean;
    schedule: boolean;
    locations: boolean;
    rsvp: boolean;
    gifts: boolean;
    photos: boolean;
    faq: boolean;
  };
  rsvp: {
    /** Menüwahl anbieten. */
    menu: boolean;
    /** Höchstzahl Personen je Antwort (inkl. Kinder). */
    maxPersons: number;
    /** Liedwunsch abfragen. */
    song: boolean;
  };
  /** Gäste dürfen Fotos ins Album laden. */
  guestUploads: boolean;
}

export type RsvpStatus = 'invited' | 'yes' | 'no' | 'maybe';
export type MenuChoice = '' | 'meat' | 'fish' | 'veggie' | 'vegan' | 'kids';
export const MENU_CHOICES: MenuChoice[] = ['meat', 'fish', 'veggie', 'vegan', 'kids'];

export interface InviteGuest {
  id: string;
  /** Persönlicher Code für den Link ?g=… */
  code: string;
  name: string;
  status: RsvpStatus;
  adults: number;
  children: number;
  menu: MenuChoice;
  allergies?: string;
  song?: string;
  message?: string;
  /** Seite des Brautpaars / Gruppe: frei, z. B. „Braut", „Kollegen". */
  group?: string;
  /** Tisch aus dem Sitzplan (`InviteTable.id`). */
  table?: string;
  phone?: string;
  note?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface InvitePhoto {
  id: string;
  url: string;
  by?: string;
  hidden: boolean;
  createdAt: string;
}

export interface InviteTask {
  id: string;
  title: string;
  /** YYYY-MM-DD */
  due?: string;
  done: boolean;
  category?: string;
}

export interface InviteBudgetItem {
  id: string;
  item: string;
  planned: number;
  paid: number;
}

export interface InviteTable {
  id: string;
  name: string;
  seats: number;
}

export interface InvitePlan {
  tasks: InviteTask[];
  budget: InviteBudgetItem[];
  budgetTotal: number;
  tables: InviteTable[];
  notes: string;
}

/** Was die öffentliche Seite bekommt: Konfiguration und sichtbare Fotos, keine Gästeliste. */
export interface PublicInvite {
  event: InviteEvent;
  photos: InvitePhoto[];
  /** Nur mit persönlichem Link: der eingeladene Gast und seine bisherige Antwort. */
  guest?: Pick<InviteGuest, 'code' | 'name' | 'status' | 'adults' | 'children' | 'menu' | 'allergies' | 'song' | 'message'>;
}

/** Was der Gastgeber im Planer bekommt. */
export interface OwnerInvite {
  event: InviteEvent;
  plan: InvitePlan;
  guests: InviteGuest[];
  photos: InvitePhoto[];
}

export interface RsvpInput {
  code?: string;
  name: string;
  status: Exclude<RsvpStatus, 'invited'>;
  adults: number;
  children: number;
  menu: MenuChoice;
  allergies?: string;
  song?: string;
  message?: string;
}

/** Text in der gewünschten Sprache, sonst in der ersten vorhandenen. */
export function localText(t: LocalText | undefined, lang: InviteLang, fallback: InviteLang = 'de'): string {
  if (!t) return '';
  if (typeof t === 'string') return t;
  return t[lang] ?? t[fallback] ?? Object.values(t).find((v) => !!v) ?? '';
}

export function emptyPlan(): InvitePlan {
  return { tasks: [], budget: [], budgetTotal: 0, tables: [], notes: '' };
}

/** IBAN in Vierergruppen, wie sie auf Überweisungsträgern steht. */
export function formatIban(iban: string): string {
  return iban.replace(/\s+/g, '').toUpperCase().replace(/(.{4})/g, '$1 ').trim();
}

/** Prüfsumme nach ISO 13616 (mod 97). */
export function validIban(iban: string): boolean {
  const s = iban.replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  const moved = s.slice(4) + s.slice(0, 4);
  let rest = 0;
  for (const ch of moved) {
    const v = /\d/.test(ch) ? ch : String(ch.charCodeAt(0) - 55);
    for (const d of v) rest = (rest * 10 + Number(d)) % 97;
  }
  return rest === 1;
}

/** paypal.me-Adresse aus Name oder Adresse. */
export function paypalUrl(v: string): string {
  const s = v.trim();
  if (/^https:\/\/(www\.)?paypal\.me\//i.test(s)) return s;
  return `https://paypal.me/${encodeURIComponent(s.replace(/^@/, '').replace(/^paypal\.me\//i, ''))}`;
}

/**
 * EPC-QR-Code („GiroCode"): Banking-Apps lesen ihn und füllen die
 * Überweisung aus — Empfänger, IBAN, Verwendungszweck. Betrag bleibt leer,
 * den wählt der Gast.
 */
export function epcPayload(g: InviteGifts): string | null {
  if (!g.iban || !g.accountHolder) return null;
  return [
    'BCD',
    '002',
    '1',
    'SCT',
    (g.bic ?? '').replace(/\s+/g, ''),
    g.accountHolder.slice(0, 70),
    g.iban.replace(/\s+/g, '').toUpperCase(),
    '',
    '',
    '',
    (g.reference ?? '').slice(0, 140),
  ].join('\n');
}
