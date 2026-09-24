import { Component, OnInit, inject, signal } from '@angular/core';
import qrcode from 'qrcode-generator';
import { AdminApi, errorText } from '../admin-api.service';
import { dateTime } from '../labels';
import type { Customer } from './customers.tab';
import { formData } from './form';

interface Link {
  id: string;
  slug: string;
  target_url: string;
  label: string | null;
  customer_id: string | null;
  customer_name: string | null;
  active: boolean;
  scans_total: number;
  scans_30d: number;
  last_scan: string | null;
}

const FIELDS = ['slug', 'target_url', 'label', 'customer_id'];

@Component({
  selector: 'adm-links',
  standalone: true,
  template: `
    <div class="adm-row-head">
      <h2>NFC linkleri</h2>
      <button class="btn btn-primary btn-small" (click)="openForm()">+ Yeni link</button>
    </div>
    <p class="adm-muted">
      Kartlara hedef adres yerine kısa link yazılır: <code>{{ origin }}/r/…</code>. Hedefi buradan istediğiniz zaman
      değiştirirsiniz, kartı yeniden programlamaya gerek kalmaz. Okutmalar sadece zaman ve cihaz türüyle sayılır.
    </p>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    @if (formOpen()) {
      <form class="adm-card adm-form" (submit)="create($event)">
        <h3>Yeni kısa link</h3>
        <div class="adm-grid2">
          <label class="adm-field">Açıklama (ör. “Tresen Café Muster”)<input name="label" (input)="suggest(val($event))" /></label>
          <label class="adm-field">Kısa ad *<input name="slug" required pattern="[a-z0-9][a-z0-9-]{1,48}[a-z0-9]" [value]="slug()" (input)="slug.set(val($event))" /></label>
        </div>
        <p class="adm-muted small">Link: <strong>{{ origin }}/r/{{ slug() || '…' }}</strong> — küçük harf, rakam ve tire.</p>
        <label class="adm-field">Hedef adres * (https://…, ör. Google yorum linki)<input name="target_url" type="url" required pattern="https://.*" /></label>
        <label class="adm-field">Müşteri
          <select name="customer_id">
            <option value="">—</option>
            @for (c of customers(); track c.id) { <option [value]="c.id">{{ c.name }}@if (c.business) { — {{ c.business }} }</option> }
          </select>
        </label>
        <div class="adm-actions">
          <button class="btn btn-primary btn-small">Kaydet</button>
          <button type="button" class="btn btn-secondary btn-small" (click)="formOpen.set(false)">Vazgeç</button>
        </div>
      </form>
    }

    @for (l of items(); track l.id) {
      <article class="adm-card adm-item" [class.dim]="!l.active">
        <div class="adm-item-head">
          <div>
            <strong>{{ l.label || l.slug }}</strong>
            @if (l.customer_name) { <span class="adm-muted"> · {{ l.customer_name }}</span> }
            <div class="adm-shortlink">
              <code>{{ origin }}/r/{{ l.slug }}</code>
              <button class="adm-link" (click)="copy(l)">{{ copied() === l.id ? 'Kopyalandı ✓' : 'Kopyala' }}</button>
              <button class="adm-link" (click)="qr(l)">QR (SVG)</button>
            </div>
          </div>
          <div class="adm-scans">
            <strong>{{ l.scans_30d }}</strong><span>30 gün</span>
            <small>toplam {{ l.scans_total }} · son: {{ dateTime(l.last_scan) }}</small>
          </div>
        </div>
        <label class="adm-field">Hedef
          <input type="url" [value]="l.target_url" (change)="patch(l, { target_url: val($event) })" />
        </label>
        <div class="adm-actions">
          <label class="adm-toggle"><input type="checkbox" [checked]="l.active" (change)="patch(l, { active: checked($event) })" /> Aktif</label>
          <a class="adm-link" [href]="l.target_url" target="_blank" rel="noopener">Hedefi aç</a>
          <button class="adm-link danger" (click)="remove(l)">Sil</button>
        </div>
      </article>
    } @empty {
      <p class="adm-muted">Henüz link yok.</p>
    }
  `,
})
export class LinksTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Link[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly error = signal('');
  readonly formOpen = signal(false);
  readonly slug = signal('');
  readonly copied = signal('');
  readonly origin = typeof location !== 'undefined' ? location.origin : '';
  readonly dateTime = dateTime;

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    try {
      this.items.set(await this.api.req<Link[]>('GET', '/redirects'));
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

  /** Aus der Beschreibung einen Kurznamen vorschlagen: „Café Müller" → cafe-mueller */
  suggest(label: string) {
    const s = label
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50);
    this.slug.set(s);
  }

  async openForm() {
    try {
      this.customers.set(await this.api.req<Customer[]>('GET', '/customers'));
    } catch {
      /* Auswahl bleibt leer */
    }
    this.slug.set('');
    this.formOpen.set(true);
  }

  async create(e: Event) {
    e.preventDefault();
    try {
      await this.api.req('POST', '/redirects', formData(e.target as HTMLFormElement, FIELDS));
      this.formOpen.set(false);
      this.error.set('');
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async patch(l: Link, data: Partial<Link>) {
    try {
      await this.api.req('PATCH', `/redirects/${l.id}`, data);
      this.error.set('');
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
      await this.load();
    }
  }

  async remove(l: Link) {
    if (!confirm(`“${l.slug}” silinsin mi? Bu linkle programlanmış kartlar artık ana sayfaya gider.`)) return;
    try {
      await this.api.req('DELETE', `/redirects/${l.id}`);
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async copy(l: Link) {
    try {
      await navigator.clipboard.writeText(`${this.origin}/r/${l.slug}`);
      this.copied.set(l.id);
      setTimeout(() => this.copied.set(''), 1500);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  }

  /** QR-Code als SVG-Datei für den Druck herunterladen. */
  qr(l: Link) {
    const code = qrcode(0, 'M');
    code.addData(`${this.origin}/r/${l.slug}`);
    code.make();
    const svg = code.createSvgTag({ cellSize: 8, margin: 4, scalable: true });
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${l.slug}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
