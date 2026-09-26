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
  /** Gibt es im Modus des Schlüssels einen Webhook auf unsere Adresse? */
  webhook: { state: 'ok' | 'missing' | 'unknown'; missingEvents: string[]; error: string | null };
  /** true = der Shop nimmt gerade kein Geld an. */
  checkoutBlocked: boolean;
}

/** Antwort von GET/PUT /api/admin/maintenance. */
interface MaintenanceView {
  on: boolean;
  since: string | null;
  message: string | null;
  bypassUrl: string | null;
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
          <li [class.ok]="s.webhook.state === 'ok' && !s.webhook.missingEvents.length">
            Webhook, anahtarın moduyla aynı yerde
            @if (s.webhook.state === 'missing') { — <strong>yok</strong>: aşağıdaki adresi bu modda ekleyin }
            @else if (s.webhook.state === 'unknown') { — kontrol edilemedi ({{ s.webhook.error }}) }
            @else if (s.webhook.missingEvents.length) { — eksik olay: {{ s.webhook.missingEvents.join(', ') }} }
          </li>
        </ul>

        @if (s.checkoutBlocked) {
          <p class="adm-msg err">
            <strong>Mağaza şu an ödeme almıyor.</strong> Anahtarın modunda bizim adrese işaret eden bir webhook
            bulunamadı, dolayısıyla ödeme geri bildirilemez: müşteri öder, sipariş sonsuza dek “offen” kalırdı.
            Sunucu bu yüzden siparişi reddediyor (<code>webhook_missing</code>). Aşağıdaki adresi
            <strong>{{ s.mode === 'live' ? 'canlı' : 'test' }}</strong> modda ekledikten ve
            <code>STRIPE_WEBHOOK_SECRET</code>'ı güncelleyip yeniden dağıttıktan sonra kendiliğinden düzelir.
          </p>
        }
        @if (s.mode === 'test') {
          <p class="adm-msg">Test anahtarı kullanılıyor: siparişler işler, ama gerçek para tahsil edilmez.</p>
        }
        @if (s.mode === 'live') {
          <p class="adm-msg">
            <strong>Canlı anahtar kullanılıyor:</strong> verilen siparişlerden gerçek ödeme alınır.
            Test ve canlı modun webhook geheimnisi <em>ayrıdır</em> — mod değiştirdiyseniz
            <code>STRIPE_WEBHOOK_SECRET</code>'ı da değiştirmeniz gerekir.
          </p>
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

    <section class="adm-card">
      <h3>Bakım modu</h3>
      <p>
        Açıkken siteyi açan ziyaretçi, sayfaların yerine kısa bir
        <strong>“hemen döneceğiz”</strong> sayfası görür. Ziyaretçinin dilinde gösterilir.
      </p>

      <ul class="adm-checks">
        <li class="ok">Yönetim paneli (<code>/admin</code>) açık kalır — bakımı buradan kapatabilmeniz için.</li>
        <li class="ok">Stripe bildirimleri (<code>/api/…</code>) gelmeye devam eder. Kapansaydı, ödeme yapan
          müşterinin siparişi sonsuza dek “ödeme bekleniyor” kalırdı.</li>
        <li class="ok">Müşterilerin <strong>NFC kartları</strong> (<code>/k/…</code>, <code>/r/…</code>) çalışmaya
          devam eder. Onlar satılmış ürün, masalarında duruyor.</li>
      </ul>

      <label class="adm-field">Ziyaretçiye ek bir satır (isteğe bağlı)
        <input
          [value]="message()"
          (input)="message.set(val($event))"
          maxlength="200"
          placeholder="ör. 14:00'ten sonra tekrar açık olacağız" />
      </label>

      <div class="adm-actions">
        <button class="btn btn-secondary btn-small" [disabled]="busyM()" (click)="saveMessage()">Metni kaydet</button>
        @if (messageSaved()) { <span class="adm-msg ok">Kaydedildi ✓</span> }
      </div>

      <label class="adm-toggle big">
        <input type="checkbox" [checked]="maintenance()" [disabled]="busyM()" (change)="toggleMaintenance($event)" />
        Bakım modu {{ maintenance() ? 'AÇIK' : 'kapalı' }}
      </label>

      @if (maintenance()) {
        <p class="adm-msg err">
          <strong>Site şu an ziyaretçilere kapalı.</strong>@if (since()) { {{ since() }} tarihinden beri. }
          Sunucu <code>503</code> yanıtı veriyor; Google bunu “geçici” olarak anlar ve sonra tekrar gelir.
          <strong>Uzun süre açık bırakmayın</strong> — günler sürerse arama sonuçlarındaki yeriniz düşer.
        </p>
        @if (bypassUrl()) {
          <p>
            Kendiniz siteyi görmek için bu adresi kullanın — bu tarayıcıda bakım modunu 12 saat atlar:
          </p>
          <div class="adm-shortlink">
            <code>{{ bypassUrl() }}</code>
            <button class="adm-link" (click)="copyBypass()">{{ copied() ? 'Kopyalandı ✓' : 'Kopyala' }}</button>
            <a class="adm-link" [href]="bypassUrl()" target="_blank" rel="noopener">Aç</a>
          </div>
          <p class="adm-muted small">Bu adresi paylaşmayın: aldığı kişi bakım modundaki siteyi görür.</p>
        }
      }

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

  // ── Wartungsmodus ─────────────────────────────────────────
  readonly maintenance = signal(false);
  readonly message = signal('');
  readonly since = signal('');
  readonly bypassUrl = signal('');
  readonly busyM = signal(false);
  readonly copied = signal(false);
  readonly messageSaved = signal(false);

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
    try {
      this.applyMaintenance(await this.api.req<MaintenanceView>('GET', '/maintenance'));
    } catch {
      /* Der Schalter bleibt aus; der Rest der Seite arbeitet weiter. */
    }
  }

  val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  private applyMaintenance(m: MaintenanceView) {
    this.maintenance.set(m.on === true);
    this.message.set(m.message ?? '');
    this.bypassUrl.set(m.bypassUrl ?? '');
    this.since.set(m.since ? new Date(m.since).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '');
  }

  private async putMaintenance(on: boolean) {
    this.busyM.set(true);
    this.messageSaved.set(false);
    try {
      this.applyMaintenance(
        await this.api.req<MaintenanceView>('PUT', '/maintenance', { on, message: this.message().trim() }),
      );
      this.error.set('');
      return true;
    } catch (e) {
      this.error.set(errorText(e));
      return false;
    } finally {
      this.busyM.set(false);
    }
  }

  async toggleMaintenance(e: Event) {
    const box = e.target as HTMLInputElement;
    const value = box.checked;
    if (
      value &&
      !confirm(
        'Bakım modu açılsın mı?\n\nSiteyi açan ziyaretçiler sayfaların yerine bakım sayfasını görecek. ' +
          'Yönetim paneli, Stripe bildirimleri ve müşterilerin NFC kartları çalışmaya devam eder.',
      )
    ) {
      box.checked = false;
      return;
    }
    if (!(await this.putMaintenance(value))) box.checked = !value;
  }

  /** Nur den Text ändern, ohne den Schalter anzufassen. */
  async saveMessage() {
    if (await this.putMaintenance(this.maintenance())) this.messageSaved.set(true);
  }

  async copyBypass() {
    try {
      await navigator.clipboard.writeText(this.bypassUrl());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      /* Zwischenablage verweigert — die Adresse steht daneben zum Markieren. */
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
