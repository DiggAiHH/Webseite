import LeadForm from '../components/LeadForm'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ContactPage = () => {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('contact.title')}</h1>
        <p className="text-gray-600 mb-8">
          {t('contact.subtitle')}
        </p>

        <div className="inline-flex items-center gap-2 bg-medical-accent-50 border border-medical-accent-200 text-medical-accent-800 rounded-full px-3 py-1 text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-8.75a.75.75 0 00-1.5 0v3.5c0 .414.336.75.75.75h2a.75.75 0 000-1.5h-1.25v-2.75z" clipRule="evenodd" />
          </svg>
          Rueckmeldung in der Regel innerhalb eines Werktags
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-sm text-gray-700">
          <p>
            Ihre Angaben nutzen wir ausschließlich zur Bearbeitung Ihrer Anfrage. Details finden Sie in der{' '}
            <Link to="/privacy" className="text-medical-blue-600 hover:underline">Datenschutzerklärung</Link>.
            Verantwortliche Kontaktdaten stehen im{' '}
            <Link to="/impressum" className="text-medical-blue-600 hover:underline">Impressum</Link>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Anfrageformular</h2>
            <LeadForm />

            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mini‑FAQ</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="font-medium text-gray-900">Wie schnell bekomme ich eine Antwort?</p>
                  <p>In der Regel innerhalb eines Werktags. Wenn es besonders dringend ist, schreiben Sie es bitte direkt in die Nachricht.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Wie geht’s nach dem Absenden weiter?</p>
                  <p>Wir prüfen Ihre Angaben, klären kurz den Bedarf (Ziele, Prozesse, Integration) und schlagen dann die passende Lösung inkl. nächsten Schritten vor.</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Welche Daten sollte ich nicht senden?</p>
                  <p>Bitte keine Gesundheitsdaten oder besonders schützenswerte Inhalte über Website/Formulare übermitteln.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Direkter Kontakt</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">E-Mail (Hauptkontakt):</span> <a href="mailto:diggai@tutanota.de">diggai@tutanota.de</a></p>
              <p><span className="font-medium">Hinweis:</span> Bitte senden Sie keine Gesundheitsdaten über dieses Formular.</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Was hilft uns für ein schnelles Angebot?</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Einrichtungstyp (Praxis/MVZ/Klinik)</li>
                <li>Fachrichtung und Teamgröße</li>
                <li>Gewünschte Lösung(en) und Zeitplan</li>
                <li>Integrationsbedarf (PVS/TI/Schnittstellen)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
