-- Divan: Getränke nach Art getrennt (Assistent: alkoholfrei / Bier / Wein / Aperitif & Spirituosen).
--  * Die Rubrik „Alkoholfreie Getränke" heißt jetzt „Softdrinks & Wasser", damit sie im Schritt
--    „Alkoholfreie Getränke" nicht noch einmal denselben Namen trägt.
--  * „Bier vom Fass" und „Flaschenbiere" sind eine Rubrik „Bier".
-- Die Übersetzungen hängen an der Reihenfolge der Rubriken: Rubrik 19 (alkoholfrei) bekommt den neuen Titel,
-- Rubrik 21 (Bier vom Fass) den Titel „Bier", die Titelzeile von Rubrik 22 (Flaschenbiere) entfällt.
with titel(k, soft, bier) as (values
  ('en','Soft drinks & water','Beer'),('tr','Meşrubat ve su','Bira'),('fr','Softs et eau','Bière'),('ar','مشروبات غازية ومياه','بيرة'),
  ('ru','Прохладительные напитки и вода','Пиво'),('es','Refrescos y agua','Cerveza'),('it','Bibite e acqua','Birra'),
  ('el','Αναψυκτικά και νερό','Μπίρα'),('fa','نوشابه و آب','آبجو'),('hi','सॉफ़्ट ड्रिंक और पानी','बीयर'),
  ('zh','汽水与水','啤酒'),('ko','청량음료 & 물','맥주'),('ku','Vexwarinên şirîn û av','Bîra')),
zeilen as (
  select e.k, l.ord, l.line, sum((l.line ~ '^#')::int) over (partition by e.k order by l.ord) hdr
  from public.menus m, jsonb_each_text(m.data->'translations') as e(k, v), regexp_split_to_table(e.v, E'\n') with ordinality as l(line, ord)
  where m.slug = 'divan'),
neu as (
  select z.k, string_agg(case when z.line ~ '^#' and z.hdr = 19 then '# ' || t.soft when z.line ~ '^#' and z.hdr = 21 then '# ' || t.bier else z.line end, E'\n' order by z.ord) txt
  from zeilen z join titel t on t.k = z.k
  where not (z.line ~ '^#' and z.hdr = 22)
  group by z.k)
update public.menus m
set data = jsonb_set(m.data, '{translations}', (select jsonb_object_agg(k, txt) from neu))
where m.slug = 'divan';

update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(case
      when c->>'title' = 'Alkoholfreie Getränke' then jsonb_set(c, '{title}', '"Softdrinks & Wasser"')
      when c->>'title' = 'Bier vom Fass' then jsonb_set(jsonb_set(c, '{title}', '"Bier"'), '{items}',
        (c->'items') || (select f->'items' from jsonb_array_elements(m.data->'categories') f where f->>'title' = 'Flaschenbiere'))
      else c end order by co)
  from jsonb_array_elements(m.data->'categories') with ordinality as x(c, co)
  where c->>'title' <> 'Flaschenbiere'
))
where m.slug = 'divan';

update public.menus
set data = data || '{"steps": "start:2; salad:3; main:1,4-16; dessert:17; soft:18-20; beer:21; wine:22-23; spirits:24-25"}'::jsonb
where slug = 'divan';
