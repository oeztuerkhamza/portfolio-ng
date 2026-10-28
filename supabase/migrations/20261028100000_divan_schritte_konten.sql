-- Divan: Assistent mit eigenem Schritt für Salate und mit Wahl „alkoholfrei / alkoholisch" vor den Getränken
-- (Rubriken: 1 Mittagsmenü, 2 Vorspeisen, 3 Salate, 4-16 Hauptgerichte, 17 Dessert, 18-20 alkoholfrei,
-- 21-26 mit Alkohol), dazu Instagram-Konto des Hauses und der Link zur Google-Bewertung.
-- Der Bewertungslink ist eine Google-Suche nach dem Haus; wer die Place-ID kennt, trägt im Portal besser
-- https://search.google.com/local/writereview?placeid=... ein.
update public.menus
set data = data || jsonb_build_object(
  'steps', 'start:2; salad:3; main:1,4-16; dessert:17; soft:18-20; alc:21-26',
  'instagramUrl', 'https://www.instagram.com/divanfreiburg/',
  'reviewUrl', 'https://www.google.com/search?q=Divan+Ocakba%C5%9F%C4%B1+Freiburg+Bewertungen')
where slug = 'divan';
