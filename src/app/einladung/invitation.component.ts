import {
  Component,
  DestroyRef,
  NgZone,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import qrcode from 'qrcode-generator';
import { SeoService } from '../core/seo/seo.service';
import { IconComponent } from '../shared/icon/icon.component';
import { isDemoSlug } from './invite-demo';
import { GUEST_TEXT, formatDate, formatTime, tx } from './invite-i18n';
import {
  copyText,
  download,
  ensureInviteFonts,
  googleCalendarUrl,
  icsFile,
  mapsLinks,
  phoneDigits,
  whatsappLink,
} from './invite-links';
import { DOVE_SVG, artSvg } from './invite-art';
import { dividerSvg, scheduleIcon } from './invite-ornaments';
import { InviteStore } from './invite-store.service';
import { INVITE_THEMES, InviteIntro, inviteTheme, themeVars } from './invite-themes';
import {
  INVITE_LANG_NAMES,
  InviteLang,
  InviteLocation,
  InvitePhoto,
  LocalText,
  MENU_CHOICES,
  MUSIC_IDS,
  MenuChoice,
  MusicId,
  PublicInvite,
  RTL_LANGS,
  RsvpStatus,
  ThemeId,
  epcPayload,
  formatIban,
  localText,
  paypalUrl,
} from './invite.model';
import { MusicService } from './music.service';
import { RevealDirective } from './reveal.directive';
import { PointerFxDirective, ScrollFxDirective } from './scroll-fx.directive';
import { SlideshowComponent } from './slideshow.component';
import { ParticlesComponent } from './particles.component';
import { registerInviteIcons } from './invite-icons';

type Status = 'loading' | 'ready' | 'missing';

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/** So lange spielt die Öffnung, bevor die Seite frei wird (siehe invitation-intros.scss). */
const INTRO_MS: Record<InviteIntro, number> = { envelope: 2100, doves: 1900, curtain: 2000, doors: 2300 };

registerInviteIcons();

/**
 * Die Einladung, wie Gäste sie sehen: /einladung/<slug>.
 *
 * Ein Umschlag zum Öffnen (der zugleich die Musik freigibt), dann eine lange
 * Seite: Titel, Countdown, Geschichte, Ablauf, Orte mit Routen-Knöpfen,
 * Zusage, Geschenke (IBAN, GiroCode, PayPal), Fotoalbum und Infos.
 *
 * Beispiele (`demo-…`) sind vorgerendert und sofort da; echte Einladungen
 * kommen aus der API, sobald die Seite im Browser läuft.
 */
@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [RouterLink, IconComponent, RevealDirective, ScrollFxDirective, PointerFxDirective, SlideshowComponent, ParticlesComponent],
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss', './invitation-chrome.scss', './invitation-intros.scss', './invitation-scroll.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InvitationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(InviteStore);
  private readonly seo = inject(SeoService);
  private readonly doc = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  readonly music = inject(MusicService);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';
  private readonly guestCode = this.route.snapshot.queryParamMap.get('g');
  readonly demo = isDemoSlug(this.slug);
  /** In einem Rahmen gezeigt (Startseite der Website): ohne Vorschau-Leiste. */
  readonly embed = this.route.snapshot.queryParamMap.get('embed') === '1';

  readonly status = signal<Status>('loading');
  readonly data = signal<PublicInvite | null>(null);
  readonly lang = signal<InviteLang>('de');
  /** Nur in Beispielen: Gestaltung zur Ansicht wechseln, ohne etwas zu speichern. */
  readonly themeOverride = signal<ThemeId | null>(null);
  readonly musicOverride = signal<MusicId | null>(null);
  /** ?open=1 (Vorschau im Einrichtungsassistenten): ohne Umschlag, gleich die Seite. */
  readonly opened = signal(this.route.snapshot.queryParamMap.get('open') === '1');
  /** Der Umschlag öffnet sich gerade (Siegel, Klappe, Brief). */
  readonly opening = signal(false);
  readonly storyImageFailed = signal(false);
  readonly js = signal(false);
  readonly panel = signal(false);
  readonly now = signal(Date.now());
  readonly copied = signal<string | null>(null);
  readonly slideshow = signal(false);

  // Zusage
  readonly rName = signal('');
  readonly rStatus = signal<Exclude<RsvpStatus, 'invited'> | null>(null);
  readonly rAdults = signal(1);
  readonly rChildren = signal(0);
  readonly rMenu = signal<MenuChoice>('');
  readonly rAllergies = signal('');
  readonly rSong = signal('');
  readonly rMessage = signal('');
  readonly rState = signal<'idle' | 'sending' | 'done' | 'error' | 'invalid'>('idle');
  private rCode: string | undefined;

  // Fotos
  readonly photos = signal<InvitePhoto[]>([]);
  readonly upBy = signal('');
  readonly upState = signal<'idle' | 'busy' | 'done' | 'error'>('idle');
  readonly upLeft = signal(0);

  readonly themes = INVITE_THEMES;
  readonly musicIds = MUSIC_IDS;
  readonly menus = MENU_CHOICES;
  readonly langNames = INVITE_LANG_NAMES;

  readonly event = computed(() => this.data()?.event ?? null);
  readonly theme = computed(() => inviteTheme(this.themeOverride() ?? this.event()?.theme));
  readonly vars = computed(() => themeVars(this.theme()));
  readonly rtl = computed(() => RTL_LANGS.includes(this.lang()));
  readonly divider = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(dividerSvg(this.theme().ornament)));
  /** Gezeichnete Ecken der Gestaltung (statisch, siehe invite-art.ts). */
  readonly art = computed<SafeHtml | null>(() => {
    const id = this.theme().art;
    return id ? this.sanitizer.bypassSecurityTrustHtml(artSvg(id)) : null;
  });
  readonly dove: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(DOVE_SVG);
  /** Titelbild im Bogen statt über die ganze Fläche. */
  readonly framed = computed(() => this.theme().hero === 'framed');
  readonly musicId = computed<MusicId>(() => this.musicOverride() ?? this.event()?.music ?? 'none');
  readonly hasMusic = computed(() => this.musicId() !== 'none' || !!this.event()?.musicUrl);
  readonly heroImage = signal<string | null>(null);

  /** Monogramm aus den Anfangsbuchstaben: „Ayşe & Daniel" → A & D. */
  readonly monogram = computed(() => {
    const title = this.event()?.title.trim() ?? '';
    const parts = title.split(/\s*(?:&|\+| und | ve | and | et | û )\s*/i).filter(Boolean);
    const first = (s: string) => s.trim().charAt(0).toLocaleUpperCase();
    return parts.length >= 2 ? { a: first(parts[0]), b: first(parts[1]) } : { a: first(title), b: '' };
  });

  /** „Giulia & Marco" → zwei Namen, die beim Scrollen auseinander- und am Ende wieder zusammengehen. */
  readonly titleParts = computed(() => {
    const m = /^(.+?)\s*([&+])\s*(.+)$/.exec(this.event()?.title.trim() ?? '');
    return m ? { a: m[1], amp: m[2], b: m[3] } : null;
  });
  /** Wörter für das Aufleuchten beim Lesen. */
  readonly welcomeWords = computed(() => words(this.l(this.event()?.welcome)));
  readonly storyWords = computed(() => words(this.l(this.event()?.story)));

  /** Foto neben der Geschichte: das erste Foto der Galerie des Gastgebers. */
  readonly storyImage = computed(() => {
    const e = this.event();
    if (!e || this.storyImageFailed()) return null;
    return e.gallery[0] ?? null;
  });

  readonly eyebrow = computed(() => {
    const e = this.event();
    if (!e) return '';
    return this.l(e.eyebrow) || this.t(`kind.${e.kind}`);
  });
  readonly dateText = computed(() => (this.event() ? formatDate(this.event()!.date, this.lang()) : ''));
  readonly timeText = computed(() => (this.event() ? formatTime(this.event()!.date, this.lang()) : ''));
  readonly city = computed(() => {
    const a = this.event()?.locations[0]?.address ?? '';
    return a.split(',').pop()?.replace(/^\s*\d{4,5}\s*/, '').trim() ?? '';
  });

  readonly countdown = computed(() => {
    const e = this.event();
    if (!e) return null;
    const diff = new Date(e.date).getTime() - this.now();
    if (diff <= 0) return { past: diff < -86400000, today: diff > -86400000, d: 0, h: 0, m: 0, s: 0 };
    return {
      past: false,
      today: false,
      d: Math.floor(diff / 864e5),
      h: Math.floor((diff / 36e5) % 24),
      m: Math.floor((diff / 6e4) % 60),
      s: Math.floor((diff / 1e3) % 60),
    };
  });

  readonly rsvpOpen = computed(() => {
    const until = this.event()?.rsvpUntil;
    if (!until) return true;
    return this.now() < new Date(`${until}T23:59:59`).getTime();
  });

  readonly nav = computed(() => {
    const e = this.event();
    if (!e) return [];
    const s = e.sections;
    return [
      s.schedule && e.schedule.length ? { id: 'ablauf', key: 'nav.schedule', icon: 'clock' } : null,
      s.locations && e.locations.length ? { id: 'anfahrt', key: 'nav.locations', icon: 'pin' } : null,
      s.rsvp ? { id: 'zusage', key: 'nav.rsvp', icon: 'check' } : null,
      s.gifts && e.gifts ? { id: 'geschenke', key: 'nav.gifts', icon: 'gift' } : null,
      s.photos ? { id: 'fotos', key: 'nav.photos', icon: 'camera' } : null,
      s.faq && (e.faq.length || e.contacts.length) ? { id: 'infos', key: 'nav.faq', icon: 'list' } : null,
    ].filter((x): x is { id: string; key: string; icon: string } => !!x);
  });

  readonly giroCode = computed<SafeHtml | null>(() => {
    const g = this.event()?.gifts;
    const payload = g ? epcPayload(g) : null;
    if (!payload) return null;
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
    const code = qrcode(0, 'M');
    code.addData(payload, 'Byte');
    code.make();
    // Das SVG stammt vollständig aus qrcode-generator.
    return this.sanitizer.bypassSecurityTrustHtml(code.createSvgTag({ cellSize: 4, margin: 2, scalable: true }));
  });

  readonly slides = computed(() => [...(this.event()?.gallery ?? []), ...this.photos().map((p) => p.url)]);

  constructor() {
    ensureInviteFonts(this.doc);

    // Beispiele sofort, auch beim Vorrendern — so steht die ganze Seite im HTML.
    const demo = this.store.demoPublic(this.slug);
    if (demo) this.apply(demo, false);

    if (!this.isBrowser) return;
    afterNextRender(() => {
      this.js.set(true);
      void this.load();
      this.zone.runOutsideAngular(() => {
        const timer = setInterval(() => this.now.set(Date.now()), 1000);
        const onScroll = () => this.parallax();
        window.addEventListener('scroll', onScroll, { passive: true });
        this.destroyRef.onDestroy(() => {
          clearInterval(timer);
          window.removeEventListener('scroll', onScroll);
        });
      });
    });
    this.destroyRef.onDestroy(() => this.music.stop(false));
  }

  ngOnInit(): void {
    this.updateSeo();
  }

  // ── Laden ──────────────────────────────────────────────

  private async load(): Promise<void> {
    let res: PublicInvite | null = null;
    try {
      res = await this.store.loadPublic(this.slug, this.guestCode);
    } catch {
      res = null;
    }
    if (!res) {
      if (!this.data()) this.status.set('missing');
      return;
    }
    this.apply(res, true);
    this.restoreRsvp();
  }

  private apply(res: PublicInvite, browser: boolean): void {
    this.data.set(res);
    this.photos.set(res.photos);
    this.heroImage.set(res.event.heroImage ?? null);
    this.status.set('ready');
    if (browser) this.lang.set(this.pickLang(res.event.langs));
    else this.lang.set(res.event.langs[0] ?? 'de');
    if (res.guest) {
      const g = res.guest;
      this.rName.set(g.name);
      if (g.status !== 'invited') {
        this.rStatus.set(g.status);
        this.rAdults.set(g.adults);
        this.rChildren.set(g.children);
        this.rMenu.set(g.menu);
        this.rAllergies.set(g.allergies ?? '');
        this.rSong.set(g.song ?? '');
        this.rMessage.set(g.message ?? '');
      }
      this.rCode = g.code;
    }
    this.updateSeo();
  }

  /** Sprache: gespeicherte Wahl, ?lang=, Browsersprache — sonst die erste der Einladung. */
  private pickLang(langs: InviteLang[]): InviteLang {
    const q = this.route.snapshot.queryParamMap.get('lang') as InviteLang | null;
    if (q && langs.includes(q)) return q;
    try {
      const saved = localStorage.getItem(`bd-invite-lang:${this.slug}`) as InviteLang | null;
      if (saved && langs.includes(saved)) return saved;
    } catch {
      /* egal */
    }
    for (const n of navigator.languages ?? [navigator.language]) {
      const code = n.slice(0, 2).toLowerCase() as InviteLang;
      if (langs.includes(code)) return code;
    }
    return langs[0] ?? 'de';
  }

  private restoreRsvp(): void {
    if (this.data()?.guest?.status && this.data()!.guest!.status !== 'invited') {
      this.rState.set('done');
      return;
    }
    try {
      const raw = localStorage.getItem(`bd-invite-rsvp:${this.slug}`);
      if (!raw) return;
      const r = JSON.parse(raw) as { code: string; name: string; status: Exclude<RsvpStatus, 'invited'> };
      this.rCode = r.code;
      this.rName.set(r.name);
      this.rStatus.set(r.status);
      this.rState.set('done');
    } catch {
      /* egal */
    }
  }

  private updateSeo(): void {
    const e = this.event();
    const title = e ? `${e.title} · ${this.eyebrow()}` : 'Digitale Einladung';
    this.seo.update({
      title,
      description: e ? this.l(e.welcome).slice(0, 160) || title : 'Digitale Einladung',
      path: `/einladung/${this.slug}`,
      image: e?.heroImage || undefined,
      noIndex: true,
    });
    this.doc.documentElement.setAttribute('lang', this.lang());
  }

  // ── Texte ──────────────────────────────────────────────

  t(key: string): string {
    return tx(GUEST_TEXT, key, this.lang());
  }

  l(text: LocalText | undefined): string {
    return localText(text, this.lang(), this.event()?.langs[0] ?? 'de');
  }

  setLang(l: InviteLang): void {
    this.lang.set(l);
    this.doc.documentElement.setAttribute('lang', l);
    try {
      localStorage.setItem(`bd-invite-lang:${this.slug}`, l);
    } catch {
      /* egal */
    }
  }

  // ── Umschlag & Musik ───────────────────────────────────

  /**
   * Umschlag öffnen: Siegel bricht, Klappe geht auf, der Brief steigt heraus —
   * dann gibt der Umschlag die Seite frei. Die Musik startet sofort, solange
   * der Tipp des Gastes noch als Benutzeraktion gilt.
   */
  open(withMusic: boolean): void {
    if (this.opening() || this.opened()) return;
    if (withMusic && this.hasMusic()) this.music.play(this.musicId(), this.musicOverride() ? undefined : this.event()?.musicUrl);
    const reduced = this.isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.opening.set(true);
    setTimeout(() => this.opened.set(true), reduced ? 0 : INTRO_MS[this.theme().intro]);
  }

  toggleMusic(): void {
    this.music.toggle(this.musicId(), this.musicOverride() ? undefined : this.event()?.musicUrl);
  }

  pickMusic(id: MusicId): void {
    this.musicOverride.set(id);
    if (id === 'none') this.music.stop();
    else this.music.play(id);
  }

  pickTheme(id: ThemeId): void {
    this.themeOverride.set(id);
    this.heroImage.set(inviteTheme(id).image);
    if (!this.musicOverride() && this.music.playing()) this.music.play(inviteTheme(id).music);
  }

  /** Titelbild bewegt sich langsamer als die Seite. */
  private parallax(): void {
    const img = this.doc.querySelector<HTMLElement>('.iv-hero-img');
    if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const y = Math.min(window.scrollY, window.innerHeight);
    img.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(1.08)`;
  }

  heroFailed(): void {
    // Foto nicht erreichbar: die Gestaltung trägt den Kopf dann allein.
    this.heroImage.set(null);
  }

  // ── Kalender & Orte ────────────────────────────────────

  private calDetails(): string {
    const e = this.event()!;
    return `${this.eyebrow()} — ${this.pageUrl()}${e.locations[0] ? `\n${e.locations[0].name}, ${e.locations[0].address}` : ''}`;
  }

  googleCal(): string {
    const e = this.event();
    return e ? googleCalendarUrl(e, `${e.title} · ${this.eyebrow()}`, this.calDetails()) : '#';
  }

  ics(): void {
    const e = this.event()!;
    download(`${e.slug}.ics`, icsFile(e, `${e.title} · ${this.eyebrow()}`, this.calDetails(), this.pageUrl()), 'text/calendar');
  }

  pageUrl(): string {
    return `${SeoService.ORIGIN}/einladung/${this.slug}`;
  }

  maps(loc: InviteLocation) {
    return mapsLinks(loc);
  }

  locationOf(id: string | undefined): InviteLocation | undefined {
    return id ? this.event()?.locations.find((l) => l.id === id) : undefined;
  }

  icon(name: string | undefined): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(scheduleIcon(name));
  }

  tel(phone: string): string {
    return `tel:${phoneDigits(phone)}`;
  }

  wa(phone: string): string {
    return whatsappLink(phone);
  }

  async copy(id: string, text: string): Promise<void> {
    if (await copyText(text)) {
      this.copied.set(id);
      setTimeout(() => this.copied() === id && this.copied.set(null), 2000);
    }
  }

  iban(v: string): string {
    return formatIban(v);
  }

  paypal(v: string): string {
    return paypalUrl(v);
  }

  // ── Zusage ─────────────────────────────────────────────

  persons(): number[] {
    const max = this.event()?.rsvp.maxPersons ?? 6;
    return Array.from({ length: max }, (_, i) => i + 1);
  }

  kidsOptions(): number[] {
    const max = this.event()?.rsvp.maxPersons ?? 6;
    return Array.from({ length: max }, (_, i) => i);
  }

  async sendRsvp(ev: Event): Promise<void> {
    ev.preventDefault();
    const status = this.rStatus();
    const name = this.rName().trim();
    if (!status || name.length < 2) {
      this.rState.set('invalid');
      return;
    }
    this.rState.set('sending');
    const coming = status !== 'no';
    try {
      const res = await this.store.rsvp(this.slug, {
        code: this.rCode,
        name,
        status,
        adults: coming ? this.rAdults() : 0,
        children: coming ? this.rChildren() : 0,
        menu: coming ? this.rMenu() : '',
        allergies: coming ? this.rAllergies().trim() : '',
        song: coming ? this.rSong().trim() : '',
        message: this.rMessage().trim(),
      });
      this.rCode = res.code;
      try {
        localStorage.setItem(`bd-invite-rsvp:${this.slug}`, JSON.stringify({ code: res.code, name, status }));
      } catch {
        /* egal */
      }
      this.rState.set('done');
    } catch {
      this.rState.set('error');
    }
  }

  thanks(): string {
    const key = `rsvp.thanks.${this.rStatus() ?? 'yes'}`;
    return this.t(key).replace('{name}', this.rName().split(' ')[0]);
  }

  // ── Fotos ──────────────────────────────────────────────

  async upload(input: HTMLInputElement): Promise<void> {
    const files = Array.from(input.files ?? []).filter((f) => f.type.startsWith('image/'));
    input.value = '';
    if (!files.length) return;
    this.upState.set('busy');
    this.upLeft.set(files.length);
    let failed = false;
    for (const f of files) {
      try {
        const p = await this.store.uploadPhoto(this.slug, f, this.upBy().trim());
        this.photos.update((list) => [p, ...list]);
      } catch {
        failed = true;
      }
      this.upLeft.update((n) => n - 1);
    }
    this.upState.set(failed ? 'error' : 'done');
  }

  uploading(): string {
    return this.t('photo.uploading').replace('{n}', String(this.upLeft()));
  }

  rsvpUntilText(): string {
    const u = this.event()?.rsvpUntil;
    return u ? this.t('rsvp.until').replace('{date}', formatDate(`${u}T12:00:00`, this.lang(), false)) : '';
  }

  greeting(): string {
    return this.t('rsvp.hello').replace('{name}', (this.data()?.guest?.name ?? '').split(' ')[0]);
  }

  scrollTo(id: string): void {
    this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
