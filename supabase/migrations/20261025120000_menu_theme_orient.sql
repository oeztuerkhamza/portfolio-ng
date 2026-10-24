-- Speisekarten bekommen ein eigenes Theme „orient" (Smaragd und Gold, siehe
-- MENU_THEMES in src/server/menus.ts). Die NFC-Karten behalten ihre drei.
alter table public.menus drop constraint if exists menus_theme_check;
alter table public.menus add constraint menus_theme_check
  check (theme in ('brand', 'dark', 'warm', 'orient'));
