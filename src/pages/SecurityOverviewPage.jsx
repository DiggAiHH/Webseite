const SecurityOverviewPage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Sicherheit (Übersicht)</h1>
        <p className="text-gray-600 mb-8">
          Für medizinische Einrichtungen ist Informationssicherheit zentral. Diese Seite gibt einen kompakten Überblick über unsere Sicherheits- und Datenschutzprinzipien.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Grundprinzipien</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Privacy by Design & Datenminimierung</li>
              <li>Least Privilege & rollenbasierte Zugriffe</li>
              <li>Sichere Defaults (Restriktive Konfigurationen)</li>
              <li>Nachvollziehbarkeit ohne unnötige PII-Logs</li>
            </ul>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Technische Maßnahmen (Auszug)</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Security-Header & Content-Security-Policy</li>
              <li>Transportverschlüsselung (TLS) bei produktiver Bereitstellung</li>
              <li>Input-Validierung & sichere Verarbeitung</li>
              <li>Rate-Limits für Anfrage-Endpunkte</li>
            </ul>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Compliance-Orientierung</h2>
            <p className="text-gray-700 mb-2">
              Unsere internen Leitlinien orientieren sich u.a. an:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>DSGVO (Art. 25, Art. 32)</li>
              <li>ISO/IEC 27001 (ISMS-orientierte Controls)</li>
              <li>BSI IT-Grundschutz (Prinzipien & Basisschutz)</li>
            </ul>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-lg p-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Transparenz</h2>
            <p className="text-gray-700">
              Detaildokumente sind im Projekt vorhanden (z.B. DSGVO/ISO/BSI). Diese Seite ist eine Übersicht – konkrete Vertrags-/AVV-Unterlagen stellen wir auf Anfrage bereit.
            </p>
          </section>
        </div>

        <div className="mt-8 bg-medical-blue-50 border border-medical-blue-200 rounded-lg p-5">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Wichtiger Hinweis</h2>
          <p className="text-gray-700">
            Bitte übermitteln Sie über Website/Formulare keine Gesundheitsdaten. Für sicherheitsrelevante Meldungen nutzen Sie den Kontaktweg im Impressum.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SecurityOverviewPage
