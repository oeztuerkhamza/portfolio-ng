-- Breisgau Digital — search_path der Auslösefunktion festnageln
--
-- `touch_updated_at` hängt an jeder Tabelle und setzt `updated_at`. Ohne
-- festen `search_path` entscheidet der Aufrufer, *welches* `now()` gemeint
-- ist: wer ein Schema vor `pg_catalog` in seinen Suchpfad bekommt, kann dort
-- ein eigenes `now()` anlegen und die Funktion damit unterschieben. Bei einer
-- Zeitangabe klingt das harmlos, aber die Lücke gehört nicht in eine
-- Funktion, die bei jedem Schreibzugriff läuft.
--
-- Darum: leerer Suchpfad und der volle Name. Dann ist nichts mehr zu raten.
-- (Supabase-Linter 0011, function_search_path_mutable.)
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end $$;
