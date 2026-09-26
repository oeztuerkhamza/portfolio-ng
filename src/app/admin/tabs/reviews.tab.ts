import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { dateTime } from '../labels';

/** Eine Bewertung, wie sie in der eigenen Datenbank liegt. */
interface Review {
  id: string;
  fetched_at: string;
  source: string;
  external_id: string;
  author: string;
  rating: number;
  text: string;
  published_at: string | null;
  published_label: string | null;
  lang: string | null;
  hidden: boolean;
}

/** Was beim letzten Holen passiert ist — steht unter `google_reviews`. */
interface Summary {
  rating?: number | null;
  total?: number | null;
  fetched_at?: string | null;
  via?: string | null;
  error?: string | null;
  detail?: string | null;
}

interface Payload {
  reviews: Review[];
  summary: Summary;
  placeId: string;
  hasKey: boolean;
  maxAgeDays: number;
}

const VIA: Record<string, string> = {
  'places-new': 'Places API (New)',
  'places-legacy': 'Places API (eski)',
};

/**
 * Google-Bewertungen auf der Website.
 *
 * Geholt wird auf dem Server und einmal am Tag durch den Cron — der Knopf
 * hier ist nur für „jetzt sofort". Was die Seite zeigt, kommt immer aus der
 * eigenen Datenbank, nie aus einer Anfrage im Browser des Besuchers.
 */
