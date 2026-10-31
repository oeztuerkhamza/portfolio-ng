-- Divan: 18 Karisik Meze Kücük bekommt den einzelnen Teller, 19 Karisik Meze Büyük das bisherige Meze-Foto;
-- 116 Peynirli Sarimsakli Köfte hat kein Foto mehr.
update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(
           jsonb_set(c, '{items}', (
             select jsonb_agg(
                      case i->>'num'
                        when '18' then i || '{"img": "https://breisgau-digital.de/menu/divan/gerichte/meze-kuecuek.jpg?v=3"}'::jsonb
                        when '19' then i || '{"img": "https://breisgau-digital.de/menu/divan/gerichte/meze.jpg?v=2"}'::jsonb
                        when '116' then i - 'img'
                        else i
                      end
                      order by ii)
             from jsonb_array_elements(c->'items') with ordinality as it(i, ii)
           ))
           order by ci)
  from jsonb_array_elements(m.data->'categories') with ordinality as cs(c, ci)
))
where m.slug = 'divan';
