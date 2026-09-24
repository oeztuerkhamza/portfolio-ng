import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { BILLING, ENQUIRY_STATUS, PLANS, TOPICS, dateTime, keys } from '../labels';

interface Enquiry {
  id: string;
  created_at: string;
  name: string;
  business: string | null;
  reach: string;
  message: string | null;
  topics: string[];
  plan: string | null;
  billing: string | null;
  lang: string | null;
  status: string;
  notes: string | null;
  customer_id: string | null;
}

@Component({
  selector: 'adm-enquiries',
  standalone: true,
  template: `
    <h2>Talepler</h2>
    <p class="adm-muted">Sitedeki iletişim formundan gelen talepler. Durumu değiştirin, not ekleyin, müşteriye dönüştürün.</p>
    <div class="adm-filters">
      <button [class.on]="filter() === ''" (click)="filter.set('')">Tümü ({{ items().length }})</button>
      @for (s of statuses; track s) {
        <button [class.on]="filter() === s" (click)="filter.set(s)">{{ label[s] }} ({{ count(s) }})</button>
      }
    </div>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }
    @if (!loaded()) { <p class="adm-muted">Yükleniyor…</p> }
    @for (e of shown(); track e.id) {
      <article class="adm-card adm-item" [class.is-new]="e.status === 'neu'">
        <div class="adm-item-head">
          <div>
            <strong>{{ e.name }}</strong>
            @if (e.business) { <span class="adm-muted"> · {{ e.business }}</span> }
            <div class="adm-muted small">{{ dateTime(e.created_at) }} @if (e.lang) { · {{ e.lang.toUpperCase() }} }</div>
          </div>
          <select [value]="e.status" (change)="patch(e, { status: sel($event) })">
            @for (s of statuses; track s) { <option [value]="s">{{ label[s] }}</option> }
          </select>
        </div>
        <p class="adm-reach">
          @if (isMail(e.reach)) { <a [href]="'mailto:' + e.reach">{{ e.reach }}</a> }
          @else { <a [href]="tel(e.reach)">{{ e.reach }}</a> ·
            <a [href]="wa(e.reach)" target="_blank" rel="noopener">WhatsApp</a> }
        </p>
        @if (e.topics.length || e.plan) {
          <div class="adm-tags">
            @for (t of e.topics; track t) { <span>{{ topics[t] || t }}</span> }
            @if (e.plan) { <span class="accent">{{ plans[e.plan] }} · {{ billing[e.billing || 'monthly'] }}</span> }
          </div>
        }
        @if (e.message) { <p class="adm-message">{{ e.message }}</p> }
        <label class="adm-field">Not
          <textarea rows="2" [value]="e.notes ?? ''" (change)="patch(e, { notes: val($event) })"></textarea>
        </label>
        <div class="adm-actions">
          @if (!e.customer_id) { <button class="btn btn-secondary btn-small" (click)="toCustomer(e)">Müşteri oluştur</button> }
          @else { <span class="adm-ok">✓ Müşteri kaydı var</span> }
          <button class="adm-link danger" (click)="remove(e)">Sil</button>
        </div>
      </article>
    } @empty {
      @if (loaded()) { <p class="adm-muted">Bu filtrede talep yok.</p> }
    }
  `,
})
export class EnquiriesTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Enquiry[]>([]);
  readonly loaded = signal(false);
  readonly error = signal('');
  readonly filter = signal('');
  readonly shown = computed(() => (this.filter() ? this.items().filter((e) => e.status === this.filter()) : this.items()));

  readonly statuses = keys(ENQUIRY_STATUS);
  readonly label = ENQUIRY_STATUS;
  readonly topics = TOPICS;
  readonly plans = PLANS;
  readonly billing = BILLING;
  readonly dateTime = dateTime;

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    try {
      this.items.set(await this.api.req<Enquiry[]>('GET', '/enquiries'));
    } catch (e) {
      this.error.set(errorText(e));
    }
    this.loaded.set(true);
  }

  count(s: string) {
    return this.items().filter((e) => e.status === s).length;
  }
  val(e: Event) {
    return (e.target as HTMLTextAreaElement).value;
  }
  sel(e: Event) {
    return (e.target as HTMLSelectElement).value;
  }
  isMail(v: string) {
    return v.includes('@');
  }
  tel(v: string) {
    return 'tel:' + v.replace(/[^\d+]/g, '');
  }
  wa(v: string) {
    const digits = v.replace(/[^\d+]/g, '').replace(/^\+/, '').replace(/^0/, '49');
    return `https://wa.me/${digits}`;
  }

  async patch(e: Enquiry, data: Partial<Enquiry>) {
    try {
      const row = await this.api.req<Enquiry>('PATCH', `/enquiries/${e.id}`, data);
      this.items.update((list) => list.map((x) => (x.id === e.id ? row : x)));
      this.error.set('');
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async toCustomer(e: Enquiry) {
    try {
      const c = await this.api.req<{ id: string }>('POST', `/enquiries/${e.id}/customer`, {});
      this.items.update((list) => list.map((x) => (x.id === e.id ? { ...x, customer_id: c.id } : x)));
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async remove(e: Enquiry) {
    if (!confirm(`${e.name} talebi silinsin mi?`)) return;
    try {
      await this.api.req('DELETE', `/enquiries/${e.id}`);
      this.items.update((list) => list.filter((x) => x.id !== e.id));
    } catch (err) {
      this.error.set(errorText(err));
    }
  }
}
