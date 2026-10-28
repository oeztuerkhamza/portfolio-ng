-- Divan: Auf der Seite steht nur der Knopf „Schritt für Schritt wählen" (plus Instagram und Google);
-- die ganze Liste gibt es nicht mehr (stepsOnly, siehe MenuData in src/server/menus.ts).
update public.menus set data = data || '{"stepsOnly": true}'::jsonb where slug = 'divan';
