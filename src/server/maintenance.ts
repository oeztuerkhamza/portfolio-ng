/**
 * Wartungsmodus der Website.
 *
 * Die Seiten der Website werden zur Bauzeit vorgerendert und von Vercels
 * Netz ausgeliefert — an unserem Express-Server vorbei. Ein Schalter in der
 * Datenbank könnte sie deshalb gar nicht erreichen. Der Wartungsmodus liegt
 * darum in `middleware.ts` im Wurzelverzeichnis: Vercel führt sie vor dem
 * Routing aus, also vor jeder ausgelieferten Seite.
 *
 * Dieses Modul enthält den Teil, der in *beiden* Welten gilt — im Server und
 * in der Middleware. Es hat deshalb **keine Abhängigkeiten**: kein express,
 * kein postgres, nichts aus node:*. Sonst ließe es sich in der Edge-Laufzeit
 * nicht bündeln.
 */

/** Was unter `maintenance` in der Tabelle `settings` liegt. */
export interface MaintenanceState {
  on: boolean;
  /** Seit wann — für den Hinweis im Portal. */
  since: string | null;
  /** Eine Zeile, die der Besucher lesen soll. Leer = Standardtext. */
  message: string | null;
  /**
   * Klartext-Kennwort, mit dem der Inhaber die Seite trotz Wartung ansehen
   * kann. Steht nur in der Datenbank und in der Antwort des Portals — die
   * öffentliche Auskunft nennt nur den Hashwert.
   */
  token: string | null;
}

/** Was die Middleware öffentlich abfragt. Kein Klartext-Kennwort. */
export interface MaintenancePublic {
  on: boolean;
  message: string | null;
  /** SHA-256 des Kennworts, hexadezimal. */
  bypass: string | null;
}

const MAX_MESSAGE = 200;

/**
 * Den gespeicherten Wert lesen, ohne zu werfen.
 *
 * Bewusst nachsichtig: eine kaputte oder alte Zeile darf nicht dazu führen,
 * dass die Website in den Wartungsmodus fällt. Im Zweifel ist sie offen.
 */
export function parseMaintenance(value: unknown): MaintenanceState {
  const v = (value ?? {}) as Record<string, unknown>;
  const text = (x: unknown, max: number): string | null => {
    if (typeof x !== 'string') return null;
    const s = x.trim().slice(0, max);
    return s ? s : null;
  };
  return {
    on: v['on'] === true,
    since: text(v['since'], 40),
    message: text(v['message'], MAX_MESSAGE),
    token: text(v['token'], 100),
  };
}

/** Kennwort für die Umgehung. Nur Zeichen, die in einer Adresse überleben. */
export function newToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * SHA-256, hexadezimal. `crypto.subtle` gibt es in Node ab 20 und in der
 * Edge-Laufzeit — darum diese eine Fassung für beide Seiten.
 */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Vergleich in gleichbleibender Zeit: die Laufzeit soll nichts verraten. */
