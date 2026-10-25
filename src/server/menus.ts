import { randomBytes } from 'node:crypto';
import { config } from './config';
import { CARD_THEMES, esc, httpsUrl, mailAddress, telHref, type CardLang } from './cards';

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

export type Diet = 'vegan' | 'vegetarian';

/** Die 14 kennzeichnungspflichtigen Allergene (EU-Lebensmittelinformationsverordnung). */
export const ALLERGENS = [
  'gluten',
  'krebstiere',
  'eier',
  'fisch',
  'erdnuesse',
  'soja',
  'milch',
  'schalenfruechte',
  'sellerie',
  'senf',
  'sesam',
  'sulfite',
  'lupinen',
  'weichtiere',
] as const;
export type Allergen = (typeof ALLERGENS)[number];

const ALLERGEN_ALIASES: Record<string, Allergen> = {
  gluten: 'gluten', weizen: 'gluten',
  krebstiere: 'krebstiere', crustaceans: 'krebstiere',
  eier: 'eier', ei: 'eier', egg: 'eier', eggs: 'eier',
  fisch: 'fisch', fish: 'fisch',
  erdnuesse: 'erdnuesse', erdnuss: 'erdnuesse', peanuts: 'erdnuesse',
  soja: 'soja', soy: 'soja',
  milch: 'milch', laktose: 'milch', milk: 'milch',
  schalenfruechte: 'schalenfruechte', nuesse: 'schalenfruechte', nuss: 'schalenfruechte', nuts: 'schalenfruechte',
  sellerie: 'sellerie', celery: 'sellerie',
  senf: 'senf', mustard: 'senf',
  sesam: 'sesam', sesame: 'sesam',
  sulfite: 'sulfite', schwefeldioxid: 'sulfite', sulphites: 'sulfite',
  lupinen: 'lupinen', lupine: 'lupinen',
  weichtiere: 'weichtiere', molluscs: 'weichtiere',
};

const DIET_WORDS: Record<string, Diet> = { vegan: 'vegan', vegetarisch: 'vegetarian', vegetarian: 'vegetarian', veg: 'vegetarian', vejetaryen: 'vegetarian' };

/**
 * Angaben zu einem Gericht in eckigen Klammern, z. B. `[vegetarisch; milch, eier]`:
 * vegan/vegetarisch und die Allergene, die das Gericht enthält. `keine` heißt: geprüft, enthält
 * keines der 14. Fehlt die Allergen-Angabe ganz, gilt sie als unbekannt — der Filter zeigt so ein
 * Gericht dann nie als „ohne Allergen" an.
 */
export function parseTags(raw: string): { diet?: Diet; allergens?: Allergen[] } {
  let diet: Diet | undefined;
  let allergens: Allergen[] | undefined;
  for (const tok of raw.replace(/^\[|\]$/g, '').split(/[;,]/)) {
    const k = tok.trim().toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    if (!k) continue;
    if (DIET_WORDS[k]) {
      if (diet !== 'vegan') diet = DIET_WORDS[k];
    } else if (k === 'keine' || k === 'none' || k === 'allergenfrei') {
      allergens ??= [];
    } else if (ALLERGEN_ALIASES[k]) {
      allergens ??= [];
      if (!allergens.includes(ALLERGEN_ALIASES[k]!)) allergens.push(ALLERGEN_ALIASES[k]!);
    }
  }
  if (allergens) allergens.sort((a, b) => ALLERGENS.indexOf(a) - ALLERGENS.indexOf(b));
  return { ...(diet ? { diet } : {}), ...(allergens ? { allergens } : {}) };
}

/** Umkehrung von `parseTags` für das Textformat im Portal; leer, wenn nichts angegeben ist. */
export function tagsText(i: { diet?: Diet; allergens?: Allergen[] }): string {
  const parts: string[] = [];
  if (i.diet) parts.push(i.diet === 'vegan' ? 'vegan' : 'vegetarisch');
  if (i.allergens) parts.push(i.allergens.length ? i.allergens.join(', ') : 'keine');
  return parts.length ? `[${parts.join('; ')}]` : '';
}

export interface MenuItem {
  name: string;
  /** Freitext, damit „9,50", „ab 12" oder „0,3 l 4,20 / 0,5 l 5,80" möglich sind. */
  price?: string;
  desc?: string;
  /** Foto des Gerichts, https. */
  img?: string;
  diet?: Diet;
  /** Enthaltene Allergene; `[]` = geprüft, keines. Fehlt das Feld, ist es unbekannt. */
  allergens?: Allergen[];
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
  /** Link „Bildnachweis" im Fuß: Pflicht, sobald Fotos unter CC BY/BY-SA auf der Karte stehen. */
  creditsUrl?: string;
  /** Übersetzungen im Textformat von `parseMenuText`, je Sprache; gleiche Reihenfolge wie das Original. */
  translations?: Partial<Record<MenuLang, string>>;
  categories: MenuCategory[];
}

/**
 * Die Sprachen der NFC-Karten plus Arabisch (von rechts nach links) und Russisch, die es nur für
 * Speisekarten gibt. Die Reihenfolge ist die der Sprachleiste auf der Karte.
 */
export const MENU_LANGS = ['de', 'en', 'fr', 'tr', 'ar', 'ru', 'ku'] as const satisfies readonly (CardLang | 'ar' | 'ru')[];
export type MenuLang = (typeof MENU_LANGS)[number];

/** Die Themes der NFC-Karten plus „orient" (Smaragd und Gold), das es nur für Speisekarten gibt. */
export const MENU_THEMES = [...CARD_THEMES, 'orient'] as const;
export type MenuTheme = (typeof MENU_THEMES)[number];

export interface Menu {
  slug: string;
  lang: MenuLang;
  theme: MenuTheme;
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
      const diet = it['diet'] === 'vegan' || it['diet'] === 'vegetarian' ? (it['diet'] as Diet) : undefined;
      const allergens = Array.isArray(it['allergens'])
        ? ALLERGENS.filter((a) => (it['allergens'] as unknown[]).includes(a))
        : undefined;
      items.push({
        name: itemName,
        price: text(it['price'], 60),
        desc: text(it['desc'], 400),
        img: httpsUrl(it['img']) ?? undefined,
        ...(diet ? { diet } : {}),
        ...(allergens ? { allergens } : {}),
      });
    }
    categories.push({ title, note: text(cat['note'], 300), items });
  }

  const translations: Partial<Record<MenuLang, string>> = {};
  const rawTr = (d['translations'] && typeof d['translations'] === 'object' ? d['translations'] : {}) as Record<string, unknown>;
  for (const l of MENU_LANGS) {
    const v = text(rawTr[l], 20000);
    if (v) translations[l] = v;
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
    creditsUrl: httpsUrl(d['creditsUrl']) ?? undefined,
    translations: Object.keys(translations).length ? translations : undefined,
    categories,
  };
}

/**
 * Die Karte in einer Übersetzung: Rubrik- und Gerichtstexte kommen aus der
 * Übersetzung, Preise und Fotos immer vom Original — ein Tippfehler im
 * Türkischen darf keinen Preis verändern. Fehlt eine Zeile, bleibt das Original.
 */
export function localize(data: MenuData, lang: MenuLang): MenuCategory[] {
  const src = data.translations?.[lang];
  if (!src) return data.categories;
  const tr = parseMenuText(src);
  return data.categories.map((c, i) => {
    const t = tr[i];
    if (!t) return c;
    return {
      title: t.title || c.title,
      note: t.note ?? c.note,
      items: c.items.map((it, j) => {
        const ti = t.items[j];
        return ti ? { ...it, name: ti.name, desc: ti.desc ?? it.desc } : it;
      }),
    };
  });
}

