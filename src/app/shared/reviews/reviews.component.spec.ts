import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import type { Lang } from '../../core/i18n/i18n.service';
import { expectNoBorrowedRatings } from '../../../testing/no-borrowed-ratings';
import { REVIEWS_CONTENT } from './reviews.content';
import { ReviewsComponent, type ReviewData } from './reviews.component';

/**
 * Tests des Bewertungsabschnitts.
 *
 * Zwei Dinge stehen hier über allem, und beide sind der Grund für den ganzen
 * Umweg über die eigene Datenbank:
 *
 *   * **Keine Anfrage an Google aus dem Browser des Besuchers.** Kein Bild,
 *     kein Skript, keine Einbettung. Sonst bräuchte der Abschnitt einen
 *     Einwilligungsbanner, und die Bewertungen wären hinter einem Klick.
 *   * **Kein Review-Schema.** Bewertungen einer fremden Plattform als eigenes
 *     AggregateRating auszuzeichnen, ahndet Google als self-serving markup.
 *
 * Dazu kommt: der Wortlaut des Gastes bleibt unverändert — das verlangen die
 * Bedingungen von Google, und es ist ohnehin das Mindeste.
 * Ausführen mit `npm test`.
 */

const review = (over: Partial<ReviewData['items'][number]> = {}): ReviewData['items'][number] => ({
  author: 'Sabine Wagner',
  rating: 5,
  text: 'Sehr freundlich und schnell — die Karten waren nach drei Tagen da.',
  date: '2026-08-01',
  label: 'vor 2 Monaten',
  ...over,
});

const data = (over: Partial<ReviewData> = {}): ReviewData => ({
  rating: 4.9,
  total: 27,
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  items: [review()],
  ...over,
});