export function sameHash(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Welche Adressen auch bei Wartung durchgelassen werden.
 *
 * Das ist der wichtigste Teil dieser Datei, und zwar in beide Richtungen:
 * eine zu enge Liste sperrt den Inhaber aus seinem eigenen Portal aus und
 * bricht bezahlte Bestellungen; eine zu weite lässt die Website offen.
 *
 * Durchgelassen wird:
 *
 *   * `/api/…` — darunter der Stripe-Webhook. Käme der nicht durch, hätte ein
 *     Kunde bezahlt und die Bestellung bliebe für immer „offen". Das ist der
 *     Grund, warum diese Zeile zuerst kommt.
 *   * `/admin` — sonst könnte niemand die Wartung wieder abschalten.
 *   * `/k/…` und `/r/…` — die Seiten und Kurzlinks der verkauften NFC-Karten.
 *     Die liegen physisch bei Kunden auf dem Tisch; sie wegen unserer
 *     Wartungsarbeiten abzuschalten wäre ein Fehler am Produkt.
 *   * Dateien (alles mit Endung), `/assets/…`, `sitemap.xml`, `robots.txt`
 *     und `/.well-known/…`.
 */
export function alwaysOpen(pathname: string): boolean {
  const p = pathname.toLowerCase();

  if (p === '/api' || p.startsWith('/api/')) return true;
  if (p === '/admin' || p.startsWith('/admin/')) return true;
  if (p.startsWith('/k/') || p.startsWith('/r/')) return true;
  if (p.startsWith('/assets/') || p.startsWith('/.well-known/')) return true;

  // Dateien: eine Endung im letzten Abschnitt der Adresse. Seiten haben keine.
  const last = p.slice(p.lastIndexOf('/') + 1);
  if (/\.[a-z0-9]{2,5}$/.test(last)) return true;

  return false;
}

/** Sprache aus dem Adresspräfix; unbekanntes fällt auf Deutsch zurück. */
export function langOf(pathname: string): 'de' | 'fr' | 'en' | 'tr' | 'ku' {
  const m = /^\/(de|fr|en|tr|ku)(?:\/|$)/.exec(pathname.toLowerCase());
  return (m?.[1] as 'de' | 'fr' | 'en' | 'tr' | 'ku') ?? 'de';
}

const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

interface Words {
  title: string;
  head: string;
  body: string;
  reach: string;
}

const WORDS: Record<'de' | 'fr' | 'en' | 'tr' | 'ku', Words> = {
  de: {
    title: 'Wartungsarbeiten',
    head: 'Wir sind gleich zurück',
    body: 'An der Website wird gerade gearbeitet. Bitte versuchen Sie es in Kürze noch einmal.',
    reach: 'Sie erreichen uns in der Zwischenzeit unter',
  },
  fr: {
    title: 'Maintenance',
    head: 'Nous revenons très vite',
    body: 'Le site est en cours de maintenance. Merci de réessayer dans quelques instants.',
    reach: 'En attendant, vous pouvez nous joindre au',
  },
  en: {
    title: 'Maintenance',
    head: 'We will be right back',
    body: 'The website is being worked on. Please try again shortly.',
    reach: 'In the meantime you can reach us at',
  },
  tr: {
    title: 'Bakım çalışması',
    head: 'Hemen döneceğiz',
    body: 'Sitede çalışma yapılıyor. Lütfen kısa bir süre sonra tekrar deneyin.',
    reach: 'Bu arada bize şuradan ulaşabilirsiniz',
  },
  ku: {
    title: 'Xebata çakkirinê',
    head: 'Em di cih de vedigerin',
    body: 'Li ser malperê tê xebitandin. Ji kerema xwe piştî demeke kurt dîsa biceribînin.',
    reach: 'Di vê navberê de hûn dikarin bi me re têkilî daynin',
  },
};

/**
 * Die Seite, die der Besucher bei Wartung sieht.
 *
 * Alles steckt in dieser einen Antwort: kein Bild, kein Stylesheet, kein
 * Skript. Bei Wartungsarbeiten ist eine Seite, die noch Dateien nachladen
 * muss, das Letzte, was man haben will.
 */
export function maintenanceHtml(pathname: string, message: string | null): string {
  const lang = langOf(pathname);
  const w = WORDS[lang];
  const note = message ? `<p class="note">${esc(message)}</p>` : '';
  return `<!doctype html>
<html lang="${lang}">
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(w.title)} — Breisgau Digital</title>
<style>
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    padding: 1.5rem; background: #f5f7fa; color: #16202b;
    font: 16px/1.6 -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .box { max-width: 30rem; text-align: center }
  h1 { font-size: 1.6rem; font-weight: 600; margin: 0 0 .75rem; color: #14416b }
  p { margin: 0 0 .75rem; color: #3d4a58 }
  .note { padding: .85rem 1rem; background: #fff; border-radius: 10px; border: 1px solid #d3dae1 }
  a { color: #14416b }
  .brand { margin-top: 2rem; font-size: .8rem; color: #6b7785; letter-spacing: .08em; text-transform: uppercase }
</style>
<div class="box">
  <h1>${esc(w.head)}</h1>
  <p>${esc(w.body)}</p>
  ${note}
  <p>${esc(w.reach)} <a href="mailto:info@breisgau-digital.de">info@breisgau-digital.de</a></p>
  <p class="brand">Breisgau Digital</p>
</div>
</html>`;
}
