-- ── Speisekarten für Kunden ──────────────────────────────────
-- Eine Karte je Betrieb unter /m/<slug>, gedacht für NFC-Aufsteller und
-- QR-Codes auf dem Tisch. Wie bei den NFC-Karten steckt der Inhalt in `data`
-- (Form und Prüfung: src/server/menus.ts), damit ein neues Feld keine
-- Migration braucht.
create table if not exists public.menus (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  slug         text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$'),
  label        text check (length(label) <= 200),
  customer_id  uuid references public.customers (id) on delete set null,
  lang         text not null default 'de' check (lang in ('de', 'fr', 'en', 'tr', 'ku')),
  theme        text not null default 'warm' check (theme in ('brand', 'dark', 'warm')),
  data         jsonb not null default '{}',
  active       boolean not null default true
);
create index if not exists menus_customer_idx on public.menus (customer_id);

-- ── Aufrufe auch für Speisekarten ────────────────────────────
alter table public.scans add column if not exists menu_id uuid references public.menus (id) on delete cascade;
alter table public.scans drop constraint if exists scans_one_source;
alter table public.scans add constraint scans_one_source
  check (((redirect_id is not null)::int + (card_id is not null)::int + (menu_id is not null)::int) = 1);
create index if not exists scans_menu_idx on public.scans (menu_id, scanned_at desc);

drop trigger if exists touch_menus on public.menus;
create trigger touch_menus before update on public.menus
  for each row execute function public.touch_updated_at();

-- ── Zugriff sperren: nur der Server der Website liest ────────
alter table public.menus enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.menus from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.menus from authenticated;
  end if;
end $$;

-- ── Erster Kunde: Sichelschmiede ─────────────────────────────
-- Als Entwurf (active = false) angelegt: Die Gerichte und Preise liefert der
-- Kunde, bis dahin zeigt /m/sichelschmiede nichts. Im Portal unter
-- „Menüler" ausfüllen und aktivieren.
insert into public.menus (slug, label, lang, theme, data, active)
values (
  'sichelschmiede',
  'Sichelschmiede',
  'de',
  'warm',
  '{"name":"Sichelschmiede","tagline":"Speisekarte","categories":[]}'::jsonb,
  false
)
on conflict (slug) do nothing;
