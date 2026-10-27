-- Divan: mehr Fotos bei den Hauptgerichten (eigene Aufnahmen des Hauses, /menu/divan/gerichte/).
-- Zugeordnet über die Nummer der Karte; ein bereits eingetragenes Foto bleibt.
with fotos (num, img) as (values
  ('114', 'https://breisgau-digital.de/menu/divan/gerichte/koefte-pilav.jpg?v=1'),
  ('116', 'https://breisgau-digital.de/menu/divan/gerichte/koefte-peynirli.jpg?v=1'),
  ('203', 'https://breisgau-digital.de/menu/divan/gerichte/pizza-ispinak.jpg?v=1'),
  ('85', 'https://breisgau-digital.de/menu/divan/gerichte/pohca-2.jpg?v=1'),
  ('52', 'https://breisgau-digital.de/menu/divan/gerichte/makarna-tomate.jpg?v=1'),
  ('57', 'https://breisgau-digital.de/menu/divan/gerichte/makarna-tomate.jpg?v=1'),
  ('M10', 'https://breisgau-digital.de/menu/divan/gerichte/makarna-tomate.jpg?v=1'),
  ('73', 'https://breisgau-digital.de/menu/divan/gerichte/boerek-2.jpg?v=1'),
  ('M17', 'https://breisgau-digital.de/menu/divan/gerichte/boerek-2.jpg?v=1'),
  ('74', 'https://breisgau-digital.de/menu/divan/gerichte/boerek-3.jpg?v=1'),
  ('76', 'https://breisgau-digital.de/menu/divan/gerichte/boerek-4.jpg?v=1'),
  ('M18', 'https://breisgau-digital.de/menu/divan/gerichte/boerek-4.jpg?v=1')
)
update public.menus m
set data = jsonb_set(m.data, '{categories}', coalesce((
  select jsonb_agg(jsonb_set(c, '{items}', (
    select coalesce(jsonb_agg(case when f.img is not null and not (i ? 'img') then i || jsonb_build_object('img', f.img) else i end order by io), '[]'::jsonb)
    from jsonb_array_elements(c->'items') with ordinality as y(i, io)
    left join fotos f on f.num = i->>'num'
  )) order by co)
  from jsonb_array_elements(m.data->'categories') with ordinality as x(c, co)
), '[]'::jsonb))
where m.slug = 'divan';
