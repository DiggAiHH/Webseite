# DiggAiHH MedTech SaaS Platform

## 🏥 Übersicht

DiggAiHH ist eine moderne MedTech SaaS-Plattform für intelligente Prozessoptimierung im Gesundheitswesen. Die Anwendung bietet fünf Hauptfeatures:

- **Lageroptimierung mit MHD-Tracking**: Intelligente Bestandsverwaltung mit automatischer Ablaufdatum-Überwachung, Chargenverfolgung und MDR-konformer Dokumentation
- **ROI-Rechner mit Arbeitszeit-Analyse**: Präzise Kosten-Nutzen-Analysen mit Fokus auf Produktivitätssteigerung durch Automatisierung redundanter Arbeitszeiten
- **Praxis-Twin (Gamification)**: Spielerisches Aufbau-System für die digitale Praxis mit Drag-and-Drop-Modulen und Level-Progression
- **Assistenzmodus**: Intelligenter Requirements Wizard zur Erstellung strukturierter Lastenhefte mit automatischer JSON-Generierung
- **Avatar-System**: Spezialisierte virtuelle Assistenten für medizinische Prozesse
- **Portfolio-Seite**: Übersicht aller DiggAiHH-Produkte mit detaillierten Beschreibungen und Preisinformationen

## 🚀 Tech Stack

- **Frontend**: React 18 mit Vite
- **Styling**: Tailwind CSS mit Medical Blue Theme
- **Routing**: React Router v6
- **Payment**: Stripe Integration (Stripe Elements, Stripe Checkout)
- **Security**: Input-Validation, URL-Validation
- **Lead API**: Node.js (Express) für Kontakt-/Lead-Anfragen (same-origin via Nginx `/api/*`)
- **Container**: Docker mit Multi-Stage Build
- **Web Server**: Nginx (Alpine)

## 📁 Projektstruktur

```
/
├── public/
│   └── data/
│       └── products.json   # Produktdaten für Portfolio-Seite
├── src/
│   ├── features/           # Feature-First Architektur
│   │   ├── lageropt/      # Lageroptimierung mit MHD-Tracking
│   │   │   ├── LageroptFeature.jsx          # Basis-Version
│   │   │   └── LageroptEnhancedFeature.jsx  # Erweiterte Version mit MHD
│   │   ├── roi/           # ROI-Rechner
│   │   │   ├── RoiFeature.jsx               # Basis-Version
│   │   │   └── RoiEnhancedFeature.jsx       # Erweiterte Version mit Arbeitszeit-Analyse
│   │   ├── avatar/        # Avatar-System
│   │   │   └── AvatarFeature.jsx
│   │   ├── praxistwin/    # Praxis-Twin Gamification
│   │   │   └── PraxisTwinFeature.jsx
│   │   ├── aigodmode/     # Assistenzmodus Requirements Wizard
│   │   │   └── AIGodModeFeature.jsx
│   │   └── payment/       # Stripe Payment Integration
│   │       ├── stripeConfig.js    # Stripe-Konfiguration
│   │       ├── CheckoutButton.jsx # Checkout-Button-Komponente
│   │       ├── CheckoutForm.jsx   # Stripe Elements Form
│   │       └── PaymentPage.jsx    # Vollständige Checkout-Seite
│   ├── layouts/           # Layout-Komponenten
│   │   └── MainLayout.jsx # Hauptlayout mit Privacy-UI
│   ├── components/        # Wiederverwendbare Komponenten
│   │   ├── LeadForm.jsx
│   │   └── PrivacyBanner.jsx
│   ├── pages/            # Seiten-Komponenten
│   │   ├── HomePage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── ImpressumPage.jsx
│   │   ├── SecurityOverviewPage.jsx
│   │   ├── ProductsPage.jsx  # Portfolio-Übersicht
│   │   └── PrivacyPage.jsx
│   ├── utils/            # Hilfsfunktionen
│   │   ├── security.js   # Input-Validation, URL-Validation & Sanitization
│   │   └── privacy.js    # DSGVO-Compliance Hooks
│   └── index.css         # Tailwind-Konfiguration
├── Dockerfile            # Multi-Stage Docker Build
├── nginx.conf           # Nginx-Konfiguration mit Security Headers
├── docker-compose.yml   # Container-Orchestrierung
├── server/               # Lead API Service (Express)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
└── tailwind.config.js   # Tailwind mit Medical Blue Theme
```

