import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import type { CardKind, CardTheme } from '../../core/cards/card-draft.model';
import { CardPreviewComponent } from './card-preview.component';

/**
 * Die lebende Vorschau einer NFC-Karte.
 *
 * Geprüft wird hier nicht, wie die Karte aussieht — das macht der Server und
 * `renderCard` hat eigene Tests. Hier zählt das Verhalten drumherum: dass bei
 * jedem Tastendruck nicht eine Anfrage losgeht, dass eine überholte Antwort
 * nicht die neuere überschreibt, und vor allem, dass der Rahmen abgeschottet
 * bleibt — darin steht fremd gefüllter Inhalt.
 * Ausführen mit `npm test`.
 */

@Component({
  standalone: true,
  imports: [CardPreviewComponent],
  template: `<app-card-preview [kind]="kind()" [theme]="theme()" [data]="data()" />`,
})
class HostComponent {
  readonly kind = signal<CardKind>('business');
  readonly theme = signal<CardTheme>('brand');
  readonly data = signal<Record<string, unknown>>({});
}

describe('CardPreviewComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let fetchSpy: jasmine.Spy;

  /** Antwort des Servers — beliebig verzögert, um Überholen zu erzwingen. */
  const reply = (html: string, status = 200, delayMs = 0) =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ok: status < 400,
            status,
            json: () => Promise.resolve(status === 200 ? { html } : { error: 'nope' }),
          }),
        delayMs,
      ),
    );

  /**
   * Die Antwort wird erst beim Aufruf gebaut, nie vorher: `reply` setzt einen
   * Zeitgeber, und der gehört in die Zone des Tests. Eine im Voraus erzeugte
   * Zusage wäre im Test nie fertig geworden.
   */
  const answers = (...rest: (() => Promise<unknown>)[]) => {
    const queue = [...rest];
    fetchSpy.and.callFake(() => (queue.length > 1 ? queue.shift()! : queue[0])() as Promise<Response>);
  };

  beforeEach(() => {
    fetchSpy = spyOn(window, 'fetch');
    answers(() => reply('<!doctype html><p>Karte</p>'));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  const el = <T extends Element>(sel: string): T | null => fixture.nativeElement.querySelector(sel);
  const frame = () => el<HTMLIFrameElement>('iframe.cp-frame');
  const note = () => el('.cp-note')?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

  /** Entwurf setzen, Wartezeit ablaufen lassen, Antwort einsammeln. */
  function type(data: Record<string, unknown>): void {
    host.data.set(data);
    fixture.detectChanges();
    tick(400);
    flush();
    fixture.detectChanges();
  }

  it('fragt den Server nicht, solange das Pflichtfeld leer ist', fakeAsync(() => {
    type({ tagline: 'Kaffee seit 1931' });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(frame()).toBeNull();
    expect(note()).toContain('Namen des Betriebs');
  }));

  it('zeichnet die Karte, sobald das Pflichtfeld steht', fakeAsync(() => {
    type({ company: 'Café Krone' });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(frame()).not.toBeNull();
  }));

  it('schickt Art, Farbschema, Sprache und Inhalt an /api/card-preview', fakeAsync(() => {
    host.theme.set('dark');
    type({ company: 'Café Krone' });

    const [url, init] = fetchSpy.calls.mostRecent().args as [string, RequestInit];
    expect(url).toBe('/api/card-preview');
    expect(init.method).toBe('POST');
    const body = JSON.parse(String(init.body));
    expect(body.kind).toBe('business');
    expect(body.theme).toBe('dark');
    expect(body.lang).toBe('de');
    expect(body.data.company).toBe('Café Krone');
  }));

  it('wartet das Tippen ab, statt bei jedem Zeichen zu fragen', fakeAsync(() => {
    for (const company of ['C', 'Ca', 'Caf', 'Café']) {
      host.data.set({ company });
      fixture.detectChanges();
      tick(100);
    }
    tick(400);
    flush();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchSpy.calls.mostRecent().args[1].body)).data.company).toBe('Café');
  }));

  it('fragt nicht erneut, wenn sich an der Karte nichts geändert hat', fakeAsync(() => {
    type({ company: 'Café Krone' });
    type({ company: 'Café Krone' });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  }));

  it('lässt eine überholte Antwort die neuere nicht überschreiben', fakeAsync(() => {
    // Die erste Anfrage ist langsam, die zweite schnell. Ohne Abbruch stünde
    // am Ende die alte Karte im Rahmen.
    answers(() => reply('<p>alt</p>', 200, 900), () => reply('<p>neu</p>', 200, 10));

    host.data.set({ company: 'alt' });
    fixture.detectChanges();
    tick(400);

    host.data.set({ company: 'neu' });
    fixture.detectChanges();
    tick(400);
    flush();
    fixture.detectChanges();

    expect(frame()!.getAttribute('srcdoc')).toContain('neu');
    expect(frame()!.getAttribute('srcdoc')).not.toContain('alt');
  }));

  it('behandelt 422 als „noch nicht genug", nicht als Fehler', fakeAsync(() => {
    answers(() => reply('', 422));
    type({ company: 'Café Krone' });
    expect(frame()).toBeNull();
    expect(note()).not.toContain('nicht laden');
  }));

  it('sagt es, wenn der Server nicht antwortet', fakeAsync(() => {
    answers(() => Promise.reject(new Error('offline')));
    type({ company: 'Café Krone' });
    expect(note()).toContain('nicht laden');
  }));

  it('hält den Rahmen abgeschottet — darin steht fremd gefüllter Inhalt', fakeAsync(() => {
    type({ company: 'Café Krone' });
    const f = frame()!;
    // Ein leeres `sandbox` ist die schärfste Stufe: kein JavaScript, keine
    // Formulare, keine Navigation. Genau darum darf die Vorschau am Reiniger
    // von Angular vorbei.
    expect(f.getAttribute('sandbox')).toBe('');
    expect(f.getAttribute('referrerpolicy')).toBe('no-referrer');
  }));

  it('zeigt der Geschenkkarte ihren eigenen Hinweis', fakeAsync(() => {
    host.kind.set('gift');
    type({ to: 'Mira' });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(note()).toContain('Überschrift');
  }));
});
