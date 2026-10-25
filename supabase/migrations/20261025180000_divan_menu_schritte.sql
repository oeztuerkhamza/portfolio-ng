-- Divan: Schritt-für-Schritt-Auswahl (steps, siehe MenuData in src/server/menus.ts).
-- Rubriken 1-2 Vorspeisen und Salate, 3-15 Hauptgerichte bis Kinderteller, 16 Dessert, 17-24 Getränke.
update public.menus set data = data || '{"steps":"start:1-2; main:3-15; dessert:16; drinks:17-24"}'::jsonb where slug = 'divan';