describe('ReviewsComponent', () => {
  let fixture: ComponentFixture<ReviewsComponent>;

  function mount(source?: ReviewData): void {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [ReviewsComponent], providers: [provideRouter([])] });
    fixture = TestBed.createComponent(ReviewsComponent);
    if (source) fixture.componentRef.setInput('source', source);
    fixture.detectChanges();
  }

  const host = () => fixture.nativeElement as HTMLElement;
  const html = () => host().innerHTML;
  const text = () => host().textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const all = (sel: string) => Array.from(host().querySelectorAll(sel));
  const el = <T extends Element>(sel: string) => host().querySelector<T>(sel);

  describe('ohne Bewertungen', () => {
    it('zeigt gar nichts, statt einen leeren Abschnitt', () => {
      mount({ rating: null, total: null, placeId: '', items: [] });
      expect(el('section')).toBeNull();
      expect(text()).toBe('');
    });

    it('verrät keine Übersetzungsschlüssel', () => {
      mount({ rating: null, total: null, placeId: '', items: [] });
      expect(html()).not.toContain('rv.');
    });

    /** Der eingecheckte Stand ist leer — die Startseite darf davon nichts zeigen. */
    it('bleibt mit dem eingecheckten Stand still, solange nichts geholt wurde', () => {
      mount();
      const shown = fixture.componentInstance.items().length > 0;
      expect(el('section') !== null).toBe(shown);
    });

    it('lässt Bewertungen ohne Text weg — eine leere Karte sagt nichts', () => {
      mount(data({ items: [review({ text: '' }), review({ author: 'Mehmet K.', text: '   ' })] }));
      expect(el('section')).toBeNull();
    });

    it('behält die mit Text und lässt nur die leeren weg', () => {
      mount(data({ items: [review({ text: '' }), review({ author: 'Mehmet K.' })] }));
      expect(all('.rv-card').length).toBe(1);
      expect(text()).toContain('Mehmet K.');
    });
  });

  describe('mit Bewertungen', () => {
    beforeEach(() => mount(data()));

    it('zeigt Verfasser, Wortlaut und Zeitangabe', () => {
      expect(text()).toContain('Sabine Wagner');
      expect(text()).toContain('vor 2 Monaten');
      expect(text()).toContain('Sehr freundlich und schnell');
    });

    it('nennt die Gesamtnote mit Komma, wie man sie hier schreibt', () => {
      expect(text()).toContain('4,9');
      expect(text()).not.toContain('4.9');
    });

    it('nennt die Anzahl aller Bewertungen bei Google', () => {
      expect(text()).toContain('27 Bewertungen bei Google');
    });

    it('sagt, woher die Bewertungen kommen', () => {
      expect(text()).toContain('Google');
      expect(text()).toContain('unverändert');
    });

    it('verweist auf das eigene Google-Profil', () => {
      const a = el<HTMLAnchorElement>('.rv-source a');
      expect(a?.getAttribute('href')).toBe('https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4');
      expect(a?.getAttribute('target')).toBe('_blank');
      // noopener, weil ein fremdes Fenster nichts mit unserem zu tun hat.
      expect(a?.getAttribute('rel')).toContain('noopener');
      expect(a?.getAttribute('rel')).toContain('nofollow');
    });

    it('verweist auf die Bewertungskarten, mit denen wir sie sammeln', () => {
      const a = el<HTMLAnchorElement>('.rv-more');
      expect(a?.getAttribute('href')).toBe('/de/bewertungskarten');
    });

    it('verrät keine Übersetzungsschlüssel', () => {
      expect(html()).not.toContain('rv.');
    });
  });

  describe('Google bleibt draußen', () => {
    beforeEach(() => mount(data({ items: [review(), review({ author: 'Mehmet Kaya' })] })));

    it('lädt kein einziges Bild — auch kein Profilbild von Google', () => {
      expect(all('img').length).toBe(0);
      expect(html()).not.toContain('googleusercontent');
      expect(html()).not.toContain('gstatic');
    });

    it('bindet nichts ein und lädt nichts nach', () => {
      expect(all('script').length).toBe(0);
      expect(all('iframe').length).toBe(0);
      expect(all('link').length).toBe(0);
    });

    it('zeigt Anfangsbuchstaben an der Stelle des Profilbildes', () => {
      const initials = all('.rv-initials').map((e) => e.textContent?.trim());
      expect(initials).toEqual(['SW', 'MK']);
    });
  });

  describe('Blättern', () => {
    const three = () => data({ items: [review(), review({ author: 'Mehmet Kaya' }), review({ author: 'Léa Blanc' })] });

    it('zeigt keine Knöpfe, wenn es nur eine Bewertung gibt', () => {
      mount(data());
      expect(all('.rv-arrow').length).toBe(0);
    });

    it('zeigt zwei Knöpfe, sobald es mehr sind', () => {
      mount(three());
      expect(all('.rv-arrow').length).toBe(2);
    });

    it('beschriftet sie für Vorleseprogramme', () => {
      mount(three());
      const labels = all('.rv-arrow').map((b) => b.getAttribute('aria-label'));
      expect(labels).toEqual(['Vorige Bewertungen', 'Weitere Bewertungen']);
    });

    it('scrollt die Liste, statt sie umzubauen', () => {
      mount(three());
      const track = el<HTMLElement>('.rv-track')!;
      const calls: { left: number; behavior?: string }[] = [];
      track.scrollBy = ((o: ScrollToOptions) => calls.push({ left: o.left ?? 0, behavior: o.behavior })) as never;

      (all('.rv-arrow')[1] as HTMLButtonElement).click();
      (all('.rv-arrow')[0] as HTMLButtonElement).click();

      expect(calls.length).toBe(2);
      // Eine Karte vorwärts, dieselbe Strecke zurück.
      expect(calls[0]!.left).toBeGreaterThan(0);
      expect(calls[1]!.left).toBe(-calls[0]!.left);
      expect(calls[0]!.behavior).toBe('smooth');
      // Die Bewertungen bleiben alle da — es wird nichts ausgetauscht.
      expect(all('.rv-card').length).toBe(3);
    });

    it('bewegt sich nicht von selbst', (done) => {
      mount(three());
      const track = el<HTMLElement>('.rv-track')!;
      let moved = 0;
      track.scrollBy = (() => moved++) as never;
      // Ein Karussell mit Zeitgeber hätte hier längst gescrollt.
      setTimeout(() => {
        expect(moved).toBe(0);
        done();
      }, 250);
    });

    it('bleibt mit den Pfeiltasten erreichbar, auch ohne die Knöpfe', () => {
      mount(three());
      expect(el('.rv-track')?.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('kein Review-Schema', () => {
    beforeEach(() => mount(data()));

    /**
     * Google ahndet es, wenn man fremde Bewertungen als eigenes
     * AggregateRating auszeichnet. Der Abschnitt darf deshalb kein JSON-LD
     * mitbringen — und soll es auch nicht versehentlich zurückbekommen.
     */
    it('zeichnet die fremden Bewertungen nicht als eigene Daten aus', () => {
      expect(html().toLowerCase()).not.toContain('aggregaterating');
      expect(html().toLowerCase()).not.toContain('itemprop');
      expect(html()).not.toContain('schema.org');
      // Die Seiten mit Product-Schema sind die eigentliche Versuchung; dort
      // prüft expectNoBorrowedRatings in ihren eigenen Tests mit.
      expectNoBorrowedRatings();
    });
  });

  describe('Wortlaut und Sterne', () => {
    it('gibt den Wortlaut unverändert weiter — auch mit Absätzen', () => {
      const original = 'Erst skeptisch.\n\nDann begeistert: „so muss das sein".';
      mount(data({ items: [review({ text: original })] }));
      expect(el('.rv-text')?.textContent).toBe(original);
    });

    it('macht aus fremdem Text kein Markup', () => {
      mount(data({ items: [review({ author: '<b>Chef</b> & Co', text: '<b>fett</b> & <i>schräg</i>' })] }));
      // Nicht „kein <script>" — auch ein harmloses <b> darf kein Element werden.
      // Der Name kommt von Google; er ist Text, nichts anderes.
      expect(all('b').length).toBe(0);
      expect(all('i').length).toBe(0);
      expect(el('.rv-who strong')?.textContent).toBe('<b>Chef</b> & Co');
      expect(el('.rv-text')?.textContent).toBe('<b>fett</b> & <i>schräg</i>');
    });

    it('zeigt so viele gefüllte Sterne, wie die Bewertung hat', () => {
      mount(data({ items: [review({ rating: 3 })] }));
      expect(el('.rv-rating')?.textContent).toContain('★★★☆☆');
    });

    it('sagt Vorleseprogrammen die Note in Worten', () => {
      mount(data({ items: [review({ rating: 4 })] }));
      expect(el('.rv-rating .visually-hidden')?.textContent?.trim()).toBe('4 von 5 Sternen');
    });

    it('nimmt die Zeitangabe von Google, sonst das Datum', () => {
      mount(data({ items: [review({ label: null })] }));
      expect(text()).toContain('2026-08-01');
    });
  });

  describe('unvollständige Angaben', () => {
    it('lässt die Note weg, wenn Google keine nennt', () => {
      mount(data({ rating: null }));
      expect(el('.rv-score')).toBeNull();
      // Die Bewertungen selbst bleiben.
      expect(all('.rv-card').length).toBe(1);
    });

    it('lässt die Anzahl weg, wenn nur die Note bekannt ist', () => {
      mount(data({ total: null }));
      expect(el('.rv-score')).not.toBeNull();
      expect(el('.rv-count')).toBeNull();
    });

    it('verlinkt nichts, wenn die Place ID fehlt', () => {
      mount(data({ placeId: '' }));
      expect(el('.rv-source a')).toBeNull();
      // Der Hinweis auf die Quelle bleibt trotzdem stehen.
      expect(text()).toContain('Google');
    });

    it('übergeht eine Place ID aus Leerzeichen', () => {
      mount(data({ placeId: '   ' }));
      expect(el('.rv-source a')).toBeNull();
    });
  });

  describe('initials', () => {
    let comp: ReviewsComponent;
    beforeEach(() => {
      mount(data());
      comp = fixture.componentInstance;
    });

    it('nimmt die ersten zwei Wörter', () => {
      expect(comp.initials('Sabine Wagner')).toBe('SW');
      expect(comp.initials('Anna Maria Schmidt')).toBe('AM');
    });

    it('schreibt sie groß, wie der Name auch kommt', () => {
      expect(comp.initials('sabine wagner')).toBe('SW');
      expect(comp.initials('şükran öztürk')).toBe('ŞÖ');
    });

    it('kommt mit einem Wort aus', () => {
      expect(comp.initials('Sabine')).toBe('S');
    });

    it('verkraftet zusätzliche Leerzeichen', () => {
      expect(comp.initials('  Sabine   Wagner  ')).toBe('SW');
    });

    it('bricht kein Zeichen entzwei', () => {
      // Ein Emoji im Namen ist zwei UTF-16-Einheiten; [0] allein gäbe Bruch.
      expect(comp.initials('🙂 Wagner')).toBe('🙂W');
      expect(comp.initials('Şükran Öztürk')).toBe('ŞÖ');
    });

    it('lässt keinen leeren Kreis stehen', () => {
      expect(comp.initials('')).toBe('·');
      expect(comp.initials('   ')).toBe('·');
    });
  });

  describe('stars', () => {
    let comp: ReviewsComponent;
    beforeEach(() => {
      mount(data());
      comp = fixture.componentInstance;
    });

    it('zählt gefüllte und leere Sterne auf fünf', () => {
      for (let n = 0; n <= 5; n++) {
        const s = comp.stars(n);
        expect([...s].length).toBe(5);
        expect([...s].filter((c) => c === '★').length).toBe(n);
      }
    });

    it('bleibt bei Unsinn innerhalb von fünf', () => {
      expect(comp.stars(9)).toBe('★★★★★');
      expect(comp.stars(-2)).toBe('☆☆☆☆☆');
    });
  });

  describe('Sprachen', () => {
    const LANGS: Lang[] = ['de', 'fr', 'en', 'tr', 'ku'];

    it('hat jeden Text in allen fünf Sprachen', () => {
      // Der Typ Entry verlangt alle Sprachen — hier zählt, dass keine leer ist.
      for (const [key, entry] of Object.entries(REVIEWS_CONTENT))
        for (const lang of LANGS) expect(entry[lang]?.trim().length).toBeGreaterThan(0, `${key}/${lang}`);
    });

    it('zeigt den Abschnitt in der Sprache der Seite', () => {
      mount(data());
      const i18n = TestBed.inject(I18nService);
      i18n.lang.set('tr');
      fixture.detectChanges();
      expect(text()).toContain('değerlendirme');
      // Der Wortlaut des Gastes wird nicht übersetzt.
      expect(text()).toContain('Sehr freundlich und schnell');
    });
  });
});
