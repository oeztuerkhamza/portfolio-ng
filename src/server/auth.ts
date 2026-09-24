import type { NextFunction, Request, Response } from 'express';
import { config } from './config';

/**
 * Prüft das Supabase-Zugriffstoken aus dem Admin-Portal bei Supabase Auth
 * und lässt nur Adressen aus ADMIN_EMAILS durch. Ergebnisse werden kurz
 * zwischengespeichert, damit nicht jede Tabellenabfrage Supabase fragt.
 */
const cache = new Map<string, { email: string; until: number }>();

async function emailForToken(token: string): Promise<string | null> {
  const hit = cache.get(token);
  if (hit && hit.until > Date.now()) return hit.email;
  if (!config.supabaseUrl || !config.supabaseAnonKey) return null;

  const res = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
    headers: { apikey: config.supabaseAnonKey, Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const user = (await res.json()) as { email?: string };
  const email = (user.email ?? '').toLowerCase();
  if (!email) return null;

  if (cache.size > 200) cache.clear();
  cache.set(token, { email, until: Date.now() + 60_000 });
  return email;
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    const email = token ? await emailForToken(token) : null;
    if (!email || !config.adminEmails.includes(email)) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    res.locals['adminEmail'] = email;
    next();
  } catch (err) {
    next(err);
  }
}
