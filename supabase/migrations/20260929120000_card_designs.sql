-- ── Vom Kunden gestaltete Karten ─────────────────────────────
-- Bisher entstand aus einer bezahlten Kartenbestellung ein leerer Entwurf,
-- und der Inhalt kam später per E-Mail hinterher. Mit dem Kartengestalter
-- (/karte-gestalten) füllt der Kunde die Karte schon vor dem Bezahlen und
-- sieht dabei die Vorschau. Was er eingegeben hat, fährt in dieser Spalte
-- mit der Bestellung mit, bis der Webhook daraus die Entwürfe anlegt.
--
-- Eine Zeile je Art: {"business": {…}, "gift": {…}}. Drei bestellte
-- Visitenkarten teilen sich denselben Entwurf — drei Karten desselben
-- Betriebs sind der Normalfall, verschiedene macht man danach im Portal.
--
-- Geprüft wird der Inhalt im Server (cardDesigns in src/server/cards.ts),
-- nicht in der Datenbank — wie bei `cards.data` auch, damit ein neues Feld
-- ohne Migration dazukommen kann.
alter table public.orders add column if not exists card_designs jsonb;

comment on column public.orders.card_designs is
  'Vom Kunden im Gestalter gefüllte Kartenentwürfe, je Art einer. Quelle für draftCards().';
