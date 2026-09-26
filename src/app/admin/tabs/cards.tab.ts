import { Component, OnInit, computed, inject, signal } from '@angular/core';
import qrcode from 'qrcode-generator';
import { AdminApi, errorText } from '../admin-api.service';
import { dateTime } from '../labels';
import type { Customer } from './customers.tab';

/** Muss zu NETWORKS in src/server/cards.ts passen. */
const NETWORKS: Record<string, string> = {
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
};

const THEMES: { id: Theme; label: string }[] = [
  { id: 'brand', label: 'Açık (marka)' },
  { id: 'dark', label: 'Koyu' },
  { id: 'warm', label: 'Sıcak' },
];

type Kind = 'business' | 'gift';
type Theme = 'brand' | 'dark' | 'warm';
type Lang = 'de' | 'fr' | 'en' | 'tr' | 'ku';

/** Muss zu CARD_LANGS in src/server/cards.ts passen. */
const LANGS: { id: Lang; label: string }[] = [
  { id: 'de', label: 'Almanca' },
  { id: 'fr', label: 'Fransızca' },
  { id: 'en', label: 'İngilizce' },
  { id: 'tr', label: 'Türkçe' },
  { id: 'ku', label: 'Kürtçe' },
];

interface LinkRow {
  net: string;
  label: string;
  url: string;
}

interface Card {
  id: string;
  slug: string;
  kind: Kind;
  theme: Theme;
  lang: Lang;
  label: string | null;
  customer_id: string | null;
  customer_name: string | null;
  /** Gesetzt, wenn die Karte aus einer bezahlten Bestellung entstanden ist. */
  order_id: string | null;
  data: Record<string, unknown>;
  active: boolean;
  scans_total: number;
  scans_30d: number;
  last_scan: string | null;
  leads_total: number;
  leads_open: number;
}

/** Ein Kontakt, den ein Gast auf einer Karte hinterlassen hat. */
interface Lead {
  id: string;
  created_at: string;
  card_id: string;
  card_slug: string;
  card_label: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  device: string | null;
  handled: boolean;
}

/**
 * NFC-Karten mit eigener Seite (/k/<slug>). Zwei Arten: ein Profil mit
 * Portrait, Logo und Konten, oder eine Karte für einen besonderen Tag mit
 * Bildern und einem Lied.
 *
 * Bilder und Logos werden als https-Adresse hinterlegt. Am besten liegen sie
 * im eigenen Supabase-Speicher; dann steht alles auf eigenen Servern.
 */
