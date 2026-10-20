import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import * as z from 'zod/v4';
import { config } from './config';
import { INVITE_LANGS, type InviteLang } from '../app/einladung/invite.model';

/**
 * Übersetzt die Texte einer Einladung in die übrigen Sprachen (Claude API).
 *
 * Der Gastgeber schreibt in einer Sprache und tippt „Speichern & übersetzen";
 * der Planer schickt die geänderten Texte hierher und trägt die Antwort in
 * die anderen Sprachen ein. Gespeichert wird danach auf dem normalen Weg —
 * diese Datei speichert nichts, sie übersetzt nur.
 *
 * Namen, Orte, Adressen, Uhrzeiten und Beträge bleiben unverändert; das sagt
 * die Anweisung an das Modell ausdrücklich.
 */

export const MAX_ITEMS = 80;
export const MAX_CHARS = 16_000;

const LANG_NAMES: Record<InviteLang, string> = {
  de: 'German',
  tr: 'Turkish',
  en: 'English',
  fr: 'French',
  ku: 'Kurdish (Kurmanji, Latin script)',
  ar: 'Arabic (Modern Standard Arabic)',
};

const SYSTEM = `You translate the texts of a personal invitation website (weddings, henna nights, engagements, birthdays, company events).

Rules:
- Translate each item from the source language into every requested target language.
- Write natural, warm, idiomatic text a native speaker would use on an invitation — not a word-for-word translation. Keep the register of the original (informal stays informal, formal stays formal).
- Keep personal names, venue names, street addresses, times, dates written as numbers, amounts, IBANs, phone numbers, URLs and emoji exactly as they are.
- Keep culture-specific terms that guests know by their own name (e.g. "Kına", "Nikah", "Zaffa", "Mehndi", "Halay") and add no explanations.
- Keep line breaks. Add nothing, leave nothing out.
- Return every item id with one translation per target language.`;

export interface TranslateItem {
  id: string;
  text: string;
}

export type Translations = Record<string, Partial<Record<InviteLang, string>>>;

export type TranslateError = 'translate_not_configured' | 'invalid' | 'too_long' | 'translate_failed';

export class TranslateFailure extends Error {
  constructor(readonly code: TranslateError) {
    super(code);
  }
}

/** Eingaben prüfen und auf die bekannte Form bringen. */
export function parseTranslateRequest(
  body: unknown,
  limits = { items: MAX_ITEMS, chars: MAX_CHARS },
): { source: InviteLang; targets: InviteLang[]; items: TranslateItem[] } {
  const b = (body ?? {}) as Record<string, unknown>;
  const source = b['source'] as InviteLang;
  if (!INVITE_LANGS.includes(source)) throw new TranslateFailure('invalid');
  const targets = [...new Set(Array.isArray(b['targets']) ? b['targets'] : [])].filter(
    (l): l is InviteLang => INVITE_LANGS.includes(l as InviteLang) && l !== source,
  );
  const items = (Array.isArray(b['items']) ? b['items'] : [])
    .map((it) => ({
      id: typeof it?.id === 'string' ? it.id.slice(0, 80) : '',
      text: typeof it?.text === 'string' ? it.text.trim() : '',
    }))
    .filter((it) => it.id && it.text);
  if (!targets.length || !items.length) throw new TranslateFailure('invalid');
  if (items.length > limits.items) throw new TranslateFailure('too_long');
  if (items.reduce((n, it) => n + it.text.length, 0) > limits.chars) throw new TranslateFailure('too_long');
  return { source, targets, items };
}

const resultSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      translations: z.array(z.object({ lang: z.enum(INVITE_LANGS as [InviteLang, ...InviteLang[]]), text: z.string() })),
    }),
  ),
});

let client: Anthropic | null = null;
function anthropic(): Anthropic | null {
  if (!config.anthropicApiKey) return null;
  client ??= new Anthropic({ apiKey: config.anthropicApiKey, timeout: 60_000, maxRetries: 2 });
  return client;
}

/** Für Tests: einen vorbereiteten Client einsetzen. */
export function setTranslateClient(c: Anthropic | null): void {
  client = c;
}

/**
 * Übersetzt alle Einträge in alle Zielsprachen. Liefert nur, was das Modell
 * für bekannte ids und angefragte Sprachen zurückgibt — nie etwas anderes.
 */
export async function translateTexts(source: InviteLang, targets: InviteLang[], items: TranslateItem[]): Promise<Translations> {
  const c = client ?? anthropic();
  if (!c) throw new TranslateFailure('translate_not_configured');

  const request = {
    source: LANG_NAMES[source],
    targets: targets.map((l) => ({ code: l, language: LANG_NAMES[l] })),
    items,
  };

  let parsed: z.infer<typeof resultSchema> | null = null;
  try {
    const response = await c.beta.messages.parse({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      // Bei einer Ablehnung durch die Sicherheitsfilter übernimmt automatisch ein anderes Modell.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: betaZodOutputFormat(resultSchema) },
      system: SYSTEM,
      messages: [{ role: 'user', content: JSON.stringify(request) }],
    });
    if (response.stop_reason === 'refusal' || response.stop_reason === 'max_tokens') {
      console.error('[translate] stop_reason', response.stop_reason);
      throw new TranslateFailure('translate_failed');
    }
    parsed = response.parsed_output;
  } catch (err) {
    if (err instanceof TranslateFailure) throw err;
    if (err instanceof Anthropic.APIError) console.error('[translate] API', err.status, err.message);
    else console.error('[translate]', err);
    throw new TranslateFailure('translate_failed');
  }
  if (!parsed) throw new TranslateFailure('translate_failed');

  const ids = new Set(items.map((i) => i.id));
  const out: Translations = {};
  for (const it of parsed.items) {
    if (!ids.has(it.id)) continue;
    for (const t of it.translations) {
      const text = t.text.trim();
      if (!targets.includes(t.lang) || !text) continue;
      (out[it.id] ??= {})[t.lang] = text.slice(0, 5000);
    }
  }
  return out;
}
