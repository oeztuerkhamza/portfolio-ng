import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import qrcode from 'qrcode-generator';
import { AdminApi, errorText } from '../admin-api.service';
import { dateTime } from '../labels';
import type { Customer } from './customers.tab';

/** Muss zu MENU_THEMES in src/server/menus.ts passen. */
type Theme = 'brand' | 'dark' | 'warm' | 'orient';
type Lang = 'de' | 'fr' | 'en' | 'tr' | 'ku' | 'ar' | 'ru';

const THEMES: { id: Theme; label: string }[] = [
  { id: 'warm', label: 'Sıcak' },
  { id: 'brand', label: 'Açık (marka)' },
  { id: 'dark', label: 'Koyu' },
  { id: 'orient', label: 'Oryantal (zümrüt ve altın)' },
];

/** Muss zu MENU_LANGS in src/server/menus.ts passen. */
const LANGS: { id: Lang; label: string }[] = [
  { id: 'de', label: 'Almanca' },
  { id: 'en', label: 'İngilizce' },
  { id: 'fr', label: 'Fransızca' },
  { id: 'tr', label: 'Türkçe' },
  { id: 'ar', label: 'Arapça' },
  { id: 'ru', label: 'Rusça' },
  { id: 'ku', label: 'Kürtçe' },
];

const EXAMPLE = `# Vorspeisen | Hinweis zur Rubrik (isteğe bağlı)
Tomatensuppe | 6,50 | mit Basilikum
Bruschetta | 7,00

# Hauptgerichte
Schnitzel | 16,90 | mit Pommes und Salat`;

interface Table {
  id: string;
  label: string;
  token: string;
}

interface OrderLine {
  name: string;
  price?: string;
  qty: number;
}

interface Order {
  id: string;
  created_at: string;
  table_label: string;
  items: OrderLine[];
  total_cents: number | null;
  note: string | null;
  status: 'new' | 'accepted' | 'done' | 'cancelled';
}

const STATUS: Record<Order['status'], string> = { new: 'Yeni', accepted: 'Hazırlanıyor', done: 'Teslim edildi', cancelled: 'İptal' };

interface Menu {
  id: string;
  slug: string;
  label: string | null;
  customer_id: string | null;
  customer_name: string | null;
  lang: Lang;
  theme: Theme;
  data: Record<string, string | Record<string, string> | undefined>;
  ordering: boolean;
  tables: Table[];
  open_orders: number;
  /** Rubriken im Textformat (Server: menuText). */
  text: string;
  active: boolean;
  scans_total: number;
  scans_30d: number;
  last_scan: string | null;
}

/**
 * Speisekarten der Kunden (/m/<slug>). Die Gerichte werden als schlichter
 * Text gepflegt: „# Rubrik“ und darunter „Name | Preis | Beschreibung“.
 */
