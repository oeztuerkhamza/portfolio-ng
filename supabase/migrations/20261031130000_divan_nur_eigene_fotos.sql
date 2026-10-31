-- Divan: nur noch die eigenen Aufnahmen des Hauses. Die Gerichtfotos stammen schon daraus und bleiben.
-- 14 Rubrikbilder sind neu aus diesen Aufnahmen zugeschnitten (?v=2); Rubriken ohne passendes Foto
-- (Salate, Beilagen, Kinder, alle Getränke außer Heiße Getränke) haben kein Bild mehr.
update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(
           case
             when substring(c->>'img' from '/rubriken/([a-z-]+)\.jpg') in
                  ('vorspeisen', 'orient', 'grill', 'doener', 'auflaeufe', 'pfanne', 'sac', 'pide', 'pizza', 'boerek', 'pogaca', 'nudeln', 'dessert', 'heiss')
               then jsonb_set(c, '{img}', to_jsonb(replace(c->>'img', '?v=1', '?v=2')))
             else c - 'img'
           end
           order by ci)
  from jsonb_array_elements(m.data->'categories') with ordinality as cs(c, ci)
))
where m.slug = 'divan';