/** Sprachen, in denen die Karte angeboten wird: die Hauptsprache plus alle Übersetzungen. */
export function menuLangs(menu: Menu): MenuLang[] {
  return MENU_LANGS.filter((l) => l === menu.lang || !!menu.data.translations?.[l]);
}

// ── Bestellen am Tisch ─────────────────────────────────────

export const ORDER_MAX_LINES = 30;
export const ORDER_MAX_QTY = 20;
export const ORDER_MAX_TOTAL_QTY = 60;

export interface OrderLine {
  name: string;
  price?: string;
  qty: number;
}

/** „21,90" → 2190. Preise in anderer Form („ab 12", „0,3 l 4,20") ergeben null. */
export function priceCents(price: string | undefined): number | null {
  const m = /^(\d{1,3})(?:[,.](\d{1,2}))?(?:\s*€)?$/.exec((price ?? '').trim());
  if (!m) return null;
  return Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0') || 0);
}

/**
 * Prüft eine Bestellung gegen die gespeicherte Karte. Namen und Preise kommen
 * immer von der Karte, nie vom Gast; vom Gast stammen nur der Name (zum
 * Finden) und die Menge. Gibt null zurück, wenn etwas nicht stimmt.
 */
export function buildOrder(
  data: MenuData,
  input: unknown,
): { lines: OrderLine[]; totalCents: number | null; note: string | null } | null {
  const b = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const raw = Array.isArray(b['items']) ? b['items'] : [];
  if (!raw.length || raw.length > ORDER_MAX_LINES) return null;

  const known = new Map<string, MenuItem>();
  for (const c of data.categories) for (const it of c.items) if (!known.has(it.name)) known.set(it.name, it);

  const seen = new Set<string>();
  const lines: OrderLine[] = [];
  let totalQty = 0;
  let total: number | null = 0;
  for (const r of raw) {
    const o = (r && typeof r === 'object' ? r : {}) as Record<string, unknown>;
    const name = typeof o['name'] === 'string' ? o['name'] : '';
    const qty = o['qty'];
    const item = known.get(name);
    if (!item || seen.has(name)) return null;
    if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1 || qty > ORDER_MAX_QTY) return null;
    seen.add(name);
    totalQty += qty;
    lines.push({ name, price: item.price, qty });
    const cents = priceCents(item.price);
    total = total === null || cents === null ? null : total + cents * qty;
  }
  if (totalQty > ORDER_MAX_TOTAL_QTY) return null;
  return { lines, totalCents: total, note: text(b['note'], 300) ?? null };
}

/** Neues geheimes Tischkürzel: 144 Bit Zufall, URL-tauglich. */
export const newTableToken = () => randomBytes(18).toString('base64url');

/**
 * Das Textformat im Portal:
 *
 *   # Vorspeisen | Hinweis zur Rubrik
 *   Tomatensuppe | 6,50 | mit Basilikum
 *   Bruschetta | 7,00
 *
 * „#" eröffnet eine Rubrik, jede weitere Zeile ist ein Gericht:
 * Name | Preis | Beschreibung | [vegetarisch; milch, eier] | https://…/foto.jpg
 * (Angaben und Foto optional; die Angaben stehen vor dem Foto).
 * Zeilen vor der ersten Rubrik werden ignoriert.
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
    const parts = t.split('|').map((p) => p.trim());
    // Ein Foto steht als https-Adresse an letzter Stelle (nach dem Namen).
    const img = parts.length > 1 && /^https:\/\/\S+$/.test(parts[parts.length - 1]!) ? parts.pop() : undefined;
    // Davor (oder allein am Ende) können Angaben in eckigen Klammern stehen: [vegetarisch; milch, eier].
    const tags = parts.length > 1 && /^\[[^\]]*\]$/.test(parts[parts.length - 1]!) ? parseTags(parts.pop()!) : {};
    const [name, price, ...desc] = parts;
    if (name) cat.items.push({ name, price: price || undefined, desc: desc.join(' | ') || undefined, ...(img ? { img } : {}), ...tags });
  }
  return out;
}

/** Umkehrung von `parseMenuText`, damit das Portal die Karte wieder als Text zeigt. */
export function menuText(categories: MenuCategory[]): string {
  return categories
    .map((c) =>
      [
        `# ${c.title}${c.note ? ` | ${c.note}` : ''}`,
        ...c.items.map((i) =>
          [i.name, i.price ?? '', i.desc ?? '', ...(tagsText(i) ? [tagsText(i)] : []), ...(i.img ? [i.img] : [])]
            .join(' | ')
            .replace(/( \| )+$/, ''),
        ),
      ].join('\n'),
    )
    .join('\n\n');
}


const LABELS: Record<MenuLang, { review: string; call: string; mail: string; map: string; preview: string; empty: string; credits: string }> = {
  de: { review: 'Bewerten Sie uns auf Google', call: 'Anrufen', mail: 'E-Mail', map: 'Anfahrt', preview: 'Vorschau — diese Karte ist noch nicht veröffentlicht.', empty: 'Die Speisekarte wird gerade vorbereitet.', credits: 'Bildnachweis' },
  fr: { review: 'Évaluez-nous sur Google', call: 'Appeler', mail: 'E-mail', map: 'Itinéraire', preview: 'Aperçu — cette carte n’est pas encore publiée.', empty: 'La carte est en préparation.', credits: 'Crédits photo' },
  en: { review: 'Rate us on Google', call: 'Call', mail: 'Email', map: 'Directions', preview: 'Preview — this menu is not published yet.', empty: 'The menu is being prepared.', credits: 'Photo credits' },
  tr: { review: 'Google’da bizi değerlendirin', call: 'Ara', mail: 'E-posta', map: 'Yol tarifi', preview: 'Önizleme — bu menü henüz yayında değil.', empty: 'Menü hazırlanıyor.', credits: 'Fotoğraf kaynakları' },
  ku: { review: 'Li ser Google me binirxînin', call: 'Telefon bikin', mail: 'E-name', map: 'Rê', preview: 'Pêşdîtin — ev menû hê nehatiye weşandin.', empty: 'Menû tê amadekirin.', credits: 'Çavkaniya wêneyan' },
  ar: { review: 'قيّمونا على Google', call: 'اتصال', mail: 'البريد الإلكتروني', map: 'الاتجاهات', preview: 'معاينة — هذه القائمة غير منشورة بعد.', empty: 'يجري إعداد القائمة.', credits: 'مصادر الصور' },
  ru: { review: 'Оцените нас в Google', call: 'Позвонить', mail: 'E-mail', map: 'Как добраться', preview: 'Предпросмотр — это меню ещё не опубликовано.', empty: 'Меню готовится.', credits: 'Источники фото' },
};

interface Palette {
  bg: string;
  panel: string;
  ink: string;
  dim: string;
  accent: string;
  accent2: string;
  onAccent: string;
  soft: string;
  line: string;
  heroA: string;
  heroB: string;
  heroInk: string;
  heroDim: string;
  /** Zusätzliche Regeln, die nach den gemeinsamen kommen (nur „orient"). */
  extra?: string;
}

const SERIF = `"Iowan Old Style","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif`;

