import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageFieldComponent } from './image-field.component';

/**
 * Das Bildfeld des Kartengestalters.
 *
 * Geprüft wird vor allem, was *nicht* hochgeladen wird: eine SVG-Datei darf
 * Skript enthalten, und ein 12-MB-Foto aus der Kamera soll nicht erst über
 * ein mobiles Netz gehen, um dann abgelehnt zu werden. Beides muss hier
 * hängen bleiben, bevor eine Anfrage rausgeht — der Server prüft es auch,
 * aber dann ist die Leitung schon belegt.
 * Ausführen mit `npm test`.
 */

@Component({
  standalone: true,
  imports: [ImageFieldComponent],
  template: `<app-image-field [label]="'Logo'" [url]="url()" (urlChange)="url.set($event)" />`,
})
class HostComponent {
  readonly url = signal('');
}

describe('ImageFieldComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let field: ImageFieldComponent;
  let fetchSpy: jasmine.Spy;

  const file = (type: string, size = 1024, name = 'logo.png') =>
    new File([new Uint8Array(size)], name, { type });

  /** Eine Dateiauswahl, wie sie der Browser meldet. */
  const choose = (f: File | null) =>
    field.chosen({ target: { files: f ? [f] : [], value: 'x' } } as unknown as Event);

  const ok = (url: string) =>
    Promise.resolve({ ok: true, status: 201, json: () => Promise.resolve({ url }) } as Response);
  const fail = (status: number, error?: string) =>
    Promise.resolve({ ok: false, status, json: () => Promise.resolve({ error }) } as Response);

  beforeEach(() => {
    fetchSpy = spyOn(window, 'fetch').and.returnValue(ok('https://cdn.test/a.png'));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    field = fixture.debugElement.children[0].componentInstance as ImageFieldComponent;
  });

  const el = <T extends Element>(sel: string): T | null => fixture.nativeElement.querySelector(sel);
  const err = () => el('.if-error')?.textContent?.trim() ?? '';

  it('zeigt zuerst nur den Knopf zum Aussuchen', () => {
    expect(el('.if-drop')).not.toBeNull();
    expect(el('.if-thumb')).toBeNull();
  });

  it('lädt hoch und meldet die Adresse nach oben', async () => {
    await choose(file('image/png'));
    fixture.detectChanges();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.calls.mostRecent().args as [string, RequestInit];
    expect(url).toBe('/api/card-image');
    expect(init.method).toBe('POST');
    // Die Art im Kopf, der Rohinhalt als Körper — kein FormData: sonst käme
    // die Dateiendung aus der Anfrage statt vom Server.
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('image/png');
    expect(init.body instanceof File).toBeTrue();

    expect(host.url()).toBe('https://cdn.test/a.png');
    expect(el('.if-thumb')).not.toBeNull();
  });

  it('schickt eine SVG-Datei gar nicht erst los', async () => {
    await choose(file('image/svg+xml', 100, 'logo.svg'));
    fixture.detectChanges();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(err()).toContain('SVG');
  });

  it('schickt ein zu großes Bild gar nicht erst los', async () => {
    await choose(file('image/jpeg', 6 * 1024 * 1024));
    fixture.detectChanges();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(err()).toContain('5 MB');
  });

  it('tut nichts, wenn die Auswahl abgebrochen wurde', async () => {
    await choose(null);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(err()).toBe('');
  });

  it('nennt den Grund, den der Server nennt', async () => {
    fetchSpy.and.returnValue(fail(429));
    await choose(file('image/png'));
    fixture.detectChanges();
    expect(err()).toContain('Stunde');

    fetchSpy.and.returnValue(fail(400, 'too_large'));
    await choose(file('image/png'));
    fixture.detectChanges();
    expect(err()).toContain('5 MB');
  });

  it('sagt es, wenn die Leitung abreißt', async () => {
    fetchSpy.and.returnValue(Promise.reject(new Error('offline')));
    await choose(file('image/png'));
    fixture.detectChanges();
    expect(err()).toContain('nicht geklappt');
    expect(host.url()).toBe('');
  });

  it('meldet beim Entfernen eine leere Adresse nach oben', async () => {
    await choose(file('image/png'));
    fixture.detectChanges();
    expect(host.url()).not.toBe('');

    (fixture.nativeElement.querySelectorAll('.if-link')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(host.url()).toBe('');
    expect(el('.if-drop')).not.toBeNull();
  });

  it('räumt einen alten Fehler weg, sobald es klappt', async () => {
    await choose(file('image/svg+xml', 100, 'a.svg'));
    fixture.detectChanges();
    expect(err()).not.toBe('');

    await choose(file('image/png'));
    fixture.detectChanges();
    expect(err()).toBe('');
  });
});
