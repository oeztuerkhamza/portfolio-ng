import { Component, OnInit, PLATFORM_ID, ViewEncapsulation, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { AdminApi, errorText } from './admin-api.service';
import { OverviewTab } from './tabs/overview.tab';
import { EnquiriesTab } from './tabs/enquiries.tab';
import { CustomersTab } from './tabs/customers.tab';
import { SubscriptionsTab } from './tabs/subscriptions.tab';
import { LinksTab } from './tabs/links.tab';
import { CardsTab } from './tabs/cards.tab';
import { PricesTab } from './tabs/prices.tab';
import { OrdersTab } from './tabs/orders.tab';
import { SettingsTab } from './tabs/settings.tab';
import { InvoicesTab } from './tabs/invoices.tab';

type Tab = 'overview' | 'enquiries' | 'customers' | 'subscriptions' | 'invoices' | 'cards' | 'links' | 'prices' | 'orders' | 'settings';

/**
 * Admin-Portal unter /admin. Läuft nur im Browser; der Server liefert
 * lediglich die leere Hülle aus.
 */
@Component({
  selector: 'app-admin',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [OverviewTab, EnquiriesTab, CustomersTab, SubscriptionsTab, CardsTab, LinksTab, PricesTab, OrdersTab, SettingsTab, InvoicesTab],
  styleUrl: './admin.component.scss',
  template: `
    <div class="adm">
      @if (!api.config()) {
        <div class="adm-center"><p class="adm-muted">Yükleniyor…</p></div>
      } @else if (api.config()!.apiError) {
        <div class="adm-center">
          <div class="adm-card adm-narrow">
            <img src="/assets/images/logo/breisgau-digital.svg" alt="" class="adm-logo-big" />
            <h1>Sunucuya ulaşılamıyor</h1>
            <p>Yönetim API'si cevap vermedi. Vercel → Deployments → son derleme → <strong>Logs</strong> bölümündeki hatayı gönderin.</p>
            <p class="adm-msg err">{{ api.config()!.apiError }}</p>
          </div>
        </div>
      } @else if (!api.config()!.ready.auth || api.config()!.dbError) {
        <div class="adm-center">
          <div class="adm-card adm-narrow">
            <img src="/assets/images/logo/breisgau-digital.svg" alt="" class="adm-logo-big" />
            <h1>Yönetim paneli henüz kurulmadı</h1>
            @if (!api.config()!.ready.auth || api.config()!.dbError === 'DATABASE_URL fehlt') { <p>Vercel ayarlarında şu değişkenler eksik:</p> }
            <ul class="adm-list">
              @if (!api.config()!.supabaseUrl) { <li><code>SUPABASE_URL</code></li> }
              @if (!api.config()!.supabaseAnonKey) { <li><code>SUPABASE_PUBLISHABLE_KEY</code></li> }
              @if (!api.config()!.ready.auth && api.config()!.supabaseUrl && api.config()!.supabaseAnonKey) { <li><code>ADMIN_EMAILS</code> (giriş yapabilecek e-posta adresleri)</li> }
              @if (api.config()!.dbError === 'DATABASE_URL fehlt') { <li><code>DATABASE_URL</code></li> }
            </ul>
            @if (api.config()!.dbError && api.config()!.dbError !== 'DATABASE_URL fehlt') {
              <p><strong>Veritabanına bağlanılamıyor.</strong> Supabase'in cevabı:</p>
              <p class="adm-msg err">{{ api.config()!.dbError }}</p>
              <p class="adm-muted small">
                Sık nedenler: şifre yanlış veya <code>[YOUR-PASSWORD]</code> değiştirilmemiş · şifrede <code>?</code>, <code>#</code>, <code>&#64;</code> gibi
                işaretler var (şifreyi sadece harf ve rakamla yenileyin) · “Transaction pooler” (port 6543) yerine başka adres kopyalandı ·
                tablolar kurulmamış (SQL dosyası çalıştırılmadı).
              </p>
            }
            <p class="adm-muted">Adım adım kurulum: depodaki <code>ADMIN-KURULUM.md</code>.</p>
          </div>
        </div>
      } @else if (!api.session()) {
        <div class="adm-center">
          <form class="adm-card adm-narrow" (submit)="login($event)">
            <img src="/assets/images/logo/breisgau-digital.svg" alt="" class="adm-logo-big" />
            <h1>{{ forgot() ? 'Şifreyi sıfırla' : 'Yönetim paneli' }}</h1>
            <label class="adm-field">E-posta
              <input name="email" type="email" autocomplete="username" required [value]="loginEmail()" (input)="loginEmail.set(val($event))" />
            </label>
            @if (!forgot()) {
              <label class="adm-field">Şifre
                <input name="password" type="password" autocomplete="current-password" required (input)="password.set(val($event))" />
              </label>
            }
            @if (message()) { <p class="adm-msg" [class.err]="isError()">{{ message() }}</p> }
            <button class="btn btn-primary btn-block" [disabled]="busy()">{{ forgot() ? 'Sıfırlama bağlantısı gönder' : 'Giriş yap' }}</button>
            <button type="button" class="adm-link" (click)="toggleForgot()">{{ forgot() ? 'Girişe dön' : 'Şifremi unuttum' }}</button>
          </form>
        </div>
      } @else if (api.mustSetPassword()) {
        <div class="adm-center">
          <form class="adm-card adm-narrow" (submit)="savePassword($event)">
            <h1>Yeni şifre belirleyin</h1>
            <label class="adm-field">Yeni şifre (en az 10 karakter)
              <input type="password" autocomplete="new-password" minlength="10" required (input)="password.set(val($event))" />
            </label>
            @if (message()) { <p class="adm-msg" [class.err]="isError()">{{ message() }}</p> }
            <button class="btn btn-primary btn-block" [disabled]="busy()">Kaydet</button>
          </form>
        </div>
      } @else {
        <header class="adm-top">
          <div class="adm-brand">
            <img src="/assets/images/logo/breisgau-digital.svg" alt="" />
            <span><strong>Breisgau Digital</strong><small>Yönetim</small></span>
          </div>
          <div class="adm-user">
            <span class="adm-muted">{{ api.email() }}</span>
            <a href="/de/" target="_blank" rel="noopener" class="btn btn-secondary btn-small">Siteyi aç</a>
            <button class="btn btn-secondary btn-small" (click)="logout()">Çıkış</button>
          </div>
        </header>
        <nav class="adm-tabs" aria-label="Bölümler">
          @for (t of tabs; track t.id) {
            <button [class.on]="tab() === t.id" (click)="tab.set(t.id)">{{ t.label }}</button>
          }
        </nav>
        <main class="adm-main">
          @switch (tab()) {
            @case ('overview') { <adm-overview (go)="tab.set($any($event))" /> }
            @case ('enquiries') { <adm-enquiries /> }
            @case ('customers') { <adm-customers /> }
            @case ('subscriptions') { <adm-subscriptions /> }
            @case ('invoices') { <adm-invoices /> }
            @case ('cards') { <adm-cards /> }
            @case ('links') { <adm-links /> }
            @case ('prices') { <adm-prices /> }
            @case ('orders') { <adm-orders /> }
            @case ('settings') { <adm-settings /> }
          }
        </main>
      }
    </div>
  `,
})
export class AdminComponent implements OnInit {
  readonly api = inject(AdminApi);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Genel bakış' },
    { id: 'enquiries', label: 'Talepler' },
    { id: 'customers', label: 'Müşteriler' },
    { id: 'subscriptions', label: 'Abonelikler' },
    { id: 'invoices', label: 'Faturalar' },
    { id: 'cards', label: 'NFC kartları' },
    { id: 'links', label: 'NFC linkleri' },
    { id: 'prices', label: 'Fiyatlar' },
    { id: 'orders', label: 'Siparişler' },
    { id: 'settings', label: 'Ayarlar' },
  ];
  readonly tab = signal<Tab>('overview');

  readonly loginEmail = signal('');
  readonly password = signal('');
  readonly forgot = signal(false);
  readonly busy = signal(false);
  readonly message = signal('');
  readonly isError = signal(false);

  constructor() {
    inject(Title).setTitle('Yönetim · Breisgau Digital');
    inject(Meta).updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  ngOnInit(): void {
    if (this.browser)
      this.api.init().catch((e: unknown) =>
        this.api.config.set({
          supabaseUrl: '',
          supabaseAnonKey: '',
          apiError: e instanceof Error ? e.message : String(e),
          ready: { db: false, auth: false, stripe: false, deployHook: false },
        }),
      );
  }

  val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  toggleForgot() {
    this.forgot.update((v) => !v);
    this.message.set('');
  }

  private note(text: string, error = false) {
    this.message.set(text);
    this.isError.set(error);
  }

  async login(e: Event) {
    e.preventDefault();
    this.busy.set(true);
    this.note('');
    try {
      if (this.forgot()) {
        await this.api.recover(this.loginEmail());
        this.note('Kayıtlıysa bu adrese bir sıfırlama bağlantısı gönderildi.');
      } else {
        await this.api.login(this.loginEmail(), this.password());
      }
    } catch (err) {
      this.note(errorText(err), true);
    } finally {
      this.busy.set(false);
    }
  }

  async savePassword(e: Event) {
    e.preventDefault();
    this.busy.set(true);
    try {
      await this.api.setPassword(this.password());
      this.note('');
    } catch (err) {
      this.note(errorText(err), true);
    } finally {
      this.busy.set(false);
    }
  }

  async logout() {
    await this.api.logout();
  }
}
