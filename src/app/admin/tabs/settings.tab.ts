import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { PublishBox } from './publish.box';

/** Antwort von GET /api/admin/stripe — siehe src/server/stripe.ts. */
interface StripeSetup {
  ready: boolean;
  keyPresent: boolean;
  webhookSecretPresent: boolean;
  mode: 'test' | 'live' | null;
  chargesEnabled: boolean | null;
  account: string | null;
  error: string | null;
  webhookUrl: string;
  webhookEvents: string[];
}

@Component({
  selector: 'adm-settings',
  standalone: true,
  imports: [PublishBox],
  template: `
    <h2>Ayarlar</h2>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    <section class="adm-card">
      <h3>Stripe ödemesi</h3>
      @if (stripe(); as s) {
        <ul class="adm-checks">
          <li [class.ok]="s.keyPresent && !s.error">
            <code>STRIPE_SECRET_KEY</code>@if (s.error) { — {{ s.error }} } @else if (s.account) { — {{ s.account }} }
          </li>
          <li [class.ok]="s.webhookSecretPresent">
            <code>STRIPE_WEBHOOK_SECRET</code>@if (!s.webhookSecretPresent) { — eksik }
          </li>
          <li [class.ok]="s.chargesEnabled === true">
            Stripe hesabı ödeme alabiliyor@if (s.chargesEnabled === false) { — Stripe'ta hesap doğrulamasını tamamlayın }
          </li>
        </ul>
        @if (s.mode === 'test') {
          <p class="adm-msg">Test anahtarı kullanılıyor: siparişler işler, ama gerçek para tahsil edilmez.</p>
        }
        @if (s.mode === 'live') {
          <p class="adm-msg">Canlı anahtar kullanılıyor: verilen siparişlerden gerçek ödeme alınır.</p>
        }
        <p>
          Stripe → Developers → Webhooks → <strong>Add endpoint</strong> altına bu adresi ekleyin:<br />
          <code>{{ s.webhookUrl }}</code>
        </p>
        <p>Seçilecek olaylar:</p>
        <ul class="adm-list">
          @for (ev of s.webhookEvents; track ev) { <li><code>{{ ev }}</code></li> }
        </ul>
        <p>Değişiklikler Vercel'de kaydedildikten sonra yeniden dağıtım (redeploy) gerekir.</p>
      } @else if (stripeError()) {
        <p class="adm-msg err">{{ stripeError() }}</p>
      } @else {
        <p class="adm-msg">Kontrol ediliyor…</p>
      }
    </section>

    <section class="adm-card">
      <h3>Online mağaza</h3>
      <p>
        Açıkken “Bewertungskarten” sayfasında <strong>Online bestellen</strong> butonu görünür ve müşteriler kartları
        Stripe üzerinden kartla, PayPal'la veya Klarna ile öder (Stripe'ta hangi yöntemleri açtıysanız).
      </p>
      @if (!api.config()?.ready?.stripe) {
        <p class="adm-msg">
          Açmak için yukarıdaki Stripe anahtarları tamam olmalı.
          Hukuki sayfalar (<code>/agb</code>, <code>/widerruf</code>, <code>/versand</code>) hazır —
          açmadan önce bir hukukçuya okutmanız önerilir.
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
  readonly stripe = signal<StripeSetup | null>(null);
  readonly stripeError = signal('');

  async ngOnInit() {
    try {
      const s = await this.api.req<Record<string, unknown>>('GET', '/settings');
      this.shop.set(s['shop_enabled'] === true);
    } catch (e) {
      this.error.set(errorText(e));
    }
    // Eigener Aufruf: eine fehlende Stripe-Auskunft darf die Ayarlar nicht sperren.
    try {
      this.stripe.set(await this.api.req<StripeSetup>('GET', '/stripe'));
    } catch (e) {
      this.stripeError.set(errorText(e));
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
