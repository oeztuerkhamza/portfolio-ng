-- Breisgau Digital — eigene NFC-Karten im Shop, Sprache je Karte, Kontakte
--
-- Drei Dinge, die zusammengehören:
--   1. Die eigenen Karten (Firmenkarte, Geschenkkarte) sind jetzt im Shop
--      bestellbar. Nach der Bezahlung legt der Server einen Kartenentwurf an
--      (src/server/api.ts), den wir im Portal mit Inhalt füllen.
--   2. Jede Karte hat eine Sprache. Bisher stand auf jeder Karte „Telefon"
--      und „Adresse" — auch bei einem Kunden, dessen Gäste kein Deutsch
--      sprechen.
--   3. Wer eine Firmenkarte antippt, kann seine eigenen Daten dalassen.
--      Genau das verkaufen die Anbieter digitaler Visitenkarten als
--      Hauptfunktion; bei uns liegen die Kontakte im eigenen Portal.

-- ── 1. Karten im Shop ────────────────────────────────────────
-- Der Schlüssel heißt genau `card.<art>`: daraus liest der Server die Art
-- der Karte (business/gift). Preise werden im Portal unter „Fiyatlar"
-- gepflegt; die Zeilen hier sind nur der Startwert.
insert into public.prices (key, grp, label, value, unit, sort, shop) values
  ('card.business', 'NFC-Karten', 'Digitale Visitenkarte (NFC)', 49, '€', 80, true),
  ('card.gift',     'NFC-Karten', 'Geschenkkarte (NFC)',         39, '€', 90, true)
on conflict (key) do nothing;

-- ── 2. Sprache je Karte ──────────────────────────────────────
alter table public.cards add column if not exists lang text not null default 'de';
alter table public.cards drop constraint if exists cards_lang_check;
alter table public.cards add constraint cards_lang_check
  check (lang in ('de', 'fr', 'en', 'tr', 'ku'));

-- ── 3. Kontakte, die auf einer Karte hinterlassen werden ─────
-- Bewusst ohne IP-Adresse: für die Zuordnung reicht die Karte, und was nicht
-- gespeichert wird, muss auch nicht geschützt werden. `device` ist dieselbe
-- grobe Gattung wie bei den Okutmalar (ios/android/other).
create table if not exists public.card_leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  card_id    uuid not null references public.cards (id) on delete cascade,
  name       text not null check (length(name) between 1 and 120),
  email      text check (length(email) <= 200),
  phone      text check (length(phone) <= 40),
  company    text check (length(company) <= 200),
  message    text check (length(message) <= 2000),
  device     text check (length(device) <= 40),
  -- Im Portal abgehakt, wenn wir uns gemeldet haben.
  handled    boolean not null default false
);
create index if not exists card_leads_card_idx on public.card_leads (card_id, created_at desc);
create index if not exists card_leads_open_idx on public.card_leads (created_at desc) where not handled;

-- ── Zugriff sperren: nur der Server der Website liest ────────
alter table public.card_leads enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.card_leads from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.card_leads from authenticated;
  end if;
end $$;
