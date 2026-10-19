import { randomBytes } from 'node:crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import { db } from './db';
import { h, sqlOr503, str } from './http';
import { sameHash, sha256Hex } from './maintenance';
import { ALLOWED_TYPES, deleteImage, uploadImage } from './storage';
import { demoEvent } from '../app/einladung/invite-demo';
import { THEME_IDS } from '../app/einladung/invite-themes';
import {
  EVENT_KINDS,
  INVITE_LANGS,
  MENU_CHOICES,
  MUSIC_IDS,
  emptyPlan,
  type EventKind,
  type InviteEvent,
  type InviteGuest,
  type InviteLang,
  type InvitePhoto,
  type InvitePlan,
  type LocalText,
  type MenuChoice,
  type RsvpStatus,
  type ThemeId,
} from '../app/einladung/invite.model';

/**
 * API der digitalen Einladungen.
 *
 *   GET    /api/invites/:slug             Einladung + sichtbare Fotos (+ Gast zu ?g=)
 *   POST   /api/invites/:slug/rsvp        Zu- oder Absage eines Gastes
 *   POST   /api/invites/:slug/photos      Foto eines Gastes (Bild als Rohdaten)
 *   …/owner                               Planer des Gastgebers, Kopfzeile X-Invite-Key
 *
 * Angelegt werden Einladungen von uns im Admin-Portal (siehe `adminInvites`).
 *
 * Alles, was hereinkommt, wird hier auf die bekannte Form zurückgeschnitten:
 * Die Einladung ist JSON, das der Gastgeber frei bearbeitet und das jeder Gast
 * wieder ausgeliefert bekommt — unbekannte Felder, überlange Texte und andere
 * Adressen als https:// kommen nicht in die Datenbank.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type Sql = NonNullable<ReturnType<typeof db>>;

export const SLUG = /^[a-z0-9][a-z0-9-]{2,59}$/;
export const MAX_GUESTS = 1500;
export const MAX_PHOTOS = 2000;

export function validSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && SLUG.test(slug) && !slug.startsWith('demo-') && slug !== 'live';
}

/** Zufälliger Schlüssel für den Planer: 24 Zeichen, URL-tauglich. */
export function newOwnerKey(): string {
  return randomBytes(18).toString('base64url');
}

export function guestCode(): string {
  return randomBytes(6).toString('base64url').replace(/[-_]/g, 'x').slice(0, 8).toLowerCase();
}

// ── Zurückschneiden ─────────────────────────────────────

const text = (v: unknown, max: number): string | undefined => {
  if (typeof v !== 'string') return undefined;
  const s = v.trim();
  return s ? s.slice(0, max) : undefined;
};

