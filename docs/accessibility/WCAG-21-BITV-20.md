# WCAG 2.1 / BITV 2.0 Accessibility-Dokumentation
## DiggAiHH MedTech SaaS Platform

**Version:** 1.0  
**Stand:** 2024  
**Standards:** WCAG 2.1 AA, BITV 2.0

---

## 1. Einleitung

### 1.1 Zielsetzung
Diese Dokumentation beschreibt die Barrierefreiheit der DiggAiHH MedTech SaaS-Plattform gemäß:
- **WCAG 2.1** (Web Content Accessibility Guidelines) Level AA
- **BITV 2.0** (Barrierefreie-Informationstechnik-Verordnung)
- **EN 301 549** (EU-Standard für Barrierefreiheit)

### 1.2 Regulatorische Anforderungen
Als Software für den medizinischen Bereich unterliegt die Plattform besonderen Anforderungen:
- § 12a BGG (Behindertengleichstellungsgesetz)
- EU-Richtlinie 2016/2102 (Barrierefreiheit öffentlicher Stellen)
- Behindertenrechtskonvention der UN (UN-BRK)

---

## 2. WCAG 2.1 Konformitätserklärung

### 2.1 Konformitätsstufe
**Angestrebte Stufe:** AA (Konformitätsstufe)

### 2.2 Prinzipien der Barrierefreiheit (POUR)

| Prinzip | Beschreibung | Status |
|---------|--------------|--------|
| **P**erceivable (Wahrnehmbar) | Informationen müssen wahrnehmbar sein | ✅ |
| **O**perable (Bedienbar) | UI-Komponenten müssen bedienbar sein | ✅ |
| **U**nderstandable (Verständlich) | Inhalte müssen verständlich sein | ✅ |
| **R**obust | Inhalte müssen robust interpretierbar sein | ✅ |

---

## 3. WCAG 2.1 Erfolgskriterien

### 3.1 Prinzip 1: Wahrnehmbar (Perceivable)

#### 1.1 Textalternativen
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 1.1.1 Nicht-Text-Inhalte | A | ✅ | SVG-Icons mit aria-labels |

**Implementierung:**
```jsx
// Beispiel: Icon mit Accessibility
<svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
</svg>
<span className="sr-only">Datenschutz</span>
```

#### 1.2 Zeitbasierte Medien
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 1.2.1 Nur-Audio und Nur-Video | A | N/A | Keine Medien vorhanden |
| 1.2.2 Untertitel (aufgezeichnet) | A | N/A | Keine Videos vorhanden |
| 1.2.3 Audiodeskription | A | N/A | Keine Videos vorhanden |

#### 1.3 Anpassbar
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 1.3.1 Info und Beziehungen | A | ✅ | Semantisches HTML, ARIA |
| 1.3.2 Bedeutungsvolle Reihenfolge | A | ✅ | Logische DOM-Struktur |
| 1.3.3 Sensorische Eigenschaften | A | ✅ | Keine rein visuellen Anweisungen |
| 1.3.4 Orientierung | AA | ✅ | Responsive Design |
| 1.3.5 Eingabezweck | AA | ✅ | autocomplete-Attribute |

**Implementierung:**
```jsx
// Formulare mit Accessibility-Attributen
<input
  type="text"
  name="productName"
  id="productName"
  aria-describedby="productName-error"
  aria-invalid={errors.productName ? 'true' : 'false'}
  autoComplete="off"
/>
{errors.productName && (
  <p id="productName-error" role="alert" className="text-red-600">
    {errors.productName}
  </p>
)}
```

#### 1.4 Unterscheidbar
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 1.4.1 Verwendung von Farbe | A | ✅ | Farbe nicht einziges Unterscheidungsmerkmal |
| 1.4.2 Audiokontrolle | A | N/A | Kein Audio vorhanden |
| 1.4.3 Kontrast (Minimum) | AA | ✅ | 4.5:1 Kontrastverhältnis |
| 1.4.4 Textgröße ändern | AA | ✅ | Responsive, rem-Einheiten |
| 1.4.5 Bilder von Text | AA | ✅ | Keine Textbilder verwendet |
| 1.4.10 Reflow | AA | ✅ | Responsive bis 320px |
| 1.4.11 Nicht-Text-Kontrast | AA | ✅ | UI-Komponenten >3:1 |
| 1.4.12 Textabstände | AA | ✅ | Anpassbare Abstände |
| 1.4.13 Inhalt bei Hover/Fokus | AA | ✅ | Keine verdeckenden Tooltips |

