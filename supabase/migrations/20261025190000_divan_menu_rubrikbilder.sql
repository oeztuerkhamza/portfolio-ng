-- Divan: Bild je Rubrik, aus den eigenen Fotos der Website divan-freiburg.de (zugeschnitten und
-- aufgehellt, unter /menu/divan/rubriken/). Für die zwei Weinrubriken gibt es kein Foto; sie bekommen
-- das Muster des Themes. Zugeordnet nach Position der Rubrik; ein im Portal eingetragenes Bild bleibt.
with bilder (pos, img) as (values
  (1, 'https://breisgau-digital.de/menu/divan/rubriken/vorspeisen.jpg?v=1'),
  (2, 'https://breisgau-digital.de/menu/divan/rubriken/salate.jpg?v=1'),
  (3, 'https://breisgau-digital.de/menu/divan/rubriken/orient.jpg?v=1'),
  (4, 'https://breisgau-digital.de/menu/divan/rubriken/grill.jpg?v=1'),
  (5, 'https://breisgau-digital.de/menu/divan/rubriken/doener.jpg?v=1'),
  (6, 'https://breisgau-digital.de/menu/divan/rubriken/auflaeufe.jpg?v=1'),
  (7, 'https://breisgau-digital.de/menu/divan/rubriken/pfanne.jpg?v=1'),
  (8, 'https://breisgau-digital.de/menu/divan/rubriken/sac.jpg?v=1'),
  (9, 'https://breisgau-digital.de/menu/divan/rubriken/pide.jpg?v=1'),
  (10, 'https://breisgau-digital.de/menu/divan/rubriken/pizza.jpg?v=1'),
  (11, 'https://breisgau-digital.de/menu/divan/rubriken/boerek.jpg?v=1'),
  (12, 'https://breisgau-digital.de/menu/divan/rubriken/pogaca.jpg?v=1'),
  (13, 'https://breisgau-digital.de/menu/divan/rubriken/nudeln.jpg?v=1'),
  (14, 'https://breisgau-digital.de/menu/divan/rubriken/beilagen.jpg?v=1'),
  (15, 'https://breisgau-digital.de/menu/divan/rubriken/kinder.jpg?v=1'),
  (16, 'https://breisgau-digital.de/menu/divan/rubriken/dessert.jpg?v=1'),
  (17, 'https://breisgau-digital.de/menu/divan/rubriken/heiss.jpg?v=1'),
  (18, 'https://breisgau-digital.de/menu/divan/rubriken/alkoholfrei.jpg?v=1'),
  (19, 'https://breisgau-digital.de/menu/divan/rubriken/saefte.jpg?v=1'),
  (20, 'https://breisgau-digital.de/menu/divan/rubriken/bier.jpg?v=1'),
  (23, 'https://breisgau-digital.de/menu/divan/rubriken/aperitif.jpg?v=1'),
  (24, 'https://breisgau-digital.de/menu/divan/rubriken/raki.jpg?v=1')
)
update public.menus m
set data = jsonb_set(m.data, '{categories}', coalesce((
  select jsonb_agg(case when b.img is not null and not (c ? 'img') then c || jsonb_build_object('img', b.img) else c end order by x.pos)
  from jsonb_array_elements(m.data->'categories') with ordinality as x(c, pos)
  left join bilder b on b.pos = x.pos
), '[]'::jsonb))
where m.slug = 'divan';