@Component({
  selector: 'adm-menus',
  standalone: true,
  template: `
    <div class="adm-row-head">
      <h2>Müşteri menüleri</h2>
      <button class="btn btn-primary btn-small" (click)="openNew()">+ Yeni menü</button>
    </div>
    <p class="adm-muted">
      Her müşteriye kendi menüsü: NFC standına veya masadaki QR koduna <code>{{ origin }}/m/…</code> yazılır.
      Fiyat ve yemekleri buradan değiştirirsiniz, standı yeniden programlamaya gerek kalmaz. Yeni menü önce
      <strong>taslak</strong> olarak açılır; “Önizleme”den kontrol edip aktif yapın.
    </p>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    @if (formOpen()) {
      <form class="adm-card adm-form" (submit)="save($event)">
        <h3>{{ editId() ? 'Menüyü düzenle' : 'Yeni menü' }}</h3>
        <div class="adm-grid2">
          <label class="adm-field">İşletme adı *
            <input required maxlength="120" [value]="f('name')" (input)="setF('name', val($event)); suggest(val($event))" />
          </label>
          <label class="adm-field">Kısa ad *
            <input required pattern="[a-z0-9][a-z0-9-]{1,48}[a-z0-9]" [value]="slug()" (input)="slug.set(val($event))" [disabled]="!!editId()" />
          </label>
        </div>
        <p class="adm-muted small">Adres: <strong>{{ origin }}/m/{{ slug() || '…' }}</strong> — küçük harf, rakam ve tire. Kaydedildikten sonra değiştirilemez.</p>

        <div class="adm-grid3">
          <label class="adm-field">Tema
            <select [value]="theme()" (change)="theme.set($any(val($event)))">
              @for (t of themes; track t.id) { <option [value]="t.id">{{ t.label }}</option> }
            </select>
          </label>
          <label class="adm-field">Menü dili
            <select [value]="lang()" (change)="lang.set($any(val($event)))">
              @for (l of langs; track l.id) { <option [value]="l.id">{{ l.label }}</option> }
            </select>
          </label>
          <label class="adm-field">Bölümler
            <select [value]="f('sections')" (change)="setF('sections', val($event))">
              <option value="">Hepsi açık</option>
              <option value="collapsed">Kapalı, dokununca açılır</option>
            </select>
          </label>
          <label class="adm-field">Müşteri
            <select [value]="customerId()" (change)="customerId.set(val($event))">
              <option value="">—</option>
              @for (c of customers(); track c.id) { <option [value]="c.id">{{ c.name }}@if (c.business) { — {{ c.business }} }</option> }
            </select>
          </label>
        </div>

        <div class="adm-grid2">
          <label class="adm-field">Alt satır (ör. “Speisekarte”)
            <input maxlength="160" [value]="f('tagline')" (input)="setF('tagline', val($event))" />
          </label>
          <label class="adm-field">Logo (https://…)
            <input type="url" placeholder="https://…" [value]="f('logoUrl')" (input)="setF('logoUrl', val($event))" />
          </label>
        </div>
        <div class="adm-grid2">
          <label class="adm-field">Telefon<input maxlength="40" [value]="f('phone')" (input)="setF('phone', val($event))" /></label>
          <label class="adm-field">E-posta<input type="email" maxlength="200" [value]="f('email')" (input)="setF('email', val($event))" /></label>
        </div>
        <label class="adm-field">Adres (haritada açılır)<input maxlength="200" [value]="f('address')" (input)="setF('address', val($event))" /></label>
        <label class="adm-field">“Google’da değerlendirin” düğmesi (isteğe bağlı) — buraya <code>{{ origin }}/r/…</code> kısa linkini yazın
          <input type="url" placeholder="{{ origin }}/r/…" [value]="f('reviewUrl')" (input)="setF('reviewUrl', val($event))" />
        </label>
        <label class="adm-field">Adım adım seçim (isteğe bağlı) — hangi bölümler hangi adımda, bölüm sırası 1’den başlar
          <input maxlength="200" placeholder="start:1-2; main:3-15; dessert:16; drinks:17-24" [value]="f('steps')" (input)="setF('steps', val($event))" />
        </label>
        <p class="adm-muted small">Adımlar: <code>start</code> başlangıçlar, <code>main</code> ana yemekler, <code>dessert</code> tatlı, <code>drinks</code> içecekler. Boş bırakılırsa menüde “Adım adım seç” düğmesi çıkmaz.</p>
        <label class="adm-field">Fotoğraf kaynakları sayfası (CC lisanslı fotoğraflar için zorunlu, isteğe bağlı)
          <input type="url" placeholder="{{ origin }}/menu/…/bildnachweis.html" [value]="f('creditsUrl')" (input)="setF('creditsUrl', val($event))" />
        </label>

        <label class="adm-field">Menü içeriği
          <textarea rows="14" [value]="text()" (input)="text.set(val($event))" [placeholder]="example"></textarea>
        </label>
        <p class="adm-muted small">
          <code># Rubrik | not</code> yeni bölüm açar; altındaki her satır <code>Ad | Fiyat | Açıklama | https://…/foto.jpg</code> (fiyat, açıklama ve foto isteğe bağlı; foto en sonda).
          <br />Vejetaryen/vegan ve alerjen filtresi için açıklamadan sonra köşeli parantez ekleyin:
          <code>Ad | Fiyat | Açıklama | [vegetarisch; milch, eier, gluten]</code> (foto varsa ondan önce).
          <code>vegan</code>/<code>vegetarisch</code> ve içerdiği alerjenler (gluten, krebstiere, eier, fisch, erdnuesse, soja, milch, schalenfruechte, sellerie, senf, sesam, sulfite, lupinen, weichtiere);
          alerjeni olmayan yemeğe <code>[keine]</code> yazın. <strong>Parantezi olmayan yemek filtrede gizlenir</strong>, yani bilinmeyen alerjen "yok" sayılmaz.
        </p>
        @for (l of otherLangs(); track l.id) {
          <label class="adm-field">Çeviri: {{ l.label }} (isteğe bağlı)
            <textarea rows="6" [value]="trans()[l.id] ?? ''" (input)="setTrans(l.id, val($event))" placeholder="Aynı sıra ve aynı satır sayısı; fiyatlar boş bırakılabilir: Ad | | Açıklama"></textarea>
          </label>
        }
        @if (otherLangs().length) {
          <p class="adm-muted small">
            Çeviri, yukarıdaki menüyle <strong>aynı sırada</strong> olmalı (aynı rubrikler, aynı yemekler). Fiyat ve fotoğraf her zaman ana menüden alınır;
            ziyaretçi sayfanın üstünden dil seçer. Boş bırakılan dil görünmez.
          </p>
        }
        <label class="adm-field">Alt not (ör. alerjenler, katkı maddeleri)
          <textarea rows="3" maxlength="600" [value]="f('footnote')" (input)="setF('footnote', val($event))"></textarea>
        </label>
        <label class="adm-field">Açıklama (sadece panelde görünür)
          <input maxlength="200" [value]="label()" (input)="label.set(val($event))" />
        </label>

        <div class="adm-actions">
          <button class="btn btn-primary btn-small">Kaydet</button>
          <button type="button" class="btn btn-secondary btn-small" (click)="formOpen.set(false)">Vazgeç</button>
        </div>
      </form>
    }

    @for (m of items(); track m.id) {
      <article class="adm-card adm-item" [class.dim]="!m.active">
        <div class="adm-item-head">
          <div>
            <strong>{{ m.data['name'] || m.slug }}</strong>
            @if (m.customer_name) { <span class="adm-muted"> · {{ m.customer_name }}</span> }
            @if (!m.active) { <span class="adm-muted"> · taslak</span> }
            <div class="adm-shortlink">
              <code>{{ origin }}/m/{{ m.slug }}</code>
              <button class="adm-link" (click)="copy(m)">{{ copied() === m.id ? 'Kopyalandı ✓' : 'Kopyala' }}</button>
              <button class="adm-link" (click)="qr(m)">QR (SVG)</button>
            </div>
          </div>
          <div class="adm-scans">
            <strong>{{ m.scans_30d }}</strong><span>30 gün</span>
            <small>toplam {{ m.scans_total }} · son: {{ dateTime(m.last_scan) }}</small>
          </div>
        </div>
        <div class="adm-actions">
          <label class="adm-toggle"><input type="checkbox" [checked]="m.active" (change)="setActive(m, checked($event))" /> Aktif</label>
          <label class="adm-toggle"><input type="checkbox" [checked]="m.ordering" (change)="setOrdering(m, checked($event))" /> Masadan sipariş</label>
          <a class="adm-link" [href]="previewUrl(m)" target="_blank" rel="noopener">Önizleme</a>
          <button class="adm-link" (click)="toggleOrders(m)">Siparişler@if (m.open_orders) { ({{ m.open_orders }} yeni) }</button>
          <button class="adm-link" (click)="openEdit(m)">Düzenle</button>
          <button class="adm-link danger" (click)="remove(m)">Sil</button>
        </div>
        @if (m.ordering || m.tables.length) {
          <div class="adm-sub">
            <p class="adm-muted small">
              <strong>Masalar.</strong> Her masanın <em>gizli</em> kendi linki/QR kodu vardır; sadece o kodu okutan masadaki misafir sipariş verebilir.
              Link olmadan menü yalnızca okunur. Kod fotoğrafını başkası paylaşırsa “Yenile” ile eskisini geçersiz kılın.
              @if (!m.active) { <em>Menü taslak: sipariş için önce “Aktif” yapın.</em> }
            </p>
            @for (t of m.tables; track t.id) {
              <div class="adm-shortlink">
                <strong>Masa {{ t.label }}</strong>
                <button class="adm-link" (click)="copyTable(m, t)">{{ copied() === t.id ? 'Kopyalandı ✓' : 'Link' }}</button>
                <button class="adm-link" (click)="tableQr(m, t)">QR (SVG)</button>
                <button class="adm-link" (click)="rotate(t)">Yenile</button>
                <button class="adm-link danger" (click)="removeTable(t)">Sil</button>
              </div>
            }
            <form class="adm-actions" (submit)="addTable($event, m)">
              <input name="tableLabel" required maxlength="40" placeholder="Masa adı/no (ör. 5 veya Teras 2)" [value]="newTable()" (input)="newTable.set(val($event))" />
              <button class="btn btn-secondary btn-small">+ Masa ekle</button>
            </form>
          </div>
        }
        @if (ordersFor() === m.id) {
          <div class="adm-sub">
            @for (o of orders(); track o.id) {
              <div class="adm-card" [class.dim]="o.status === 'done' || o.status === 'cancelled'">
                <strong>Masa {{ o.table_label }}</strong> · {{ dateTime(o.created_at) }} · <em>{{ statusLabel(o.status) }}</em>
                <ul>
                  @for (l of o.items; track l.name) { <li>{{ l.qty }} × {{ l.name }}@if (l.price) { <span class="adm-muted"> ({{ l.price }})</span> }</li> }
                </ul>
                @if (o.note) { <p><em>Not:</em> {{ o.note }}</p> }
                @if (o.total_cents !== null) { <p class="adm-muted small">Toplam: {{ money(o.total_cents) }}</p> }
                <div class="adm-actions">
                  @if (o.status === 'new') { <button class="btn btn-primary btn-small" (click)="setStatus(o, 'accepted')">Kabul et</button> }
                  @if (o.status === 'new' || o.status === 'accepted') {
                    <button class="btn btn-secondary btn-small" (click)="setStatus(o, 'done')">Teslim edildi</button>
                    <button class="adm-link danger" (click)="setStatus(o, 'cancelled')">İptal</button>
                  }
                </div>
              </div>
            } @empty {
              <p class="adm-muted">Açık sipariş yok. Bu liste 15 saniyede bir kendini yeniler.</p>
            }
          </div>
        }
      </article>
    } @empty {
      <p class="adm-muted">Henüz menü yok.</p>
    }
  `,
})
export class MenusTab implements OnInit, OnDestroy {
  private readonly api = inject(AdminApi);
  readonly items = signal<Menu[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly error = signal('');
  readonly formOpen = signal(false);
  readonly editId = signal('');
  readonly slug = signal('');
  readonly label = signal('');
  readonly theme = signal<Theme>('warm');
  readonly lang = signal<Lang>('de');
  readonly customerId = signal('');
  readonly fields = signal<Record<string, string>>({});
  readonly text = signal('');
  readonly trans = signal<Record<string, string>>({});
  readonly newTable = signal('');
  readonly ordersFor = signal('');
  readonly orders = signal<Order[]>([]);
  private poll: ReturnType<typeof setInterval> | undefined;
  readonly copied = signal('');
  readonly themes = THEMES;
  readonly langs = LANGS;
  readonly example = EXAMPLE;
  readonly origin = typeof location !== 'undefined' ? location.origin : '';
  readonly dateTime = dateTime;

  async ngOnInit() {
    await this.load();
  }

  ngOnDestroy() {
    clearInterval(this.poll);
  }

  /** Sprachen für die Übersetzungsfelder: alle außer der Hauptsprache. */
  otherLangs() {
    return this.langs.filter((l) => l.id !== this.lang());
  }

  setTrans(lang: string, value: string) {
    this.trans.update((v) => ({ ...v, [lang]: value }));
  }

  statusLabel(s: Order['status']) {
    return STATUS[s];
  }

  money(cents: number) {
    return (cents / 100).toFixed(2).replace('.', ',') + ' €';
  }

  private async load() {
    try {
      this.items.set(await this.api.req<Menu[]>('GET', '/menus'));
    } catch (e) {
      this.error.set(errorText(e));
    }
  }

  val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }
  checked(e: Event) {
    return (e.target as HTMLInputElement).checked;
  }
  f(key: string) {
    return this.fields()[key] ?? '';
  }
  setF(key: string, value: string) {
    this.fields.update((v) => ({ ...v, [key]: value }));
  }

