-- Divan: „Es gilt die aktuelle Karte im Haus." entfällt; der Hinweis steht für alle Sprachen nur einmal im Fußtext.
update public.menus
set data = data || jsonb_build_object('footnote', 'Zusatzstoffe erfragen Sie bitte beim Service.')
where slug = 'divan';
