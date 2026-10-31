-- Divan: nur noch die ganze Karte; /m/divan zeigt dasselbe wie /m/divan/karte, ohne Assistent.
-- Die Daten des Assistenten (steps, welcome) bleiben stehen: steps sagt auch, welche Rubriken Getränke sind.
update public.menus
set data = data || '{"fullOnly": true}'::jsonb
where slug = 'divan';
