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
  /** Nummer auf der gedruckten Karte, z. B. „37" oder „M4" (Mittagsmenü); steht vor dem Namen. */
  num?: string;
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
  /** Bild der Rubrik, https: zugeklappt als Bildkarte, offen als Banner über dem Titel. */
  img?: string;
  /** Nur in diesem Zeitraum (Berliner Zeit) sichtbar, z. B. „11:30-16:00" fürs Mittagsmenü; der Zeitraum steht am Titel. */
  hours?: string;
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
  /** „collapsed": Rubriken sind zugeklappt, nur die Titel stehen untereinander; ein Tipp öffnet eine. */
  sections?: 'collapsed';
  /**
   * Schritt-für-Schritt-Auswahl: welche Rubriken (Nummern ab 1, in Kartenreihenfolge) in welchen Schritt
   * gehören, z. B. „start:2; salad:3; main:1,4-16; dessert:17; soft:18-20; alc:21-26". Fehlt es, gibt es keinen
   * Assistenten. Gibt es „soft" und „alc", fragt der Assistent vor den Getränken, was man trinken möchte.
   */
  steps?: string;
  /** Instagram-Konto des Hauses, https; erscheint unter dem Knopf „Schritt für Schritt" und am Ende der Auswahl. */
  instagramUrl?: string;
  /** Übersetzungen im Textformat von `parseMenuText`, je Sprache; gleiche Reihenfolge wie das Original. */
  translations?: Partial<Record<MenuLang, string>>;
  categories: MenuCategory[];
}

/**
 * Die Sprachen der NFC-Karten plus Arabisch (von rechts nach links) und Russisch, die es nur für
 * Speisekarten gibt. Die Reihenfolge ist die der Sprachleiste auf der Karte.
 */
export const MENU_LANGS = ['de', 'en', 'fr', 'tr', 'ku', 'es', 'it', 'el', 'ar', 'fa', 'hi', 'ru', 'zh', 'ko'] as const satisfies readonly (CardLang | 'es' | 'it' | 'el' | 'ar' | 'fa' | 'hi' | 'ru' | 'zh' | 'ko')[];
export type MenuLang = (typeof MENU_LANGS)[number];

/** Die Themes der NFC-Karten plus „orient" (Rubinrot und Gold), das es nur für Speisekarten gibt. */
export const MENU_THEMES = [...CARD_THEMES, 'orient'] as const;
export type MenuTheme = (typeof MENU_THEMES)[number];

export const STEP_KINDS = ['start', 'salad', 'main', 'dessert', 'drinks', 'soft', 'alc'] as const;
export type StepKind = (typeof STEP_KINDS)[number];

/**
 * „start:1-2; main:3-15; dessert:16; drinks:17-24" → Schritte mit Rubrik-Indizes (ab 0). Unbekannte Arten,
 * Nummern außerhalb der Karte und doppelte Rubriken fallen weg; ein Schritt ohne Rubrik ebenso.
 */
export function parseSteps(spec: string | undefined, count: number): { kind: StepKind; cats: number[] }[] {
  const out: { kind: StepKind; cats: number[] }[] = [];
  const used = new Set<number>();
  for (const part of String(spec ?? '').split(';')) {
    const m = /^\s*([a-z]+)\s*:\s*(.+)$/.exec(part);
    if (!m || !(STEP_KINDS as readonly string[]).includes(m[1]!)) continue;
    const cats: number[] = [];
    for (const r of m[2]!.split(',')) {
      const mm = /^\s*(\d{1,3})\s*(?:-\s*(\d{1,3}))?\s*$/.exec(r);
      if (!mm) continue;
      const a = Number(mm[1]);
      const b = Number(mm[2] ?? mm[1]);
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) {
        if (i >= 1 && i <= count && !used.has(i - 1)) {
          used.add(i - 1);
          cats.push(i - 1);
        }
      }
    }
    if (cats.length) out.push({ kind: m[1] as StepKind, cats });
  }
  return out;
}

export interface Menu {
  slug: string;
  lang: MenuLang;
  theme: MenuTheme;
  preview: boolean;
  data: MenuData;
}

export const MAX_CATEGORIES = 40;
export const MAX_ITEMS = 60;

/** „37", „M4": höchstens drei Buchstaben, dann bis zu drei Ziffern. */
const menuNum = (v: unknown): string | undefined => {
  const s = typeof v === 'string' ? v.trim() : '';
  return /^[A-Za-z]{0,3}\d{1,3}$/.test(s) ? s : undefined;
};

/** „11:30-16:00" (Uhrzeiten 0:00-23:59); alles andere ist keine Zeitangabe. */
export function hoursSpec(v: unknown): string | undefined {
  const m = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(typeof v === 'string' ? v.trim() : '');
  if (!m) return undefined;
  const [a, b, c, d] = [m[1], m[2], m[3], m[4]].map(Number) as [number, number, number, number];
  if (a > 23 || c > 23 || b > 59 || d > 59) return undefined;
  const two = (n: number) => String(n).padStart(2, '0');
  return `${two(a)}:${two(b)}-${two(c)}:${two(d)}`;
}

/** Ist die Rubrik jetzt (Berliner Zeit) zu sehen? Ohne Zeitraum immer; über Mitternacht geht auch. */
export function openAt(hours: string | undefined, at: Date = new Date()): boolean {
  if (!hours) return true;
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(at);
  const now = Number(parts.find((x) => x.type === 'hour')?.value) * 60 + Number(parts.find((x) => x.type === 'minute')?.value);
  const [from, to] = hours.split('-').map((t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))) as [number, number];
  return from <= to ? now >= from && now < to : now >= from || now < to;
}

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
      const num = menuNum(it['num']);
      items.push({
        name: itemName,
        ...(num ? { num } : {}),
        price: text(it['price'], 60),
        desc: text(it['desc'], 400),
        img: httpsUrl(it['img']) ?? undefined,
        ...(diet ? { diet } : {}),
        ...(allergens ? { allergens } : {}),
      });
    }
    const img = httpsUrl(cat['img']);
    const hours = hoursSpec(cat['hours']);
    categories.push({ title, note: text(cat['note'], 300), ...(img ? { img } : {}), ...(hours ? { hours } : {}), items });
  }

  const translations: Partial<Record<MenuLang, string>> = {};
  const rawTr = (d['translations'] && typeof d['translations'] === 'object' ? d['translations'] : {}) as Record<string, unknown>;
  for (const l of MENU_LANGS) {
    const v = text(rawTr[l], 40000);
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
    instagramUrl: httpsUrl(d['instagramUrl']) ?? undefined,
    creditsUrl: httpsUrl(d['creditsUrl']) ?? undefined,
    sections: d['sections'] === 'collapsed' ? 'collapsed' : undefined,
    steps: text(d['steps'], 200),
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
      ...(c.img ? { img: c.img } : {}),
      ...(c.hours ? { hours: c.hours } : {}),
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

/** „10,90" → „10,90 €"; Preise in anderer Schreibweise („ab 12", „0,3 l 4,20") bleiben, wie sie stehen. */
export const priceText = (price: string): string => (priceCents(price) === null || /€/.test(price) ? price : `${price.trim()} €`);

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
      const parts = t.replace(/^#+\s*/, '').split('|').map((p) => p.trim());
      // Ein Rubrikbild steht wie beim Gericht als https-Adresse an letzter Stelle.
      const img = parts.length > 1 && /^https:\/\/\S+$/.test(parts[parts.length - 1]!) ? parts.pop() : undefined;
      // Davor kann der Zeitraum stehen: „@11:30-16:00".
      const hours = parts.length > 1 && /^@\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(parts[parts.length - 1]!) ? hoursSpec(parts.pop()!.slice(1)) : undefined;
      const [title, note] = parts;
      if (title) out.push({ title, note: note || undefined, ...(hours ? { hours } : {}), ...(img ? { img } : {}), items: [] });
      continue;
    }
    const cat = out[out.length - 1];
    if (!cat) continue;
    const parts = t.split('|').map((p) => p.trim());
    // Ein Foto steht als https-Adresse an letzter Stelle (nach dem Namen).
    const img = parts.length > 1 && /^https:\/\/\S+$/.test(parts[parts.length - 1]!) ? parts.pop() : undefined;
    // Davor (oder allein am Ende) können Angaben in eckigen Klammern stehen: [vegetarisch; milch, eier].
    const tags = parts.length > 1 && /^\[[^\]]*\]$/.test(parts[parts.length - 1]!) ? parseTags(parts.pop()!) : {};
    const [first, price, ...desc] = parts;
    // Eine Nummer steht mit Punkt vor dem Namen: „37. Musakka", „M4. Hindi Salatasi".
    const nm = /^([A-Za-z]{0,3}\d{1,3})\.\s+(.+)$/.exec(first ?? '');
    const name = nm ? nm[2]! : first;
    const num = nm ? nm[1] : undefined;
    if (name) cat.items.push({ name, ...(num ? { num } : {}), price: price || undefined, desc: desc.join(' | ') || undefined, ...(img ? { img } : {}), ...tags });
  }
  return out;
}

