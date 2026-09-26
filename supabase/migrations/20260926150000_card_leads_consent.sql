-- Breisgau Digital — Einwilligung zum Kontaktbogen festhalten
--
-- Der Bogen auf einer Firmenkarte hat jetzt ein Häkchen: ohne Einwilligung
-- nimmt der Server nichts an. Damit ist die Rechtsgrundlage Art. 6 Abs. 1
-- lit. a DSGVO — und die verlangt in Art. 7 Abs. 1, dass wir die
-- Einwilligung *nachweisen* können.
--
-- Nachgewiesen wird sie durch zwei Dinge, die zusammen in der Zeile stehen:
--   * `created_at` — wann eingewilligt wurde (der Bogen wird in demselben
--     Augenblick abgeschickt, in dem das Häkchen gesetzt ist),
--   * `consent`    — der *genaue Satz*, dem zugestimmt wurde, in der Sprache
--     der Karte. Nicht ein „ja", sondern der Wortlaut: ändert sich der Text
--     später, bleibt an alten Zeilen der alte stehen.
--
-- Der Wortlaut kommt vom Server (LABELS in src/server/cards.ts), nicht aus
-- dem Browser — sonst könnte man behaupten, einem anderen Satz zugestimmt
-- zu haben.
--
-- Zeilen von vor dieser Änderung haben kein `consent`; darum darf die Spalte
-- leer sein. Neue Zeilen legt der Server nie ohne an.
alter table public.card_leads add column if not exists consent text;

comment on column public.card_leads.consent is
  'Wortlaut der Einwilligung, dem der Gast zugestimmt hat (Art. 7 Abs. 1 DSGVO). Zeitpunkt = created_at.';
