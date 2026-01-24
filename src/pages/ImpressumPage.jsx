import { useTranslation } from 'react-i18next'

const ImpressumPage = () => {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('impressum.title')}</h1>

        <div className="prose prose-blue max-w-none">
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Angaben zum Anbieter</h2>
          <p className="text-gray-700">
            DiggAiHH UG<br />
            Jasminstraße 24<br />
            44289 Dortmund<br />
            Deutschland
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Kontakt</h2>
          <p className="text-gray-700">
            E-Mail: laith.alshdaifat@hotmail.com<br />
            Telefon: +49 1521 3814065
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-3">Verantwortlich für den Inhalt</h2>
          <p className="text-gray-700">
            Laith Alshdaifat<br />
            Angelnstraße 1<br />
            22049 Hamburg<br />
            Deutschland
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