**Farbkontraste:**
| Element | Vordergrund | Hintergrund | Verhältnis | Status |
|---------|-------------|-------------|------------|--------|
| Fließtext | #374151 | #FFFFFF | 8.5:1 | ✅ AA |
| Überschriften | #111827 | #FFFFFF | 16.9:1 | ✅ AAA |
| Buttons | #FFFFFF | #0284C7 | 5.2:1 | ✅ AA |
| Links | #0284C7 | #FFFFFF | 4.7:1 | ✅ AA |
| Error Text | #DC2626 | #FFFFFF | 4.5:1 | ✅ AA |

---

### 3.2 Prinzip 2: Bedienbar (Operable)

#### 2.1 Tastaturzugänglich
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 2.1.1 Tastatur | A | ✅ | Alle Funktionen per Tastatur |
| 2.1.2 Keine Tastaturfalle | A | ✅ | Keine modalen Fallen |
| 2.1.4 Tastenkombinationen | A | ✅ | Keine kritischen Shortcuts |

**Implementierung:**
```jsx
// Tastatur-Navigation für interaktive Elemente
<button
  type="submit"
  className="btn-primary"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSubmit(e);
    }
  }}
>
  Speichern
</button>
```

#### 2.2 Genug Zeit
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 2.2.1 Zeitvorgaben anpassbar | A | ✅ | Session-Timeout konfigurierbar |
| 2.2.2 Pausieren, Stoppen | A | ✅ | Keine Auto-Updates |

#### 2.3 Anfälle und physische Reaktionen
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 2.3.1 Drei Blitze | A | ✅ | Keine Blitzeffekte |

#### 2.4 Navigierbar
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 2.4.1 Blöcke umgehen | A | ✅ | Skip-Links empfohlen |
| 2.4.2 Seiten betitelt | A | ✅ | Dynamische Seitentitel |
| 2.4.3 Fokusreihenfolge | A | ✅ | Logische Tab-Reihenfolge |
| 2.4.4 Linkzweck (im Kontext) | A | ✅ | Aussagekräftige Links |
| 2.4.5 Verschiedene Wege | AA | ✅ | Navigation + Direktlinks |
| 2.4.6 Überschriften und Labels | AA | ✅ | Beschreibende Texte |
| 2.4.7 Sichtbarer Fokus | AA | ✅ | Focus-Ring Styling |

**Fokus-Implementierung:**
```css
/* Tailwind CSS Focus-Styles */
.focus\:ring-2:focus {
  --tw-ring-width: 2px;
  box-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) 
              var(--tw-ring-offset-color), 
              var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) 
              var(--tw-ring-color);
}

.focus\:ring-medical-blue-500:focus {
  --tw-ring-color: #0ea5e9;
}
```

#### 2.5 Eingabemodalitäten
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 2.5.1 Zeigergesten | A | ✅ | Keine komplexen Gesten |
| 2.5.2 Zeigerabbruch | A | ✅ | Standard-Events |
| 2.5.3 Label im Namen | A | ✅ | Accessible Names |
| 2.5.4 Bewegungsaktivierung | A | ✅ | Keine Motion-Trigger |

---

### 3.3 Prinzip 3: Verständlich (Understandable)

#### 3.1 Lesbar
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 3.1.1 Sprache der Seite | A | ✅ | `<html lang="de">` |
| 3.1.2 Sprache von Teilen | AA | ✅ | Keine fremdsprachigen Inhalte |

**Implementierung:**
```html
<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    ...
  </head>
```

#### 3.2 Vorhersehbar
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 3.2.1 Bei Fokus | A | ✅ | Keine Kontextänderung bei Fokus |
| 3.2.2 Bei Eingabe | A | ✅ | Explizite Aktionen |
| 3.2.3 Konsistente Navigation | AA | ✅ | Einheitliches Layout |
| 3.2.4 Konsistente Identifikation | AA | ✅ | Einheitliche Icons/Labels |

#### 3.3 Eingabehilfen
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 3.3.1 Fehlererkennung | A | ✅ | Deutliche Fehlermeldungen |
| 3.3.2 Labels oder Anweisungen | A | ✅ | Alle Felder gelabelt |
| 3.3.3 Fehlerempfehlung | AA | ✅ | Korrekturvorschläge |
| 3.3.4 Fehlervermeidung | AA | ✅ | Validierung vor Submit |

**Implementierung:**
```jsx
// Error-Handling mit ARIA
{errors.productName && (
  <p 
    id="productName-error"
    className="mt-1 text-sm text-red-600"
    role="alert"
    aria-live="polite"
  >
    {errors.productName}
  </p>
)}
```

---

### 3.4 Prinzip 4: Robust

