import { Component, ElementRef, Injector, OnDestroy, OnInit, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { AdminApi, ApiError, errorText } from '../admin-api.service';
import { InvoiceDocComponent } from '../invoice/invoice-doc.component';
import { invoicePdf } from '../invoice/invoice-pdf';
import {
  EMPTY_PROFILE,
  INVOICE_STATUS,
  Invoice,
  InvoiceItem,
  InvoiceProfile,
  deDate,
  isoDay,
  money,
  totals,
} from '../invoice/invoice.model';
import { dateTime } from '../labels';
import type { Customer } from './customers.tab';

interface Price {
  key: string;
  grp: string;
  label: string;
  value: string;
  unit: string;
}

interface Sub {
  id: string;
  customer_id: string;
  customer_name: string;
  plan: string;
  monthly_price: string;
  setup_fee: string;
  status: string;
}

type Mode = 'list' | 'edit' | 'view' | 'profile';
type Filter = 'all' | Invoice['status'];

const PLAN_NAME: Record<string, string> = { basis: 'Basis', business: 'Business', premium: 'Premium' };
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

@Component({
  selector: 'adm-invoices',
  standalone: true,
  imports: [InvoiceDocComponent],
  template: `
    @switch (mode()) {
      @case ('list') {
        <div class="adm-row-head">
          <h2>Faturalar</h2>
          <div class="adm-actions">
            <button class="btn btn-secondary btn-small" (click)="mode.set('profile')">Fatura bilgileri</button>
            <button class="btn btn-primary btn-small" (click)="newInvoice()">+ Yeni fatura</button>
          </div>
        </div>
        @if (error()) { <p class="adm-msg err">{{ error() }}</p> }
        @if (!profileReady()) {
          <p class="adm-msg">
            Kesin fatura kesebilmek için önce <button class="adm-link" (click)="mode.set('profile')">Fatura bilgileri</button>
            bölümüne <strong>Steuernummer</strong> ve <strong>IBAN</strong> girin.
          </p>
        }

        <div class="adm-stats">
          <button class="adm-stat" (click)="filter.set('offen')"><strong>{{ money(stats().open) }}</strong><span>Açık alacak</span></button>
          <button class="adm-stat" (click)="filter.set('offen')"><strong [class.warn]="stats().overdue">{{ stats().overdue }}</strong><span>Vadesi geçmiş</span></button>
          <button class="adm-stat" (click)="filter.set('all')"><strong>{{ money(stats().year) }}</strong><span>{{ year }} ciro (iptaller hariç)</span></button>
          <button class="adm-stat" (click)="filter.set('entwurf')"><strong>{{ stats().drafts }}</strong><span>Taslak</span></button>
        </div>

        <div class="adm-filters">
          @for (f of filters; track f.id) {
            <button [class.on]="filter() === f.id" (click)="filter.set(f.id)">{{ f.label }}</button>
          }
        </div>

        <div class="adm-table-wrap">
          <table class="adm-table adm-inv-table">
            <thead><tr><th>No.</th><th>Tarih</th><th>Müşteri</th><th class="num">Tutar</th><th>Durum</th></tr></thead>
            <tbody>
              @for (i of shown(); track i.id) {
                <tr class="adm-click" (click)="open(i)" [class.dim]="i.status === 'storniert'">
                  <td><strong>{{ i.number ?? 'Taslak' }}</strong>@if (i.kind === 'storno') { <div class="adm-muted small">Storno</div> }</td>
                  <td>{{ d(i.issue_date) }}</td>
                  <td>{{ i.recipient_business || i.recipient_name || '—' }}@if (i.recipient_business && i.recipient_name) { <div class="adm-muted small">{{ i.recipient_name }}</div> }</td>
                  <td class="num">{{ money(i.gross_total) }}</td>
                  <td>
                    <span class="adm-pill" [attr.data-s]="overdue(i) ? 'late' : i.status">{{ overdue(i) ? 'Vadesi geçti' : statusText[i.status] }}</span>
                    @if (i.status === 'offen') { <div class="adm-muted small">vade {{ d(i.due_date) }}</div> }
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="5" class="adm-muted">Henüz fatura yok. “+ Yeni fatura” ile başlayın.</td></tr>
              }
            </tbody>
          </table>
        </div>
      }

      @case ('profile') {
        <div class="adm-row-head">
          <h2>Fatura bilgileri</h2>
          <button class="btn btn-secondary btn-small" (click)="mode.set('list')">← Faturalar</button>
        </div>
        <p class="adm-muted">Her faturanın başlığında ve alt kısmında görünür. Kesinleşmiş faturalar o anki bilgileri saklar; burada yapılan değişiklik eski faturaları etkilemez.</p>
        @if (error()) { <p class="adm-msg err">{{ error() }}</p> }
        <form class="adm-card" (submit)="saveProfile($event)">
          <h3>Firma</h3>
          <div class="adm-grid2">
            <label class="adm-field">Firma adı<input [value]="profile().company" (input)="setProfile('company', val($event))" /></label>
            <label class="adm-field">Sahibi (Inhaber)<input [value]="profile().owner" (input)="setProfile('owner', val($event))" /></label>
            <label class="adm-field">Adres<input [value]="profile().street" (input)="setProfile('street', val($event))" /></label>
            <label class="adm-field">PLZ ve şehir<input [value]="profile().city" (input)="setProfile('city', val($event))" /></label>
            <label class="adm-field">Telefon<input [value]="profile().phone" (input)="setProfile('phone', val($event))" /></label>
            <label class="adm-field">E-posta<input type="email" [value]="profile().email" (input)="setProfile('email', val($event))" /></label>
            <label class="adm-field">Web sitesi<input [value]="profile().web" (input)="setProfile('web', val($event))" /></label>
          </div>

          <h3>Vergi</h3>
          <div class="adm-grid2">
            <label class="adm-field">Steuernummer (Finanzamt'tan) *<input placeholder="06/123/45678" [value]="profile().tax_number" (input)="setProfile('tax_number', val($event))" /></label>
            <label class="adm-field">USt-IdNr. (varsa)<input placeholder="DE123456789" [value]="profile().vat_id" (input)="setProfile('vat_id', val($event))" /></label>
          </div>
          <label class="adm-toggle">
            <input type="checkbox" [checked]="profile().small_business" (change)="setProfile('small_business', checked($event))" />
            Kleinunternehmer (§ 19 UStG) — faturada KDV yok
          </label>
          <p class="adm-muted small">Yeni faturalar bu ayarla başlar; tek tek faturada değiştirilebilir. Kleinunternehmer değilseniz faturaya %19 USt eklenir.</p>

          <h3>Banka</h3>
          <div class="adm-grid2">
            <label class="adm-field">IBAN *<input placeholder="DE00 0000 0000 0000 0000 00" [value]="profile().iban" (input)="setProfile('iban', val($event))" /></label>
            <label class="adm-field">BIC<input [value]="profile().bic" (input)="setProfile('bic', val($event))" /></label>
            <label class="adm-field">Banka adı<input placeholder="Sparkasse Freiburg-Nördlicher Breisgau" [value]="profile().bank" (input)="setProfile('bank', val($event))" /></label>
            <label class="adm-field">Ödeme süresi (gün)<input type="number" min="0" max="120" [value]="profile().due_days" (input)="setProfile('due_days', +val($event))" /></label>
          </div>

          <h3>Metinler</h3>
          <label class="adm-field">Giriş metni („Sehr geehrte Damen und Herren," sonrası)<textarea rows="2" [value]="profile().intro" (input)="setProfile('intro', val($event))"></textarea></label>
          <label class="adm-field">Kapanış<input [value]="profile().closing" (input)="setProfile('closing', val($event))" /></label>

          <div class="adm-actions">
            <button class="btn btn-primary btn-small" [disabled]="busy()">Kaydet</button>
            @if (saved()) { <span class="adm-ok">Kaydedildi ✓</span> }
          </div>
        </form>
      }

      @case ('edit') {
        @let c = cur();
        <div class="adm-row-head">
          <h2>{{ c.id ? 'Taslak fatura' : 'Yeni fatura' }}</h2>
          <button class="btn btn-secondary btn-small" (click)="back()">← Faturalar</button>
        </div>
        @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

        <div class="adm-inv-layout">
          <div>
            <section class="adm-card">
              <h3>Alıcı</h3>
              <label class="adm-field">Kayıtlı müşteriden doldur
                <select (change)="pickCustomer(val($event))">
                  <option value="">— müşteri seçin —</option>
                  @for (k of customers(); track k.id) {
                    <option [value]="k.id" [selected]="k.id === c.customer_id">{{ k.business || k.name }}@if (k.business) { ({{ k.name }}) }</option>
                  }
                </select>
              </label>
              <div class="adm-grid2">
                <label class="adm-field">İşletme<input [value]="c.recipient_business ?? ''" (input)="set('recipient_business', val($event))" /></label>
                <label class="adm-field">Ad Soyad *<input [value]="c.recipient_name" (input)="set('recipient_name', val($event))" /></label>
                <label class="adm-field">Adres<input [value]="c.recipient_street ?? ''" (input)="set('recipient_street', val($event))" /></label>
                <label class="adm-field">PLZ ve şehir<input [value]="c.recipient_city ?? ''" (input)="set('recipient_city', val($event))" /></label>
              </div>
              <label class="adm-field">E-posta (kesinleşince fatura buraya otomatik gönderilir)<input type="email" [value]="c.recipient_email ?? ''" (input)="set('recipient_email', val($event))" /></label>
            </section>

            <section class="adm-card">
              <h3>Tarihler</h3>
              <div class="adm-grid2">
                <label class="adm-field">Fatura tarihi<input type="date" [value]="c.issue_date" (input)="set('issue_date', val($event))" /></label>
                <label class="adm-field">Ödeme süresi (gün)<input type="number" min="0" max="120" [value]="c.due_days" (input)="set('due_days', +val($event))" /></label>
              </div>
              <label class="adm-field">Hizmet tarihi / dönemi
                <input placeholder="ör. 24.09.2026 veya Oktober 2026 — boşsa fatura tarihi" [value]="c.service_period ?? ''" (input)="set('service_period', val($event))" />
              </label>
            </section>

            <section class="adm-card">
              <h3>Kalemler</h3>
              <div class="adm-inv-items">
                @for (it of c.items; track $index; let i = $index) {
                  <div class="adm-inv-item">
                    <label class="adm-field desc">Açıklama<textarea rows="2" [value]="it.description" (input)="setItem(i, 'description', val($event))"></textarea></label>
                    <label class="adm-field">Adet<input type="number" step="0.01" [value]="it.qty" (input)="setItem(i, 'qty', num($event))" /></label>
                    <label class="adm-field">Birim<input [value]="it.unit" placeholder="Stk." (input)="setItem(i, 'unit', val($event))" /></label>
                    <label class="adm-field">Birim fiyat €<input type="number" step="0.01" [value]="it.unit_price" (input)="setItem(i, 'unit_price', num($event))" /></label>
                    <button type="button" class="adm-link danger" (click)="removeItem(i)" aria-label="Kalemi sil">Sil</button>
                  </div>
                }
              </div>
              <div class="adm-actions adm-inv-add">
                <button type="button" class="btn btn-secondary btn-small" (click)="addItem()">+ Boş kalem</button>
                <select (change)="addPrice(val($event)); reset($event)">
                  <option value="">+ Fiyat listesinden…</option>
                  @for (p of shopPrices(); track p.key) { <option [value]="p.key">{{ p.grp }} · {{ p.label }} — {{ money(p.value) }}</option> }
                </select>
                @if (subsFor().length) {
                  <select (change)="addSub(val($event)); reset($event)">
                    <option value="">+ Abonelikten…</option>
                    @for (s of subsFor(); track s.id) {
                      <option [value]="s.id + ':m'">{{ s.customer_name }} · {{ plan(s.plan) }} aylık — {{ money(s.monthly_price) }}</option>
                      @if (+s.setup_fee) { <option [value]="s.id + ':s'">{{ s.customer_name }} · {{ plan(s.plan) }} kurulum — {{ money(s.setup_fee) }}</option> }
                    }
                  </select>
                }
              </div>
              <p class="adm-inv-total">Toplam: <strong>{{ money(sum().gross) }}</strong></p>
            </section>

            <section class="adm-card">
              <h3>Vergi ve notlar</h3>
              <label class="adm-toggle">
                <input type="checkbox" [checked]="c.small_business" (change)="set('small_business', checked($event))" />
                Kleinunternehmer (§ 19 UStG) — KDV yok
              </label>
              @if (!c.small_business) {
                <label class="adm-field">KDV oranı
                  <select (change)="set('vat_rate', +val($event))">
                    <option value="19" [selected]="+c.vat_rate === 19">19 %</option>
                    <option value="7" [selected]="+c.vat_rate === 7">7 %</option>
                  </select>
                </label>
              }
              <label class="adm-field">Giriş metni (boşsa standart metin)<textarea rows="2" [placeholder]="profile().intro" [value]="c.intro ?? ''" (input)="set('intro', val($event))"></textarea></label>
              <label class="adm-field">Not (faturada görünür)<textarea rows="2" [value]="c.notes ?? ''" (input)="set('notes', val($event))"></textarea></label>
            </section>

            <div class="adm-actions">
              <button class="btn btn-primary btn-small" [disabled]="busy()" (click)="finalize()">Kesinleştir ve numara ver</button>
              <button class="btn btn-secondary btn-small" [disabled]="busy()" (click)="saveDraft()">Taslağı kaydet</button>
              <button class="btn btn-secondary btn-small" (click)="print()">Önizleme yazdır</button>
              @if (c.id) { <button class="adm-link danger" (click)="removeDraft()">Taslağı sil</button> }
              @if (saved()) { <span class="adm-ok">Kaydedildi ✓</span> }
            </div>
            <p class="adm-muted small">Kesinleşen fatura sıradaki numarayı alır (RE-{{ year }}-0001, 0002 …) ve artık değiştirilemez. Hata olursa “Storno” ile iptal edilip yenisi kesilir.</p>
          </div>

          <div class="adm-inv-preview-col">
            <div class="adm-inv-preview" #preview>
              <div [style.zoom]="zoom()"><adm-invoice-doc [invoice]="c" [profile]="profile()" /></div>
            </div>
          </div>
        </div>
      }

      @case ('view') {
        @let c = cur();
        <div class="adm-row-head">
          <h2>{{ c.kind === 'storno' ? 'Storno' : 'Fatura' }} {{ c.number }}</h2>
          <button class="btn btn-secondary btn-small" (click)="back()">← Faturalar</button>
        </div>
        @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

        <div class="adm-card adm-inv-bar">
          <div>
            <span class="adm-pill" [attr.data-s]="overdue(c) ? 'late' : c.status">{{ overdue(c) ? 'Vadesi geçti' : statusText[c.status] }}</span>
            <strong class="adm-inv-sum">{{ money(c.gross_total) }}</strong>
            <span class="adm-muted small">
              @if (c.status === 'bezahlt') { ödeme {{ d(c.paid_at) }} } @else if (c.status === 'offen') { vade {{ d(c.due_date) }} }
            </span>
          </div>
          <div class="adm-actions">
            <button class="btn btn-primary btn-small" (click)="print()">PDF indir / Yazdır</button>
            @if (c.recipient_email && c.status !== 'entwurf') {
              <button class="btn btn-secondary btn-small" [disabled]="busy()" (click)="send()">{{ c.sent_at ? 'Tekrar gönder' : 'Müşteriye gönder' }}</button>
            }
            @if (c.kind === 'rechnung' && c.status === 'offen') {
              <label class="adm-inv-paid">
                <input type="date" [value]="today" (input)="paidAt.set(val($event))" />
                <button class="btn btn-secondary btn-small" [disabled]="busy()" (click)="markPaid()">Ödendi</button>
              </label>
            }
            @if (c.kind === 'rechnung' && c.status === 'bezahlt') {
              <button class="btn btn-secondary btn-small" [disabled]="busy()" (click)="markOpen()">Ödenmedi olarak işaretle</button>
            }
            @if (c.kind === 'rechnung') { <button class="btn btn-secondary btn-small" (click)="duplicate()">Kopyala → yeni taslak</button> }
            @if (c.kind === 'rechnung' && (c.status === 'offen' || c.status === 'bezahlt')) {
              <button class="adm-link danger" [disabled]="busy()" (click)="cancel()">Storno (iptal et)</button>
            }
          </div>
        </div>
        @if (c.sent_at) {
          <p class="adm-muted small">{{ c.recipient_email }} adresine gönderildi: {{ dateTime(c.sent_at) }}</p>
        } @else if (c.recipient_email && c.status !== 'entwurf') {
          <p class="adm-muted small">“Müşteriye gönder” faturayı PDF olarak {{ c.recipient_email }} adresine yollar; bir kopyası size de gelir.</p>
        }

        <div class="adm-inv-preview adm-inv-preview-wide" #preview>
          <div [style.zoom]="zoom()"><adm-invoice-doc [invoice]="c" [profile]="profile()" /></div>
        </div>
      }
    }
  `,
})
export class InvoicesTab implements OnInit, OnDestroy {
  private readonly api = inject(AdminApi);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly previewEl = viewChild<ElementRef<HTMLElement>>('preview');
  private observer?: ResizeObserver;

  readonly items = signal<Invoice[]>([]);
  readonly customers = signal<Customer[]>([]);
  readonly prices = signal<Price[]>([]);
  readonly subs = signal<Sub[]>([]);
  readonly profile = signal<InvoiceProfile>(EMPTY_PROFILE);
  readonly mode = signal<Mode>('list');
  readonly cur = signal<Invoice>(this.blank());
  readonly filter = signal<Filter>('all');
  readonly error = signal('');
  readonly busy = signal(false);
  readonly saved = signal(false);
  readonly zoom = signal(0.6);
  readonly paidAt = signal('');

  readonly statusText = INVOICE_STATUS;
  readonly money = money;
  readonly dateTime = dateTime;
  readonly year = new Date().getFullYear();
  readonly today = isoDay(new Date());
  readonly filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'entwurf', label: 'Taslak' },
    { id: 'offen', label: 'Ödeme bekleniyor' },
    { id: 'bezahlt', label: 'Ödendi' },
    { id: 'storniert', label: 'İptal' },
  ];

  readonly shown = computed(() => (this.filter() === 'all' ? this.items() : this.items().filter((i) => i.status === this.filter())));
  readonly stats = computed(() => {
    const all = this.items();
    const y = String(this.year);
    return {
      open: all.filter((i) => i.status === 'offen').reduce((s, i) => s + Number(i.gross_total), 0),
      overdue: all.filter((i) => this.overdue(i)).length,
      year: all
        .filter((i) => i.kind === 'rechnung' && ['offen', 'bezahlt'].includes(i.status) && i.issue_date.startsWith(y))
        .reduce((s, i) => s + Number(i.gross_total), 0),
      drafts: all.filter((i) => i.status === 'entwurf').length,
    };
  });
  readonly profileReady = computed(() => !!(this.profile().tax_number || this.profile().vat_id) && !!this.profile().iban);
  readonly sum = computed(() => totals(this.cur().items, Number(this.cur().vat_rate), this.cur().small_business));
  readonly shopPrices = computed(() => this.prices().filter((p) => p.unit === '€' && Number(p.value) > 0));
  readonly subsFor = computed(() => {
    const active = this.subs().filter((s) => s.status === 'aktiv');
    const cid = this.cur().customer_id;
    return cid ? active.filter((s) => s.customer_id === cid) : active;
  });

  async ngOnInit() {
    await Promise.all([
      this.load(),
      this.api.req<InvoiceProfile>('GET', '/invoices/profile').then((p) => this.profile.set({ ...EMPTY_PROFILE, ...p })),
      this.api.req<Customer[]>('GET', '/customers').then((c) => this.customers.set(c)),
      this.api.req<Price[]>('GET', '/prices').then((p) => this.prices.set(p)),
      this.api.req<Sub[]>('GET', '/subscriptions').then((s) => this.subs.set(s)),
    ]).catch((e) => this.error.set(this.err(e)));
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private async load() {
    this.items.set(await this.api.req<Invoice[]>('GET', '/invoices'));
  }

  private blank(): Invoice {
    const p = this.profile();
    return {
      number: null,
      status: 'entwurf',
      kind: 'rechnung',
      customer_id: null,
      recipient_name: '',
      recipient_business: null,
      recipient_street: null,
      recipient_city: null,
      recipient_email: null,
      issue_date: isoDay(new Date()),
      service_period: null,
      due_days: p.due_days ?? 14,
      items: [],
      vat_rate: p.small_business ? 0 : 19,
      small_business: p.small_business,
      intro: null,
      notes: null,
    };
  }

  /** Vorschau an die verfügbare Breite anpassen (A4 = 210 mm ≈ 794 px). */
  private watchPreview() {
    this.observer?.disconnect();
    setTimeout(() => {
      const el = this.previewEl()?.nativeElement;
      if (!el || typeof ResizeObserver === 'undefined') return;
      this.observer = new ResizeObserver(() => this.zoom.set(Math.min(1, (el.clientWidth - 2) / 794)));
      this.observer.observe(el);
    });
  }

  private show(mode: Mode, inv?: Invoice) {
    if (inv) this.cur.set(structuredClone(inv));
    this.error.set('');
    this.saved.set(false);
    this.mode.set(mode);
    if (mode === 'edit' || mode === 'view') this.watchPreview();
    window.scrollTo({ top: 0 });
  }

  newInvoice() {
    this.show('edit', this.blank());
  }

  open(i: Invoice) {
    this.paidAt.set(this.today);
    this.show(i.status === 'entwurf' ? 'edit' : 'view', i);
  }

  async back() {
    this.mode.set('list');
    this.error.set('');
    await this.load().catch((e) => this.error.set(this.err(e)));
  }

  // ── Bearbeiten ─────────────────────────────────────────
  set<K extends keyof Invoice>(key: K, value: Invoice[K]) {
    this.saved.set(false);
    this.cur.update((c) => ({ ...c, [key]: value }));
  }

  setItem<K extends keyof InvoiceItem>(i: number, key: K, value: InvoiceItem[K]) {
    this.saved.set(false);
    this.cur.update((c) => ({ ...c, items: c.items.map((it, n) => (n === i ? { ...it, [key]: value } : it)) }));
  }

  addItem(item: InvoiceItem = { description: '', qty: 1, unit: 'Stk.', unit_price: 0 }) {
    this.cur.update((c) => ({ ...c, items: [...c.items, item] }));
  }

  removeItem(i: number) {
    this.cur.update((c) => ({ ...c, items: c.items.filter((_, n) => n !== i) }));
  }

  addPrice(key: string) {
    const p = this.prices().find((x) => x.key === key);
    if (!p) return;
    const web = p.grp === 'Website' || p.key.startsWith('sh.');
    this.addItem({ description: p.label.replace(/ ab$/, ''), qty: 1, unit: web ? 'psch.' : 'Stk.', unit_price: Number(p.value) });
  }

  addSub(value: string) {
    const [id, what] = value.split(':');
    const s = this.subs().find((x) => x.id === id);
    if (!s) return;
    if (!this.cur().customer_id) this.pickCustomer(s.customer_id);
    const d = new Date();
    const month = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (what === 's') {
      this.addItem({ description: `Einrichtung Digital-Abo ${this.plan(s.plan)}`, qty: 1, unit: 'psch.', unit_price: Number(s.setup_fee) });
    } else {
      this.addItem({ description: `Digital-Abo ${this.plan(s.plan)} – ${month}`, qty: 1, unit: 'Monat', unit_price: Number(s.monthly_price) });
      if (!this.cur().service_period) this.set('service_period', month);
    }
  }

  pickCustomer(id: string) {
    const k = this.customers().find((x) => x.id === id);
    if (!k) {
      this.set('customer_id', null);
      return;
    }
    this.cur.update((c) => ({
      ...c,
      customer_id: k.id,
      recipient_name: k.name,
      recipient_business: k.business,
      recipient_street: k.street,
      recipient_city: k.city,
      recipient_email: k.email,
    }));
  }

  private async persist(): Promise<Invoice> {
    const c = this.cur();
    const body = { ...c, items: c.items.filter((i) => i.description.trim()) };
    const saved = c.id
      ? await this.api.req<Invoice>('PATCH', `/invoices/${c.id}`, body)
      : await this.api.req<Invoice>('POST', '/invoices', body);
    this.cur.set(saved);
    return saved;
  }

  async saveDraft() {
    await this.run(async () => {
      await this.persist();
      this.saved.set(true);
    });
  }

  async finalize() {
    const c = this.cur();
    if (!c.recipient_name.trim()) return this.error.set('Alıcının adını girin.');
    if (!c.items.some((i) => i.description.trim())) return this.error.set('En az bir kalem ekleyin.');
    const mail = c.recipient_email ? `\n\nKesinleşince ${c.recipient_email} adresine e-postayla gönderilir.` : '';
    if (!confirm(`Fatura kesinleştirilsin mi?\n\nToplam: ${money(this.sum().gross)}\n\nNumara verildikten sonra fatura değiştirilemez.${mail}`)) return;
    const done = await this.run(async () => {
      const saved = await this.persist();
      const fin = await this.api.req<Invoice>('POST', `/invoices/${saved.id}/finalize`);
      this.show('view', fin);
    });
    if (!done) return;
    // Beim Festschreiben legt der Server fehlende Kunden an — Auswahlliste auffrischen.
    if (!c.customer_id) this.api.req<Customer[]>('GET', '/customers').then((k) => this.customers.set(k)).catch(() => undefined);
    await this.autoSend();
  }

  async removeDraft() {
    const c = this.cur();
    if (!c.id || !confirm('Taslak silinsin mi?')) return;
    await this.run(async () => {
      await this.api.req('DELETE', `/invoices/${c.id}`);
      await this.back();
    });
  }

  // ── Festgeschriebene Rechnung ──────────────────────────
  async markPaid() {
    await this.run(async () => {
      this.cur.set(await this.api.req<Invoice>('POST', `/invoices/${this.cur().id}/status`, { status: 'bezahlt', paid_at: this.paidAt() || this.today }));
    });
  }

  async markOpen() {
    await this.run(async () => {
      this.cur.set(await this.api.req<Invoice>('POST', `/invoices/${this.cur().id}/status`, { status: 'offen' }));
    });
  }

  async cancel() {
    const c = this.cur();
    const mail = c.recipient_email ? `\n\nİptal faturası ${c.recipient_email} adresine e-postayla gönderilir.` : '';
    if (!confirm(`${c.number} için Stornorechnung (iptal faturası) oluşturulsun mu?\n\nOrijinal fatura “iptal” olarak işaretlenir. Bu geri alınamaz.${mail}`)) return;
    const done = await this.run(async () => {
      const storno = await this.api.req<Invoice>('POST', `/invoices/${c.id}/cancel`);
      this.show('view', storno);
    });
    if (done) await this.autoSend();
  }

  duplicate() {
    const c = this.cur();
    const copy: Invoice = {
      ...this.blank(),
      customer_id: c.customer_id,
      recipient_name: c.recipient_name,
      recipient_business: c.recipient_business,
      recipient_street: c.recipient_street,
      recipient_city: c.recipient_city,
      recipient_email: c.recipient_email,
      items: structuredClone(c.items),
      small_business: c.small_business,
      vat_rate: c.vat_rate,
      notes: c.notes,
    };
    this.show('edit', copy);
  }

  /** Button „Müşteriye gönder" / „Tekrar gönder". */
  async send() {
    const c = this.cur();
    const again = c.sent_at ? `\n\nBu fatura ${dateTime(c.sent_at)} tarihinde zaten gönderildi.` : '';
    if (!confirm(`${c.number} numaralı fatura ${c.recipient_email} adresine gönderilsin mi?${again}`)) return;
    await this.run(() => this.deliver());
  }

  /**
   * Nach dem Festschreiben und nach einer Stornorechnung geht das Dokument
   * ohne weiteren Klick an den Kunden — sofern eine Adresse hinterlegt ist.
   * Erst nach dem Rendern, damit das PDF die neue Seite zeigt.
   */
  private async autoSend() {
    const c = this.cur();
    if (c.status === 'entwurf' || !c.recipient_email) return;
    await new Promise<void>((resolve) => {
      afterNextRender(() => resolve(), { injector: this.injector });
      setTimeout(resolve, 1000); // falls kein Rendern mehr ansteht, ist die Seite ohnehin aktuell
    });
    await this.run(() => this.deliver());
  }

  /** PDF aus der angezeigten Seite erzeugen und verschicken; der Server schickt eine Kopie ans eigene Postfach. */
  private async deliver() {
    const c = this.cur();
    const sheet = this.host.nativeElement.querySelector<HTMLElement>('.inv-sheet');
    if (!sheet || !c.id) return;
    const pdf = await invoicePdf(sheet, this.docTitle(c));
    const r = await this.api.req<{ sent_at: string | null }>('POST', `/invoices/${c.id}/send`, { pdf });
    this.cur.set({ ...c, sent_at: r.sent_at ?? new Date().toISOString() });
  }

  /** „Rechnung RE-2026-0001 Firma" — Dokumenttitel und Dateiname. */
  private docTitle(c: Invoice): string {
    const who = (c.recipient_business || c.recipient_name || '').replace(/[\\/:*?"<>|]+/g, '').trim();
    return [c.kind === 'storno' ? 'Stornorechnung' : 'Rechnung', c.number ?? 'Entwurf', who].filter(Boolean).join(' ');
  }

  /**
   * Druck/PDF: eine Kopie der Seite direkt an <body> hängen und alles andere
   * per Druck-CSS ausblenden. Der Dokumenttitel wird zum Dateinamen.
   */
  print() {
    const sheet = this.host.nativeElement.querySelector('.inv-sheet');
    if (!sheet) return;
    const c = this.cur();
    const wrap = document.createElement('div');
    wrap.className = 'inv-print-host';
    wrap.appendChild(sheet.cloneNode(true));
    document.body.appendChild(wrap);
    document.body.classList.add('inv-printing');
    const title = document.title;
    document.title = this.docTitle(c);
    const done = () => {
      window.removeEventListener('afterprint', done);
      wrap.remove();
      document.body.classList.remove('inv-printing');
      document.title = title;
    };
    window.addEventListener('afterprint', done);
    window.print();
  }

  // ── Absender ───────────────────────────────────────────
  setProfile<K extends keyof InvoiceProfile>(key: K, value: InvoiceProfile[K]) {
    this.saved.set(false);
    this.profile.update((p) => ({ ...p, [key]: value }));
  }

  async saveProfile(e: Event) {
    e.preventDefault();
    await this.run(async () => {
      this.profile.set({ ...EMPTY_PROFILE, ...(await this.api.req<InvoiceProfile>('PUT', '/invoices/profile', this.profile())) });
      this.saved.set(true);
    });
  }

  // ── Hilfen ─────────────────────────────────────────────
  /** Führt eine Aktion mit Ladeanzeige aus; `true`, wenn sie ohne Fehler durchlief. */
  private async run(fn: () => Promise<void>): Promise<boolean> {
    this.busy.set(true);
    this.error.set('');
    try {
      await fn();
      return true;
    } catch (e) {
      this.error.set(this.err(e));
      return false;
    } finally {
      this.busy.set(false);
    }
  }

  private err(e: unknown): string {
    const code = (e as { code?: string })?.code ?? '';
    const map: Record<string, string> = {
      missing_tax_number: 'Faturada Steuernummer zorunlu. “Fatura bilgileri” bölümünden girin.',
      missing_recipient: 'Alıcının adını girin.',
      missing_items: 'En az bir kalem ekleyin.',
      invalid_items: 'Kalemlerden birinde açıklama veya fiyat eksik/geçersiz.',
      invalid_iban: 'IBAN geçersiz görünüyor.',
      locked: 'Bu fatura kesinleşmiş; değiştirilemez veya silinemez.',
      mail_not_configured: 'E-posta gönderimi kurulmamış: Vercel’de SMTP_HOST, SMTP_USER ve SMTP_PASS girilip Redeploy yapılmalı.',
      invalid_pdf: 'PDF oluşturulamadı. Sayfayı yenileyip tekrar deneyin.',
      not_final: 'Taslak gönderilemez; önce faturayı kesinleştirin.',
      missing_email: 'Alıcının e-posta adresi yok.',
    };
    if (code === 'mail_failed' && e instanceof ApiError) {
      const d = e.detail;
      return d['code'] === 'EAUTH'
        ? 'Mail sunucusu girişi reddetti: Vercel’deki SMTP_USER / SMTP_PASS değerlerini kontrol edin.'
        : `E-posta gönderilemedi (${d['code'] ?? d['smtp'] ?? 'bilinmeyen hata'}). SMTP_HOST ve SMTP_PORT ayarlarını kontrol edin.`;
    }
    return map[code] ?? errorText(e);
  }

  overdue(i: Invoice) {
    return i.status === 'offen' && !!i.due_date && String(i.due_date).slice(0, 10) < this.today;
  }

  plan(p: string) {
    return PLAN_NAME[p] ?? p;
  }

  d(v: unknown) {
    return deDate(v);
  }

  val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  num(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    return v === '' ? 0 : Number(v);
  }

  checked(e: Event) {
    return (e.target as HTMLInputElement).checked;
  }

  reset(e: Event) {
    (e.target as HTMLSelectElement).value = '';
  }
}
