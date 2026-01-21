# Build & Test Status (Single Source of Truth)

Ziel: Reproduzierbar **grün** werden (Unit + Frontend + Server + E2E). Jeder Versuch wird hier protokolliert – auch Fehlschläge.

## Soll-Zustand (Definition „grün“)

- `npm run test:unit` ✅
- `npm run test:frontend:run` ✅
- `npm run test:server` ✅
- `npm run test:e2e` ✅ (ohne manuelle Vorarbeiten wie „erst build“)
- `npm run test:infra` ✅ (nur wenn Docker verfügbar/erlaubt)

## Aktueller Plan (laufend gepflegt)

- [x] **P0:** Node-Version im Repo vereinheitlichen (Root + Doku) auf **>= 20**
- [x] **P0:** Playwright so konfigurieren, dass E2E nicht an „preview ohne build“ scheitert
- [x] **P1:** Tests in fester Reihenfolge ausführen, Blocker beheben
- [x] **P2:** Infra-Smoke nur dort ausführen, wo Docker garantiert ist

## Preconditions / Umgebung

- Node: (wird im Log pro Run notiert)
- npm: (wird im Log pro Run notiert)
- Optional: Docker für `npm run test:infra`

## Known Blockers / Hypothesen

1) **Node-Version-Mismatch**: Server erwartet Node >= 20 (u.a. für `fetch`-Mocks).
2) **E2E Start**: `vite preview` benötigt `dist/` → wenn E2E Preview ohne Build startet, scheitert Playwright.

## Change-Log / Runs

### 2026-01-05 — Initialisierung

- Aktion: Diese Datei angelegt, um alle Schritte dauerhaft zu protokollieren.
- Nächster Schritt: Root `package.json` + README Node-Version und Playwright E2E-Command fixen.

### 2026-01-05 — Node-Version vereinheitlicht (P0)

- Änderung: Root `package.json` setzt jetzt `engines.node` auf `>=20`.
- Änderung: README Voraussetzungen auf Node.js 20+ angehoben.
- Erwarteter Effekt: Server-Tests laufen konsistent (Node >=20 ist bereits im `server/package.json` gefordert).

### 2026-01-05 — Playwright E2E Start stabilisiert (P0)

- Änderung: `playwright.config.js` startet jetzt `npm run build && npm run preview ...`.
- Erwarteter Effekt: E2E scheitert nicht mehr an fehlendem `dist/` nach frischem Checkout.

### 2026-01-05 — Testlauf #1 (Start)

- Umgebung: Node v24.11.1, npm 11.6.2
- Reihenfolge: `test:unit` → `test:frontend:run` → `test:server` → `test:e2e`

Ergebnis:

- ✅ `npm run test:unit` (3/3)
- ✅ `npm run test:frontend:run` (21/21)
- ✅ `npm run test:server` (12/12)
- ✅ `npm run test:e2e` (6/6)

Optional / Infra:

- Docker verfügbar (Client/Server OK)
- ✅ `npm run test:infra` (infra-smoke: OK)

### 2026-01-05 — Testlauf #2 (nach Content/Privacy-Updates)

- Kontext: Content-Verbesserungen auf mehreren Seiten + Korrekturen in der Datenschutzerklärung.

Ergebnis:

- ✅ `npm run test:unit` (5/5)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Testlauf #3 (nach Impressum/DSGVO-Updates)

- Kontext: Impressum-Pflichtdaten gesetzt + DSGVO-Doku (Verantwortlicher) nachgezogen.

Ergebnis:

- ✅ `npm run test:unit` (5/5)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Testlauf #4 (Adresskorrektur)

- Kontext: Anbieteradresse (Impressum + DSGVO-Doku) korrigiert.

Ergebnis:

- ✅ `npm run test:unit` (5/5)

### 2026-01-05 — Testlauf #5 (FAQ + JSON-LD Schema)

- Kontext: FAQ-Sektionen ergänzt + Schema.org JSON-LD erweitert (ItemList/Breadcrumb/FAQPage).

Ergebnis:

- ✅ `npm run test:unit` (7/7)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Testlauf #6 (Produktdetail UX + interne Links)

- Kontext: Produktdetailseiten um Use-Cases + Link-Cluster erweitert.

Ergebnis:

- ✅ `npm run test:unit` (7/7)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Testlauf #7 (Produktdetail Fit + Kontakt Mini‑FAQ)

- Kontext: Produktdetailseiten um „Für wen/Voraussetzungen/Integrationen“ ergänzt + Kontakt Mini‑FAQ.

Ergebnis:

- ✅ `npm run test:unit` (7/7)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Testlauf #8 (Organization JSON‑LD + Cache-Header)

- Kontext: Globales Organization/ContactPoint JSON‑LD + Caching für robots/sitemap/data.

Ergebnis:

- ✅ `npm run test:unit` (8/8)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Testlauf #9 (index.html SEO dedupe)

- Kontext: `index.html` von statischen robots/JSON‑LD Duplikaten bereinigt.

Ergebnis:

- ✅ `npm run test:unit` (8/8)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (6/6)

### 2026-01-05 — Testlauf #10 (CSP Report-Only + E2E SEO-Guards)

- Kontext: CSP um `object-src 'none'` ergänzt + strengere CSP als `Report-Only` ausgerollt.
- Kontext: Playwright E2E um `noindex,follow`-Checks (Legal) + JSON‑LD Presence erweitert.

Ergebnis:

- ✅ `npm run test:unit` (8/8)
- ✅ `npm run test:frontend:run` (22/22)
- ✅ `npm run test:e2e` (8/8)

Optional / Infra:

- Docker verfügbar
- ✅ `npm run test:infra` (infra-smoke: OK) — inkl. CSP + CSP-Report-Only Header-Guards
