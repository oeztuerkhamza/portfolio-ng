/**
 * Bündelt die Server-API (src/server/vercel.ts) in eine einzelne Datei
 * api/index.js für die Vercel-Funktion. Läuft am Ende von `npm run build`;
 * die Datei ist eingecheckt, damit Vercel die Funktion schon vor dem Build
 * erkennt.
 */
import { build } from 'esbuild';

await build({
  entryPoints: ['src/server/vercel.ts'],
  outfile: 'api/index.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  legalComments: 'none',
  minify: true,
  banner: { js: '// Automatisch erzeugt aus src/server/vercel.ts — nicht von Hand bearbeiten (npm run build:api).' },
  footer: { js: 'module.exports = module.exports.default;' },
  logLevel: 'warning',
});
console.log('[api] api/index.js gebündelt.');
