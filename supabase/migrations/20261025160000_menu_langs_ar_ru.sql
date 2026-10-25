-- Speisekarten auch auf Arabisch und Russisch (MENU_LANGS in src/server/menus.ts). Die NFC-Karten
-- behalten ihre Sprachen; hier geht es nur um die Hauptsprache einer Karte.
alter table public.menus drop constraint if exists menus_lang_check;
alter table public.menus add constraint menus_lang_check
  check (lang in ('de', 'en', 'fr', 'tr', 'ar', 'ru', 'ku'));
