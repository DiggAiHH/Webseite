const ImpressumPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Impressum</h1>

        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700">
            <strong>Hinweis:</strong> Bitte ergänzen Sie die folgenden Angaben gemäß § 5 DDG (ehemals TMG) und weiteren einschlägigen Vorgaben.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Angaben zum Anbieter</h2>
          <p className="text-gray-700">
            DiggAiHH<br />
            [Rechtsform / Inhaber]<br />
            [Straße, Hausnummer]<br />
            [PLZ Ort]<br />
            Deutschland
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Kontakt</h2>
          <p className="text-gray-700">
            E-Mail: kontakt@diggaihh.de<br />
            Telefon: [Telefonnummer]
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Verantwortlich für den Inhalt</h2>
          <p className="text-gray-700">
            [Name Verantwortliche Person]<br />
            [Adresse]
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Datenschutz</h2>
          <p className="text-gray-700">
            Informationen zur Verarbeitung personenbezogener Daten finden Sie in der Datenschutzerklärung.
          </p>

          <div className="bg-gray-100 p-4 rounded-lg mt-8">
            <p className="text-sm text-gray-600">
              <strong>Stand:</strong> {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpressumPage
