-- Breisgau Digital — Rechnungen
--
-- Entwürfe haben noch keine Nummer und dürfen gelöscht werden. Beim
-- Festschreiben bekommt die Rechnung die nächste fortlaufende Nummer
-- (RE-JJJJ-0001) und ist danach unveränderbar (GoBD). Korrekturen laufen
-- über eine Stornorechnung.

create table if not exists public.invoices (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  number             text unique check (number ~ '^(RE|ST)-[0-9]{4}-[0-9]{4,}$'),
  status             text not null default 'entwurf'
                     check (status in ('entwurf', 'offen', 'bezahlt', 'storniert')),
  kind               text not null default 'rechnung' check (kind in ('rechnung', 'storno')),
  cancels_id         uuid references public.invoices (id) on delete restrict,
  customer_id        uuid references public.customers (id) on delete set null,
  -- Empfänger als Kopie: die Rechnung ändert sich nicht, wenn der Kunde bearbeitet wird.
  recipient_name     text not null default '' check (length(recipient_name) <= 200),
  recipient_business text check (length(recipient_business) <= 200),
  recipient_street   text check (length(recipient_street) <= 200),
  recipient_city     text check (length(recipient_city) <= 120),
  recipient_email    text check (length(recipient_email) <= 200),
  issue_date         date not null default current_date,
  service_period     text check (length(service_period) <= 120),
  due_days           integer not null default 14 check (due_days between 0 and 120),
  -- [{ "description": "…", "qty": 1, "unit": "Stk.", "unit_price": 39 }]
  items              jsonb not null default '[]',
  vat_rate           numeric(4, 2) not null default 0 check (vat_rate in (0, 7, 19)),
  small_business     boolean not null default true,
  intro              text check (length(intro) <= 2000),
  notes              text check (length(notes) <= 2000),
  -- Vom Server berechnet
  net_total          numeric(10, 2) not null default 0,
  vat_total          numeric(10, 2) not null default 0,
  gross_total        numeric(10, 2) not null default 0,
  -- Absenderdaten zum Zeitpunkt des Festschreibens
  sender             jsonb,
  finalized_at       timestamptz,
  paid_at            date
);
create index if not exists invoices_issue_idx on public.invoices (issue_date desc, created_at desc);
create index if not exists invoices_customer_idx on public.invoices (customer_id);

drop trigger if exists touch_invoices on public.invoices;
create trigger touch_invoices before update on public.invoices
  for each row execute function public.touch_updated_at();

alter table public.invoices enable row level security;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on public.invoices from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on public.invoices from authenticated;
  end if;
end $$;

-- Absender, Steuernummer und Bankverbindung für den Rechnungskopf/-fuß.
insert into public.settings (key, value) values ('invoice_profile', '{
  "company": "Breisgau Digital",
  "owner": "Hamza Öztürk",
  "street": "Bissierstr. 16",
  "city": "79114 Freiburg im Breisgau",
  "phone": "+49 155 66859378",
  "email": "hamza.oeztuerk@web.de",
  "web": "breisgau-digital.de",
  "tax_number": "",
  "vat_id": "",
  "bank": "",
  "iban": "",
  "bic": "",
  "small_business": true,
  "due_days": 14,
  "intro": "vielen Dank für Ihren Auftrag. Hiermit stelle ich Ihnen folgende Leistungen in Rechnung:",
  "closing": "Mit freundlichen Grüßen"
}')
on conflict (key) do nothing;
