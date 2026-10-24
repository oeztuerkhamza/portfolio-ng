import { config } from './config';
import { CARD_LANGS, CARD_THEMES, esc, httpsUrl, mailAddress, telHref, type CardLang, type CardTheme } from './cards';

/**
 * Speisekarten für Kunden: /m/<slug>.
 *
 * Gleiche Bauweise wie die NFC-Karten (cards.ts): ein serverseitig gebautes
 * Dokument, Stil inline, kein JavaScript, damit die Karte am Tisch auch bei
 * schlechtem Empfang sofort steht. Der Inhalt kommt aus der Datenbank und
 * läuft deshalb durch `esc`; jede Adresse durch `httpsUrl`.
 *
 * Im Portal wird die Karte als schlichter Text gepflegt (siehe `parseMenuText`),
 * gespeichert wird die geprüfte Form `MenuData`.
 */

export interface MenuItem {
  name: string;
  /** Freitext, damit „9,50", „ab 12" oder „0,3 l 4,20 / 0,5 l 5,80" möglich sind. */
  price?: string;
  desc?: string;
}

export interface MenuCategory {
  title: string;
  note?: string;
  items: MenuItem[];
}

export interface MenuData {
  name: string;
  tagline?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  address?: string;
  /** Hinweis am Ende, z. B. Allergene und Zusatzstoffe. */
  footnote?: string;
  /** Knopf „Bewerten Sie uns": führt zur Google-Bewertung (am besten /r/<slug>). */
  reviewUrl?: string;
  categories: MenuCategory[];
}

export interface Menu {
  slug: string;
  lang: CardLang;
  theme: CardTheme;
  preview: boolean;
  data: MenuData;
}

export const MAX_CATEGORIES = 40;
export const MAX_ITEMS = 60;

const text = (v: unknown, max: number): string | undefined => {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s ? s.slice(0, max) : undefined;
};

/** Nimmt, was gespeichert oder eingegeben wurde, und gibt genau die bekannten Felder zurück. */
export function menuData(input: unknown): MenuData | null {
  const d = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const name = text(d['name'], 120);
  if (!name) return null;

  const categories: MenuCategory[] = [];
  const raw = Array.isArray(d['categories']) ? d['categories'] : [];
  for (const c of raw.slice(0, MAX_CATEGORIES)) {
    const cat = (c && typeof c === 'object' ? c : {}) as Record<string, unknown>;
    const title = text(cat['title'], 120);
    if (!title) continue;
    const items: MenuItem[] = [];
    for (const i of (Array.isArray(cat['items']) ? cat['items'] : []).slice(0, MAX_ITEMS)) {
      const it = (i && typeof i === 'object' ? i : {}) as Record<string, unknown>;
      const itemName = text(it['name'], 160);
      if (!itemName) continue;
      items.push({ name: itemName, price: text(it['price'], 60), desc: text(it['desc'], 400) });
    }
    categories.push({ title, note: text(cat['note'], 300), items });
  }

  const phone = text(d['phone'], 40);
  const email = mailAddress(d['email']) ?? undefined;
  return {
    name,
    tagline: text(d['tagline'], 160),
    logoUrl: httpsUrl(d['logoUrl']) ?? undefined,
    phone: phone && telHref(phone) ? phone : undefined,
    email,
    address: text(d['address'], 200),
    footnote: text(d['footnote'], 600),
    reviewUrl: httpsUrl(d['reviewUrl']) ?? undefined,
    categories,
  };
}

/**
 * Das Textformat im Portal:
 *
 *   # Vorspeisen | Hinweis zur Rubrik
 *   Tomatensuppe | 6,50 | mit Basilikum
 *   Bruschetta | 7,00
 *
 * „#" eröffnet eine Rubrik, jede weitere Zeile ist ein Gericht:
 * Name | Preis | Beschreibung. Zeilen vor der ersten Rubrik werden ignoriert.
 */
export function parseMenuText(src: unknown): MenuCategory[] {
  const out: MenuCategory[] = [];
  for (const line of String(src ?? '').split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) {
      const [title, note] = t.replace(/^#+\s*/, '').split('|').map((p) => p.trim());
      if (title) out.push({ title, note: note || undefined, items: [] });
      continue;
    }
    const cat = out[out.length - 1];
    if (!cat) continue;
    const [name, price, ...desc] = t.split('|').map((p) => p.trim());
    if (name) cat.items.push({ name, price: price || undefined, desc: desc.join(' | ') || undefined });
  }
  return out;
}