/** Ein SVG als CSS-Bild; die Richtlinie der Karte erlaubt `data:` für Bilder. */
const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/**
 * „warm" ist Bordeaux und Mandelgrün: der Wein im Glas und das Leinen auf dem
 * Tisch der Weinstube. Die beiden anderen Themes folgen demselben Aufbau
 * (dunkler Kopf, helle Karte), nur in ihren Farben.
 */
const THEMES: Record<MenuTheme, Palette> = {
  brand: { bg: '#e6edf6', panel: '#fbfcfe', ink: '#0e1a2b', dim: '#5d6d85', accent: '#1a4b8c', accent2: '#2c6bb8', onAccent: '#ffffff', soft: '#eef3f9', line: 'rgba(14,26,43,.14)', heroA: '#21589f', heroB: '#0e2f5c', heroInk: '#ffffff', heroDim: '#c5d6ee' },
  dark: { bg: '#060d18', panel: '#101e33', ink: '#f2f5f9', dim: '#9aa9bd', accent: '#6ea3e6', accent2: '#9cc2f2', onAccent: '#0e1a2b', soft: '#172a46', line: 'rgba(255,255,255,.14)', heroA: '#1b3a60', heroB: '#0b1627', heroInk: '#f2f5f9', heroDim: '#9aa9bd' },
  warm: {
    bg: 'radial-gradient(1100px 620px at 50% -8%,#6e1c33 0%,#44101f 52%,#2b0a15 100%)',
    panel: '#fbfcf7',
    ink: '#2c1a1e',
    dim: '#66705c',
    accent: '#7a1f34',
    accent2: '#a1304d',
    onAccent: '#ffffff',
    soft: '#edf3e3',
    line: 'rgba(98,124,82,.30)',
    heroA: '#7d2036',
    heroB: '#3f0f1d',
    heroInk: '#eff5e6',
    heroDim: '#bdd0ad',
  },
  orient: orientPalette(),
};

/**
 * „orient" ist Smaragd, Elfenbein und Gold, wie ein osmanischer Diwan: Der Kopf
 * ist ein Spitzbogenfenster über einem Muster aus achtzackigen Sternen, Rubriken
 * stehen zwischen goldenen Linien mit Raute. Alles mit Systemschriften und
 * Inline-SVG, damit die Karte ohne Webfonts sofort steht.
 */
function orientPalette(): Palette {
  const gold = '#c9a25a';
  const star = (color: string, opacity: number) =>
    svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1"><rect x="20" y="20" width="24" height="24"/><rect x="20" y="20" width="24" height="24" transform="rotate(45 32 32)"/><circle cx="32" cy="32" r="5"/><path d="M0 32h7M57 32h7M32 0v7M32 57v7M0 0l8 8M64 0l-8 8M0 64l8-8M64 64l-8-8"/></g></svg>`,
    );
  const solidStar = svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="${gold}"><rect x="6" y="6" width="12" height="12"/><rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)"/></g></svg>`,
  );
  const diamond = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path d="M4 0 8 4 4 8 0 4z" fill="${gold}"/></svg>`);
  const heroA = '#11433f';
  const heroB = '#061a1c';
  return {
    bg: `${star('#d8b56e', 0.1)},radial-gradient(1100px 620px at 50% -8%,#15433f 0%,#0b2628 52%,#051416 100%)`,
    panel: '#fcf7ec',
    ink: '#1f2422',
    dim: '#6e6452',
    accent: '#0f4a45',
    accent2: '#1b6a60',
    onAccent: '#f6e5bb',
    soft: '#f6eedc',
    line: 'rgba(158,118,48,.30)',
    heroA,
    heroB,
    heroInk: '#f6e6bf',
    heroDim: '#d4b57a',
    extra: `
.menu{border-radius:22px;box-shadow:0 0 0 1px rgba(201,162,90,.7),0 0 0 7px #08201f,0 0 0 8px rgba(201,162,90,.45),0 34px 80px rgba(0,0,0,.55)}
.hero{border-radius:22px 22px 0 0;padding-top:58px;padding-bottom:30px;border-bottom:1px solid ${gold};
  background:${star('#e2c27e', 0.16)},radial-gradient(420px 260px at 50% 0%,rgba(226,194,126,.2),transparent 70%),linear-gradient(170deg,${heroA},${heroB})}
.hero::before{content:"";position:absolute;inset:16px 16px 14px;pointer-events:none;border:1px solid rgba(214,181,110,.5);
  border-radius:50% 50% 14px 14px/34% 34% 14px 14px;box-shadow:inset 0 0 0 5px rgba(6,26,28,.35),inset 0 0 0 6px rgba(214,181,110,.22)}
h1{font-weight:500;letter-spacing:.08em;text-transform:uppercase;text-shadow:none;
  background:linear-gradient(180deg,#fbeecb 10%,#dcb873 60%,#b88a3e 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 6px 18px rgba(0,0,0,.45))}
.tagline{letter-spacing:.06em}
.orn{max-width:260px}
.orn::before,.orn::after{background:linear-gradient(90deg,transparent,${gold})}
.orn i{display:block;width:16px;height:16px;font-size:0;background:${solidStar} center/contain no-repeat}
.langs a[aria-current]{background:linear-gradient(180deg,#f7e7bf,#ddbb76);color:#0d302d}
section{margin-top:42px}
h2{justify-content:center;text-align:center;font-weight:500;letter-spacing:.05em;color:#7c5314}
h2::before,h2::after{content:"";flex:1;height:8px;min-width:24px}
h2::before{background:${diamond} right center/8px 8px no-repeat,linear-gradient(270deg,${gold},transparent) left center/calc(100% - 13px) 1px no-repeat}
h2::after{background:${diamond} left center/8px 8px no-repeat,linear-gradient(90deg,${gold},transparent) right center/calc(100% - 13px) 1px no-repeat}
.note{text-align:center}
.nav a[aria-current]{background:linear-gradient(160deg,${heroA},${heroB});border-color:${gold};color:#f6e5bb;transition:none}
li.has-img{border-color:rgba(201,162,90,.5);border-radius:18px;box-shadow:0 1px 2px rgba(40,30,10,.08),0 14px 30px -16px rgba(20,40,36,.45)}
.ph{border-bottom:1px solid ${gold}}
.dish{aspect-ratio:4/3}
.price{color:#0f4a45;font-family:${SERIF};font-size:1.04rem}
.dots{border-bottom-color:rgba(158,118,48,.45)}
.tag{color:#0f4a45}
.btn{background:linear-gradient(160deg,#155a53,${heroB});border:1px solid ${gold};color:#f6e5bb}
.foot-note{text-align:center}
`,
  };
}

