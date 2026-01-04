const DEFAULT = {
  title: 'DiggAiHH - MedTech SaaS Platform | Digitale Lösungen für Praxen & Kliniken',
  description:
    'DiggAiHH ist MedTech SaaS für bessere Abläufe in Praxen & Kliniken – DSGVO-konform, sicher und auf messbaren Nutzen ausgelegt.',
  canonicalPath: '/',
  robots: 'index,follow',
  ogType: 'website'
}

const ROUTES = new Map([
  ['/', DEFAULT],
  [
    '/products',
    {
      title: 'Produkte | DiggAiHH',
      description: 'Produktübersicht der DiggAiHH MedTech SaaS-Lösungen inklusive Funktionen und Einsatzbereichen.',
      canonicalPath: '/products'
    }
  ],
  [
    '/kontakt',
    {
      title: 'Kontakt | DiggAiHH',
      description: 'Kontaktieren Sie DiggAiHH. Kurze Anfrage senden – wir melden uns mit einem konkreten Vorschlag.',
      canonicalPath: '/kontakt'
    }
  ],
  [
    '/privacy',
    {
      title: 'Datenschutzerklärung | DiggAiHH',
      description: 'Informationen zur Verarbeitung personenbezogener Daten und zu Ihren Rechten nach DSGVO.',
      canonicalPath: '/privacy'
    }
  ],
  [
    '/impressum',
    {
      title: 'Impressum | DiggAiHH',
      description: 'Impressum und Anbieterkennzeichnung gemäß den gesetzlichen Vorgaben.',
      canonicalPath: '/impressum'
    }
  ],
  [
    '/security',
    {
      title: 'Sicherheit & Compliance | DiggAiHH',
      description: 'Überblick über Security- und Compliance-Maßnahmen (DSGVO, BSI IT-Grundschutz, ISO 27001).',
      canonicalPath: '/security'
    }
  ],
  [
    '/lageropt',
    {
      title: 'Lageroptimierung mit MHD | DiggAiHH',
      description: 'Intelligente Bestandsverwaltung mit MHD-Tracking, Chargenverfolgung und MDR-konformer Dokumentation.',
      canonicalPath: '/lageropt'
    }
  ],
  [
    '/roi',
    {
      title: 'ROI-Rechner | DiggAiHH',
      description: 'Berechnen Sie den ROI Ihrer Digitalisierung mit Fokus auf Arbeitszeit-Einsparungen und Break-Even.',
      canonicalPath: '/roi'
    }
  ],
  [
    '/avatar',
    {
      title: 'Avatar-System | DiggAiHH',
      description: 'Personalisierte Assistenten und virtuelle Berater für medizinische Prozesse und Patienteninteraktion.',
      canonicalPath: '/avatar'
    }
  ],
  [
    '/praxis-twin',
    {
      title: 'Praxis-Twin | DiggAiHH',
      description: 'Gamification-System für den digitalen Praxisaufbau – Module per Drag & Drop, Fortschritt und Motivation.',
      canonicalPath: '/praxis-twin'
    }
  ],
  [
    '/ai-god-mode',
    {
      title: 'Assistenzmodus (AI God Mode) | DiggAiHH',
      description: 'Requirements Wizard zur strukturierten Erfassung von Anforderungen inklusive JSON-Export.',
      canonicalPath: '/ai-god-mode'
    }
  ],
  [
    '/praxis-manager',
    {
      title: 'Praxis Manager | DiggAiHH',
      description: 'Zentrale Steuerung Ihrer Praxis: Prozesse, Ressourcen und effiziente Abläufe in einem System.',
      canonicalPath: '/praxis-manager'
    }
  ],
  [
    '/ai-daten-check',
    {
      title: 'AI Daten-Check & Anonymisator | DiggAiHH',
      description: 'KI-gestützte Analyse und Anonymisierung personenbezogener Daten – Datenschutz und Datenminimierung im Fokus.',
      canonicalPath: '/ai-daten-check'
    }
  ],
  [
    '/kiosk',
    {
      title: 'Kiosk-Systeme für Praxen | DiggAiHH',
      description: 'Self-Service-Terminals für Anmeldung, Warteschlangen-Management und digitale Formulare in der Praxis.',
      canonicalPath: '/kiosk'
    }
  ],
  [
    '/anamnese',
    {
      title: 'Online-Anamnese | DiggAiHH',
      description: 'Digitale Vorab-Befragung für Praxen – strukturierte Erfassung und effiziente Vorbereitung von Terminen.',
      canonicalPath: '/anamnese'
    }
  ],
  [
    '/praxis-it',
    {
      title: 'Praxis IT | DiggAiHH',
      description: 'IT-Management und Compliance-Unterstützung für Praxen: Geräte, Netzwerk, FAQ und Security-Überblick.',
      canonicalPath: '/praxis-it'
    }
  ]
])

export function getSeoForPath(pathname) {
  const key = typeof pathname === 'string' ? pathname.replace(/\/$/, '') || '/' : '/'
  const candidate = ROUTES.get(key)
  if (candidate) return { ...DEFAULT, ...candidate }

  return { ...DEFAULT, canonicalPath: key }
}
