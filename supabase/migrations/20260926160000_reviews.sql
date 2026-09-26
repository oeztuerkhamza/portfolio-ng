-- Breisgau Digital — Google-Bewertungen auf der Website
--
-- Die Bewertungen werden **auf dem Server** bei Google geholt und hier
-- abgelegt. Der Besucher bekommt sie aus unserer Seite, nicht aus einer
-- fremden Anfrage:
--
--   * der Schlüssel bleibt auf dem Server (aus dem Browser wäre er sichtbar),
--   * Google erfährt nichts über den Besucher — keine IP, kein Skript,
--     kein Bild von googleusercontent. Darum braucht die Seite dafür auch
--     keinen Einwilligungsbanner.
--
-- Zwischenspeichern erlauben die Google-Maps-Bedingungen nur begrenzt (eine
-- Kopie „temporarily", in der Größenordnung von 30 Tagen). `fetched_at` hält
-- fest, wann eine Zeile geholt wurde; was älter ist, wird gelöscht
-- (REVIEW_MAX_AGE_DAYS in src/server/reviews.ts).
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  -- Wann die Zeile von Google geholt wurde — nicht, wann sie geschrieben wurde.
  fetched_at  timestamptz not null default now(),
  -- Herkunft, damit später eine zweite Quelle möglich ist, ohne alles zu ändern.
  source      text not null default 'google' check (source in ('google')),
  -- Kennung der Bewertung bei Google, damit dieselbe nicht zweimal ankommt.
  external_id text not null,
  author      text not null check (length(author) <= 200),
  rating      smallint not null check (rating between 1 and 5),
  text        text not null default '' check (length(text) <= 5000),
  -- Was Google als Zeitangabe liefert: entweder ein Zeitpunkt …
  published_at timestamptz,
  -- … oder nur „vor zwei Wochen". Beides wird übernommen, wie es kommt.
  published_label text check (length(published_label) <= 80),
  lang        text check (length(lang) <= 10),
  /**
   * Von Hand ausgeblendet. Die Bedingungen von Google verlangen, Bewertungen
   * unverändert zu zeigen — kürzen oder umschreiben ist nicht erlaubt. Eine
   * Bewertung ganz weglassen dagegen schon.
   */
  hidden      boolean not null default false,
  unique (source, external_id)
);
create index if not exists reviews_show_idx on public.reviews (rating desc, published_at desc nulls last) where not hidden;

-- ── Gesamtnote und Anzahl, wie Google sie nennt ──────────────
-- Beides gehört zur Anzeige („4,9 von 5 · 27 Bewertungen") und kommt aus
-- derselben Antwort. Es steht in `settings`, weil es genau einen Wert gibt.
insert into public.settings (key, value) values ('google_reviews', '{}')
on conflict (key) do nothing;

-- Die Kennung des Betriebs bei Google (Place ID). Wird im Portal eingetragen.
insert into public.settings (key, value) values ('google_place_id', '""')
on conflict (key) do nothing;

-- ── Zugriff sperren: nur der Server der Website liest ────────
alter table public.reviews enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.reviews from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.reviews from authenticated;
  end if;
end $$;
