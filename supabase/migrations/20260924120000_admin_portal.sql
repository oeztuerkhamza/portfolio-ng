-- Breisgau Digital — Admin-Portal
--
-- Alle Tabellen haben Row Level Security ohne Policies: über die öffentliche
-- Supabase-API (anon / authenticated) ist nichts lesbar oder schreibbar.
-- Zugriff hat ausschließlich der Website-Server über DATABASE_URL.

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ── Kunden ───────────────────────────────────────────────
create table if not exists public.customers (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  name         text not null check (length(name) between 1 and 200),
  business     text check (length(business) <= 200),
  email        text check (length(email) <= 200),
  phone        text check (length(phone) <= 60),
  street       text check (length(street) <= 200),
  city         text check (length(city) <= 120),
  google_link  text check (length(google_link) <= 500),
  notes        text check (length(notes) <= 5000)
);

-- ── Anfragen aus dem Kontaktformular ─────────────────────
create table if not exists public.enquiries (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  name         text not null check (length(name) between 1 and 200),
  business     text check (length(business) <= 200),
  reach        text not null check (length(reach) between 1 and 200),
  message      text check (length(message) <= 5000),
  topics       text[] not null default '{}',
  plan         text check (plan in ('basis', 'business', 'premium')),
  billing      text check (billing in ('monthly', 'yearly')),
  lang         text check (length(lang) <= 5),
  status       text not null default 'neu'
               check (status in ('neu', 'kontaktiert', 'angebot', 'kunde', 'abgesagt')),
  notes        text check (length(notes) <= 5000),
  customer_id  uuid references public.customers (id) on delete set null
);
create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- ── Abos ─────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  customer_id      uuid not null references public.customers (id) on delete cascade,
  plan             text not null check (plan in ('basis', 'business', 'premium')),
  billing          text not null default 'monthly' check (billing in ('monthly', 'yearly')),
  monthly_price    numeric(10, 2) not null check (monthly_price >= 0),
  setup_fee        numeric(10, 2) not null default 0 check (setup_fee >= 0),
  start_date       date not null default current_date,
  min_term_months  integer not null default 12 check (min_term_months between 0 and 120),
  status           text not null default 'aktiv' check (status in ('aktiv', 'gekuendigt', 'pausiert')),
  end_date         date,
  notes            text check (length(notes) <= 5000)
);
create index if not exists subscriptions_customer_idx on public.subscriptions (customer_id);

-- ── NFC-Weiterleitungen: /r/<slug> → Ziel ────────────────
create table if not exists public.redirects (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  slug         text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$'),
  target_url   text not null check (target_url ~ '^https://' and length(target_url) <= 1000),
  label        text check (length(label) <= 200),
  customer_id  uuid references public.customers (id) on delete set null,
  active       boolean not null default true
);

-- Nur Zeitpunkt und Gerätetyp, keine IP-Adressen.
create table if not exists public.scans (
  id           bigint generated always as identity primary key,
  redirect_id  uuid not null references public.redirects (id) on delete cascade,
  scanned_at   timestamptz not null default now(),
  device       text not null default 'other' check (device in ('ios', 'android', 'other'))
);
create index if not exists scans_redirect_idx on public.scans (redirect_id, scanned_at desc);

-- ── Preise (werden beim Build in die Website übernommen) ──
create table if not exists public.prices (
  key          text primary key check (key ~ '^[a-z0-9.]+$'),
  updated_at   timestamptz not null default now(),
  grp          text not null,
  label        text not null,
  value        numeric(10, 2) not null check (value >= 0),
  unit         text not null default '€',
  sort         integer not null default 0,
  -- Online bestellbar (Shop)
  shop         boolean not null default false
);

-- ── Bestellungen aus dem Shop ────────────────────────────
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  stripe_session_id  text unique,
  status             text not null default 'offen'
                     check (status in ('offen', 'bezahlt', 'in_arbeit', 'versendet', 'storniert')),
  items              jsonb not null default '[]',
  amount_total       numeric(10, 2) not null default 0,
  currency           text not null default 'eur',
  customer_name      text,
  customer_email     text,
  phone              text,
  shipping           jsonb,
  business_name      text check (length(business_name) <= 200),
  google_link        text check (length(google_link) <= 500),
  lang               text,
  paid_at            timestamptz,
  notes              text check (length(notes) <= 5000)
);
create index if not exists orders_created_idx on public.orders (created_at desc);

-- ── Einstellungen ────────────────────────────────────────
create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['customers', 'enquiries', 'subscriptions', 'redirects', 'prices', 'orders', 'settings'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ── Zugriff sperren ──────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['customers', 'enquiries', 'subscriptions', 'redirects', 'scans', 'prices', 'orders', 'settings'] loop
    execute format('alter table public.%I enable row level security', t);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on public.%I from anon', t);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on public.%I from authenticated', t);
    end if;
  end loop;
end $$;

-- ── Startwerte ───────────────────────────────────────────
insert into public.prices (key, grp, label, value, unit, sort, shop) values
  ('form.karte',          'Bewertungskarten', 'NFC-Karte',                 39,   '€',      10, true),
  ('form.aufsteller',     'Bewertungskarten', 'Tischaufsteller',           69,   '€',      20, true),
  ('form.aufkleber',      'Bewertungskarten', 'NFC-Aufkleber (2 Stück)',   39,   '€',      30, true),
  ('form.anhaenger',      'Bewertungskarten', 'Schlüsselanhänger',         29,   '€',      40, true),
  ('pkg.einzel',          'Bewertungskarten', 'Paket Einzel (1 Karte)',    39,   '€',      50, true),
  ('pkg.team',            'Bewertungskarten', 'Paket Team (3 Karten)',     99,   '€',      60, true),
  ('pkg.tresen',          'Bewertungskarten', 'Paket Tresen (Aufsteller + 3 Karten)', 149, '€', 70, true),
  ('web.from',            'Website',          'Website ab',                1290, '€',     100, false),
  ('sh.check',            'Smart Home',       'Smart-Home-Check',          79,   '€',     200, false),
  ('sh.start',            'Smart Home',       'Start ab',                  490,  '€',     210, false),
  ('sh.betrieb',          'Smart Home',       'Betrieb ab',                1290, '€',     220, false),
  ('abo.basis.monthly',   'Digital-Abo',      'Basis – pro Monat',         29,   '€',     300, false),
  ('abo.basis.setup',     'Digital-Abo',      'Basis – Einrichtung',       0,    '€',     301, false),
  ('abo.basis.term',      'Digital-Abo',      'Basis – Mindestlaufzeit',   12,   'Monate', 302, false),
  ('abo.business.monthly','Digital-Abo',      'Business – pro Monat',      69,   '€',     310, false),
  ('abo.business.setup',  'Digital-Abo',      'Business – Einrichtung',    390,  '€',     311, false),
  ('abo.business.term',   'Digital-Abo',      'Business – Mindestlaufzeit', 24,  'Monate', 312, false),
  ('abo.premium.monthly', 'Digital-Abo',      'Premium – pro Monat',       129,  '€',     320, false),
  ('abo.premium.setup',   'Digital-Abo',      'Premium – Einrichtung',     390,  '€',     321, false),
  ('abo.premium.term',    'Digital-Abo',      'Premium – Mindestlaufzeit', 24,   'Monate', 322, false),
  ('shop.shipping',       'Shop',             'Versandkosten',             0,    '€',     400, false)
on conflict (key) do nothing;

insert into public.settings (key, value) values ('shop_enabled', 'false')
on conflict (key) do nothing;