/** Umkehrung von `parseMenuText`, damit das Portal die Karte wieder als Text zeigt. */
export function menuText(categories: MenuCategory[]): string {
  return categories
    .map((c) =>
      [
        `# ${c.title}${c.note ? ` | ${c.note}` : ''}`,
        ...c.items.map((i) => [i.name, i.price ?? '', i.desc ?? ''].join(' | ').replace(/( \| )+$/, '')),
      ].join('\n'),
    )
    .join('\n\n');
}

export const MENU_LANGS = CARD_LANGS;
export const MENU_THEMES = CARD_THEMES;

const LABELS: Record<CardLang, { review: string; call: string; mail: string; map: string; preview: string; empty: string }> = {
  de: { review: 'Bewerten Sie uns auf Google', call: 'Anrufen', mail: 'E-Mail', map: 'Anfahrt', preview: 'Vorschau — diese Karte ist noch nicht veröffentlicht.', empty: 'Die Speisekarte wird gerade vorbereitet.' },
  fr: { review: 'Évaluez-nous sur Google', call: 'Appeler', mail: 'E-mail', map: 'Itinéraire', preview: 'Aperçu — cette carte n’est pas encore publiée.', empty: 'La carte est en préparation.' },
  en: { review: 'Rate us on Google', call: 'Call', mail: 'Email', map: 'Directions', preview: 'Preview — this menu is not published yet.', empty: 'The menu is being prepared.' },
  tr: { review: 'Google’da bizi değerlendirin', call: 'Ara', mail: 'E-posta', map: 'Yol tarifi', preview: 'Önizleme — bu menü henüz yayında değil.', empty: 'Menü hazırlanıyor.' },
  ku: { review: 'Li ser Google me binirxînin', call: 'Telefon bikin', mail: 'E-name', map: 'Rê', preview: 'Pêşdîtin — ev menû hê nehatiye weşandin.', empty: 'Menû tê amadekirin.' },
};

const THEMES: Record<CardTheme, { bg: string; panel: string; ink: string; dim: string; accent: string; onAccent: string }> = {
  brand: { bg: '#f6f8fb', panel: '#ffffff', ink: '#0e1a2b', dim: '#5d6d85', accent: '#1a4b8c', onAccent: '#ffffff' },
  dark: { bg: '#0e1a2b', panel: '#16273d', ink: '#f2f5f9', dim: '#93a1b3', accent: '#5b93d6', onAccent: '#0e1a2b' },
  warm: { bg: '#fbf7f1', panel: '#ffffff', ink: '#2b1d0e', dim: '#7a6853', accent: '#a9741f', onAccent: '#ffffff' },
};

const styles = (t: (typeof THEMES)[CardTheme]) => `
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:${t.bg};color:${t.ink};font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-text-size-adjust:100%;padding:20px 14px 40px;display:flex;justify-content:center}
.menu{width:100%;max-width:560px;background:${t.panel};border-radius:20px;padding:28px 22px 24px;
  box-shadow:0 1px 2px rgba(14,26,43,.06),0 12px 32px rgba(14,26,43,.10)}
.logo{display:block;max-width:180px;max-height:90px;margin:0 auto 14px;object-fit:contain}
h1{margin:0 0 4px;font-size:1.7rem;line-height:1.2;text-align:center;letter-spacing:-.01em}
.tagline{margin:0 0 18px;text-align:center;color:${t.dim}}
.nav{display:flex;gap:8px;overflow-x:auto;margin:0 -22px 8px;padding:6px 22px 10px;position:sticky;top:0;background:${t.panel};scrollbar-width:none}
.nav::-webkit-scrollbar{display:none}
.nav a{flex:0 0 auto;padding:7px 14px;border-radius:999px;border:1px solid ${t.accent};color:${t.accent};text-decoration:none;font-size:.88rem;font-weight:600}
h2{margin:26px 0 2px;font-size:1.15rem;color:${t.accent};text-transform:uppercase;letter-spacing:.08em;scroll-margin-top:60px}
.note{margin:0 0 8px;color:${t.dim};font-size:.88rem}
ul{list-style:none;margin:0;padding:0}
li{padding:12px 0;border-bottom:1px solid rgba(147,161,179,.28)}
li:last-child{border-bottom:0}
.row{display:flex;gap:12px;justify-content:space-between;align-items:baseline}
.name{font-weight:600}
.price{flex:0 0 auto;font-weight:600;white-space:nowrap}
.desc{margin:2px 0 0;color:${t.dim};font-size:.9rem}
.empty{margin:20px 0;text-align:center;color:${t.dim}}
.foot-note{margin:26px 0 0;color:${t.dim};font-size:.8rem;line-height:1.5;white-space:pre-line}
.actions{display:grid;gap:10px;margin:26px 0 0}
.btn{display:block;text-align:center;padding:14px 18px;border-radius:999px;background:${t.accent};color:${t.onAccent};text-decoration:none;font-weight:600}
.btn.ghost{background:transparent;color:${t.accent};border:1px solid ${t.accent}}
.preview{margin:0 0 18px;padding:11px 14px;border-radius:12px;border:1px dashed ${t.accent};color:${t.dim};font-size:.8rem;text-align:center}
.foot{margin:22px 0 0;text-align:center;font-size:.72rem;color:${t.dim}}
.foot a{color:${t.dim}}
`;

