-- Divan: Die Stockfotos (Wikimedia Commons, Flickr) kommen wieder heraus. Die Karte bekommt die
-- eigenen Fotos des Restaurants, bis dahin bleibt sie ohne Bilder. Entfernt nur Fotos unter
-- /menu/divan/ (also unsere Stockfotos), den Bildnachweis-Link und den Satz zu den Fotos in der
-- Fußnote; ein im Portal eingetragenes eigenes Foto bleibt.
update public.menus m
set data = jsonb_set(
  (m.data - 'creditsUrl')
    || jsonb_strip_nulls(jsonb_build_object('footnote',
         replace(m.data->>'footnote', E'\nDie Fotos sind Symbolbilder unter freier Lizenz (Wikimedia Commons und Flickr) und stammen nicht aus der Küche des Hauses.', ''))),
  '{categories}', coalesce((
    select jsonb_agg(jsonb_set(c, '{items}', (
      select coalesce(jsonb_agg(case when i->>'img' like 'https://breisgau-digital.de/menu/divan/%' then i - 'img' else i end order by io), '[]'::jsonb)
      from jsonb_array_elements(c->'items') with ordinality as y(i, io)
    )) order by co)
    from jsonb_array_elements(m.data->'categories') with ordinality as x(c, co)
  ), '[]'::jsonb))
where m.slug = 'divan';
