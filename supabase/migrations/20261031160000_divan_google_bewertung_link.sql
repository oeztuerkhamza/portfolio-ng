-- Divan: Knopf „Bewerten Sie uns" öffnet direkt die Google-Bewertungen des Hauses, nicht nur die Suche.
update public.menus
set data = data || jsonb_build_object('reviewUrl', 'https://www.google.com/search?q=Divan+Ocakba%C5%9F%C4%B1+Freiburg+Bewertungen#lrd=0x47911b61ef01964d:0xf75ae086be3f4c1e,3,,,,')
where slug = 'divan';
