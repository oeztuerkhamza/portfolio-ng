-- Divan: Zusatzstoffe je Gericht und Getränk, genau die Ziffern der gedruckten Karte (speisekarteDE 2026 Oktober.pdf).
-- 1 Farbstoff, 2 Konservierungsstoff, 3 Süßungsmittel, 4 Phosphat, 6 Geschmacksverstärker, 7 geschwärzt, 11 koffeinhaltig.
-- Gerichte ohne Ziffern auf der Karte bleiben ohne Angabe. Gerichte über die Nummer, Getränke über den Namen.
-- Der Fußtext „Zusatzstoffe erfragen …" entfällt; der Hinweis über der Liste nennt jetzt auch die Zusatzstoffe.
with codes(additives, keys) as (
  values
    ('konservierungsstoff', array['M8','M9','M11','M13','M14','47','52','53','54','55','57','58','59','61','63','84','85','86','87','88','162','95','97','135','136','137','138','139','140','121','151','152']),
    ('konservierungsstoff,geschmacksverstaerker', array['M1','M2','M10','M15','17','31','32','37','39','40','41','45','46','65','67','72','73','74','75','76','77','160','161','163','101','114','115','116','120','126','127','128','145','146','147']),
    ('geschmacksverstaerker', array['10','11','12']),
    ('konservierungsstoff,suessungsmittel', array['7','8','9','13','14','15','16','20','21','25','26','27','28','29','30','62','98']),
    ('konservierungsstoff,geschwaerzt', array['18']),
    ('konservierungsstoff,geschmacksverstaerker,geschwaerzt', array['19']),
    ('phosphat,geschmacksverstaerker', array['M12','64']),
    ('konservierungsstoff,phosphat,geschmacksverstaerker', array['M16','M17','M18','56','78','79','89','90','96','100','102','107','108','109','110','129','130']),
    ('konservierungsstoff,suessungsmittel,phosphat', array['99']),
    ('farbstoff', array['Bailys 4 cl']),
    ('farbstoff,suessungsmittel', array['Orangensaft','Traubensaft','Bananennektar','Fanta 0,3 l','Whisky 4 cl','Whisky Cola 4 cl','Asbach 4 cl','Piccolo 0,2 l']),
    ('farbstoff,geschmacksverstaerker', array['Bacardi 4 cl','Eistee 0,4 l']),
    ('farbstoff,suessungsmittel,geschmacksverstaerker', array['Campari Orange 4 cl','Fernet Branca 2 cl','Martini Bianco 5 cl','Sprite 0,4 l','Orangensaftschorle 0,4 l']),
    ('farbstoff,suessungsmittel,geschmacksverstaerker,koffein', array['Coca Cola 0,4 l','Mezzo Mix 0,4 l','Cola Light 0,3 l','Cola Zero 0,4 l'])
),
by_key as (
  select schluessel, to_jsonb(string_to_array(additives, ',')) as additives
  from codes, unnest(keys) as schluessel
)
update public.menus m
set data = (m.data - 'footnote')
  || jsonb_build_object('categories', (
       select jsonb_agg(
                jsonb_set(c, '{items}', (
                  select jsonb_agg(
                           case when b.additives is null then i else i || jsonb_build_object('additives', b.additives) end
                           order by ii)
                  from jsonb_array_elements(c->'items') with ordinality as it(i, ii)
                  left join by_key b on b.schluessel = coalesce(i->>'num', i->>'name')
                ))
                order by ci)
       from jsonb_array_elements(m.data->'categories') with ordinality as cs(c, ci)
     ))
where m.slug = 'divan';
