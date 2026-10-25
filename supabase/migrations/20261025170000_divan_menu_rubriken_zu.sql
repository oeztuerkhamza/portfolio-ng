-- Divan: Rubriken zugeklappt (sections = 'collapsed', siehe MenuData in src/server/menus.ts).
-- 24 Rubriken mit 199 Einträgen sind offen kaum zu überblicken; jetzt stehen nur die Titel da.
update public.menus set data = data || '{"sections":"collapsed"}'::jsonb where slug = 'divan';
