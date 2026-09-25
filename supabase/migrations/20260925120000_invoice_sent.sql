-- Breisgau Digital — Rechnungsversand per E-Mail
--
-- Wann eine Rechnung zuletzt an den Kunden verschickt wurde. Fehlt die
-- Spalte, geht der Versand trotzdem raus; nur der Vermerk bleibt leer.

alter table public.invoices add column if not exists sent_at timestamptz;
