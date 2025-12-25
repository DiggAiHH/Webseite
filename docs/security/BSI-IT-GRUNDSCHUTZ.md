# BSI IT-Grundschutz Dokumentation
## DiggAiHH MedTech SaaS Platform

**Version:** 1.0  
**Stand:** 2024  
**BSI-Standard:** 200-1, 200-2, 200-3

---

## 1. Einführung

### 1.1 Zielsetzung
Diese Dokumentation beschreibt die Umsetzung des BSI IT-Grundschutz für die DiggAiHH MedTech SaaS-Plattform. Die Implementierung erfolgt gemäß den BSI-Standards 200-1, 200-2 und 200-3.

### 1.2 Schutzbedarf
Aufgrund der Verarbeitung von Gesundheitsdaten und der Anforderungen an medizintechnische Software gilt:

| Schutzziel | Schutzbedarf | Begründung |
|------------|--------------|------------|
| Vertraulichkeit | **HOCH** | Patientendaten, Geschäftsgeheimnisse |
| Integrität | **HOCH** | Medizinische Berechnungen, Bestandsdaten |
| Verfügbarkeit | **NORMAL** | Praxisbetrieb, keine Notfallkritikalität |

---

## 2. IT-Grundschutz-Bausteine

### 2.1 Prozess-Bausteine (Schicht 1)

#### ISMS - Sicherheitsmanagement
| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| ISMS.1.A1 Übernahme der Gesamtverantwortung | ✅ | Geschäftsführung verantwortlich |
| ISMS.1.A2 Festlegung der Sicherheitsziele | ✅ | ISO 27001 Security Policy |
| ISMS.1.A3 Erstellung einer Leitlinie | ✅ | Dieses Dokument |
| ISMS.1.A4 Benennung eines ISB | ✅ | Informationssicherheitsbeauftragter |

#### ORP - Organisation und Personal
| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| ORP.1.A1 Festlegung von Verantwortlichkeiten | ✅ | Organigramm, Rollenbeschreibungen |
| ORP.1.A2 Zuweisung der Zuständigkeiten | ✅ | RACI-Matrix |
| ORP.2.A1 Berücksichtigung von Sicherheit | ✅ | Security by Design |
| ORP.4.A1 Regelung für Identitäts- und Berechtigungsmanagement | ✅ | Zugriffskontrollen implementiert |

#### CON - Konzepte
| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| CON.2.A1 Umsetzung Datenschutzmanagement | ✅ | DSGVO-Dokumentation |
| CON.3.A1 Erhebung der Einflussfaktoren für Datensicherungen | ✅ | Backup-Konzept |
| CON.6.A1 Vorbereitung auf Sicherheitsvorfälle | ✅ | Incident Response Plan |
| CON.7.A1 Einweisung des Personals | ✅ | Security Awareness Training |

---

### 2.2 System-Bausteine (Schicht 2)

#### SYS.1 Server
| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| SYS.1.1.A1 Sichere Authentisierung | ✅ | TLS, starke Passwörter |
| SYS.1.1.A2 Rollentrennung | ✅ | Container-Isolation |
| SYS.1.1.A3 Restriktive Rechtevergabe | ✅ | Non-root Container |
| SYS.1.1.A4 Schutz von Administratorzugängen | ✅ | SSH-Key-basiert |

#### SYS.1.6 Containerisierung (Docker)
| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| SYS.1.6.A1 Planung des Container-Einsatzes | ✅ | Dockerfile dokumentiert |
| SYS.1.6.A2 Beschaffung, Entwicklung und Wartung | ✅ | Multi-Stage Builds |
| SYS.1.6.A3 Sichere Konfiguration | ✅ | Nginx hardened config |
| SYS.1.6.A4 Administrations- und Zugangsrechte | ✅ | Minimal privileges |
| SYS.1.6.A5 Netzsegmentierung | ✅ | Docker networks |

---

### 2.3 Anwendungs-Bausteine (Schicht 3)

#### APP.3.1 Webanwendungen
| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| APP.3.1.A1 Authentisierung | ✅ | Session-Management |
| APP.3.1.A2 Zugriffskontrolle | ✅ | RBAC geplant |
| APP.3.1.A3 Sicheres Session-Management | ✅ | Privacy consent |
| APP.3.1.A4 Kontrolliertes Einbinden von Inhalten | ✅ | CSP implementiert |
| APP.3.1.A5 Upload-Funktionen absichern | ✅ | Keine Upload-Funktion |
| APP.3.1.A6 Schutz vor XSS | ✅ | DOMPurify, Input-Validierung |
| APP.3.1.A7 Eingabevalidierung | ✅ | security.js Modul |
| APP.3.1.A8 Fehlerbehandlung | ✅ | Keine sensiblen Daten in Fehlern |
| APP.3.1.A9 HTTP-Sicherheitsheader | ✅ | Nginx + HTML Meta-Tags |

