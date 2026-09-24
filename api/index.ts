import express from 'express';
import { api, nfcRedirect } from '../src/server/api';

/**
 * Vercel-Funktion für alles Dynamische: /api/* (Kontaktformular, Shop,
 * Admin-Portal) und die NFC-Kurzlinks /r/<name>. vercel.json leitet diese
 * Pfade hierher um; die Seiten selbst kommen vorgerendert aus dem Build.
 * Lokal hängt dieselbe Logik in src/server.ts.
 */
const app = express();
app.set('trust proxy', true);
app.disable('x-powered-by');
app.use('/api', api);
app.get('/r/:slug', nfcRedirect);

export default app;
