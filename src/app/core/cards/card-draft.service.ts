import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CARD_KINDS,
  CARD_NETWORKS,
  CARD_THEMES,
  type CardDraft,
  type CardKind,
  type CardLinkDraft,
  type CardNetwork,
  type CardTheme,
  MAX_LINKS,
  MAX_PHOTOS,
  cardPayload,
  draftReady,
  emptyDraft,
} from './card-draft.model';

/**
 * Der Entwurf, den der Kunde im Gestalter füllt.
 *
 * Gehalten wird ein Entwurf je Art: wer sich eine Visitenkarte gebaut hat und
 * dann zur Geschenkkarte wechselt, findet die Visitenkarte später unverändert
 * wieder. Beide fahren zusammen mit der Bestellung mit — `payload()` ist genau
 * das, was /api/checkout als `cardDesigns` erwartet.
 *
 * Wie der Warenkorb liegt der Inhalt im localStorage: einen Bogen mit Logo,
 * Adresse und acht Links füllt niemand zweimal, weil eine Seite neu geladen
 * wurde. Beim Vorrendern gibt es keinen Speicher — dort bleibt der Entwurf
 * leer, und der Bogen beginnt im Browser mit dem, was gespeichert war.
 *
 * Geprüft wird hier nichts. Prüfung heißt Ablehnung, und ein halb getippter
 * Entwurf ist nicht falsch, sondern halb fertig. Der Server prüft
 * (`cardData`), und die Vorschau zeigt, was davon übrig bleibt.
 */

const STORE_KEY = 'bd.carddraft.v1';

@Injectable({ providedIn: 'root' })
export class CardDraftService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly state = signal<CardDraft>(this.restore());

  readonly draft = this.state.asReadonly();
  readonly theme = computed(() => this.state().theme);

  /** Arten, deren Entwurf für eine Vorschau reicht. */
  readonly ready = computed(() => CARD_KINDS.filter((k) => draftReady(k, this.state())));

  readyFor(kind: CardKind): boolean {
    return draftReady(kind, this.state());
  }

  setTheme(theme: CardTheme): void {
    if (!CARD_THEMES.includes(theme)) return;
    this.state.update((d) => ({ ...d, theme }));
    this.persist();
  }

  /** Ein einzelnes Feld der Visitenkarte setzen. */
  setBusiness<K extends keyof CardDraft['business']>(field: K, value: CardDraft['business'][K]): void {
    this.state.update((d) => ({ ...d, business: { ...d.business, [field]: value } }));
    this.persist();
  }

  /** Ein einzelnes Feld der Geschenkkarte setzen. */
  setGift<K extends keyof CardDraft['gift']>(field: K, value: CardDraft['gift'][K]): void {
    this.state.update((d) => ({ ...d, gift: { ...d.gift, [field]: value } }));
    this.persist();
  }

  // ── Links der Visitenkarte ──────────────────────────────
  addLink(): void {
    if (this.state().business.links.length >= MAX_LINKS) return;
    this.setBusiness('links', [...this.state().business.links, { net: '', label: '', url: '' }]);
  }

  setLink(index: number, patch: Partial<CardLinkDraft>): void {
    const links = this.state().business.links;
    if (index < 0 || index >= links.length) return;
    this.setBusiness(
      'links',
      links.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );
  }

  removeLink(index: number): void {
    this.setBusiness(
      'links',
      this.state().business.links.filter((_, i) => i !== index),
    );
  }

  // ── Bilder der Geschenkkarte ────────────────────────────
  addPhoto(): void {
    if (this.state().gift.photos.length >= MAX_PHOTOS) return;
    this.setGift('photos', [...this.state().gift.photos, '']);
  }

  setPhoto(index: number, url: string): void {
    const photos = this.state().gift.photos;
    if (index < 0 || index >= photos.length) return;
    this.setGift(
      'photos',
      photos.map((p, i) => (i === index ? url : p)),
    );
  }

  removePhoto(index: number): void {
    this.setGift(
      'photos',
      this.state().gift.photos.filter((_, i) => i !== index),
    );
  }

  /** Eine Art auf leer zurücksetzen; die andere bleibt stehen. */
  reset(kind: CardKind): void {
    const fresh = emptyDraft();
    this.state.update((d) => ({ ...d, [kind]: fresh[kind] }));
    this.persist();
  }

  clear(): void {
    this.state.set(emptyDraft());
    this.persist();
  }

  /** Was die Vorschau schickt — der Inhalt einer Art. */
  payloadFor(kind: CardKind): Record<string, unknown> {
    return cardPayload(kind, this.state());
  }

  /**
   * Was `/api/checkout` als `cardDesigns` erwartet: alle Arten, deren Entwurf
   * reicht. Welche davon wirklich bestellt wurden, entscheidet der Server —
   * hier ist nicht bekannt, was im Korb liegt.
   */
  payload(): Record<string, Record<string, unknown>> {
    const out: Record<string, Record<string, unknown>> = {};
    for (const kind of this.ready()) out[kind] = this.payloadFor(kind);
    return out;
  }

  // ── Speicher ────────────────────────────────────────────
  private restore(): CardDraft {
    const fresh = emptyDraft();
    if (!this.browser) return fresh;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return fresh;
      return this.sanitize(JSON.parse(raw), fresh);
    } catch {
      return fresh;
    }
  }

  /**
   * Alter Speicher trifft auf neuen Bogen: was fehlt, kommt aus dem leeren
   * Entwurf, was zu viel ist, fliegt raus. Ohne das würde ein umbenanntes Feld
   * den Gestalter beim nächsten Besuch mit `undefined` in einem Eingabefeld
   * begrüßen.
   */
  private sanitize(raw: unknown, fresh: CardDraft): CardDraft {
    const o = (raw ?? {}) as Record<string, unknown>;
    const b = (o['business'] ?? {}) as Record<string, unknown>;
    const g = (o['gift'] ?? {}) as Record<string, unknown>;
    const s = (v: unknown) => (typeof v === 'string' ? v : '');

    return {
      theme: CARD_THEMES.includes(o['theme'] as CardTheme) ? (o['theme'] as CardTheme) : fresh.theme,
      business: {
        company: s(b['company']),
        tagline: s(b['tagline']),
        logoUrl: s(b['logoUrl']),
        avatarUrl: s(b['avatarUrl']),
        phone: s(b['phone']),
        email: s(b['email']),
        web: s(b['web']),
        address: s(b['address']),
        leads: b['leads'] === true,
        links: (Array.isArray(b['links']) ? b['links'] : []).slice(0, MAX_LINKS).map((l) => {
          const item = (l ?? {}) as Record<string, unknown>;
          const net = CARD_NETWORKS.find((n) => n === item['net']);
          return { net: (net ?? '') as CardNetwork | '', label: s(item['label']), url: s(item['url']) };
        }),
      },
      gift: {
        headline: s(g['headline']),
        to: s(g['to']),
        from: s(g['from']),
        message: s(g['message']),
        songUrl: s(g['songUrl']),
        songLabel: s(g['songLabel']),
        photos: (Array.isArray(g['photos']) ? g['photos'] : []).slice(0, MAX_PHOTOS).map(s),
      },
    };
  }

  /** Ein gesperrter Speicher darf den Bogen nicht lahmlegen. */
  private persist(): void {
    if (!this.browser) return;
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.state()));
    } catch {
      /* privates Fenster, voller Speicher — der Entwurf lebt dann nur im Tab */
    }
  }
}
