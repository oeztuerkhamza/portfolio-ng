/**
 * Holt vor dem Build die Bewertungen aus der eigenen Datenbank (Tabelle
 * `reviews`, gefüllt vom Tageslauf oder im Portal) und schreibt sie nach
 * src/app/core/data/reviews.json.
 *
 * Warum zur Bauzeit und nicht im Browser:
 *
 *   * Die Bewertungstexte stehen damit im ausgelieferten HTML — gut für
 *     Suchmaschinen und ohne Nachladen sichtbar.
 *   * Der Besucher stellt keine einzige zusätzliche Anfrage, schon gar nicht
 *     an Google. Deshalb braucht die Seite dafür keinen Einwilligungsbanner.
 *
 * Ohne DATABASE_URL oder bei einem Fehler bleibt die eingecheckte Datei
 * unverändert — der Build läuft immer durch. Genau wie bei den Preisen.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import postgres from 'postgres';

const FILE = new URL('../src/app/core/data/reviews.json', import.meta.url);
const url = (process.env.DATABASE_URL ?? '').trim();

if (!url) {
  console.log('[reviews] DATABASE_URL nicht gesetzt — eingecheckte Bewertungen werden verwendet.');
  process.exit(0);
}

const current = JSON.parse(readFileSync(FILE, 'utf8'));
const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 10, ssl: local ? false : 'require' });

try {
  const rows = await sql`
    select author, rating, text, published_at, published_label, lang
    from reviews
    where not hidden
      and length(text) > 0
      -- Doppelter Boden zur täglichen Aufräumung: was zu lange liegt, darf
      -- nach den Google-Bedingungen nicht mehr gezeigt werden. Wenn der
      -- Tageslauf einmal ausfällt, backen wir es auch nicht in die Seite.
      -- Die Zahl gehört zu REVIEW_MAX_AGE_DAYS in src/server/reviews.ts.
      and fetched_at > now() - interval '30 days'
    order by published_at desc nulls last, rating desc
    limit 12`;
  const [summary] = await sql`select value from settings where key = 'google_reviews'`;
  const [place] = await sql`select value from settings where key = 'google_place_id'`;
  const s = summary?.value ?? {};

  const next = {
    rating: typeof s.rating === 'number' ? s.rating : null,
    total: typeof s.total === 'number' ? s.total : null,
    // Aus der Place ID baut die Seite den Verweis „bei Google ansehen" —
    // so braucht es keine zweite, von Hand gepflegte Adresse.
    placeId: String(place?.value ?? ''),
    items: rows.map((r) => ({
      author: String(r.author ?? ''),
      rating: Number(r.rating) || 0,
      text: String(r.text ?? ''),
      // Nur das Datum, nicht die Uhrzeit: genauer muss es nicht sein.
      date: r.published_at ? new Date(r.published_at).toISOString().slice(0, 10) : null,
      label: r.published_label ? String(r.published_label) : null,
      lang: r.lang ? String(r.lang) : null,
    })),
  };

  writeFileSync(FILE, JSON.stringify(next, null, 2) + '\n');
  console.log(`[reviews] ${next.items.length} Bewertungen übernommen${next.rating ? `, Note ${next.rating}` : ''}.`);
} catch (err) {
  console.warn('[reviews] konnten nicht geladen werden, eingecheckte bleiben:', err.message);
  // Die Datei bleibt, wie sie war — `current` nur gelesen, nie überschrieben.
  void current;
} finally {
  await sql.end({ timeout: 2 });
}
