import express from 'express';
import { api, cardLead, cardPage, cardVcard, leadBody, nfcRedirect } from './api';

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
app.get('/k/:slug', cardPage);
app.get('/k/:slug/kontakt.vcf', cardVcard);
app.post('/k/:slug/kontakt', leadBody, cardLead);

export default app;
