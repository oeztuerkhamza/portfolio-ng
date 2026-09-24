import type { NextFunction, Request, Response } from 'express';
import { config } from './config';

/**
 * Prüft das Supabase-Zugriffstoken aus dem Admin-Portal bei Supabase Auth
 * und lässt nur Adressen aus ADMIN_EMAILS durch. Ergebnisse werden kurz
 * zwischengespeichert, damit nicht jede Tabellenabfrage Supabase fragt.
 */
const cache = new Map<string, { email: string; until: number }>();

/** E-Mail zum Token oder der Grund, warum Supabase es abgelehnt hat. */
async function emailForToken(token: string): Promise<{ email: string } | { reason: string }> {
  const hit = cache.get(token);
  if (hit && hit.until > Date.now()) return { email: hit.email };
  if (!config.supabaseUrl || !config.supabaseAnonKey) return { reason: 'supabase_not_configured' };

  const res = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
    headers: { apikey: config.supabaseAnonKey, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = (await res.text()).slice(0, 160);
    console.warn('[auth] Supabase lehnt das Token ab:', res.status, body);
    return { reason: `token_rejected_${res.status}` };
  }
  const user = (await res.json()) as { email?: string };
  const email = (user.email ?? '').toLowerCase();
  if (!email) return { reason: 'no_email' };

  if (cache.size > 200) cache.clear();
  cache.set(token, { email, until: Date.now() + 60_000 });
  return { email };
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) {
      res.status(401).json({ error: 'unauthorized', reason: 'no_token' });
      return;
    }
    const who = await emailForToken(token);
    if ('reason' in who) {
      res.status(401).json({ error: 'unauthorized', reason: who.reason });
      return;
    }
    if (!config.adminEmails.includes(who.email)) {
      // Die angemeldete Adresse zurückgeben, damit man den Tippfehler findet.
      console.warn('[auth] nicht in ADMIN_EMAILS:', who.email, '— Liste hat', config.adminEmails.length, 'Einträge');
      res.status(401).json({ error: 'unauthorized', reason: 'not_admin', email: who.email, listed: config.adminEmails.length });
      return;
    }
    res.locals['adminEmail'] = who.email;
    next();
  } catch (err) {
    next(err);
  }
}