@Component({
  selector: 'adm-cards',
  standalone: true,
  template: `
    <div class="adm-row-head">
      <h2>NFC kartları</h2>
      <button class="btn btn-primary btn-small" (click)="openNew()">+ Yeni kart</button>
    </div>
    <p class="adm-muted">
      Karta <code>{{ origin }}/k/…</code> yazılır ve dokunulduğunda <strong>sizin sunucunuzdaki</strong> sayfa açılır.
      İçeriği buradan değiştirirsiniz, kartı yeniden programlamaya gerek kalmaz. Okutmalar sadece zaman ve cihaz
      türüyle sayılır. Saf yönlendirme isterseniz “NFC linkleri” sekmesini kullanın.
    </p>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    @if (formOpen()) {
      <form class="adm-card adm-form" (submit)="save($event)">
        <h3>{{ editId() ? 'Kartı düzenle' : 'Yeni kart' }}</h3>

        <div class="adm-seg">
          @for (k of kinds; track k.id) {
            <button type="button" [class.on]="kind() === k.id" (click)="kind.set(k.id)">{{ k.label }}</button>
          }
        </div>

        <div class="adm-grid2">
          <label class="adm-field">Açıklama (sadece panelde görünür)
            <input [value]="label()" (input)="label.set(val($event))" (change)="suggestSlug()" />
          </label>
          <label class="adm-field">Kısa ad *
            <input required pattern="[a-z0-9][a-z0-9-]{1,48}[a-z0-9]" [value]="slug()" (input)="slug.set(val($event))" [disabled]="!!editId()" />
          </label>
        </div>
        <p class="adm-muted small">Adres: <strong>{{ origin }}/k/{{ slug() || '…' }}</strong> — küçük harf, rakam ve tire. Kaydedildikten sonra değiştirilemez.</p>

        <div class="adm-grid3">
          <label class="adm-field">Tema
            <select [value]="theme()" (change)="setTheme(val($event))">
              @for (t of themes; track t.id) { <option [value]="t.id">{{ t.label }}</option> }
            </select>
          </label>
          <label class="adm-field">Kart dili
            <select [value]="lang()" (change)="setLang(val($event))">
              @for (l of langs; track l.id) { <option [value]="l.id">{{ l.label }}</option> }
            </select>
          </label>
          <label class="adm-field">Müşteri
            <select [value]="customerId()" (change)="customerId.set(val($event))">
              <option value="">—</option>
              @for (c of customers(); track c.id) { <option [value]="c.id">{{ c.name }}@if (c.business) { — {{ c.business }} }</option> }
            </select>
          </label>
        </div>

        @if (kind() === 'business') {
          <h4 class="adm-sub">Profil</h4>
          <label class="adm-field">İsim veya firma adı *
            <input required maxlength="120" [value]="f('company')" (input)="setF('company', val($event))" />
          </label>
          <label class="adm-field">Alt satır (ör. “Kuaför · Freiburg”)
            <input maxlength="160" [value]="f('tagline')" (input)="setF('tagline', val($event))" />
          </label>
          <div class="adm-grid2">
            <label class="adm-field">Portre fotoğrafı (yuvarlak gösterilir)
              <input type="url" placeholder="https://…" [value]="f('avatarUrl')" (input)="setF('avatarUrl', val($event))" />
              <span class="adm-upload">
                <input type="file" [accept]="accept" [disabled]="!!uploading()" (change)="upload('avatarUrl', $event)" />
                @if (uploading() === 'avatarUrl') { <em>yükleniyor…</em> }
              </span>
            </label>
            <label class="adm-field">Logo (enine gösterilir)
              <input type="url" placeholder="https://…" [value]="f('logoUrl')" (input)="setF('logoUrl', val($event))" />
              <span class="adm-upload">
                <input type="file" [accept]="accept" [disabled]="!!uploading()" (change)="upload('logoUrl', $event)" />
                @if (uploading() === 'logoUrl') { <em>yükleniyor…</em> }
              </span>
            </label>
          </div>
          <div class="adm-grid2">
            <label class="adm-field">Telefon<input maxlength="40" [value]="f('phone')" (input)="setF('phone', val($event))" /></label>
            <label class="adm-field">E-posta<input type="email" maxlength="200" [value]="f('email')" (input)="setF('email', val($event))" /></label>
          </div>
          <div class="adm-grid2">
            <label class="adm-field">Web<input type="url" placeholder="https://…" [value]="f('web')" (input)="setF('web', val($event))" /></label>
            <label class="adm-field">Adres<input maxlength="200" [value]="f('address')" (input)="setF('address', val($event))" /></label>
          </div>

          <h4 class="adm-sub">Sosyal medya ve bağlantılar <span class="adm-muted small">(en çok {{ maxLinks }})</span></h4>
          @for (l of links(); track $index) {
            <div class="adm-grid3">
              <label class="adm-field">Ağ
                <select [value]="l.net" (change)="setLink($index, 'net', val($event))">
                  <option value="">Diğer</option>
                  @for (n of netKeys; track n) { <option [value]="n">{{ networks[n] }}</option> }
                </select>
              </label>
              <label class="adm-field">Yazı <input [value]="l.label" placeholder="boş = ağ adı" (input)="setLink($index, 'label', val($event))" /></label>
              <label class="adm-field">Adres
                <span class="adm-inline">
                  <input type="url" placeholder="https://…" [value]="l.url" (input)="setLink($index, 'url', val($event))" />
                  <button type="button" class="adm-link danger" (click)="removeLink($index)">Sil</button>
                </span>
              </label>
            </div>
          }
          @if (links().length < maxLinks) {
            <button type="button" class="btn btn-secondary btn-small" (click)="addLink()">+ Bağlantı ekle</button>
          }

          <h4 class="adm-sub">Ziyaretçi bilgi formu</h4>
          <label class="adm-toggle">
            <input type="checkbox" [checked]="leads()" (change)="leads.set(checked($event))" />
            Kartı okutan kişi kendi bilgilerini bırakabilsin
          </label>
          <p class="adm-muted small">
            Kartın altında küçük bir form çıkar: ad, e-posta, telefon, firma, mesaj. Gelen bilgiler aşağıdaki
            “Bırakılan bilgiler” listesinde durur, dışarıya gitmez. Kapalıysa form hiç görünmez.
          </p>
        } @else {
          <h4 class="adm-sub">Özel gün</h4>
          <label class="adm-field">Başlık * (ör. “Alles Liebe zum Geburtstag!”)
            <input required maxlength="120" [value]="f('headline')" (input)="setF('headline', val($event))" />
          </label>
          <div class="adm-grid2">
            <label class="adm-field">Kime<input maxlength="80" [value]="f('to')" (input)="setF('to', val($event))" /></label>
            <label class="adm-field">Kimden<input maxlength="80" [value]="f('from')" (input)="setF('from', val($event))" /></label>
          </div>
          <label class="adm-field">Mesaj (satır sonları korunur)
            <textarea rows="5" maxlength="1200" [value]="f('message')" (input)="setF('message', val($event))"></textarea>
          </label>

          <h4 class="adm-sub">Fotoğraflar <span class="adm-muted small">(en çok {{ maxPhotos }})</span></h4>
          @for (p of photos(); track $index) {
            <label class="adm-field">Fotoğraf {{ $index + 1 }}
              <span class="adm-inline">
                <input type="url" placeholder="https://…" [value]="p" (input)="setPhoto($index, val($event))" />
                <button type="button" class="adm-link danger" (click)="removePhoto($index)">Sil</button>
              </span>
              <span class="adm-upload">
                <input type="file" [accept]="accept" [disabled]="!!uploading()" (change)="uploadPhoto($index, $event)" />
                @if (uploading() === 'photo-' + $index) { <em>yükleniyor…</em> }
              </span>
            </label>
          }
          @if (photos().length < maxPhotos) {
            <button type="button" class="btn btn-secondary btn-small" (click)="addPhoto()">+ Fotoğraf ekle</button>
          }

          <h4 class="adm-sub">Müzik</h4>
          <div class="adm-grid2">
            <label class="adm-field">Şarkı adresi (Spotify, YouTube…)
              <input type="url" placeholder="https://…" [value]="f('songUrl')" (input)="setF('songUrl', val($event))" />
            </label>
            <label class="adm-field">Düğme yazısı<input maxlength="120" placeholder="Lied anhören" [value]="f('songLabel')" (input)="setF('songLabel', val($event))" /></label>
          </div>
        }

        <p class="adm-muted small">
          <strong>Dosya seç</strong> ile yüklediğiniz görsel doğrudan kendi Supabase deponuza gider ve adresi yukarıdaki
          alana yazılır — dosyalar sizin sunucunuzda kalır. Elinizde hazır bir <strong>https</strong> adresi varsa onu
          yapıştırmanız da yeter. PNG, JPEG, WebP, GIF, AVIF; en çok 5 MB. SVG kabul edilmez (içinde kod taşıyabilir).
        </p>

        @if (busy()) { <p class="adm-msg">Kaydediliyor…</p> }
        <div class="adm-actions">
          <button class="btn btn-primary btn-small" [disabled]="busy()">Kaydet</button>
          <button type="button" class="btn btn-secondary btn-small" (click)="formOpen.set(false)">Vazgeç</button>
          @if (editId()) {
            <a class="adm-link" [href]="'/k/' + slug()" target="_blank" rel="noopener">Kartı aç</a>
          }
        </div>
      </form>
    }

    @for (c of items(); track c.id) {
      <article class="adm-card adm-item" [class.dim]="!c.active">
        <div class="adm-item-head">
          <div>
            <strong>{{ c.label || title(c) }}</strong>
            <span class="adm-muted"> · {{ c.kind === 'business' ? 'Profil' : 'Özel gün' }}</span>
            <span class="adm-muted"> · {{ c.lang.toUpperCase() }}</span>
            @if (c.customer_name) { <span class="adm-muted"> · {{ c.customer_name }}</span> }
            @if (c.order_id) { <span class="adm-badge">Sipariş {{ short(c.order_id) }}</span> }
            @if (c.leads_open) { <span class="adm-badge open">{{ c.leads_open }} yeni bilgi</span> }
            <div class="adm-shortlink">
              <code>{{ origin }}/k/{{ c.slug }}</code>
              <button class="adm-link" (click)="copy(c)">{{ copied() === c.id ? 'Kopyalandı ✓' : 'Kopyala' }}</button>
              <button class="adm-link" (click)="qr(c)">QR (SVG)</button>
              <a class="adm-link" [href]="'/k/' + c.slug" target="_blank" rel="noopener">Aç</a>
            </div>
          </div>
          <div class="adm-scans">
            <strong>{{ c.scans_30d }}</strong><span>30 gün</span>
            <small>toplam {{ c.scans_total }} · son: {{ dateTime(c.last_scan) }}</small>
          </div>
        </div>
        <div class="adm-actions">
          <label class="adm-toggle"><input type="checkbox" [checked]="c.active" (change)="toggle(c, checked($event))" /> Aktif</label>
          <button class="adm-link" (click)="openEdit(c)">Düzenle</button>
          <button class="adm-link danger" (click)="remove(c)">Sil</button>
        </div>
      </article>
    } @empty {
      <p class="adm-muted">Henüz kart yok.</p>
    }

    <!-- Bırakılan bilgiler: kartı okutan kişilerin kendi verdiği bilgiler -->
    @if (leadList().length) {
      <h3 class="adm-sub lead-head">
        Bırakılan bilgiler
        <span class="adm-muted small">({{ openLeads() }} yeni / {{ leadList().length }})</span>
        <button type="button" class="adm-link" (click)="exportLeads()">CSV indir</button>
      </h3>
      @for (l of leadList(); track l.id) {
        <article class="adm-card adm-item" [class.dim]="l.handled">
          <div class="adm-item-head">
            <div>
              <strong>{{ l.name }}</strong>
              @if (l.company) { <span class="adm-muted"> · {{ l.company }}</span> }
              <div class="adm-shortlink">
                @if (l.email) { <a class="adm-link" [href]="'mailto:' + l.email">{{ l.email }}</a> }
                @if (l.phone) { <a class="adm-link" [href]="'tel:' + l.phone">{{ l.phone }}</a> }
                <code>/k/{{ l.card_slug }}</code>
              </div>
              @if (l.message) { <p class="adm-lead-msg">{{ l.message }}</p> }
            </div>
            <div class="adm-scans">
              <small>{{ dateTime(l.created_at) }}@if (l.device) { · {{ l.device }} }</small>
            </div>
          </div>
          <div class="adm-actions">
            <label class="adm-toggle">
              <input type="checkbox" [checked]="l.handled" (change)="markLead(l, checked($event))" /> İlgilenildi
            </label>
            <button class="adm-link danger" (click)="removeLead(l)">Sil</button>
          </div>
        </article>
      }
    }
  `,
})
export class CardsTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Card[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly error = signal('');
  readonly busy = signal(false);
  readonly formOpen = signal(false);
  readonly editId = signal('');
  readonly copied = signal('');
  readonly origin = typeof location !== 'undefined' ? location.origin : '';
  readonly dateTime = dateTime;

  readonly kinds: { id: Kind; label: string }[] = [
    { id: 'business', label: 'Profil (kişi / firma)' },
    { id: 'gift', label: 'Özel gün (fotoğraf + müzik)' },
  ];
  readonly themes = THEMES;
  readonly langs = LANGS;
  readonly networks = NETWORKS;
  readonly netKeys = Object.keys(NETWORKS);
  readonly maxLinks = 8;
  readonly maxPhotos = 8;
  /** Muss zu ALLOWED_TYPES in src/server/storage.ts passen. */
  readonly accept = 'image/png,image/jpeg,image/webp,image/gif,image/avif';
  /** Welches Feld gerade hochlädt — sperrt die anderen Knöpfe. */
  readonly uploading = signal('');

  // ── Formular ──────────────────────────────────────────────
  readonly kind = signal<Kind>('business');
  readonly slug = signal('');
  readonly label = signal('');
  readonly theme = signal<Theme>('brand');
  readonly lang = signal<Lang>('de');
  readonly leads = signal(false);
  readonly customerId = signal('');
  readonly leadList = signal<Lead[]>([]);
  readonly openLeads = computed(() => this.leadList().filter((l) => !l.handled).length);
  readonly fields = signal<Record<string, string>>({});
  readonly links = signal<LinkRow[]>([]);
  readonly photos = signal<string[]>([]);

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    try {
      // Karten und Kontakte zusammen: die Zahl am Kärtchen und die Liste
      // unten dürfen nicht auseinanderlaufen.
      const [cards, leads] = await Promise.all([
        this.api.req<Card[]>('GET', '/cards'),
        this.api.req<Lead[]>('GET', '/leads'),
      ]);
      this.items.set(cards);
      this.leadList.set(leads);
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

  /** Überschrift einer Karte für die Liste, wenn keine Beschreibung da ist. */
  title(c: Card) {
    return String(c.data?.['company'] ?? c.data?.['headline'] ?? c.slug);
  }

  /** Angular-Vorlagen kennen kein `as`: die Prüfung gehört hierher. */
  setTheme(value: string) {
    const hit = THEMES.find((t) => t.id === value);
    if (hit) this.theme.set(hit.id);
  }

  setLang(value: string) {
    const hit = LANGS.find((l) => l.id === value);
    if (hit) this.lang.set(hit.id);
  }

  f(key: string) {
    return this.fields()[key] ?? '';
  }
  setF(key: string, value: string) {
    this.fields.update((f) => ({ ...f, [key]: value }));
  }

  addLink() {
    this.links.update((l) => [...l, { net: '', label: '', url: '' }]);
  }
  setLink(i: number, key: keyof LinkRow, value: string) {
    this.links.update((rows) => rows.map((r, n) => (n === i ? { ...r, [key]: value } : r)));
  }
  removeLink(i: number) {
    this.links.update((rows) => rows.filter((_, n) => n !== i));
  }

  /**
   * Bild in den eigenen Speicher legen und die zurückgegebene Adresse in das
   * Feld schreiben. Die Datei geht rohe Bytes an den Server; den Namen
   * vergibt dort der Server, nicht der Browser.
   */
  private async send(file: File): Promise<string> {
    const r = await this.api.upload<{ url: string }>('/cards/upload', file);
    return r.url;
  }

  private static file(e: Event): File | null {
    return (e.target as HTMLInputElement).files?.[0] ?? null;
  }

  private static clearInput(e: Event) {
    // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann.
    (e.target as HTMLInputElement).value = '';
  }

  async upload(key: string, e: Event) {
    const file = CardsTab.file(e);
    if (!file) return;
    this.uploading.set(key);
    try {
      this.setF(key, await this.send(file));
      this.error.set('');
    } catch (err) {
      this.error.set(errorText(err));
    } finally {
      this.uploading.set('');
      CardsTab.clearInput(e);
    }
  }

  async uploadPhoto(i: number, e: Event) {
    const file = CardsTab.file(e);
    if (!file) return;
    this.uploading.set(`photo-${i}`);
    try {
      this.setPhoto(i, await this.send(file));
      this.error.set('');
    } catch (err) {
      this.error.set(errorText(err));
    } finally {
      this.uploading.set('');
      CardsTab.clearInput(e);
    }
  }

  addPhoto() {
    this.photos.update((p) => [...p, '']);
  }
  setPhoto(i: number, value: string) {
    this.photos.update((p) => p.map((u, n) => (n === i ? value : u)));
  }
  removePhoto(i: number) {
    this.photos.update((p) => p.filter((_, n) => n !== i));
  }

  /** „Café Müller" → cafe-mueller; nur bei einer neuen Karte. */
  suggestSlug() {
    if (this.editId() || this.slug()) return;
    this.slug.set(
      this.label()
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50),
    );
  }

  private reset() {
    this.editId.set('');
    this.kind.set('business');
    this.slug.set('');
    this.label.set('');
    this.theme.set('brand');
    this.lang.set('de');
    this.leads.set(false);
    this.customerId.set('');
    this.fields.set({});
    this.links.set([]);
    this.photos.set([]);
  }

  async openNew() {
    this.reset();
    await this.loadCustomers();
    this.formOpen.set(true);
  }

  async openEdit(c: Card) {
    this.reset();
    await this.loadCustomers();
    this.editId.set(c.id);
    this.kind.set(c.kind);
    this.slug.set(c.slug);
    this.label.set(c.label ?? '');
    this.theme.set(c.theme);
    this.lang.set(c.lang ?? 'de');
    this.leads.set(c.data?.['leads'] === true);
    this.customerId.set(c.customer_id ?? '');

    const d = (c.data ?? {}) as Record<string, unknown>;
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(d)) if (typeof v === 'string') flat[k] = v;
    this.fields.set(flat);
    this.links.set(
      Array.isArray(d['links'])
        ? (d['links'] as Record<string, string>[]).map((l) => ({ net: l['net'] ?? '', label: l['label'] ?? '', url: l['url'] ?? '' }))
        : [],
    );
    this.photos.set(Array.isArray(d['photos']) ? (d['photos'] as string[]).slice() : []);
    this.formOpen.set(true);
  }

  private async loadCustomers() {
    try {
      this.customers.set(await this.api.req<Customer[]>('GET', '/customers'));
    } catch {
      /* Auswahl bleibt leer */
    }
  }

  /** Nur ausgefüllte Felder schicken — der Server wirft den Rest sowieso weg. */
  private payload() {
    const f = this.fields();
    const keep = (keys: string[]) => {
      const out: Record<string, unknown> = {};
      for (const k of keys) if (f[k]?.trim()) out[k] = f[k].trim();
      return out;
    };

    const data =
      this.kind() === 'business'
        ? {
            ...keep(['company', 'tagline', 'avatarUrl', 'logoUrl', 'phone', 'email', 'web', 'address']),
            links: this.links()
              .filter((l) => l.url.trim())
              .map((l) => ({ url: l.url.trim(), label: l.label.trim(), ...(l.net ? { net: l.net } : {}) })),
            ...(this.leads() ? { leads: true } : {}),
          }
        : {
            ...keep(['headline', 'to', 'from', 'message', 'songUrl', 'songLabel']),
            photos: this.photos().map((u) => u.trim()).filter(Boolean),
          };

    return {
      slug: this.slug().trim().toLowerCase(),
      label: this.label().trim() || null,
      customer_id: this.customerId() || null,
      kind: this.kind(),
      theme: this.theme(),
      lang: this.lang(),
      data,
    };
  }

  async save(e: Event) {
    e.preventDefault();
    this.busy.set(true);
    try {
      const id = this.editId();
      if (id) await this.api.req('PATCH', `/cards/${id}`, this.payload());
      else await this.api.req('POST', '/cards', this.payload());
      this.formOpen.set(false);
      this.error.set('');
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    } finally {
      this.busy.set(false);
    }
  }

  async toggle(c: Card, active: boolean) {
    try {
      await this.api.req('PATCH', `/cards/${c.id}`, { active });
      this.error.set('');
    } catch (err) {
      this.error.set(errorText(err));
    }
    await this.load();
  }

  async remove(c: Card) {
    if (!confirm(`“${c.slug}” silinsin mi? Bu kartla programlanmış kartlar artık ana sayfaya gider.`)) return;
    try {
      await this.api.req('DELETE', `/cards/${c.id}`);
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  /** Erste acht Zeichen einer UUID — so steht die Nummer auch auf der Bestellung. */
  short(id: string) {
    return id.slice(0, 8);
  }

  /**
   * Kontakte als CSV herunterladen — zum Weiterarbeiten in Excel oder für
   * das eigene Adressbuch. Gebaut wird die Datei im Browser aus dem, was
   * schon geladen ist; der Server braucht dafür keine eigene Strecke.
   *
   * Semikolon als Trenner, weil Excel auf deutschen und türkischen Systemen
   * das Komma als Dezimalzeichen liest. BOM davor, sonst zeigt Excel „Ayşe"
   * als „AyÅŸe".
   */
  exportLeads() {
    const head = ['Tarih', 'Ad', 'Firma', 'E-posta', 'Telefon', 'Mesaj', 'Kart', 'Cihaz', 'İlgilenildi'];
    // Ein Feld, das mit = + - @ beginnt, liest Excel als Formel. Ein
    // vorangestelltes Hochkomma macht daraus wieder Text.
    const cell = (v: unknown) => {
      const s = String(v ?? '').replace(/"/g, '""');
      return `"${/^[=+\-@]/.test(s) ? "'" + s : s}"`;
    };
    const rows = this.leadList().map((l) =>
      [l.created_at, l.name, l.company, l.email, l.phone, l.message, '/k/' + l.card_slug, l.device, l.handled ? 'evet' : 'hayır']
        .map(cell)
        .join(';'),
    );
    const csv = '\ufeff' + [head.map(cell).join(';'), ...rows].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `kart-bilgileri-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async markLead(l: Lead, handled: boolean) {
    try {
      await this.api.req('PATCH', `/leads/${l.id}`, { handled });
      this.error.set('');
    } catch (err) {
      this.error.set(errorText(err));
    }
    await this.load();
  }

  async removeLead(l: Lead) {
    if (!confirm(`“${l.name}” bilgileri silinsin mi?`)) return;
    try {
      await this.api.req('DELETE', `/leads/${l.id}`);
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async copy(c: Card) {
    try {
      await navigator.clipboard.writeText(`${this.origin}/k/${c.slug}`);
      this.copied.set(c.id);
      setTimeout(() => this.copied.set(''), 1500);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  }

  /** QR-Code als SVG für den Druck. */
  qr(c: Card) {
    const code = qrcode(0, 'M');
    code.addData(`${this.origin}/k/${c.slug}`);
    code.make();
    const svg = code.createSvgTag({ cellSize: 8, margin: 4, scalable: true });
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${c.slug}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
