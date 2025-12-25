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
              Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem
              Endgerät gespeichert werden und die bestimmte Einstellungen und Daten zum Austausch
              mit unserem System über Ihren Browser speichern.
            </p>
            <div className="bg-medical-blue-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Cookie-Kategorien:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Notwendige Cookies:</strong> Essenziell für die Funktionalität der Website</li>
                <li><strong>Analyse-Cookies:</strong> Helfen uns, die Nutzung zu verstehen und zu verbessern</li>
                <li><strong>Marketing-Cookies:</strong> Für personalisierte Werbung (nur mit Ihrer Zustimmung)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              4. Ihre Rechte
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
              5. Datensicherheit
            </h2>
            <p className="text-gray-700">
              Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren
              (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe,
              die von Ihrem Browser unterstützt wird. Alle Daten werden verschlüsselt übertragen
              und gespeichert.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              6. Kontakt
            </h2>
            <p className="text-gray-700">
              Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte können Sie sich jederzeit
              an uns wenden. Die Kontaktdaten finden Sie im Impressum.
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
