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

### 2026-01-24 — Testlauf #11 (i18n + ESLint Cleanup)

- Kontext: ESLint-Fehler behoben (7 Errors → 0), i18n-Translations erweitert (DE/EN/AR), SMTP Env-Vars standardisiert (MAIL_TO=laith.alshdaifat@hotmail.com)
- Agent: Cleanup-Agent Session

Geänderte Dateien:
- `src/components/ErrorBoundary.jsx` — process.env → import.meta.env.DEV
- `src/components/PrivacyBanner.jsx` — unused imports entfernt, Hooks-Reihenfolge korrigiert, i18n integriert
- `src/features/avatar/AvatarFeature.jsx` — while(true) → while(!done)
- `src/layouts/MainLayout.jsx` — i18n für Footer-Texte
- `src/pages/ContactPage.jsx` — i18n integriert
- `src/pages/ImpressumPage.jsx` — i18n integriert
- `public/locales/de/translation.json` — vollständig erweitert
- `public/locales/en/translation.json` — vollständig erweitert
- `public/locales/ar/translation.json` — vollständig erweitert
- `README.md`, `.env.example`, `docker-compose.infra.yml` — MAIL_TO aktualisiert

Ergebnis (pending - Terminal-Provider nicht verfügbar):
- ⏳ `npm run lint` — 0 Errors erwartet (via get_errors verifiziert)
- ⏳ `npm run test:frontend:run` — ausstehend
- ⏳ `npm run test:e2e` — ausstehend

### 2026-01-24 — Testlauf #12 (Deployment Implementation)

- Kontext: i18n Test-Setup hinzugefügt, Translation-Files erweitert (wizard/security/seo Keys)
- Agent: Deployment-Implementation-Agent

Geänderte Dateien:
- `src/test/setup.js` — i18n Initialization mit initImmediate: false
- `src/components/LeadForm.vitest.jsx` — I18nextProvider Wrapper
- `public/locales/de/translation.json` — wizard, security, seo Keys
- `public/locales/en/translation.json` — wizard, security, seo Keys
- `public/locales/ar/translation.json` — wizard, security, seo Keys
- `buildLogs/2026-01-24_deployment-implementation.log` — Evidence-Log
- `LAUFBAHN.md` — Phase J dokumentiert

Blocker:
- Terminal-Provider nicht verfügbar (ENOPRO Error in Codespace)
- Git/Netlify Befehle müssen manuell ausgeführt werden

Ergebnis:
- ✅ `get_errors` — 0 Errors auf alle geänderten Dateien
- ⏳ `npm run test:frontend:run` — manuell auszuführen
- ⏳ `npm run test:e2e` — manuell auszuführen

## Nächste Schritte (USER ACTION REQUIRED)

```bash
# 1. Git Commit & Push
git add -A && git commit -m "feat: i18n test setup + deployment prep" && git push origin main

# 2. Netlify CLI Setup
npm install -g netlify-cli
export NETLIFY_AUTH_TOKEN="nfp_9i8GZaHsoVKnoKXwahYdyojwLSqbT7pi89e9"
netlify link
netlify deploy --prod
```