const styles = (t: Palette) => `
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth;min-height:100%}
body{margin:0;min-height:100vh;background:${t.bg};color:${t.ink};font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-text-size-adjust:100%;padding:16px 12px 44px;display:flex;justify-content:center;align-items:flex-start}
.menu{width:100%;max-width:600px;background:${t.panel};border-radius:26px;padding:0 22px 26px;
  box-shadow:0 2px 4px rgba(0,0,0,.18),0 30px 70px rgba(0,0,0,.32)}
.hero{position:relative;overflow:hidden;margin:0 -22px;padding:46px 22px 26px;text-align:center;color:${t.heroInk};border-radius:26px 26px 0 0;
  background:radial-gradient(520px 260px at 82% 0%,rgba(255,255,255,.13),transparent 70%),linear-gradient(162deg,${t.heroA},${t.heroB})}
.hero::after{content:"";position:absolute;top:-20%;bottom:-20%;left:0;width:46%;pointer-events:none;
  background:linear-gradient(100deg,transparent 0%,rgba(255,255,255,.05) 38%,rgba(255,255,255,.22) 50%,rgba(255,255,255,.05) 62%,transparent 100%);
  transform:translateX(-130%) skewX(-14deg);animation:sheen 11s cubic-bezier(.45,.05,.3,1) 1.4s infinite}
@keyframes sheen{0%,62%{transform:translateX(-130%) skewX(-14deg)}100%{transform:translateX(330%) skewX(-14deg)}}
.logo{display:block;max-width:180px;max-height:90px;margin:0 auto 16px;object-fit:contain}
h1{position:relative;margin:0;font:600 clamp(2.1rem,9.5vw,2.9rem)/1.08 ${SERIF};letter-spacing:-.012em;text-shadow:0 1px 0 rgba(0,0,0,.25),0 8px 28px rgba(0,0,0,.35)}
.tagline{position:relative;margin:8px 0 0;color:${t.heroDim};font:italic 400 1.02rem/1.3 ${SERIF}}
.orn{position:relative;display:flex;align-items:center;gap:12px;margin:18px auto 12px;max-width:230px;color:${t.heroDim}}
.orn::before,.orn::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,${t.heroDim})}
.orn::after{transform:scaleX(-1)}
.orn i{font-style:normal;font-size:.8rem}
.where{position:relative;margin:0 0 16px;color:${t.heroDim};font-size:.84rem}
.langs{position:relative;display:flex;flex-wrap:wrap;gap:2px;justify-content:center;margin:0 auto;padding:3px;width:max-content;max-width:100%;background:rgba(255,255,255,.12);border-radius:20px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.langs a{padding:5px 15px;border-radius:999px;color:${t.heroDim};text-decoration:none;font-size:.8rem;font-weight:500;transition:background .2s,color .2s}
.langs a:hover{color:${t.heroInk}}
.langs a[aria-current]{background:${t.panel};color:${t.accent};font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,.28)}
.table-tag{position:relative;margin:14px 0 0;font-size:.85rem;font-weight:600;color:${t.heroInk}}
.nav{display:flex;gap:8px;overflow-x:auto;margin:0 -22px;padding:11px 22px;position:sticky;top:0;z-index:3;
  background:color-mix(in srgb,${t.panel} 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid ${t.line};scrollbar-width:none}
.nav::-webkit-scrollbar{display:none}
.nav a{flex:0 0 auto;padding:6px 15px;border-radius:999px;border:1px solid ${t.line};background:${t.soft};color:${t.ink};text-decoration:none;font-size:.82rem;font-weight:500;transition:background .2s,color .2s,border-color .2s}
.nav a[aria-current]{background:linear-gradient(135deg,${t.accent},${t.accent2});border-color:transparent;color:${t.onAccent};font-weight:600}
section{margin-top:36px}
h2{display:flex;align-items:center;gap:14px;margin:0 0 4px;font:600 1.5rem/1.2 ${SERIF};color:${t.accent};scroll-margin-top:68px}
h2::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,${t.line},transparent)}
.note{margin:0 0 6px;color:${t.dim};font-size:.86rem;font-style:italic}
ul{list-style:none;margin:10px 0 0;padding:0}
li{padding:13px 0;border-bottom:1px solid ${t.line}}
li:last-child{border-bottom:0}
li.has-img{background:${t.soft};border:1px solid ${t.line};border-radius:20px;overflow:hidden;margin:14px 0;padding:0 0 12px;box-shadow:0 1px 2px rgba(60,20,30,.06),0 12px 28px -14px rgba(60,20,30,.28)}
.txt{min-width:0}
.has-img .txt{padding:14px 18px 2px}
.row{display:flex;align-items:baseline;gap:8px}
.name{font:600 1.05rem/1.3 ${SERIF}}
.dots{flex:1 1 1rem;min-width:.8rem;border-bottom:2px dotted ${t.line};transform:translateY(-.3em)}
.price{flex:0 0 auto;font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums;color:${t.accent}}
.ph{position:relative;overflow:hidden;background:${t.line}}
.dish{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
.ph::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(142deg,rgba(255,255,255,.26) 0%,rgba(255,255,255,.06) 30%,transparent 46%)}
.ph::after{content:"";position:absolute;top:-10%;bottom:-10%;left:0;width:42%;z-index:1;pointer-events:none;opacity:0;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.34),transparent);transform:translateX(-140%) skewX(-14deg)}
li.has-img:hover .ph::after,li.has-img:active .ph::after{opacity:1;transform:translateX(340%) skewX(-14deg);transition:transform .9s cubic-bezier(.4,.1,.2,1),opacity .2s}
.desc{margin:3px 0 0;color:${t.dim};font-size:.88rem;line-height:1.45}
.empty{margin:28px 0;text-align:center;color:${t.dim}}
.foot-note{margin:36px 0 0;padding-top:18px;border-top:1px solid ${t.line};color:${t.dim};font-size:.76rem;line-height:1.6;white-space:pre-line}
.actions{display:grid;gap:10px;margin:28px 0 0}
.btn{position:relative;overflow:hidden;display:block;text-align:center;padding:14px 18px;border-radius:999px;background:linear-gradient(135deg,${t.accent},${t.accent2});color:${t.onAccent};text-decoration:none;font-weight:600;box-shadow:0 8px 20px -10px ${t.accent}}
.btn::after{content:"";position:absolute;top:0;bottom:0;left:0;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.3),transparent);transform:translateX(-140%) skewX(-14deg)}
.btn:hover::after,.btn:focus-visible::after{transform:translateX(330%) skewX(-14deg);transition:transform .8s cubic-bezier(.4,.1,.2,1)}
.btn.ghost{background:transparent;color:${t.accent};border:1px solid ${t.line};box-shadow:none}
.btn.ghost::after{display:none}
a:focus-visible,button:focus-visible{outline:2px solid ${t.accent};outline-offset:2px}
.preview{margin:18px 0 0;padding:11px 14px;border-radius:12px;border:1px dashed ${t.accent};color:${t.dim};font-size:.8rem;text-align:center}
.foot{margin:24px 0 0;text-align:center;font-size:.72rem;color:${t.dim}}
.foot a{color:${t.dim}}
[hidden]{display:none!important}
.tag{display:inline-block;margin-inline-start:8px;padding:1px 9px;border-radius:999px;background:${t.soft};border:1px solid ${t.line};color:${t.accent};font:600 .68rem/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;vertical-align:.12em}
.contains{margin:3px 0 0;color:${t.dim};font-size:.78rem}
.filters{margin:18px 0 0}
.chips{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start}
.chip{padding:6px 15px;border-radius:999px;border:1px solid ${t.line};background:${t.soft};color:${t.ink};font-family:inherit;font-weight:500;font-size:.82rem;line-height:1.4;cursor:pointer;list-style:none;transition:background .2s,color .2s}
.chip::-webkit-details-marker{display:none}
.chip[aria-pressed=true]{background:linear-gradient(135deg,${t.accent},${t.accent2});border-color:transparent;color:${t.onAccent};font-weight:600}
.al{flex:1 1 100%}
.al[open] .chip{border-color:${t.accent};color:${t.accent}}
.alg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px 14px;margin:10px 0 0;padding:12px 14px;background:${t.soft};border-radius:14px;font-size:.84rem}
.alg label{display:flex;gap:8px;align-items:center;cursor:pointer}
.alg input{accent-color:${t.accent}}
.fnote{margin:10px 0 0;color:${t.dim};font-size:.74rem;line-height:1.5}
.nomatch{margin:22px 0;text-align:center;color:${t.dim}}
@media (min-width:700px){body{padding:44px 20px 80px}.menu{padding:0 40px 34px}.hero{margin:0 -40px;padding:62px 40px 34px}.nav{margin:0 -40px;padding:12px 40px}}
${t.extra ?? ''}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.hero::after{animation:none;opacity:0}.btn::after,.ph::after{display:none}}
`;