## 🔧 Installation & Entwicklung

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- Docker (optional für Produktion)

### Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Development Server starten (Port 3000)
npm run dev

# Production Build erstellen
npm run build

# Production Build testen
npm run preview
```

### Kontaktformular / Lead API

Das Kontaktformular (z.B. auf `/kontakt` oder in den Produkt-Modals) sendet Anfragen an die same-origin Lead API unter `/api/lead`.

Wichtig: Bitte keine Gesundheitsdaten/Patientendaten über das Formular senden.

#### SMTP konfigurieren (optional)

Wenn SMTP nicht konfiguriert ist, antwortet die API bewusst mit `503 Service Unavailable` (fail-safe). Das Frontend zeigt dann eine hilfreiche Meldung an.

- Beispielwerte: `server/.env.example`
- Docker Compose: Variablen über `.env` im Projekt-Root setzen

Erforderliche Variablen (Minimal-Setup):

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...

MAIL_FROM=no-reply@diggaihh.de
MAIL_TO=kontakt@diggaihh.de
```

### E2E-Tests (Playwright)

```bash
npx playwright install --with-deps
npm run test:e2e
```

### Infra Smoke (Docker + Nginx)

Prüft automatisiert:
- `/health` und `/api/health`
- Security-Header (CSP, XFO, etc.)
- Caching-Policy (`no-store` für HTML + `/api/*`, `immutable` für hashed Assets)
- `/api/lead` fail-safe Verhalten (503 wenn SMTP nicht konfiguriert)

```bash
npm run test:infra
```

Konfiguration:
- `E2E_BASE_URL` (Default: `http://localhost:4173`)
- `E2E_SKIP_WEB_SERVER=1` (wenn du den Server selbst startest)

### Defensiver Pen-Test Baseline (OWASP ZAP)

Voraussetzungen: Docker.

```bash
docker-compose up --build -d
npm run security:zap
```

Konfiguration:
- `ZAP_TARGET_URL` (Default: `http://localhost`)
- `ZAP_OUT_DIR` (Default: `zap-report`)

### Mit Docker

```bash
# Image bauen und Container starten
docker-compose up --build

# Im Hintergrund starten
docker-compose up -d

# Container stoppen
docker-compose down
```

Die Anwendung ist dann unter `http://localhost` erreichbar.

## ✅ Tests

Die Repo nutzt mehrere Test-Runner (bewusst getrennt):

```bash
# Kleine Unit-Checks im Frontend (Node Test Runner)
npm run test:unit

# Frontend Component-Tests (Vitest)
npm run test:frontend:run

# Lead API Unit-Tests (Node Test Runner)
npm --prefix server test

# E2E (Playwright)
npm run test:e2e

# Docker/Nginx Smoke
npm run test:infra

# Alles (Unit + Frontend + Server + E2E + Infra)
npm run test:all

# Dependency Security Audit
npm run security:audit
```

Hinweis: Falls `npm audit` ein `esbuild`-Finding über Vite meldet, wird im Root-Projekt eine `overrides`-Pin genutzt, um `esbuild` auf eine nicht-vulnerable Version zu setzen, ohne ein Vite-Major-Upgrade zu erzwingen.

## 🔒 Security Features

### Input Validation

Alle Benutzereingaben werden validiert und sanitized:

- **Text-Inputs**: XSS-Protection durch React's automatische Text-Escaping und DOMPurify (verfügbar für HTML-Inhalte)
- **Text-Inputs**: XSS-Protection durch React's automatische Text-Escaping
- **Numerische Inputs**: Range-Validation
- **Email/Phone**: Format-Validation mit Regex
- **URL-Validation**: Strenge Validierung von externen URLs (nur HTTPS, nur erlaubte Domains)
- **Rate Limiting**: Schutz vor Spam und Abuse

### DSGVO-Compliance

