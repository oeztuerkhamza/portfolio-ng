-- ── Bilder, die Besucher selbst hochladen ────────────────────
-- Der Kartengestalter nimmt jetzt Logo, Portrait und Fotos als Datei
-- entgegen, nicht mehr nur als fertige Adresse. Der Upload ist offen: wer
-- eine Karte gestaltet, hat noch nichts bestellt und kann sich nirgends
-- anmelden.
--
-- Damit entsteht ein Problem, das es vorher nicht gab: Bilder ohne Karte.
-- Jemand lädt ein Logo hoch, überlegt es sich anders und geht — die Datei
-- bleibt liegen und niemand weiß mehr, wozu sie gehörte. Diese Tabelle ist
-- das Verzeichnis dazu: jede hochgeladene Datei bekommt eine Zeile, und mit
-- der Bestellung wird sie auf `claimed_at` gesetzt. Was nach einer Weile
-- unbeansprucht daliegt, räumt /api/cron/cleanup weg.
--
-- Bewusst kein Verweis auf `orders` oder `cards`: das Bild entsteht, bevor
-- es eine Bestellung gibt, und muss auch dann verwaltbar sein, wenn daraus
-- nie eine wird.
create table if not exists public.card_uploads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  -- Pfad im Supabase-Speicher; darüber wird gelöscht.
  path        text not null unique,
  -- Öffentliche Adresse; darüber wird beim Bestellen zugeordnet.
  url         text not null,
  bytes       integer not null default 0,
  -- Gesetzt, sobald das Bild in einer Bestellung auftaucht. Ab dann bleibt es.
  claimed_at  timestamptz
);

-- Der Aufräumlauf fragt genau danach: unbeansprucht und alt.
create index if not exists card_uploads_unclaimed_idx
  on public.card_uploads (created_at)
  where claimed_at is null;

-- Zuordnen beim Bestellen geht über die Adresse.
create index if not exists card_uploads_url_idx on public.card_uploads (url);

-- ── Zugriff sperren: nur der Server der Website liest ────────
alter table public.card_uploads enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.card_uploads from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.card_uploads from authenticated;
  end if;
end $$;
