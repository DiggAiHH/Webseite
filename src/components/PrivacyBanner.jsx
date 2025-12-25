import { useState } from 'react';
import { usePrivacyConsent } from '../utils/privacy';

/**
 * PrivacyBanner Component
 * DSGVO-compliant cookie consent banner
 */
const PrivacyBanner = () => {
  const { consent, updateConsent, hasConsented } = usePrivacyConsent();
  const [showDetails, setShowDetails] = useState(false);

  if (hasConsented) {
    return null;
  }

  const handleAcceptAll = () => {
    updateConsent({
      essential: true,
      analytics: true,
      marketing: true
    });
  };

  const handleAcceptEssential = () => {
    updateConsent({
      essential: true,
      analytics: false,
      marketing: false
    });
  };

  const handleCustomSave = (analytics, marketing) => {
    updateConsent({
      essential: true,
      analytics,
      marketing
    });
    setShowDetails(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-medical-blue-600 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto p-6">
        {!showDetails ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Datenschutz & Cookies
              </h3>
              <p className="text-sm text-gray-600">
                Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche 
                Nutzererfahrung zu bieten und unsere Dienste zu verbessern. Weitere Informationen 
                finden Sie in unserer{' '}
                <a href="/privacy" className="text-medical-blue-600 hover:underline">
                  Datenschutzerklärung
                </a>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Einstellungen
              </button>
              <button
                onClick={handleAcceptEssential}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Nur notwendige
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 bg-medical-blue-600 text-white rounded-md hover:bg-medical-blue-700 transition-colors text-sm font-medium"
              >
                Alle akzeptieren
              </button>
            </div>
          </div>
        ) : (
          <PrivacyDetails
            onSave={handleCustomSave}
            onBack={() => setShowDetails(false)}
          />
        )}
      </div>
    </div>
  );
};

/**
 * PrivacyDetails Component
 * Detailed cookie settings
 */
const PrivacyDetails = ({ onSave, onBack }) => {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-medical-blue-600 hover:text-medical-blue-700 text-sm font-medium"
        >
          ← Zurück
        </button>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cookie-Einstellungen
      </h3>
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={true}
            disabled
            className="mt-1 h-4 w-4 text-medical-blue-600 rounded"
          />
          <div className="ml-3">
            <label className="font-medium text-gray-900">Notwendige Cookies</label>
            <p className="text-sm text-gray-600">
              Diese Cookies sind für die Grundfunktionen der Website erforderlich und können 
              nicht deaktiviert werden.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="mt-1 h-4 w-4 text-medical-blue-600 rounded"
          />
          <div className="ml-3">
            <label className="font-medium text-gray-900">Analyse-Cookies</label>
            <p className="text-sm text-gray-600">
              Helfen uns zu verstehen, wie Besucher mit der Website interagieren, 
              um die Nutzererfahrung zu verbessern.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="mt-1 h-4 w-4 text-medical-blue-600 rounded"
          />
          <div className="ml-3">
            <label className="font-medium text-gray-900">Marketing-Cookies</label>
            <p className="text-sm text-gray-600">
              Werden verwendet, um Besuchern relevante Werbung und Marketing-Kampagnen 
              anzubieten.
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => onSave(analytics, marketing)}
          className="px-6 py-2 bg-medical-blue-600 text-white rounded-md hover:bg-medical-blue-700 transition-colors text-sm font-medium"
        >
          Einstellungen speichern
        </button>
      </div>
    </div>
  );
};

/**
 * PrivacyStatusIndicator Component
 * Shows current privacy status in header
 */
export const PrivacyStatusIndicator = () => {
  const { consent, hasConsented } = usePrivacyConsent();

  if (!hasConsented) {
    return null;
  }

  const activeCount = [consent.essential, consent.analytics, consent.marketing]
    .filter(Boolean).length;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <svg
        className="w-4 h-4 text-medical-accent-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
      <span>DSGVO ({activeCount}/3)</span>
    </div>
  );
};

export default PrivacyBanner;
