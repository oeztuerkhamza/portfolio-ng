import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { dateTime } from '../labels';
import { EVENT_KINDS } from '../../einladung/invite.model';
import { INVITE_THEMES } from '../../einladung/invite-themes';

interface Invite {
  id: string;
  slug: string;
  created_at: string;
  customer_name: string | null;
  customer_email: string | null;
  active: boolean;
  title: string;
  theme: string;
  date: string;
  guests: number;
  persons: number;
}

interface Created {
  slug: string;
  key: string;
  invite: string;
  planner: string;
}

const KIND_TR: Record<string, string> = {
  wedding: 'Düğün',
  henna: 'Kına gecesi',
  engagement: 'Nişan',
  birthday: 'Doğum günü',
  corporate: 'Kurumsal / toplantı',
  other: 'Diğer',
};

/**
 * Digitale Einladungen im Portal: anlegen, Links für den Kunden holen,
 * Schlüssel erneuern, abschalten. Den Inhalt pflegt der Kunde selbst im
 * Planer — dafür bekommt er den Planer-Link mit Schlüssel.
 */
@Component({
  selector: 'adm-invites',
  standalone: true,
  template: `
    <div class="adm-row-head">
      <h2>Dijital davetiyeler</h2>
      <button class="btn btn-primary btn-small" (click)="formOpen.set(!formOpen())">+ Yeni davetiye</button>
    </div>
    <p class="adm-muted">
      Davetiye <code>{{ origin }}/einladung/…</code> adresinde yayınlanır. Müşteri içerikleri, misafirleri, oturma
      planını ve bütçeyi kendisi <strong>planlayıcıda</strong> yönetir. Planlayıcı linkindeki anahtar sadece bir kez
      gösterilir — kaybolursa yenisini oluşturun.
    </p>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    @if (created(); as c) {
      <div class="adm-card adm-msg ok">
        <strong>Davetiye hazır.</strong> Bu iki linki müşteriye gönderin (anahtar bir daha gösterilmez):
        <p>Davetiye: <code>{{ origin }}{{ c.invite }}</code> <button class="adm-link" (click)="copy(origin + c.invite)">Kopyala</button></p>
        <p>Planlayıcı: <code>{{ origin }}{{ c.planner }}</code> <button class="adm-link" (click)="copy(origin + c.planner)">Kopyala</button></p>
        <button class="adm-link" (click)="created.set(null)">Kapat</button>
      </div>
    }

    @if (formOpen()) {
      <form class="adm-card adm-form" (submit)="create($event)">
        <h3>Yeni davetiye</h3>
        <div class="adm-grid2">
          <label class="adm-field">Başlık / isimler *<input name="title" required maxlength="120" (input)="suggest(val($event))" placeholder="Ayşe & Daniel" /></label>
          <label class="adm-field">Adres adı *<input name="slug" required pattern="[a-z0-9][a-z0-9-]{2,59}" [value]="slug()" (input)="slug.set(val($event))" /></label>
          <label class="adm-field">Tür
            <select name="kind">
              @for (k of kinds; track k) { <option [value]="k">{{ kindTr[k] }}</option> }
            </select>
          </label>
          <label class="adm-field">Tema
            <select name="theme">
              @for (t of themes; track t.id) { <option [value]="t.id">{{ t.name.tr }}</option> }
            </select>
          </label>
          <label class="adm-field">Tarih ve saat *<input name="date" type="datetime-local" required /></label>
          <label class="adm-field">Müşteri adı<input name="customer_name" maxlength="120" /></label>
          <label class="adm-field">Müşteri e-postası<input name="customer_email" type="email" maxlength="200" /></label>
        </div>
        <p class="adm-muted small">Adres: <strong>{{ origin }}/einladung/{{ slug() || '…' }}</strong></p>
        <div class="adm-actions">
          <button class="btn btn-primary btn-small">Oluştur</button>
          <button type="button" class="btn btn-secondary btn-small" (click)="formOpen.set(false)">Vazgeç</button>
        </div>
      </form>
    }

    @for (i of items(); track i.id) {
      <article class="adm-card adm-item" [class.dim]="!i.active">
        <div class="adm-item-head">
          <div>
            <strong>{{ i.title }}</strong>
            <span class="adm-muted"> · {{ i.theme }} · {{ dateTime(i.date) }}</span>
            @if (i.customer_name) { <div class="adm-muted">{{ i.customer_name }} {{ i.customer_email }}</div> }
            <div class="adm-shortlink">
              <code>{{ origin }}/einladung/{{ i.slug }}</code>
              <button class="adm-link" (click)="copy(origin + '/einladung/' + i.slug)">Kopyala</button>
              <a class="adm-link" [href]="'/einladung/' + i.slug" target="_blank" rel="noopener">Aç</a>
            </div>
          </div>
          <div class="adm-scans">
            <strong>{{ i.persons }}</strong><span>kişi geliyor</span>
            <small>{{ i.guests }} yanıt / misafir</small>
          </div>
        </div>
        <div class="adm-actions">
          <label class="adm-toggle"><input type="checkbox" [checked]="i.active" (change)="toggle(i, checked($event))" /> Yayında</label>
          <button class="adm-link" (click)="newKey(i)">Yeni planlayıcı anahtarı</button>
        </div>
      </article>
    } @empty {
      <p class="adm-muted">Henüz davetiye yok. Örnekler: <a href="/de/digitale-einladung" target="_blank">tanıtım sayfası</a>.</p>
    }
  `,
})
export class InvitesTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Invite[]>([]);
  readonly error = signal('');
  readonly formOpen = signal(false);
  readonly slug = signal('');
  readonly created = signal<Created | null>(null);
  readonly origin = typeof location !== 'undefined' ? location.origin : '';
  readonly themes = INVITE_THEMES;
  readonly kinds = EVENT_KINDS;
  readonly kindTr = KIND_TR;
  readonly dateTime = dateTime;

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    try {
      this.items.set(await this.api.req<Invite[]>('GET', '/invites'));
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

  /** „Ayşe & Daniel" → ayse-daniel */
  suggest(title: string) {
    const s = title
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    this.slug.set(s);
  }

  async create(e: Event) {
    e.preventDefault();
    const f = new FormData(e.target as HTMLFormElement);
    const local = String(f.get('date') ?? '');
    try {
      const c = await this.api.req<Created>('POST', '/invites', {
        title: f.get('title'),
        slug: f.get('slug'),
        kind: f.get('kind'),
        theme: f.get('theme'),
        // Eingabe in deutscher Zeit; das Offset rechnet der Browser aus.
        date: local ? new Date(local).toISOString() : undefined,
        customer_name: f.get('customer_name'),
        customer_email: f.get('customer_email'),
      });
      this.created.set(c);
      this.formOpen.set(false);
      this.error.set('');
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async newKey(i: Invite) {
    if (!confirm(`"${i.title}" için yeni anahtar oluşturulsun mu? Eski planlayıcı linki çalışmaz hale gelir.`)) return;
    try {
      this.created.set(await this.api.req<Created>('POST', `/invites/${i.slug}/key`));
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async toggle(i: Invite, active: boolean) {
    try {
      await this.api.req('PATCH', `/invites/${i.slug}`, { active });
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  }
}