const anchor = (i: number) => `k${i + 1}`;

export function renderMenu(menu: Menu, base = config.siteUrl || ''): string {
  const t = THEMES[menu.theme] ?? THEMES.warm;
  const lang: CardLang = CARD_LANGS.includes(menu.lang) ? menu.lang : 'de';
  const l = LABELS[lang];
  const d = menu.data;
  const site = base.replace(/\/+$/, '');
  const cats = d.categories.filter((c) => c.items.length);

  const body = cats
    .map(
      (c, i) => `<section><h2 id="${anchor(i)}">${esc(c.title)}</h2>${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}<ul>${c.items
        .map(
          (it) =>
            `<li><div class="row"><span class="name">${esc(it.name)}</span>${it.price ? `<span class="price">${esc(it.price)}</span>` : ''}</div>${it.desc ? `<p class="desc">${esc(it.desc)}</p>` : ''}</li>`,
        )
        .join('')}</ul></section>`,
    )
    .join('\n');

  const actions: string[] = [];
  const review = httpsUrl(d.reviewUrl);
  if (review) actions.push(`<a class="btn" href="${esc(review)}" rel="noopener">${esc(l.review)}</a>`);
  const tel = d.phone ? telHref(d.phone) : null;
  if (tel) actions.push(`<a class="btn ghost" href="tel:${esc(tel)}">${esc(l.call)} · ${esc(d.phone)}</a>`);
  const mail = mailAddress(d.email);
  if (mail) actions.push(`<a class="btn ghost" href="mailto:${esc(mail)}">${esc(l.mail)}</a>`);
  if (d.address) actions.push(`<a class="btn ghost" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(d.address)}" rel="noopener">${esc(l.map)} · ${esc(d.address)}</a>`);

  const logo = httpsUrl(d.logoUrl);

  return `<!doctype html>
<html lang="${lang}"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<meta name="referrer" content="no-referrer" />
<title>${esc(d.name)}${d.tagline ? ` · ${esc(d.tagline)}` : ''}</title>
<style>${styles(t)}</style>
</head><body>
<main class="menu">
${menu.preview ? `<p class="preview" role="status">${esc(l.preview)}</p>` : ''}
${logo ? `<img class="logo" src="${esc(logo)}" alt="" />` : ''}
<h1>${esc(d.name)}</h1>
${d.tagline ? `<p class="tagline">${esc(d.tagline)}</p>` : ''}
${cats.length > 1 ? `<nav class="nav" aria-label="${esc(d.tagline ?? d.name)}">${cats.map((c, i) => `<a href="#${anchor(i)}">${esc(c.title)}</a>`).join('')}</nav>` : ''}
${cats.length ? body : `<p class="empty">${esc(l.empty)}</p>`}
${d.footnote ? `<p class="foot-note">${esc(d.footnote)}</p>` : ''}
${actions.length ? `<div class="actions">${actions.join('')}</div>` : ''}
<p class="foot">${site ? `<a href="${esc(site)}" rel="noopener">${esc(site.replace(/^https:\/\//, ''))}</a>` : 'Breisgau Digital'}</p>
</main>
</body></html>`;
}