- ✅ Cookie-Consent-Banner mit granularen Optionen
- ✅ Privacy-Status-Indikator im Header
- ✅ Datenschutzerklärung
- ✅ Lokale Speicherung der Consent-Präferenzen
- ✅ Keine Tracking ohne explizite Zustimmung

### Security Headers

Nginx ist konfiguriert mit:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy`
- `Referrer-Policy`
- `Permissions-Policy`

## 🎨 Design System

### Medical Blue Theme

Die Anwendung verwendet ein professionelles Medical Blue Theme:

- **Primary**: `medical-blue-600` (#0284c7)
- **Accent**: `medical-accent-600` (#059669)
- **Varianten**: 50-950 für alle Farben

### Komponenten-Klassen

```css
.btn-primary      /* Primary Button */
.btn-secondary    /* Secondary Button */
.card             /* Card Container */
```

## 📝 Features im Detail

### 1. Lageroptimierung mit MHD-Tracking

Intelligente Bestandsverwaltung mit vollständiger Chargen- und Ablaufdatum-Überwachung:
- **MHD-Tracking**: Automatische Warnungen 4 Wochen vor Ablaufdatum
- **Farbkodierung**: Rot (Abgelaufen), Gelb (Bald ablaufend ≤28 Tage), Grün (OK)
- **Chargenverfolgung**: Vollständige Dokumentation jeder Charge/Lot
- **Lagerort-Management**: Präzise Lokalisierung (Raum, Regal, Fach)
- **Verantwortlichkeiten**: Zuordnung zu verantwortlichen Personen
- **MDR-Konformität**: Erfüllt Anforderungen der Medizinprodukte-Verordnung (EU) 2017/745
- **Optimierungsscore**: KI-gestützte Bestandsoptimierung mit Nachbestellempfehlungen

### 2. ROI-Rechner mit Arbeitszeit-Analyse

Umfassende Rentabilitätsanalyse mit Fokus auf Produktivitätssteigerung:
- **Arbeitszeit-Einsparung**: Berechnung basierend auf redundanten Stunden × Stundenlohn × Mitarbeiter × 52 Wochen
- **12-Monats-Visualisierung**: Interaktive Balkendiagramme mit Break-Even-Markierung
- **Umfassende Metriken**: ROI, Break-Even-Point, Nettogewinn, Gesamtkosten
- **Flexibler Zeitrahmen**: Analysen für 12, 24, 36 oder 60 Monate
- **Prioritäts-Optionen**: Geschwindigkeit, Qualität, Kosten oder ausgewogen

### 3. Praxis-Twin (Gamification)

Spielerisches Digitalisierungs-System zur Motivation und Visualisierung des Fortschritts:
- **SVG-Avatar**: Visuelle Repräsentation der Praxis als Gebäude mit animiertem Medizin-Symbol
- **Drag-and-Drop**: Intuitive Installation von Modulen per Drag & Drop
- **6 Module**: IT-Sicherheit, Netzwerk, Hygiene, Patientenverwaltung, Telemedizin, Analytics
- **Level-System**: Automatisches Level-Up alle 50 Punkte
- **Performance-Optimiert**: Nutzt CSS-Animationen und SVG statt 3D-Engines
- **Fortschritts-Tracking**: Echtzeit-Anzeige von Punkten, Level und Digitalisierungsgrad

### 4. Assistenzmodus (Requirements Wizard)

Intelligenter 4-Schritte-Wizard zur Erstellung strukturierter Projektspezifikationen:
- **Schritt 1 - Grundinformationen**: Projektname, Praxistyp, Mitarbeiterzahl
- **Schritt 2 - Anforderungen**: Ziele, Schmerzpunkte, Must-Have und Nice-to-Have Features
- **Schritt 3 - Technisches**: Bestehende Systeme, Integration, Sicherheitsanforderungen
- **Schritt 4 - Budget & Zeitplan**: Verfügbares Budget, Zeitrahmen, Prioritäten
- **JSON-Export**: Strukturierte Spezifikation zum Download
- **Compliance-Check**: Automatische Erkennung von GDPR-, MDR- und MPDG-Relevanz
- **KI-Integration (Coming Soon)**: Vorbereitet für Google Gemini Pro API

### 5. Avatar-System

Spezialisierte virtuelle Assistenten:
- **Dr. Med. Assistent**: Medizinische Beratung
- **Lager-Experte**: Bestandsmanagement
- **Daten-Analyst**: Analytics & Reporting

### 6. Stripe Payment Integration

Sichere Zahlungsabwicklung mit Stripe:
- **Stripe Elements**: Eingebettete Zahlungsformulare mit Stripe's UI-Komponenten
- **Checkout Button**: Einfache Integration in Produktseiten
- **Demo-Modus**: Zeigt Anfrage-Optionen wenn Stripe nicht konfiguriert ist
- **DSGVO-konform**: Zahlungsdaten werden direkt von Stripe verarbeitet
- **Unterstützte Zahlungsmethoden**: Kreditkarte, SEPA-Lastschrift

#### Stripe Konfiguration

Für die Aktivierung der Stripe-Zahlung setzen Sie die Umgebungsvariable:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

In Entwicklungsumgebungen können Sie den Test-Key verwenden:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

## 🚢 Deployment

### Production Build

Der Multi-Stage Dockerfile erstellt einen optimierten Production Build:

1. **Build Stage**: Installiert Dependencies und baut die Anwendung
2. **Production Stage**: Kopiert nur die Build-Artefakte in ein schlankes Nginx-Image

### Environment Variables

Für Production können folgende Umgebungsvariablen gesetzt werden:

```env
NODE_ENV=production
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # Stripe Publishable Key
VITE_SITE_URL=https://diggaihh.de          # Canonical/OG Base URL
```

### Health Check

Ein Health-Check-Endpoint ist unter `/health` verfügbar (Nginx/Container). Die Lead API bietet zusätzlich `/api/health`.

## 📦 Produktdaten-Verwaltung

Die Portfolio-Seite zeigt alle DiggAiHH-Produkte mit Beschreibungen und Preisen. Die Produktdaten werden zentral verwaltet in:

```
public/data/products.json
```

### Produktdaten-Schema

Jedes Produkt folgt diesem Schema:

```json
{
  "id": "eindeutige-id",
  "title": "Produktname",
  "repoUrl": "https://github.com/DiggAiHH/RepoName",
  "shortDescription": "Kurze Beschreibung für Kartenansicht",
  "longDescription": "Detaillierte Beschreibung für Modal-Ansicht",
  "priceEUR": 1234,
  "priceLabel": "ab",
  "priceJustification": "Begründung der Preisgestaltung",
  "tags": ["Tag1", "Tag2"],
  "tech": ["Technologie1", "Technologie2"],
  "features": ["Feature 1", "Feature 2"],
  "complexity": "low|medium|high",
  "category": "Produktkategorie"
}
```

### Produkt hinzufügen oder bearbeiten

1. Öffnen Sie `public/data/products.json`
2. Fügen Sie ein neues Produkt-Objekt zum `products`-Array hinzu oder bearbeiten Sie ein bestehendes
3. Stellen Sie sicher, dass alle Pflichtfelder ausgefüllt sind
4. Die `id` muss eindeutig und URL-freundlich sein (z.B. `mein-produkt`)
5. Preise sollten nachvollziehbar begründet werden in `priceJustification`
6. Speichern und testen Sie die Änderungen lokal mit `npm run dev`

### Sicherheitshinweise

- ✅ React's automatische Text-Escaping schützt vor XSS bei allen dargestellten Texten
- ✅ DOMPurify verfügbar für HTML-Sanitization bei Bedarf
- ✅ Alle Beschreibungen als Plain Text speichern
- ✅ Keine sensiblen Informationen in Produktdaten
- ✅ Repository-URLs werden vor Anzeige validiert (nur HTTPS, nur github.com erlaubt)

## 📄 Lizenz

© 2025 DiggAiHH. Alle Rechte vorbehalten.

## 🤝 Support

Bei Fragen oder Problemen kontaktieren Sie uns über das Impressum.

---

**Entwickelt mit ❤️ für das Gesundheitswesen**