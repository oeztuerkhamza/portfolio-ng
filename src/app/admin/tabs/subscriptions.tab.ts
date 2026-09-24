import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { BILLING, PLANS, SUB_STATUS, date, eur, keys } from '../labels';
import type { Customer } from './customers.tab';
import { formData } from './form';

interface Sub {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_business: string | null;
  plan: string;
  billing: string;
  monthly_price: string;
  setup_fee: string;
  start_date: string;
  min_term_months: number;
  min_term_end: string;
  status: string;
  end_date: string | null;
  notes: string | null;
}

interface Price {
  key: string;
  value: string;
}

const FIELDS = ['customer_id', 'plan', 'billing', 'monthly_price', 'setup_fee', 'start_date', 'min_term_months', 'notes'];

@Component({
  selector: 'adm-subscriptions',
  standalone: true,
  template: `
    <div class="adm-row-head">
      <h2>Abonelikler</h2>
      <button class="btn btn-primary btn-small" (click)="openForm()">+ Yeni abonelik</button>
    </div>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    @if (formOpen()) {
      <form class="adm-card adm-form" (submit)="create($event)">
        <h3>Yeni abonelik</h3>
        @if (!customers().length) { <p class="adm-msg">Önce “Müşteriler” bölümünde bir müşteri oluşturun.</p> }
        <div class="adm-grid2">
          <label class="adm-field">Müşteri *
            <select name="customer_id" required>
              @for (c of customers(); track c.id) { <option [value]="c.id">{{ c.name }}@if (c.business) { — {{ c.business }} }</option> }
            </select>
          </label>
          <label class="adm-field">Paket *
            <select name="plan" (change)="prefill(sel($event))">
              @for (p of planKeys; track p) { <option [value]="p" [selected]="p === plan()">{{ plans[p] }}</option> }
            </select>
          </label>
          <label class="adm-field">Ödeme
            <select name="billing">@for (b of billingKeys; track b) { <option [value]="b">{{ billing[b] }}</option> }</select>
          </label>
          <label class="adm-field">Başlangıç<input name="start_date" type="date" [value]="today" required /></label>
          <label class="adm-field">Aylık ücret (€)<input name="monthly_price" type="number" step="0.01" min="0" [value]="defaults().monthly" required /></label>
          <label class="adm-field">Kurulum ücreti (€)<input name="setup_fee" type="number" step="0.01" min="0" [value]="defaults().setup" /></label>
          <label class="adm-field">Asgari süre (ay)<input name="min_term_months" type="number" min="0" max="120" [value]="defaults().term" /></label>
        </div>
        <label class="adm-field">Not<textarea name="notes" rows="2"></textarea></label>
        <div class="adm-actions">
          <button class="btn btn-primary btn-small" [disabled]="!customers().length">Kaydet</button>
          <button type="button" class="btn btn-secondary btn-small" (click)="formOpen.set(false)">Vazgeç</button>
        </div>
      </form>
    }

    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead><tr><th>Müşteri</th><th>Paket</th><th>Ücret</th><th>Başlangıç</th><th>Asgari süre sonu</th><th>Durum</th><th></th></tr></thead>
        <tbody>
          @for (s of items(); track s.id) {
            <tr [class.dim]="s.status !== 'aktiv'">
              <td><strong>{{ s.customer_name }}</strong>@if (s.customer_business) { <div class="adm-muted small">{{ s.customer_business }}</div> }</td>
              <td>{{ plans[s.plan] }} · {{ billing[s.billing] }}</td>
              <td>{{ eur(s.monthly_price) }}/ay @if (+s.setup_fee) { <div class="adm-muted small">+ {{ eur(s.setup_fee) }} kurulum</div> }</td>
              <td>{{ date(s.start_date) }}</td>
              <td [class.warn]="endsSoon(s)">{{ date(s.min_term_end) }} @if (endsSoon(s)) { <div class="small">yakında</div> }</td>
              <td>
                <select [value]="s.status" (change)="patch(s, { status: sel($event) })">
                  @for (k of statusKeys; track k) { <option [value]="k">{{ status[k] }}</option> }
                </select>
              </td>
              <td><button class="adm-link danger" (click)="remove(s)">Sil</button></td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="adm-muted">Henüz abonelik yok.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class SubscriptionsTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Sub[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly prices = signal<Price[]>([]);
  readonly error = signal('');
  readonly formOpen = signal(false);
  readonly plan = signal('basis');
  readonly defaults = signal({ monthly: 0, setup: 0, term: 12 });

  readonly plans = PLANS;
  readonly billing = BILLING;
  readonly status = SUB_STATUS;
  readonly planKeys = keys(PLANS);
  readonly billingKeys = keys(BILLING);
  readonly statusKeys = keys(SUB_STATUS);
  readonly today = new Date().toISOString().slice(0, 10);
  readonly eur = eur;
  readonly date = date;

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    try {
      this.items.set(await this.api.req<Sub[]>('GET', '/subscriptions'));
    } catch (e) {
      this.error.set(errorText(e));
    }
  }

  sel(e: Event) {
    return (e.target as HTMLSelectElement).value;
  }

  async openForm() {
    try {
      const [customers, prices] = await Promise.all([
        this.api.req<Customer[]>('GET', '/customers'),
        this.api.req<Price[]>('GET', '/prices'),
      ]);
      this.customers.set(customers);
      this.prices.set(prices);
      this.prefill('basis');
      this.formOpen.set(true);
    } catch (e) {
      this.error.set(errorText(e));
    }
  }

  /** Preise des gewählten Pakets aus der Preisliste vorbelegen. */
  prefill(plan: string) {
    const p = (k: string) => Number(this.prices().find((x) => x.key === `abo.${plan}.${k}`)?.value ?? 0);
    this.plan.set(plan);
    this.defaults.set({ monthly: p('monthly'), setup: p('setup'), term: p('term') || 12 });
  }

  endsSoon(s: Sub) {
    if (s.status !== 'aktiv' || !s.min_term_end) return false;
    const days = (new Date(s.min_term_end).getTime() - Date.now()) / 86_400_000;
    return days >= 0 && days <= 60;
  }

  async create(e: Event) {
    e.preventDefault();
    try {
      await this.api.req('POST', '/subscriptions', formData(e.target as HTMLFormElement, FIELDS));
      this.formOpen.set(false);
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async patch(s: Sub, data: Record<string, unknown>) {
    try {
      if (data['status'] === 'gekuendigt' && !s.end_date) data['end_date'] = new Date().toISOString().slice(0, 10);
      await this.api.req('PATCH', `/subscriptions/${s.id}`, data);
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async remove(s: Sub) {
    if (!confirm(`${s.customer_name} aboneliği silinsin mi? (Feshedildi olarak işaretlemek genelde daha iyidir.)`)) return;
    try {
      await this.api.req('DELETE', `/subscriptions/${s.id}`);
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }
}
