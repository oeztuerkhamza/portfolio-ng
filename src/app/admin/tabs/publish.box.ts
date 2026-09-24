import { Component, inject, input, signal } from '@angular/core';
import { AdminApi, errorText } from '../admin-api.service';

/** „Siteyi güncelle": löst über den Vercel Deploy Hook einen neuen Build aus. */
@Component({
  selector: 'adm-publish',
  standalone: true,
  template: `
    <div class="adm-publish" [class.hot]="changed()">
      <div>
        <strong>Siteyi güncelle</strong>
        <p class="adm-muted small">
          @if (!api.config()?.ready?.deployHook) { Önce Vercel'de bir Deploy Hook oluşturup <code>VERCEL_DEPLOY_HOOK_URL</code> olarak ekleyin. }
          @else if (state() === 'ok') { Güncelleme başladı. Yeni fiyatlar 2–4 dakika içinde sitede görünür. }
          @else if (changed()) { Kaydedilmiş değişiklikler var ve henüz sitede değil. }
          @else { Fiyatlar sitede güncel. }
        </p>
        @if (state() === 'err') { <p class="adm-msg err">{{ err() }}</p> }
      </div>
      <button class="btn btn-primary btn-small" [disabled]="!api.config()?.ready?.deployHook || state() === 'busy'" (click)="publish()">
        {{ state() === 'busy' ? 'Gönderiliyor…' : 'Siteyi güncelle' }}
      </button>
    </div>
  `,
})
export class PublishBox {
  readonly api = inject(AdminApi);
  readonly changed = input(false);
  readonly state = signal<'' | 'busy' | 'ok' | 'err'>('');
  readonly err = signal('');

  async publish() {
    this.state.set('busy');
    try {
      await this.api.req('POST', '/publish', {});
      this.state.set('ok');
    } catch (e) {
      this.err.set(errorText(e));
      this.state.set('err');
    }
  }
}
