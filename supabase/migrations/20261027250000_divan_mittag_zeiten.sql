-- Divan: Das Mittagsmenü steht nur von 11:30 bis 16:00 Uhr (Berliner Zeit) auf der Karte und trägt den
-- Zeitraum am Titel (Feld hours, siehe MenuCategory in src/server/menus.ts). Der Hinweis „Täglich ... Uhr"
-- im Rubriktext entfällt, in der Karte wie in den Übersetzungen (dort stand er nur auf der ersten Zeile).
update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(case when c->>'title' = 'Mittagsmenü' then (c - 'note') || '{"hours":"11:30-16:00"}'::jsonb else c end order by co)
  from jsonb_array_elements(m.data->'categories') with ordinality as x(c, co)
))
where m.slug = 'divan';

update public.menus m
set data = jsonb_set(m.data, '{translations}', (
  select jsonb_object_agg(k, regexp_replace(v, '^(#[^|]*?)\s*\|[^\n]*', '\1'))
  from jsonb_each_text(m.data->'translations') as t(k, v)
))
where m.slug = 'divan' and m.data ? 'translations';
