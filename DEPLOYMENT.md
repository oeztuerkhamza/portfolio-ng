# Deployment & SEO-Checkliste

Diese App nutzt jetzt **Angular SSR** (`outputMode: server`). Der Build erzeugt:

```
dist/portfolio-ng/
  browser/   → statische, vorgerenderte HTML-Seiten + Assets (sitemap.xml, robots.txt)
  server/    → server.mjs (Node-SSR-Server für Live-Rendering)
```

> ⚠️ **GitHub Pages kann SSR NICHT ausführen** (nur statisch). Für Server-Side
> Rendering muss die Seite auf einem Node-fähigen Host laufen. Die Domain
> `hamzaoeztuerk.de` muss dann auf den neuen Host zeigen.

---

## Variante A — Vercel (empfohlen, kostenlos, am einfachsten)

Vercel erkennt Angular-SSR automatisch.

```bash
npm i -g vercel
cd portfolio-ng
vercel            # einmalig einrichten
vercel --prod     # produktiv deployen
```

Danach in Vercel → Project → **Settings → Domains** die Domain
`hamzaoeztuerk.de` hinzufügen und den DNS-Eintrag laut Anleitung setzen
(A-Record / CNAME auf Vercel).

## Variante B — Beliebiger Node-Host (Render, Railway, Fly.io, Azure App Service)

```bash
npm run build
# Startbefehl auf dem Host:
node dist/portfolio-ng/server/server.mjs   # nutzt $PORT (Default 4000)
```

## Variante C — Docker

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/portfolio-ng/server/server.mjs"]
```

---

## Nach dem ersten Deploy — SEO scharf schalten

1. **Google Search Console** (https://search.google.com/search-console)
   - Property `https://hamzaoeztuerk.de` hinzufügen & per DNS verifizieren.
   - Sitemap einreichen: `https://hamzaoeztuerk.de/sitemap.xml`
2. **Google Business Profil** anlegen (Webentwickler, Freiburg) — stärkster Hebel
   für lokale Sichtbarkeit. Adresse identisch zur Footer-/Schema-Adresse halten
   (NAP-Konsistenz!): *Bissierstr. 16, 79114 Freiburg*.
3. **Rich Results Test**: https://search.google.com/test/rich-results
   → URL prüfen; `Person`, `ProfessionalService`, `BreadcrumbList`, `FAQPage`
   sollten erkannt werden.
4. **PageSpeed Insights**: https://pagespeed.web.dev — Core Web Vitals prüfen.
5. Einträge in lokalen Verzeichnissen (gleiche NAP-Daten): Gelbe Seiten,
   11880, Cylex, meinestadt.de, freiburg-spezifische Branchenbücher.

## Noch offen / nächste Schritte

- **Mehrsprachigkeit (EN/TR):** Infrastruktur (locale-fähiger `SeoService`)
  ist vorbereitet. Sobald die Übersetzungen stehen, in
  `SeoService.LIVE_LOCALES` `'en'`/`'tr'` ergänzen und die hreflang-Alternates
  in `setHreflang()` wieder aktivieren.
- **OG-Bild:** Aktuell `profile.jpg`. Für schönere Social-Cards ein
  1200×630-PNG unter `assets/images/og-cover.png` ablegen und
  `SeoService.DEFAULT_IMAGE` darauf zeigen lassen.
- **Live-Demo-Iframes:** Eigene .NET-Seiten (Bikehaus, Benlirad) senden ggf.
  `X-Frame-Options`/`CSP frame-ancestors`. Damit die Demo *im* Portfolio lädt,
  auf diesen Servern `frame-ancestors https://hamzaoeztuerk.de` erlauben.
  Sonst greift automatisch der Poster-Fallback mit „in neuem Tab öffnen".
