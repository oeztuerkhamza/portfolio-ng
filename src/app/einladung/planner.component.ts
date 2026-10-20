import {
  Component,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
  afterNextRender,
  computed,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import qrcode from 'qrcode-generator';
import { SeoService } from '../core/seo/seo.service';
import { IconComponent } from '../shared/icon/icon.component';
import { isDemoSlug, taskTemplate } from './invite-demo';
import { GUEST_TEXT, HOST_TEXT, formatDate, tx } from './invite-i18n';
import { copyText, download, ensureInviteFonts, whatsappLink } from './invite-links';
import { InviteStore } from './invite-store.service';
import { INVITE_THEMES, inviteTheme } from './invite-themes';
import {
  EVENT_KINDS,
  INVITE_LANGS,
  INVITE_LANG_NAMES,
  InviteEvent,
  InviteGuest,
  InviteLang,
  InvitePhoto,
  InvitePlan,
  LocalText,
  MENU_CHOICES,
  MUSIC_IDS,
  MenuChoice,
  MusicId,
  RsvpStatus,
  ScheduleItem,
  ThemeId,
  localText,
  localTextPaths,
  validIban,
} from './invite.model';
import { MusicService } from './music.service';
import { SlideshowComponent } from './slideshow.component';
import { SetupWizardComponent } from './setup-wizard.component';
import { PLANNER } from './planner.token';
import { registerInviteIcons } from './invite-icons';

type Tab = 'overview' | 'guests' | 'seating' | 'tasks' | 'budget' | 'photos' | 'settings';
type HostLang = 'de' | 'tr' | 'en';
type Access = 'loading' | 'key' | 'denied' | 'missing' | 'offline' | 'ready';

const rid = () => Math.random().toString(36).slice(2, 10);

/* eslint-disable @typescript-eslint/no-explicit-any */
function getPath(obj: any, path: string): unknown {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setPath(obj: any, path: string, value: unknown): void {
  const keys = path.split('.');
  const last = keys.pop()!;
  let o = obj;
  for (const k of keys) {
    o[k] ??= {};
    o = o[k];
  }
  o[last] = value;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Datum/Uhrzeit für <input type="datetime-local"> — immer in deutscher Zeit, wie die Einladung sie zeigt. */
function berlinOffset(d: Date): number {
  const part = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Berlin', timeZoneName: 'shortOffset' })
    .formatToParts(d)
    .find((p) => p.type === 'timeZoneName')?.value;
  const m = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(part ?? '');
  if (!m) return 60;
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3] ?? 0));
}
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return new Date(d.getTime() + berlinOffset(d) * 6e4).toISOString().slice(0, 16);
}
function fromLocalInput(v: string): string {
  const guess = new Date(`${v}:00Z`);
  if (isNaN(guess.getTime())) return '';
  return new Date(guess.getTime() - berlinOffset(guess) * 6e4).toISOString();
}

registerInviteIcons();

/**
 * Planer des Gastgebers: /einladung/<slug>/planer
 *
 * Zugang mit dem Schlüssel aus dem Link (#k=…), den wir beim Anlegen der
 * Einladung vergeben. Der Schlüssel wandert in den localStorage und aus der
 * Adresse heraus, damit er nicht in Bildschirmfotos und Verläufen landet.
 * Beispiele brauchen keinen Schlüssel und speichern nur im Browser.
 */
