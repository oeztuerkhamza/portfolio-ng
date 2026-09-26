import { next } from '@vercel/functions';
import { alwaysOpen, maintenanceHtml, sameHash, sha256Hex } from './src/server/maintenance';

/**
 * Wartungsmodus — läuft bei Vercel vor dem Routing, also vor jeder Seite.
 *
 * Warum hier und nicht im Express-Server: die Seiten der Website sind
 * vorgerendert und werden von Vercels Netz ausgeliefert, ohne unseren Server
 * zu berühren. Ein Schalter in der Datenbank erreicht sie nur an dieser
 * Stelle.
 *
 * Zwei Regeln, die alles andere überstimmen:
 *
 *   1. **Im Zweifel offen.** Jeder Fehler — Zeitüberschreitung, kaputte
 *      Antwort, kein Netz — lässt die Anfrage durch. Eine Website, die wegen
 *      einer langsamen Abfrage in die Wartung fällt, wäre schlimmer als der
 *      Fehler, den sie verbergen soll.
 *   2. **Erst die Freiliste, dann die Abfrage.** Wer ohnehin durchgelassen
 *      wird, kostet keine Abfrage — und der Stripe-Webhook wartet nicht auf
 *      unsere eigene API.
 */

const COOKIE = 'bd-wartung';

/** Kurz halten: keine Seite soll auf diese Abfrage warten müssen. */
const TIMEOUT_MS = 800;

/**
 * Die Auskunft wird am Rand zwischengespeichert (die API setzt s-maxage).
 * Ein Zeitfenster in der Adresse erzwingt trotzdem regelmäßig eine frische
 * Antwort — sonst könnte der Schalter minutenlang wirkungslos bleiben.
 */
function flagUrl(origin: string): string {
  return `${origin}/api/maintenance?t=${Math.floor(Date.now() / 20_000)}`;
}

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (alwaysOpen(url.pathname)) return next();

  let state: { on?: boolean; message?: string | null; bypass?: string | null };
  try {
    const res = await fetch(flagUrl(url.origin), {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return next();
    state = (await res.json()) as typeof state;
  } catch {
    // Regel 1: im Zweifel offen.
    return next();
  }

  if (state?.on !== true) return next();

  // ── Der Inhaber darf seine eigene Seite trotzdem ansehen ──
  const hash = typeof state.bypass === 'string' ? state.bypass : '';
  if (hash) {
    const fromQuery = url.searchParams.get('wartung');
    if (fromQuery && sameHash(await sha256Hex(fromQuery), hash)) {
      /**
       * Das Kennwort wandert in ein Cookie und aus der Adresse heraus: sonst
       * müsste es an jedem Verweis wieder mitgeschleppt werden und stünde in
       * jeder Weiterleitung, die der Besucher teilt.
       */
      url.searchParams.delete('wartung');
      return new Response(null, {
        status: 302,
        headers: {
          location: url.pathname + (url.search || '') + url.hash,
          'set-cookie': `${COOKIE}=${encodeURIComponent(fromQuery)}; Path=/; Max-Age=43200; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }

    const raw = request.headers.get('cookie') ?? '';
    const match = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]*)`).exec(raw);
    const fromCookie = match ? decodeURIComponent(match[1]!) : '';
    if (fromCookie && sameHash(await sha256Hex(fromCookie), hash)) return next();
  }

  /**
   * 503 und nicht 200: eine Wartungsseite mit 200 lädt Google als echten
   * Inhalt ein und kann die Seite aus dem Index werfen. Mit 503 und
   * Retry-After kommt er später wieder — genau das ist gewollt.
   */
  return new Response(maintenanceHtml(url.pathname, state.message ?? null), {
    status: 503,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'retry-after': '3600',
      'cache-control': 'no-store',
    },
  });
}

/**
 * Ohne Matcher läuft die Middleware auf jeder Anfrage — auch auf jeder Datei.
 * `alwaysOpen` würde die zwar durchlassen, aber gar nicht erst aufgerufen zu
 * werden ist billiger.
 */
export const config = {
  matcher: ['/((?!api|assets|_vercel|\\.well-known).*)'],
};
