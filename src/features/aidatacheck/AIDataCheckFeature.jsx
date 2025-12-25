import { useState } from 'react';
import { validateTextInput } from '../../utils/security';

/**
 * AIDataCheckFeature Component
 * AI-powered data validation and anonymization system
 * DSGVO-compliant patient data handling with automatic PII detection
 */
const AIDataCheckFeature = () => {
  const [inputData, setInputData] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [anonymizedData, setAnonymizedData] = useState('');

  // Simulate PII detection patterns
  const piiPatterns = [
    { type: 'name', pattern: /\b[A-ZÄÖÜ][a-zäöüß]+\s+[A-ZÄÖÜ][a-zäöüß]+\b/g, label: 'Name' },
    { type: 'email', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, label: 'E-Mail' },
    { type: 'phone', pattern: /(\+49|0)\s?[\d\s/-]{8,}/g, label: 'Telefonnummer' },
    { type: 'date', pattern: /\b\d{1,2}[./]\d{1,2}[./]\d{2,4}\b/g, label: 'Geburtsdatum' },
    { type: 'address', pattern: /\b\d{5}\s+[A-ZÄÖÜ][a-zäöüß]+\b/g, label: 'PLZ/Ort' },
    { type: 'insurance', pattern: /\b[A-Z]\d{9}\b/g, label: 'Versicherungsnummer' },
  ];

  const handleAnalyze = () => {
    const validation = validateTextInput(inputData, 10000);
    if (!validation.isValid) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const findings = [];
      let anonymized = validation.sanitized;

      piiPatterns.forEach(({ type, pattern, label }) => {
        const matches = validation.sanitized.match(pattern);
        if (matches) {
          matches.forEach(match => {
            findings.push({
              type,
              label,
              value: match,
              risk: type === 'name' || type === 'insurance' ? 'high' : 'medium'
            });
            // Replace with anonymized placeholder
            anonymized = anonymized.replace(match, `[${label.toUpperCase()}]`);
          });
        }
      });

      setAnalysisResult({
        totalFindings: findings.length,
        findings,
        riskScore: findings.filter(f => f.risk === 'high').length > 0 ? 'high' : 
                   findings.length > 0 ? 'medium' : 'low',
        timestamp: new Date().toISOString()
      });
      setAnonymizedData(anonymized);
      setIsProcessing(false);
    }, 1500);
  };

  const handleReset = () => {
    setInputData('');
    setAnalysisResult(null);
    setAnonymizedData('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Daten-Check & Anonymisator
        </h1>
        <p className="text-gray-600">
          KI-gestützte Analyse und Anonymisierung personenbezogener Daten. 
          DSGVO-konforme Verarbeitung mit automatischer PII-Erkennung.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Daten-Eingabe
          </h2>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500 font-mono text-sm"
            placeholder="Fügen Sie hier den zu analysierenden Text ein...&#10;&#10;Beispiel:&#10;Patient: Max Mustermann&#10;Geb.: 15.03.1985&#10;Tel.: +49 170 1234567&#10;E-Mail: max.mustermann@example.de&#10;Adresse: Musterstraße 1, 20095 Hamburg"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAnalyze}
              disabled={!inputData.trim() || isProcessing}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analysiere...
                </span>
              ) : (
                '🔍 Daten analysieren'
              )}
            </button>
            <button onClick={handleReset} className="btn-secondary">
              Zurücksetzen
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Analyse-Ergebnis
          </h2>
          
          {analysisResult ? (
            <div className="space-y-4">
              {/* Risk Score */}
              <div className={`p-4 rounded-lg ${
                analysisResult.riskScore === 'high' ? 'bg-red-50 border border-red-200' :
                analysisResult.riskScore === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-medical-accent-50 border border-medical-accent-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Datenschutz-Risiko:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    analysisResult.riskScore === 'high' ? 'bg-red-100 text-red-800' :
                    analysisResult.riskScore === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-medical-accent-100 text-medical-accent-800'
                  }`}>
                    {analysisResult.riskScore === 'high' ? 'Hoch' :
                     analysisResult.riskScore === 'medium' ? 'Mittel' : 'Niedrig'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {analysisResult.totalFindings} personenbezogene Daten gefunden
                </div>
              </div>

              {/* Findings List */}
              {analysisResult.findings.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Gefundene Daten:</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {analysisResult.findings.map((finding, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-900">{finding.label}</span>
                          <span className="text-sm text-gray-600 ml-2">&quot;{finding.value}&quot;</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          finding.risk === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {finding.risk === 'high' ? 'Kritisch' : 'Sensibel'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anonymized Output */}
              {anonymizedData && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Anonymisierte Version:</h3>
                  <div className="p-3 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{anonymizedData}</pre>
                  </div>
                  <button className="mt-3 text-sm text-medical-blue-600 hover:text-medical-blue-700 font-medium">
                    📋 Anonymisierten Text kopieren
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p>Fügen Sie Daten ein, um die KI-Analyse zu starten</p>
            </div>
          )}
        </div>
      </div>

      {/* Feature Info */}
      <div className="mt-8 card bg-medical-blue-50 border-medical-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🛡️ DSGVO-konforme Datenverarbeitung
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Automatische PII-Erkennung:</strong> Namen, Adressen, Telefonnummern, E-Mails</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Pseudonymisierung:</strong> Ersetzen durch sichere Platzhalter</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Risikobewertung:</strong> Automatische Klassifizierung nach Sensibilität</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Audit-Trail:</strong> Dokumentation aller Verarbeitungsschritte</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDataCheckFeature;
