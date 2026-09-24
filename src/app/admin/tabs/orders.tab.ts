import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { ORDER_STATUS, dateTime, eur, keys } from '../labels';

interface Order {
  id: string;
  created_at: string;
  status: string;
  items: { key: string; label: string; qty: number; unit_price: number }[];
  amount_total: string;
  customer_name: string | null;
  customer_email: string | null;
  phone: string | null;
  shipping: { name?: string; address?: Record<string, string | null> } | null;
  business_name: string | null;
  google_link: string | null;
  notes: string | null;
}

@Component({
  selector: 'adm-orders',
  standalone: true,
  template: `
    <h2>Siparişler</h2>
    <p class="adm-muted">Online mağazadan gelen siparişler. Ödeme Stripe üzerinden alınır; “Ödendi” durumu otomatik gelir.</p>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }
    @for (o of items(); track o.id) {
      <article class="adm-card adm-item" [class.is-new]="o.status === 'bezahlt'" [class.dim]="o.status === 'storniert' || o.status === 'offen'">
        <div class="adm-item-head">
          <div>
            <strong>{{ o.customer_name || o.business_name || 'Sipariş' }}</strong> · {{ eur(o.amount_total) }}
            <div class="adm-muted small">{{ dateTime(o.created_at) }} · #{{ o.id.slice(0, 8) }}</div>
          </div>
          <select [value]="o.status" (change)="patch(o, { status: sel($event) })">
            @for (s of statusKeys; track s) { <option [value]="s">{{ status[s] }}</option> }
          </select>
        </div>
        <ul class="adm-lines">
          @for (i of o.items; track i.key) { <li>{{ i.qty }} × {{ i.label }} <span class="adm-muted">à {{ eur(i.unit_price) }}</span></li> }
        </ul>
        <div class="adm-grid2 small">
          <div>
            <strong>Kart için</strong><br />
            İşletme: {{ o.business_name || '—' }}<br />
            Google: @if (o.google_link) { <a [href]="o.google_link" target="_blank" rel="noopener">link</a> } @else { — }
          </div>
          <div>
            <strong>Teslimat</strong><br />
            @if (o.shipping?.address; as a) {
              {{ o.shipping?.name }}<br />{{ a['line1'] }} {{ a['line2'] || '' }}<br />{{ a['postal_code'] }} {{ a['city'] }}
            } @else { — }
            <br />
            @if (o.customer_email) { <a [href]="'mailto:' + o.customer_email">{{ o.customer_email }}</a> }
            @if (o.phone) { · <a [href]="'tel:' + o.phone">{{ o.phone }}</a> }
          </div>
        </div>
        <label class="adm-field">Not<textarea rows="2" [value]="o.notes ?? ''" (change)="patch(o, { notes: val($event) })"></textarea></label>
      </article>
    } @empty {
      <p class="adm-muted">Henüz sipariş yok. Online mağaza “Ayarlar” bölümünden açılır.</p>
    }
  `,
})
export class OrdersTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Order[]>([]);
  readonly error = signal('');
  readonly status = ORDER_STATUS;
  readonly statusKeys = keys(ORDER_STATUS);
  readonly eur = eur;
  readonly dateTime = dateTime;

  async ngOnInit() {
    try {
      this.items.set(await this.api.req<Order[]>('GET', '/orders'));
    } catch (e) {
      this.error.set(errorText(e));
    }
  }

  sel(e: Event) {
    return (e.target as HTMLSelectElement).value;
  }
  val(e: Event) {
    return (e.target as HTMLTextAreaElement).value;
  }

  async patch(o: Order, data: Record<string, unknown>) {
    try {
      const row = await this.api.req<Order>('PATCH', `/orders/${o.id}`, data);
      this.items.update((list) => list.map((x) => (x.id === o.id ? row : x)));
    } catch (err) {
      this.error.set(errorText(err));
    }
  }
}
