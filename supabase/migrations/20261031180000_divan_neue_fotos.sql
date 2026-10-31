-- Divan: weitere eigene Fotos des Hauses, je Gericht über die Nummer (Getränke über den Namen), dazu zwei Rubrikbilder.
with fotos(schluessel, img) as (
  values
    ('73', 'https://breisgau-digital.de/menu/divan/gerichte/boerek-spinat.jpg?v=3'),
    ('M17', 'https://breisgau-digital.de/menu/divan/gerichte/boerek-spinat.jpg?v=3'),
    ('77', 'https://breisgau-digital.de/menu/divan/gerichte/boerek-kiymali-ispanak.jpg?v=3'),
    ('102', 'https://breisgau-digital.de/menu/divan/gerichte/pide-doener.jpg?v=3'),
    ('107', 'https://breisgau-digital.de/menu/divan/gerichte/iskender.jpg?v=3'),
    ('114', 'https://breisgau-digital.de/menu/divan/gerichte/koefte-pilav.jpg?v=3'),
    ('122', 'https://breisgau-digital.de/menu/divan/gerichte/tavuk-izgara.jpg?v=3'),
    ('128', 'https://breisgau-digital.de/menu/divan/gerichte/adana-sis.jpg?v=3'),
    ('149', 'https://breisgau-digital.de/menu/divan/gerichte/kuenefe.jpg?v=3'),
    ('Schwarztee', 'https://breisgau-digital.de/menu/divan/gerichte/schwarztee.jpg?v=3'),
    ('Türkischer Apfeltee', 'https://breisgau-digital.de/menu/divan/gerichte/apfeltee.jpg?v=3'),
    ('Türkischer Mokka', 'https://breisgau-digital.de/menu/divan/gerichte/mokka.jpg?v=3')
),
rubriken(title, img) as (
  values
    ('Aperitif', 'https://breisgau-digital.de/menu/divan/rubriken/aperitif.jpg?v=3'),
    ('Softdrinks & Wasser', 'https://breisgau-digital.de/menu/divan/rubriken/alkoholfrei.jpg?v=3')
)
update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(
           jsonb_set(
             case when r.img is null then c else c || jsonb_build_object('img', r.img) end,
             '{items}',
             (select jsonb_agg(
                       case when f.img is null then i else i || jsonb_build_object('img', f.img) end
                       order by ii)
              from jsonb_array_elements(c->'items') with ordinality as it(i, ii)
              left join fotos f on f.schluessel = coalesce(i->>'num', i->>'name'))
           )
           order by ci)
  from jsonb_array_elements(m.data->'categories') with ordinality as cs(c, ci)
  left join rubriken r on r.title = c->>'title'
))
where m.slug = 'divan';
