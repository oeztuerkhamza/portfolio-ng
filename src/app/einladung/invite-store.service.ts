import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { demoEvent, demoGuests, demoPlan, isDemoSlug } from './invite-demo';
import { THEME_IDS } from './invite-themes';
import {
  InviteEvent,
  InviteGuest,
  InviteLang,
  InvitePhoto,
  InvitePlan,
  OwnerInvite,
  PublicInvite,
  RsvpInput,
  ThemeId,
  Translations,
} from './invite.model';

/**
 * Datenzugriff der Einladungen.
 *
 * Zwei Wege hinter einer Oberfläche:
 *   • echte Einladungen sprechen mit /api/invites/… (src/server/invites.ts),
 *   • Beispiele (`demo-…`) leben im localStorage des Besuchers. Er kann dort
 *     zusagen, Fotos hochladen und im Planer alles ändern — ohne dass etwas
 *     unseren Server erreicht.
 */

interface DemoState {
  event: InviteEvent;
  plan: InvitePlan;
  guests: InviteGuest[];
  photos: InvitePhoto[];
}

export type OwnerResult = OwnerInvite | 'denied' | 'missing' | 'offline';

const rid = () => (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36));
const code = () => Math.random().toString(36).slice(2, 8);

@Injectable({ providedIn: 'root' })
export class InviteStore {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // ── Gäste-Seite ─────────────────────────────────────────

  /** Sofort verfügbare Fassung für Beispiele — auch beim Vorrendern auf dem Server. */
  demoPublic(slug: string): PublicInvite | null {
    const theme = slug.slice(5) as ThemeId;
    if (!isDemoSlug(slug) || !THEME_IDS.includes(theme)) return null;
    return { event: demoEvent(theme), photos: [] };
  }

  async loadPublic(slug: string, guestCode?: string | null): Promise<PublicInvite | null> {
    if (isDemoSlug(slug)) {
      const st = this.demo(slug);
      if (!st) return null;
      const g = guestCode ? st.guests.find((x) => x.code === guestCode) : undefined;
      return { event: st.event, photos: st.photos.filter((p) => !p.hidden), guest: g };
    }
    const q = guestCode ? `?g=${encodeURIComponent(guestCode)}` : '';
    const res = await fetch(`/api/invites/${encodeURIComponent(slug)}${q}`);
    if (!res.ok) return null;
    return (await res.json()) as PublicInvite;
  }

