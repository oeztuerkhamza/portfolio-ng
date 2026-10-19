-- Anfrage-Assistent: die Pakete der Homepage-Updates und der Wartung dürfen
-- als `plan` in `enquiries` stehen. Vorher erlaubte die Prüfung nur die
-- Kennungen des früheren Digital-Abos; ein Insert mit „pflege" schlug fehl.
alter table public.enquiries drop constraint if exists enquiries_plan_check;
alter table public.enquiries
  add constraint enquiries_plan_check
  check (plan is null or plan in ('basis', 'business', 'premium', 'start', 'standard', 'komplett', 'pflege', 'plus'));
