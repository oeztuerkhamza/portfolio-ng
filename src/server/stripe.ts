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
