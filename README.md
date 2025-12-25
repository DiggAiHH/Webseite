# DiggAiHH MedTech SaaS Platform

## 🏥 Übersicht

DiggAiHH ist eine moderne MedTech SaaS-Plattform für intelligente Prozessoptimierung im Gesundheitswesen. Die Anwendung bietet fünf Hauptfeatures:

- **Lageroptimierung mit MHD-Tracking**: Intelligente Bestandsverwaltung mit automatischer Ablaufdatum-Überwachung, Chargenverfolgung und MDR-konformer Dokumentation
- **ROI-Rechner mit Arbeitszeit-Analyse**: Präzise Kosten-Nutzen-Analysen mit Fokus auf Produktivitätssteigerung durch Automatisierung redundanter Arbeitszeiten
- **Praxis-Twin (Gamification)**: Spielerisches Aufbau-System für die digitale Praxis mit Drag-and-Drop-Modulen und Level-Progression
- **AI God Mode**: Intelligenter Requirements Wizard zur Erstellung strukturierter Lastenhefte mit automatischer JSON-Generierung
- **Avatar-System**: Spezialisierte virtuelle Assistenten für medizinische Prozesse
- **Portfolio-Seite**: Übersicht aller DiggAiHH-Produkte mit detaillierten Beschreibungen und Preisinformationen

## 🚀 Tech Stack

- **Frontend**: React 18 mit Vite
- **Styling**: Tailwind CSS mit Medical Blue Theme
- **Routing**: React Router v6
- **Security**: DOMPurify für Input-Sanitization
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
│   │   └── aigodmode/     # AI God Mode Requirements Wizard
│   │       └── AIGodModeFeature.jsx
│   ├── layouts/           # Layout-Komponenten
│   │   └── MainLayout.jsx # Hauptlayout mit Privacy-UI
│   ├── components/        # Wiederverwendbare Komponenten
│   │   └── PrivacyBanner.jsx
│   ├── pages/            # Seiten-Komponenten
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx  # Portfolio-Übersicht
│   │   └── PrivacyPage.jsx
│   ├── utils/            # Hilfsfunktionen
│   │   ├── security.js   # Input-Validation & Sanitization
│   │   └── privacy.js    # DSGVO-Compliance Hooks
│   └── index.css         # Tailwind-Konfiguration
├── Dockerfile            # Multi-Stage Docker Build
├── nginx.conf           # Nginx-Konfiguration mit Security Headers
├── docker-compose.yml   # Container-Orchestrierung
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

## 🔒 Security Features

### Input Validation

Alle Benutzereingaben werden validiert und sanitized:

- **Text-Inputs**: XSS-Protection durch DOMPurify
- **Numerische Inputs**: Range-Validation
- **Email/Phone**: Format-Validation mit Regex
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

### 4. AI God Mode (Requirements Wizard)

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

## 🚢 Deployment

### Production Build

Der Multi-Stage Dockerfile erstellt einen optimierten Production Build:

1. **Build Stage**: Installiert Dependencies und baut die Anwendung
2. **Production Stage**: Kopiert nur die Build-Artefakte in ein schlankes Nginx-Image

### Environment Variables

Für Production können folgende Umgebungsvariablen gesetzt werden:

```env
NODE_ENV=production
```

### Health Check

Ein Health-Check-Endpoint ist unter `/health` verfügbar und wird automatisch von Docker überwacht.

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

- ⚠️ Produkttexte werden mit DOMPurify sanitized - kein unsicheres HTML
- ✅ Alle Beschreibungen als Plain Text speichern
- ✅ Keine sensiblen Informationen in Produktdaten
- ✅ Repository-URLs werden validiert vor Anzeige

## 📄 Lizenz

© 2025 DiggAiHH. Alle Rechte vorbehalten.

## 🤝 Support

Bei Fragen oder Problemen kontaktieren Sie uns über das Impressum.

---

**Entwickelt mit ❤️ für das Gesundheitswesen**