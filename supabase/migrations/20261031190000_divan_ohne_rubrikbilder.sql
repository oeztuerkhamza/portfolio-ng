-- Divan: keine Bilder mehr über den Rubriken; die Fotos bei den Gerichten bleiben.
update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(c - 'img' order by ci)
  from jsonb_array_elements(m.data->'categories') with ordinality as cs(c, ci)
))
where m.slug = 'divan';
