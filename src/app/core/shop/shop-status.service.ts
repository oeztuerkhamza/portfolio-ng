import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Ob der Online-Shop gerade geöffnet ist (Schalter im Admin-Portal).
 * Wird nur im Browser abgefragt; vorgerenderte Seiten zeigen den Shop nie.
 */
@Injectable({ providedIn: 'root' })
export class ShopStatus {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private asked = false;
  readonly enabled = signal(false);
  readonly checked = signal(false);

  check(): void {
    if (!this.browser || this.asked) return;
    this.asked = true;
    fetch('/api/shop')
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d: { enabled?: boolean }) => this.enabled.set(d.enabled === true))
      .catch(() => undefined)
      .finally(() => this.checked.set(true));
  }
}
