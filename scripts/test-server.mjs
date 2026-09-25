/**
 * Führt die Tests der Server-API aus (src/server/*.node-spec.ts).
 *
 * Die Server-Module sind Node-Code (node:crypto, process.env, fetch) und
 * laufen nicht im Browser — `ng test` (Karma) deckt nur die Angular-Seite ab.
 * Node kann die Dateien nicht direkt laden, weil die Importe wie überall im
 * Projekt ohne Dateiendung geschrieben sind; darum bündelt esbuild jede
 * Testdatei zuerst, genau wie bei api/index.js.
 */
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const SRC = join('src', 'server');
const OUT = join('out-tsc', 'server-spec');

const specs = readdirSync(SRC).filter((f) => f.endsWith('.node-spec.ts'));
if (!specs.length) {
  console.error(`[test:server] keine *.node-spec.ts in ${SRC}.`);
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

await build({
  entryPoints: specs.map((f) => join(SRC, f)),
  outdir: OUT,
  outExtension: { '.js': '.mjs' },
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  // node:* und echte Abhängigkeiten bleiben außen; nur eigener Code wird gebündelt.
  packages: 'external',
  sourcemap: 'inline',
  logLevel: 'warning',
});

// Die gebauten Dateien einzeln übergeben: der Test-Runner sucht in einem
// Ordner nur nach seinen eigenen Namensmustern (*.test.mjs und ähnliche).
const built = specs.map((f) => join(OUT, f.replace(/\.ts$/, '.mjs')));
const { status } = spawnSync(process.execPath, ['--test', ...built], { stdio: 'inherit' });
process.exit(status ?? 1);
