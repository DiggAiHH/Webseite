# AGENT_RUNBOOK – Arbeitsweise, Plan & Evidence

> **Zweck:** Diese Datei beschreibt die optimale, wissenschaftlich belastbare Arbeitsweise für alle Agenten in diesem Repository. Ziel ist maximale Nachvollziehbarkeit, keine Halluzinationen und verlässliche Umsetzung mit Tests, Evidence-Logs, Datenschutz und Performance.

---

## 1) KLARES ZIEL

**Primärziel:** Fehlerfreie, sichere und nachvollziehbare Entwicklung mit Fokus auf Nutzererlebnis, Stabilität, DSGVO/CRA-Compliance und Performance.  
**Sekundärziel:** Reproduzierbare Ausführung (Build/Test), klare Dokumentation und evidenzbasierte Entscheidungen.

**Ergebnisdefinition (Definition of Done):**
- Funktionale Änderung implementiert
- Unit-Test erstellt und **sofort** ausgeführt
- Evidence-Log in `buildLogs/` abgelegt
- `LAUFBAHN.md` aktualisiert (Timestamp + Dateien + Verifikation)

---

## 2) GERÄTE & METHODIK

**Methodik (evidenzbasiert):**
1. **Plan-First:** Planung vor Implementierung (Dateien, Tests, Risiken, Evidence)
2. **Stop-and-Fix:** Fehler sofort beheben, niemals überspringen
3. **Test-First nach Implementierung:** Jede neue Funktion → Test schreiben → Test ausführen
4. **Evidence-Logging:** Alle relevanten Outputs nach `buildLogs/`
5. **Privacy by Design:** PII nie in Logs, Minimierung von Daten

**Qualitäts-Checkpoints:**
- Linting ohne Warnungen
- Tests grün
- Keine PII in Logs
- Sicherheits-Defaults restriktiv

---

## 3) SPRACHEN & TECHNOLOGIEN

**Erlaubte Technologien (aktuelles Repo):**
- Frontend: React 18 (JS/JSX)
- Backend: Node.js/Express (JS)
- Tests: Vitest, Playwright
- Styling: TailwindCSS
- Build: Vite

**Zusatz-Tools:**
- i18n: i18next
- AI: Gemini API (Server)

---

## 4) STRUKTUR

**Repository-Struktur (Referenz):**
```
/workspaces/Webseite/
├── src/                    # Frontend React App
├── server/src/             # Backend Express API
├── tests/e2e/              # Playwright E2E Tests
├── public/                 # Static Assets
├── docs/                   # Compliance & Dokumentation
├── buildLogs/              # Evidence Logs
└── LAUFBAHN.md             # Canonical Runbook
```

---

## 5) QUALITÄT & MUSTER

**Patterns:**
- Component Pattern (Hooks)
- Validation Pattern (Zod/Schema)
- Error Handling Pattern (Try/Catch + klare Responses)
- Privacy Pattern (DSGVO-konform, minimale Daten)

**Qualitätskriterien:**
- Keine Halluzinationen: Nur Code/Strukturen verwenden, die im Repo existieren
- API-Sicherheit: Secrets nur aus Env
- Skalierbarkeit: Streaming für AI-Antworten
- Barrierefreiheit: A11y geprüft, aria-Attribute

---

## Operatives Vorgehen (Pflichtprozess)

### A) Session-Start
1. `LAUFBAHN.md` lesen
2. Offene Tasks erkennen und in Aufgabenliste übernehmen
3. Wenn Agent zuvor stoppte: Grund + Mitigation dokumentieren

### B) Planung (Planning Mode)
- Dateien & Funktionen festlegen
- Tests definieren
- Evidence-Log-Plan festlegen

### C) Umsetzung (Execution Mode)
- Schritt-für-Schritt
- Nach jedem Schritt: Test → Evidence
- `LAUFBAHN.md` aktualisieren

### D) Fehlerfall (Stop-and-Fix)
- Fehler isolieren
- Fix implementieren
- Präventive Maßnahme hinzufügen
- Regression-Test hinzufügen

---

## Evidence-Logging Standard

**Pfad:** `buildLogs/`  
**Format:** ISO-Datum im Dateinamen, klarer Zweck

Beispiel:
- `buildLogs/2026-01-21_frontend-tests.log`
- `buildLogs/2026-01-21_devserver-start.log`

---

## Nutzeranweisungen (Falls nötig)

**Nur in folgendem Format:**

USER ACTION REQUIRED
<exact command only>

---

## Wissenschaftliche Arbeitsweise (Minimierung von Fehlentscheidungen)

- Entscheidungen auf bestehende Repo-Struktur stützen
- Risiken schriftlich markieren
- Tests und Logs als Beweise sammeln
- Keine Annahmen ohne Kontext

---

## Qualitätsziel: Support & Wartbarkeit

- Klare Dokumentation
- Fehlertolerante Implementierung
- Wartungsarme Struktur
- Transparente Kommunikation in `LAUFBAHN.md`
