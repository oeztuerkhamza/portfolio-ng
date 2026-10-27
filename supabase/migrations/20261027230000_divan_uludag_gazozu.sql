-- Divan: Uludağ Gazozu (0,3 l, 4,50 €) bei den alkoholfreien Getränken. Steht am Ende der Rubrik,
-- damit die positionsgebundenen Übersetzungen nicht verrutschen; der Name gilt in allen Sprachen.
update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(case when c->>'title' = 'Alkoholfreie Getränke' and not exists (select 1 from jsonb_array_elements(c->'items') i where i->>'name' = 'Uludağ Gazozu 0,3 l')
    then jsonb_set(c, '{items}', (c->'items') || jsonb_build_array(jsonb_build_object('name', 'Uludağ Gazozu 0,3 l', 'price', '4,50')))
    else c end order by co)
  from jsonb_array_elements(m.data->'categories') with ordinality as x(c, co)
))
where m.slug = 'divan';
