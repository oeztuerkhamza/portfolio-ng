-- Breisgau Digital — Wartungsmodus der Website
--
-- Ein Schalter im Portal, der die öffentliche Website vorübergehend mit
-- einer Wartungsseite antwortet. Gilt nicht für /admin, /api, /k und /r:
-- das Portal muss erreichbar bleiben, der Stripe-Webhook muss ankommen, und
-- die Seiten verkaufter NFC-Karten liegen bei Kunden auf dem Tisch.
--
-- Der Schalter wird von `middleware.ts` gelesen, nicht vom Express-Server —
-- die Seiten der Website sind vorgerendert und kommen aus Vercels Netz.
--
--   on      Wartung an oder aus
--   since   seit wann (nur zur Anzeige im Portal)
--   message eine Zeile, die der Besucher zusätzlich lesen soll
--   token   Kennwort, mit dem der Inhaber die Seite trotz Wartung ansieht.
--           Nach außen wird nur der SHA-256-Hashwert gegeben.
insert into public.settings (key, value)
values ('maintenance', '{"on": false, "since": null, "message": null, "token": null}')
on conflict (key) do nothing;
