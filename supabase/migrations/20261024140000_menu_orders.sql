-- ── Bestellen am Tisch ───────────────────────────────────────
-- Gäste bestellen nur, wenn sie am Tisch sind: Jeder Tisch hat ein geheimes
-- Kürzel (token), das nur im QR-Code/NFC-Aufsteller auf genau diesem Tisch
-- steckt (/m/<slug>?t=<token>). Wer die Karte von zu Hause öffnet, sieht sie,
-- kann aber nicht bestellen. Wechselt das Kürzel (Portal: „Neu erzeugen"),
-- sind alte Fotos des Codes wertlos. Logik: src/server/menus.ts + api.ts.
alter table public.menus add column if not exists ordering boolean not null default false;

create table if not exists public.menu_tables (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  menu_id     uuid not null references public.menus (id) on delete cascade,
  label       text not null check (length(label) between 1 and 40),
  token       text not null unique check (length(token) >= 20),
  unique (menu_id, label)
);
create index if not exists menu_tables_menu_idx on public.menu_tables (menu_id);

create table if not exists public.menu_orders (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  menu_id     uuid not null references public.menus (id) on delete cascade,
  table_id    uuid references public.menu_tables (id) on delete set null,
  table_label text not null,
  items       jsonb not null,
  total_cents integer,
  note        text check (length(note) <= 300),
  status      text not null default 'new' check (status in ('new', 'accepted', 'done', 'cancelled'))
);
create index if not exists menu_orders_menu_idx on public.menu_orders (menu_id, created_at desc);
create index if not exists menu_orders_table_idx on public.menu_orders (table_id, created_at desc);

-- ── Zugriff sperren: nur der Server der Website liest ────────
alter table public.menu_tables enable row level security;
alter table public.menu_orders enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.menu_tables, public.menu_orders from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.menu_tables, public.menu_orders from authenticated;
  end if;
end $$;
