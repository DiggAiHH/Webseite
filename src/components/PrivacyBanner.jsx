import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePrivacyConsent } from '../utils/privacy';

/**
 * PrivacyBanner Component
 * DSGVO-compliant cookie consent banner with ARIA accessibility and focus trap
 */
const PrivacyBanner = () => {
  const { updateConsent, hasConsented, isHydrated } = usePrivacyConsent();
  const [showDetails, setShowDetails] = useState(false);
  const bannerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // Focus trap: Focus first button when banner appears
  useEffect(() => {
    if (isHydrated && !hasConsented && firstFocusableRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isHydrated, hasConsented]);

  // Handle Escape key to accept essential only
  useEffect(() => {
    if (hasConsented) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleAcceptEssential();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasConsented]);

  // Don't render during SSR or before hydration
  if (!isHydrated || hasConsented) {
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
    <div 
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-medical-blue-600 shadow-2xl z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-banner-title"
      aria-describedby="privacy-banner-description"
    >
      <div className="max-w-7xl mx-auto p-6">
        {!showDetails ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 id="privacy-banner-title" className="text-lg font-semibold text-gray-900 mb-2">
                Datenschutz & Cookies
              </h3>
              <p id="privacy-banner-description" className="text-sm text-gray-600">
                Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche 
                Nutzererfahrung zu bieten und unsere Dienste zu verbessern. Weitere Informationen 
                finden Sie in unserer{' '}
                <Link to="/privacy" className="text-medical-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-medical-blue-500 rounded">
                  Datenschutzerklärung
                </Link>
                . <span className="text-xs text-gray-500">(Escape = nur notwendige)</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3" role="group" aria-label="Cookie-Einstellungen">
              <button
                ref={firstFocusableRef}
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500"
                aria-expanded={showDetails}
                aria-controls="privacy-details"
              >
                Einstellungen
              </button>
              <button
                onClick={handleAcceptEssential}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500"
              >
                Nur notwendige
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2 bg-medical-blue-600 text-white rounded-md hover:bg-medical-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500"
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
 * Detailed cookie settings with ARIA labels
 */
const PrivacyDetails = ({ onSave, onBack }) => {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div id="privacy-details" role="region" aria-label="Detaillierte Cookie-Einstellungen">
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-medical-blue-600 hover:text-medical-blue-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-medical-blue-500 rounded"
          aria-label="Zurück zur Übersicht"
        >
          ← Zurück
        </button>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cookie-Einstellungen
      </h3>
      <fieldset className="space-y-4 mb-6">
        <legend className="sr-only">Wählen Sie Ihre Cookie-Präferenzen</legend>
        <div className="flex items-start">
          <input
            type="checkbox"
            id="essential-cookies"
            checked={true}
            disabled
            className="mt-1 h-4 w-4 text-medical-blue-600 rounded border-gray-300"
            aria-describedby="essential-cookies-description"
          />
          <div className="ml-3">
            <label htmlFor="essential-cookies" className="font-medium text-gray-900">Notwendige Cookies</label>
            <p id="essential-cookies-description" className="text-sm text-gray-600">
              Diese Cookies sind für die Grundfunktionen der Website erforderlich und können 
              nicht deaktiviert werden.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <input
            type="checkbox"
            id="analytics-cookies"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="mt-1 h-4 w-4 text-medical-blue-600 rounded border-gray-300 focus:ring-medical-blue-500"
            aria-describedby="analytics-cookies-description"
          />
          <div className="ml-3">
            <label htmlFor="analytics-cookies" className="font-medium text-gray-900">Analyse-Cookies</label>
            <p id="analytics-cookies-description" className="text-sm text-gray-600">
              Helfen uns zu verstehen, wie Besucher mit der Website interagieren, 
              um die Nutzererfahrung zu verbessern.
            </p>
          </div>
        </div>
        <div className="flex items-start">
          <input
            type="checkbox"
            id="marketing-cookies"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="mt-1 h-4 w-4 text-medical-blue-600 rounded border-gray-300 focus:ring-medical-blue-500"
            aria-describedby="marketing-cookies-description"
          />
          <div className="ml-3">
            <label htmlFor="marketing-cookies" className="font-medium text-gray-900">Marketing-Cookies</label>
            <p id="marketing-cookies-description" className="text-sm text-gray-600">
              Werden verwendet, um Besuchern relevante Werbung und Marketing-Kampagnen 
              anzubieten.
            </p>
          </div>
        </div>
      </fieldset>
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => onSave(analytics, marketing)}
          className="px-6 py-2 bg-medical-blue-600 text-white rounded-md hover:bg-medical-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-blue-500"
        >
          Einstellungen speichern
        </button>
      </div>
    </div>
  );
};

/**
 * PrivacyStatusIndicator Component
 * Shows current privacy status in header with ARIA
 */
export const PrivacyStatusIndicator = () => {
  const { consent, hasConsented } = usePrivacyConsent();

  if (!hasConsented) {
    return null;
  }

  const activeCount = [consent.essential, consent.analytics, consent.marketing]
    .filter(Boolean).length;

  return (
    <div 
      className="flex items-center gap-2 text-xs text-gray-600"
      role="status"
      aria-label={`DSGVO-Einstellungen: ${activeCount} von 3 Cookie-Kategorien aktiviert`}
    >
      <svg
        className="w-4 h-4 text-medical-accent-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
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
