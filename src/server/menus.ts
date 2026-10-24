import { randomBytes } from 'node:crypto';
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
  /** Foto des Gerichts, https. */
  img?: string;
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
  /** Übersetzungen im Textformat von `parseMenuText`, je Sprache; gleiche Reihenfolge wie das Original. */
  translations?: Partial<Record<CardLang, string>>;
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
      items.push({ name: itemName, price: text(it['price'], 60), desc: text(it['desc'], 400), img: httpsUrl(it['img']) ?? undefined });
    }
    categories.push({ title, note: text(cat['note'], 300), items });
  }

  const translations: Partial<Record<CardLang, string>> = {};
  const rawTr = (d['translations'] && typeof d['translations'] === 'object' ? d['translations'] : {}) as Record<string, unknown>;
  for (const l of CARD_LANGS) {
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
    translations: Object.keys(translations).length ? translations : undefined,
    categories,
  };
}

/**
 * Die Karte in einer Übersetzung: Rubrik- und Gerichtstexte kommen aus der
 * Übersetzung, Preise und Fotos immer vom Original — ein Tippfehler im
 * Türkischen darf keinen Preis verändern. Fehlt eine Zeile, bleibt das Original.
 */
export function localize(data: MenuData, lang: CardLang): MenuCategory[] {
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
export function menuLangs(menu: Menu): CardLang[] {
  return CARD_LANGS.filter((l) => l === menu.lang || !!menu.data.translations?.[l]);
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
 * Name | Preis | Beschreibung | https://…/foto.jpg (Foto zuletzt, optional).
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
    const [name, price, ...desc] = parts;
    if (name) cat.items.push({ name, price: price || undefined, desc: desc.join(' | ') || undefined, ...(img ? { img } : {}) });
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
          (i.img ? [i.name, i.price ?? '', i.desc ?? '', i.img] : [i.name, i.price ?? '', i.desc ?? ''])
            .join(' | ')
            .replace(/( \| )+$/, ''),
        ),
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
.dish{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;border-radius:14px;margin:0 0 10px;background:rgba(147,161,179,.2)}
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

const LANG_NAMES: Record<CardLang, string> = { de: 'Deutsch', en: 'English', tr: 'Türkçe', fr: 'Français', ku: 'Kurdî' };

/** Texte der Bestell-Oberfläche. Sie werden auch im Browser gebraucht und deshalb als JSON eingebettet. */
const ORDER_LABELS: Record<CardLang, { add: string; cart: string; table: string; note: string; send: string; sent: string; fail: string; wait: string; total: string; pay: string; close: string; remove: string }> = {
  de: { add: 'Hinzufügen', cart: 'Ihre Bestellung', table: 'Tisch', note: 'Hinweis für die Küche (optional)', send: 'Verbindlich bestellen', sent: 'Danke! Ihre Bestellung ist angekommen.', fail: 'Das hat nicht geklappt. Bitte sprechen Sie das Personal an.', wait: 'Bitte einen Moment warten, bevor Sie erneut bestellen.', total: 'Summe', pay: 'Bezahlt wird wie gewohnt beim Service.', close: 'Schließen', remove: 'Entfernen' },
  en: { add: 'Add', cart: 'Your order', table: 'Table', note: 'Note for the kitchen (optional)', send: 'Place order', sent: 'Thank you! Your order has been received.', fail: 'That did not work. Please ask the staff.', wait: 'Please wait a moment before ordering again.', total: 'Total', pay: 'You pay at the table as usual.', close: 'Close', remove: 'Remove' },
  tr: { add: 'Ekle', cart: 'Siparişiniz', table: 'Masa', note: 'Mutfak için not (isteğe bağlı)', send: 'Siparişi ver', sent: 'Teşekkürler! Siparişiniz alındı.', fail: 'Olmadı. Lütfen personele söyleyin.', wait: 'Tekrar sipariş vermeden önce lütfen biraz bekleyin.', total: 'Toplam', pay: 'Ödeme her zamanki gibi serviste yapılır.', close: 'Kapat', remove: 'Kaldır' },
  fr: { add: 'Ajouter', cart: 'Votre commande', table: 'Table', note: 'Remarque pour la cuisine (facultatif)', send: 'Commander', sent: 'Merci ! Votre commande a bien été reçue.', fail: 'Cela n’a pas fonctionné. Veuillez vous adresser au personnel.', wait: 'Veuillez patienter un instant avant de recommander.', total: 'Total', pay: 'Le paiement se fait comme d’habitude au service.', close: 'Fermer', remove: 'Retirer' },
  ku: { add: 'Zêde bike', cart: 'Fermana we', table: 'Mase', note: 'Têbînî ji bo mitbaxê (bi dilê xwe)', send: 'Ferman bide', sent: 'Spas! Fermana we hat.', fail: 'Nebû. Ji kerema xwe ji karmendan re bêje.', wait: 'Ji kerema xwe berî fermana nû hinekî bisekine.', total: 'Giştî', pay: 'Drav wekî her car li ser mase tê dayîn.', close: 'Bigire', remove: 'Rake' },
};

const ORDER_STYLES = `
.add{flex:0 0 auto;margin-left:10px;border:1px solid var(--accent);background:transparent;color:var(--accent);border-radius:999px;padding:5px 14px;font:inherit;font-size:.82rem;font-weight:600;cursor:pointer}
.add:active{opacity:.7}
.langs{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin:0 0 14px}
.langs a{padding:4px 11px;border-radius:999px;border:1px solid transparent;color:var(--dim);text-decoration:none;font-size:.8rem}
.langs a[aria-current]{border-color:var(--accent);color:var(--accent);font-weight:600}
.table-tag{margin:0 0 12px;text-align:center;font-size:.85rem;font-weight:600;color:var(--accent)}
#bar{position:fixed;left:0;right:0;bottom:0;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:var(--panel);box-shadow:0 -6px 20px rgba(14,26,43,.16);display:flex;justify-content:center}
#bar[hidden],#sheet[hidden]{display:none}
#barbtn,#send{width:100%;max-width:520px;border:0;border-radius:999px;padding:14px 18px;background:var(--accent);color:var(--on);font:inherit;font-weight:600;cursor:pointer}
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

export interface RenderOptions {
  /** Gewünschte Anzeigesprache (?l=). Gilt nur, wenn die Karte sie anbietet. */
  lang?: string;
  /** Gültiges Tischkürzel: nur dann erscheint die Bestell-Oberfläche. */
  table?: { label: string; token: string };
}

export function renderMenu(menu: Menu, base = config.siteUrl || '', opts: RenderOptions = {}): string {
  const t = THEMES[menu.theme] ?? THEMES.warm;
  const offered = menuLangs(menu);
  const fallback: CardLang = CARD_LANGS.includes(menu.lang) ? menu.lang : 'de';
  const wanted = opts.lang as CardLang;
  const lang: CardLang = offered.includes(wanted) ? wanted : fallback;
  const l = LABELS[lang];
  const d = menu.data;
  const site = base.replace(/\/+$/, '');
  const cats = localize(d, lang)
    .map((c, i) => ({ c, orig: d.categories[i]! }))
    .filter((x) => x.c.items.length);
  const ordering = !!opts.table && !menu.preview;
  const keep = ordering ? `&amp;t=${encodeURIComponent(opts.table!.token)}` : '';
  const ol = ORDER_LABELS[lang];

  const body = cats
    .map(
      ({ c, orig }, i) => `<section><h2 id="${anchor(i)}">${esc(c.title)}</h2>${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}<ul>${c.items
        .map((it, j) => {
          const o = orig.items[j]!;
          const add = ordering
            ? `<button type="button" class="add" data-n="${esc(o.name)}" data-c="${priceCents(o.price) ?? ''}">${esc(ol.add)}</button>`
            : '';
          return `<li>${httpsUrl(it.img) ? `<img class="dish" src="${esc(httpsUrl(it.img))}" alt="${esc(it.name)}" loading="lazy" />` : ''}<div class="row"><span class="name">${esc(it.name)}</span>${it.price ? `<span class="price">${esc(it.price)}</span>` : ''}${add}</div>${it.desc ? `<p class="desc">${esc(it.desc)}</p>` : ''}</li>`;
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
<html lang="${lang}"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex,nofollow" />
<meta name="referrer" content="no-referrer" />
<title>${esc(d.name)}${d.tagline ? ` · ${esc(d.tagline)}` : ''}</title>
<style>:root{--accent:${t.accent};--on:${t.onAccent};--panel:${t.panel};--ink:${t.ink};--dim:${t.dim}}${styles(t)}${ORDER_STYLES}</style>
</head><body${ordering ? ' class="ordering"' : ''}>
<main class="menu">
${menu.preview ? `<p class="preview" role="status">${esc(l.preview)}</p>` : ''}
${logo ? `<img class="logo" src="${esc(logo)}" alt="" />` : ''}
<h1>${esc(d.name)}</h1>
${d.tagline ? `<p class="tagline">${esc(d.tagline)}</p>` : ''}
${offered.length > 1 ? `<nav class="langs" aria-label="Language">${offered.map((x) => `<a href="?l=${x}${keep}" hreflang="${x}"${x === lang ? ' aria-current="true"' : ''}>${esc(LANG_NAMES[x])}</a>`).join('')}</nav>` : ''}
${ordering ? `<p class="table-tag">${esc(ol.table)} ${esc(opts.table!.label)}</p>` : ''}
${cats.length > 1 ? `<nav class="nav" aria-label="${esc(d.tagline ?? d.name)}">${cats.map(({ c }, i) => `<a href="#${anchor(i)}">${esc(c.title)}</a>`).join('')}</nav>` : ''}
${cats.length ? body : `<p class="empty">${esc(l.empty)}</p>`}
${d.footnote ? `<p class="foot-note">${esc(d.footnote)}</p>` : ''}
${actions.length ? `<div class="actions">${actions.join('')}</div>` : ''}
<p class="foot">${site ? `<a href="${esc(site)}" rel="noopener">${esc(site.replace(/^https:\/\//, ''))}</a>` : 'Breisgau Digital'}</p>
</main>
${orderUi}
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
          { name: 'Tomatencremesuppe', price: '5,50', desc: 'mit Basilikum und Croutons', img: img('suppe') },
          { name: 'Gemischter Blattsalat', price: '6,90', desc: 'Hausdressing, geröstete Kerne' },
        ],
      },
      {
        title: 'Hauptgerichte',
        note: 'Vegetarische Gerichte sind gekennzeichnet.',
        items: [
          { name: 'Käsespätzle', price: '12,90', desc: 'mit Röstzwiebeln und Salat (vegetarisch)', img: img('spaetzle') },
          { name: 'Schäufele', price: '16,90', desc: 'mit Kartoffelsalat und Sauerkraut', img: img('schaeufele') },
          { name: 'Gemüsepfanne', price: '11,50', desc: 'saisonales Gemüse, Kräuterquark (vegetarisch)' },
        ],
      },
      { title: 'Dessert', items: [{ name: 'Schwarzwälder Kirsch', price: '5,90', desc: 'Stück vom Blech, mit Sahne', img: img('dessert') }] },
      {
        title: 'Getränke',
        items: [
          { name: 'Hauswein, weiß oder rot', price: '0,2 l 4,80', img: img('wein') },
          { name: 'Mineralwasser', price: '0,75 l 4,20' },
          { name: 'Apfelschorle', price: '0,3 l 3,40' },
        ],
      },
    ],
  })!;
  return { slug: DEMO_SLUG, lang: 'de', theme: 'warm', preview: false, data };
}
