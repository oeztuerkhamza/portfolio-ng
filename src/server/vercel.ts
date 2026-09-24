import express from 'express';
import { api, nfcRedirect } from './api';

/**
 * Einstieg für die Vercel-Funktion (api/index.js). Vercel liefert die Seiten
 * vorgerendert aus; alles Dynamische — /api/* und die NFC-Kurzlinks
 * /r/<name> — leitet vercel.json hierher um.
 *
 * api/index.js wird mit `npm run build:api` aus dieser Datei gebündelt
 * (scripts/build-api.mjs), damit Vercel eine fertige, abhängigkeitsfreie
 * Datei ausführt.
 */
const app = express();
app.set('trust proxy', true);
app.disable('x-powered-by');
app.use('/api', api);
app.get('/r/:slug', nfcRedirect);

export default app;
