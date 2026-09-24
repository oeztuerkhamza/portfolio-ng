import postgres from 'postgres';
import { config } from './config';

let client: postgres.Sql | null = null;

/**
 * Gemeinsame Verbindung für alle Anfragen einer Server-Instanz.
 * `prepare: false`, weil der Supabase-Transaction-Pooler keine
 * Prepared Statements über Verbindungen hinweg kennt.
 */
export function db(): postgres.Sql | null {
  const url = config.databaseUrl;
  if (!url) return null;
  if (!client) {
    const local = /@(localhost|127\.0\.0\.1)[:/]|host=\/tmp/.test(url);
    client = postgres(url, {
      prepare: false,
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: local ? false : 'require',
      transform: { undefined: null },
    });
  }
  return client;
}
