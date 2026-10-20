import { Component, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IconComponent } from '../shared/icon/icon.component';
import { demoEvent } from './invite-demo';
import { PLANNER } from './planner.token';
import { EventKind, InviteLang, ThemeId, localText } from './invite.model';

/** Beispiel, dessen Ablauf als Vorlage für die Art dient. */
const TEMPLATE_FOR: Record<EventKind, ThemeId> = {
  wedding: 'klassik',
  henna: 'kina',
  engagement: 'garten',
  birthday: 'mitternacht',
  corporate: 'business',
  other: 'minimal',
};

const COUPLE_KINDS: EventKind[] = ['wedding', 'henna', 'engagement'];

const STEPS = ['basics', 'when', 'design', 'lang', 'texts', 'schedule', 'gifts', 'photos', 'done'] as const;
type Step = (typeof STEPS)[number];

/**
 * Einrichtungsassistent für den Gastgeber: Schritt für Schritt von den Namen
 * bis zum fertigen Link — mit einer Live-Vorschau im Handy daneben.
 *
 * Jeder Schritt schreibt direkt in die Einladung (über den Planer, der
 * speichert); „Weiter" speichert sofort und lädt die Vorschau neu. Am Ende
 * werden die Texte in alle gewählten Sprachen übersetzt und der Link geteilt.
 */
@Component({
  selector: 'app-setup-wizard',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './setup-wizard.component.html',
  styleUrl: './setup-wizard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SetupWizardComponent implements OnInit {
  readonly p = inject(PLANNER);
  private readonly sanitizer = inject(DomSanitizer);

  readonly steps = STEPS;
  readonly step = signal(0);
  readonly current = computed<Step>(() => STEPS[this.step()]);
  readonly busy = signal(false);
  readonly previewVersion = signal(0);
  readonly showPreview = signal(false);

  readonly nameA = signal('');
  readonly nameB = signal('');

  readonly e = computed(() => this.p.event()!);
  readonly baseLang = computed<InviteLang>(() => this.e().langs[0] ?? 'de');
  readonly couple = computed(() => COUPLE_KINDS.includes(this.e().kind));

  readonly previewUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `/einladung/${this.p.slug}?embed=1&open=1&lang=${this.baseLang()}&v=${this.previewVersion()}`,
    ),
  );

  ngOnInit(): void {
    this.readNames();
    // Texte schreibt der Gastgeber in der ersten Sprache der Einladung.
    this.p.textLang.set(this.baseLang());
  }

  t(key: string): string {
    return this.p.t(key);
  }

  // ── Navigation ─────────────────────────────────────────

  async go(i: number): Promise<void> {
    if (i < 0 || i >= STEPS.length || this.busy()) return;
    this.busy.set(true);
    await this.p.saveNow();
    this.previewVersion.update((v) => v + 1);
    this.step.set(i);
    this.busy.set(false);
    if (STEPS[i] === 'done') void this.translateAll();
    document.querySelector('.wz-main')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  next(): Promise<void> {
    return this.go(this.step() + 1);
  }

  back(): Promise<void> {
    return this.go(this.step() - 1);
  }

  /** Später weitermachen: Assistent schließen, Stand bleibt gespeichert. */
  async later(): Promise<void> {
    await this.p.saveNow();
    this.p.wizard.set(false);
  }

  finish(): void {
    this.p.finishSetup();
  }

  /** Zum Schluss alle Texte aus der ersten Sprache in die übrigen übertragen. */
  private async translateAll(): Promise<void> {
    if (this.e().langs.length < 2) return;
    this.p.textLang.set(this.baseLang());
    await this.p.saveAndTranslate(true);
    this.previewVersion.update((v) => v + 1);
  }

  // ── Schritt 1: Anlass & Namen ──────────────────────────

  private readNames(): void {
    const parts = this.e().title.split(/\s*&\s*/);
    this.nameA.set(parts[0] ?? '');
    this.nameB.set(parts.slice(1).join(' & '));
  }

  setKind(kind: EventKind): void {
    this.p.setE('kind', kind);
  }

  setName(which: 'a' | 'b', value: string): void {
    (which === 'a' ? this.nameA : this.nameB).set(value);
    const a = this.nameA().trim();
    const b = this.nameB().trim();
    this.p.setE('title', a && b ? `${a} & ${b}` : a || b);
  }

  // ── Schritt 2: Orte ────────────────────────────────────

  addLocation(): void {
    if (this.e().locations.length < 3) this.p.addLocation();
  }

  // ── Schritt 4: Sprachen ────────────────────────────────

  /** Eine Sprache zur ersten machen: in ihr schreibt der Gastgeber, von ihr wird übersetzt. */
  makeFirst(l: InviteLang): void {
    this.p.editEvent((ev) => {
      ev.langs = [l, ...ev.langs.filter((x) => x !== l)];
    });
    this.p.textLang.set(l);
  }

  // ── Schritt 6: Ablauf ──────────────────────────────────

  /** Ablauf aus dem passenden Beispiel übernehmen — Titel schon in allen Sprachen. */
  applyTemplate(): void {
    const tpl = demoEvent(TEMPLATE_FOR[this.e().kind]);
    this.p.editEvent((ev) => {
      const ids = new Set(ev.locations.map((l) => l.id));
      ev.schedule = structuredClone(tpl.schedule).map((it) => ({
        ...it,
        location: it.location && ids.has(it.location) ? it.location : ev.locations[0]?.id,
      }));
    });
  }

  // ── Schritt 7: Geschenke ───────────────────────────────

  setGiftsOn(on: boolean): void {
    this.p.setE('sections.gifts', on);
  }

  // ── Anzeige ────────────────────────────────────────────

  progress(): number {
    return Math.round((this.step() / (STEPS.length - 1)) * 100);
  }

  text(v: Parameters<typeof localText>[0]): string {
    return localText(v, this.baseLang());
  }
}
