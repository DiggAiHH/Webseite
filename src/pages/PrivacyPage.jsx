const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Datenschutzerklärung
        </h1>
        
        <div className="prose prose-blue max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Allgemeine Hinweise
            </h3>
            <p className="text-gray-700">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              2. Datenerfassung auf dieser Website
            </h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Wer ist verantwortlich für die Datenerfassung?
            </h3>
            <p className="text-gray-700">
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber
              DiggAiHH. Die Kontaktdaten können Sie dem Impressum entnehmen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              3. Cookies
            </h2>
            <p className="text-gray-700">
              Diese Website nutzt eine Einwilligungsverwaltung. Technisch wird der Consent-Status lokal in Ihrem Browser gespeichert
              (kein Tracking, keine Profilbildung). Je nach Browser-Einstellung können hierfür Cookies oder vergleichbare Speichertechniken
              verwendet werden. In dieser Website wird der Consent-Status insbesondere im localStorage abgelegt.
            </p>
            <div className="bg-medical-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Cookie-Kategorien:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Notwendig:</strong> Speicherung Ihrer Consent-Auswahl (z.B. Schlüssel <code>diggai-privacy-consent</code> inkl. Zeitstempel)</li>
                <li><strong>Analyse:</strong> Aktuell nicht eingesetzt</li>
                <li><strong>Marketing:</strong> Aktuell nicht eingesetzt</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. Kontaktanfragen
            </h2>
            <p className="text-gray-700">
              Wenn Sie uns über das Anfrageformular kontaktieren, verarbeiten wir die von Ihnen eingegebenen Daten zur Bearbeitung Ihrer Anfrage
              und zur Kommunikation mit Ihnen.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Welche Daten werden verarbeitet?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>E-Mail-Adresse (Pflichtfeld)</li>
                <li>Praxis / Einrichtung (Pflichtfeld)</li>
                <li>Telefonnummer (optional)</li>
                <li>Nachricht (optional)</li>
                <li>Produktbezug (optional, z.B. ausgewähltes Produkt)</li>
                <li>Einwilligungsstatus zur Anfragebearbeitung</li>
              </ul>
            </div>
            <p className="text-gray-700 mt-4">
              Die Anfrage wird same-origin an unseren Endpunkt <code>/api/lead</code> übermittelt. Je nach Konfiguration wird die Anfrage per E-Mail
              an ein internes Postfach weitergeleitet. Es erfolgt keine Übermittlung an Dritte zu Werbezwecken.
            </p>
            <p className="text-gray-700">
              Bitte senden Sie über Website/Formulare keine Gesundheitsdaten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              5. Ihre Rechte
            </h2>
            <p className="text-gray-700 mb-3">
              Sie haben nach der DSGVO folgende Rechte:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
              <li>Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Datensicherheit
            </h2>
            <p className="text-gray-700">
              Bei produktiver Bereitstellung erfolgt die Übertragung typischerweise verschlüsselt (TLS/HTTPS). Zusätzlich werden technische
              Schutzmaßnahmen wie Security-Header und Eingabevalidierung eingesetzt. Bitte beachten Sie, dass E-Mails technisch als eigenständiger
              Transportweg gelten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              7. Kontakt
            </h2>
            <p className="text-gray-700">
              Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte können Sie sich jederzeit
              an uns wenden. Die Kontaktdaten finden Sie im Impressum.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              8. Server-Logs (technische Zugriffsdaten)
            </h2>
            <p className="text-gray-700">
              Beim Aufruf der Website können aus technischen Gründen Zugriffsdaten verarbeitet werden (z.B. IP-Adresse, Zeitpunkt, angefragte
              Ressource, User-Agent), um den Betrieb, die Sicherheit und die Fehleranalyse zu gewährleisten.
            </p>
          </section>

          <div className="bg-gray-100 p-4 rounded-lg mt-8">
            <p className="text-sm text-gray-600">
              <strong>Stand:</strong> {new Date().toLocaleDateString('de-DE')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
