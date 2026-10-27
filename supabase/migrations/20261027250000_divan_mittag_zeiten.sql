-- Divan: Das Mittagsmenü steht nur von 11:30 bis 16:00 Uhr (Berliner Zeit) auf der Karte und trägt den
-- Zeitraum am Titel (Feld hours, siehe MenuCategory in src/server/menus.ts). Der Hinweis „Täglich ... Uhr"
-- im Rubriktext entfällt, in der Karte wie in den Übersetzungen (dort stand er nur auf der ersten Zeile).
update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(case when c->>'title' = 'Mittagsmenü' then (c - 'note') || '{"hours":"11:30-16:00"}'::jsonb else c end order by co)
  from jsonb_array_elements(m.data->'categories') with ordinality as x(c, co)
))
where m.slug = 'divan';

with titel(k, t) as (values
  ('en','# Lunch menu'),('tr','# Öğle menüsü'),('fr','# Menu du midi'),('ar','# قائمة الغداء'),('ru','# Обеденное меню'),
  ('es','# Menú del mediodía'),('it','# Menu di mezzogiorno'),('el','# Μενού μεσημεριού'),('fa','# منوی ظهر'),('hi','# दोपहर का मेनू'),
  ('zh','# 午间套餐'),('ko','# 점심 메뉴'),('ku','# Menûya nîvro'))
update public.menus m
set data = jsonb_set(m.data, '{translations}', (
  select jsonb_object_agg(e.k, coalesce(to_jsonb(ti.t || substr(e.v, length(split_part(e.v, chr(10), 1)) + 1)), to_jsonb(e.v)))
  from jsonb_each_text(m.data->'translations') as e(k, v)
  left join titel ti on ti.k = e.k
))
where m.slug = 'divan' and m.data ? 'translations';
