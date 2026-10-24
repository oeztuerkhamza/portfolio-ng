import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';

type Status = 'new' | 'accepted' | 'done' | 'cancelled';

interface Line {
  name: string;
  price?: string;
  qty: number;
}

interface TableOrder {
  id: string;
  created_at: string;
  menu_id: string;
  menu_name: string;
  table_label: string;
  items: Line[];
  total_cents: number | null;
  note: string | null;
  status: Status;
}

const POLL_MS = 5000;
/** Eine neue Bestellung, die so lange unbeachtet bleibt, wird rot. */
const LATE_MIN = 5;

/**
 * Bestell-Board für den Service: alle Tischbestellungen auf einen Blick, Neu → In Arbeit →
 * Erledigt. Lädt alle 5 Sekunden nach und meldet neue Bestellungen mit einem Ton und im
 * Tab-Titel. Die Bestellungen kommen von den Speisekarten (/m/…), siehe „Menüler".
 */
@Component({
  selector: 'adm-table-orders',
  standalone: true,
  template: `
    <div class="adm-row-head">
      <h2>Masa siparişleri</h2>
      <div class="tbo-tools">
        @if (menus().length > 1) {
          <select [value]="menuFilter()" (change)="menuFilter.set(val($event))" aria-label="İşletme">
            <option value="">Tüm işletmeler</option>
            @for (m of menus(); track m.id) { <option [value]="m.id">{{ m.name }}</option> }
          </select>
        }
        <label class="adm-toggle"><input type="checkbox" [checked]="sound()" (change)="setSound(checked($event))" /> Sesli uyarı</label>
        <span class="tbo-live" [class.off]="!live()" [title]="live() ? 'Canlı: 5 saniyede bir yenilenir' : 'Bağlantı yok'">{{ live() ? 'Canlı' : 'Bağlantı yok' }}</span>
      </div>
    </div>
    <p class="adm-muted">
      Masalardan gelen siparişler burada toplanır. Yeni sipariş gelince ses çalar ve sekme başlığında görünür.
      <strong>Ses için sayfaya bir kez dokunun</strong> (tarayıcılar sesi ancak kullanıcı tıklayınca açar).
    </p>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    <div class="tbo-stats">
      <span><strong>{{ columns().new.length }}</strong> yeni</span>
      <span><strong>{{ columns().accepted.length }}</strong> hazırlanıyor</span>
      <span><strong>{{ doneToday() }}</strong> teslim edildi</span>
      @if (revenue() !== null) { <span>Toplam <strong>{{ eur(revenue()!) }}</strong></span> }
    </div>

    <div class="tbo-board">
      @for (col of cols; track col.id) {
        <section class="tbo-col" [attr.data-col]="col.id">
          <h3>{{ col.label }} <span class="tbo-count">{{ columns()[col.id].length }}</span></h3>
          @for (o of columns()[col.id]; track o.id) {
            <article class="adm-card tbo-card" [class.late]="isLate(o)" [class.fresh]="fresh().has(o.id)" [class.dim]="o.status === 'done' || o.status === 'cancelled'">
              <header>
                <strong class="tbo-table">Masa {{ o.table_label }}</strong>
                <span class="tbo-age" [class.late]="isLate(o)">{{ age(o) }}</span>
              </header>
              @if (menus().length > 1) { <p class="adm-muted tbo-menu">{{ o.menu_name }}</p> }
              <ul class="tbo-lines">
                @for (l of o.items; track l.name) {
                  <li><b>{{ l.qty }}×</b> {{ l.name }}@if (l.price) { <span class="adm-muted"> {{ l.price }}</span> }</li>
                }
              </ul>
              @if (o.note) { <p class="tbo-note">“{{ o.note }}”</p> }
              <footer>
                @if (o.total_cents !== null) { <span class="adm-muted">{{ eur(o.total_cents) }}</span> }
                @if (o.status === 'cancelled') { <span class="adm-muted">İptal edildi</span> }
                <span class="tbo-actions">
                  @if (o.status === 'new') { <button class="btn btn-primary btn-small" (click)="setStatus(o, 'accepted')">Kabul et</button> }
                  @if (o.status === 'accepted') { <button class="btn btn-primary btn-small" (click)="setStatus(o, 'done')">Teslim edildi</button> }
                  @if (o.status === 'new' || o.status === 'accepted') { <button class="adm-link danger" (click)="cancel(o)">İptal</button> }
                  @if (o.status === 'done' || o.status === 'cancelled') { <button class="adm-link" (click)="setStatus(o, 'new')">Geri al</button> }
                </span>
              </footer>
            </article>
          } @empty {
            <p class="adm-muted tbo-empty">{{ col.empty }}</p>
          }
        </section>
      }
    </div>
  `,
})
export class TableOrdersTab implements OnInit, OnDestroy {
  private readonly api = inject(AdminApi);
  readonly orders = signal<TableOrder[]>([]);
  readonly error = signal('');
  readonly live = signal(true);
  readonly sound = signal(true);
  readonly menuFilter = signal('');
  readonly fresh = signal<Set<string>>(new Set());
  readonly now = signal(Date.now());

