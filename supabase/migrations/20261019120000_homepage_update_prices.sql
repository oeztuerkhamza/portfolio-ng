-- Preise der drei Homepage-Update-Pakete (Leistungsseite).
-- Der Build holt sie wie alle anderen Preise aus `prices`; im Admin-Portal
-- unter „Fiyatlar" änderbar. Bestehende Werte werden nicht überschrieben.
insert into public.prices (key, grp, label, value, unit, sort, shop) values
  ('upd.start',    'Homepage-Update', 'Update Start',    890,  '€', 110, false),
  ('upd.standard', 'Homepage-Update', 'Update Standard', 1790, '€', 111, false),
  ('upd.komplett', 'Homepage-Update', 'Update Komplett', 2990, '€', 112, false)
on conflict (key) do nothing;