/** Nur https-Adressen, nichts anderes landet in src/href. */
export function safeUrl(v: unknown): string | undefined {
  const s = text(v, 1000);
  if (!s) return undefined;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function localTextOf(v: unknown, max: number): LocalText | undefined {
  if (typeof v === 'string') return text(v, max);
  if (!v || typeof v !== 'object') return undefined;
  const out: Partial<Record<InviteLang, string>> = {};
  for (const l of INVITE_LANGS) {
    const t = text((v as any)[l], max);
    if (t) out[l] = t;
  }
  return Object.keys(out).length ? out : undefined;
}

const num = (v: unknown, min: number, max: number, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
};

const list = (v: unknown, max: number): any[] => (Array.isArray(v) ? v.slice(0, max) : []);
const oneOf = <T extends string>(v: unknown, options: readonly T[], fallback: T): T =>
  options.includes(v as T) ? (v as T) : fallback;

const ICONS = ['ring', 'glass', 'dinner', 'music', 'camera', 'heart', 'cake', 'mic', 'henna', 'coffee'] as const;

/** Die Einladung, wie sie gespeichert und ausgeliefert wird. `slug` kommt vom Server, nie vom Browser. */
export function sanitizeEvent(input: any, slug: string): InviteEvent {
  const e = input && typeof input === 'object' ? input : {};
  const langs = list(e.langs, 6).filter((l: unknown) => INVITE_LANGS.includes(l as InviteLang)) as InviteLang[];
  const date = new Date(String(e.date ?? ''));
  const s = e.sections ?? {};
  const g = e.gifts && typeof e.gifts === 'object' ? e.gifts : null;
  const locations = list(e.locations, 6).map((l: any) => ({
    id: text(l?.id, 40)?.replace(/[^a-z0-9-]/gi, '') || randomBytes(4).toString('hex'),
    label: localTextOf(l?.label, 80) ?? '',
    name: text(l?.name, 120) ?? '',
    address: text(l?.address, 240) ?? '',
    lat: typeof l?.lat === 'number' && Math.abs(l.lat) <= 90 ? l.lat : undefined,
    lng: typeof l?.lng === 'number' && Math.abs(l.lng) <= 180 ? l.lng : undefined,
  }));
  const rsvpUntil = text(e.rsvpUntil, 10);
  return {
    slug,
    kind: oneOf<EventKind>(e.kind, EVENT_KINDS, 'wedding'),
    theme: oneOf<ThemeId>(e.theme, THEME_IDS, 'klassik'),
    music: oneOf(e.music, MUSIC_IDS, 'none'),
    musicUrl: safeUrl(e.musicUrl),
    langs: langs.length ? [...new Set(langs)] : ['de'],
    title: text(e.title, 120) ?? 'Einladung',
    eyebrow: localTextOf(e.eyebrow, 80),
    hosts: localTextOf(e.hosts, 200),
    date: isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
    rsvpUntil: rsvpUntil && /^\d{4}-\d{2}-\d{2}$/.test(rsvpUntil) ? rsvpUntil : undefined,
    welcome: localTextOf(e.welcome, 1200),
    story: localTextOf(e.story, 4000),
    dressCode: localTextOf(e.dressCode, 300),
    schedule: list(e.schedule, 30).map((it: any) => ({
      time: /^\d{1,2}:\d{2}$/.test(String(it?.time ?? '')) ? String(it.time) : '',
      title: localTextOf(it?.title, 120) ?? '',
      text: localTextOf(it?.text, 400),
      location: text(it?.location, 40),
      icon: oneOf(it?.icon, ICONS, 'heart'),
    })),
    locations,
    contacts: list(e.contacts, 10).map((c: any) => ({
      role: localTextOf(c?.role, 80) ?? '',
      name: text(c?.name, 80) ?? '',
      phone: text(c?.phone, 40)?.replace(/[^\d+ ()/-]/g, ''),
    })),
    faq: list(e.faq, 30).map((f: any) => ({ q: localTextOf(f?.q, 200) ?? '', a: localTextOf(f?.a, 1500) ?? '' })),
    gifts: g
      ? {
          text: localTextOf(g.text, 800),
          accountHolder: text(g.accountHolder, 70),
          iban: text(g.iban, 42)?.replace(/\s+/g, '').toUpperCase(),
          bic: text(g.bic, 11)?.replace(/\s+/g, '').toUpperCase(),
          bank: text(g.bank, 80),
          paypal: text(g.paypal, 120),
          reference: text(g.reference, 140),
        }
      : undefined,
    heroImage: safeUrl(e.heroImage),
    gallery: list(e.gallery, 60).map(safeUrl).filter((u): u is string => !!u),
    sections: {
      countdown: s.countdown !== false,
      story: s.story !== false,
      schedule: s.schedule !== false,
      locations: s.locations !== false,
      rsvp: s.rsvp !== false,
      gifts: s.gifts !== false,
      photos: s.photos !== false,
      faq: s.faq !== false,
    },
    rsvp: {
      menu: e.rsvp?.menu !== false,
      maxPersons: num(e.rsvp?.maxPersons, 1, 20, 6),
      song: e.rsvp?.song !== false,
    },
    guestUploads: e.guestUploads !== false,
  };
}

export function sanitizePlan(input: any): InvitePlan {
  const p = input && typeof input === 'object' ? input : {};
  const day = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);
  const id = (v: unknown) => text(v, 40)?.replace(/[^a-z0-9-]/gi, '') || randomBytes(4).toString('hex');
  return {
    tasks: list(p.tasks, 300).map((t: any) => ({ id: id(t?.id), title: text(t?.title, 200) ?? '', due: day(t?.due), done: t?.done === true, category: text(t?.category, 40) })),
    budget: list(p.budget, 200).map((b: any) => ({ id: id(b?.id), item: text(b?.item, 120) ?? '', planned: num(b?.planned, 0, 10_000_000, 0), paid: num(b?.paid, 0, 10_000_000, 0) })),
    budgetTotal: num(p.budgetTotal, 0, 100_000_000, 0),
    tables: list(p.tables, 200).map((t: any) => ({ id: id(t?.id), name: text(t?.name, 60) ?? '', seats: num(t?.seats, 1, 100, 8) })),
    notes: text(p.notes, 10_000) ?? '',
  };
}

