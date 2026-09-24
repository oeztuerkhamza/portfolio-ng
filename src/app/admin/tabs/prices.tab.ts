import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';
import { PublishBox } from './publish.box';

interface Price {
  key: string;
  grp: string;
  label: string;
  value: string;
  unit: string;
  shop: boolean;
}

@Component({
  selector: 'adm-prices',
  standalone: true,
  imports: [PublishBox],
  template: `
    <h2>Fiyatlar</h2>
    <p class="adm-muted">
      Buradaki değerler sitenin her yerinde kullanılır. Değiştirdikten sonra “Siteyi güncelle” ile yayınlayın
      (birkaç dakika sürer). Online sipariş de bu fiyatlarla hesaplanır.
    </p>
    @if (error()) { <p class="adm-msg err">{{ error() }}</p> }
    <adm-publish [changed]="changed()" />
    @for (g of groups(); track g.name) {
      <section class="adm-card">
        <h3>{{ g.name }}</h3>
        <div class="adm-prices">
          @for (p of g.items; track p.key) {
            <label class="adm-price">
              <span>{{ p.label }} @if (p.shop) { <em class="adm-badge">online</em> }</span>
              <span class="adm-price-input">
                <input type="number" min="0" step="1" [value]="+p.value" (change)="save(p, $event)" />
                <small>{{ p.unit }}</small>
              </span>
              @if (saved() === p.key) { <small class="adm-ok">✓ kaydedildi</small> }
            </label>
          }
        </div>
      </section>
    }
  `,
})
export class PricesTab implements OnInit {
  private readonly api = inject(AdminApi);
  readonly items = signal<Price[]>([]);
  readonly error = signal('');
  readonly saved = signal('');
  readonly changed = signal(false);
  readonly groups = computed(() => {
    const map = new Map<string, Price[]>();
    for (const p of this.items()) map.set(p.grp, [...(map.get(p.grp) ?? []), p]);
    return [...map].map(([name, items]) => ({ name, items }));
  });

  async ngOnInit() {
    try {
      this.items.set(await this.api.req<Price[]>('GET', '/prices'));
    } catch (e) {
      this.error.set(errorText(e));
    }
  }

  async save(p: Price, e: Event) {
    const input = e.target as HTMLInputElement;
    try {
      const row = await this.api.req<Price>('PUT', `/prices/${p.key}`, { value: Number(input.value) });
      this.items.update((list) => list.map((x) => (x.key === p.key ? row : x)));
      this.saved.set(p.key);
      this.changed.set(true);
      this.error.set('');
      setTimeout(() => this.saved.set(''), 1500);
    } catch (err) {
      this.error.set(errorText(err));
      input.value = String(+p.value);
    }
  }
}
