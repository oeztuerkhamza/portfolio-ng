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
.foot{margin:22px 0 0;text-align:center;font-size:.72rem;color:${t.dim}}
.foot a{color:${t.dim}}
@media(prefers-reduced-motion:no-preference){.card{animation:in .28s ease-out}@keyframes in{from{opacity:0;transform:translateY(6px)}}}
`;

const row = (label: string, value: string, href?: string | null) =>
  `<li>${href ? `<a href="${esc(href)}">` : '<span>'}<b>${esc(label)}</b>${esc(value)}${href ? '</a>' : '</span>'}</li>`;

function businessBody(d: BusinessCardData, slug: string): string {
  const rows: string[] = [];
  if (d.phone) {
    const tel = telHref(d.phone);
    rows.push(row('Telefon', d.phone, tel ? `tel:${tel}` : null));
  }
  const mail = mailAddress(d.email);
  if (mail) rows.push(row('E-Mail', mail, `mailto:${mail}`));
  const web = httpsUrl(d.web);
  if (web) rows.push(row('Web', web.replace(/^https:\/\//, ''), web));
  if (d.address) rows.push(row('Adresse', d.address));

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
  const save = vcard(d) ? `<a class="btn" href="/k/${esc(slug)}/kontakt.vcf" download>Zu Kontakten hinzufügen</a>` : '';

  return [
    logo ? `<img class="logo" src="${esc(logo)}" alt="" />` : '',
    avatar ? `<img class="avatar" src="${esc(avatar)}" alt="" />` : '',
    `<h1>${esc(d.company)}</h1>`,
    d.tagline ? `<p class="tagline">${esc(d.tagline)}</p>` : '',
    rows.length ? `<ul class="rows">${rows.join('')}</ul>` : '',
    save,
    links.map((l) => `<a class="btn ghost" href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a>`).join(''),
  ].join('');
}

function giftBody(d: GiftCardData): string {
  const who = [d.to ? `Für ${d.to}` : '', d.from ? `von ${d.from}` : ''].filter(Boolean).join(' · ');
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
    song ? `<a class="btn" href="${esc(song)}" rel="noopener">${esc(d.songLabel || 'Lied anhören')}</a>` : '',
  ].join('');
}

/**
 * Die ganze Seite einer Karte. `base` ist die öffentliche Adresse der
 * Website — sie steht klein im Fuß, damit man sieht, wer die Seite zeigt.
 */
export function renderCard(card: Card, base = config.siteUrl || ''): string {
  const t = THEMES[card.theme] ?? THEMES.brand;
  const business = card.kind === 'business';
  const d = card.data as BusinessCardData & GiftCardData;
  const title = business ? d.company : d.headline;
  const site = base.replace(/\/+$/, '');

  return `<!doctype html>
<html lang="de"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<meta name="referrer" content="no-referrer" />
<title>${esc(title)}</title>
<style>${styles(t)}</style>
</head><body>
<main class="card">
${business ? businessBody(d, card.slug) : giftBody(d)}
<p class="foot">${site ? `<a href="${esc(site)}" rel="noopener">${esc(site.replace(/^https:\/\//, ''))}</a>` : 'Breisgau Digital'}</p>
</main>
</body></html>`;
}