export interface RsvpFields {
  code?: string;
  name: string;
  status: Exclude<RsvpStatus, 'invited'>;
  adults: number;
  children: number;
  menu: MenuChoice;
  allergies: string | null;
  song: string | null;
  message: string | null;
}

/** Zusage eines Gastes, oder null, wenn Name oder Antwort fehlen. */
export function parseRsvp(b: any, maxPersons = 20): RsvpFields | null {
  const name = text(b?.name, 120);
  const status = b?.status;
  if (!name || name.length < 2 || !['yes', 'no', 'maybe'].includes(status)) return null;
  const coming = status !== 'no';
  return {
    code: typeof b?.code === 'string' && /^[a-z0-9]{4,12}$/i.test(b.code) ? b.code : undefined,
    name,
    status,
    adults: coming ? num(b?.adults, 0, maxPersons, 1) : 0,
    children: coming ? num(b?.children, 0, maxPersons, 0) : 0,
    menu: coming ? oneOf<MenuChoice>(b?.menu, ['', ...MENU_CHOICES], '') : '',
    allergies: coming ? (text(b?.allergies, 200) ?? null) : null,
    song: coming ? (text(b?.song, 160) ?? null) : null,
    message: text(b?.message, 1000) ?? null,
  };
}

/** Änderung des Gastgebers an einem Gast: nur übergebene Felder. */
export function guestPatch(b: any): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if ('name' in b) out['name'] = text(b.name, 120) ?? 'Gast';
  if ('status' in b) out['status'] = oneOf<RsvpStatus>(b.status, ['invited', 'yes', 'no', 'maybe'], 'invited');
  if ('adults' in b) out['adults'] = num(b.adults, 0, 50, 1);
  if ('children' in b) out['children'] = num(b.children, 0, 50, 0);
  if ('menu' in b) out['menu'] = oneOf<MenuChoice>(b.menu, ['', ...MENU_CHOICES], '');
  if ('allergies' in b) out['allergies'] = text(b.allergies, 200) ?? null;
  if ('song' in b) out['song'] = text(b.song, 160) ?? null;
  if ('message' in b) out['message'] = text(b.message, 1000) ?? null;
  if ('group' in b) out['grp'] = text(b.group, 60) ?? null;
  if ('table' in b) out['table_id'] = text(b.table, 40) ?? null;
  if ('phone' in b) out['phone'] = text(b.phone, 40) ?? null;
  if ('note' in b) out['note'] = text(b.note, 500) ?? null;
  return out;
}

