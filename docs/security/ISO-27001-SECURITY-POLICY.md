# ISO 27001 Information Security Policy
## DiggAiHH MedTech SaaS Platform

**Version:** 1.0  
**Stand:** 2024  
**Klassifizierung:** Intern

---

## 1. Einleitung und Geltungsbereich

### 1.1 Zweck
Diese Informationssicherheitsrichtlinie definiert den Rahmen für die Informationssicherheit der DiggAiHH MedTech SaaS-Plattform gemäß ISO/IEC 27001:2022 und den Anforderungen des BSI IT-Grundschutz.

### 1.2 Geltungsbereich
Diese Richtlinie gilt für:
- Alle Systeme und Anwendungen der DiggAiHH-Plattform
- Alle Mitarbeiter, Auftragnehmer und Dritte mit Zugang zu Systemen
- Alle Daten, die im Rahmen der Plattform verarbeitet werden

### 1.3 Regulatorische Anforderungen
- **ISO/IEC 27001:2022** - Informationssicherheits-Managementsystem
- **EU-DSGVO (GDPR)** - Datenschutz-Grundverordnung
- **BDSG** - Bundesdatenschutzgesetz
- **MDR (EU) 2017/745** - Medizinprodukte-Verordnung
- **BSI IT-Grundschutz** - Bundesamt für Sicherheit in der Informationstechnik

---

## 2. Informationssicherheits-Managementsystem (ISMS)

### 2.1 Sicherheitsziele (CIA-Triade)

| Schutzziel | Beschreibung | Implementierung |
|------------|--------------|-----------------|
| **Vertraulichkeit** | Schutz vor unbefugtem Zugriff | TLS/SSL-Verschlüsselung, Zugangskontrollen, CSP |
| **Integrität** | Schutz vor unbefugter Änderung | Input-Validierung, DOMPurify, Audit-Logging |
| **Verfügbarkeit** | Sicherstellung der Systemverfügbarkeit | Health-Checks, Monitoring, Redundanz |

### 2.2 Risikomanagement
Gemäß ISO 27001 Anhang A werden regelmäßige Risikoanalysen durchgeführt:

1. **Identifikation von Assets** - Alle Informationswerte erfassen
2. **Bedrohungsanalyse** - Potenzielle Bedrohungen identifizieren
3. **Schwachstellenanalyse** - Anfälligkeiten bewerten
4. **Risikobehandlung** - Maßnahmen definieren und umsetzen

---

## 3. Technische Sicherheitsmaßnahmen

### 3.1 Anwendungssicherheit

