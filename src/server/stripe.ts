import { createHmac, timingSafeEqual } from 'node:crypto';
import { config } from './config';

/**
 * Minimaler Stripe-Zugriff über die REST-API (kein SDK im Server-Bundle).
 * Checkout läuft komplett auf Stripe: Karten-, Adress- und Zahlungsdaten
 * sieht dieser Server nie.
 */

type Params = Record<string, string | number | boolean | undefined>;

function form(params: Params): string {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) body.append(key, String(value));
  }
  return body.toString();
}

/**
 * Die Ereignisse, die der Webhook auswertet — dieselbe Liste gehört im
 * Stripe-Dashboard an den Endpunkt (Admin-Portal zeigt sie an).
 * Klarna, PayPal und SEPA bestätigen erst später: darum die beiden
 * „async"-Ereignisse, sonst bliebe die Bestellung für immer „offen".
 */
export const PAID_EVENTS = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];
export const CANCELLED_EVENTS = ['checkout.session.expired', 'checkout.session.async_payment_failed'];
export const WEBHOOK_EVENTS = [...PAID_EVENTS, ...CANCELLED_EVENTS];

export interface CheckoutLine {
  name: string;
  unitAmountCents: number;
  quantity: number;
}

export async function createCheckoutSession(opts: {
  lines: CheckoutLine[];
  orderId: string;
  successUrl: string;
  cancelUrl: string;
  locale: string;
}): Promise<{ id: string; url: string }> {
  const params: Params = {
    mode: 'payment',
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    locale: opts.locale,
    client_reference_id: opts.orderId,
    'metadata[order_id]': opts.orderId,
    'payment_intent_data[metadata][order_id]': opts.orderId,
    'shipping_address_collection[allowed_countries][0]': 'DE',
    'phone_number_collection[enabled]': true,
    billing_address_collection: 'required',
  };
  opts.lines.forEach((line, i) => {
    params[`line_items[${i}][quantity]`] = line.quantity;
    params[`line_items[${i}][price_data][currency]`] = 'eur';
    params[`line_items[${i}][price_data][unit_amount]`] = line.unitAmountCents;
    params[`line_items[${i}][price_data][product_data][name]`] = line.name;
  });

  const res = await fetch(`${config.stripeApiBase}/v1/checkout/sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form(params),
  });
  const data = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!res.ok || !data.id || !data.url) {
    throw new Error(`Stripe: ${data.error?.message ?? res.status}`);
  }
  return { id: data.id, url: data.url };
}

/**
 * Prüft die Stripe-Signatur eines Webhooks (Header `Stripe-Signature`,
 * Schema v1 = HMAC-SHA256 über „<timestamp>.<rohdaten>").
 */
export function verifyWebhook(raw: Buffer, header: string, secret: string, toleranceSec = 300): boolean {
  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const i = p.indexOf('=');
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    }),
  ) as Record<string, string>;
  const timestamp = Number(parts['t']);
  const signatures = header
    .split(',')
    .filter((p) => p.trim().startsWith('v1='))
    .map((p) => p.trim().slice(3));
  if (!timestamp || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - timestamp) > toleranceSec) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${raw.toString('utf8')}`).digest('hex');
  const a = Buffer.from(expected, 'hex');
  return signatures.some((sig) => {
    const b = Buffer.from(sig, 'hex');
    return b.length === a.length && timingSafeEqual(a, b);
  });
}

export interface StripeStatus {
  /** Beide Werte gesetzt — erst dann lässt sich der Shop einschalten. */
  ready: boolean;
  keyPresent: boolean;
  webhookSecretPresent: boolean;
  /** Testmodus oder Echtbetrieb, erkannt am Präfix des Schlüssels. */
  mode: 'test' | 'live' | null;
  /** Nimmt das Stripe-Konto schon Zahlungen an (Onboarding abgeschlossen)? */
  chargesEnabled: boolean | null;
  /** Name des Kontos, damit man sieht, welches Konto hinterlegt ist. */
  account: string | null;
  /** Kurzer Grund, wenn der Schlüssel nicht funktioniert (null = alles gut). */
  error: string | null;
}

/** Test- und Echtschlüssel unterscheiden sich im Präfix: sk_test_… / sk_live_… */
function keyMode(key: string): 'test' | 'live' | null {
  if (key.includes('_test_')) return 'test';
  if (key.includes('_live_')) return 'live';
  return null;
}

/**
 * Selbstprüfung beim Einrichten: funktioniert der hinterlegte Schlüssel
 * überhaupt, und ist das Konto schon freigeschaltet? Gibt nie den Schlüssel
 * und nie den Wortlaut einer Stripe-Fehlermeldung weiter, nur einen kurzen
 * Grund.
 */