export function rowToGuest(r: any): InviteGuest {
  return {
    id: String(r.id),
    code: String(r.code),
    name: String(r.name),
    status: r.status,
    adults: Number(r.adults),
    children: Number(r.children),
    menu: r.menu ?? '',
    allergies: r.allergies ?? undefined,
    song: r.song ?? undefined,
    message: r.message ?? undefined,
    group: r.grp ?? undefined,
    table: r.table_id ?? undefined,
    phone: r.phone ?? undefined,
    note: r.note ?? undefined,
    respondedAt: r.responded_at ? new Date(r.responded_at).toISOString() : undefined,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

function rowToPhoto(r: any): InvitePhoto {
  return { id: String(r.id), url: String(r.url), by: r.uploader ?? undefined, hidden: !!r.hidden, createdAt: new Date(r.created_at).toISOString() };
}

/** Neue Einladung aus dem Beispiel der Gestaltung — Namen, Datum, Art neu, persönliche Angaben leer. */
export function newEvent(slug: string, o: { title?: string; theme?: string; kind?: string; date?: string }): InviteEvent {
  const theme = oneOf<ThemeId>(o.theme, THEME_IDS, 'klassik');
  const base = demoEvent(theme);
  return sanitizeEvent(
    {
      ...base,
      title: o.title || base.title,
      kind: o.kind || base.kind,
      date: o.date || base.date,
      hosts: undefined,
      contacts: [],
      gifts: undefined,
      sections: { ...base.sections, gifts: false },
      gallery: [],
    },
    slug,
  );
}

// ── Bremse ──────────────────────────────────────────────

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
const ip = (req: Request) => String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? '').split(',')[0].trim();

// ── Öffentliche und Gastgeber-Routen ────────────────────

async function eventBySlug(sql: Sql, slug: string) {
  if (!validSlug(slug)) return null;
  const [row] = await sql`select id, config, plan, owner_key_hash from invite_events where slug = ${slug} and active`;
  return row ?? null;
}

/** Prüft X-Invite-Key und legt die Einladung in res.locals ab. */
async function requireOwner(req: Request, res: Response, next: NextFunction) {
  try {
    res.set('Cache-Control', 'no-store');
    const sql = sqlOr503(res);
    if (!sql) return;
    const key = String(req.headers['x-invite-key'] ?? '');
    if (limited('ik:' + ip(req), 60, 10 * 60_000)) {
      res.status(429).json({ error: 'too_many' });
      return;
    }
    const row = await eventBySlug(sql, String(req.params['slug']));
    if (!row) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    if (!key || !sameHash(await sha256Hex(key), String(row['owner_key_hash']))) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    res.locals['invite'] = row;
    next();
  } catch (err) {
    next(err);
  }
}

export const invites = express.Router();

invites.get(
  '/:slug',
  h(async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const sql = sqlOr503(res);
    if (!sql) return;
    const row = await eventBySlug(sql, String(req.params['slug']));
    if (!row) return res.status(404).json({ error: 'not_found' });
    const photos = await sql`
      select id, url, uploader, hidden, created_at from invite_photos
      where event_id = ${row['id']} and not hidden order by created_at desc limit 200`;
    const code = typeof req.query['g'] === 'string' ? req.query['g'] : '';
    let guest: unknown;
    if (/^[a-z0-9]{4,12}$/i.test(code)) {
      const [g] = await sql`
        select code, name, status, adults, children, menu, allergies, song, message
        from invite_guests where event_id = ${row['id']} and code = ${code}`;
      if (g) guest = { ...g, allergies: g['allergies'] ?? undefined, song: g['song'] ?? undefined, message: g['message'] ?? undefined };
    }
    return res.json({ event: row['config'], photos: photos.map(rowToPhoto), guest });
  }),
);

invites.post(
  '/:slug/rsvp',
  express.json({ limit: '16kb' }),
  h(async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const sql = sqlOr503(res);
    if (!sql) return;
    const slug = String(req.params['slug']);
    if (limited(`rsvp:${ip(req)}:${slug}`, 20, 60 * 60_000)) return res.status(429).json({ error: 'too_many' });
    const row = await eventBySlug(sql, slug);
    if (!row) return res.status(404).json({ error: 'not_found' });
    const event = row['config'] as InviteEvent;
    const r = parseRsvp(req.body, event.rsvp?.maxPersons ?? 20);
    if (!r) return res.status(400).json({ error: 'invalid' });

    if (r.code) {
      const [g] = await sql`
        update invite_guests set
          name = ${r.name}, status = ${r.status}, adults = ${r.adults}, children = ${r.children}, menu = ${r.menu},
          allergies = ${r.allergies}, song = ${r.song}, message = ${r.message}, responded_at = now()
        where event_id = ${row['id']} and code = ${r.code}
        returning code`;
      if (g) return res.json({ code: g['code'] });
    }
    const [{ n }] = await sql`select count(*)::int as n from invite_guests where event_id = ${row['id']}`;
    if (n >= MAX_GUESTS) return res.status(409).json({ error: 'full' });
    const [g] = await sql`
      insert into invite_guests (event_id, code, name, status, adults, children, menu, allergies, song, message, responded_at)
      values (${row['id']}, ${guestCode()}, ${r.name}, ${r.status}, ${r.adults}, ${r.children}, ${r.menu}, ${r.allergies}, ${r.song}, ${r.message}, now())
      returning code`;
    return res.status(201).json({ code: g['code'] });
  }),
);

/** Ein Bild in den Speicher; Fehler als Status, wie bei /card-image. */
async function storeImage(req: Request, res: Response) {
  const bytes = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
  const result = await uploadImage(bytes, req.headers['content-type']);
  if (!result.ok) {
    console.error('[invites] upload', result.error, result.detail ?? '');
    const status = result.error === 'storage_not_configured' ? 503 : result.error === 'upload_failed' ? 502 : 400;
    res.status(status).json({ error: result.error });
    return null;
  }
  return result;
}

