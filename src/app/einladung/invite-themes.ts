import { EventKind, InviteLang, MusicId, ThemeId } from './invite.model';

/**
 * Die zehn Gestaltungen der Einladungsseiten.
 *
 * Eine Gestaltung ist nur Farbe, Schrift, Ornament und Titelbild — der Aufbau
 * der Seite ist überall derselbe. Darum lässt sich die Gestaltung jederzeit
 * wechseln, ohne dass ein Inhalt verloren geht. Die Farben landen als
 * CSS-Variablen auf der Seite (siehe `themeVars`).
 *
 * Fotos: Pexels-Lizenz (frei, auch kommerziell, ohne Namensnennung). Lädt ein
 * Foto nicht, trägt die Seite das Ornament allein — sie ist so gebaut, dass
 * sie ohne Bild nicht leer wirkt.
 */

export type Ornament =
  | 'flourish'
  | 'leaves'
  | 'line'
  | 'tulip'
  | 'star'
  | 'blossom'
  | 'twine'
  | 'waves'
  | 'deco'
  | 'grid';

export interface InviteTheme {
  id: ThemeId;
  name: Record<InviteLang, string>;
  /** Ein Satz für die Übersicht: wofür passt die Gestaltung. */
  mood: Record<InviteLang, string>;
  /** Art des Beispiel-Events in der Vorschau. */
  demoKind: EventKind;
  music: MusicId;
  ornament: Ornament;
  dark: boolean;
  image: string;
  /** Pexels-Seite des Fotos (Nachweis, siehe CREDITS.md). */
  imageSource: string;
  colors: {
    bg: string;
    bg2: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    /** Akzent, der als Schrift auf `bg` mindestens 4,5:1 erreicht. */
    accentText: string;
    accent2: string;
    onAccent: string;
    line: string;
  };
  fonts: { display: string; script: string; body: string };
  /** Überschriften in Versalien mit Sperrung (Cinzel, Minimal, Business). */
  caps: boolean;
}

const pexels = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const SERIF = '"Cormorant Garamond", "Cormorant", Georgia, serif';
const SCRIPT = '"Great Vibes", "Snell Roundhand", cursive';
const CINZEL = '"Cinzel", "Trajan Pro", Georgia, serif';
const AMIRI = '"Amiri", "Noto Naskh Arabic", Georgia, serif';
const FRAUNCES = '"Fraunces Variable", "Fraunces", Georgia, serif';
const SANS = '"Inter Variable", "Inter", -apple-system, "Segoe UI", sans-serif';