export async function checkStripe(): Promise<StripeStatus> {
  const key = config.stripeSecretKey;
  const status: StripeStatus = {
    ready: !!(key && config.stripeWebhookSecret),
    keyPresent: !!key,
    webhookSecretPresent: !!config.stripeWebhookSecret,
    mode: key ? keyMode(key) : null,
    chargesEnabled: null,
    account: null,
    error: key ? null : 'STRIPE_SECRET_KEY fehlt',
  };
  if (!key) return status;

  try {
    const res = await fetch(`${config.stripeApiBase}/v1/account`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 401) {
      status.error = 'STRIPE_SECRET_KEY ungültig';
      return status;
    }
    // Ein eingeschränkter Schlüssel (rk_…) darf das Konto oft nicht lesen.
    if (res.status === 403) {
      status.error = 'Schlüssel darf das Konto nicht lesen (403)';
      return status;
    }
    if (!res.ok) {
      status.error = `Stripe antwortet mit ${res.status}`;
      return status;
    }
    const data = (await res.json()) as {
      charges_enabled?: boolean;
      settings?: { dashboard?: { display_name?: string } };
      business_profile?: { name?: string };
    };
    status.chargesEnabled = data.charges_enabled === true;
    status.account = data.settings?.dashboard?.display_name || data.business_profile?.name || null;
  } catch {
    status.error = 'Stripe nicht erreichbar';
  }
  return status;
}

export interface WebhookStatus {
  /**
   * `ok` — im Modus des Schlüssels gibt es einen aktiven Endpunkt auf unsere
   * Adresse. `missing` — sicher keiner (Stripe hat geantwortet).
   * `unknown` — Stripe war nicht erreichbar oder der Schlüssel darf die
   * Endpunkte nicht lesen; daraus darf nichts geschlossen werden.
   */
  state: 'ok' | 'missing' | 'unknown';
  /** Ereignisse aus WEBHOOK_EVENTS, die dem gefundenen Endpunkt fehlen. */
  missingEvents: string[];
  /** Kurzer Grund bei `unknown`. */
  error: string | null;
}

/** Adressen vergleichbar machen: Groß/Kleinschreibung und Schlussstrich weg. */
const sameUrl = (a: string, b: string) => a.trim().replace(/\/+$/, '').toLowerCase() === b.trim().replace(/\/+$/, '').toLowerCase();

let cache: { key: string; until: number; value: WebhookStatus } | null = null;

/**
 * Prüft, ob im Modus des hinterlegten Schlüssels ein Webhook auf `url` zeigt.
 *
 * Der Sinn: ein Testmodus-Webhook und ein Echtbetrieb-Schlüssel sind eine
 * stille Geldfalle — der Kunde zahlt, Stripe schickt das Ereignis mit einem
 * anderen Geheimnis, die Signaturprüfung schlägt fehl und die Bestellung
 * bleibt für immer „offen". `GET /v1/webhook_endpoints` liefert immer nur die
 * Endpunkte des Modus, zu dem der Schlüssel gehört — genau die Auskunft, die
 * wir brauchen.
 *
 * Bei `unknown` wird nichts blockiert: ein Aussetzer bei Stripe darf den Shop
 * nicht schließen. Blockiert wird nur bei einem klaren `missing`.
 */
export async function webhookStatus(url: string, ttlMs = 10 * 60_000): Promise<WebhookStatus> {
  const key = config.stripeSecretKey;
  if (!key) return { state: 'unknown', missingEvents: [], error: 'STRIPE_SECRET_KEY fehlt' };

  const cacheKey = `${keyMode(key) ?? '?'}|${url}`;
  if (cache && cache.key === cacheKey && cache.until > Date.now()) return cache.value;

  const value = await lookup(key, url);
  // Ein `missing` nur kurz behalten, damit eine Korrektur schnell greift;
  // `unknown` gar nicht, damit der nächste Aufruf es erneut versucht.
  const keep = value.state === 'ok' ? ttlMs : value.state === 'missing' ? 60_000 : 0;
  cache = keep ? { key: cacheKey, until: Date.now() + keep, value } : null;
  return value;
}

async function lookup(key: string, url: string): Promise<WebhookStatus> {
  try {
    const res = await fetch(`${config.stripeApiBase}/v1/webhook_endpoints?limit=100`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return { state: 'unknown', missingEvents: [], error: res.status === 403 ? 'Schlüssel darf die Webhooks nicht lesen (403)' : `Stripe antwortet mit ${res.status}` };
    }
    const data = (await res.json()) as { data?: { url?: string; status?: string; enabled_events?: string[] }[] };
    const hits = (data.data ?? []).filter((e) => e.status !== 'disabled' && sameUrl(String(e.url ?? ''), url));
    if (!hits.length) return { state: 'missing', missingEvents: [...WEBHOOK_EVENTS], error: null };

    // Mehrere Endpunkte auf dieselbe Adresse: die Ereignisse zusammenzählen.
    const covered = new Set(hits.flatMap((e) => e.enabled_events ?? []));
    const missingEvents = covered.has('*') ? [] : WEBHOOK_EVENTS.filter((e) => !covered.has(e));
    return { state: 'ok', missingEvents, error: null };
  } catch {
    return { state: 'unknown', missingEvents: [], error: 'Stripe nicht erreichbar' };
  }
}

/** Ohne dieses Ereignis wird eine bezahlte Bestellung nie als bezahlt gebucht. */
export const CRITICAL_EVENT = 'checkout.session.completed';

/**
 * Darf der Shop Geld annehmen? Nur ein klares „kein passender Webhook" oder
 * ein Endpunkt ohne das entscheidende Ereignis hält die Bestellung auf.
 */
export function blocksCheckout(status: WebhookStatus): boolean {
  if (status.state === 'missing') return true;
  return status.state === 'ok' && status.missingEvents.includes(CRITICAL_EVENT);
}
