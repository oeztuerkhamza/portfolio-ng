-- ── NFC-Karten mit eigener Seite ─────────────────────────────
-- Bisher gab es nur Kurzlinks: /r/<slug> leitet auf eine fremde Adresse
-- weiter. Karten zeigen stattdessen eine Seite auf unserer Domain:
-- /k/<slug>. Beides bleibt nebeneinander bestehen, damit die schon
-- programmierten Karten unberührt weiterlaufen.
--
-- `data` hält den Inhalt je Art. Geprüft wird er im Server
-- (src/server/cards.ts), nicht in der Datenbank — so kann ein Feld
-- dazukommen, ohne dass eine Migration nötig wird.
create table if not exists public.cards (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  slug         text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$'),
  kind         text not null check (kind in ('business', 'gift')),
  label        text check (length(label) <= 200),
  customer_id  uuid references public.customers (id) on delete set null,
  order_id     uuid references public.orders (id) on delete set null,
  data         jsonb not null default '{}',
  theme        text not null default 'brand' check (theme in ('brand', 'dark', 'warm')),
  active       boolean not null default true
);
create index if not exists cards_customer_idx on public.cards (customer_id);

-- ── Okutmalar auch für Karten ────────────────────────────────
-- `scans` zählte bisher nur Kurzlinks. Jetzt zeigt jede Zeile auf genau
-- eine Quelle: entweder einen Kurzlink oder eine Karte.
alter table public.scans add column if not exists card_id uuid references public.cards (id) on delete cascade;
alter table public.scans alter column redirect_id drop not null;
alter table public.scans drop constraint if exists scans_one_source;
alter table public.scans add constraint scans_one_source
  check ((redirect_id is not null) <> (card_id is not null));
create index if not exists scans_card_idx on public.scans (card_id, scanned_at desc);

-- ── updated_at mitführen, wie bei den anderen Tabellen ───────
drop trigger if exists touch_cards on public.cards;
create trigger touch_cards before update on public.cards
  for each row execute function public.touch_updated_at();

-- ── Zugriff sperren: nur der Server der Website liest ────────
alter table public.cards enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.cards from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.cards from authenticated;
  end if;
end $$;
