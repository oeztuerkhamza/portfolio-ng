-- Speisekarten auch auf Urdu (MENU_LANGS in src/server/menus.ts).
alter table public.menus drop constraint if exists menus_lang_check;
alter table public.menus add constraint menus_lang_check
  check (lang in ('de', 'en', 'fr', 'tr', 'es', 'it', 'el', 'ar', 'fa', 'ur', 'hi', 'ru', 'zh', 'ko', 'ku'));