interface FilterLabels {
  filter: string;
  vegetarian: string;
  vegan: string;
  allergens: string;
  without: string;
  contains: string;
  note: string;
  none: string;
}

const FILTER_LABELS: Record<MenuLang, FilterLabels> = {
  de: { filter: 'Filter', vegetarian: 'Vegetarisch', vegan: 'Vegan', allergens: 'Allergene', without: 'ohne', contains: 'Enthält', note: 'Angaben ohne Gewähr. Bei Allergien fragen Sie bitte den Service; Gerichte ohne Angabe werden beim Filtern ausgeblendet.', none: 'Keine Gerichte entsprechen dem Filter.' },
  en: { filter: 'Filter', vegetarian: 'Vegetarian', vegan: 'Vegan', allergens: 'Allergens', without: 'without', contains: 'Contains', note: 'Information without guarantee. If you have an allergy, please ask the staff; dishes without information are hidden when filtering.', none: 'No dishes match the filter.' },
  tr: { filter: 'Filtre', vegetarian: 'Vejetaryen', vegan: 'Vegan', allergens: 'Alerjenler', without: 'içermeyen:', contains: 'İçerir', note: 'Bilgiler garanti değildir. Alerjiniz varsa lütfen servise sorun; bilgisi olmayan yemekler filtrelemede gizlenir.', none: 'Filtreye uyan yemek yok.' },
  fr: { filter: 'Filtre', vegetarian: 'Végétarien', vegan: 'Végan', allergens: 'Allergènes', without: 'sans', contains: 'Contient', note: 'Informations sans garantie. En cas d’allergie, demandez au personnel ; les plats sans information sont masqués lors du filtrage.', none: 'Aucun plat ne correspond au filtre.' },
  ku: { filter: 'Filter', vegetarian: 'Vegetarian', vegan: 'Vegan', allergens: 'Allergens', without: 'without', contains: 'Contains', note: 'Information without guarantee. If you have an allergy, please ask the staff; dishes without information are hidden when filtering.', none: 'No dishes match the filter.' },
  ar: { filter: 'تصفية', vegetarian: 'نباتي', vegan: 'نباتي صرف', allergens: 'مسببات الحساسية', without: 'بدون', contains: 'يحتوي على', note: 'المعلومات دون ضمان. إذا كانت لديك حساسية فاسأل فريق الخدمة؛ الأطباق التي لا تتوفر عنها معلومات تُخفى عند التصفية.', none: 'لا توجد أطباق تطابق التصفية.' },
  ru: { filter: 'Фильтр', vegetarian: 'Вегетарианское', vegan: 'Веганское', allergens: 'Аллергены', without: 'без', contains: 'Содержит', note: 'Информация без гарантии. При аллергии, пожалуйста, спросите персонал; блюда без указаний при фильтрации скрываются.', none: 'Нет блюд, подходящих под фильтр.' },
};

const ALLERGEN_LABELS: Record<'de' | 'en' | 'tr' | 'fr' | 'ar' | 'ru', Record<Allergen, string>> = {
  de: { gluten: 'Gluten', krebstiere: 'Krebstiere', eier: 'Eier', fisch: 'Fisch', erdnuesse: 'Erdnüsse', soja: 'Soja', milch: 'Milch', schalenfruechte: 'Schalenfrüchte', sellerie: 'Sellerie', senf: 'Senf', sesam: 'Sesam', sulfite: 'Sulfite', lupinen: 'Lupinen', weichtiere: 'Weichtiere' },
  en: { gluten: 'Gluten', krebstiere: 'Crustaceans', eier: 'Eggs', fisch: 'Fish', erdnuesse: 'Peanuts', soja: 'Soy', milch: 'Milk', schalenfruechte: 'Tree nuts', sellerie: 'Celery', senf: 'Mustard', sesam: 'Sesame', sulfite: 'Sulphites', lupinen: 'Lupin', weichtiere: 'Molluscs' },
  tr: { gluten: 'Gluten', krebstiere: 'Kabuklular', eier: 'Yumurta', fisch: 'Balık', erdnuesse: 'Yer fıstığı', soja: 'Soya', milch: 'Süt', schalenfruechte: 'Kabuklu yemişler', sellerie: 'Kereviz', senf: 'Hardal', sesam: 'Susam', sulfite: 'Sülfit', lupinen: 'Acı bakla', weichtiere: 'Yumuşakçalar' },
  fr: { gluten: 'Gluten', krebstiere: 'Crustacés', eier: 'Œufs', fisch: 'Poisson', erdnuesse: 'Arachides', soja: 'Soja', milch: 'Lait', schalenfruechte: 'Fruits à coque', sellerie: 'Céleri', senf: 'Moutarde', sesam: 'Sésame', sulfite: 'Sulfites', lupinen: 'Lupin', weichtiere: 'Mollusques' },
  ar: { gluten: 'الغلوتين', krebstiere: 'القشريات', eier: 'البيض', fisch: 'السمك', erdnuesse: 'الفول السوداني', soja: 'الصويا', milch: 'الحليب', schalenfruechte: 'المكسرات', sellerie: 'الكرفس', senf: 'الخردل', sesam: 'السمسم', sulfite: 'الكبريتيت', lupinen: 'الترمس', weichtiere: 'الرخويات' },
  ru: { gluten: 'Глютен', krebstiere: 'Ракообразные', eier: 'Яйца', fisch: 'Рыба', erdnuesse: 'Арахис', soja: 'Соя', milch: 'Молоко', schalenfruechte: 'Орехи', sellerie: 'Сельдерей', senf: 'Горчица', sesam: 'Кунжут', sulfite: 'Сульфиты', lupinen: 'Люпин', weichtiere: 'Моллюски' },
};
const allergenLabels = (lang: MenuLang) => ALLERGEN_LABELS[lang === 'ku' ? 'en' : lang];

/** Filter auf der Karte: blendet Gerichte aus, die nicht passen. Gerichte ohne Angabe fallen heraus. */
const FILTER_SCRIPT = `(function(){var f=document.querySelector('.filters');if(!f)return;
var diet=null,ex={};
function ok(li){var d=li.getAttribute('data-d'),a=li.getAttribute('data-a');
if(diet==='vegan'&&d!=='vegan')return false;
if(diet==='vegetarian'&&d!=='vegan'&&d!=='vegetarian')return false;
var k=Object.keys(ex).filter(function(x){return ex[x]});
if(k.length){if(a===null)return false;var l=a.split(' ');for(var i=0;i<k.length;i++)if(l.indexOf(k[i])>-1)return false}
return true}
function apply(){var any=0;document.querySelectorAll('main section').forEach(function(s){var n=0;
s.querySelectorAll('li').forEach(function(li){var v=ok(li);li.hidden=!v;if(v)n++});s.hidden=!n;any+=n;
var h=s.querySelector('h2'),a=h&&document.querySelector('.nav a[href="#'+h.id+'"]');if(a)a.hidden=!n});
f.querySelector('.nomatch').hidden=any>0}
f.querySelectorAll('[data-f]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-f');diet=diet===v?null:v;
f.querySelectorAll('[data-f]').forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-f')===diet))});apply()})});
f.querySelectorAll('input[type=checkbox]').forEach(function(c){c.addEventListener('change',function(){ex[c.value]=c.checked;apply()})});
})();`;

