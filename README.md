# DiggAiHH MedTech SaaS Platform

## 🏥 Übersicht

DiggAiHH ist eine moderne MedTech SaaS-Plattform für intelligente Prozessoptimierung im Gesundheitswesen. Die Anwendung bietet drei Hauptfeatures:

- **Lageroptimierung**: KI-gestützte Bestandsverwaltung für medizinische Lagerbestände
- **ROI-Rechner**: Präzise Kosten-Nutzen-Analysen für digitale Gesundheitslösungen
- **Avatar-System**: Spezialisierte virtuelle Assistenten für medizinische Prozesse

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
├── src/
│   ├── features/           # Feature-First Architektur
│   │   ├── lageropt/      # Lageroptimierung
│   │   ├── roi/           # ROI-Rechner
│   │   └── avatar/        # Avatar-System
│   ├── layouts/           # Layout-Komponenten
│   │   └── MainLayout.jsx # Hauptlayout mit Privacy-UI
│   ├── components/        # Wiederverwendbare Komponenten
│   │   └── PrivacyBanner.jsx
│   ├── pages/            # Seiten-Komponenten
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

### 1. Lageroptimierung

Berechnet optimale Lagerbestände basierend auf:
- Aktueller Bestand
- Mindest-/Maximalbestand
- Täglicher Verbrauch
- Liefert Optimierungsscore und Nachbestellempfehlungen

### 2. ROI-Rechner

Analysiert die Wirtschaftlichkeit von Investitionen:
- Initiale Investition & laufende Kosten
- Monatlicher Umsatz & Einsparungen
- Berechnet ROI, Break-Even und Nettogewinn
- Visuelle Bewertung der Investition

### 3. Avatar-System

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

## 📄 Lizenz

© 2025 DiggAiHH. Alle Rechte vorbehalten.

## 🤝 Support

Bei Fragen oder Problemen kontaktieren Sie uns über das Impressum.

---

**Entwickelt mit ❤️ für das Gesundheitswesen**