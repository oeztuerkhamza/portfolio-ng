-- ── Digitale Einladungen ─────────────────────────────────────
-- Eine Einladung je Event (Hochzeit, Kına, Verlobung, Firmenevent …) unter
-- /einladung/<slug>. Gäste sagen dort zu und laden Fotos hoch; der Gastgeber
-- verwaltet alles im Planer unter /einladung/<slug>/planer.
--
-- Zugang des Gastgebers: kein Konto, sondern ein Schlüssel im Link, den wir
-- beim Anlegen einmal ausgeben. Gespeichert wird nur sein SHA-256 — wer die
-- Datenbank liest, kann damit keinen Planer öffnen.

create table if not exists public.invite_events (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  slug           text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,59}$' and slug not like 'demo-%' and slug <> 'live'),
  owner_key_hash text not null,
  -- Kundin/Kunde, für uns im Portal — nie auf der öffentlichen Seite.
  customer_name  text,
  customer_email text,
  -- Die Einladung selbst (InviteEvent aus src/app/einladung/invite.model.ts).
  config         jsonb not null,
  -- Privater Plan des Gastgebers: Checkliste, Budget, Tische, Notizen.
  plan           jsonb not null default '{"tasks":[],"budget":[],"budgetTotal":0,"tables":[],"notes":""}'::jsonb,
  active         boolean not null default true
);

create table if not exists public.invite_guests (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.invite_events (id) on delete cascade,
  created_at   timestamptz not null default now(),
  -- Persönlicher Link: /einladung/<slug>?g=<code>
  code         text not null,
  name         text not null check (length(name) between 1 and 120),
  status       text not null default 'invited' check (status in ('invited', 'yes', 'no', 'maybe')),
  adults       smallint not null default 1 check (adults between 0 and 50),
  children     smallint not null default 0 check (children between 0 and 50),
  menu         text not null default '' check (menu in ('', 'meat', 'fish', 'veggie', 'vegan', 'kids')),
  allergies    text,
  song         text,
  message      text,
  grp          text,
  table_id     text,
  phone        text,
  note         text,
  responded_at timestamptz,
  unique (event_id, code)
);
create index if not exists invite_guests_event_idx on public.invite_guests (event_id, created_at);

create table if not exists public.invite_photos (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.invite_events (id) on delete cascade,
  created_at timestamptz not null default now(),
  url        text not null,
  -- Pfad im Supabase-Speicher; darüber wird beim Löschen aufgeräumt.
  path       text,
  uploader   text,
  hidden     boolean not null default false
);
create index if not exists invite_photos_event_idx on public.invite_photos (event_id, created_at desc);

-- ── Zugriff sperren: nur der Server der Website liest ────────
alter table public.invite_events enable row level security;
alter table public.invite_guests enable row level security;
alter table public.invite_photos enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.invite_events, public.invite_guests, public.invite_photos from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.invite_events, public.invite_guests, public.invite_photos from authenticated;
  end if;
end $$;

-- ── Preise der drei Pakete (Seite /digitale-einladung) ───────
-- Wie alle Preise im Admin-Portal unter „Fiyatlar" änderbar; der Build holt
-- sie nach catalog.json.
insert into public.prices (key, grp, label, value, unit, sort, shop) values
  ('inv.basis',    'Digitale Einladung', 'Einladung Basis – einmalig',    79, '€', 130, false),
  ('inv.premium',  'Digitale Einladung', 'Einladung Premium – einmalig', 149, '€', 131, false),
  ('inv.komplett', 'Digitale Einladung', 'Einladung Rundum – einmalig',  249, '€', 132, false)
on conflict (key) do nothing;