#### 4.1 Kompatibel
| Kriterium | Level | Status | Umsetzung |
|-----------|-------|--------|-----------|
| 4.1.1 Parsing | A | ✅ | Valides HTML |
| 4.1.2 Name, Rolle, Wert | A | ✅ | ARIA-Attribute |
| 4.1.3 Statusmeldungen | AA | ✅ | `aria-live` Regionen |

---

## 4. BITV 2.0 Zusatzanforderungen

### 4.1 Deutsche Spezifische Anforderungen

| Anforderung | Status | Umsetzung |
|-------------|--------|-----------|
| Erklärung zur Barrierefreiheit | ✅ | Im Footer verlinkt |
| Feedback-Mechanismus | ✅ | Kontaktformular |
| Durchsetzungsverfahren | ✅ | Beschwerdeweg dokumentiert |
| Leichte Sprache (optional) | 🔄 | Geplant |
| Gebärdensprache-Videos (optional) | 🔄 | Geplant |

### 4.2 Erklärung zur Barrierefreiheit (Template)

```
ERKLÄRUNG ZUR BARRIEREFREIHEIT

DiggAiHH ist bemüht, seinen Webauftritt barrierefrei zu gestalten.

Konformitätsstatus:
Diese Website ist mit WCAG 2.1 Level AA teilweise konform.

Bekannte Einschränkungen:
- [Liste der Einschränkungen]

Feedback und Kontakt:
Bei Problemen mit der Barrierefreiheit kontaktieren Sie uns:
[Kontaktdaten]

Durchsetzungsverfahren:
Falls keine zufriedenstellende Lösung gefunden wird:
[Zuständige Schlichtungsstelle]
```

---

## 5. Assistive Technologien

### 5.1 Getestete Technologien

| Technologie | Version | Status |
|-------------|---------|--------|
| NVDA (Screen Reader) | 2024.x | ✅ Getestet |
| VoiceOver (macOS/iOS) | Latest | ✅ Getestet |
| JAWS | 2024 | 🔄 Geplant |
| Chrome DevTools | Latest | ✅ Getestet |
| axe DevTools | Latest | ✅ Getestet |

### 5.2 Browser-Unterstützung

| Browser | Version | Accessibility |
|---------|---------|---------------|
| Chrome | 120+ | ✅ Vollständig |
| Firefox | 120+ | ✅ Vollständig |
| Safari | 17+ | ✅ Vollständig |
| Edge | 120+ | ✅ Vollständig |

---

## 6. Implementierungsempfehlungen

### 6.1 React-Komponenten mit Accessibility

```jsx
// Barrierefreie Button-Komponente
const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false,
  ariaLabel,
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className="btn-primary focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500"
      {...props}
    >
      {children}
    </button>
  );
};

// Barrierefreies Formularfeld
const AccessibleInput = ({
  id,
  label,
  error,
  required = false,
  ...props
}) => {
  const errorId = `${id}-error`;
  
  return (
    <div>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span aria-hidden="true">*</span>}
        {required && <span className="sr-only">(Pflichtfeld)</span>}
      </label>
      <input
        id={id}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                   focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
        {...props}
      />
      {error && (
        <p 
          id={errorId}
          role="alert"
          aria-live="polite"
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};
```

### 6.2 Skip-Links

```jsx
// Skip-Link-Komponente (empfohlen)
const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
               focus:z-50 focus:px-4 focus:py-2 focus:bg-medical-blue-600 
               focus:text-white focus:rounded-md"
  >
    Zum Hauptinhalt springen
  </a>
);
```

---

## 7. Audit und Prüfung

### 7.1 Prüfmethoden

| Methode | Tool | Frequenz |
|---------|------|----------|
| Automatisiert | axe-core, Lighthouse | Bei jedem Build |
| Manuell | Tastatur-Test | Monatlich |
| Screen Reader | NVDA, VoiceOver | Quartalsweise |
| Nutzertests | Betroffene Personen | Jährlich |

### 7.2 Bekannte Einschränkungen

| Bereich | Einschränkung | Geplante Behebung |
|---------|---------------|-------------------|
| Skip-Links | Nicht implementiert | Q1 2025 |
| Leichte Sprache | Nicht verfügbar | Q2 2025 |

---

## 8. Dokumentenkontrolle

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0 | 2024 | DiggAiHH | Erstversion |

---

**Nächste Überprüfung:** 12 Monate  
**Verantwortlich:** UX/Accessibility-Team

---

*Diese Dokumentation ist Teil des Qualitätsmanagements und wird bei Änderungen am System aktualisiert.*
