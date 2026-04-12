import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import RevealOnScroll from '../components/RevealOnScroll'

const AIReadinessWizard = lazy(() => import('../components/AIReadinessWizard'))

const HERO_STATS = [
  { label: 'Automatisierte Module', value: '12+' },
  { label: 'Sicherheitsfokus', value: 'DSGVO/BSI' },
  { label: 'Produkt-Setups', value: '< 2h' },
]

function WizardFallback() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-medical-blue-100 rounded-full" />
        </div>
      </div>
      <div className="h-7 w-3/4 bg-gray-200 rounded mb-6" />
      <div className="space-y-3 mb-6">
        <div className="h-16 bg-gray-100 border border-clinical-border rounded-lg" />
        <div className="h-16 bg-gray-100 border border-clinical-border rounded-lg" />
        <div className="h-16 bg-gray-100 border border-clinical-border rounded-lg" />
      </div>
      <div className="mt-6 pt-4 border-t border-clinical-border">
        <div className="h-6 w-48 bg-gray-100 rounded-full" />
      </div>
    </div>
  )
}

const HomePage = () => {
  return (
    <div className="space-y-10">
      {/* Hero Section - Futuristisch Klinisch-Minimal */}
      <RevealOnScroll as="section" className="section-hero relative overflow-hidden bg-grid-pattern" delayMs={30}>
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="hero-glow-orb -top-40 -right-40 w-80 h-80 bg-eu-trust-400/20" />
          <div className="hero-glow-orb -bottom-20 -left-20 w-60 h-60 bg-medical-blue-400/20" style={{ animationDelay: '0.8s' }} />
          <div className="hero-grid-mask" />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Hero Content */}
          <div className="animate-in">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge-eu">EU AI Act orientiert</span>
              <span className="badge-dsgvo">DSGVO</span>
              <span className="badge-bsi">BSI</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan-300 via-white to-medical-blue-200 text-glow">
              Die Zukunft der Praxis-IT
            </h1>
            <p className="text-xl md:text-2xl text-slate-100/95 mb-6 leading-relaxed">
              KI-gestützte MedTech-Lösungen, die den höchsten EU-Standards entsprechen – 
              für messbar bessere Abläufe in Praxen & Kliniken.
            </p>
            <div className="flex flex-wrap gap-4" role="group" aria-label="Schnellzugriff">
              <Link to="/kontakt" className="btn-trust animate-glow-pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Beratung starten
              </Link>
              <Link to="/products" className="btn-secondary border-white/40 bg-white/10 text-white hover:bg-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Alle Lösungen
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label="Produktkennzahlen">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 backdrop-blur-sm">
                  <p className="mono-stat text-neon-cyan-200">{stat.label}</p>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: AI-Readiness-Check Wizard */}
          <div className="animate-in" style={{ animationDelay: '0.2s' }}>
            <div className="card-glass border-glow bg-white/92 dark:bg-dark-surface/85">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-eu-trust-600 dark:text-neon-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI-Readiness-Check
              </h2>
              <Suspense fallback={<WizardFallback />}>
                <AIReadinessWizard compact />
              </Suspense>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* EU Compliance-Hub Section */}
      <RevealOnScroll as="section" className="section-clinical" delayMs={80}>
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 bg-eu-trust-100 text-eu-trust-700 rounded-full text-sm font-medium mb-3">
            EU Standards & Compliance
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Vertrauen durch dokumentierte Sicherheit
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unsere Lösungen erfüllen die höchsten europäischen Standards für Datenschutz, IT-Sicherheit und KI-Regulierung.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* DSGVO Card */}
          <div className="card-clinical group hover:shadow-glow-blue transition-all">
            <div className="w-14 h-14 bg-gradient-trust rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">DSGVO</h3>
            <p className="text-sm text-gray-600 mb-3">
              Datenschutzorientierte Umsetzung nach DSGVO-Prinzipien mit Fokus auf Datenminimierung.
            </p>
            <Link to="/privacy" className="text-eu-trust-600 hover:text-eu-trust-700 text-sm font-medium inline-flex items-center gap-1">
              Details ansehen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* BSI Card */}
          <div className="card-clinical group hover:shadow-glow-blue transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-medical-blue-500 to-medical-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">BSI IT-Grundschutz</h3>
            <p className="text-sm text-gray-600 mb-3">
              Sicherheitsausrichtung an den Standards des Bundesamts fuer Sicherheit in der Informationstechnik.
            </p>
            <Link to="/security" className="text-eu-trust-600 hover:text-eu-trust-700 text-sm font-medium inline-flex items-center gap-1">
              Sicherheitskonzept
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* ISO 27001 Card */}
          <div className="card-clinical group hover:shadow-glow-blue transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-medical-accent-500 to-medical-accent-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ISO 27001</h3>
            <p className="text-sm text-gray-600 mb-3">
              Internationaler Standard für Informationssicherheits-Managementsysteme (ISMS).
            </p>
            <Link to="/security" className="text-eu-trust-600 hover:text-eu-trust-700 text-sm font-medium inline-flex items-center gap-1">
              ISMS-Richtlinien
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* EU AI Act Card */}
          <div className="card-clinical group hover:shadow-glow-accent transition-all border-eu-trust-200">
            <div className="w-14 h-14 bg-gradient-to-br from-eu-trust-500 to-eu-trust-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">EU AI Act</h3>
            <p className="text-sm text-gray-600 mb-3">
              Vorbereitet auf die europäische KI-Verordnung mit transparenten und erklärbaren KI-Systemen.
            </p>
            <span className="text-eu-trust-600 text-sm font-medium inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Standards im Fokus
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/security" className="btn-trust inline-flex">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Vollständige Compliance-Dokumentation
          </Link>
        </div>
      </RevealOnScroll>

      {/* Wow / Clarity Section */}
      <RevealOnScroll as="section" className="card-clinical" delayMs={140}>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card border-l-4 border-l-medical-blue-600">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Schneller Einstieg</h2>
            <p className="text-gray-600">
              In wenigen Schritten zur passenden Lösung – ohne Overhead, ohne unnötige Daten.
            </p>
          </div>
          <div className="card border-l-4 border-l-medical-accent-600">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">DSGVO by Design</h2>
            <p className="text-gray-600">
              Datenminimierung, klare Zuständigkeiten und sichere Defaults – so, wie es in der Praxis funktioniert.
            </p>
          </div>
          <div className="card border-l-4 border-l-neon-cyan-500">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Messbarer Nutzen</h2>
            <p className="text-gray-600">
              Fokus auf Prozesszeit, Qualität und Transparenz – ideal für Entscheidungen und Budgetfreigaben.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/roi" className="btn-secondary bg-medical-blue-50 text-medical-blue-700 hover:bg-medical-blue-100">
            ROI in 60 Sekunden prüfen
          </Link>
          <Link to="/security" className="btn-secondary bg-gray-50 text-gray-800 hover:bg-gray-100">
            Security & Compliance ansehen
          </Link>
        </div>
      </RevealOnScroll>

      {/* New Services - Leistungen */}
      <RevealOnScroll as="section" delayMs={180}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Unsere Leistungen für Praxen & Kliniken</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            DiggAiHH unterstützt medizinische Einrichtungen dabei, Abläufe zu vereinheitlichen, Medienbrüche zu reduzieren und Entscheidungen
            mit belastbaren Kennzahlen zu treffen.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="card-clinical hover:shadow-glow-blue transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-medical-blue-500 to-medical-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Praxis Verwaltung Manager
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Zentrale Steuerung Ihrer Praxis: Terminplanung, Patientenverwaltung 
              und Ressourcenoptimierung.
            </p>
            <Link to="/praxis-manager" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
              Mehr erfahren
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="card-clinical hover:shadow-glow-accent transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-medical-accent-500 to-medical-accent-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Daten-Check
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              KI-gestützte Analyse und Anonymisierung personenbezogener Daten. 
              DSGVO-konform.
            </p>
            <Link to="/ai-daten-check" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
              Mehr erfahren
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="card-clinical hover:shadow-glow-blue transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-eu-trust-500 to-eu-trust-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Kiosk-Systeme
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Self-Service-Terminals für Patientenanmeldung und digitale Formulare.
            </p>
            <Link to="/kiosk" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
              Mehr erfahren
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="card-clinical hover:shadow-glow-accent transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              KI-Anamnese
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Intelligente Vorab-Befragung mit KI-Analyse für optimale Planung.
            </p>
            <Link to="/anamnese" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
              Mehr erfahren
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="card-clinical hover:shadow-glow-blue transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💻</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Praxis IT Manager
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              IT-Management: Geräte, Netzwerk, MDR/DSGVO/BSI-Compliance.
            </p>
            <Link to="/praxis-it" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
              Mehr erfahren
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </RevealOnScroll>

      {/* Features Grid */}
      <RevealOnScroll as="section" delayMs={220}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Weitere Tools & Module</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Je nach Ziel (Kosten senken, Compliance absichern, Personal entlasten) können einzelne Module separat genutzt oder kombiniert werden.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
        <div className="card-clinical hover:shadow-glow-blue transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-medical-blue-500 to-medical-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lageroptimierung mit MHD
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Intelligente Bestandsverwaltung mit automatischer Ablaufdatum-Überwachung
            und MDR-konformer Dokumentation.
          </p>
          <Link to="/lageropt" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
            Mehr erfahren
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="card-clinical hover:shadow-glow-accent transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-medical-accent-500 to-medical-accent-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ROI-Rechner
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Berechnen Sie den Return on Investment mit Fokus auf Arbeitszeit-Einsparungen.
            Inklusive 12-Monats-Visualisierung.
          </p>
          <Link to="/roi" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
            Mehr erfahren
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="card-clinical hover:shadow-glow-blue transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-eu-trust-500 to-eu-trust-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Praxis-Twin
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Gamification-System: Bauen Sie Ihre digitale Praxis spielerisch auf.
            Drag & Drop Module für Level-Fortschritt.
          </p>
          <Link to="/praxis-twin" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
            Mehr erfahren
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="card-clinical hover:shadow-glow-accent transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-medical-blue-500 to-eu-trust-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Assistenzmodus
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Intelligenter Requirements Wizard: Erstellen Sie strukturierte Lastenhefte
            mit automatischer JSON-Generierung.
          </p>
          <Link to="/ai-god-mode" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
            Mehr erfahren
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="card-clinical hover:shadow-glow-blue transition-all group">
          <div className="w-12 h-12 bg-gradient-to-br from-medical-accent-500 to-eu-trust-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Avatar-System
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Personalisierte Assistenten und virtuelle Berater für Ihre medizinischen
            Prozesse und Patienteninteraktion.
          </p>
          <Link to="/avatar" className="text-eu-trust-600 hover:text-eu-trust-700 font-medium text-sm inline-flex items-center gap-1">
            Mehr erfahren
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        </div>
      </RevealOnScroll>

      {/* Security & Compliance Badge */}
      <RevealOnScroll as="section" className="card-neon relative overflow-hidden" delayMs={280}>
        <div className="absolute inset-0 bg-gradient-to-r from-eu-trust-500/5 to-medical-blue-500/5 pointer-events-none" aria-hidden="true" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-gradient-trust rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-accent">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold text-slate-100 mb-2">
              An EU-Standards orientiert und datenschutzfokussiert
            </h3>
            <p className="text-slate-300 mb-4">
              Unsere Prozesse orientieren sich an DSGVO, BSI IT-Grundschutz und ISO-27001-Prinzipien.
              Details zu Verantwortlichkeiten, Datenwegen und Sicherheitsmassnahmen finden Sie in Security und Privacy.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="badge-dsgvo">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                DSGVO
              </span>
              <span className="badge-bsi">BSI-Grundschutz</span>
              <span className="badge-iso">ISO 27001</span>
              <span className="badge-eu">EU AI Act orientiert</span>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* FAQ */}
      <RevealOnScroll as="section" className="card-clinical" delayMs={320}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Häufige Fragen</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kurze Antworten auf die häufigsten Fragen – damit Sie schnell entscheiden können, was als Nächstes sinnvoll ist.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-clinical-surface border border-clinical-border rounded-xl p-5 hover:shadow-clinical transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-eu-trust-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Für wen sind die Lösungen gedacht?
            </h3>
            <p className="text-sm text-gray-700">
              Für Praxen, MVZ und medizinische Einrichtungen, die Abläufe digitalisieren und Entscheidungen mit belastbaren Kennzahlen treffen möchten.
            </p>
          </div>
          <div className="bg-clinical-surface border border-clinical-border rounded-xl p-5 hover:shadow-clinical transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-eu-trust-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Muss ich mit großen IT-Projekten rechnen?
            </h3>
            <p className="text-sm text-gray-700">
              Nein. Start modular mit Pilot, klaren Anforderungen und anschließendem Rollout – ohne unnötige Datenerfassung.
            </p>
          </div>
          <div className="bg-clinical-surface border border-clinical-border rounded-xl p-5 hover:shadow-clinical transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-eu-trust-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Wie geht ihr mit Datenschutz um?
            </h3>
            <p className="text-sm text-gray-700">
              Fokus auf Datenminimierung und sichere Defaults. Bitte keine Gesundheitsdaten über Website/Formulare übermitteln.
            </p>
          </div>
          <div className="bg-clinical-surface border border-clinical-border rounded-xl p-5 hover:shadow-clinical transition-shadow">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-eu-trust-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Wie starte ich am schnellsten?
            </h3>
            <p className="text-sm text-gray-700">
              ROI in kurzer Zeit prüfen oder eine kurze Anfrage senden – wir melden uns mit einem konkreten Vorschlag.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/roi" className="btn-trust">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            ROI prüfen
          </Link>
          <Link to="/kontakt" className="btn-secondary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Kontakt aufnehmen
          </Link>
        </div>
      </RevealOnScroll>
    </div>
  );
};

export default HomePage;