#### APP.3.6 DNS-Server (nicht zutreffend)
#### APP.3.2 Webserver (Nginx)
| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| APP.3.2.A1 Sichere Konfiguration | ✅ | nginx.conf gehärtet |
| APP.3.2.A2 Schutz vor Log-Injection | ✅ | Keine dynamischen Logs |
| APP.3.2.A3 Zugriffskontrolle | ✅ | Hidden files blocked |
| APP.3.2.A4 Fehlerbehandlung | ✅ | Custom error pages |

---

### 2.4 Netz-Bausteine (Schicht 4)

#### NET.1.1 Netzarchitektur
| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| NET.1.1.A1 Sicherheitsrichtlinie | ✅ | Dokumentiert |
| NET.1.1.A2 Dokumentation | ✅ | Netzwerkdiagramm |
| NET.1.1.A3 Anforderungsanalyse | ✅ | Durchgeführt |

#### NET.3.1 Router und Switches
- Verantwortung des Hosting-Providers/Cloud-Anbieter

---

## 3. Schutzbedarfsfeststellung

### 3.1 Informationswerte (Assets)

| Asset | Vertraulichkeit | Integrität | Verfügbarkeit |
|-------|-----------------|------------|---------------|
| Patientendaten | HOCH | HOCH | NORMAL |
| Lagerbestandsdaten | NORMAL | HOCH | NORMAL |
| ROI-Berechnungen | NORMAL | HOCH | NORMAL |
| Benutzerkonten | HOCH | HOCH | NORMAL |
| Audit-Logs | HOCH | HOCH | NORMAL |
| Quellcode | HOCH | HOCH | NORMAL |

### 3.2 Bedrohungsanalyse

| Bedrohung | Eintrittswahrscheinlichkeit | Auswirkung | Maßnahmen |
|-----------|----------------------------|------------|-----------|
| XSS-Angriff | MITTEL | HOCH | DOMPurify, CSP |
| CSRF-Angriff | MITTEL | MITTEL | SameSite-Cookies |
| Clickjacking | NIEDRIG | MITTEL | X-Frame-Options |
| SQL-Injection | NIEDRIG | HOCH | Keine SQL-Datenbank |
| Data Breach | NIEDRIG | SEHR HOCH | Verschlüsselung, Zugriffskontrolle |
| DDoS | MITTEL | HOCH | CDN, Rate Limiting |

---

## 4. Maßnahmenumsetzung

### 4.1 Technische Maßnahmen

#### 4.1.1 Frontend-Sicherheit
```javascript
// Input-Validierung (bereits implementiert)
export const validateTextInput = (input, maxLength = 1000) => {
  // Längenprüfung
  // XSS-Filterung
  // Sanitisierung
};

// HTML-Sanitisierung
export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'span'],
    ALLOWED_ATTR: []
  });
};
```

#### 4.1.2 Server-Sicherheit
```nginx
# Implementierte Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

### 4.2 Organisatorische Maßnahmen

| Maßnahme | Verantwortlich | Intervall |
|----------|----------------|-----------|
| Security Awareness Training | ISB | Jährlich |
| Passwort-Richtlinien-Überprüfung | IT | Halbjährlich |
| Zugriffsrechte-Review | IT | Quartalsweise |
| Backup-Test | IT | Monatlich |
| Notfallübung | ISB | Jährlich |

---

## 5. Risikobehandlung

### 5.1 Akzeptierte Risiken
| Risiko | Begründung | Risikoeigentümer |
|--------|------------|------------------|
| 'unsafe-inline' in CSP | React-Framework-Anforderung | CTO |

### 5.2 Geminderte Risiken
| Risiko | Maßnahme | Restrisiko |
|--------|----------|------------|
| XSS | DOMPurify + CSP | NIEDRIG |
| Clickjacking | X-Frame-Options | SEHR NIEDRIG |
| Information Disclosure | Error Handling | NIEDRIG |

---

## 6. Kontinuierliche Verbesserung

### 6.1 Audit-Plan
| Audit-Typ | Intervall | Nächster Termin |
|-----------|-----------|-----------------|
| Interne Revision | Halbjährlich | Q2 2025 |
| BSI-Grundschutz-Audit | Jährlich | Q4 2025 |
| Penetrationstest | Jährlich | Q1 2025 |

### 6.2 Kennzahlen
- Anzahl Sicherheitsvorfälle: 0
- Patch-Level: Aktuell
- Schulungsquote: 100%

---

## 7. Dokumentenlenkung

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0 | 2024 | DiggAiHH | Erstversion gemäß BSI-Standards |

---

**Klassifizierung:** Intern  
**Genehmigt durch:** Geschäftsführung, ISB  
**Gültig bis:** Nächste jährliche Überprüfung

---

*Dieses Dokument ist Bestandteil des IT-Sicherheitskonzepts gemäß BSI IT-Grundschutz und unterliegt der regelmäßigen Aktualisierung.*
