# DSGVO-Konformitätsdokumentation
## DiggAiHH MedTech SaaS Platform

**Version:** 1.0  
**Stand:** 2024  
**Rechtsgrundlage:** EU-DSGVO (Verordnung (EU) 2016/679), BDSG

---

## 1. Allgemeine Angaben

### 1.1 Verantwortlicher (Art. 4 Nr. 7 DSGVO)
**DiggAiHH**  
[Adresse eintragen]  
[E-Mail eintragen]  
[Telefon eintragen]

### 1.2 Datenschutzbeauftragter (Art. 37-39 DSGVO)
[Name und Kontaktdaten eintragen, sofern benannt]

### 1.3 Verarbeitungsverzeichnis (Art. 30 DSGVO)
Dieses Dokument dient als Verarbeitungsverzeichnis gemäß Art. 30 Abs. 1 DSGVO.

---

## 2. Verarbeitungstätigkeiten

### 2.1 Übersicht der Verarbeitungen

| # | Verarbeitungstätigkeit | Zweck | Rechtsgrundlage |
|---|------------------------|-------|-----------------|
| 1 | Cookie-Consent-Verwaltung | Einwilligungsverwaltung | Art. 6 Abs. 1 lit. a DSGVO |
| 2 | Lagerbestandsverwaltung | Inventaroptimierung | Art. 6 Abs. 1 lit. b DSGVO |
| 3 | ROI-Berechnungen | Wirtschaftlichkeitsanalyse | Art. 6 Abs. 1 lit. b DSGVO |
| 4 | Session-Management | Technische Notwendigkeit | Art. 6 Abs. 1 lit. f DSGVO |

### 2.2 Detaillierte Verarbeitungsbeschreibung

#### Verarbeitung 1: Cookie-Consent-Verwaltung

| Attribut | Beschreibung |
|----------|--------------|
| **Zweck** | Speicherung der Datenschutz-Einwilligung |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) |
| **Betroffene** | Website-Besucher |
| **Datenkategorien** | Consent-Status, Zeitstempel |
| **Speicherort** | localStorage (Browser) |
| **Speicherdauer** | Bis zur Widerruf oder Browser-Löschung |
| **Empfänger** | Keine Übermittlung |
| **Drittlandtransfer** | Nein |

**Technische Implementierung:**
```javascript
// Consent-Speicherung in privacy.js
const updatedConsent = {
  essential: true,
  analytics: boolean,
  marketing: boolean,
  timestamp: new Date().toISOString()
};
localStorage.setItem('diggai-privacy-consent', JSON.stringify(updatedConsent));
```

#### Verarbeitung 2: Lagerbestandsverwaltung

| Attribut | Beschreibung |
|----------|--------------|
| **Zweck** | Optimierung von Medizinprodukt-Beständen |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| **Betroffene** | Praxismitarbeiter, verantwortliche Personen |
| **Datenkategorien** | Produktdaten, Verantwortliche (Name) |
| **Speicherort** | Browser-Session (kein Backend) |
| **Speicherdauer** | Nur während der Session |
| **Empfänger** | Keine Übermittlung |
| **Drittlandtransfer** | Nein |

#### Verarbeitung 3: ROI-Berechnungen

| Attribut | Beschreibung |
|----------|--------------|
| **Zweck** | Wirtschaftlichkeitsanalyse für Investitionsentscheidungen |
| **Rechtsgrundlage** | Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) |
| **Betroffene** | Praxis-Administratoren |
| **Datenkategorien** | Finanzdaten, Mitarbeiterzahlen |
| **Speicherort** | Browser-Session (kein Backend) |
| **Speicherdauer** | Nur während der Session |
| **Empfänger** | Keine Übermittlung |
| **Drittlandtransfer** | Nein |

---

## 3. Technisch-Organisatorische Maßnahmen (Art. 32 DSGVO)

### 3.1 Vertraulichkeit

| Maßnahme | Umsetzung | Status |
|----------|-----------|--------|
| Zutrittskontrolle | Serverräume gesichert (Cloud-Provider) | ✅ |
| Zugangskontrolle | TLS-Verschlüsselung | ✅ |
| Zugriffskontrolle | Rollenbasierte Berechtigungen | ✅ |
| Pseudonymisierung | Keine personenbezogenen Daten gespeichert | ✅ |
| Verschlüsselung | HTTPS/TLS 1.3 | ✅ |

### 3.2 Integrität

| Maßnahme | Umsetzung | Status |
|----------|-----------|--------|
| Weitergabekontrolle | Keine Datenweitergabe | ✅ |
| Eingabekontrolle | Input-Validierung, Sanitisierung | ✅ |
| Auftragskontrolle | Keine Auftragsverarbeitung | ✅ |

### 3.3 Verfügbarkeit und Belastbarkeit

| Maßnahme | Umsetzung | Status |
|----------|-----------|--------|
| Verfügbarkeitskontrolle | Health-Checks, Monitoring | ✅ |
| Wiederherstellbarkeit | Container-basierte Deployment | ✅ |
| Belastbarkeit | Auto-Scaling möglich | ✅ |

### 3.4 Verfahren zur regelmäßigen Überprüfung

| Maßnahme | Intervall | Status |
|----------|-----------|--------|
| Datenschutz-Audit | Jährlich | ✅ |
| TOM-Überprüfung | Jährlich | ✅ |
| Penetrationstest | Jährlich | ✅ |

