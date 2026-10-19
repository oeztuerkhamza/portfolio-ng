-- Preisniveau für individuell programmierte Websites (kein WordPress, kein
-- Baukasten): Website ab 2.490 €, Homepage-Update 890 / 1.790 / 2.990 €,
-- Wartung 39 / 79 / 149 € pro Monat.
--
-- Anders als die beiden Migrationen davor überschreibt diese bestehende
-- Werte: `web.from` steht seit dem Admin-Portal in der Tabelle, und der Build
-- nimmt die Preise von dort — ohne Update bliebe die Seite beim alten Preis.
insert into public.prices (key, grp, label, value, unit, sort, shop) values
  ('web.from',     'Website',         'Website ab',                2490, '€', 100, false),
  ('upd.start',    'Homepage-Update', 'Update Start',              890,  '€', 110, false),
  ('upd.standard', 'Homepage-Update', 'Update Standard',           1790, '€', 111, false),
  ('upd.komplett', 'Homepage-Update', 'Update Komplett',           2990, '€', 112, false),
  ('wart.basis',   'Wartung',         'Wartung Basis – pro Monat',  39,  '€', 120, false),
  ('wart.pflege',  'Wartung',         'Wartung Pflege – pro Monat', 79,  '€', 121, false),
  ('wart.plus',    'Wartung',         'Wartung Plus – pro Monat',   149, '€', 122, false)
on conflict (key) do update set value = excluded.value;