  readonly cols: { id: 'new' | 'accepted' | 'finished'; label: string; empty: string }[] = [
    { id: 'new', label: 'Yeni', empty: 'Yeni sipariş yok.' },
    { id: 'accepted', label: 'Hazırlanıyor', empty: 'Hazırlanan sipariş yok.' },
    { id: 'finished', label: 'Tamamlanan (son 12 saat)', empty: 'Henüz yok.' },
  ];
  readonly eur = (cents: number) => (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

  readonly menus = computed(() => {
    const seen = new Map<string, string>();
    for (const o of this.orders()) seen.set(o.menu_id, o.menu_name);
    return [...seen].map(([id, name]) => ({ id, name }));
  });
  private readonly visible = computed(() => this.orders().filter((o) => !this.menuFilter() || o.menu_id === this.menuFilter()));
  readonly columns = computed(() => {
    const v = this.visible();
    return {
      new: v.filter((o) => o.status === 'new'),
      accepted: v.filter((o) => o.status === 'accepted'),
      finished: v.filter((o) => o.status === 'done' || o.status === 'cancelled').reverse(),
    };
  });
  readonly doneToday = computed(() => this.visible().filter((o) => o.status === 'done').length);
  /** Summe der erledigten Bestellungen, nur wenn jede einen berechenbaren Preis hat. */
  readonly revenue = computed(() => {
    const done = this.visible().filter((o) => o.status === 'done');
    return done.length && done.every((o) => o.total_cents !== null) ? done.reduce((n, o) => n + (o.total_cents ?? 0), 0) : null;
  });

  private timer: ReturnType<typeof setInterval> | undefined;
  private known = new Set<string>();
  private first = true;
  private audio: AudioContext | undefined;
  private title = '';

  async ngOnInit() {
    this.title = document.title;
    try {
      this.sound.set(localStorage.getItem('adm-tbo-sound') !== '0');
    } catch {
      /* Speicher nicht verfügbar */
    }
    document.addEventListener('pointerdown', this.unlock, { once: true });
    await this.load();
    this.timer = setInterval(() => {
      this.now.set(Date.now());
      void this.load();
    }, POLL_MS);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    document.removeEventListener('pointerdown', this.unlock);
    document.title = this.title;
  }

  val(e: Event) {
    return (e.target as HTMLSelectElement).value;
  }
  checked(e: Event) {
    return (e.target as HTMLInputElement).checked;
  }

  setSound(on: boolean) {
    this.sound.set(on);
    try {
      localStorage.setItem('adm-tbo-sound', on ? '1' : '0');
    } catch {
      /* egal */
    }
    if (on) this.beep();
  }

  private readonly unlock = () => {
    this.audio ??= new AudioContext();
    void this.audio.resume();
  };

  private beep() {
    if (!this.sound()) return;
    try {
      this.audio ??= new AudioContext();
      const ctx = this.audio;
      void ctx.resume();
      [0, 0.22].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = i ? 1046 : 784;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.22);
      });
    } catch {
      /* Ton nicht möglich: die Karte leuchtet trotzdem */
    }
  }

  private async load() {
    try {
      const rows = await this.api.req<TableOrder[]>('GET', '/menu-orders');
      const added = rows.filter((o) => o.status === 'new' && !this.known.has(o.id));
      this.known = new Set(rows.map((o) => o.id));
      this.orders.set(rows);
      this.live.set(true);
      this.error.set('');
      if (!this.first && added.length) {
        this.fresh.update((s) => new Set([...s, ...added.map((o) => o.id)]));
        this.beep();
        setTimeout(() => this.fresh.update((s) => new Set([...s].filter((id) => !added.some((o) => o.id === id)))), 8000);
      }
      this.first = false;
      const open = rows.filter((o) => o.status === 'new').length;
      document.title = open ? `(${open}) Yeni sipariş · ${this.title}` : this.title;
    } catch (e) {
      this.live.set(false);
      this.error.set(errorText(e));
    }
  }

  age(o: TableOrder) {
    const min = Math.max(0, Math.floor((this.now() - new Date(o.created_at).getTime()) / 60000));
    return min < 1 ? 'şimdi' : min < 60 ? `${min} dk` : `${Math.floor(min / 60)} sa ${min % 60} dk`;
  }

  isLate(o: TableOrder) {
    return o.status === 'new' && this.now() - new Date(o.created_at).getTime() > LATE_MIN * 60000;
  }

  async setStatus(o: TableOrder, status: Status) {
    // Sofort sichtbar machen, der nächste Abruf bestätigt es.
    this.orders.update((list) => list.map((x) => (x.id === o.id ? { ...x, status } : x)));
    try {
      await this.api.req('PATCH', `/menu-orders/${o.id}`, { status });
    } catch (e) {
      this.error.set(errorText(e));
    }
    await this.load();
  }

  async cancel(o: TableOrder) {
    if (!confirm(`Masa ${o.table_label}: sipariş iptal edilsin mi?`)) return;
    await this.setStatus(o, 'cancelled');
  }
}