export const INVITE_THEMES: InviteTheme[] = [
  {
    id: 'klassik',
    name: { de: 'Klassik Gold', tr: 'Klasik Altın', en: 'Classic Gold', fr: 'Classique or', ku: 'Klasîk Zêr', ar: 'كلاسيك ذهبي' },
    mood: {
      de: 'Elfenbein und Gold, geschwungene Schrift — zeitlos für die große Hochzeit.',
      tr: 'Fildişi ve altın, zarif el yazısı — büyük düğün için zamansız.',
      en: 'Ivory and gold with flowing script — timeless for the big wedding.',
      fr: 'Ivoire et or, écriture calligraphiée — intemporel pour le grand mariage.',
      ku: 'Fîl û zêr, nivîsa xweşik — ji bo dawetên mezin bêdem.',
      ar: 'عاجي وذهبي بخط منساب — أناقة خالدة لحفل الزفاف الكبير.',
    },
    demoKind: 'wedding',
    music: 'piano',
    ornament: 'flourish',
    dark: false,
    image: pexels(51305),
    imageSource: 'https://www.pexels.com/photo/wedding-couple-holding-hands-51305/',
    colors: {
      bg: '#fbf8f2', bg2: '#f3ede1', surface: '#fffdf8', ink: '#2e2a24', muted: '#685f52',
      accent: '#b08d57', accentText: '#7a5c2c', accent2: '#8a6d3b', onAccent: '#ffffff', line: 'rgba(176,141,87,.35)',
    },
    fonts: { display: SERIF, script: SCRIPT, body: SANS },
    caps: false,
  },
  {
    id: 'garten',
    name: { de: 'Boho Garten', tr: 'Bohem Bahçe', en: 'Boho Garden', fr: 'Jardin bohème', ku: 'Baxçeya Bohem', ar: 'حديقة بوهيمية' },
    mood: {
      de: 'Salbeigrün und Terrakotta, Blätter am Rand — für Verlobung und Gartenfeste.',
      tr: 'Adaçayı yeşili ve kiremit, yapraklı süslemeler — nişan ve bahçe partileri için.',
      en: 'Sage and terracotta with leafy borders — for engagements and garden parties.',
      fr: 'Vert sauge et terre cuite, feuillages — pour fiançailles et fêtes au jardin.',
      ku: 'Kesk û terakota, bi pelan — ji bo nîşan û şahiyên baxçe.',
      ar: 'أخضر المريمية والطين المحروق مع أوراق الشجر — للخطوبة وحفلات الحدائق.',
    },
    demoKind: 'engagement',
    music: 'guitar',
    ornament: 'leaves',
    dark: false,
    image: pexels(11433914),
    imageSource: 'https://www.pexels.com/photo/chairs-and-arch-outdoors-for-wedding-ceremony-11433914/',
    colors: {
      bg: '#f5f3ec', bg2: '#e8ebdf', surface: '#fffefa', ink: '#2f3a2c', muted: '#5d6756',
      accent: '#7d8f69', accentText: '#4f6140', accent2: '#c0714f', onAccent: '#ffffff', line: 'rgba(125,143,105,.35)',
    },
    fonts: { display: SERIF, script: SCRIPT, body: SANS },
    caps: false,
  },
  {
    id: 'minimal',
    name: { de: 'Modern Minimal', tr: 'Modern Minimal', en: 'Modern Minimal', fr: 'Minimal moderne', ku: 'Minimal a Nûjen', ar: 'بسيط عصري' },
    mood: {
      de: 'Schwarz auf Weiß, viel Luft, klare Linien — für Standesamt und Stadt-Hochzeit.',
      tr: 'Beyaz üzerine siyah, sade çizgiler — nikâh ve şehir düğünü için.',
      en: 'Black on white, lots of air, clean lines — for city halls and urban weddings.',
      fr: 'Noir sur blanc, épuré — pour la mairie et le mariage citadin.',
      ku: 'Reş li ser spî, xetên zelal — ji bo mehra fermî û dawetên bajêr.',
      ar: 'أسود على أبيض وخطوط نظيفة — لعقد القران وحفلات المدينة.',
    },
    demoKind: 'wedding',
    music: 'ambient',
    ornament: 'line',
    dark: false,
    image: pexels(11309259),
    imageSource: 'https://www.pexels.com/photo/wedding-rings-by-a-flower-bouquet-11309259/',
    colors: {
      bg: '#ffffff', bg2: '#f3f3f1', surface: '#ffffff', ink: '#141414', muted: '#5c5c5c',
      accent: '#141414', accentText: '#141414', accent2: '#8a8a8a', onAccent: '#ffffff', line: 'rgba(20,20,20,.16)',
    },
    fonts: { display: SERIF, script: SERIF, body: SANS },
    caps: true,
  },
  {
    id: 'kina',
    name: { de: 'Henna-Nacht', tr: 'Kına Gecesi', en: 'Henna Night', fr: 'Nuit du henné', ku: 'Şeva Hineyê', ar: 'ليلة الحناء' },
    mood: {
      de: 'Tiefes Rot und Gold mit Tulpen-Ornament — für Kına, Henna und Mehndi.',
      tr: 'Lale motifli koyu kırmızı ve altın — kına gecesi, kına ve mehndi için.',
      en: 'Deep red and gold with tulip ornaments — for kına, henna and mehndi nights.',
      fr: 'Rouge profond et or, motifs de tulipes — pour nuits du henné et mehndi.',
      ku: 'Sor û zêr bi nexşê lalê — ji bo şeva hineyê.',
      ar: 'أحمر عميق وذهبي بزخارف التوليب — لليلة الحناء.',
    },
    demoKind: 'henna',
    music: 'oud',
    ornament: 'tulip',
    dark: true,
    image: pexels(16814609),
    imageSource: 'https://www.pexels.com/photo/a-bride-and-groom-are-holding-hands-with-henna-16814609/',
    colors: {
      bg: '#3a0c11', bg2: '#4a1217', surface: '#55191f', ink: '#f8ead5', muted: '#e0c4a0',
      accent: '#d9a84e', accentText: '#e6bd6c', accent2: '#c52a35', onAccent: '#2a0709', line: 'rgba(217,168,78,.35)',
    },
    fonts: { display: CINZEL, script: SCRIPT, body: SANS },
    caps: true,
  },
  {
    id: 'orient',
    name: { de: '1001 Nacht', tr: 'Binbir Gece', en: '1001 Nights', fr: 'Mille et une nuits', ku: '1001 Şev', ar: 'ألف ليلة وليلة' },
    mood: {
      de: 'Smaragd und Gold, Sternornamente, auch auf Arabisch von rechts nach links.',
      tr: 'Zümrüt ve altın, yıldız motifleri; Arapça sağdan sola da hazır.',
      en: 'Emerald and gold with star patterns — ready for Arabic, right to left.',
      fr: 'Émeraude et or, étoiles orientales — prêt pour l’arabe, de droite à gauche.',
      ku: 'Zimrût û zêr, nexşên stêrkan — bi Erebî ji rastê ber bi çepê.',
      ar: 'زمرد وذهب ونجوم شرقية — جاهز للعربية من اليمين إلى اليسار.',
    },
    demoKind: 'wedding',
    music: 'oud',
    ornament: 'star',
    dark: true,
    image: pexels(18662849),
    imageSource: 'https://www.pexels.com/photo/bride-hands-decorated-with-henna-tattoos-and-jewelry-18662849/',
    colors: {
      bg: '#0e2828', bg2: '#123232', surface: '#173d3d', ink: '#f4ecd8', muted: '#cbbd94',
      accent: '#d8b25a', accentText: '#e2c070', accent2: '#4a9c8c', onAccent: '#0e2020', line: 'rgba(216,178,90,.32)',
    },
    fonts: { display: AMIRI, script: SCRIPT, body: SANS },
    caps: false,
  },
  {
    id: 'rosa',
    name: { de: 'Romantik Rosé', tr: 'Romantik Pembe', en: 'Romantic Blush', fr: 'Romance rosée', ku: 'Romantîk Pembe', ar: 'وردي رومانسي' },
    mood: {
      de: 'Zartes Rosé und Blüten — verspielt und romantisch.',
      tr: 'Pudra pembesi ve çiçekler — romantik ve zarif.',
      en: 'Soft blush and blossoms — playful and romantic.',
      fr: 'Rose poudré et fleurs — tendre et romantique.',
      ku: 'Pembeya nazik û kulîlk — romantîk.',
      ar: 'وردي ناعم وزهور — رومانسي ورقيق.',
    },
    demoKind: 'wedding',
    music: 'strings',
    ornament: 'blossom',
    dark: false,
    image: pexels(9967319),
    imageSource: 'https://www.pexels.com/photo/close-up-on-wedding-ring-among-decorations-and-flowers-9967319/',
    colors: {
      bg: '#fdf6f5', bg2: '#f8e7e5', surface: '#ffffff', ink: '#4a2c33', muted: '#7f5d65',
      accent: '#c9848f', accentText: '#9a4e5c', accent2: '#a35d6a', onAccent: '#ffffff', line: 'rgba(201,132,143,.38)',
    },
    fonts: { display: SERIF, script: SCRIPT, body: SANS },
    caps: false,
  },
  {
    id: 'rustikal',
    name: { de: 'Rustikal', tr: 'Rustik', en: 'Rustic Barn', fr: 'Champêtre', ku: 'Gundî', ar: 'ريفي' },
    mood: {
      de: 'Holz, Kraftpapier und Jute — für Scheune, Hofgut und Weinberg.',
      tr: 'Ahşap, kraft kâğıt ve jüt — çiftlik, bağ ve kır düğünü için.',
      en: 'Wood, kraft paper and twine — for barns, farms and vineyards.',
      fr: 'Bois, papier kraft et ficelle — pour granges, domaines et vignobles.',
      ku: 'Dar, kaxeza kraft û ben — ji bo gund û rez.',
      ar: 'خشب وورق كرافت وخيوط الجوت — للمزارع وكروم العنب.',
    },
    demoKind: 'wedding',
    music: 'guitar',
    ornament: 'twine',
    dark: false,
    image: pexels(5589847),
    imageSource: 'https://www.pexels.com/photo/triangle-wedding-arch-decorated-with-flowers-5589847/',
    colors: {
      bg: '#f3ebe0', bg2: '#e6dac8', surface: '#fbf6ee', ink: '#3b2f25', muted: '#6c5c4a',
      accent: '#8b5e3c', accentText: '#7a4f2f', accent2: '#5f6f52', onAccent: '#ffffff', line: 'rgba(139,94,60,.32)',
    },
    fonts: { display: FRAUNCES, script: SCRIPT, body: SANS },
    caps: false,
  },
  {
    id: 'mediterran',
    name: { de: 'Mediterran', tr: 'Akdeniz', en: 'Mediterranean', fr: 'Méditerranée', ku: 'Deryaya Navîn', ar: 'متوسطي' },
    mood: {
      de: 'Ägäisblau, Weiß und Zitronengelb — Sommer, Meer und lange Tafeln.',
      tr: 'Ege mavisi, beyaz ve limon sarısı — yaz, deniz ve uzun sofralar.',
      en: 'Aegean blue, white and lemon — summer, sea and long tables.',
      fr: 'Bleu égéen, blanc et citron — l’été, la mer, les longues tablées.',
      ku: 'Şîna Egeyê, spî û zer — havîn û derya.',
      ar: 'أزرق إيجي وأبيض وأصفر ليموني — صيف وبحر وموائد طويلة.',
    },
    demoKind: 'wedding',
    music: 'lounge',
    ornament: 'waves',
    dark: false,
    image: pexels(2306281),
    imageSource: 'https://www.pexels.com/photo/tables-with-flower-decors-2306281/',
    colors: {
      bg: '#f7f9fb', bg2: '#e6eef5', surface: '#ffffff', ink: '#1d3349', muted: '#4f6378',
      accent: '#2f5d8a', accentText: '#2f5d8a', accent2: '#d9a441', onAccent: '#ffffff', line: 'rgba(47,93,138,.25)',
    },
    fonts: { display: SERIF, script: SCRIPT, body: SANS },
    caps: false,
  },
  {
    id: 'mitternacht',
    name: { de: 'Mitternacht Gala', tr: 'Gece Yarısı Gala', en: 'Midnight Gala', fr: 'Gala de minuit', ku: 'Gala Nîvê Şevê', ar: 'حفل منتصف الليل' },
    mood: {
      de: 'Nachtblau und Gold im Art-déco-Stil — für Geburtstag, Jubiläum und Gala.',
      tr: 'Art deco tarzında lacivert ve altın — doğum günü, yıl dönümü ve gala için.',
      en: 'Midnight blue and gold, art deco — for birthdays, anniversaries and galas.',
      fr: 'Bleu nuit et or, art déco — pour anniversaires, jubilés et galas.',
      ku: 'Şîna şevê û zêr — ji bo rojbûn û galayan.',
      ar: 'أزرق ليلي وذهبي بطراز آرت ديكو — لأعياد الميلاد والحفلات.',
    },
    demoKind: 'birthday',
    music: 'lounge',
    ornament: 'deco',
    dark: true,
    image: pexels(450301),
    imageSource: 'https://www.pexels.com/photo/person-holding-lighted-sparkler-450301/',
    colors: {
      bg: '#0d1326', bg2: '#121a33', surface: '#18213f', ink: '#f1ecdf', muted: '#bdb6a3',
      accent: '#d6b46a', accentText: '#e0c07a', accent2: '#8ea4d2', onAccent: '#0d1326', line: 'rgba(214,180,106,.32)',
    },
    fonts: { display: CINZEL, script: SCRIPT, body: SANS },
    caps: true,
  },
  {
    id: 'business',
    name: { de: 'Business Event', tr: 'Kurumsal Etkinlik', en: 'Business Event', fr: 'Événement pro', ku: 'Bûyera Karsaziyê', ar: 'فعالية أعمال' },
    mood: {
      de: 'Sachlich und klar — für Firmenfeier, Konferenz, Toplantı und Eröffnung.',
      tr: 'Sade ve net — şirket etkinliği, konferans, toplantı ve açılış için.',
      en: 'Clean and clear — for company parties, conferences, meetings and openings.',
      fr: 'Sobre et clair — pour fêtes d’entreprise, conférences et inaugurations.',
      ku: 'Zelal û sade — ji bo civîn, konferans û vekirinê.',
      ar: 'واضح وأنيق — لحفلات الشركات والمؤتمرات والاجتماعات والافتتاح.',
    },
    demoKind: 'corporate',
    music: 'none',
    ornament: 'grid',
    dark: false,
    image: pexels(207716),
    imageSource: 'https://www.pexels.com/photo/audience-business-conference-education-207716/',
    colors: {
      bg: '#f6f8fb', bg2: '#e9eef5', surface: '#ffffff', ink: '#0e1a2b', muted: '#4b5b70',
      accent: '#0f766e', accentText: '#0f6b64', accent2: '#1a4b8c', onAccent: '#ffffff', line: 'rgba(14,26,43,.14)',
    },
    fonts: { display: FRAUNCES, script: FRAUNCES, body: SANS },
    caps: false,
  },
];

export const THEME_IDS = INVITE_THEMES.map((t) => t.id);

export function inviteTheme(id: string | null | undefined): InviteTheme {
  return INVITE_THEMES.find((t) => t.id === id) ?? INVITE_THEMES[0];
}

/** CSS-Variablen für `[style]` der Seite. */
export function themeVars(t: InviteTheme): Record<string, string> {
  const c = t.colors;
  return {
    '--iv-bg': c.bg,
    '--iv-bg2': c.bg2,
    '--iv-surface': c.surface,
    '--iv-ink': c.ink,
    '--iv-muted': c.muted,
    '--iv-accent': c.accent,
    '--iv-accent-text': c.accentText,
    '--iv-accent2': c.accent2,
    '--iv-on-accent': c.onAccent,
    '--iv-line': c.line,
    '--iv-f-display': t.fonts.display,
    '--iv-f-script': t.fonts.script,
    '--iv-f-body': t.fonts.body,
  };
}