@Component({
  selector: 'adm-reviews',
  standalone: true,
  template: `
    <div class="adm-row-head">
      <h2>Google yorumları</h2>
      <button class="btn btn-primary btn-small" [disabled]="busy()" (click)="fetchNow()">
        {{ busy() ? 'Alınıyor…' : 'Şimdi al' }}
      </button>
    </div>
    <p class="adm-muted">
      Yorumlar <strong>sunucudan</strong> alınır ve burada saklanır; ziyaretçinin tarayıcısı Google'a hiç bağlanmaz.
      Bu yüzden yorumlar için çerez onayı gerekmez ve yazarların profil fotoğrafları yerine baş harfleri gösterilir.
      Günde bir kez otomatik yenilenir; yeni bir yorum geldiğinde site de kendiliğinden yeniden yayınlanır.
      Google şartları uzun süre saklamaya izin vermediği için <strong>{{ maxAge() }} günden</strong> eski
      yorumlar otomatik silinir.
    </p>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }
    @if (note()) { <p class="adm-msg ok">{{ note() }}</p> }

    <section class="adm-card">
      <h3>Kaynak</h3>
      <label class="adm-field">Google Place ID
        <input [value]="placeId()" (input)="placeId.set(val($event))" placeholder="ChIJ…" spellcheck="false" />
      </label>
      <p class="adm-muted small">
        İşletmenizin Google'daki kimliği. Google'ın “Place ID Finder” sayfasında işletme adını yazıp bulabilirsiniz;
        <code>ChIJ</code> ile başlayan uzun bir metindir.
      </p>
      <div class="adm-actions">
        <button class="btn btn-secondary btn-small" [disabled]="busy()" (click)="savePlace()">Kaydet</button>
        @if (saved()) { <span class="adm-msg ok">Kaydedildi ✓</span> }
      </div>

      @if (!hasKey()) {
        <p class="adm-msg err">
          <code>GOOGLE_API_KEY</code> eksik. Vercel → Settings → Environment Variables bölümüne ekleyip yeniden
          yayınlayın; anahtar olmadan yorumlar alınamaz.
        </p>
      }
    </section>

    @if (summary(); as s) {
      <section class="adm-card">
        <h3>Son deneme</h3>
        @if (!s.fetched_at) {
          <p class="adm-muted">Henüz denenmedi. “Şimdi al” ile başlayın.</p>
        } @else {
          <dl class="adm-kv">
            <dt>Zaman</dt><dd>{{ dateTime(s.fetched_at) }}</dd>
            @if (s.via) { <dt>Yol</dt><dd>{{ via(s.via) }}</dd> }
            @if (s.rating) { <dt>Ortalama</dt><dd>{{ s.rating }} / 5</dd> }
            @if (s.total) { <dt>Toplam yorum</dt><dd>{{ s.total }}</dd> }
            <dt>Durum</dt>
            <dd>
              @if (s.error) { <span class="adm-msg err">{{ s.error }}</span> } @else { <span class="adm-msg ok">Başarılı</span> }
            </dd>
          </dl>
          @if (s.detail) { <p class="adm-muted small">Google'ın cevabı: <code>{{ s.detail }}</code></p> }
        }
      </section>
    }

    <div class="adm-row-head">
      <h3>Sitede gösterilenler ({{ shown() }})</h3>
      @if (items().length) { <span class="adm-muted">{{ items().length }} kayıt saklanıyor</span> }
    </div>
    @for (r of items(); track r.id) {
      <article class="adm-card adm-item" [class.dim]="r.hidden">
        <div class="adm-item-head">
          <div>
            <strong>{{ r.author }}</strong>
            <span class="adm-stars" [attr.aria-label]="r.rating + ' / 5'">{{ stars(r.rating) }}</span>
            <div class="adm-muted small">
              {{ r.published_label || date(r.published_at) }} · alındı: {{ dateTime(r.fetched_at) }}
              @if (r.lang) { · {{ r.lang }} }
            </div>
          </div>
        </div>
        @if (r.text) { <p class="adm-quote">{{ r.text }}</p> } @else { <p class="adm-muted small">(Yalnızca yıldız, metin yok.)</p> }
        <div class="adm-actions">
          <label class="adm-toggle">
            <input type="checkbox" [checked]="!r.hidden" (change)="patch(r, { hidden: !checked($event) })" /> Sitede göster
          </label>
          <button class="adm-link danger" (click)="remove(r)">Sil</button>
        </div>
      </article>
    } @empty {
      <p class="adm-muted">Henüz yorum alınmadı.</p>
    }

    <p class="adm-muted small">
      Yorum metinleri Google şartları gereği <strong>olduğu gibi</strong> gösterilir — kısaltmak veya düzeltmek
      yasaktır. İstemediğiniz bir yorumu tamamen gizleyebilirsiniz; ortalama not Google'ın verdiği nottur ve
      gizlemekle değişmez.
    </p>
  `,
})
export class ReviewsTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Review[]>([]);
  readonly summary = signal<Summary | null>(null);
  readonly placeId = signal('');
  readonly hasKey = signal(true);
  readonly maxAge = signal(30);
  readonly error = signal('');
  readonly busy = signal(false);
  readonly saved = signal(false);
  /** Ergebnis des letzten Knopfdrucks, im Klartext. */
  readonly note = signal('');
  readonly dateTime = dateTime;

  /** Wie viele davon der Besucher wirklich sieht. */
  readonly shown = computed(() => this.items().filter((r) => !r.hidden).length);

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    try {
      const data = await this.api.req<Payload>('GET', '/reviews');
      this.items.set(data.reviews ?? []);
      this.summary.set(data.summary ?? {});
      this.placeId.set(data.placeId ?? '');
      this.hasKey.set(!!data.hasKey);
      this.maxAge.set(data.maxAgeDays || 30);
    } catch (e) {
      this.error.set(errorText(e));
    }
  }

  val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }
  checked(e: Event) {
    return (e.target as HTMLInputElement).checked;
  }

  via(key: string) {
    return VIA[key] ?? key;
  }

  stars(n: number) {
    return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
  }

  date(v: string | null) {
    return v ? new Date(v).toLocaleDateString('de-DE') : '—';
  }

  async savePlace() {
    this.busy.set(true);
    this.saved.set(false);
    try {
      await this.api.req('PUT', '/reviews/place', { placeId: this.placeId().trim() });
      this.error.set('');
      this.saved.set(true);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }

  /**
   * Erst die Place ID sichern, dann holen: sonst holt der Knopf mit der alten
   * Kennung und man sucht den Fehler an der falschen Stelle.
   */
  async fetchNow() {
    this.busy.set(true);
    this.note.set('');
    try {
      await this.api.req('PUT', '/reviews/place', { placeId: this.placeId().trim() });
      const res = await this.api.req<{ ok: boolean; saved: number; changed: boolean; error?: string }>('POST', '/reviews/fetch');
      this.error.set(res.ok ? '' : (res.error ?? 'Alınamadı'));
      if (res.ok) {
        // Ob etwas Neues dabei war, entscheidet, ob die Seite neu gebaut
        // werden muss — sonst drückt man umsonst auf „Siteyi güncelle".
        this.note.set(
          res.changed
            ? `${res.saved} yorum alındı, değişiklik var — sitede görünmesi için “Fiyatlar → Siteyi güncelle”.`
            : `${res.saved} yorum alındı, sitede görünenden farkı yok.`,
        );
      }
      await this.load();
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }

  async patch(r: Review, data: Partial<Review>) {
    try {
      await this.api.req('PATCH', `/reviews/${r.id}`, data);
      this.error.set('');
    } catch (e) {
      this.error.set(errorText(e));
    }
    await this.load();
  }

  async remove(r: Review) {
    if (!confirm(`“${r.author}” yorumu silinsin mi? Sonraki otomatik alımda Google'dan tekrar gelebilir — kalıcı olarak gizlemek için “Sitede göster” işaretini kaldırın.`)) return;
    try {
      await this.api.req('DELETE', `/reviews/${r.id}`);
    } catch (e) {
      this.error.set(errorText(e));
    }
    await this.load();
  }
}
