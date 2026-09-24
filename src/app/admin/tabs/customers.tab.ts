import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { formData } from './form';

export interface Customer {
  id: string;
  name: string;
  business: string | null;
  email: string | null;
  phone: string | null;
  street: string | null;
  city: string | null;
  google_link: string | null;
  notes: string | null;
  active_subscriptions?: number;
  redirects?: number;
}

const FIELDS = ['name', 'business', 'email', 'phone', 'street', 'city', 'google_link', 'notes'];

@Component({
  selector: 'adm-customers',
  standalone: true,
  template: `
    <div class="adm-row-head">
      <h2>Müşteriler</h2>
      <button class="btn btn-primary btn-small" (click)="edit(null)">+ Yeni müşteri</button>
    </div>
    <input class="adm-search" type="search" placeholder="Ara: isim, işletme, telefon…" (input)="q.set(val($event))" />
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }

    @if (editing() !== undefined) {
      <form class="adm-card adm-form" (submit)="save($event)">
        <h3>{{ editing() ? 'Müşteriyi düzenle' : 'Yeni müşteri' }}</h3>
        <div class="adm-grid2">
          <label class="adm-field">Ad Soyad *<input name="name" required [value]="editing()?.name ?? ''" /></label>
          <label class="adm-field">İşletme<input name="business" [value]="editing()?.business ?? ''" /></label>
          <label class="adm-field">E-posta<input name="email" type="email" [value]="editing()?.email ?? ''" /></label>
          <label class="adm-field">Telefon<input name="phone" [value]="editing()?.phone ?? ''" /></label>
          <label class="adm-field">Adres<input name="street" [value]="editing()?.street ?? ''" /></label>
          <label class="adm-field">Şehir<input name="city" [value]="editing()?.city ?? ''" /></label>
        </div>
        <label class="adm-field">Google profil linki (yorum linki)<input name="google_link" type="url" [value]="editing()?.google_link ?? ''" /></label>
        <label class="adm-field">Notlar<textarea name="notes" rows="3" [value]="editing()?.notes ?? ''"></textarea></label>
        <div class="adm-actions">
          <button class="btn btn-primary btn-small">Kaydet</button>
          <button type="button" class="btn btn-secondary btn-small" (click)="editing.set(undefined)">Vazgeç</button>
          @if (editing()) { <button type="button" class="adm-link danger" (click)="remove(editing()!)">Müşteriyi sil</button> }
        </div>
      </form>
    }

    <div class="adm-table-wrap">
      <table class="adm-table">
        <thead><tr><th>Ad</th><th>İşletme</th><th>İletişim</th><th>Abonelik</th><th>NFC</th><th></th></tr></thead>
        <tbody>
          @for (c of shown(); track c.id) {
            <tr>
              <td><strong>{{ c.name }}</strong>@if (c.city) { <div class="adm-muted small">{{ c.city }}</div> }</td>
              <td>{{ c.business || '—' }}</td>
              <td>
                @if (c.phone) { <a [href]="'tel:' + c.phone">{{ c.phone }}</a><br /> }
                @if (c.email) { <a [href]="'mailto:' + c.email">{{ c.email }}</a> }
              </td>
              <td>{{ c.active_subscriptions || '—' }}</td>
              <td>{{ c.redirects || '—' }}</td>
              <td><button class="adm-link" (click)="edit(c)">Düzenle</button></td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="adm-muted">Henüz müşteri yok.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class CustomersTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Customer[]>([]);
  readonly error = signal('');
  readonly q = signal('');
  /** undefined = kein Formular, null = neuer Kunde. */
  readonly editing = signal<Customer | null | undefined>(undefined);
  readonly shown = computed(() => {
    const q = this.q().toLowerCase();
    return q
      ? this.items().filter((c) => [c.name, c.business, c.phone, c.email, c.city].some((v) => v?.toLowerCase().includes(q)))
      : this.items();
  });

  async ngOnInit() {
    await this.load();
  }

  private async load() {
    try {
      this.items.set(await this.api.req<Customer[]>('GET', '/customers'));
    } catch (e) {
      this.error.set(errorText(e));
    }
  }

  val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  edit(c: Customer | null) {
    this.editing.set(c);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async save(e: Event) {
    e.preventDefault();
    const data = formData(e.target as HTMLFormElement, FIELDS);
    const current = this.editing();
    try {
      if (current) await this.api.req('PATCH', `/customers/${current.id}`, data);
      else await this.api.req('POST', '/customers', data);
      this.editing.set(undefined);
      this.error.set('');
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }

  async remove(c: Customer) {
    if (!confirm(`${c.name} ve tüm abonelikleri silinsin mi? NFC linkleri kalır ama müşteriden ayrılır.`)) return;
    try {
      await this.api.req('DELETE', `/customers/${c.id}`);
      this.editing.set(undefined);
      await this.load();
    } catch (err) {
      this.error.set(errorText(err));
    }
  }
}