  async rsvp(slug: string, input: RsvpInput): Promise<{ code: string }> {
    if (isDemoSlug(slug)) {
      const st = this.demo(slug)!;
      const now = new Date().toISOString();
      let g = input.code ? st.guests.find((x) => x.code === input.code) : undefined;
      if (!g) {
        g = { id: rid(), code: code(), name: input.name, status: 'invited', adults: 1, children: 0, menu: '', createdAt: now };
        st.guests.unshift(g);
      }
      Object.assign(g, input, { code: g.code, respondedAt: now });
      this.saveDemo(slug, st);
      return { code: g.code };
    }
    const res = await fetch(`/api/invites/${encodeURIComponent(slug)}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`rsvp ${res.status}`);
    return (await res.json()) as { code: string };
  }

  async uploadPhoto(slug: string, file: File, by: string): Promise<InvitePhoto> {
    const blob = await shrinkImage(file, isDemoSlug(slug) ? 1024 : 1800);
    if (isDemoSlug(slug)) {
      const st = this.demo(slug)!;
      const photo: InvitePhoto = { id: rid(), url: await toDataUrl(blob), by: by || undefined, hidden: false, createdAt: new Date().toISOString() };
      st.photos.unshift(photo);
      this.saveDemo(slug, st);
      return photo;
    }
    const res = await fetch(`/api/invites/${encodeURIComponent(slug)}/photos?by=${encodeURIComponent(by)}`, {
      method: 'POST',
      headers: { 'Content-Type': blob.type },
      body: blob,
    });
    if (!res.ok) throw new Error(`upload ${res.status}`);
    return (await res.json()) as InvitePhoto;
  }

  // ── Gastgeber ───────────────────────────────────────────

  async loadOwner(slug: string, key: string): Promise<OwnerResult> {
    if (isDemoSlug(slug)) return this.demo(slug) ?? 'missing';
    try {
      const res = await fetch(this.ownerUrl(slug), { headers: this.ownerHeaders(key) });
      if (res.status === 401 || res.status === 403) return 'denied';
      if (res.status === 404) return 'missing';
      if (!res.ok) return 'offline';
      return (await res.json()) as OwnerInvite;
    } catch {
      return 'offline';
    }
  }

  async saveOwner(slug: string, key: string, patch: { event?: InviteEvent; plan?: InvitePlan }): Promise<void> {
    if (isDemoSlug(slug)) {
      const st = this.demo(slug)!;
      if (patch.event) st.event = patch.event;
      if (patch.plan) st.plan = patch.plan;
      this.saveDemo(slug, st);
      return;
    }
    await this.ok(fetch(this.ownerUrl(slug), { method: 'PUT', headers: this.ownerHeaders(key, true), body: JSON.stringify(patch) }));
  }

  async saveGuest(slug: string, key: string, guest: Partial<InviteGuest> & { name: string }): Promise<InviteGuest> {
    if (isDemoSlug(slug)) {
      const st = this.demo(slug)!;
      let g = guest.id ? st.guests.find((x) => x.id === guest.id) : undefined;
      if (!g) {
        g = { id: rid(), code: code(), name: guest.name, status: 'invited', adults: 1, children: 0, menu: '', createdAt: new Date().toISOString() };
        st.guests.push(g);
      }
      Object.assign(g, guest, { id: g.id, code: g.code });
      this.saveDemo(slug, st);
      return { ...g };
    }
    const url = guest.id ? `${this.ownerUrl(slug)}/guests/${guest.id}` : `${this.ownerUrl(slug)}/guests`;
    const res = await this.ok(fetch(url, { method: guest.id ? 'PATCH' : 'POST', headers: this.ownerHeaders(key, true), body: JSON.stringify(guest) }));
    return (await res.json()) as InviteGuest;
  }

  async deleteGuest(slug: string, key: string, id: string): Promise<void> {
    if (isDemoSlug(slug)) {
      const st = this.demo(slug)!;
      st.guests = st.guests.filter((g) => g.id !== id);
      this.saveDemo(slug, st);
      return;
    }
    await this.ok(fetch(`${this.ownerUrl(slug)}/guests/${id}`, { method: 'DELETE', headers: this.ownerHeaders(key) }));
  }

  /** Eigenes Foto des Gastgebers: liefert die Adresse für Titelbild oder Galerie. */
  async ownerUpload(slug: string, key: string, file: File): Promise<string> {
    const blob = await shrinkImage(file, isDemoSlug(slug) ? 1280 : 2000);
    if (isDemoSlug(slug)) return toDataUrl(blob);
    const res = await this.ok(fetch(`${this.ownerUrl(slug)}/upload`, { method: 'POST', headers: { ...this.ownerHeaders(key), 'Content-Type': blob.type }, body: blob }));
    return ((await res.json()) as { url: string }).url;
  }

  async setPhotoHidden(slug: string, key: string, id: string, hidden: boolean): Promise<void> {
    if (isDemoSlug(slug)) {
      const st = this.demo(slug)!;
      const p = st.photos.find((x) => x.id === id);
      if (p) p.hidden = hidden;
      this.saveDemo(slug, st);
      return;
    }
    await this.ok(fetch(`${this.ownerUrl(slug)}/photos/${id}`, { method: 'PATCH', headers: this.ownerHeaders(key, true), body: JSON.stringify({ hidden }) }));
  }

  /**
   * Texte in andere Sprachen übersetzen lassen (Claude über unseren Server).
   * Gespeichert wird danach wie jede andere Änderung. Wirft einen Fehler mit
   * dem Code des Servers, z. B. `translate_not_configured`.
   */
  async translate(
    slug: string,
    key: string,
    body: { source: InviteLang; targets: InviteLang[]; items: { id: string; text: string }[] },
  ): Promise<Translations> {
    const url = isDemoSlug(slug) ? '/api/invites/demo-translate' : `${this.ownerUrl(slug)}/translate`;
    const res = await fetch(url, {
      method: 'POST',
      headers: isDemoSlug(slug) ? { 'Content-Type': 'application/json' } : this.ownerHeaders(key, true),
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { translations?: Translations; error?: string };
    if (!res.ok || !data.translations) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data.translations;
  }

  async deletePhoto(slug: string, key: string, id: string): Promise<void> {
    if (isDemoSlug(slug)) {
      const st = this.demo(slug)!;
      st.photos = st.photos.filter((p) => p.id !== id);
      this.saveDemo(slug, st);
      return;
    }
    await this.ok(fetch(`${this.ownerUrl(slug)}/photos/${id}`, { method: 'DELETE', headers: this.ownerHeaders(key) }));
  }

  resetDemo(slug: string): void {
    try {
      localStorage.removeItem(this.demoKey(slug));
    } catch {
      /* nichts zu tun */
    }
  }

  // ── intern ──────────────────────────────────────────────

  private ownerUrl(slug: string): string {
    return `/api/invites/${encodeURIComponent(slug)}/owner`;
  }

  private ownerHeaders(key: string, json = false): Record<string, string> {
    return { 'X-Invite-Key': key, ...(json ? { 'Content-Type': 'application/json' } : {}) };
  }

  private async ok(p: Promise<Response>): Promise<Response> {
    const res = await p;
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  }

  private demoKey(slug: string): string {
    return `bd-invite:${slug}`;
  }

  /** Stand des Beispiels: gespeichert, sonst frisch angelegt. */
  private demo(slug: string): DemoState | null {
    const theme = slug.slice(5) as ThemeId;
    if (!THEME_IDS.includes(theme)) return null;
    if (this.isBrowser) {
      try {
        const raw = localStorage.getItem(this.demoKey(slug));
        if (raw) return JSON.parse(raw) as DemoState;
      } catch {
        /* privater Modus oder kaputter Eintrag: frisch anfangen */
      }
    }
    const event = demoEvent(theme);
    return { event, plan: demoPlan(event), guests: demoGuests(), photos: [] };
  }

  private saveDemo(slug: string, st: DemoState): void {
    try {
      localStorage.setItem(this.demoKey(slug), JSON.stringify(st));
    } catch {
      // Voll (Fotos!) oder gesperrt: die ältesten Fotos zuerst opfern und erneut versuchen.
      if (st.photos.length > 1) {
        st.photos = st.photos.slice(0, Math.max(1, Math.floor(st.photos.length / 2)));
        this.saveDemo(slug, st);
      }
    }
  }
}

/** Bild verkleinern und als JPEG ausgeben — spart Speicher und Upload-Zeit. */
export async function shrinkImage(file: File, maxSide: number): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    if (scale === 1 && file.size < 900_000) return file;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b ?? file), 'image/jpeg', 0.82));
  } catch {
    return file;
  }
}

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
