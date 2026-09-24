import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { PublishBox } from './publish.box';

@Component({
  selector: 'adm-settings',
  standalone: true,
  imports: [PublishBox],
  template: `
    <h2>Ayarlar</h2>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    <section class="adm-card">
      <h3>Online mağaza</h3>
      <p>
        Açıkken “Bewertungskarten” sayfasında <strong>Online bestellen</strong> butonu görünür ve müşteriler kartları
        Stripe üzerinden kartla, PayPal'la veya Klarna ile öder (Stripe'ta hangi yöntemleri açtıysanız).
      </p>
      @if (!api.config()?.ready?.stripe) {
        <p class="adm-msg">
          Açmak için önce Vercel'e <code>STRIPE_SECRET_KEY</code> ve <code>STRIPE_WEBHOOK_SECRET</code> eklenmeli.
          Açmadan önce: AGB, Widerrufsbelehrung ve Versandbedingungen hazır olmalı.
        </p>
      }
      <label class="adm-toggle big">
        <input type="checkbox" [checked]="shop()" [disabled]="!api.config()?.ready?.stripe || busy()" (change)="toggleShop($event)" />
        Online mağaza {{ shop() ? 'açık' : 'kapalı' }}
      </label>
    </section>

    <adm-publish />
  `,
})
export class SettingsTab implements OnInit {
  readonly api = inject(AdminApi);
  readonly shop = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');

  async ngOnInit() {
    try {
      const s = await this.api.req<Record<string, unknown>>('GET', '/settings');
      this.shop.set(s['shop_enabled'] === true);
    } catch (e) {
      this.error.set(errorText(e));
    }
  }

  async toggleShop(e: Event) {
    const value = (e.target as HTMLInputElement).checked;
    if (value && !confirm('Online mağaza açılsın mı? Müşteriler hemen sipariş verip ödeme yapabilir.')) {
      (e.target as HTMLInputElement).checked = false;
      return;
    }
    this.busy.set(true);
    try {
      const r = await this.api.req<{ shop_enabled: boolean }>('PUT', '/settings/shop_enabled', { value });
      this.shop.set(r.shop_enabled);
    } catch (err) {
      this.error.set(errorText(err));
    } finally {
      this.busy.set(false);
    }
  }
}
