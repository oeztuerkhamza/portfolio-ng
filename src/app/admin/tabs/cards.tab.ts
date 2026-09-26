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
  label: string | null;
  customer_id: string | null;
  customer_name: string | null;
  data: Record<string, unknown>;
  active: boolean;
  scans_total: number;
  scans_30d: number;
  last_scan: string | null;
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

        <div class="adm-grid2">
          <label class="adm-field">Tema
            <select [value]="theme()" (change)="setTheme(val($event))">
              @for (t of themes; track t.id) { <option [value]="t.id">{{ t.label }}</option> }
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
            </label>
            <label class="adm-field">Logo (enine gösterilir)
              <input type="url" placeholder="https://…" [value]="f('logoUrl')" (input)="setF('logoUrl', val($event))" />
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
          Fotoğraf ve logolar <strong>https</strong> adresi olmalı; başka türlüsü kaydedilmez. En iyisi kendi Supabase
          deponuza yükleyip adresini buraya yapıştırmak — böylece dosyalar da sizin sunucunuzda kalır.
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
            @if (c.customer_name) { <span class="adm-muted"> · {{ c.customer_name }}</span> }
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
  readonly networks = NETWORKS;
  readonly netKeys = Object.keys(NETWORKS);
  readonly maxLinks = 8;
  readonly maxPhotos = 8;

  // ── Formular ──────────────────────────────────────────────
  readonly kind = signal<Kind>('business');
  readonly slug = signal('');
  readonly label = signal('');
  readonly theme = signal<Theme>('brand');
  readonly customerId = signal('');
  readonly fields = signal<Record<string, string>>({});
  readonly links = signal<LinkRow[]>([]);
  readonly photos = signal<string[]>([]);

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    try {
      this.items.set(await this.api.req<Card[]>('GET', '/cards'));
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
