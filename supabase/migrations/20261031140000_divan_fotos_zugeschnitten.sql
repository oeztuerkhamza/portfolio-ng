-- Divan: Gerichtfotos neu zugeschnitten (4:3, das Gericht in der Mitte), neue Fassung ?v=2.
update public.menus
set data = replace(data::text, '.jpg?v=1', '.jpg?v=2')::jsonb
where slug = 'divan';
