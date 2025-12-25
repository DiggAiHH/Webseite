const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-medical-blue-600 to-medical-blue-800 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Willkommen bei DiggAiHH
        </h1>
        <p className="text-xl md:text-2xl text-medical-blue-100 mb-8">
          Ihre MedTech SaaS-Lösung für intelligente Prozessoptimierung
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="/praxis-manager" className="btn-primary bg-white text-medical-blue-700 hover:bg-gray-100">
            Praxis Manager starten
          </a>
          <a href="/anamnese" className="btn-secondary bg-medical-accent-600 text-white hover:bg-medical-accent-700 border-2 border-white">
            Online-Anamnese
          </a>
          <a href="/ai-god-mode" className="btn-secondary bg-medical-blue-700 text-white hover:bg-medical-blue-800 border-2 border-white">
            AI God Mode
          </a>
        </div>
      </section>

      {/* New Services - Leistungen */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Unsere Leistungen</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card hover:shadow-lg transition-shadow border-l-4 border-l-medical-blue-600">
            <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🏥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Praxis Verwaltung Manager
            </h3>
            <p className="text-gray-600 mb-4">
              Zentrale Steuerung Ihrer Praxis: Terminplanung, Patientenverwaltung 
              und Ressourcenoptimierung in einem System.
            </p>
            <a href="/praxis-manager" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
              Mehr erfahren →
            </a>
          </div>

          <div className="card hover:shadow-lg transition-shadow border-l-4 border-l-medical-accent-600">
            <div className="w-12 h-12 bg-medical-accent-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI Daten-Check & Anonymisator
            </h3>
            <p className="text-gray-600 mb-4">
              KI-gestützte Analyse und Anonymisierung personenbezogener Daten. 
              DSGVO-konforme Verarbeitung.
            </p>
            <a href="/ai-daten-check" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
              Mehr erfahren →
            </a>
          </div>

          <div className="card hover:shadow-lg transition-shadow border-l-4 border-l-purple-600">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Kiosk-Systeme für Praxen
            </h3>
            <p className="text-gray-600 mb-4">
              Self-Service-Terminals für Patientenanmeldung, Warteschlangen-Management 
              und digitale Formulare.
            </p>
            <a href="/kiosk" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
              Mehr erfahren →
            </a>
          </div>

          <div className="card hover:shadow-lg transition-shadow border-l-4 border-l-orange-600">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Online-Anamnese mit KI
            </h3>
            <p className="text-gray-600 mb-4">
              Intelligente Vorab-Befragung mit KI-Analyse und automatischer 
              Terminempfehlung für optimale Ressourcenplanung.
            </p>
            <a href="/anamnese" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
              Mehr erfahren →
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔧 Weitere Tools</h2>
        <div className="grid md:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-medical-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Lageroptimierung mit MHD
          </h3>
          <p className="text-gray-600 mb-4">
            Intelligente Bestandsverwaltung mit automatischer Ablaufdatum-Überwachung,
            Chargenverfolgung und MDR-konformer Dokumentation.
          </p>
          <a href="/lageropt" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
            Mehr erfahren →
          </a>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-medical-accent-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-medical-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            ROI-Rechner
          </h3>
          <p className="text-gray-600 mb-4">
            Berechnen Sie den Return on Investment mit Fokus auf Arbeitszeit-Einsparungen.
            Inklusive 12-Monats-Visualisierung.
          </p>
          <a href="/roi" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
            Mehr erfahren →
          </a>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Praxis-Twin
          </h3>
          <p className="text-gray-600 mb-4">
            Gamification-System: Bauen Sie Ihre digitale Praxis spielerisch auf.
            Drag & Drop Module für Level-Fortschritt.
          </p>
          <a href="/praxis-twin" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
            Mehr erfahren →
          </a>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-medical-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            AI God Mode
          </h3>
          <p className="text-gray-600 mb-4">
            Intelligenter Requirements Wizard: Erstellen Sie strukturierte Lastenhefte
            mit automatischer JSON-Generierung.
          </p>
          <a href="/ai-god-mode" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
            Mehr erfahren →
          </a>
        </div>

        <div className="card hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-medical-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Avatar-System
          </h3>
          <p className="text-gray-600 mb-4">
            Personalisierte Assistenten und virtuelle Berater für Ihre medizinischen
            Prozesse und Patienteninteraktion.
          </p>
          <a href="/avatar" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
            Mehr erfahren →
          </a>
        </div>
        </div>
      </section>

      {/* Security & Compliance Badge */}
      <section className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-medical-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-medical-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              DSGVO-konform & Sicher
            </h3>
            <p className="text-gray-600">
              Alle Daten werden nach höchsten deutschen und europäischen Datenschutzstandards verarbeitet.
              Ihre Sicherheit ist unsere Priorität.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
