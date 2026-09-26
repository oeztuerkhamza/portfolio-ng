import { config } from './config';

/**
 * Google-Bewertungen für die Website.
 *
 * Geholt wird **auf dem Server**, nie aus dem Browser des Besuchers. Das hat
 * zwei Gründe, und beide sind wichtiger als die paar Zeilen, die es kostet:
 *
 *   * Der Schlüssel bleibt auf dem Server. Aus dem Browser wäre er für jeden
 *     lesbar, der die Seite öffnet.
 *   * Google erfährt nichts über den Besucher — keine IP-Adresse, kein
 *     Skript, kein Bild von googleusercontent.com. Darum braucht die Seite
 *     für die Bewertungen keinen Einwilligungsbanner, und darum zeigen wir
 *     die Profilbilder der Verfasser *nicht*, sondern die Anfangsbuchstaben.
 *
 * Die Antwort wird in zwei Schreibweisen gelesen: die der Places API (New)
 * und die der älteren Places API. Welche der Schlüssel des Kunden freigibt,
 * lässt sich von hier aus nicht wissen — darum werden beide Strecken
 * versucht und beide Formen verstanden.
 */

/** Wie lange eine geholte Bewertung liegen bleiben darf. */
export const REVIEW_MAX_AGE_DAYS = 30;

/** Mehr als so viele zeigt die Seite ohnehin nicht. */
export const REVIEW_LIMIT = 12;

export interface Review {
  externalId: string;
  author: string;
  rating: number;
  text: string;
  publishedAt: string | null;
  publishedLabel: string | null;
  lang: string | null;
}

export interface ReviewFetch {
  ok: boolean;
  reviews: Review[];
  /** Gesamtnote, wie Google sie nennt. */
  rating: number | null;
  /** Anzahl aller Bewertungen — meist mehr, als die API hergibt. */
  total: number | null;
  /** Welche Strecke geantwortet hat: zum Nachsehen im Portal. */
  via: 'places-new' | 'places-legacy' | null;
  /** Verständlicher Grund, ohne Schlüssel und ohne Googles Rohtext. */
  error?: string;
  /** Kurzer Auszug der Antwort für die Fehlersuche, ohne Schlüssel. */
  detail?: string;
}

const text = (value: unknown, max: number): string => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
};

/** Zeitstempel in etwas, das Postgres annimmt — oder null. */
const when = (value: unknown): string | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    // Die ältere API zählt Sekunden seit 1970.
    return new Date(value * 1000).toISOString();
  }
  if (typeof value === 'string' && value) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  return null;
};

const rating = (value: unknown): number | null => {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null;
};

/**
 * Eine einzelne Bewertung aus beiden Schreibweisen lesen.
 *
 * Neu:  { name, rating, text: { text, languageCode }, authorAttribution: { displayName },
 *         publishTime, relativePublishTimeDescription }
 * Alt:  { author_name, rating, text, time, relative_time_description, language }
 *
 * Der Text wird **nicht** gekürzt oder umgeschrieben: die Bedingungen von
 * Google verlangen, Bewertungen unverändert zu zeigen. Die 5000 Zeichen sind
 * nur die Grenze der Datenbankspalte.
 */
export function parseReview(input: unknown): Review | null {
  const r = (input ?? {}) as Record<string, unknown>;
  // Die Spanne 1–5 entscheidet `rating` — hier zählt nur, ob eine da war.
  const stars = rating(r['rating']);
  if (stars === null) return null;

  const attribution = (r['authorAttribution'] ?? {}) as Record<string, unknown>;
  const author = text(attribution['displayName'], 200) || text(r['author_name'], 200);
  if (!author) return null;

  const body = (r['text'] ?? {}) as Record<string, unknown>;
  const original = (r['originalText'] ?? {}) as Record<string, unknown>;
  const content =
    typeof r['text'] === 'string'
      ? text(r['text'], 5000)
      : text(body['text'], 5000) || text(original['text'], 5000);

  const lang = text(body['languageCode'], 10) || text(r['language'], 10) || null;
  const label = text(r['relativePublishTimeDescription'], 80) || text(r['relative_time_description'], 80) || null;
  const at = when(r['publishTime']) ?? when(r['time']);

  /**
   * Eine Kennung, damit dieselbe Bewertung nicht zweimal ankommt. Google gibt
   * bei der neuen API einen Namen mit; bei der alten nicht — dann wird aus
   * Verfasser und Zeitpunkt einer gebaut. Nicht schön, aber stabil, solange
   * niemand seine Bewertung in derselben Sekunde zweimal schreibt.
   */
  const externalId = text(r['name'], 300) || `${author}|${at ?? label ?? ''}`;

  return { externalId, author, rating: stars, text: content, publishedAt: at, publishedLabel: label, lang };
}