@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet, IconComponent, SlideshowComponent, SetupWizardComponent],
  providers: [{ provide: PLANNER, useExisting: forwardRef(() => PlannerComponent) }],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PlannerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(InviteStore);
  private readonly seo = inject(SeoService);
  private readonly doc = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  readonly music = inject(MusicService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';
  readonly demo = isDemoSlug(this.slug);

  readonly access = signal<Access>('loading');
  readonly hl = signal<HostLang>('de');
  readonly tab = signal<Tab>('overview');
  /** Einrichtungsassistent: öffnet sich bei echten Einladungen, bis er einmal abgeschlossen ist. */
  readonly wizard = signal(false);
  readonly keyInput = signal('');
  private key = '';

  readonly event = signal<InviteEvent | null>(null);
  readonly plan = signal<InvitePlan | null>(null);
  readonly guests = signal<InviteGuest[]>([]);
  readonly photos = signal<InvitePhoto[]>([]);
  readonly saveState = signal<'idle' | 'saving' | 'saved' | 'error'>('idle');
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private pending: { event?: boolean; plan?: boolean } = {};

  // Gäste
  readonly search = signal('');
  readonly filter = signal<RsvpStatus | 'all'>('all');
  readonly newName = signal('');
  readonly newGroup = signal('');
  readonly openGuest = signal<string | null>(null);
  readonly copied = signal<string | null>(null);

  // Sitzplan
  readonly picked = signal<string | null>(null);

  // Einstellungen
  readonly textLang = signal<InviteLang>('de');
  /** Geänderte Texte seit dem letzten Übersetzen: Pfad → Sprache, in der geschrieben wurde. */
  readonly changed = signal<Map<string, InviteLang>>(new Map());
  readonly translateState = signal<'idle' | 'busy' | 'done' | 'nothing' | 'nokey' | 'limit' | 'error'>('idle');
  readonly translatedInto = signal(0);
  /** Geänderte Texte in der gerade gewählten Sprache — die übersetzt „Speichern & übersetzen". */
  readonly changedCount = computed(() => [...this.changed().values()].filter((l) => l === this.textLang()).length);
  readonly upBusy = signal(false);
  readonly slideshow = signal(false);

  readonly tabs: { id: Tab; icon: string }[] = [
    { id: 'overview', icon: 'grid' },
    { id: 'guests', icon: 'users' },
    { id: 'seating', icon: 'layers' },
    { id: 'tasks', icon: 'list' },
    { id: 'budget', icon: 'wallet' },
    { id: 'photos', icon: 'image' },
    { id: 'settings', icon: 'palette' },
  ];
  readonly hostLangs: HostLang[] = ['de', 'tr', 'en'];
  readonly statuses: RsvpStatus[] = ['invited', 'yes', 'maybe', 'no'];
  readonly menus = MENU_CHOICES;
  readonly kinds = EVENT_KINDS;
  readonly themes = INVITE_THEMES;
  readonly musicIds = MUSIC_IDS;
  readonly allLangs = INVITE_LANGS;
  readonly langNames = INVITE_LANG_NAMES;
  readonly scheduleIcons: NonNullable<ScheduleItem['icon']>[] = ['ring', 'glass', 'dinner', 'music', 'camera', 'heart', 'cake', 'mic', 'henna', 'coffee'];

  readonly theme = computed(() => inviteTheme(this.event()?.theme));

  readonly stats = computed(() => {
    const gs = this.guests();
    const count = (s: RsvpStatus) => gs.filter((g) => g.status === s).length;
    const coming = gs.filter((g) => g.status === 'yes');
    const adults = coming.reduce((n, g) => n + g.adults, 0);
    const children = coming.reduce((n, g) => n + g.children, 0);
    const menus = MENU_CHOICES.map((m) => ({ m, n: coming.filter((g) => g.menu === m).reduce((x, g) => x + g.adults + g.children, 0) })).filter((x) => x.n);
    return {
      total: gs.length,
      yes: count('yes'),
      no: count('no'),
      maybe: count('maybe'),
      open: count('invited'),
      adults,
      children,
      persons: adults + children,
      menus,
      allergies: coming.filter((g) => g.allergies).map((g) => ({ name: g.name, text: g.allergies! })),
      songs: gs.filter((g) => g.song).map((g) => ({ name: g.name, text: g.song! })),
      messages: gs.filter((g) => g.message).map((g) => ({ name: g.name, text: g.message! })),
    };
  });

  readonly daysLeft = computed(() => {
    const e = this.event();
    if (!e) return 0;
    return Math.max(0, Math.ceil((new Date(e.date).getTime() - Date.now()) / 864e5));
  });

  readonly visibleGuests = computed(() => {
    const q = this.search().trim().toLowerCase();
    const f = this.filter();
    return this.guests().filter(
      (g) => (f === 'all' || g.status === f) && (!q || `${g.name} ${g.group ?? ''}`.toLowerCase().includes(q)),
    );
  });

  readonly groups = computed(() => [...new Set(this.guests().map((g) => g.group).filter((g): g is string => !!g))]);

  readonly seatable = computed(() => this.guests().filter((g) => g.status === 'yes' || g.status === 'maybe'));
  readonly unseated = computed(() => {
    const tables = new Set(this.plan()?.tables.map((t) => t.id));
    return this.seatable().filter((g) => !g.table || !tables.has(g.table));
  });

  readonly taskStats = computed(() => {
    const ts = this.plan()?.tasks ?? [];
    const done = ts.filter((t) => t.done).length;
    const open = ts.filter((t) => !t.done).sort((a, b) => (a.due ?? '9').localeCompare(b.due ?? '9'));
    return { done, total: ts.length, pct: ts.length ? Math.round((done / ts.length) * 100) : 0, next: open.slice(0, 3) };
  });

  readonly sortedTasks = computed(() =>
    [...(this.plan()?.tasks ?? [])].sort((a, b) => Number(a.done) - Number(b.done) || (a.due ?? '9').localeCompare(b.due ?? '9')),
  );

  readonly budget = computed(() => {
    const p = this.plan();
    const items = p?.budget ?? [];
    const planned = items.reduce((n, b) => n + (b.planned || 0), 0);
    const paid = items.reduce((n, b) => n + (b.paid || 0), 0);
    const total = p?.budgetTotal || planned;
    const persons = this.stats().persons || 1;
    return { planned, paid, total, left: total - planned, open: planned - paid, perGuest: planned / persons, pct: total ? Math.min(100, (planned / total) * 100) : 0 };
  });

  readonly inviteUrl = computed(() => `${SeoService.ORIGIN}/einladung/${this.slug}`);

  readonly shareQr = computed<SafeHtml>(() => {
    const code = qrcode(0, 'M');
    code.addData(this.inviteUrl());
    code.make();
    // Das SVG stammt vollständig aus qrcode-generator.
    return this.sanitizer.bypassSecurityTrustHtml(code.createSvgTag({ cellSize: 4, margin: 2, scalable: true }));
  });

  readonly ibanBad = computed(() => {
    const iban = this.event()?.gifts?.iban;
    return !!iban && !validIban(iban);
  });

  readonly guestPhotos = computed(() => this.photos());

  constructor() {
    ensureInviteFonts(this.doc);
    if (!this.isBrowser) return;
    afterNextRender(() => {
      this.hl.set(this.pickHostLang());
      void this.start();
    });
    inject(DestroyRef).onDestroy(() => {
      this.music.stop(false);
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        void this.flush();
      }
    });
  }

  ngOnInit(): void {
    this.seo.update({ title: 'Gastgeber-Planer · Digitale Einladung', description: 'Gäste, Sitzplan, Checkliste und Budget.', path: `/einladung/${this.slug}/planer`, noIndex: true });
  }

  // ── Zugang ─────────────────────────────────────────────

  private pickHostLang(): HostLang {
    try {
      const saved = localStorage.getItem('bd-planner-lang') as HostLang | null;
      if (saved && this.hostLangs.includes(saved)) return saved;
    } catch {
      /* egal */
    }
    const n = (navigator.language || 'de').slice(0, 2) as HostLang;
    return this.hostLangs.includes(n) ? n : 'en';
  }

  setHostLang(l: HostLang): void {
    this.hl.set(l);
    try {
      localStorage.setItem('bd-planner-lang', l);
    } catch {
      /* egal */
    }
  }

  private async start(): Promise<void> {
    this.access.set('loading');
    if (this.demo) return this.open('');
    const hash = new URLSearchParams(location.hash.slice(1));
    const fromHash = hash.get('k');
    if (fromHash) {
      try {
        localStorage.setItem(`bd-invite-key:${this.slug}`, fromHash);
      } catch {
        /* egal */
      }
      history.replaceState(null, '', location.pathname + location.search);
    }
    let key = fromHash;
    if (!key) {
      try {
        key = localStorage.getItem(`bd-invite-key:${this.slug}`);
      } catch {
        key = null;
      }
    }
    if (!key) return this.access.set('key');
    await this.open(key);
  }

  async submitKey(ev: Event): Promise<void> {
    ev.preventDefault();
    const k = this.keyInput().trim();
    if (!k) return;
    try {
      localStorage.setItem(`bd-invite-key:${this.slug}`, k);
    } catch {
      /* egal */
    }
    await this.open(k);
  }

  private async open(key: string): Promise<void> {
    this.access.set('loading');
    const res = await this.store.loadOwner(this.slug, key);
    if (typeof res === 'string') {
      this.access.set(res === 'denied' ? 'denied' : res);
      return;
    }
    this.key = key;
    this.event.set(res.event);
    this.plan.set(res.plan);
    this.guests.set(res.guests);
    this.photos.set(res.photos);
    this.textLang.set(res.event.langs[0] ?? 'de');
    this.access.set('ready');
    if (!this.demo && !res.plan.setupDone) this.wizard.set(true);
  }

  /** Assistent abschließen: Haken im Plan, dann zurück zur Übersicht. */
  finishSetup(): void {
    this.editPlan((p) => (p.setupDone = true));
    this.wizard.set(false);
    this.tab.set('overview');
  }

  /** Ausstehende Änderungen sofort speichern (Assistent, vor der Vorschau). */
  async saveNow(): Promise<void> {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    if (this.pending.event || this.pending.plan) await this.flush();
  }

  // ── Texte ──────────────────────────────────────────────

  t(key: string): string {
    return tx(HOST_TEXT, key, this.hl());
  }

  g(key: string): string {
    return tx(GUEST_TEXT, key, this.hl());
  }

  fmt(n: number): string {
    return new Intl.NumberFormat(this.hl() === 'en' ? 'en-GB' : this.hl() === 'tr' ? 'tr-TR' : 'de-DE', { maximumFractionDigits: 0 }).format(n);
  }

  date(iso: string): string {
    return formatDate(iso, this.hl());
  }

  dueText(d?: string): string {
    return d ? formatDate(`${d}T12:00:00`, this.hl(), false) : '';
  }

  overdue(d?: string): boolean {
    return !!d && d < new Date().toISOString().slice(0, 10);
  }

  // ── Speichern ──────────────────────────────────────────

  /** Änderung am Event oder Plan: sofort sichtbar, gespeichert wird gebündelt. */
  editEvent(fn: (e: InviteEvent) => void): void {
    const e = structuredClone(this.event()!);
    fn(e);
    this.event.set(e);
    this.queue('event');
  }

  editPlan(fn: (p: InvitePlan) => void): void {
    const p = structuredClone(this.plan()!);
    fn(p);
    this.plan.set(p);
    this.queue('plan');
  }

  private queue(what: 'event' | 'plan'): void {
    this.pending[what] = true;
    this.saveState.set('saving');
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => void this.flush(), 700);
  }

  private async flush(): Promise<void> {
    this.saveTimer = null;
    const p = this.pending;
    this.pending = {};
    try {
      await this.store.saveOwner(this.slug, this.key, {
        event: p.event ? this.event()! : undefined,
        plan: p.plan ? this.plan()! : undefined,
      });
      this.saveState.set('saved');
    } catch {
      this.saveState.set('error');
    }
  }

  async resetDemo(): Promise<void> {
    this.store.resetDemo(this.slug);
    await this.open('');
  }

  // ── Gäste ──────────────────────────────────────────────

  async addGuest(ev: Event): Promise<void> {
    ev.preventDefault();
    const name = this.newName().trim();
    if (!name) return;
    try {
      const g = await this.store.saveGuest(this.slug, this.key, { name, group: this.newGroup().trim() || undefined });
      this.guests.update((list) => [...list, g]);
      this.newName.set('');
      this.saveState.set('saved');
    } catch {
      this.saveState.set('error');
    }
  }

  async updateGuest(g: InviteGuest, patch: Partial<InviteGuest>): Promise<void> {
    const next = { ...g, ...patch };
    this.guests.update((list) => list.map((x) => (x.id === g.id ? next : x)));
    try {
      await this.store.saveGuest(this.slug, this.key, { id: g.id, name: next.name, ...patch });
      this.saveState.set('saved');
    } catch {
      this.saveState.set('error');
    }
  }

  async removeGuest(g: InviteGuest): Promise<void> {
    if (!confirm(this.t('g.confirm').replace('{name}', g.name))) return;
    try {
      await this.store.deleteGuest(this.slug, this.key, g.id);
      this.guests.update((list) => list.filter((x) => x.id !== g.id));
    } catch {
      this.saveState.set('error');
    }
  }

  guestLink(g: InviteGuest): string {
    return `${this.inviteUrl()}?g=${g.code}`;
  }

  guestWa(g: InviteGuest): string {
    const text = this.t('g.wa.text').replace('{name}', g.name.split(' ')[0]).replace('{url}', this.guestLink(g));
    return g.phone ? whatsappLink(g.phone, text) : `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  shareWa(): string {
    const e = this.event();
    return `https://wa.me/?text=${encodeURIComponent(`${e?.title ?? ''} — ${this.inviteUrl()}`)}`;
  }

  async copy(id: string, text: string): Promise<void> {
    if (await copyText(text)) {
      this.copied.set(id);
      setTimeout(() => this.copied() === id && this.copied.set(null), 1800);
    }
  }

  statusLabel(s: RsvpStatus): string {
    return this.t(s === 'invited' ? 's.open' : `s.${s}`);
  }

  exportCsv(): void {
    const tables = new Map(this.plan()?.tables.map((t) => [t.id, t.name]));
    const head = ['Name', 'Gruppe', 'Status', 'Erwachsene', 'Kinder', 'Menü', 'Allergien', 'Musikwunsch', 'Nachricht', 'Tisch', 'Telefon', 'Notiz', 'Link'];
    const rows = this.guests().map((g) => [
      g.name,
      g.group ?? '',
      this.statusLabel(g.status),
      g.adults,
      g.children,
      g.menu ? this.g(`menu.${g.menu}`) : '',
      g.allergies ?? '',
      g.song ?? '',
      g.message ?? '',
      g.table ? (tables.get(g.table) ?? '') : '',
      g.phone ?? '',
      g.note ?? '',
      this.guestLink(g),
    ]);
    const cell = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
    // Semikolon und BOM: so öffnet Excel die Datei in Deutschland ohne Umweg korrekt.
    const csv = '﻿' + [head, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
    download(`gaeste-${this.slug}.csv`, csv, 'text/csv;charset=utf-8');
  }

  num(v: string, min = 0): number {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? Math.max(min, n) : min;
  }

  // ── Sitzplan ───────────────────────────────────────────

  seated(tableId: string): InviteGuest[] {
    return this.seatable().filter((g) => g.table === tableId);
  }

  seatCount(tableId: string): number {
    return this.seated(tableId).reduce((n, g) => n + g.adults + g.children, 0);
  }

  addTable(): void {
    this.editPlan((p) => p.tables.push({ id: rid(), name: this.t('seat.name').replace('{n}', String(p.tables.length + 1)), seats: 8 }));
  }

  removeTable(id: string): void {
    this.editPlan((p) => (p.tables = p.tables.filter((t) => t.id !== id)));
    for (const g of this.guests().filter((x) => x.table === id)) void this.updateGuest(g, { table: undefined });
  }

  pick(g: InviteGuest): void {
    this.picked.set(this.picked() === g.id ? null : g.id);
  }

  seat(tableId: string | undefined, guestId = this.picked()): void {
    const g = this.guests().find((x) => x.id === guestId);
    if (!g) return;
    void this.updateGuest(g, { table: tableId });
    this.picked.set(null);
  }

  onDragStart(ev: DragEvent, g: InviteGuest): void {
    ev.dataTransfer?.setData('text/plain', g.id);
    this.picked.set(g.id);
  }

  onDrop(ev: DragEvent, tableId: string | undefined): void {
    ev.preventDefault();
    const id = ev.dataTransfer?.getData('text/plain');
    if (id) this.seat(tableId, id);
  }

  print(): void {
    window.print();
  }

  // ── Checkliste ─────────────────────────────────────────

  addTask(): void {
    this.editPlan((p) => p.tasks.push({ id: rid(), title: '', done: false }));
  }

  loadTemplate(): void {
    const e = this.event()!;
    this.editPlan((p) => p.tasks.push(...taskTemplate(e.date, this.hl())));
  }

  editTask(id: string, patch: Partial<InvitePlan['tasks'][number]>): void {
    this.editPlan((p) => {
      const t = p.tasks.find((x) => x.id === id);
      if (t) Object.assign(t, patch);
    });
  }

  removeTask(id: string): void {
    this.editPlan((p) => (p.tasks = p.tasks.filter((x) => x.id !== id)));
  }

  // ── Budget ─────────────────────────────────────────────

  addBudget(): void {
    this.editPlan((p) => p.budget.push({ id: rid(), item: '', planned: 0, paid: 0 }));
  }

  editBudget(id: string, patch: Partial<InvitePlan['budget'][number]>): void {
    this.editPlan((p) => {
      const b = p.budget.find((x) => x.id === id);
      if (b) Object.assign(b, patch);
    });
  }

  removeBudget(id: string): void {
    this.editPlan((p) => (p.budget = p.budget.filter((x) => x.id !== id)));
  }

  // ── Fotos ──────────────────────────────────────────────

  async uploadOwn(input: HTMLInputElement): Promise<void> {
    const files = Array.from(input.files ?? []).filter((f) => f.type.startsWith('image/'));
    input.value = '';
    if (!files.length) return;
    this.upBusy.set(true);
    for (const f of files) {
      try {
        const url = await this.store.ownerUpload(this.slug, this.key, f);
        this.editEvent((e) => e.gallery.push(url));
      } catch {
        this.saveState.set('error');
      }
    }
    this.upBusy.set(false);
  }

  /** Eigenes Titelbild hochladen und gleich verwenden. */
  async uploadHero(input: HTMLInputElement): Promise<void> {
    const file = Array.from(input.files ?? []).find((f) => f.type.startsWith('image/'));
    input.value = '';
    if (!file) return;
    this.upBusy.set(true);
    try {
      const url = await this.store.ownerUpload(this.slug, this.key, file);
      this.editEvent((e) => (e.heroImage = url));
    } catch {
      this.saveState.set('error');
    }
    this.upBusy.set(false);
  }

  setHero(url: string | undefined): void {
    this.editEvent((e) => (e.heroImage = url));
  }

  removeOwn(url: string): void {
    this.editEvent((e) => {
      e.gallery = e.gallery.filter((u) => u !== url);
      if (e.heroImage === url) e.heroImage = undefined;
    });
  }

  async togglePhoto(p: InvitePhoto): Promise<void> {
    try {
      await this.store.setPhotoHidden(this.slug, this.key, p.id, !p.hidden);
      this.photos.update((list) => list.map((x) => (x.id === p.id ? { ...x, hidden: !p.hidden } : x)));
    } catch {
      this.saveState.set('error');
    }
  }

  async deletePhoto(p: InvitePhoto): Promise<void> {
    try {
      await this.store.deletePhoto(this.slug, this.key, p.id);
      this.photos.update((list) => list.filter((x) => x.id !== p.id));
    } catch {
      this.saveState.set('error');
    }
  }

  slides(): string[] {
    return [...(this.event()?.gallery ?? []), ...this.photos().filter((p) => !p.hidden).map((p) => p.url)];
  }

  // ── Einladung bearbeiten ───────────────────────────────
  //
  // Angular-Vorlagen kennen keine Pfeilfunktionen; darum adressieren die
  // Felder ihren Wert über einen Pfad wie „schedule.2.time".

  val(ev: Event): string {
    return (ev.target as HTMLInputElement).value;
  }

  checked(ev: Event): boolean {
    return (ev.target as HTMLInputElement).checked;
  }

  setE(path: string, value: unknown): void {
    this.editEvent((e) => setPath(e, path, value));
  }

  setP(path: string, value: unknown): void {
    this.editPlan((p) => setPath(p, path, value));
  }

  /** LocalText am Pfad in der gewählten Bearbeitungssprache setzen. */
  setLtE(path: string, value: string): void {
    this.editEvent((e) => setPath(e, path, this.setLt(getPath(e, path) as LocalText | undefined, value.trim())));
    this.changed.update((m) => new Map(m).set(path, this.textLang()));
  }

  removeAt(list: 'schedule' | 'locations' | 'contacts' | 'faq', index: number): void {
    this.editEvent((e) => e[list].splice(index, 1));
    // Die Pfade dahinter verschieben sich; ihre Markierung gilt nicht mehr.
    this.changed.update((m) => new Map([...m].filter(([p]) => !p.startsWith(`${list}.`))));
  }

  /**
   * „Speichern & übersetzen": speichert und überträgt die Texte, die in der
   * gewählten Sprache geändert wurden, in alle anderen Sprachen der
   * Einladung. Mit `all` werden alle Texte dieser Sprache neu übersetzt.
   * Schlägt die Übersetzung fehl, ist trotzdem alles gespeichert.
   */
  async saveAndTranslate(all = false): Promise<void> {
    const e = this.event();
    if (!e || this.translateState() === 'busy') return;
    const source = this.textLang();
    const targets = e.langs.filter((l) => l !== source);
    const paths = all ? localTextPaths(e) : [...this.changed()].filter(([, l]) => l === source).map(([p]) => p);
    const items = paths
      .map((id) => ({ id, text: this.textIn(getPath(e, id) as LocalText | undefined, source) }))
      .filter((it) => it.text);

    if (this.saveTimer) clearTimeout(this.saveTimer);
    if (!targets.length || !items.length) {
      await this.flush();
      this.translateState.set('nothing');
      return;
    }

    this.translateState.set('busy');
    try {
      const tr = await this.store.translate(this.slug, this.key, { source, targets, items });
      this.editEvent((ev) => {
        for (const [path, texts] of Object.entries(tr)) {
          const cur = getPath(ev, path) as LocalText | undefined;
          if (!items.some((i) => i.id === path)) continue;
          const obj: Partial<Record<InviteLang, string>> = typeof cur === 'string' ? { [source]: cur } : { ...(cur ?? {}) };
          setPath(ev, path, { ...obj, ...texts });
        }
      });
      if (this.saveTimer) clearTimeout(this.saveTimer);
      await this.flush();
      this.changed.update((m) => new Map([...m].filter(([p, l]) => !(l === source && paths.includes(p)))));
      this.translatedInto.set(targets.length);
      this.translateState.set(this.saveState() === 'error' ? 'error' : 'done');
    } catch (err) {
      await this.flush();
      const code = err instanceof Error ? err.message : '';
      this.translateState.set(code === 'translate_not_configured' ? 'nokey' : code === 'too_many' ? 'limit' : 'error');
    }
  }

  /** Text einer Sprache; ein einfacher String gilt für alle Sprachen. */
  private textIn(text: LocalText | undefined, lang: InviteLang): string {
    if (!text) return '';
    return (typeof text === 'string' ? text : (text[lang] ?? '')).trim();
  }

  langList(): string {
    const e = this.event();
    return e ? e.langs.filter((l) => l !== this.textLang()).map((l) => this.langNames[l]).join(', ') : '';
  }

  /** Neue Adresse: alte Koordinaten passen nicht mehr. */
  setAddress(index: number, address: string): void {
    this.editEvent((e) => {
      const loc = e.locations[index];
      loc.address = address;
      loc.lat = undefined;
      loc.lng = undefined;
    });
  }

  retry(): void {
    void this.start();
  }

  lt(text: LocalText | undefined): string {
    if (!text) return '';
    if (typeof text === 'string') return text;
    return text[this.textLang()] ?? '';
  }

  /** Text in der gewählten Bearbeitungssprache setzen; andere Sprachen bleiben. */
  setLt(text: LocalText | undefined, value: string): LocalText {
    const base = this.event()!.langs[0] ?? 'de';
    const obj: Partial<Record<InviteLang, string>> = typeof text === 'string' ? { [base]: text } : { ...(text ?? {}) };
    if (value) obj[this.textLang()] = value;
    else delete obj[this.textLang()];
    return obj;
  }

  placeholder(text: LocalText | undefined): string {
    return localText(text, this.event()!.langs[0] ?? 'de');
  }

  dateInput(): string {
    return toLocalInput(this.event()?.date ?? '');
  }

  setDate(v: string): void {
    const iso = fromLocalInput(v);
    if (iso) this.editEvent((e) => (e.date = iso));
  }

  toggleLang(l: InviteLang): void {
    this.editEvent((e) => {
      if (e.langs.includes(l)) {
        if (e.langs.length > 1) e.langs = e.langs.filter((x) => x !== l);
      } else e.langs.push(l);
    });
  }

  setTheme(id: ThemeId): void {
    this.editEvent((e) => {
      const before = inviteTheme(e.theme);
      e.theme = id;
      // Titelbild der alten Gestaltung durch das der neuen ersetzen — ein eigenes Foto bleibt.
      if (!e.heroImage || e.heroImage === before.image) e.heroImage = inviteTheme(id).image;
    });
  }

  previewMusic(id: MusicId): void {
    this.editEvent((e) => (e.music = id));
    if (id === 'none') this.music.stop();
    else this.music.play(id);
  }

  sectionKeys(): (keyof InviteEvent['sections'])[] {
    return ['countdown', 'story', 'schedule', 'locations', 'rsvp', 'gifts', 'photos', 'faq'];
  }

  addScheduleItem(): void {
    this.editEvent((e) => e.schedule.push({ time: '18:00', title: {}, icon: 'heart', location: e.locations[0]?.id }));
  }

  addLocation(): void {
    this.editEvent((e) => e.locations.push({ id: rid(), label: {}, name: '', address: '' }));
  }

  addContact(): void {
    this.editEvent((e) => e.contacts.push({ role: {}, name: '', phone: '' }));
  }

  addFaq(): void {
    this.editEvent((e) => e.faq.push({ q: {}, a: {} }));
  }

  setGift(field: 'accountHolder' | 'iban' | 'bic' | 'paypal' | 'reference', value: string): void {
    this.editEvent((e) => {
      e.gifts = { ...(e.gifts ?? {}), [field]: value.trim() || undefined };
    });
  }

  menuLabel(m: MenuChoice): string {
    return m ? this.g(`menu.${m}`) : '—';
  }
}
