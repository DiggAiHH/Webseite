import { useState } from 'react';
import { validateTextInput, validateNumericInput } from '../../utils/security';

/**
 * AIGodModeFeature Component
 * Requirements wizard for creating structured software specifications
 * Prepares for Google Gemini Pro API integration for AI-assisted requirement generation
 */
const AIGodModeFeature = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    projectName: '',
    practiceType: '',
    practiceSize: '',
    
    // Step 2: Requirements
    mainGoal: '',
    painPoints: '',
    musthaveFeatures: '',
    nicetohaveFeatures: '',
    
    // Step 3: Technical
    existingSystems: '',
    integrationNeeds: '',
    securityRequirements: '',
    
    // Step 4: Budget & Timeline
    budget: '',
    timeline: '',
    priority: 'balanced'
  });

  const [errors, setErrors] = useState({});
  const [generatedSpec, setGeneratedSpec] = useState(null);

  const totalSteps = 4;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: {
        const projectNameValidation = validateTextInput(formData.projectName, 100);
        if (!projectNameValidation.isValid) {
          newErrors.projectName = projectNameValidation.error;
        }
        if (!formData.practiceType) {
          newErrors.practiceType = 'Bitte wählen Sie einen Praxistyp';
        }
        const practiceSizeValidation = validateNumericInput(formData.practiceSize, 1, 1000);
        if (!practiceSizeValidation.isValid) {
          newErrors.practiceSize = practiceSizeValidation.error;
        }
        break;
      }

      case 2: {
        const goalValidation = validateTextInput(formData.mainGoal, 500);
        if (!goalValidation.isValid) {
          newErrors.mainGoal = goalValidation.error;
        }
        const painPointsValidation = validateTextInput(formData.painPoints, 1000);
        if (!painPointsValidation.isValid) {
          newErrors.painPoints = painPointsValidation.error;
        }
        const musthaveValidation = validateTextInput(formData.musthaveFeatures, 1000);
        if (!musthaveValidation.isValid) {
          newErrors.musthaveFeatures = musthaveValidation.error;
        }
        break;
      }

      case 3: {
        const existingValidation = validateTextInput(formData.existingSystems, 500);
        if (!existingValidation.isValid) {
          newErrors.existingSystems = existingValidation.error;
        }
        break;
      }

      case 4: {
        const budgetValidation = validateNumericInput(formData.budget, 0, 10000000);
        if (!budgetValidation.isValid) {
          newErrors.budget = budgetValidation.error;
        }
        const timelineValidation = validateNumericInput(formData.timeline, 1, 120);
        if (!timelineValidation.isValid) {
          newErrors.timeline = timelineValidation.error;
        }
        break;
      }

      default:
        break;
    }

    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate structured specification
    const specification = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        source: 'DiggAiHH AI God Mode'
      },
      project: {
        name: formData.projectName,
        type: formData.practiceType,
        size: parseInt(formData.practiceSize)
      },
      requirements: {
        mainGoal: formData.mainGoal,
        painPoints: formData.painPoints.split('\n').filter(p => p.trim()),
        mustHave: formData.musthaveFeatures.split('\n').filter(f => f.trim()),
        niceToHave: formData.nicetohaveFeatures.split('\n').filter(f => f.trim())
      },
      technical: {
        existingSystems: formData.existingSystems.split('\n').filter(s => s.trim()),
        integrationNeeds: formData.integrationNeeds.split('\n').filter(n => n.trim()),
        security: formData.securityRequirements.split('\n').filter(r => r.trim())
      },
      constraints: {
        budget: parseInt(formData.budget),
        timelineMonths: parseInt(formData.timeline),
        priority: formData.priority
      },
      compliance: {
        gdpr: true,
        mdr: formData.practiceType.includes('Arzt') || formData.practiceType.includes('Klinik'),
        mpdg: formData.practiceType.includes('Arzt') || formData.practiceType.includes('Klinik')
      },
      // Placeholder for future AI-generated content
      aiGenerated: {
        description: `Basierend auf Ihrer Eingabe empfehlen wir eine maßgeschneiderte Lösung für ${formData.projectName}. Die Lösung sollte ${formData.mainGoal} adressieren und die identifizierten Schmerzpunkte lösen.`,
        recommendations: [
          'Implementierung einer DSGVO-konformen Datenverwaltung',
          'Integration mit bestehenden Systemen',
          'Schrittweise Einführung zur Minimierung von Störungen',
          'Schulung des Personals als integraler Bestandteil'
        ],
        // Future: This would be generated by Google Gemini Pro
        geminiProIntegration: 'PLACEHOLDER_FOR_AI_GENERATION'
      }
    };

    setGeneratedSpec(specification);
  };

  const handleDownloadJSON = () => {
    if (!generatedSpec) return;

    // Sanitize filename more thoroughly
    const sanitizedName = formData.projectName
      .replace(/[^a-zA-Z0-9\s\-_äöüÄÖÜß]/g, '') // Remove special chars except spaces, hyphens, underscores, and German umlauts
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .substring(0, 50); // Limit length

    const dataStr = JSON.stringify(generatedSpec, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedName}_specification.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData({
      projectName: '',
      practiceType: '',
      practiceSize: '',
      mainGoal: '',
      painPoints: '',
      musthaveFeatures: '',
      nicetohaveFeatures: '',
      existingSystems: '',
      integrationNeeds: '',
      securityRequirements: '',
      budget: '',
      timeline: '',
      priority: 'balanced'
    });
    setErrors({});
    setGeneratedSpec(null);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI God Mode: Requirements Wizard
        </h1>
        <p className="text-gray-600">
          Erstellen Sie ein strukturiertes Lastenheft durch Beantwortung gezielter Fragen. 
          Das System generiert automatisch eine JSON-Spezifikation für Ihr Projekt.
        </p>
      </div>

      {!generatedSpec ? (
        <div className="card">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Schritt {currentStep} von {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% abgeschlossen
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-medical-blue-500 to-medical-accent-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Grundinformationen
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projektname *
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B. Digitale Patientenakte 2.0"
                  />
                  {errors.projectName && (
                    <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Praxistyp *
                  </label>
                  <select
                    name="practiceType"
                    value={formData.practiceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="Hausarztpraxis">Hausarztpraxis</option>
                    <option value="Facharztpraxis">Facharztpraxis</option>
                    <option value="Zahnarztpraxis">Zahnarztpraxis</option>
                    <option value="Krankenhaus">Krankenhaus</option>
                    <option value="MVZ">Medizinisches Versorgungszentrum (MVZ)</option>
                    <option value="Klinik">Klinik</option>
                    <option value="Andere">Andere Einrichtung</option>
                  </select>
                  {errors.practiceType && (
                    <p className="mt-1 text-sm text-red-600">{errors.practiceType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anzahl Mitarbeiter *
                  </label>
                  <input
                    type="number"
                    name="practiceSize"
                    value={formData.practiceSize}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B. 15"
                  />
                  {errors.practiceSize && (
                    <p className="mt-1 text-sm text-red-600">{errors.practiceSize}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Requirements */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Anforderungen & Ziele
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hauptziel des Projekts *
                  </label>
                  <textarea
                    name="mainGoal"
                    value={formData.mainGoal}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B. Digitalisierung der Patientenverwaltung zur Effizienzsteigerung"
                  />
                  {errors.mainGoal && (
                    <p className="mt-1 text-sm text-red-600">{errors.mainGoal}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aktuelle Schmerzpunkte (einer pro Zeile) *
                  </label>
                  <textarea
                    name="painPoints"
                    value={formData.painPoints}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B.&#10;Manuelle Dateneingabe kostet viel Zeit&#10;Fehlende Integration zwischen Systemen&#10;Compliance-Anforderungen schwer nachzuvollziehen"
                  />
                  {errors.painPoints && (
                    <p className="mt-1 text-sm text-red-600">{errors.painPoints}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Must-Have Features (einer pro Zeile) *
                  </label>
                  <textarea
                    name="musthaveFeatures"
                    value={formData.musthaveFeatures}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B.&#10;DSGVO-konforme Datenspeicherung&#10;Terminverwaltung&#10;Patientenakte digital"
                  />
                  {errors.musthaveFeatures && (
                    <p className="mt-1 text-sm text-red-600">{errors.musthaveFeatures}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nice-to-Have Features (einer pro Zeile)
                  </label>
                  <textarea
                    name="nicetohaveFeatures"
                    value={formData.nicetohaveFeatures}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B.&#10;Mobile App für Patienten&#10;KI-gestützte Diagnoseunterstützung"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Technical Requirements */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Technische Anforderungen
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bestehende Systeme (eines pro Zeile) *
                  </label>
                  <textarea
                    name="existingSystems"
                    value={formData.existingSystems}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B.&#10;Praxisverwaltungssoftware XYZ&#10;Abrechnungssystem ABC&#10;Keine (bei Neuaufbau)"
                  />
                  {errors.existingSystems && (
                    <p className="mt-1 text-sm text-red-600">{errors.existingSystems}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Integrationsbedarf (eines pro Zeile)
                  </label>
                  <textarea
                    name="integrationNeeds"
                    value={formData.integrationNeeds}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B.&#10;KV-System Anbindung&#10;Labor-Schnittstelle&#10;E-Rezept Integration"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sicherheitsanforderungen (eines pro Zeile)
                  </label>
                  <textarea
                    name="securityRequirements"
                    value={formData.securityRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B.&#10;Ende-zu-Ende Verschlüsselung&#10;Zwei-Faktor-Authentifizierung&#10;Audit-Logging"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Budget & Timeline */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Budget & Zeitplan
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verfügbares Budget (€) *
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B. 50000"
                  />
                  {errors.budget && (
                    <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gewünschter Zeitrahmen (Monate) *
                  </label>
                  <input
                    type="number"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    placeholder="z.B. 6"
                  />
                  {errors.timeline && (
                    <p className="mt-1 text-sm text-red-600">{errors.timeline}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Projektpriorität
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                  >
                    <option value="speed">Geschwindigkeit (schnelle Umsetzung)</option>
                    <option value="quality">Qualität (höchste Standards)</option>
                    <option value="cost">Kosten (budgetoptimiert)</option>
                    <option value="balanced">Ausgewogen (alle Faktoren berücksichtigt)</option>
                  </select>
                </div>

                <div className="bg-medical-blue-50 border border-medical-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">🤖 KI-Integration (Coming Soon)</h3>
                  <p className="text-sm text-gray-700">
                    In zukünftigen Versionen wird Google Gemini Pro Ihre Eingaben analysieren und 
                    automatisch detaillierte Spezifikationen, Architekturvorschläge und 
                    Implementierungspläne generieren.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Zurück
            </button>

            <div className="flex gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step === currentStep
                      ? 'bg-medical-blue-600'
                      : step < currentStep
                      ? 'bg-medical-accent-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 btn-primary"
              >
                Weiter
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                className="px-6 py-2 bg-medical-accent-600 text-white rounded-md hover:bg-medical-accent-700 transition-colors font-medium"
              >
                Spezifikation generieren
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Generated Specification Display */
        <div className="space-y-6">
          <div className="card bg-medical-accent-50 border-medical-accent-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-medical-accent-600 rounded-full flex items-center justify-center text-white text-2xl">
                ✓
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Spezifikation erstellt!</h2>
                <p className="text-gray-600">Ihre strukturierte Projektspezifikation wurde generiert.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projektübersicht</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Projekt:</span>
                <span className="ml-2 text-gray-900">{generatedSpec.project.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Typ:</span>
                <span className="ml-2 text-gray-900">{generatedSpec.project.type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Mitarbeiter:</span>
                <span className="ml-2 text-gray-900">{generatedSpec.project.size}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Budget:</span>
                <span className="ml-2 text-gray-900">{generatedSpec.constraints.budget.toLocaleString('de-DE')} €</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Zeitrahmen:</span>
                <span className="ml-2 text-gray-900">{generatedSpec.constraints.timelineMonths} Monate</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Priorität:</span>
                <span className="ml-2 text-gray-900 capitalize">{generatedSpec.constraints.priority}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance-Status</h3>
            <div className="flex flex-wrap gap-3">
              {generatedSpec.compliance.gdpr && (
                <span className="px-3 py-1 bg-medical-accent-100 text-medical-accent-800 rounded-full text-sm font-medium">
                  ✓ DSGVO-konform
                </span>
              )}
              {generatedSpec.compliance.mdr && (
                <span className="px-3 py-1 bg-medical-blue-100 text-medical-blue-800 rounded-full text-sm font-medium">
                  ✓ MDR-relevant
                </span>
              )}
              {generatedSpec.compliance.mpdg && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  ✓ MPDG zu beachten
                </span>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">JSON-Vorschau</h3>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(generatedSpec, null, 2)}
            </pre>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDownloadJSON}
              className="flex-1 btn-primary"
            >
              📥 JSON herunterladen
            </button>
            <button
              onClick={handleReset}
              className="flex-1 btn-secondary"
            >
              🔄 Neue Spezifikation erstellen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGodModeFeature;
