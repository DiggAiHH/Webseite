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
          <a href="/lageropt" className="btn-primary bg-white text-medical-blue-700 hover:bg-gray-100">
            Lageroptimierung starten
          </a>
          <a href="/roi" className="btn-secondary bg-medical-blue-700 text-white hover:bg-medical-blue-800 border-2 border-white">
            ROI berechnen
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-medical-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-medical-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Lageroptimierung
          </h3>
          <p className="text-gray-600 mb-4">
            Intelligente Bestandsverwaltung und Optimierung Ihrer medizinischen Lagerbestände
            mit KI-gestützten Vorhersagen.
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
            Berechnen Sie den Return on Investment für Ihre digitalen Gesundheitslösungen
            mit präzisen Analysen.
          </p>
          <a href="/roi" className="text-medical-blue-600 hover:text-medical-blue-700 font-medium">
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