  /** Aus dem Namen einen Kurznamen vorschlagen — nur bei neuen Menüs. */
  suggest(name: string) {
    if (this.editId()) return;
    this.slug.set(
      name
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50),
    );
  }

  private async loadCustomers() {
    try {
      this.customers.set(await this.api.req<Customer[]>('GET', '/customers'));
    } catch {
      /* Auswahl bleibt leer */
    }
  }

  async openNew() {
    await this.loadCustomers();
    this.editId.set('');
    this.slug.set('');
    this.label.set('');
    this.theme.set('warm');
    this.lang.set('de');
    this.customerId.set('');
    this.fields.set({});
    this.text.set('');
    this.trans.set({});
    this.formOpen.set(true);
  }

  async openEdit(m: Menu) {
    await this.loadCustomers();
    this.editId.set(m.id);
    this.slug.set(m.slug);
    this.label.set(m.label ?? '');
    this.theme.set(m.theme);
    this.lang.set(m.lang);
    this.customerId.set(m.customer_id ?? '');
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(m.data)) if (typeof v === 'string') fields[k] = v;
    this.fields.set(fields);
    const tr = m.data['translations'];
    this.trans.set(tr && typeof tr === 'object' ? { ...tr } : {});
    this.text.set(m.text);
    this.formOpen.set(true);
  }

  async save(e: Event) {
    e.preventDefault();
    const editing = this.items().find((m) => m.id === this.editId());
    const body = {
      slug: this.slug(),
      label: this.label() || null,
      customer_id: this.customerId() || null,
      theme: this.theme(),
      lang: this.lang(),
      data: this.fields(),
      text: this.text(),
      translations: Object.fromEntries(Object.entries(this.trans()).filter(([l]) => l !== this.lang())),
      ...(editing ? { active: editing.active } : {}),
    };
    try {
      if (editing) await this.api.req('PATCH', `/menus/${editing.id}`, body);
      else await this.api.req('POST', '/menus', body);
      this.formOpen.set(false);
      this.error.set('');
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async setActive(m: Menu, active: boolean) {
    try {
      await this.api.req('PATCH', `/menus/${m.id}`, { active });
      this.error.set('');
    } catch (err) {
      this.error.set(errorText(err));
    }
    await this.load();
  }

  async setOrdering(m: Menu, ordering: boolean) {
    try {
      await this.api.req('PATCH', `/menus/${m.id}`, { ordering });
      this.error.set('');
    } catch (err) {
      this.error.set(errorText(err));
    }
    await this.load();
  }

  tableUrl(m: Menu, t: Table) {
    return `${this.origin}/m/${m.slug}?t=${t.token}`;
  }

  async addTable(e: Event, m: Menu) {
    e.preventDefault();
    try {
      await this.api.req('POST', `/menus/${m.id}/tables`, { label: this.newTable() });
      this.newTable.set('');
      this.error.set('');
    } catch (err) {
      this.error.set(errorText(err));
    }
    await this.load();
  }

  async rotate(t: Table) {
    if (!confirm(`Masa ${t.label}: yeni kod üretilsin mi? Basılı eski QR/NFC artık çalışmaz, yenisini yazdırmanız gerekir.`)) return;
    try {
      await this.api.req('POST', `/menu-tables/${t.id}/rotate`);
    } catch (err) {
      this.error.set(errorText(err));
    }
    await this.load();
  }

  async removeTable(t: Table) {
    if (!confirm(`Masa ${t.label} silinsin mi? Basılı kodu artık çalışmaz.`)) return;
    try {
      await this.api.req('DELETE', `/menu-tables/${t.id}`);
    } catch (err) {
      this.error.set(errorText(err));
    }
    await this.load();
  }

  async copyTable(m: Menu, t: Table) {
    try {
      await navigator.clipboard.writeText(this.tableUrl(m, t));
      this.copied.set(t.id);
      setTimeout(() => this.copied.set(''), 1500);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  }

  tableQr(m: Menu, t: Table) {
    this.download(this.tableUrl(m, t), `qr-${m.slug}-masa-${t.label.replace(/[^a-z0-9]+/gi, '-')}.svg`);
  }

  /** Bestellungen ein-/ausblenden; solange offen, alle 15 s neu laden. */
  async toggleOrders(m: Menu) {
    clearInterval(this.poll);
    if (this.ordersFor() === m.id) {
      this.ordersFor.set('');
      return;
    }
    this.ordersFor.set(m.id);
    await this.loadOrders();
    this.poll = setInterval(() => {
      void this.loadOrders();
      void this.load();
    }, 15000);
  }

  private async loadOrders() {
    const id = this.ordersFor();
    if (!id) return;
    try {
      this.orders.set(await this.api.req<Order[]>('GET', `/menus/${id}/orders`));
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async setStatus(o: Order, status: Order['status']) {
    try {
      await this.api.req('PATCH', `/menu-orders/${o.id}`, { status });
    } catch (err) {
      this.error.set(errorText(err));
    }
    await this.loadOrders();
    await this.load();
  }

  async remove(m: Menu) {
    if (!confirm(`“${m.slug}” silinsin mi? Bu adrese programlanmış standlar artık ana sayfaya gider.`)) return;
    try {
      await this.api.req('DELETE', `/menus/${m.id}`);
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  /** Der Schlüssel ist die id des Menüs: Entwurf ansehen, ohne zu zählen. */
  previewUrl(m: Menu) {
    return `${this.origin}/m/${m.slug}?vorschau=${m.id}`;
  }

  async copy(m: Menu) {
    try {
      await navigator.clipboard.writeText(`${this.origin}/m/${m.slug}`);
      this.copied.set(m.id);
      setTimeout(() => this.copied.set(''), 1500);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  }

  /** QR-Code als SVG-Datei für den Druck herunterladen. */
  qr(m: Menu) {
    this.download(`${this.origin}/m/${m.slug}`, `qr-menu-${m.slug}.svg`);
  }

  private download(link: string, filename: string) {
    const code = qrcode(0, 'M');
    code.addData(link);
    code.make();
    const svg = code.createSvgTag({ cellSize: 8, margin: 4, scalable: true });
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
