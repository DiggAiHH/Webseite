# SEO & Content Status (Single Source of Truth)

Ziel: Jede Seite hat **indexierbare Inhalte** (H1/H2, Fließtext, CTA, interne Links) und **vollständige SEO-Metadaten** (Title/Description/Canonical/OG/Twitter + JSON-LD). Jeder Schritt wird hier protokolliert – auch Fehlschläge.

## Scope

- Neue indexierbare Produkt-Detailseiten (Route pro Produkt)
- SEO maximaler Impact: konsistente Meta-Tags + per-Route JSON-LD
- Rechtstexte: Impressum mit echten Pflichtangaben (keine Platzhalter)

## Plan / Checkliste (laufend gepflegt)

- [x] P0: Produkt-Detailrouten + interne Links von Products
- [x] P0: SEO Routing-Coverage (keine Default-Fallbacks für echte Seiten)
- [x] P0: JSON-LD pro Route (WebPage + context-spezifisch)
- [x] P1: Content-Verbesserungen pro Top-Level-Seite
- [x] P0: Impressum: echte Pflichtdaten (ohne Erfindungen)
- [x] P1: OG/Logo Assets vorhanden (keine 404 in Meta)
- [x] P1: Tests: SEO-Routen + Head-Rendering + Produktdetail

## Change-Log

### 2026-01-05 — Initialisierung

- Aktion: Datei angelegt.
- Nächster Schritt: Routen/Pages prüfen und Produkt-Detailroute implementieren.

### 2026-01-05 — Produkt-Detailseiten + SEO Template (P0)

- Änderung: Neue Route `/products/:productId` für indexierbare Produktdetailseiten.
- Änderung: Produktkarten verlinken zusätzlich auf Detailseiten (ohne die bestehende Modal-UX zu brechen).
- Änderung: SEO erweitert um dynamische Produkt-SEO für `/products/<id>` inkl. JSON-LD `Product`.
- Änderung: `Seo` unterstützt JSON-LD und nutzt `og-image.svg` als Default.
- Änderung: `sitemap.xml` enthält Produkt-Detail-URLs.
- Änderung: Public Assets ergänzt: `/og-image.svg` und `/logo.svg`.

Verification:

- ✅ `npm run test:unit` (SEO-Routen inkl. Produktdetail + noindex basic)
- ✅ `npm run test:frontend:run` (Seo Head Rendering + JSON-LD)

### 2026-01-05 — Content-Verbesserungen Top-Level (P1)

- Änderung: Home/Produkte/Kontakt/Security/Privacy inhaltlich erweitert (mehr Fließtext, klarere H-Struktur, interne Links), ohne neue UX.
- Änderung: Datenschutzerklärung korrigiert (Consent lokal, aktuell keine Analytics-/Marketing-Cookies; Kontaktanfrage-Datenfluss beschrieben).

Verification:

- ✅ `npm run test:unit` (5/5)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Impressum: Pflichtdaten gesetzt (P0)

- Änderung: Impressum-Placeholders durch echte Anbieter-/Kontaktangaben ersetzt.
- Änderung: Anbieteradresse korrigiert (Jasminstraße, 44289 Dortmund).

Verification:

- ✅ `npm run test:unit` (5/5)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Reichweite & UX: FAQ + Schema (P1)

- Änderung: `FAQ`-Sektionen auf Home + Produkte ergänzt (on-page Content, keine neue UX-Flows).
- Änderung: JSON-LD erweitert:
	- `/products`: `ItemList` + `FAQPage` zusätzlich zur `CollectionPage`
	- `/products/:id`: `BreadcrumbList` zusätzlich zum `Product`
	- `/`: `FAQPage` zusätzlich zum `WebSite`

Verification:

- ✅ `npm run test:unit` (7/7)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Reichweite & UX: Produktdetail Link-Cluster + Use-Cases (P1)

- Änderung: Produktdetailseiten um „Einsatz in der Praxis“ (Use-Cases) ergänzt.
- Änderung: Interner Link-Cluster auf Produktdetailseiten (Kontakt/ROI/Produkte + Security/Privacy/Home) zur besseren Orientierung und stärkeren internen Verlinkung.

Verification:

- ✅ `npm run test:unit` (7/7)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — UX/Conversion: Produktdetail Fit + Kontakt Mini‑FAQ (P1)

- Änderung: Produktdetailseiten um 3 Bulletpoints ergänzt (Für wen / Voraussetzungen / Integrationen).
- Änderung: Kontaktseite um Mini‑FAQ ergänzt (Antwortzeit, Ablauf, was nicht senden).

Verification:

- ✅ `npm run test:unit` (7/7)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Reichweite & Performance: Organization JSON‑LD + Caching (P1)

- Änderung: Globales JSON‑LD für `Organization` + `ContactPoint` zentral in SEO integriert (auf allen Seiten verfügbar).
- Änderung: `index.html` Organization-Structured-Data auf echte Rechtsform/Adresse/Kontakt aktualisiert.
- Änderung: Nginx Cache-Header ergänzt für `robots.txt`, `sitemap.xml` und `/data/*` (z.B. `products.json`). HTML und `/api` bleiben `no-store`.

Verification:

- ✅ `npm run test:unit` (8/8)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — SEO Hygiene: index.html dedupliziert (P1)

- Änderung: Statische `robots`/JSON‑LD Einträge aus `index.html` entfernt, damit route-spezifische Helmet-SEO (inkl. `noindex` für Legal) die Single Source of Truth ist.

Verification:

- ✅ `npm run test:unit` (8/8)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Guardrails: CSP Report-Only + E2E SEO-Checks (P1)

- Änderung: CSP minimal gehärtet (zusätzlich `object-src 'none'`).
- Änderung: Strengere CSP zusätzlich als `Content-Security-Policy-Report-Only` ausgerollt, um Violations sichtbar zu machen (ohne Breakage).
- Änderung: Playwright E2E erweitert:
	- Legal-Seiten prüfen `meta[name="robots"]` auf `noindex,follow`
	- Kernrouten prüfen Presence/Parsebarkeit von JSON‑LD (`application/ld+json`)

Verification:

- ✅ `npm run test:unit` (8/8)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (8/8)

Optional / Infra:

- ✅ `npm run test:infra` (infra-smoke: OK) — CSP/Report-Only Header werden in der Nginx/Docker-Kette geprüft