/** Umkehrung von `parseMenuText`, damit das Portal die Karte wieder als Text zeigt. */
export function menuText(categories: MenuCategory[]): string {
  return categories
    .map((c) =>
      [
        `# ${c.title}${c.note ? ` | ${c.note}` : ''}${c.hours ? ` | @${c.hours}` : ''}${c.img ? ` | ${c.img}` : ''}`,
        ...c.items.map((i) =>
          [i.num ? `${i.num}. ${i.name}` : i.name, i.price ?? '', i.desc ?? '', ...(tagsText(i) ? [tagsText(i)] : []), ...(i.img ? [i.img] : [])]
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
  fa: { review: 'به ما در Google امتیاز دهید', call: 'تماس', mail: 'ایمیل', map: 'مسیر', preview: 'پیش‌نمایش — این منو هنوز منتشر نشده است.', empty: 'منو در حال آماده‌سازی است.', credits: 'منبع تصاویر' },
  zh: { review: '在 Google 上给我们评分', call: '致电', mail: '电子邮件', map: '路线', preview: '预览——此菜单尚未发布。', empty: '菜单正在准备中。', credits: '图片来源' },
  ko: { review: 'Google에서 평가해 주세요', call: '전화', mail: '이메일', map: '길찾기', preview: '미리보기 — 이 메뉴는 아직 게시되지 않았습니다.', empty: '메뉴를 준비하고 있습니다.', credits: '사진 출처' },
  hi: { review: 'Google पर हमें रेट करें', call: 'कॉल करें', mail: 'ईमेल', map: 'रास्ता', preview: 'पूर्वावलोकन — यह मेनू अभी प्रकाशित नहीं हुआ है।', empty: 'मेनू तैयार किया जा रहा है।', credits: 'तस्वीरों के स्रोत' },
  es: { review: 'Valóranos en Google', call: 'Llamar', mail: 'Correo', map: 'Cómo llegar', preview: 'Vista previa: esta carta aún no está publicada.', empty: 'La carta se está preparando.', credits: 'Créditos de las fotos' },
  it: { review: 'Valutaci su Google', call: 'Chiama', mail: 'E-mail', map: 'Indicazioni', preview: 'Anteprima: questo menu non è ancora pubblicato.', empty: 'Il menu è in preparazione.', credits: 'Crediti fotografici' },
  el: { review: 'Αξιολογήστε μας στο Google', call: 'Κλήση', mail: 'Email', map: 'Οδηγίες', preview: 'Προεπισκόπηση — αυτός ο κατάλογος δεν έχει δημοσιευτεί ακόμη.', empty: 'Ο κατάλογος ετοιμάζεται.', credits: 'Πηγές φωτογραφιών' },
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
 * „orient" ist Rubinrot, Elfenbein und Blattgold, wie ein osmanischer Diwan: Der Kopf
 * ist ein Spitzbogenfenster über einem Muster aus achtzackigen Sternen, Titel und
 * Rahmen schimmern wie Blattgold, Rubriken stehen zwischen goldenen Linien mit Raute. Alles mit Systemschriften und
 * Inline-SVG, damit die Karte ohne Webfonts sofort steht.
 */
function orientPalette(): Palette {
  const gold = '#e3b44c';
  const star = (color: string, opacity: number) =>
    svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="${color}" stroke-opacity="${opacity}" stroke-width="1"><rect x="20" y="20" width="24" height="24"/><rect x="20" y="20" width="24" height="24" transform="rotate(45 32 32)"/><circle cx="32" cy="32" r="5"/><path d="M0 32h7M57 32h7M32 0v7M32 57v7M0 0l8 8M64 0l-8 8M0 64l8-8M64 64l-8-8"/></g></svg>`,
    );
  const solidStar = svgUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="${gold}"><rect x="6" y="6" width="12" height="12"/><rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)"/></g></svg>`,
  );
  const diamond = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><path d="M4 0 8 4 4 8 0 4z" fill="${gold}"/></svg>`);
  const heroA = '#8c1b2f';
  const heroB = '#2c0611';
  return {
    bg: `${star('#e0b865', 0.13)},radial-gradient(1100px 620px at 50% -8%,#8a1c30 0%,#4d0e1c 52%,#280510 100%)`,
    panel: '#fcf7ec',
    ink: '#2b1a1a',
    dim: '#7b6047',
    accent: '#8c1b2f',
    accent2: '#b32c43',
    onAccent: '#f6e5bb',
    soft: '#f9efdc',
    line: 'rgba(200,150,40,.5)',
    heroA,
    heroB,
    heroInk: '#fbeabb',
    heroDim: '#e6c477',
    extra: `
.menu{border-radius:22px;box-shadow:0 0 0 1px rgba(201,162,90,.7),0 0 0 7px #2c0611,0 0 0 8px rgba(207,166,79,.6),0 0 0 11px rgba(44,6,17,.55),0 34px 80px rgba(0,0,0,.55)}
.hero{border-radius:22px 22px 0 0;padding-top:58px;padding-bottom:30px;border-bottom:1px solid ${gold};
  background:${star('#e2c27e', 0.16)},radial-gradient(420px 260px at 50% 0%,rgba(226,194,126,.2),transparent 70%),linear-gradient(170deg,${heroA},${heroB})}
.hero::before{content:"";position:absolute;inset:16px 16px 14px;pointer-events:none;border:1px solid rgba(214,181,110,.5);
  border-radius:50% 50% 14px 14px/34% 34% 14px 14px;box-shadow:inset 0 0 0 5px rgba(44,6,17,.4),inset 0 0 0 6px rgba(214,181,110,.22)}
h1{font-weight:500;letter-spacing:.08em;text-transform:uppercase;text-shadow:none;
  background:linear-gradient(180deg,#fff3cf 8%,#f0d48e 34%,#cfa04a 62%,#a8782c 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 6px 18px rgba(0,0,0,.45))}
.tagline{letter-spacing:.06em}
.orn{max-width:260px}
.orn::before,.orn::after{background:linear-gradient(90deg,transparent,${gold})}
.orn i{display:block;width:16px;height:16px;font-size:0;background:${solidStar} center/contain no-repeat}
.langs a[aria-current]{background:linear-gradient(180deg,#fbeec8,#d9b062);color:#3a0814}
section{margin-top:42px}
h2{justify-content:center;text-align:center;font-weight:500;letter-spacing:.05em;color:#7f1a2b}
h2::before,h2::after{content:"";flex:1;height:8px;min-width:24px}
h2::before{background:${diamond} right center/8px 8px no-repeat,linear-gradient(270deg,${gold},transparent) left center/calc(100% - 13px) 1px no-repeat}
h2::after{background:${diamond} left center/8px 8px no-repeat,linear-gradient(90deg,${gold},transparent) right center/calc(100% - 13px) 1px no-repeat}
.note{text-align:center}
.nav a{transition:none}
details.cat.card>summary{background:${star('#e2c27e', 0.16)},linear-gradient(170deg,${heroA},${heroB});outline:1px solid rgba(214,181,110,.55);outline-offset:-6px}
details.cat.card>summary h2{color:#f6e6bf}
.nav a[aria-current]{background:linear-gradient(160deg,${heroA},${heroB});border-color:${gold};color:#f6e5bb;transition:none}
li.has-img{border-color:rgba(201,162,90,.5);border-radius:18px;box-shadow:0 1px 2px rgba(40,30,10,.08),0 14px 30px -16px rgba(60,10,22,.4)}
.ph{border-bottom:1px solid ${gold}}
.dish{aspect-ratio:4/3}
.price{color:#8c1b2f;font-family:${SERIF};font-size:1.04rem}
.dots{border-bottom-color:rgba(176,128,44,.5)}
.tag{color:#8c1b2f}
.btn{background:linear-gradient(160deg,#a62338,${heroB});border:1px solid ${gold};color:#f6e5bb}
#wopen{border-color:${gold}}
.foot-note{text-align:center}
.menu{box-shadow:0 0 0 2px #f0cf78,0 0 0 6px #2c0611,0 0 0 8px #d9a93f,0 0 0 9px #2c0611,0 0 26px 6px rgba(224,178,74,.3),0 34px 80px rgba(0,0,0,.6)}
.hero{border-bottom:3px double #e3b44c}
.hero::before{border:2px solid rgba(240,207,120,.85);box-shadow:inset 0 0 0 5px rgba(44,6,17,.45),inset 0 0 0 7px rgba(240,207,120,.45),inset 0 0 40px rgba(224,178,74,.12)}
h1{background:linear-gradient(180deg,#fffbe2 0%,#ffe9a1 22%,#e9bd53 50%,#b9831f 74%,#f1d27c 100%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 0 14px rgba(240,200,100,.35)) drop-shadow(0 6px 16px rgba(0,0,0,.5))}
.tagline{color:#f1cf7a}
.nav a{border-color:rgba(200,150,40,.65)}
.nav a[aria-current]{background:linear-gradient(180deg,#fdeeb4,#e3b44c 55%,#c08a25);border-color:#f0cf78;color:#3a0814}
h2{color:#7a1226}
h2::before,h2::after{height:10px}
h2::before{background:${diamond} right center/10px 10px no-repeat,linear-gradient(270deg,#e3b44c,transparent) left center/calc(100% - 15px) 2px no-repeat}
h2::after{background:${diamond} left center/10px 10px no-repeat,linear-gradient(90deg,#e3b44c,transparent) right center/calc(100% - 15px) 2px no-repeat}
details.cat.card>summary{outline:1.5px solid rgba(240,207,120,.85);outline-offset:-6px;box-shadow:0 0 0 1px #d9a93f,0 12px 26px -14px rgba(0,0,0,.6)}
details.cat.card>summary h2{background:linear-gradient(180deg,#fff3c4,#eec766 55%,#c9962f);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:600}
li.has-img{border:1.5px solid #d9a93f}
.ph{border-bottom:2px solid #e3b44c}
.num{background:linear-gradient(180deg,#dcab3f,#9a6710);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:700}
.price{background:linear-gradient(180deg,#d6a031,#8c5a08);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:700}
.dots{border-bottom:2px dotted rgba(200,150,40,.7)}
.btn,#wopen{background:linear-gradient(180deg,#fdeeb4,#e3b44c 55%,#b98322);border:1px solid #f4d98a;color:#4a0b17;font-weight:700;box-shadow:0 8px 22px -10px rgba(120,80,0,.7)}
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
section.fold{margin-top:0}
section.fold:first-of-type{margin-top:22px}
details.cat{border-bottom:1px solid ${t.line}}
details.cat>summary{display:flex;align-items:center;gap:12px;padding:17px 2px;scroll-margin-top:62px;cursor:pointer;list-style:none;-webkit-tap-highlight-color:transparent}
details.cat>summary::-webkit-details-marker{display:none}
details.cat>summary h2{flex:1;display:block;margin:0;font-size:1.28rem;text-align:start}
details.cat>summary h2::before,details.cat>summary h2::after{display:none}
details.cat>summary::after{content:"";flex:0 0 auto;width:8px;height:8px;margin:0 6px;border-right:2px solid ${t.accent};border-bottom:2px solid ${t.accent};transform:translateY(-2px) rotate(45deg);transition:transform .25s}
details.cat[open]>summary::after{transform:translateY(2px) rotate(-135deg)}
.cnt{flex:0 0 auto;min-width:2rem;padding:1px 9px;border-radius:999px;background:${t.soft};border:1px solid ${t.line};color:${t.dim};font-size:.74rem;font-weight:600;text-align:center;font-variant-numeric:tabular-nums}
details.cat[open]>summary .cnt{display:none}
details.cat>ul{margin-top:0;padding-bottom:10px}
details.cat>.note{margin-top:-6px}
details.cat.card{border:0;margin:12px 0}
details.cat.card>summary{position:relative;overflow:hidden;min-height:150px;padding:16px 18px;align-items:flex-end;border-radius:16px;
  background:linear-gradient(160deg,${t.heroA},${t.heroB});color:${t.heroInk};box-shadow:0 10px 24px -14px rgba(0,0,0,.55)}
details.cat.card[open]>summary{border-radius:16px 16px 0 0}
.ci{position:absolute;inset:0;z-index:0}
.ci img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.2,.7,.2,1)}
details.cat.card>summary:hover .ci img{transform:scale(1.04)}
details.cat.card>summary::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(0,0,0,.8) 0%,rgba(0,0,0,.42) 45%,rgba(0,0,0,.08) 100%)}
details.cat.card>summary h2,details.cat.card>summary .cnt,details.cat.card>summary::after{position:relative;z-index:2}
details.cat.card>summary h2{color:${t.heroInk};font-size:1.42rem;text-shadow:0 2px 10px rgba(0,0,0,.55)}
details.cat.card .cnt{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.28);color:${t.heroInk};backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
details.cat.card>summary::after{border-color:${t.heroInk};margin-bottom:9px}
details.cat.card>ul{padding:0 4px 12px;border-bottom:1px solid ${t.line}}
details.cat.card>.note{margin:10px 4px 0}
.cban{display:block;overflow:hidden;margin:0 0 14px;border-radius:16px;aspect-ratio:16/7;background:${t.line}}
.cban img{display:block;width:100%;height:100%;object-fit:cover}
ul{list-style:none;margin:10px 0 0;padding:0}
li{padding:13px 0;border-bottom:1px solid ${t.line}}
li:last-child{border-bottom:0}
li.has-img{background:${t.soft};border:1px solid ${t.line};border-radius:20px;overflow:hidden;margin:14px 0;padding:0 0 12px;box-shadow:0 1px 2px rgba(60,20,30,.06),0 12px 28px -14px rgba(60,20,30,.28)}
.txt{min-width:0}
.has-img .txt{padding:14px 18px 2px}
.row{display:flex;align-items:baseline;gap:8px}
.name{font:600 1.05rem/1.3 ${SERIF}}
.num{display:inline-block;min-width:1.9em;margin-right:.35em;color:${t.accent};font-variant-numeric:tabular-nums}
.dots{flex:1 1 1rem;min-width:.8rem;border-bottom:2px dotted ${t.line};transform:translateY(-.3em)}
.price{flex:0 0 auto;font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums;color:${t.accent}}
.ph{position:relative;overflow:hidden;background:${t.line}}
.dish{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
.ph::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(142deg,rgba(255,255,255,.26) 0%,rgba(255,255,255,.06) 30%,transparent 46%)}
.ph::after{content:"";position:absolute;top:-10%;bottom:-10%;left:0;width:42%;z-index:1;pointer-events:none;opacity:0;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.34),transparent);transform:translateX(-140%) skewX(-14deg)}
li.has-img:hover .ph::after,li.has-img:active .ph::after{opacity:1;transform:translateX(340%) skewX(-14deg);transition:transform .9s cubic-bezier(.4,.1,.2,1),opacity .2s}
.desc{margin:3px 0 0;color:${t.dim};font-size:.88rem;line-height:1.45}
.closed{display:none!important}
.hrs{display:block;margin-top:2px;color:${t.dim};font:italic 400 .78rem/1.3 ${SERIF};letter-spacing:.02em}
details.cat.card>summary .hrs{color:${t.heroDim}}
.orig{margin:1px 0 0;color:${t.dim};font-size:.8rem;font-style:italic;unicode-bidi:isolate}
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
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}details.cat>summary::after,.ci img{transition:none}.hero::after{animation:none;opacity:0}.btn::after,.ph::after{display:none}}
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
  fa: { filter: 'فیلتر', vegetarian: 'گیاهی', vegan: 'وگان', allergens: 'آلرژن‌ها', without: 'بدون', contains: 'حاوی', note: 'اطلاعات بدون ضمانت است. در صورت آلرژی لطفاً از کارکنان بپرسید؛ غذاهای بدون اطلاعات هنگام فیلتر کردن پنهان می‌شوند.', none: 'هیچ غذایی با فیلتر مطابقت ندارد.' },
  zh: { filter: '筛选', vegetarian: '素食', vegan: '纯素', allergens: '过敏原', without: '不含', contains: '含有', note: '信息仅供参考，不作保证。如有过敏，请询问服务人员；筛选时，没有相关信息的菜品会被隐藏。', none: '没有符合筛选条件的菜品。' },
  ko: { filter: '필터', vegetarian: '채식', vegan: '비건', allergens: '알레르기 유발 성분', without: '제외', contains: '함유', note: '정보는 보증되지 않습니다. 알레르기가 있으시면 직원에게 문의해 주세요. 정보가 없는 메뉴는 필터링 시 숨겨집니다.', none: '필터에 맞는 메뉴가 없습니다.' },
  hi: { filter: 'फ़िल्टर', vegetarian: 'शाकाहारी', vegan: 'वीगन', allergens: 'एलर्जी कारक', without: 'बिना', contains: 'इसमें है', note: 'जानकारी बिना गारंटी के है। एलर्जी होने पर कृपया स्टाफ़ से पूछें; जिन व्यंजनों की जानकारी नहीं है, वे फ़िल्टर करने पर छिप जाते हैं।', none: 'फ़िल्टर से मेल खाता कोई व्यंजन नहीं है।' },
  es: { filter: 'Filtro', vegetarian: 'Vegetariano', vegan: 'Vegano', allergens: 'Alérgenos', without: 'sin', contains: 'Contiene', note: 'Información sin garantía. Si tiene alguna alergia, pregunte al personal; los platos sin información se ocultan al filtrar.', none: 'Ningún plato coincide con el filtro.' },
  it: { filter: 'Filtro', vegetarian: 'Vegetariano', vegan: 'Vegano', allergens: 'Allergeni', without: 'senza', contains: 'Contiene', note: 'Informazioni senza garanzia. In caso di allergie chiedete al personale; i piatti senza indicazioni vengono nascosti con il filtro.', none: 'Nessun piatto corrisponde al filtro.' },
  el: { filter: 'Φίλτρο', vegetarian: 'Χορτοφαγικό', vegan: 'Βίγκαν', allergens: 'Αλλεργιογόνα', without: 'χωρίς', contains: 'Περιέχει', note: 'Οι πληροφορίες δίνονται χωρίς εγγύηση. Σε περίπτωση αλλεργίας ρωτήστε το προσωπικό· τα πιάτα χωρίς πληροφορίες κρύβονται κατά το φιλτράρισμα.', none: 'Κανένα πιάτο δεν ταιριάζει με το φίλτρο.' },
};

const ALLERGEN_LABELS: Record<'de' | 'en' | 'tr' | 'fr' | 'es' | 'it' | 'el' | 'ar' | 'fa' | 'hi' | 'ru' | 'zh' | 'ko', Record<Allergen, string>> = {
  de: { gluten: 'Gluten', krebstiere: 'Krebstiere', eier: 'Eier', fisch: 'Fisch', erdnuesse: 'Erdnüsse', soja: 'Soja', milch: 'Milch', schalenfruechte: 'Schalenfrüchte', sellerie: 'Sellerie', senf: 'Senf', sesam: 'Sesam', sulfite: 'Sulfite', lupinen: 'Lupinen', weichtiere: 'Weichtiere' },
  en: { gluten: 'Gluten', krebstiere: 'Crustaceans', eier: 'Eggs', fisch: 'Fish', erdnuesse: 'Peanuts', soja: 'Soy', milch: 'Milk', schalenfruechte: 'Tree nuts', sellerie: 'Celery', senf: 'Mustard', sesam: 'Sesame', sulfite: 'Sulphites', lupinen: 'Lupin', weichtiere: 'Molluscs' },
  tr: { gluten: 'Gluten', krebstiere: 'Kabuklular', eier: 'Yumurta', fisch: 'Balık', erdnuesse: 'Yer fıstığı', soja: 'Soya', milch: 'Süt', schalenfruechte: 'Kabuklu yemişler', sellerie: 'Kereviz', senf: 'Hardal', sesam: 'Susam', sulfite: 'Sülfit', lupinen: 'Acı bakla', weichtiere: 'Yumuşakçalar' },
  fr: { gluten: 'Gluten', krebstiere: 'Crustacés', eier: 'Œufs', fisch: 'Poisson', erdnuesse: 'Arachides', soja: 'Soja', milch: 'Lait', schalenfruechte: 'Fruits à coque', sellerie: 'Céleri', senf: 'Moutarde', sesam: 'Sésame', sulfite: 'Sulfites', lupinen: 'Lupin', weichtiere: 'Mollusques' },
  ar: { gluten: 'الغلوتين', krebstiere: 'القشريات', eier: 'البيض', fisch: 'السمك', erdnuesse: 'الفول السوداني', soja: 'الصويا', milch: 'الحليب', schalenfruechte: 'المكسرات', sellerie: 'الكرفس', senf: 'الخردل', sesam: 'السمسم', sulfite: 'الكبريتيت', lupinen: 'الترمس', weichtiere: 'الرخويات' },
  ru: { gluten: 'Глютен', krebstiere: 'Ракообразные', eier: 'Яйца', fisch: 'Рыба', erdnuesse: 'Арахис', soja: 'Соя', milch: 'Молоко', schalenfruechte: 'Орехи', sellerie: 'Сельдерей', senf: 'Горчица', sesam: 'Кунжут', sulfite: 'Сульфиты', lupinen: 'Люпин', weichtiere: 'Моллюски' },
  fa: { gluten: 'گلوتن', krebstiere: 'سخت‌پوستان', eier: 'تخم‌مرغ', fisch: 'ماهی', erdnuesse: 'بادام‌زمینی', soja: 'سویا', milch: 'شیر', schalenfruechte: 'آجیل‌ها', sellerie: 'کرفس', senf: 'خردل', sesam: 'کنجد', sulfite: 'سولفیت‌ها', lupinen: 'لوپین', weichtiere: 'نرم‌تنان' },
  zh: { gluten: '麸质', krebstiere: '甲壳类', eier: '鸡蛋', fisch: '鱼', erdnuesse: '花生', soja: '大豆', milch: '牛奶', schalenfruechte: '坚果', sellerie: '芹菜', senf: '芥末', sesam: '芝麻', sulfite: '亚硫酸盐', lupinen: '羽扇豆', weichtiere: '软体动物' },
  ko: { gluten: '글루텐', krebstiere: '갑각류', eier: '달걀', fisch: '생선', erdnuesse: '땅콩', soja: '대두', milch: '우유', schalenfruechte: '견과류', sellerie: '셀러리', senf: '겨자', sesam: '참깨', sulfite: '아황산염', lupinen: '루핀', weichtiere: '연체동물' },
  hi: { gluten: 'ग्लूटेन', krebstiere: 'क्रस्टेशियन', eier: 'अंडे', fisch: 'मछली', erdnuesse: 'मूंगफली', soja: 'सोया', milch: 'दूध', schalenfruechte: 'मेवे', sellerie: 'सेलेरी', senf: 'सरसों', sesam: 'तिल', sulfite: 'सल्फ़ाइट', lupinen: 'ल्यूपिन', weichtiere: 'मोलस्क' },
  es: { gluten: 'Gluten', krebstiere: 'Crustáceos', eier: 'Huevos', fisch: 'Pescado', erdnuesse: 'Cacahuetes', soja: 'Soja', milch: 'Leche', schalenfruechte: 'Frutos de cáscara', sellerie: 'Apio', senf: 'Mostaza', sesam: 'Sésamo', sulfite: 'Sulfitos', lupinen: 'Altramuces', weichtiere: 'Moluscos' },
  it: { gluten: 'Glutine', krebstiere: 'Crostacei', eier: 'Uova', fisch: 'Pesce', erdnuesse: 'Arachidi', soja: 'Soia', milch: 'Latte', schalenfruechte: 'Frutta a guscio', sellerie: 'Sedano', senf: 'Senape', sesam: 'Sesamo', sulfite: 'Solfiti', lupinen: 'Lupini', weichtiere: 'Molluschi' },
  el: { gluten: 'Γλουτένη', krebstiere: 'Μαλακόστρακα', eier: 'Αυγά', fisch: 'Ψάρι', erdnuesse: 'Φιστίκια', soja: 'Σόγια', milch: 'Γάλα', schalenfruechte: 'Ξηροί καρποί', sellerie: 'Σέλινο', senf: 'Μουστάρδα', sesam: 'Σουσάμι', sulfite: 'Θειώδη', lupinen: 'Λούπινο', weichtiere: 'Μαλάκια' },
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
var cnt=s.querySelector('.cnt');if(cnt)cnt.textContent=n;
var h=s.querySelector('h2'),a=h&&document.querySelector('.nav a[href="#'+h.id+'"]');if(a)a.hidden=!n});
f.querySelector('.nomatch').hidden=any>0}
f.querySelectorAll('[data-f]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-f');diet=diet===v?null:v;
f.querySelectorAll('[data-f]').forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-f')===diet))});apply()})});
f.querySelectorAll('input[type=checkbox]').forEach(function(c){c.addEventListener('change',function(){ex[c.value]=c.checked;apply()})});
})();`;

const anchor = (i: number) => `k${i + 1}`;

const LANG_NAMES: Record<MenuLang, string> = { de: 'Deutsch', en: 'English', tr: 'Türkçe', fr: 'Français', ku: 'Kurdî', ar: 'العربية', fa: 'فارسی', ru: 'Русский', zh: '中文', ko: '한국어', es: 'Español', it: 'Italiano', el: 'Ελληνικά', hi: 'हिन्दी' };

interface WizLabels { open: string; start: string; main: string; dessert: string; drinks: string; step: string; next: string; back: string; summary: string; show: string; empty: string; restart: string; close: string; total: string; add: string; remove: string; hint: string }

/** Texte der Schritt-für-Schritt-Auswahl. {n} und {m} in `step` sind Schritt und Anzahl der Schritte. */
interface WizExtra { start: string; salad: string; soft: string; alc: string; pick: string }
/** Ab Oktober 2026: Salate und Getränke haben eigene Schritte; „start" heißt jetzt nur noch Vorspeisen. */
const WIZ_EXTRA: Record<MenuLang, WizExtra> = {
  de: { start: 'Vorspeisen', salad: 'Salate', soft: 'Alkoholfreie Getränke', alc: 'Alkoholische Getränke', pick: 'Was möchten Sie trinken?' },
  en: { start: 'Starters', salad: 'Salads', soft: 'Non-alcoholic drinks', alc: 'Alcoholic drinks', pick: 'What would you like to drink?' },
  fr: { start: 'Entrées', salad: 'Salades', soft: 'Boissons sans alcool', alc: 'Boissons alcoolisées', pick: 'Que souhaitez-vous boire ?' },
  tr: { start: 'Başlangıçlar', salad: 'Salatalar', soft: 'Alkolsüz içecekler', alc: 'Alkollü içecekler', pick: 'Ne içmek istersiniz?' },
  es: { start: 'Entrantes', salad: 'Ensaladas', soft: 'Bebidas sin alcohol', alc: 'Bebidas con alcohol', pick: '¿Qué le gustaría beber?' },
  it: { start: 'Antipasti', salad: 'Insalate', soft: 'Bevande analcoliche', alc: 'Bevande alcoliche', pick: 'Cosa desideri bere?' },
  el: { start: 'Ορεκτικά', salad: 'Σαλάτες', soft: 'Μη αλκοολούχα ποτά', alc: 'Αλκοολούχα ποτά', pick: 'Τι θα θέλατε να πιείτε;' },
  ar: { start: 'المقبلات', salad: 'السلطات', soft: 'مشروبات بدون كحول', alc: 'مشروبات كحولية', pick: 'ماذا تودّ أن تشرب؟' },
  fa: { start: 'پیش‌غذاها', salad: 'سالادها', soft: 'نوشیدنی‌های بدون الکل', alc: 'نوشیدنی‌های الکلی', pick: 'چه نوشیدنی می‌خواهید؟' },
  hi: { start: 'स्टार्टर', salad: 'सलाद', soft: 'बिना अल्कोहल के पेय', alc: 'अल्कोहल वाले पेय', pick: 'आप क्या पीना चाहेंगे?' },
  ru: { start: 'Закуски', salad: 'Салаты', soft: 'Безалкогольные напитки', alc: 'Алкогольные напитки', pick: 'Что вы хотите выпить?' },
  zh: { start: '前菜', salad: '沙拉', soft: '无酒精饮料', alc: '含酒精饮料', pick: '您想喝点什么？' },
  ko: { start: '전채', salad: '샐러드', soft: '무알코올 음료', alc: '알코올 음료', pick: '무엇을 드시겠어요?' },
  ku: { start: 'Destpêk', salad: 'Selete', soft: 'Vexwarinên bê alkol', alc: 'Vexwarinên bi alkol', pick: 'Hûn dixwazin çi vexwin?' },
};

const WIZ_LABELS: Record<MenuLang, WizLabels> = {
  de: { open: 'Schritt für Schritt wählen', start: 'Vorspeisen & Salate', main: 'Hauptgerichte', dessert: 'Dessert', drinks: 'Getränke', step: 'Schritt {n} von {m}', next: 'Weiter', back: 'Zurück', summary: 'Ihre Auswahl', show: 'Zeigen Sie diese Liste einfach dem Service – wir nehmen Ihre Bestellung gern auf.', empty: 'Noch nichts ausgewählt.', restart: 'Neu beginnen', close: 'Zur Speisekarte', total: 'Summe', add: 'Mehr', remove: 'Weniger', hint: 'Nichts dabei? Einfach weiter.' },
  en: { open: 'Choose step by step', start: 'Starters & salads', main: 'Main courses', dessert: 'Dessert', drinks: 'Drinks', step: 'Step {n} of {m}', next: 'Next', back: 'Back', summary: 'Your selection', show: 'Simply show this list to our staff – we will gladly take your order.', empty: 'Nothing selected yet.', restart: 'Start over', close: 'Back to the menu', total: 'Total', add: 'More', remove: 'Less', hint: 'Nothing for you here? Just continue.' },
  fr: { open: 'Choisir étape par étape', start: 'Entrées et salades', main: 'Plats principaux', dessert: 'Dessert', drinks: 'Boissons', step: 'Étape {n} sur {m}', next: 'Suivant', back: 'Retour', summary: 'Votre sélection', show: 'Montrez simplement cette liste au personnel – nous prendrons volontiers votre commande.', empty: 'Rien de sélectionné pour l’instant.', restart: 'Recommencer', close: 'Retour à la carte', total: 'Total', add: 'Plus', remove: 'Moins', hint: 'Rien pour vous ici ? Continuez simplement.' },
  tr: { open: 'Adım adım seç', start: 'Başlangıçlar ve salatalar', main: 'Ana yemekler', dessert: 'Tatlı', drinks: 'İçecekler', step: 'Adım {n} / {m}', next: 'İleri', back: 'Geri', summary: 'Seçiminiz', show: 'Bu listeyi servis personelimize göstermeniz yeterli, siparişinizi memnuniyetle alırız.', empty: 'Henüz bir şey seçmediniz.', restart: 'Baştan başla', close: 'Menüye dön', total: 'Toplam', add: 'Artır', remove: 'Azalt', hint: 'Burada istediğiniz yok mu? İleri geçin.' },
  ar: { open: 'اختر خطوة بخطوة', start: 'المقبلات والسلطات', main: 'الأطباق الرئيسية', dessert: 'الحلويات', drinks: 'المشروبات', step: 'الخطوة {n} من {m}', next: 'التالي', back: 'رجوع', summary: 'اختيارك', show: 'ما عليك سوى إظهار هذه القائمة لفريق الخدمة، ويسعدنا تلقي طلبك.', empty: 'لم تختر شيئًا بعد.', restart: 'البدء من جديد', close: 'العودة إلى القائمة', total: 'المجموع', add: 'زيادة', remove: 'إنقاص', hint: 'لا شيء يناسبك هنا؟ تابع ببساطة.' },
  ru: { open: 'Выбрать по шагам', start: 'Закуски и салаты', main: 'Основные блюда', dessert: 'Десерт', drinks: 'Напитки', step: 'Шаг {n} из {m}', next: 'Далее', back: 'Назад', summary: 'Ваш выбор', show: 'Просто покажите этот список официанту — мы с радостью примем ваш заказ.', empty: 'Пока ничего не выбрано.', restart: 'Начать заново', close: 'Вернуться к меню', total: 'Итого', add: 'Больше', remove: 'Меньше', hint: 'Ничего не подходит? Просто продолжайте.' },
  fa: { open: 'گام‌به‌گام انتخاب کنید', start: 'پیش‌غذا و سالاد', main: 'غذاهای اصلی', dessert: 'دسر', drinks: 'نوشیدنی‌ها', step: 'گام {n} از {m}', next: 'بعدی', back: 'بازگشت', summary: 'انتخاب شما', show: 'فقط این فهرست را به سرویس‌دهنده نشان دهید؛ با کمال میل سفارش شما را ثبت می‌کنیم.', empty: 'هنوز چیزی انتخاب نکرده‌اید.', restart: 'شروع دوباره', close: 'بازگشت به منو', total: 'جمع', add: 'بیشتر', remove: 'کمتر', hint: 'چیزی مناسب شما نیست؟ ادامه دهید.' },
  zh: { open: '分步选择', start: '前菜和沙拉', main: '主菜', dessert: '甜点', drinks: '饮品', step: '第 {n} 步，共 {m} 步', next: '下一步', back: '返回', summary: '您的选择', show: '只需把这份清单出示给服务员，我们很乐意为您点单。', empty: '您还没有选择任何菜品。', restart: '重新开始', close: '返回菜单', total: '合计', add: '增加', remove: '减少', hint: '这里没有合适的？直接继续即可。' },
  ko: { open: '단계별로 선택', start: '전채와 샐러드', main: '메인 요리', dessert: '디저트', drinks: '음료', step: '{n}/{m} 단계', next: '다음', back: '뒤로', summary: '선택 내역', show: '이 목록을 직원에게 보여 주시면 기꺼이 주문을 받겠습니다.', empty: '아직 선택한 메뉴가 없습니다.', restart: '처음부터 다시', close: '메뉴로 돌아가기', total: '합계', add: '늘리기', remove: '줄이기', hint: '맞는 메뉴가 없나요? 그냥 계속하세요.' },
  hi: { open: 'चरण-दर-चरण चुनें', start: 'स्टार्टर और सलाद', main: 'मुख्य व्यंजन', dessert: 'मिठाई', drinks: 'पेय', step: 'चरण {n} / {m}', next: 'आगे', back: 'पीछे', summary: 'आपका चयन', show: 'बस यह सूची हमारे स्टाफ़ को दिखाएँ, हम खुशी से आपका ऑर्डर लेंगे।', empty: 'अभी कुछ नहीं चुना गया।', restart: 'फिर से शुरू करें', close: 'मेनू पर वापस', total: 'कुल', add: 'बढ़ाएँ', remove: 'घटाएँ', hint: 'यहाँ कुछ पसंद नहीं आया? बस आगे बढ़ें।' },
  es: { open: 'Elegir paso a paso', start: 'Entrantes y ensaladas', main: 'Platos principales', dessert: 'Postre', drinks: 'Bebidas', step: 'Paso {n} de {m}', next: 'Siguiente', back: 'Atrás', summary: 'Su selección', show: 'Basta con mostrar esta lista a nuestro personal; encantados de tomar su pedido.', empty: 'Todavía no ha elegido nada.', restart: 'Empezar de nuevo', close: 'Volver a la carta', total: 'Total', add: 'Más', remove: 'Menos', hint: '¿Nada que le guste aquí? Siga adelante.' },
  it: { open: 'Scegli passo dopo passo', start: 'Antipasti e insalate', main: 'Piatti principali', dessert: 'Dolce', drinks: 'Bevande', step: 'Passo {n} di {m}', next: 'Avanti', back: 'Indietro', summary: 'La tua scelta', show: 'Mostra semplicemente questa lista al nostro personale: prenderemo volentieri il tuo ordine.', empty: 'Non hai ancora scelto nulla.', restart: 'Ricomincia', close: 'Torna al menu', total: 'Totale', add: 'Di più', remove: 'Di meno', hint: 'Niente che faccia per te? Vai avanti.' },
  el: { open: 'Επιλέξτε βήμα βήμα', start: 'Ορεκτικά και σαλάτες', main: 'Κυρίως πιάτα', dessert: 'Επιδόρπιο', drinks: 'Ποτά', step: 'Βήμα {n} από {m}', next: 'Επόμενο', back: 'Πίσω', summary: 'Η επιλογή σας', show: 'Δείξτε απλώς αυτή τη λίστα στο προσωπικό μας· θα πάρουμε με χαρά την παραγγελία σας.', empty: 'Δεν έχετε επιλέξει τίποτα ακόμη.', restart: 'Ξεκινήστε από την αρχή', close: 'Επιστροφή στον κατάλογο', total: 'Σύνολο', add: 'Περισσότερα', remove: 'Λιγότερα', hint: 'Δεν βρήκατε κάτι; Συνεχίστε.' },
  ku: { open: 'Gav bi gav hilbijêre', start: 'Destpêk û selete', main: 'Xwarinên sereke', dessert: 'Şîranî', drinks: 'Vexwarin', step: 'Gav {n} ji {m}', next: 'Pêşve', back: 'Paşve', summary: 'Hilbijartina we', show: 'Vê lîsteyê tenê nîşanî karmendan bidin, em ê fermana we bi kêfxweşî bigirin.', empty: 'Hê tiştek nehatiye hilbijartin.', restart: 'Ji nû ve dest pê bike', close: 'Vegere menûyê', total: 'Giştî', add: 'Zêdetir', remove: 'Kêmtir', hint: 'Tiştek ji bo we tune? Tenê pêşve biçin.' },
};

/** Texte der Bestell-Oberfläche. Sie werden auch im Browser gebraucht und deshalb als JSON eingebettet. */
const ORDER_LABELS: Record<MenuLang, { add: string; cart: string; table: string; note: string; send: string; sent: string; fail: string; wait: string; total: string; pay: string; close: string; remove: string }> = {
  de: { add: 'Hinzufügen', cart: 'Ihre Bestellung', table: 'Tisch', note: 'Hinweis für die Küche (optional)', send: 'Verbindlich bestellen', sent: 'Danke! Ihre Bestellung ist angekommen.', fail: 'Das hat nicht geklappt. Bitte sprechen Sie das Personal an.', wait: 'Bitte einen Moment warten, bevor Sie erneut bestellen.', total: 'Summe', pay: 'Bezahlt wird wie gewohnt beim Service.', close: 'Schließen', remove: 'Entfernen' },
  en: { add: 'Add', cart: 'Your order', table: 'Table', note: 'Note for the kitchen (optional)', send: 'Place order', sent: 'Thank you! Your order has been received.', fail: 'That did not work. Please ask the staff.', wait: 'Please wait a moment before ordering again.', total: 'Total', pay: 'You pay at the table as usual.', close: 'Close', remove: 'Remove' },
  tr: { add: 'Ekle', cart: 'Siparişiniz', table: 'Masa', note: 'Mutfak için not (isteğe bağlı)', send: 'Siparişi ver', sent: 'Teşekkürler! Siparişiniz alındı.', fail: 'Olmadı. Lütfen personele söyleyin.', wait: 'Tekrar sipariş vermeden önce lütfen biraz bekleyin.', total: 'Toplam', pay: 'Ödeme her zamanki gibi serviste yapılır.', close: 'Kapat', remove: 'Kaldır' },
  fr: { add: 'Ajouter', cart: 'Votre commande', table: 'Table', note: 'Remarque pour la cuisine (facultatif)', send: 'Commander', sent: 'Merci ! Votre commande a bien été reçue.', fail: 'Cela n’a pas fonctionné. Veuillez vous adresser au personnel.', wait: 'Veuillez patienter un instant avant de recommander.', total: 'Total', pay: 'Le paiement se fait comme d’habitude au service.', close: 'Fermer', remove: 'Retirer' },
  ku: { add: 'Zêde bike', cart: 'Fermana we', table: 'Mase', note: 'Têbînî ji bo mitbaxê (bi dilê xwe)', send: 'Ferman bide', sent: 'Spas! Fermana we hat.', fail: 'Nebû. Ji kerema xwe ji karmendan re bêje.', wait: 'Ji kerema xwe berî fermana nû hinekî bisekine.', total: 'Giştî', pay: 'Drav wekî her car li ser mase tê dayîn.', close: 'Bigire', remove: 'Rake' },
  ar: { add: 'إضافة', cart: 'طلبك', table: 'الطاولة', note: 'ملاحظة للمطبخ (اختياري)', send: 'تأكيد الطلب', sent: 'شكرًا! وصل طلبك.', fail: 'لم ينجح ذلك. يرجى التحدث إلى فريق الخدمة.', wait: 'يرجى الانتظار قليلًا قبل الطلب مرة أخرى.', total: 'المجموع', pay: 'الدفع كالمعتاد لدى فريق الخدمة.', close: 'إغلاق', remove: 'حذف' },
  ru: { add: 'Добавить', cart: 'Ваш заказ', table: 'Стол', note: 'Пожелание для кухни (необязательно)', send: 'Заказать', sent: 'Спасибо! Ваш заказ принят.', fail: 'Не получилось. Пожалуйста, обратитесь к персоналу.', wait: 'Пожалуйста, подождите немного перед новым заказом.', total: 'Итого', pay: 'Оплата, как обычно, у официанта.', close: 'Закрыть', remove: 'Убрать' },
  fa: { add: 'افزودن', cart: 'سفارش شما', table: 'میز', note: 'توضیح برای آشپزخانه (اختیاری)', send: 'ثبت سفارش', sent: 'متشکریم! سفارش شما دریافت شد.', fail: 'انجام نشد. لطفاً با کارکنان صحبت کنید.', wait: 'لطفاً پیش از سفارش جدید کمی صبر کنید.', total: 'جمع', pay: 'پرداخت مثل همیشه سر میز انجام می‌شود.', close: 'بستن', remove: 'حذف' },
  zh: { add: '添加', cart: '您的订单', table: '桌号', note: '给厨房的备注（可选）', send: '提交订单', sent: '谢谢！我们已收到您的订单。', fail: '提交失败，请联系服务人员。', wait: '请稍候再提交新订单。', total: '合计', pay: '像往常一样在餐桌上付款。', close: '关闭', remove: '移除' },
  ko: { add: '추가', cart: '주문 내역', table: '테이블', note: '주방 요청사항 (선택)', send: '주문하기', sent: '감사합니다! 주문이 접수되었습니다.', fail: '실패했습니다. 직원에게 문의해 주세요.', wait: '새 주문 전에 잠시 기다려 주세요.', total: '합계', pay: '결제는 평소처럼 테이블에서 해 주세요.', close: '닫기', remove: '삭제' },
  hi: { add: 'जोड़ें', cart: 'आपका ऑर्डर', table: 'टेबल', note: 'रसोई के लिए नोट (वैकल्पिक)', send: 'ऑर्डर करें', sent: 'धन्यवाद! आपका ऑर्डर मिल गया।', fail: 'नहीं हो पाया। कृपया स्टाफ़ से बात करें।', wait: 'नया ऑर्डर देने से पहले कृपया थोड़ा इंतज़ार करें।', total: 'कुल', pay: 'भुगतान हमेशा की तरह टेबल पर होगा।', close: 'बंद करें', remove: 'हटाएँ' },
  es: { add: 'Añadir', cart: 'Su pedido', table: 'Mesa', note: 'Nota para la cocina (opcional)', send: 'Pedir', sent: '¡Gracias! Hemos recibido su pedido.', fail: 'No ha funcionado. Hable con el personal, por favor.', wait: 'Espere un momento antes de hacer un nuevo pedido.', total: 'Total', pay: 'El pago se hace como siempre en la mesa.', close: 'Cerrar', remove: 'Quitar' },
  it: { add: 'Aggiungi', cart: 'Il tuo ordine', table: 'Tavolo', note: 'Nota per la cucina (facoltativa)', send: 'Ordina', sent: 'Grazie! Abbiamo ricevuto il tuo ordine.', fail: 'Non è andata a buon fine. Rivolgiti al personale.', wait: 'Attendi un momento prima di un nuovo ordine.', total: 'Totale', pay: 'Il pagamento avviene come sempre al tavolo.', close: 'Chiudi', remove: 'Rimuovi' },
  el: { add: 'Προσθήκη', cart: 'Η παραγγελία σας', table: 'Τραπέζι', note: 'Σημείωση για την κουζίνα (προαιρετική)', send: 'Παραγγελία', sent: 'Ευχαριστούμε! Λάβαμε την παραγγελία σας.', fail: 'Δεν ήταν δυνατό. Απευθυνθείτε στο προσωπικό.', wait: 'Περιμένετε λίγο πριν από νέα παραγγελία.', total: 'Σύνολο', pay: 'Η πληρωμή γίνεται ως συνήθως στο τραπέζι.', close: 'Κλείσιμο', remove: 'Αφαίρεση' },
};

/** Aussehen der Schritt-für-Schritt-Auswahl: Kopf im Stil der Karte, unten Zurück/Weiter. */
const wizStyles = (t: Palette) => `
#wopen{width:100%;margin:18px 0 0;border:1px solid transparent;font:inherit;font-weight:600;cursor:pointer}
body.wiz-on{overflow:hidden}
#wiz{position:fixed;inset:0;z-index:6;display:flex;flex-direction:column;background:${t.panel};color:${t.ink}}
#wiz[hidden]{display:none}
.wh{position:relative;padding:16px 56px 12px;text-align:center;background:linear-gradient(170deg,${t.heroA},${t.heroB});color:${t.heroInk}}
.wpr{margin:0;min-height:1.1em;color:${t.heroDim};font-size:.74rem;letter-spacing:.08em;text-transform:uppercase}
.wh h3{margin:3px 0 10px;font:600 1.3rem/1.25 ${SERIF}}
.wx{position:absolute;top:12px;inset-inline-end:12px;width:2.2rem;height:2.2rem;border:0;border-radius:50%;background:rgba(255,255,255,.14);color:${t.heroInk};font:inherit;font-size:1.3rem;line-height:1;cursor:pointer}
.wdots{display:flex;gap:6px;justify-content:center}
.wdots i{width:22px;height:4px;border-radius:2px;background:rgba(255,255,255,.22)}
.wdots i.done{background:${t.heroDim}}
.wdots i.cur{background:${t.heroInk}}
.wb{flex:1;overflow:auto;padding:4px 20px 28px;-webkit-overflow-scrolling:touch}
.wstep,.wb .wsum{max-width:560px;margin:0 auto}
.whint{margin:14px 0 0;color:${t.dim};font-size:.8rem;text-align:center}
.wstep h4{margin:22px 0 2px;font:600 1.05rem/1.3 ${SERIF};color:${t.accent}}
details.wcat{border-bottom:1px solid ${t.line}}
details.wcat>summary{display:flex;align-items:center;gap:10px;padding:15px 0;cursor:pointer;list-style:none;-webkit-tap-highlight-color:transparent}
details.wcat>summary::-webkit-details-marker{display:none}
details.wcat>summary h4{flex:1;margin:0}
.wci{flex:0 0 auto;width:104px;height:72px;overflow:hidden;border-radius:14px;border:1px solid ${t.line}}
.wci img{display:block;width:100%;height:100%;object-fit:cover}
details.wcat>summary::after{content:"";flex:0 0 auto;width:7px;height:7px;margin:0 6px;border-right:2px solid ${t.accent};border-bottom:2px solid ${t.accent};transform:translateY(-2px) rotate(45deg);transition:transform .25s}
details.wcat[open]>summary::after{transform:translateY(2px) rotate(-135deg)}
details.wcat .wi:last-child{border-bottom:0}
.wsel{flex:0 0 auto;min-width:1.6rem;padding:1px 8px;border-radius:999px;background:linear-gradient(135deg,${t.accent},${t.accent2});color:${t.onAccent};font-size:.74rem;font-weight:700;text-align:center}
.wi{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid ${t.line}}
.wi.has-img{flex-wrap:wrap;padding:14px 0}
.wph{flex:0 0 100%;overflow:hidden;border-radius:16px;border:1px solid ${t.line}}
.wph img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover}
.wde{display:inline-block;margin-top:1px;color:${t.dim};font:italic 400 .8rem/1.3 ${SERIF}}
.wsub{margin:14px 0 0;color:${t.dim};font:italic 400 .9rem/1.3 ${SERIF};text-align:center}
.wchoice{display:block;width:100%;margin:16px 0 0;padding:26px 16px;border-radius:20px;border:1px solid ${t.line};background:${t.soft};color:${t.accent};font:600 1.2rem/1.3 ${SERIF};cursor:pointer}
.wchoice small{display:block;margin-top:3px;color:${t.dim};font:italic 400 .85rem/1.3 ${SERIF}}
.cta{margin:18px 0 0}
.cta #wopen{margin:0}
.social{display:flex;gap:10px;margin:10px 0 0}
.social .btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;margin:0;padding:11px 10px;font-size:.9rem;text-align:center;text-decoration:none}
.social .btn small{font-size:.72rem;font-weight:500;opacity:.8}
.wsum .social{margin-top:22px}
.wt{flex:1;min-width:0}
.wn{display:block;font:600 1rem/1.3 ${SERIF}}
.wd{display:block;margin-top:2px;color:${t.dim};font-size:.8rem;line-height:1.35}
.wp{flex:0 0 auto;font-weight:600;color:${t.accent};font-variant-numeric:tabular-nums}
.wq{flex:0 0 auto;display:flex;align-items:center;gap:6px}
.wq button{width:2.15rem;height:2.15rem;padding:0;border-radius:50%;border:1px solid ${t.line};background:${t.soft};color:${t.accent};font:inherit;font-size:1.15rem;line-height:1;cursor:pointer}
.wq output{min-width:1.2rem;text-align:center;font-weight:700;font-variant-numeric:tabular-nums}
.wi:not(.on) .wm,.wi:not(.on) output{visibility:hidden}
.wi.on .wa{background:linear-gradient(135deg,${t.accent},${t.accent2});border-color:transparent;color:${t.onAccent}}
.wi.on .wn{color:${t.accent}}
.wf{display:flex;gap:10px;padding:12px 20px calc(12px + env(safe-area-inset-bottom));border-top:1px solid ${t.line};background:${t.panel}}
.wf button{flex:1;padding:14px 18px;border-radius:999px;font:inherit;font-weight:600;cursor:pointer}
.wf button[hidden]{display:none}
.wbk{background:transparent;border:1px solid ${t.line};color:${t.accent}}
.wnx{border:0;background:linear-gradient(135deg,${t.accent},${t.accent2});color:${t.onAccent}}
.wsum h4{margin:22px 0 4px;font:600 1.02rem/1.3 ${SERIF};color:${t.accent}}
.wl{display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-bottom:1px solid ${t.line}}
.wl span:last-child{flex:0 0 auto;font-weight:600;white-space:nowrap;color:${t.accent};font-variant-numeric:tabular-nums}
.wtot{margin:14px 0 0;text-align:end;font-weight:700;font-size:1.12rem}
.wshow{margin:20px 0 0;padding:14px 16px;border-radius:14px;background:${t.soft};border:1px solid ${t.line};text-align:center;line-height:1.45}
.wempty{margin:30px 0;color:${t.dim};text-align:center}
.wre{display:block;margin:18px auto 0;background:none;border:0;color:${t.dim};font:inherit;font-size:.9rem;text-decoration:underline;cursor:pointer}
#wnote{width:100%;margin:16px 0 10px;padding:10px;border-radius:10px;border:1px solid ${t.line};font:inherit;background:transparent;color:${t.ink}}
#wsend{width:100%;border:0;border-radius:999px;padding:14px 18px;background:linear-gradient(135deg,${t.accent},${t.accent2});color:${t.onAccent};font:inherit;font-weight:600;cursor:pointer}
#wsend:disabled{opacity:.5}
#wmsg{margin:10px 0 0;text-align:center;font-weight:600}
`;

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

/**
 * Schritt-für-Schritt-Auswahl: blättert durch die Schritte, zählt je Gericht mit, baut am Ende die Liste.
 * Die Auswahl bleibt in sessionStorage, falls der Gast die Seite neu lädt. Mit Tischkürzel (Bestellen am
 * Tisch) schickt „Bestellen" die Liste an /api/menu-order; Namen und Preise prüft dort der Server.
 */
const WIZ_SCRIPT = `(function(){var w=document.getElementById('wiz'),o=document.getElementById('wopen');if(!w||!o)return;
var cfg=JSON.parse(document.getElementById('wc').textContent),L=cfg.l,q={},cur=0,hist=[],$=function(i){return document.getElementById(i)};
var st=[].slice.call(w.querySelectorAll('.wstep')),items=[].slice.call(w.querySelectorAll('.wi')),kinds=st.map(function(s){return s.getAttribute('data-k')}),sumI=st.length-1;
var pickI=kinds.indexOf('pick'),nums=[],cnt=0;
kinds.forEach(function(x,j){var dr=x==='soft'||x==='alc',pd=j>0&&(kinds[j-1]==='soft'||kinds[j-1]==='alc');if(dr&&pickI>-1&&pd)nums.push(nums[j-1]);else nums.push(++cnt)});
function nextOf(j){var x=kinds[j];return pickI>-1&&(x==='soft'||x==='alc')?sumI:j+1}
var fmt=function(c){return (c/100).toFixed(2).replace('.',',')+' €'};
try{q=JSON.parse(sessionStorage.getItem(cfg.k)||'{}')||{}}catch(e){q={}}
function save(){try{sessionStorage.setItem(cfg.k,JSON.stringify(q))}catch(e){}}
function sync(){items.forEach(function(it){var v=q[it.getAttribute('data-n')]||0;it.querySelector('output').textContent=v;it.classList.toggle('on',v>0)});
w.querySelectorAll('details.wcat').forEach(function(d){var n=0;d.querySelectorAll('.wi').forEach(function(it){n+=q[it.getAttribute('data-n')]||0});var b=d.querySelector('.wsel');b.hidden=!n;b.textContent=n})}
items.forEach(function(it){var n=it.getAttribute('data-n');
it.querySelector('.wa').addEventListener('click',function(){q[n]=Math.min((q[n]||0)+1,20);save();sync()});
it.querySelector('.wm').addEventListener('click',function(){if(q[n]){q[n]--;if(!q[n])delete q[n]}save();sync()})});
function chosen(){return items.filter(function(it){return q[it.getAttribute('data-n')]})}
function summary(){var box=$('wlist'),tot=0,known=true,any=false;box.textContent='';
st.slice(0,-1).forEach(function(s){var rows=[].slice.call(s.querySelectorAll('.wi')).filter(function(it){return q[it.getAttribute('data-n')]});if(!rows.length)return;any=true;
var h=document.createElement('h4'),ht=s.getAttribute('data-t'),hd=s.getAttribute('data-td');h.textContent=hd&&hd!==ht?ht+' · '+hd:ht;box.appendChild(h);
rows.forEach(function(it){var k=q[it.getAttribute('data-n')],c=it.getAttribute('data-c'),r=document.createElement('div'),a=document.createElement('span'),b=document.createElement('span');
r.className='wl';var tn=it.getAttribute('data-tn'),on=it.getAttribute('data-n'),nu=it.getAttribute('data-num');a.textContent=k+' × '+(nu?nu+' ':'')+tn;
if(tn!==on){var de=document.createElement('small');de.className='wde';de.textContent=on;a.appendChild(document.createElement('br'));a.appendChild(de)}
if(c===''){known=false;b.textContent=it.getAttribute('data-p')}else{tot+=Number(c)*k;b.textContent=fmt(Number(c)*k)}
r.appendChild(a);r.appendChild(b);box.appendChild(r)})});
if(!any){var e=document.createElement('p');e.className='wempty';e.textContent=L.empty;box.appendChild(e)}
$('wtot').hidden=!(any&&known);$('wtot').textContent=L.total+' '+fmt(tot);$('wshow').hidden=!any;var sd=$('wshowde');if(sd)sd.hidden=!any;$('wre').hidden=!any;
if(cfg.o)$('wsend').disabled=!any}
function show(i){cur=Math.max(0,Math.min(i,sumI));var last=cur===sumI,pk=kinds[cur]==='pick';
st.forEach(function(s,j){s.hidden=j!==cur});$('wtt').textContent=st[cur].getAttribute('data-t');
$('wpr').textContent=last?'':L.step.replace('{n}',nums[cur]).replace('{m}',nums[sumI]-1);
[].forEach.call($('wdots').children,function(d,j){var n=nums[cur]-1;d.className=j<n?'done':j===n?'cur':''});
$('wback').hidden=hist.length===0;$('wnext').hidden=last||pk;$('wnext').textContent=nextOf(cur)===sumI?L.summary:L.next;
if(last)summary();$('wb').scrollTop=0}
function go(i){hist.push(cur);show(i)}
for(var di=0;di<nums[sumI];di++)$('wdots').appendChild(document.createElement('i'));
[].forEach.call(w.querySelectorAll('.wchoice'),function(b){b.addEventListener('click',function(){go(kinds.indexOf(b.getAttribute('data-go')))})});
function close(){w.hidden=true;document.body.classList.remove('wiz-on');o.focus()}
o.hidden=false;o.addEventListener('click',function(){w.hidden=false;document.body.classList.add('wiz-on');sync();hist=[];show(0)});
$('wx').addEventListener('click',close);document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!w.hidden)close()});
$('wnext').addEventListener('click',function(){go(nextOf(cur))});$('wback').addEventListener('click',function(){show(hist.length?hist.pop():0)});
$('wre').addEventListener('click',function(){q={};save();sync();hist=[];show(0)});
if(cfg.o)$('wsend').addEventListener('click',function(){var list=chosen().map(function(it){var n=it.getAttribute('data-n');return{name:n,qty:q[n]}});if(!list.length)return;
$('wsend').disabled=true;$('wmsg').textContent='';
fetch('/api/menu-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:cfg.o.slug,t:cfg.o.t,items:list,note:$('wnote').value})})
.then(function(r){if(r.status===201){q={};save();sync();$('wnote').value='';summary();$('wmsg').textContent=cfg.o.sent}else{$('wmsg').textContent=r.status===429?cfg.o.wait:cfg.o.fail;$('wsend').disabled=false}})
.catch(function(){$('wmsg').textContent=cfg.o.fail;$('wsend').disabled=false})});
})();`;

/** Hebt in der Rubrikleiste die Rubrik hervor, in der man gerade liest. Ohne Script bleibt die Leiste einfach eine Linkliste. */
/** Rubriken mit Zeitraum (data-hrs) erscheinen und verschwinden zur Minute, auch wenn die Seite offen bleibt. */
const HOURS_SCRIPT = `(function(){try{var f=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function t(s){return +s.slice(0,2)*60+ +s.slice(3,5)}
function run(){var p=f.formatToParts(new Date()),n=0;p.forEach(function(x){if(x.type==='hour')n+=+x.value*60;if(x.type==='minute')n+=+x.value});
document.querySelectorAll('[data-hrs]').forEach(function(e){var r=e.getAttribute('data-hrs').split('-'),a=t(r[0]),b=t(r[1]);e.classList.toggle('closed',!(a<=b?n>=a&&n<b:n>=a||n<b))})}
run();setInterval(run,30000)}catch(e){}})();`;

const HOURS_LABEL: Record<MenuLang, string> = {
  de: 'Täglich', en: 'Daily', fr: 'Tous les jours', tr: 'Her gün', es: 'Todos los días', it: 'Ogni giorno', el: 'Καθημερινά',
  ar: 'يوميًا', fa: 'هر روز', hi: 'रोज़ाना', ru: 'Ежедневно', zh: '每天', ko: '매일', ku: 'Her roj',
};

const NAV_SCRIPT = `(function(){var n=document.querySelector('.nav');if(!n)return;
var hs=[].slice.call(document.querySelectorAll('h2[id]')),L={},cur=null,t=0;
n.querySelectorAll('a').forEach(function(a){L[a.getAttribute('href').slice(1)]=a});
function upd(){t=0;var c=hs[0];hs.forEach(function(h){if(h.getBoundingClientRect().top<140)c=h});if(!c||c===cur)return;cur=c;
for(var k in L)L[k].removeAttribute('aria-current');var a=L[c.id];if(!a)return;
a.setAttribute('aria-current','true');var r=a.getBoundingClientRect(),q=n.getBoundingClientRect();
n.scrollBy({left:r.left+r.width/2-(q.left+q.width/2),behavior:'smooth'})}
addEventListener('scroll',function(){if(!t)t=requestAnimationFrame(upd)},{passive:true});upd()})();`;

/**
 * Zugeklappte Rubriken: Ein Tipp auf die Rubrikleiste öffnet die Rubrik, ebenso ein #k…-Link beim Laden.
 * Öffnet man eine Rubrik, schließt der Browser die vorige (name="cats"); rutscht der Titel dabei aus dem
 * Bild, holt das Script ihn zurück nach oben. Ohne Script bleiben die Rubriken per Tipp auf- und zuklappbar.
 */
const FOLD_SCRIPT = `(function(){function open(id){var h=document.getElementById(id),d=h&&h.closest('details');if(d&&!d.open)d.open=true}
document.querySelectorAll('.nav a').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href').slice(1),h=document.getElementById(id);if(!h)return;
e.preventDefault();open(id);history.replaceState(null,'','#'+id);h.closest('summary').scrollIntoView({block:'start',behavior:'instant'})})});
if(location.hash){open(location.hash.slice(1));var h0=document.getElementById(location.hash.slice(1));if(h0)h0.closest('summary').scrollIntoView({block:'start',behavior:'instant'})}
document.querySelectorAll('details.cat').forEach(function(d){d.addEventListener('toggle',function(){if(!d.open)return;
var s=d.querySelector('summary'),r=s.getBoundingClientRect();if(r.top<62)s.scrollIntoView({block:'start',behavior:'instant'})})})})();`;

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
  const fold = d.sections === 'collapsed' && cats.length > 1;
  // Sobald eine Rubrik ein Bild hat, werden zugeklappte Rubriken zu Bildkarten; ohne Bild trägt die Karte das Muster des Themes.
  const cards = fold && cats.some(({ c }) => httpsUrl(c.img));
  const catImg = (c: MenuCategory, cls: string) => {
    const u = httpsUrl(c.img);
    return u ? `<span class="${cls}"><img src="${esc(u)}" alt="" loading="lazy" decoding="async" /></span>` : '';
  };
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

  // Bei Getränken steht unter dem übersetzten Namen der Originalname, damit das Servicepersonal ihn versteht.
  const drinkCats = new Set(parseSteps(d.steps, d.categories.length).filter((st) => st.kind === 'drinks' || st.kind === 'soft' || st.kind === 'alc').flatMap((st) => st.cats));
  const origName = (ci: number, it: MenuItem, o: MenuItem) => (drinkCats.has(ci) && it.name !== o.name ? `<p class="orig" lang="${menu.lang}" dir="ltr">${esc(o.name)}</p>` : '');
  const inHours = (c: MenuCategory) => (c.hours ? ` data-hrs="${esc(c.hours)}"` : '');
  const isClosed = (c: MenuCategory) => !openAt(c.hours);
  const hrsLabel = (c: MenuCategory) => (c.hours ? `<small class="hrs">${esc(HOURS_LABEL[lang])} ${esc(c.hours.replace('-', '–'))}</small>` : '');
  const body = cats
    .map(
      ({ c, orig }, i) => `${
        fold
          ? `<section class="fold${isClosed(orig) ? ' closed' : ''}"${inHours(orig)}><details class="cat${cards ? ' card' : ''}" name="cats"><summary>${cards ? catImg(c, 'ci') : ''}<h2 id="${anchor(i)}">${esc(c.title)}${hrsLabel(orig)}</h2><span class="cnt">${c.items.length}</span></summary>`
          : `<section${isClosed(orig) ? ' class="closed"' : ''}${inHours(orig)}>${catImg(c, 'cban')}<h2 id="${anchor(i)}">${esc(c.title)}${hrsLabel(orig)}</h2>`
      }${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}<ul>${c.items
        .map((it, j) => {
          const o = orig.items[j]!;
          const add = ordering
            ? `<button type="button" class="add" data-n="${esc(o.name)}" data-c="${priceCents(o.price) ?? ''}" aria-label="${esc(`${ol.add}: ${it.name}`)}">+</button>`
            : '';
          const img = httpsUrl(it.img);
          return `<li${img ? ' class="has-img"' : ''}${o.diet ? ` data-d="${o.diet}"` : ''}${o.allergens ? ` data-a="${o.allergens.join(' ')}"` : ''}>${img ? `<div class="ph"><img class="dish" src="${esc(img)}" alt="${esc(it.name)}" loading="lazy" decoding="async" /></div>` : ''}<div class="txt"><div class="row"><span class="name">${o.num ? `<span class="num">${esc(o.num)}</span>` : ''}${esc(it.name)}${o.diet ? `<span class="tag">${esc(o.diet === 'vegan' ? fl.vegan : fl.vegetarian)}</span>` : ''}</span>${it.price ? `<span class="dots" aria-hidden="true"></span><span class="price">${esc(priceText(it.price))}</span>` : ''}${add}</div>${origName(i, it, o)}${it.desc ? `<p class="desc">${esc(it.desc)}</p>` : ''}${o.allergens?.length ? `<p class="contains">${esc(fl.contains)}: ${o.allergens.map((a) => esc(al[a])).join(', ')}</p>` : ''}</div></li>`;
        })
        .join('')}</ul>${fold ? '</details>' : ''}</section>`,
    )
    .join('\n');

  // Schritt-für-Schritt-Auswahl: dieselben Gerichte wie auf der Karte, je Schritt mit Zähler.
  const wl = { ...WIZ_LABELS[lang], ...WIZ_EXTRA[lang] };
  const wlDe = { ...WIZ_LABELS.de, ...WIZ_EXTRA.de };
  const insta = httpsUrl(d.instagramUrl);
  const handle = insta ? /instagram\.com\/([^/?#]+)/i.exec(insta)?.[1] : undefined;
  const reviewHref = httpsUrl(d.reviewUrl);
  const social =
    insta || reviewHref
      ? `<div class="social">${insta ? `<a class="btn" href="${esc(insta)}" rel="noopener">Instagram${handle ? `<small dir="ltr">@${esc(handle)}</small>` : ''}</a>` : ''}${reviewHref ? `<a class="btn" href="${esc(reviewHref)}" rel="noopener">${esc(l.review)}</a>` : ''}</div>`
      : '';
  const localized = localize(d, lang);
  const steps = parseSteps(d.steps, d.categories.length).filter((st) => st.cats.some((ci) => localized[ci]?.items.length));
  const wizard = steps.length
    ? `<div id="wiz" hidden role="dialog" aria-modal="true" aria-label="${esc(wl.open)}">
<div class="wh"><button type="button" class="wx" id="wx" aria-label="${esc(wl.close)}">×</button><p class="wpr" id="wpr"></p><h3 id="wtt"></h3><div class="wdots" id="wdots"></div></div>
<div class="wb" id="wb">${steps
        .map((st, si) => {
          const drinkKind = st.kind === 'soft' || st.kind === 'alc';
          const firstDrink = steps.findIndex((x) => x.kind === 'soft' || x.kind === 'alc');
          const pick =
            si === firstDrink && steps.some((x) => x.kind === 'soft') && steps.some((x) => x.kind === 'alc')
              ? `<div class="wstep" data-k="pick" data-t="${esc(wl.pick)}" hidden>${(['soft', 'alc'] as const)
                  .map((k) => `<button type="button" class="wchoice" data-go="${k}">${esc(wl[k])}${lang !== 'de' ? `<small lang="de" dir="ltr">${esc(wlDe[k])}</small>` : ''}</button>`)
                  .join('')}</div>`
              : '';
          return `${pick}<div class="wstep" data-k="${st.kind}" data-t="${esc(wl[st.kind])}" data-td="${esc(wlDe[st.kind])}" hidden>${st.cats
            .filter((ci) => localized[ci]?.items.length)
            .map((ci) => {
              const c = localized[ci]!;
              const o = d.categories[ci]!;
              return `<details class="wcat${isClosed(o) ? ' closed' : ''}"${inHours(o)}><summary>${catImg(c, 'wci')}<h4>${esc(c.title)}</h4><span class="wsel" hidden></span></summary>${c.items
                .map((it, j) => {
                  const oi = o.items[j]!;
                  const photo = httpsUrl(it.img);
                  return `<div class="wi${photo ? ' has-img' : ''}" data-n="${esc(oi.name)}" data-tn="${esc(it.name)}" data-num="${esc(oi.num ?? '')}" data-c="${priceCents(oi.price) ?? ''}" data-p="${esc(oi.price ?? '')}">${photo ? `<div class="wph"><img src="${esc(photo)}" alt="" loading="lazy" decoding="async" /></div>` : ''}<div class="wt"><span class="wn">${oi.num ? `<span class="num">${esc(oi.num)}</span>` : ''}${esc(it.name)}</span>${(drinkKind || st.kind === 'drinks') && it.name !== oi.name ? `<span class="wd" lang="${menu.lang}" dir="ltr">${esc(oi.name)}</span>` : ''}${it.desc ? `<span class="wd">${esc(it.desc)}</span>` : ''}</div>${oi.price ? `<span class="wp">${esc(priceText(oi.price))}</span>` : ''}<div class="wq"><button type="button" class="wm" aria-label="${esc(`${wl.remove}: ${it.name}`)}">−</button><output>0</output><button type="button" class="wa" aria-label="${esc(`${wl.add}: ${it.name}`)}">+</button></div></div>`;
                })
                .join('')}</details>`;
            })
            .join('')}<p class="whint">${esc(wl.hint)}</p></div>`;
        })
        .join('')}<div class="wstep wsum" data-k="sum" data-t="${esc(wl.summary)}" hidden>${lang !== 'de' ? `<p class="wsub" lang="de" dir="ltr">${esc(wlDe.summary)}</p>` : ''}<div id="wlist"></div><p class="wtot" id="wtot" hidden></p><p class="wshow" id="wshow">${esc(wl.show)}</p>${lang !== 'de' ? `<p class="wshow" id="wshowde" lang="de" dir="ltr">${esc(wlDe.show)}</p>` : ''}${
        ordering
          ? `<textarea id="wnote" rows="2" maxlength="300" placeholder="${esc(ol.note)}"></textarea><button type="button" id="wsend">${esc(ol.send)} · ${esc(ol.table)} ${esc(opts.table!.label)}</button><p id="wmsg" role="status"></p>`
          : ''
      }${social}<button type="button" class="wre" id="wre">${esc(wl.restart)}</button></div></div>
<div class="wf"><button type="button" class="wbk" id="wback">${esc(wl.back)}</button><button type="button" class="wnx" id="wnext">${esc(wl.next)}</button></div>
</div>
<script type="application/json" id="wc">${JSON.stringify({
        k: `wiz:${menu.slug}`,
        l: { step: wl.step, next: wl.next, summary: wl.summary, empty: wl.empty, total: wl.total },
        o: ordering ? { slug: menu.slug, t: opts.table!.token, sent: ol.sent, fail: ol.fail, wait: ol.wait } : null,
      }).replace(/</g, '\\u003c')}</script>
<script>${WIZ_SCRIPT}</script>`
    : '';

  const actions: string[] = [];
  const tel = d.phone ? telHref(d.phone) : null;
  if (tel) actions.push(`<a class="btn ghost" href="tel:${esc(tel)}">${esc(l.call)} · <bdi dir="ltr">${esc(d.phone)}</bdi></a>`);
  const mail = mailAddress(d.email);
  if (mail) actions.push(`<a class="btn ghost" href="mailto:${esc(mail)}">${esc(l.mail)}</a>`);
  if (d.address) actions.push(`<a class="btn ghost" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(d.address)}" rel="noopener">${esc(l.map)} · <bdi dir="ltr">${esc(d.address)}</bdi></a>`);

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
<html lang="${lang}"${lang === 'ar' || lang === 'fa' ? ' dir="rtl"' : ''}><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<meta name="referrer" content="no-referrer" />
<title>${esc(d.name)}${d.tagline ? ` · ${esc(d.tagline)}` : ''}</title>
<style>:root{--accent:${t.accent};--on:${t.onAccent};--panel:${t.panel};--ink:${t.ink};--dim:${t.dim};--accent2:${t.accent2}}${styles(t)}${ORDER_STYLES}${wizard ? wizStyles(t) : ''}</style>
</head><body${ordering ? ' class="ordering"' : ''}>
<main class="menu">
<header class="hero">
${logo ? `<img class="logo" src="${esc(logo)}" alt="" />` : ''}
<h1>${esc(d.name)}</h1>
${d.tagline ? `<p class="tagline">${esc(d.tagline)}</p>` : ''}
<div class="orn" aria-hidden="true"><i>✦</i></div>
${d.address ? `<p class="where"><bdi dir="ltr">${esc(d.address)}</bdi></p>` : ''}
${offered.length > 1 ? `<nav class="langs" aria-label="Language">${offered.map((x) => `<a href="?l=${x}${keep}" hreflang="${x}"${x === lang ? ' aria-current="true"' : ''}>${esc(LANG_NAMES[x])}</a>`).join('')}</nav>` : ''}
${ordering ? `<p class="table-tag">${esc(ol.table)} ${esc(opts.table!.label)}</p>` : ''}
</header>
${menu.preview ? `<p class="preview" role="status">${esc(l.preview)}</p>` : ''}
${wizard || social ? `<div class="cta">${wizard ? `<button type="button" class="btn" id="wopen" hidden>${esc(wl.open)}</button>` : ''}${social}</div>` : ''}
${cats.length > 1 ? `<nav class="nav" aria-label="${esc(d.tagline ?? d.name)}">${cats.map(({ c, orig }, i) => `<a href="#${anchor(i)}"${isClosed(orig) ? ' class="closed"' : ''}${inHours(orig)}>${esc(c.title)}</a>`).join('')}</nav>` : ''}
${filtersUi}
${cats.length ? body : `<p class="empty">${esc(l.empty)}</p>`}
${d.footnote ? `<p class="foot-note">${esc(d.footnote)}</p>` : ''}
${actions.length ? `<div class="actions">${actions.join('')}</div>` : ''}
<p class="foot">${credits ? `<a href="${esc(credits)}" rel="noopener">${esc(l.credits)}</a> · ` : ''}${site ? `<a href="${esc(site)}" rel="noopener">${esc(site.replace(/^https:\/\//, ''))}</a>` : 'Breisgau Digital'}</p>
</main>
${orderUi}
${wizard}
${cats.length > 1 ? `<script>${NAV_SCRIPT}</script>` : ''}
${cats.some(({ orig }) => orig.hours) ? `<script>${HOURS_SCRIPT}</script>` : ''}
${fold ? `<script>${FOLD_SCRIPT}</script>` : ''}
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