#### 3.1.1 Content Security Policy (CSP)
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
form-action 'self';
```

#### 3.1.2 Security Headers
| Header | Wert | Zweck |
|--------|------|-------|
| X-Frame-Options | SAMEORIGIN | Clickjacking-Schutz |
| X-Content-Type-Options | nosniff | MIME-Type-Sniffing verhindern |
| X-XSS-Protection | 1; mode=block | XSS-Filterung aktivieren |
| Referrer-Policy | strict-origin-when-cross-origin | Referrer-Informationen limitieren |
| Permissions-Policy | geolocation=(), microphone=(), camera=() | API-Berechtigungen einschränken |

#### 3.1.3 Input-Validierung
Alle Benutzereingaben werden validiert und sanitisiert:
- **Textvalidierung**: Längenprüfung, Zeichenfilterung
- **Numerische Validierung**: Bereichsprüfung, Typsicherheit
- **HTML-Sanitisierung**: DOMPurify zur XSS-Prävention

### 3.2 Infrastruktursicherheit

#### 3.2.1 Container-Sicherheit (Docker)
- Multi-Stage Builds zur Minimierung der Angriffsfläche
- Non-Root-Benutzer im Container
- Regelmäßige Image-Updates
- Health-Checks für Verfügbarkeitsüberwachung

#### 3.2.2 Webserver-Sicherheit (Nginx)
- Deaktivierung von Directory-Listing
- Zugriffsbeschränkung auf versteckte Dateien
- Gzip-Komprimierung für Performance
- Static Asset Caching mit Immutable-Flag

---

## 4. Organisatorische Sicherheitsmaßnahmen

### 4.1 Zugangskontrollen
| Kontrolle | Beschreibung |
|-----------|--------------|
| **Identifikation** | Eindeutige Benutzerkennung |
| **Authentifizierung** | Sichere Passwörter, ggf. MFA |
| **Autorisierung** | Rollenbasierte Zugriffssteuerung (RBAC) |
| **Protokollierung** | Audit-Logging aller Zugriffe |

### 4.2 Datenschutz und DSGVO-Konformität
- **Rechtsgrundlage**: Einwilligung gemäß Art. 6 DSGVO
- **Datensparsamkeit**: Nur notwendige Daten erfassen
- **Speicherbegrenzung**: Löschkonzept nach Zweckerfüllung
- **Betroffenenrechte**: Auskunft, Berichtigung, Löschung

### 4.3 Vorfallmanagement
1. **Erkennung**: Monitoring und Anomalie-Erkennung
2. **Klassifizierung**: Schweregrad-Bewertung
3. **Reaktion**: Incident Response gemäß Plan
4. **Meldepflicht**: 72h-Frist bei Datenschutzverletzungen

---

## 5. Sicherheitskontrollen nach ISO 27001 Anhang A

### A.5 Organisatorische Kontrollen
- [x] A.5.1 Richtlinien für Informationssicherheit
- [x] A.5.2 Rollen und Verantwortlichkeiten
- [x] A.5.3 Trennung von Aufgaben

### A.6 Personenbezogene Kontrollen
- [x] A.6.1 Überprüfung vor Einstellung
- [x] A.6.2 Bedingungen der Beschäftigung
- [x] A.6.3 Sensibilisierung und Schulung

### A.7 Physische Kontrollen
- [x] A.7.1 Physische Sicherheitsperimeter
- [x] A.7.2 Physische Zugangskontrollen

### A.8 Technologische Kontrollen
- [x] A.8.1 Benutzerendgeräte
- [x] A.8.2 Privilegierte Zugriffsrechte
- [x] A.8.3 Informationszugriffsbeschränkung
- [x] A.8.4 Zugang zu Quellcode
- [x] A.8.5 Sichere Authentifizierung
- [x] A.8.6 Kapazitätsmanagement
- [x] A.8.7 Schutz vor Malware
- [x] A.8.8 Technische Schwachstellenmanagement
- [x] A.8.9 Konfigurationsmanagement
- [x] A.8.10 Informationslöschung
- [x] A.8.11 Datenmaskierung
- [x] A.8.12 Verhinderung von Datenlecks

---

## 6. Kontinuierliche Verbesserung

### 6.1 Audit-Zyklus
- **Interne Audits**: Halbjährlich
- **Externe Audits**: Jährlich (ISO 27001 Zertifizierung)
- **Penetrationstests**: Jährlich oder nach größeren Änderungen

### 6.2 Metriken und KPIs
| KPI | Zielwert | Messintervall |
|-----|----------|---------------|
| Sicherheitsvorfälle | 0 kritische | Monatlich |
| Patch-Zeit (kritisch) | < 24h | Laufend |
| Schulungsquote | 100% | Jährlich |
| Backup-Erfolgsrate | 99.9% | Wöchentlich |

### 6.3 Management-Review
Quartalsweise Überprüfung durch die Geschäftsleitung:
- Sicherheitsstatus
- Risikolage
- Verbesserungspotenziale
- Ressourcenbedarf

---

## 7. Dokumentenkontrolle

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0 | 2024 | DiggAiHH | Erstversion gemäß ISO 27001:2022 |

---

**Genehmigt durch:** Geschäftsführung  
**Nächste Überprüfung:** 12 Monate

---

*Dieses Dokument ist Teil des Informationssicherheits-Managementsystems (ISMS) und unterliegt der Dokumentenlenkung gemäß ISO 27001.*
