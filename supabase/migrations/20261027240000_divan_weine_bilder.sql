-- Divan: Bild für die zwei Weinrubriken. Die Website des Hauses hat kein Weinfoto; es sind zwei freie
-- Fotos der Unsplash-Lizenz (kostenlos, ohne Namensnennung): unsplash.com/photos/_JpTjEFqFrI (Kerzentisch
-- mit Rotwein) und unsplash.com/photos/rYEUdOG2ves (Weißwein vor Weinbergen), zugeschnitten.
-- Ein im Portal eingetragenes Bild bleibt.
update public.menus m
set data = jsonb_set(m.data, '{categories}', (
  select jsonb_agg(case
    when c->>'title' = 'Türkische Weine' and not (c ? 'img') then c || jsonb_build_object('img', 'https://breisgau-digital.de/menu/divan/rubriken/weine-tuerkisch.jpg?v=1')
    when c->>'title' = 'Qualitätsweine aus Baden' and not (c ? 'img') then c || jsonb_build_object('img', 'https://breisgau-digital.de/menu/divan/rubriken/weine-baden.jpg?v=1')
    else c end order by co)
  from jsonb_array_elements(m.data->'categories') with ordinality as x(c, co)
))
where m.slug = 'divan';
