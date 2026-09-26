import { randomUUID } from 'node:crypto';
import { config } from './config';

/**
 * Bilder für die NFC-Karten im Supabase-Speicher ablegen.
 *
 * Damit liegen Logos und Fotos auf der eigenen Infrastruktur und nicht bei
 * einem fremden Bilderdienst. Hochgeladen wird ausschließlich hier im
 * Server, mit dem Dienstschlüssel; der Browser bekommt nur die fertige
 * öffentliche Adresse zurück.
 */

/** Erlaubte Bildarten und ihre Dateiendung. */
const TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

/**
 * SVG fehlt bewusst: eine SVG-Datei darf Skript enthalten, und wer die
 * Bildadresse direkt öffnet, führt es im Supabase-Ursprung aus.
 */
export const ALLOWED_TYPES = Object.keys(TYPES);

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Dateiendung zur Bildart, oder null wenn die Art nicht erlaubt ist. */
export function extFor(contentType: unknown): string | null {
  const type = String(contentType ?? '').split(';')[0].trim().toLowerCase();
  return TYPES[type] ?? null;
}

export type UploadError =
  | 'storage_not_configured'
  | 'unsupported_type'
  | 'too_large'
  | 'empty'
  | 'upload_failed';

export interface UploadOk {
  ok: true;
  /** Öffentliche Adresse — genau das, was in die Karte kommt. */
  url: string;
  path: string;
}
export interface UploadFail {
  ok: false;
  error: UploadError;
  /** Kurzer Grund fürs Protokoll, nie der Schlüssel. */
  detail?: string;
}

const base = () => config.supabaseUrl.replace(/\/+$/, '');

/**
 * Prüft Art und Größe, vergibt selbst einen Namen und legt die Datei ab.
 *
 * Der Name kommt nie vom Browser: ein eigener Zufallsname schließt
 * Verzeichniswechsel („../") und das Überschreiben fremder Dateien aus.
 */
export async function uploadImage(bytes: Buffer, contentType: unknown): Promise<UploadOk | UploadFail> {
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    return { ok: false, error: 'storage_not_configured' };
  }
  const ext = extFor(contentType);
  if (!ext) return { ok: false, error: 'unsupported_type' };
  if (!bytes?.length) return { ok: false, error: 'empty' };
  if (bytes.length > MAX_UPLOAD_BYTES) return { ok: false, error: 'too_large' };

  const bucket = config.storageBucket;
  const path = `${new Date().getFullYear()}/${randomUUID()}.${ext}`;

  let res = await put(bucket, path, bytes, String(contentType).split(';')[0].trim());
  // Beim ersten Mal gibt es den Eimer noch nicht — dann anlegen und erneut.
  if (res.status === 400 || res.status === 404) {
    if (await createBucket(bucket)) res = await put(bucket, path, bytes, String(contentType).split(';')[0].trim());
  }
  if (!res.ok) return { ok: false, error: 'upload_failed', detail: `HTTP ${res.status}` };

  return { ok: true, path, url: publicUrl(bucket, path) };
}

/** Adresse, unter der die Datei öffentlich liegt. */
export function publicUrl(bucket: string, path: string): string {
  return `${base()}/storage/v1/object/public/${bucket}/${path}`;
}

async function put(bucket: string, path: string, bytes: Buffer, type: string) {
  try {
    return await fetch(`${base()}/storage/v1/object/${bucket}/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.supabaseServiceKey}`,
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'x-upsert': 'false',
      },
      body: new Uint8Array(bytes),
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    return new Response(null, { status: 599 });
  }
}

/** Öffentlichen Eimer anlegen; true, wenn er danach benutzbar ist. */
async function createBucket(bucket: string): Promise<boolean> {
  try {
    const res = await fetch(`${base()}/storage/v1/bucket`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.supabaseServiceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: bucket, id: bucket, public: true, file_size_limit: MAX_UPLOAD_BYTES, allowed_mime_types: ALLOWED_TYPES }),
      signal: AbortSignal.timeout(15_000),
    });
    // 409 = war schon da; das ist für uns ebenfalls in Ordnung.
    return res.ok || res.status === 409;
  } catch {
    return false;
  }
}