const anchor = (i: number) => `k${i + 1}`;

const LANG_NAMES: Record<MenuLang, string> = { de: 'Deutsch', en: 'English', tr: 'Türkçe', fr: 'Français', ku: 'Kurdî', ar: 'العربية', ru: 'Русский' };

/** Texte der Bestell-Oberfläche. Sie werden auch im Browser gebraucht und deshalb als JSON eingebettet. */
const ORDER_LABELS: Record<MenuLang, { add: string; cart: string; table: string; note: string; send: string; sent: string; fail: string; wait: string; total: string; pay: string; close: string; remove: string }> = {
  de: { add: 'Hinzufügen', cart: 'Ihre Bestellung', table: 'Tisch', note: 'Hinweis für die Küche (optional)', send: 'Verbindlich bestellen', sent: 'Danke! Ihre Bestellung ist angekommen.', fail: 'Das hat nicht geklappt. Bitte sprechen Sie das Personal an.', wait: 'Bitte einen Moment warten, bevor Sie erneut bestellen.', total: 'Summe', pay: 'Bezahlt wird wie gewohnt beim Service.', close: 'Schließen', remove: 'Entfernen' },
  en: { add: 'Add', cart: 'Your order', table: 'Table', note: 'Note for the kitchen (optional)', send: 'Place order', sent: 'Thank you! Your order has been received.', fail: 'That did not work. Please ask the staff.', wait: 'Please wait a moment before ordering again.', total: 'Total', pay: 'You pay at the table as usual.', close: 'Close', remove: 'Remove' },
  tr: { add: 'Ekle', cart: 'Siparişiniz', table: 'Masa', note: 'Mutfak için not (isteğe bağlı)', send: 'Siparişi ver', sent: 'Teşekkürler! Siparişiniz alındı.', fail: 'Olmadı. Lütfen personele söyleyin.', wait: 'Tekrar sipariş vermeden önce lütfen biraz bekleyin.', total: 'Toplam', pay: 'Ödeme her zamanki gibi serviste yapılır.', close: 'Kapat', remove: 'Kaldır' },
  fr: { add: 'Ajouter', cart: 'Votre commande', table: 'Table', note: 'Remarque pour la cuisine (facultatif)', send: 'Commander', sent: 'Merci ! Votre commande a bien été reçue.', fail: 'Cela n’a pas fonctionné. Veuillez vous adresser au personnel.', wait: 'Veuillez patienter un instant avant de recommander.', total: 'Total', pay: 'Le paiement se fait comme d’habitude au service.', close: 'Fermer', remove: 'Retirer' },
  ku: { add: 'Zêde bike', cart: 'Fermana we', table: 'Mase', note: 'Têbînî ji bo mitbaxê (bi dilê xwe)', send: 'Ferman bide', sent: 'Spas! Fermana we hat.', fail: 'Nebû. Ji kerema xwe ji karmendan re bêje.', wait: 'Ji kerema xwe berî fermana nû hinekî bisekine.', total: 'Giştî', pay: 'Drav wekî her car li ser mase tê dayîn.', close: 'Bigire', remove: 'Rake' },
  ar: { add: 'إضافة', cart: 'طلبك', table: 'الطاولة', note: 'ملاحظة للمطبخ (اختياري)', send: 'تأكيد الطلب', sent: 'شكرًا! وصل طلبك.', fail: 'لم ينجح ذلك. يرجى التحدث إلى فريق الخدمة.', wait: 'يرجى الانتظار قليلًا قبل الطلب مرة أخرى.', total: 'المجموع', pay: 'الدفع كالمعتاد لدى فريق الخدمة.', close: 'إغلاق', remove: 'حذف' },
  ru: { add: 'Добавить', cart: 'Ваш заказ', table: 'Стол', note: 'Пожелание для кухни (необязательно)', send: 'Заказать', sent: 'Спасибо! Ваш заказ принят.', fail: 'Не получилось. Пожалуйста, обратитесь к персоналу.', wait: 'Пожалуйста, подождите немного перед новым заказом.', total: 'Итого', pay: 'Оплата, как обычно, у официанта.', close: 'Закрыть', remove: 'Убрать' },
};

const ORDER_STYLES = `
.add{flex:0 0 auto;align-self:center;margin-inline-start:auto;width:2.3rem;height:2.3rem;padding:0;line-height:1;font-size:1.3rem;border:1px solid var(--accent);background:transparent;color:var(--accent);border-radius:50%;font-family:inherit;font-weight:500;cursor:pointer}
.add:active{opacity:.7}
#bar{position:fixed;left:0;right:0;bottom:0;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:var(--panel);box-shadow:0 -6px 20px rgba(14,26,43,.16);display:flex;justify-content:center}
#bar[hidden],#sheet[hidden]{display:none}
#barbtn,#send{width:100%;max-width:520px;border:0;border-radius:999px;padding:14px 18px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:var(--on);font:inherit;font-weight:600;cursor:pointer}
#send:disabled{opacity:.6}
#sheet{position:fixed;inset:0;background:rgba(14,26,43,.55);display:flex;align-items:flex-end;justify-content:center;z-index:5}
#sheet .in{background:var(--panel);width:100%;max-width:560px;max-height:88vh;overflow:auto;border-radius:20px 20px 0 0;padding:20px 18px calc(18px + env(safe-area-inset-bottom))}
#sheet h3{margin:0 0 10px}
.cl{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(147,161,179,.28)}
.cl span{flex:1}
.cl button{border:1px solid var(--accent);background:transparent;color:var(--accent);border-radius:8px;width:30px;height:30px;font:inherit;font-size:1rem;cursor:pointer}
#note{width:100%;margin:12px 0;padding:10px;border-radius:10px;border:1px solid rgba(147,161,179,.5);font:inherit;background:transparent;color:var(--ink)}
.sum{display:flex;justify-content:space-between;font-weight:700;margin:6px 0}
.msg{margin:10px 0;text-align:center;font-weight:600}
.pay{margin:0 0 12px;color:var(--dim);font-size:.82rem;text-align:center}
.close{display:block;margin:12px auto 0;background:none;border:0;color:var(--dim);font:inherit;cursor:pointer}
body.ordering{padding-bottom:90px}
.ordering .dots{border-bottom-color:transparent}
`;

