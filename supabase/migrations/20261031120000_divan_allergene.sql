-- Divan: Allergene je Gericht, genau die Buchstaben der gedruckten Karte (speisekarteDE 2026 Oktober.pdf).
-- a Gluten, c Ei, g Milch, h Schalenfrüchte. Gerichte ohne Buchstaben auf der Karte bleiben ohne Angabe (unbekannt),
-- nicht „keine". Die Karte ist nicht überall vollständig (z. B. Baklava mit Haselnüssen ohne h), deshalb kein Filter
-- „ohne …" (allergenFilter: false), dafür ein Hinweis über der Liste. Der Footer-Hinweis nennt nur noch die Zusatzstoffe.
-- Vor dieser Migration muss der Code mit `allergenFilter` veröffentlicht sein, sonst erscheint der Filter.
with codes(allergens, nums) as (
  values
    ('milch', 'M1,M2,M8,M14,7,8,9,10,11,12,17,18,19,26,31,139,115,116,120,121,126,127,128,129,95,96,98,152,145,147'),
    ('gluten', '41,140'),
    ('eier,milch', '99'),
    ('gluten,milch', 'M16,M17,M18,14,15,16,25,27,107,108,109,110,37,40,97,57'),
    ('gluten,eier,milch', 'M9,M10,39,100,101,102,72,73,74,75,76,77,78,79,52,53,54,55,56,58,59,160,161,162,146'),
    ('gluten,schalenfruechte', '149')
),
by_num as (
  select num, to_jsonb(string_to_array(allergens, ',')) as allergens
  from codes, unnest(string_to_array(nums, ',')) as num
)
update public.menus m
set data = m.data
  || jsonb_build_object(
       'allergenFilter', false,
       'footnote', E'Es gilt die aktuelle Karte im Haus.\nZusatzstoffe erfragen Sie bitte beim Service.',
       'categories', (
         select jsonb_agg(
                  jsonb_set(c, '{items}', (
                    select jsonb_agg(
                             case when b.allergens is null then i else i || jsonb_build_object('allergens', b.allergens) end
                             order by ii)
                    from jsonb_array_elements(c->'items') with ordinality as it(i, ii)
                    left join by_num b on b.num = i->>'num'
                  ))
                  order by ci)
         from jsonb_array_elements(m.data->'categories') with ordinality as cs(c, ci)
       ))
where m.slug = 'divan';
