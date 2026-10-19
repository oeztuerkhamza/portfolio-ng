-- Preise der drei Wartungspakete (Seite /wartung). Der Build holt sie wie alle
-- anderen Preise aus `prices`; im Admin-Portal unter „Fiyatlar" änderbar.
insert into public.prices (key, grp, label, value, unit, sort, shop) values
  ('wart.basis',  'Wartung', 'Wartung Basis – pro Monat',  12, '€', 120, false),
  ('wart.pflege', 'Wartung', 'Wartung Pflege – pro Monat', 25, '€', 121, false),
  ('wart.plus',   'Wartung', 'Wartung Plus – pro Monat',   49, '€', 122, false)
on conflict (key) do nothing;