/** Läuft im Browser des Gastes: hält den Warenkorb und schickt ihn an /api/menu-order. Mehr nicht. */
const ORDER_SCRIPT = `(function(){
var cfg=JSON.parse(document.getElementById('oc').textContent),L=cfg.l,cart={},prices={};
var $=function(i){return document.getElementById(i)};
var fmt=function(c){return (c/100).toFixed(2).replace('.',',')+' €'};
document.querySelectorAll('.add').forEach(function(b){b.addEventListener('click',function(){
  var n=b.getAttribute('data-n');cart[n]=Math.min((cart[n]||0)+1,20);
  var c=b.getAttribute('data-c');prices[n]=c===''?null:Number(c);draw();});});
function count(){var t=0;for(var k in cart)t+=cart[k];return t}
function total(){var t=0;for(var k in cart){if(prices[k]==null)return null;t+=prices[k]*cart[k]}return t}
function draw(){
  var n=count();$('bar').hidden=n===0||!$('sheet').hidden;
  $('barbtn').textContent=L.cart+' ('+n+')';
  var box=$('lines');box.textContent='';
  Object.keys(cart).forEach(function(k){
    var row=document.createElement('div');row.className='cl';
    var nm=document.createElement('span');nm.textContent=cart[k]+' × '+(cfg.names[k]||k);row.appendChild(nm);
    [['−',-1],['+',1]].forEach(function(p){var b=document.createElement('button');b.type='button';b.textContent=p[0];
      b.setAttribute('aria-label',p[1]<0?L.remove:L.add);
      b.addEventListener('click',function(){cart[k]=Math.min(cart[k]+p[1],20);if(cart[k]<1)delete cart[k];if(!count())$('sheet').hidden=true;draw();});row.appendChild(b)});
    box.appendChild(row)});
  var t=total();$('sum').textContent=t==null?'':L.total+' '+fmt(t);
}
$('barbtn').addEventListener('click',function(){$('msg').textContent='';$('sheet').hidden=false;draw()});
$('close').addEventListener('click',function(){$('sheet').hidden=true;draw()});
$('send').addEventListener('click',function(){
  var items=Object.keys(cart).map(function(k){return{name:k,qty:cart[k]}});if(!items.length)return;
  $('send').disabled=true;
  fetch('/api/menu-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:cfg.slug,t:cfg.t,items:items,note:$('note').value})})
  .then(function(r){return r.json().catch(function(){return{}}).then(function(){return r.status})})
  .then(function(s){
    if(s===201){cart={};$('note').value='';$('lines').textContent='';$('sum').textContent='';$('msg').textContent=L.sent;
      setTimeout(function(){$('sheet').hidden=true;$('msg').textContent='';draw()},3500);}
    else{$('msg').textContent=s===429?L.wait:L.fail}
  }).catch(function(){$('msg').textContent=L.fail}).then(function(){$('send').disabled=false});
});
})();`;

/** Hebt in der Rubrikleiste die Rubrik hervor, in der man gerade liest. Ohne Script bleibt die Leiste einfach eine Linkliste. */
const NAV_SCRIPT = `(function(){var n=document.querySelector('.nav');if(!n)return;
var hs=[].slice.call(document.querySelectorAll('h2[id]')),L={},cur=null,t=0;
n.querySelectorAll('a').forEach(function(a){L[a.getAttribute('href').slice(1)]=a});
function upd(){t=0;var c=hs[0];hs.forEach(function(h){if(h.getBoundingClientRect().top<140)c=h});if(!c||c===cur)return;cur=c;
for(var k in L)L[k].removeAttribute('aria-current');var a=L[c.id];if(!a)return;
a.setAttribute('aria-current','true');var r=a.getBoundingClientRect(),q=n.getBoundingClientRect();
n.scrollBy({left:r.left+r.width/2-(q.left+q.width/2),behavior:'smooth'})}
addEventListener('scroll',function(){if(!t)t=requestAnimationFrame(upd)},{passive:true});upd()})();`;

export interface RenderOptions {
  /** Gewünschte Anzeigesprache (?l=). Gilt nur, wenn die Karte sie anbietet. */
  lang?: string;
  /** Gültiges Tischkürzel: nur dann erscheint die Bestell-Oberfläche. */
  table?: { label: string; token: string };
}

