import LeadForm from '../components/LeadForm'
import { Link } from 'react-router-dom'

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Kontakt</h1>
        <p className="text-gray-600 mb-8">
          Für Praxen, MVZ und medizinische Einrichtungen: Senden Sie uns kurz Ihre Anfrage – wir melden uns mit einem konkreten Vorschlag.
        </p>

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
                  <p>Wir melden uns zeitnah mit Rückfragen oder einem konkreten Vorschlag. Wenn es besonders dringend ist, schreiben Sie das bitte in die Nachricht.</p>
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
              <p><span className="font-medium">E-Mail:</span> kontakt@diggaihh.de</p>
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
