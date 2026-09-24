/**
 * Holt vor dem Build die Preise aus der Datenbank (Tabelle `prices`, im
 * Admin-Portal unter „Fiyatlar" gepflegt) und schreibt sie nach
 * src/app/core/data/catalog.json.
 *
 * Ohne DATABASE_URL oder bei einem Fehler bleibt die eingecheckte Datei
 * unverändert — der Build läuft immer durch.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import postgres from 'postgres';

const FILE = new URL('../src/app/core/data/catalog.json', import.meta.url);
const url = (process.env.DATABASE_URL ?? '').trim();

if (!url) {
  console.log('[catalog] DATABASE_URL nicht gesetzt — eingecheckte Preise werden verwendet.');
  process.exit(0);
}

const current = JSON.parse(readFileSync(FILE, 'utf8'));
const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 10, ssl: local ? false : 'require' });

try {
  const rows = await sql`select key, value from prices`;
  const next = { ...current };
  for (const r of rows) next[r.key] = Number(r.value);
  // Nur bekannte Schlüssel übernehmen, damit die Website nie ohne Preis dasteht.
  const missing = Object.keys(current).filter((k) => !(k in next));
  if (missing.length) throw new Error('fehlende Preise: ' + missing.join(', '));
  writeFileSync(FILE, JSON.stringify(next, null, 2) + '\n');
  const changed = Object.keys(next).filter((k) => next[k] !== current[k]);
  console.log(`[catalog] ${rows.length} Preise geladen${changed.length ? ', geändert: ' + changed.join(', ') : ''}.`);
} catch (err) {
  console.warn('[catalog] Preise konnten nicht geladen werden, eingecheckte Werte bleiben:', err.message);
} finally {
  await sql.end({ timeout: 2 });
}