---

## 4. Betroffenenrechte (Art. 12-22 DSGVO)

### 4.1 Implementierung der Betroffenenrechte

| Recht | Artikel | Implementierung |
|-------|---------|-----------------|
| **Auskunft** | Art. 15 | Auf Anfrage per E-Mail |
| **Berichtigung** | Art. 16 | Auf Anfrage per E-Mail |
| **Löschung** | Art. 17 | Browser-Speicher löschen / Anfrage |
| **Einschränkung** | Art. 18 | Auf Anfrage per E-Mail |
| **Datenübertragbarkeit** | Art. 20 | JSON-Export verfügbar |
| **Widerspruch** | Art. 21 | Cookie-Banner Einstellungen |
| **Automatisierte Entscheidungen** | Art. 22 | Keine automatisierten Entscheidungen |

### 4.2 Widerruf der Einwilligung
Die Einwilligung kann jederzeit widerrufen werden durch:
1. Löschung der Browser-Daten (localStorage)
2. Klick auf "Nur notwendige" im Cookie-Banner
3. Schriftliche Anfrage an den Verantwortlichen

### 4.3 Beschwerderecht
Betroffene haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren:

**Zuständige Aufsichtsbehörde:**  
[Landesbeauftragte/r für Datenschutz eintragen]

---

## 5. Cookie-Dokumentation

### 5.1 Cookie-Kategorien

#### Notwendige Cookies (Essential)
| Name | Zweck | Speicherdauer | Anbieter |
|------|-------|---------------|----------|
| diggai-privacy-consent | Speicherung der Cookie-Einwilligung | Dauerhaft | Eigen |

#### Analyse-Cookies (Analytics)
| Name | Zweck | Speicherdauer | Anbieter |
|------|-------|---------------|----------|
| - | Aktuell keine | - | - |

#### Marketing-Cookies
| Name | Zweck | Speicherdauer | Anbieter |
|------|-------|---------------|----------|
| - | Aktuell keine | - | - |

### 5.2 Cookie-Banner-Implementierung

Das Cookie-Banner erfüllt folgende Anforderungen:
- ✅ Opt-In für nicht-essentielle Cookies
- ✅ Granulare Auswahlmöglichkeit
- ✅ Gleichwertige Ablehnungs-Option
- ✅ Dokumentation der Einwilligung (Zeitstempel)
- ✅ Widerrufsmöglichkeit
- ✅ Verständliche Sprache (Deutsch)

---

## 6. Datenschutz-Folgenabschätzung (Art. 35 DSGVO)

### 6.1 Prüfung der Notwendigkeit

Eine DSFA ist erforderlich bei:
- [x] Systematischer Überwachung öffentlich zugänglicher Bereiche
- [x] Umfangreicher Verarbeitung besonderer Kategorien (Art. 9)
- [x] Scoring, Profiling mit rechtlicher Wirkung

**Bewertung:** Eine DSFA ist für die aktuelle Implementierung **nicht erforderlich**, da:
- Keine systematische Überwachung stattfindet
- Keine besonderen Kategorien personenbezogener Daten verarbeitet werden
- Kein Scoring oder Profiling durchgeführt wird
- Daten nur lokal im Browser verarbeitet werden

### 6.2 Risikobewertung

| Risiko | Eintrittswahrscheinlichkeit | Schwere | Gesamtrisiko |
|--------|----------------------------|---------|--------------|
| Datenverlust | NIEDRIG | NIEDRIG | NIEDRIG |
| Unbefugter Zugriff | NIEDRIG | NIEDRIG | NIEDRIG |
| Datenmanipulation | NIEDRIG | MITTEL | NIEDRIG |

---

## 7. Auftragsverarbeitung (Art. 28 DSGVO)

### 7.1 Übersicht der Auftragsverarbeiter

| Dienstleister | Zweck | Land | AV-Vertrag |
|---------------|-------|------|------------|
| [Hosting-Provider] | Webhosting | [Land] | [Status] |
| [CDN-Anbieter] | Content Delivery | [Land] | [Status] |

### 7.2 Drittlandtransfers

**Aktuelle Situation:** Keine Drittlandtransfers  
**Schutzmaßnahmen bei Bedarf:**
- EU-Standardvertragsklauseln
- Angemessenheitsbeschluss
- Binding Corporate Rules

---

## 8. Dokumentenkontrolle

### 8.1 Versionshistorie

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0 | 2024 | DiggAiHH | Erstversion |

### 8.2 Überprüfungsintervall
- **Nächste Überprüfung:** 12 Monate
- **Bei Änderungen:** Sofortige Aktualisierung

---

## 9. Anlagen

- Anlage A: Datenschutzerklärung (öffentlich)
- Anlage B: Cookie-Richtlinie
- Anlage C: Muster Betroffenenanfragen
- Anlage D: AV-Verträge

---

**Erstellt:** 2024  
**Genehmigt:** Geschäftsführung, Datenschutzbeauftragter  
**Klassifizierung:** Intern

---

*Dieses Dokument ist Teil des Datenschutz-Managementsystems und unterliegt der regelmäßigen Aktualisierung gemäß Art. 5 Abs. 2 DSGVO (Rechenschaftspflicht).*