invites.post(
  '/:slug/photos',
  express.raw({ type: ALLOWED_TYPES, limit: '6mb' }),
  h(async (req, res) => {
    res.set('Cache-Control', 'no-store');
    const sql = sqlOr503(res);
    if (!sql) return;
    const slug = String(req.params['slug']);
    // Eine Feier, ein Handy, viele Fotos: großzügig, aber nicht grenzenlos.
    if (limited(`ph:${ip(req)}`, 60, 60 * 60_000)) return res.status(429).json({ error: 'too_many' });
    const row = await eventBySlug(sql, slug);
    if (!row) return res.status(404).json({ error: 'not_found' });
    if ((row['config'] as InviteEvent).guestUploads === false) return res.status(403).json({ error: 'closed' });
    const [{ n }] = await sql`select count(*)::int as n from invite_photos where event_id = ${row['id']}`;
    if (n >= MAX_PHOTOS) return res.status(409).json({ error: 'full' });

    const stored = await storeImage(req, res);
    if (!stored) return;
    const by = str(req.query['by'], 60);
    const [p] = await sql`
      insert into invite_photos (event_id, url, path, uploader) values (${row['id']}, ${stored.url}, ${stored.path}, ${by})
      returning id, url, uploader, hidden, created_at`;
    return res.status(201).json(rowToPhoto(p));
  }),
);

// ── Gastgeber ──

invites.get(
  '/:slug/owner',
  requireOwner,
  h(async (_req, res) => {
    const sql = db()!;
    const row = res.locals['invite'];
    const [guests, photos] = await Promise.all([
      sql`select * from invite_guests where event_id = ${row['id']} order by created_at`,
      sql`select id, url, uploader, hidden, created_at from invite_photos where event_id = ${row['id']} order by created_at desc`,
    ]);
    return res.json({
      event: row['config'],
      plan: { ...emptyPlan(), ...(row['plan'] ?? {}) },
      guests: guests.map(rowToGuest),
      photos: photos.map(rowToPhoto),
    });
  }),
);

invites.put(
  '/:slug/owner',
  express.json({ limit: '400kb' }),
  requireOwner,
  h(async (req, res) => {
    const sql = db()!;
    const row = res.locals['invite'];
    const slug = String(req.params['slug']);
    const event = req.body?.event ? sanitizeEvent(req.body.event, slug) : null;
    const plan = req.body?.plan ? sanitizePlan(req.body.plan) : null;
    if (!event && !plan) return res.status(400).json({ error: 'invalid' });
    await sql`
      update invite_events set
        config = coalesce(${event ? sql.json(event as any) : null}::jsonb, config),
        plan = coalesce(${plan ? sql.json(plan as any) : null}::jsonb, plan),
        updated_at = now()
      where id = ${row['id']}`;
    return res.json({ ok: true });
  }),
);

invites.post(
  '/:slug/owner/guests',
  express.json({ limit: '16kb' }),
  requireOwner,
  h(async (req, res) => {
    const sql = db()!;
    const row = res.locals['invite'];
    const patch = guestPatch(req.body ?? {});
    if (!patch['name']) return res.status(400).json({ error: 'invalid' });
    const [{ n }] = await sql`select count(*)::int as n from invite_guests where event_id = ${row['id']}`;
    if (n >= MAX_GUESTS) return res.status(409).json({ error: 'full' });
    const [g] = await sql`
      insert into invite_guests ${sql({ ...patch, event_id: row['id'], code: guestCode() } as any)}
      returning *`;
    return res.status(201).json(rowToGuest(g));
  }),
);

invites.patch(
  '/:slug/owner/guests/:id',
  express.json({ limit: '16kb' }),
  requireOwner,
  h(async (req, res) => {
    const sql = db()!;
    const patch = guestPatch(req.body ?? {});
    if (!Object.keys(patch).length) return res.status(400).json({ error: 'invalid' });
    const [g] = await sql`
      update invite_guests set ${sql(patch as any)}
      where id = ${String(req.params['id'])} and event_id = ${res.locals['invite']['id']}
      returning *`;
    if (!g) return res.status(404).json({ error: 'not_found' });
    return res.json(rowToGuest(g));
  }),
);

