/**
 * Die Server-API für die lokale Entwicklung.
 *
 * `ng serve` rendert nur die Angular-Anwendung. Den Express-Teil — /api/*,
 * die Kartenseiten /k/<name> und die Kurzlinks /r/<name> — startet es nicht:
 * der lebt in src/server.ts und wird erst im Build eingehängt. Wer im
 * Browser etwas anfasst, das den Server braucht, bekam darum bisher Vites
 * index.html zurück, mit Status 200 — also keine Fehlermeldung, sondern
 * stillen Unsinn. Am sichtbarsten war das beim Kartengestalter: die Vorschau
 * fragt /api/card-preview und bekam eine HTML-Seite, in der kein `html`-Feld
 * steht. Ergebnis: „Die Vorschau ließ sich gerade nicht laden", lokal immer.
 *
 * Dieses Skript startet denselben Express-Baum, den auch Vercel ausführt
 * (src/server/vercel.ts), auf einem eigenen Port. proxy.conf.json schickt
 * /api, /k und /r von `ng serve` hierher. Zwei Fenster:
 *
 *     npm run dev:api     (hier)
 *     npm start           (Angular)
 *
 * Geändert man etwas unter src/server, baut esbuild neu und lädt den Baum
 * ohne Neustart nach.
 *
 * Ohne Zugangsdaten läuft es trotzdem: was eine Datenbank braucht, antwortet
 * dann mit 503, der Rest tut es. Die Kartenvorschau gehört zum Rest — sie
 * zeichnet nur und speichert nichts.
 */
import { context } from 'esbuild';
import express from 'express';
import { mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env['DEV_API_PORT'] ?? 4301);

// .env laden, falls vorhanden. Die Datei steht in .gitignore; dieses
// Repository ist öffentlich, und ein Schlüssel darin wäre ein Schlüssel für
// alle. Ohne Datei ist das kein Fehler — dann fehlen eben die Funktionen,
// die Zugangsdaten brauchen.
try {
  process.loadEnvFile(join(root, '.env'));
  console.log('[dev-api] .env geladen');
} catch {
  console.log('[dev-api] keine .env — Datenbank- und Speicherfunktionen bleiben aus');
}

// Der Bau landet unter node_modules/.cache: dort räumt niemand von Hand auf,
// und die Datei gehört nicht ins Repository.
const outdir = join(root, 'node_modules/.cache/dev-api');
mkdirSync(outdir, { recursive: true });
const outfile = join(outdir, 'server.mjs');

/** Der jeweils zuletzt gebaute Express-Baum. */
let handler = null;

const app = express();
app.use((req, res, next) => {
  if (handler) return handler(req, res, next);
  // Der erste Bau läuft noch. 503 statt 200: ein Fehler, den man sieht, ist
  // besser als eine Antwort, die nach Erfolg aussieht.
  res.status(503).json({ error: 'building' });
});

const ctx = await context({
  entryPoints: [join(root, 'src/server/vercel.ts')],
  outfile,
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  // Abhängigkeiten aus node_modules laden statt einbündeln: schneller und
  // näher am echten Lauf.
  packages: 'external',
  logLevel: 'silent',
  plugins: [
    {
      name: 'reload',
      setup(build) {
        build.onEnd(async (result) => {
          if (result.errors.length) {
            console.error(`[dev-api] Bau fehlgeschlagen (${result.errors.length}) — alter Stand bleibt`);
            for (const e of result.errors.slice(0, 3)) {
              console.error('  ' + (e.location ? `${e.location.file}:${e.location.line} ` : '') + e.text);
            }
            return;
          }
          try {
            // Anhängsel an die Adresse: ohne das gäbe der Zwischenspeicher
            // von Node denselben Baum zurück wie beim letzten Mal.
            const mod = await import(`${pathToFileURL(outfile).href}?v=${Date.now()}`);
            handler = mod.default;
            console.log('[dev-api] geladen');
          } catch (err) {
            console.error('[dev-api] Laden fehlgeschlagen — alter Stand bleibt:', err?.message ?? err);
          }
        });
      },
    },
  ],
});

await ctx.watch();

app.listen(PORT, () => {
  console.log(`[dev-api] http://localhost:${PORT} — /api, /k, /r`);
  console.log('[dev-api] „npm start" im zweiten Fenster; proxy.conf.json leitet dorthin.');
});