export function renderMenu(menu: Menu, base = config.siteUrl || '', opts: RenderOptions = {}): string {
  const t = THEMES[menu.theme] ?? THEMES.warm;
  const offered = menuLangs(menu);
  const fallback: MenuLang = MENU_LANGS.includes(menu.lang) ? menu.lang : 'de';
  const wanted = opts.lang as MenuLang;
  const lang: MenuLang = offered.includes(wanted) ? wanted : fallback;
  const l = LABELS[lang];
  const d = menu.data;
  const site = base.replace(/\/+$/, '');
  const cats = localize(d, lang)
    .map((c, i) => ({ c, orig: d.categories[i]! }))
    .filter((x) => x.c.items.length);
  const ordering = !!opts.table && !menu.preview;
  const keep = ordering ? `&amp;t=${encodeURIComponent(opts.table!.token)}` : '';
  const ol = ORDER_LABELS[lang];
  const fl = FILTER_LABELS[lang];
  const al = allergenLabels(lang);
  const allItems = d.categories.flatMap((c) => c.items);
  const hasDiet = allItems.some((i) => i.diet);
  const hasAllergens = allItems.some((i) => i.allergens);
  const filtersUi =
    hasDiet || hasAllergens
      ? `<div class="filters" role="group" aria-label="${esc(fl.filter)}">
<div class="chips">${hasDiet ? `<button type="button" class="chip" data-f="vegetarian" aria-pressed="false">${esc(fl.vegetarian)}</button><button type="button" class="chip" data-f="vegan" aria-pressed="false">${esc(fl.vegan)}</button>` : ''}${
          hasAllergens
            ? `<details class="al"><summary class="chip">${esc(fl.allergens)}</summary><div class="alg">${ALLERGENS.map((a) => `<label><input type="checkbox" value="${a}" /> ${esc(fl.without)} ${esc(al[a])}</label>`).join('')}</div></details>`
            : ''
        }</div>
<p class="fnote">${esc(fl.note)}</p>
<p class="nomatch" hidden>${esc(fl.none)}</p>
</div>`
      : '';

  const body = cats
    .map(
      ({ c, orig }, i) => `<section><h2 id="${anchor(i)}">${esc(c.title)}</h2>${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}<ul>${c.items
        .map((it, j) => {
          const o = orig.items[j]!;
          const add = ordering
            ? `<button type="button" class="add" data-n="${esc(o.name)}" data-c="${priceCents(o.price) ?? ''}" aria-label="${esc(`${ol.add}: ${it.name}`)}">+</button>`
            : '';
          const img = httpsUrl(it.img);
          return `<li${img ? ' class="has-img"' : ''}${o.diet ? ` data-d="${o.diet}"` : ''}${o.allergens ? ` data-a="${o.allergens.join(' ')}"` : ''}>${img ? `<div class="ph"><img class="dish" src="${esc(img)}" alt="${esc(it.name)}" loading="lazy" decoding="async" /></div>` : ''}<div class="txt"><div class="row"><span class="name">${esc(it.name)}${o.diet ? `<span class="tag">${esc(o.diet === 'vegan' ? fl.vegan : fl.vegetarian)}</span>` : ''}</span>${it.price ? `<span class="dots" aria-hidden="true"></span><span class="price">${esc(it.price)}</span>` : ''}${add}</div>${it.desc ? `<p class="desc">${esc(it.desc)}</p>` : ''}${o.allergens?.length ? `<p class="contains">${esc(fl.contains)}: ${o.allergens.map((a) => esc(al[a])).join(', ')}</p>` : ''}</div></li>`;
        })
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
  const credits = httpsUrl(d.creditsUrl);
  const orderUi = ordering
    ? `<div id="bar" hidden><button type="button" id="barbtn"></button></div>
<div id="sheet" hidden role="dialog" aria-modal="true" aria-label="${esc(ol.cart)}"><div class="in">
<h3>${esc(ol.cart)} · ${esc(ol.table)} ${esc(opts.table!.label)}</h3>
<div id="lines"></div><p class="sum" id="sum"></p>
<textarea id="note" rows="2" maxlength="300" placeholder="${esc(ol.note)}"></textarea>
<p class="pay">${esc(ol.pay)}</p>
<p class="msg" id="msg" role="status"></p>
<button type="button" id="send">${esc(ol.send)}</button>
<button type="button" class="close" id="close">${esc(ol.close)}</button>
</div></div>
<script type="application/json" id="oc">${JSON.stringify({
        slug: menu.slug,
        t: opts.table!.token,
        l: ol,
        names: Object.fromEntries(cats.flatMap(({ c, orig }) => c.items.map((it, j) => [orig.items[j]!.name, it.name]))),
      }).replace(/</g, '\\u003c')}</script>
<script>${ORDER_SCRIPT}</script>`
    : '';

  return `<!doctype html>
<html lang="${lang}"${lang === 'ar' ? ' dir="rtl"' : ''}><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<meta name="referrer" content="no-referrer" />
<title>${esc(d.name)}${d.tagline ? ` · ${esc(d.tagline)}` : ''}</title>
<style>:root{--accent:${t.accent};--on:${t.onAccent};--panel:${t.panel};--ink:${t.ink};--dim:${t.dim};--accent2:${t.accent2}}${styles(t)}${ORDER_STYLES}</style>
</head><body${ordering ? ' class="ordering"' : ''}>
<main class="menu">
<header class="hero">
${logo ? `<img class="logo" src="${esc(logo)}" alt="" />` : ''}
<h1>${esc(d.name)}</h1>
${d.tagline ? `<p class="tagline">${esc(d.tagline)}</p>` : ''}
<div class="orn" aria-hidden="true"><i>✦</i></div>
${d.address ? `<p class="where">${esc(d.address)}</p>` : ''}
${offered.length > 1 ? `<nav class="langs" aria-label="Language">${offered.map((x) => `<a href="?l=${x}${keep}" hreflang="${x}"${x === lang ? ' aria-current="true"' : ''}>${esc(LANG_NAMES[x])}</a>`).join('')}</nav>` : ''}
${ordering ? `<p class="table-tag">${esc(ol.table)} ${esc(opts.table!.label)}</p>` : ''}
</header>
${menu.preview ? `<p class="preview" role="status">${esc(l.preview)}</p>` : ''}
${cats.length > 1 ? `<nav class="nav" aria-label="${esc(d.tagline ?? d.name)}">${cats.map(({ c }, i) => `<a href="#${anchor(i)}">${esc(c.title)}</a>`).join('')}</nav>` : ''}
${filtersUi}
${cats.length ? body : `<p class="empty">${esc(l.empty)}</p>`}
${d.footnote ? `<p class="foot-note">${esc(d.footnote)}</p>` : ''}
${actions.length ? `<div class="actions">${actions.join('')}</div>` : ''}
<p class="foot">${credits ? `<a href="${esc(credits)}" rel="noopener">${esc(l.credits)}</a> · ` : ''}${site ? `<a href="${esc(site)}" rel="noopener">${esc(site.replace(/^https:\/\//, ''))}</a>` : 'Breisgau Digital'}</p>
</main>
${orderUi}
${cats.length > 1 ? `<script>${NAV_SCRIPT}</script>` : ''}
${filtersUi ? `<script>${FILTER_SCRIPT}</script>` : ''}
</body></html>`;
}

/**
 * Beispielkarte für Interessenten: /m/demo. Sie steht im Code und nicht in der
 * Datenbank, damit sie sofort nach dem Ausliefern da ist und kein Kunde
 * versehentlich mit ihr verwechselt wird. Name, Gerichte und Preise sind
 * erfunden; die Bilder sind eigene Zeichnungen (public/demo-menu).
 */
export const DEMO_SLUG = 'demo';

export function demoMenu(base: string): Menu {
  const site = base.replace(/\/+$/, '');
  const img = (n: string) => (site ? `${site}/demo-menu/${n}.svg` : undefined);
  const data = menuData({
    name: 'Gasthaus Beispiel',
    tagline: 'Beispielkarte · so sieht Ihre digitale Speisekarte aus',
    footnote:
      'Dies ist eine Demo von Breisgau Digital — alle Gerichte und Preise sind erfunden.\nIhre Karte pflegen Sie selbst: Gerichte, Preise und Fotos ändern sich sofort, ohne dass der NFC-Aufsteller oder QR-Code neu gedruckt werden muss.\nAllergene und Zusatzstoffe erfragen Sie bitte beim Service.',
    translations: { en: `# Starters
Cream of tomato soup | | with basil and croutons
Mixed leaf salad | | house dressing, roasted seeds

# Main courses | Vegetarian dishes are marked.
Cheese spaetzle | | with fried onions and salad (vegetarian)
Roast pork shoulder (Schäufele) | | with potato salad and sauerkraut
Vegetable pan | | seasonal vegetables, herb quark (vegetarian)

# Dessert
Black Forest cherry cake | | slice from the tray, with cream

# Drinks
House wine, white or red
Mineral water
Apple spritzer`, tr: `# Başlangıçlar
Domates kremalı çorba | | fesleğenli ve kızarmış ekmek küpleriyle
Karışık yeşil salata | | ev usulü sos, kavrulmuş çekirdekler

# Ana yemekler | Vejetaryen yemekler işaretlidir.
Peynirli Spätzle | | kızarmış soğan ve salata ile (vejetaryen)
Schäufele (domuz omuz) | | patates salatası ve lahana turşusu ile
Sebze tava | | mevsim sebzeleri, otlu lor (vejetaryen)

# Tatlı
Kara Orman vişneli pasta | | tepsiden dilim, krema ile

# İçecekler
Ev şarabı, beyaz veya kırmızı
Maden suyu
Elmalı gazoz` },
    categories: [
      {
        title: 'Vorspeisen',
        items: [
          { name: 'Tomatencremesuppe', price: '5,50', diet: 'vegetarian', allergens: ['gluten', 'milch'], desc: 'mit Basilikum und Croutons', img: img('suppe') },
          { name: 'Gemischter Blattsalat', price: '6,90', diet: 'vegan', allergens: ['senf'], desc: 'Hausdressing, geröstete Kerne' },
        ],
      },
      {
        title: 'Hauptgerichte',
        note: 'Vegetarische Gerichte sind gekennzeichnet.',
        items: [
          { name: 'Käsespätzle', price: '12,90', diet: 'vegetarian', allergens: ['gluten', 'eier', 'milch'], desc: 'mit Röstzwiebeln und Salat (vegetarisch)', img: img('spaetzle') },
          { name: 'Schäufele', price: '16,90', allergens: ['sellerie', 'senf'], desc: 'mit Kartoffelsalat und Sauerkraut', img: img('schaeufele') },
          { name: 'Gemüsepfanne', price: '11,50', diet: 'vegetarian', allergens: ['milch', 'sellerie'], desc: 'saisonales Gemüse, Kräuterquark (vegetarisch)' },
        ],
      },
      { title: 'Dessert', items: [{ name: 'Schwarzwälder Kirsch', price: '5,90', diet: 'vegetarian', allergens: ['gluten', 'eier', 'milch'], desc: 'Stück vom Blech, mit Sahne', img: img('dessert') }] },
      {
        title: 'Getränke',
        items: [
          { name: 'Hauswein, weiß oder rot', price: '0,2 l 4,80', diet: 'vegan', allergens: ['sulfite'], img: img('wein') },
          { name: 'Mineralwasser', price: '0,75 l 4,20', diet: 'vegan', allergens: [] },
          { name: 'Apfelschorle', price: '0,3 l 3,40', diet: 'vegan', allergens: [] },
        ],
      },
    ],
  })!;
  return { slug: DEMO_SLUG, lang: 'de', theme: 'warm', preview: false, data };
}