/** Liste aus beiden Schreibweisen holen; `result` ist die alte Hülle. */
function parseAll(payload: unknown): { reviews: Review[]; rating: number | null; total: number | null } {
  const root = (payload ?? {}) as Record<string, unknown>;
  const box = (root['result'] ?? root) as Record<string, unknown>;
  const list = Array.isArray(box['reviews']) ? box['reviews'] : [];

  const seen = new Set<string>();
  const reviews: Review[] = [];
  for (const entry of list) {
    const parsed = parseReview(entry);
    if (!parsed || seen.has(parsed.externalId)) continue;
    seen.add(parsed.externalId);
    reviews.push(parsed);
    if (reviews.length >= REVIEW_LIMIT) break;
  }

  const stars = Number(box['rating']);
  const count = Number(box['userRatingCount'] ?? box['user_ratings_total']);
  return {
    reviews,
    rating: Number.isFinite(stars) && stars > 0 ? Math.round(stars * 10) / 10 : null,
    total: Number.isFinite(count) && count > 0 ? Math.round(count) : null,
  };
}

/** Googles Fehlertext auf etwas eindampfen, das ohne Schlüssel auskommt. */
function shorten(body: string, key: string): string {
  const withoutKey = key ? body.split(key).join('[SCHLÜSSEL]') : body;
  return withoutKey.replace(/\s+/g, ' ').trim().slice(0, 300);
}

/** Antwort lesen, ohne zu werfen: ein Fehlschlag ist hier ein Ergebnis. */
function json(body: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(body) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

const PLACE_ID = /^[A-Za-z0-9_-]{6,200}$/;

/**
 * Bewertungen bei Google holen. Zwei Strecken, weil nicht von hier aus zu
 * wissen ist, welche API der Schlüssel des Kunden freigibt — die neue wird
 * zuerst versucht, die alte danach. Was schiefgeht, kommt als verständlicher
 * Grund zurück und nicht als Ausnahme: das Ergebnis landet im Portal.
 */
export async function fetchReviews(placeId: string, lang = 'de'): Promise<ReviewFetch> {
  const empty = (): Pick<ReviewFetch, 'reviews' | 'rating' | 'total' | 'via'> => ({ reviews: [], rating: null, total: null, via: null });
  const key = config.googleApiKey;
  if (!key) return { ok: false, ...empty(), error: 'GOOGLE_API_KEY fehlt' };
  if (!PLACE_ID.test(placeId)) return { ok: false, ...empty(), error: 'Place ID fehlt oder sieht nicht wie eine aus' };

  const tries: { via: 'places-new' | 'places-legacy'; url: string; headers: Record<string, string> }[] = [
    {
      via: 'places-new',
      url: `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${encodeURIComponent(lang)}`,
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'reviews,rating,userRatingCount' },
    },
    {
      via: 'places-legacy',
      url:
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}` +
        `&fields=reviews,rating,user_ratings_total&language=${encodeURIComponent(lang)}&key=${encodeURIComponent(key)}`,
      headers: {},
    },
  ];

  let last: ReviewFetch = { ok: false, ...empty(), error: 'Google nicht erreichbar' };

  for (const attempt of tries) {
    try {
      const res = await fetch(attempt.url, {
        headers: attempt.headers,
        signal: AbortSignal.timeout(10_000),
      });
      const body = await res.text();

      if (!res.ok) {
        last = {
          ok: false,
          ...empty(),
          error:
            res.status === 403
              ? 'Schlüssel darf diese API nicht benutzen (403) — in der Google Cloud Console freigeben'
              : res.status === 400
                ? 'Google hat die Anfrage abgelehnt (400) — Place ID prüfen'
                : `Google antwortet mit ${res.status}`,
          detail: shorten(body, key),
        };
        continue;
      }

      const payload = json(body);
      if (!payload) {
        // Kein Netzfehler: Google hat geantwortet, nur nicht mit JSON.
        last = { ok: false, ...empty(), error: 'Antwort von Google nicht lesbar', detail: shorten(body, key) };
        continue;
      }

      // Die ältere API meldet Fehler mit 200 und einem Status im Rumpf.
      const status = text(payload['status'], 40);
      if (status && status !== 'OK') {
        last = { ok: false, ...empty(), error: `Google meldet „${status}"`, detail: shorten(body, key) };
        continue;
      }

      const parsed = parseAll(payload);
      if (!parsed.reviews.length && parsed.rating === null) {
        last = { ok: false, ...empty(), error: 'Antwort ohne Bewertungen — Feldfreigabe prüfen', detail: shorten(body, key) };
        continue;
      }
      return { ok: true, ...parsed, via: attempt.via };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      last = { ok: false, ...empty(), error: 'Google nicht erreichbar', detail: shorten(message, key) };
    }
  }

  return last;
}

/** Eine Zeile, wie sie aus der Datenbank kommt und die Seite sie braucht. */
export interface StoredReview {
  author: string;
  rating: number;
  text: string;
  published_at: string | null;
  published_label: string | null;
  lang: string | null;
}

/** Gesamtnote und Anzahl, wie sie unter „google_reviews" in settings liegen. */
export interface ReviewSummary {
  rating: number | null;
  total: number | null;
  fetched_at: string | null;
  via: string | null;
  error: string | null;
}

/**
 * Was die Seite zeigt: die sichtbaren Bewertungen und die Gesamtnote.
 *
 * Absichtlich getrennt vom Holen: die Website liest nur aus der eigenen
 * Datenbank, nie bei Google. Auch wenn Google einmal nicht antwortet, steht
 * die Seite.
 */
export const REVIEWS_SETTING = 'google_reviews';
export const PLACE_ID_SETTING = 'google_place_id';