invites.delete(
  '/:slug/owner/guests/:id',
  requireOwner,
  h(async (req, res) => {
    const sql = db()!;
    await sql`delete from invite_guests where id = ${String(req.params['id'])} and event_id = ${res.locals['invite']['id']}`;
    return res.status(204).end();
  }),
);

invites.post(
  '/:slug/owner/upload',
  express.raw({ type: ALLOWED_TYPES, limit: '6mb' }),
  requireOwner,
  h(async (req, res) => {
    const stored = await storeImage(req, res);
    if (!stored) return;
    return res.status(201).json({ url: stored.url });
  }),
);

invites.patch(
  '/:slug/owner/photos/:id',
  express.json({ limit: '2kb' }),
  requireOwner,
  h(async (req, res) => {
    const sql = db()!;
    const [p] = await sql`
      update invite_photos set hidden = ${req.body?.hidden === true}
      where id = ${String(req.params['id'])} and event_id = ${res.locals['invite']['id']}
      returning id`;
    return p ? res.json({ ok: true }) : res.status(404).json({ error: 'not_found' });
  }),
);

invites.delete(
  '/:slug/owner/photos/:id',
  requireOwner,
  h(async (req, res) => {
    const sql = db()!;
    const [p] = await sql`
      delete from invite_photos where id = ${String(req.params['id'])} and event_id = ${res.locals['invite']['id']}
      returning path`;
    if (p?.['path']) await deleteImage(String(p['path']));
    return res.status(204).end();
  }),
);

// ── Admin-Portal: Einladungen anlegen ───────────────────

export const adminInvites = express.Router();

adminInvites.get(
  '/',
  h(async (_req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const rows = await sql`
      select e.id, e.slug, e.created_at, e.customer_name, e.customer_email, e.active,
             e.config->>'title' as title, e.config->>'theme' as theme, e.config->>'date' as date,
             (select count(*)::int from invite_guests g where g.event_id = e.id) as guests,
             (select coalesce(sum(adults + children), 0)::int from invite_guests g where g.event_id = e.id and g.status = 'yes') as persons
      from invite_events e order by e.created_at desc`;
    return res.json(rows);
  }),
);

/** Legt eine Einladung an und gibt den Schlüssel genau einmal zurück. */
adminInvites.post(
  '/',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const b = req.body ?? {};
    const slug = String(b.slug ?? '').trim().toLowerCase();
    if (!validSlug(slug)) return res.status(400).json({ error: 'invalid_slug' });
    const key = newOwnerKey();
    const event = newEvent(slug, { title: str(b.title, 120) ?? undefined, theme: b.theme, kind: b.kind, date: b.date });
    await sql`
      insert into invite_events (slug, owner_key_hash, customer_name, customer_email, config, plan)
      values (${slug}, ${await sha256Hex(key)}, ${str(b.customer_name, 120)}, ${str(b.customer_email, 200)},
              ${sql.json(event as any)}, ${sql.json(emptyPlan() as any)})`;
    return res.status(201).json({ slug, key, ...inviteLinks(slug, key) });
  }),
);

/** Neuer Schlüssel, wenn der alte verloren ging oder weitergegeben wurde. */
adminInvites.post(
  '/:slug/key',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const slug = String(req.params['slug']);
    const key = newOwnerKey();
    const [row] = await sql`update invite_events set owner_key_hash = ${await sha256Hex(key)}, updated_at = now() where slug = ${slug} returning slug`;
    if (!row) return res.status(404).json({ error: 'not_found' });
    return res.json({ slug, key, ...inviteLinks(slug, key) });
  }),
);

adminInvites.patch(
  '/:slug',
  h(async (req, res) => {
    const sql = sqlOr503(res);
    if (!sql) return;
    const [row] = await sql`update invite_events set active = ${req.body?.active !== false}, updated_at = now() where slug = ${String(req.params['slug'])} returning slug`;
    return row ? res.json({ ok: true }) : res.status(404).json({ error: 'not_found' });
  }),
);

export function inviteLinks(slug: string, key: string): { invite: string; planner: string } {
  return { invite: `/einladung/${slug}`, planner: `/einladung/${slug}/planer#k=${encodeURIComponent(key)}` };
}
