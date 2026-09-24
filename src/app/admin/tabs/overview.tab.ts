import { Component, OnInit, inject, output, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { eur } from '../labels';

interface Stats {
  new_enquiries: number;
  active_subscriptions: number;
  monthly_revenue: number;
  scans_30d: number;
  open_orders: number;
}

@Component({
  selector: 'adm-overview',
  standalone: true,
  template: `
    <h2>Genel bakış</h2>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }
    @if (stats(); as s) {
      <div class="adm-stats">
        <button class="adm-stat" (click)="go.emit('enquiries')"><strong>{{ s.new_enquiries }}</strong><span>Yeni talep</span></button>
        <button class="adm-stat" (click)="go.emit('subscriptions')"><strong>{{ s.active_subscriptions }}</strong><span>Aktif abonelik</span></button>
        <button class="adm-stat" (click)="go.emit('subscriptions')"><strong>{{ eur(s.monthly_revenue) }}</strong><span>Aylık abonelik geliri</span></button>
        <button class="adm-stat" (click)="go.emit('links')"><strong>{{ s.scans_30d }}</strong><span>NFC okutma (30 gün)</span></button>
        <button class="adm-stat" (click)="go.emit('orders')"><strong>{{ s.open_orders }}</strong><span>Hazırlanacak sipariş</span></button>
      </div>
    }
    @if (api.config(); as c) {
      <div class="adm-card">
        <h3>Kurulum durumu</h3>
        <ul class="adm-checks">
          <li [class.ok]="c.ready.db">Veritabanı (Supabase)</li>
          <li [class.ok]="c.ready.auth">Giriş (Supabase Auth + ADMIN_EMAILS)</li>
          <li [class.ok]="c.ready.deployHook">Fiyatları yayınlama (Vercel Deploy Hook)</li>
          <li [class.ok]="c.ready.stripe">Online ödeme (Stripe) — isteğe bağlı</li>
        </ul>
      </div>
    }
  `,
})
export class OverviewTab implements OnInit {
  readonly api = inject(AdminApi);
  readonly go = output<string>();
  readonly stats = signal<Stats | null>(null);
  readonly error = signal('');
  readonly eur = eur;

  async ngOnInit() {
    try {
      this.stats.set(await this.api.req<Stats>('GET', '/stats'));
    } catch (e) {
      this.error.set(errorText(e));
    }
  }
}
