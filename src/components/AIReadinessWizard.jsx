import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

/**
 * AI-Readiness-Check Wizard
 * Futuristischer, klinisch-minimaler Einstieg für Praxen/Kliniken
 * @component
 */

const WIZARD_STEPS = [
  {
    id: 'size',
    question: 'Wie groß ist Ihre Einrichtung?',
    options: [
      { value: 'solo', label: 'Einzelpraxis', score: 1 },
      { value: 'small', label: 'Gemeinschaftspraxis (2-5)', score: 2 },
      { value: 'mvz', label: 'MVZ / Klinik', score: 3 },
    ],
  },
  {
    id: 'digitalization',
    question: 'Wie digital arbeiten Sie aktuell?',
    options: [
      { value: 'paper', label: 'Überwiegend Papier', score: 1 },
      { value: 'mixed', label: 'Gemischt (PVS + Papier)', score: 2 },
      { value: 'digital', label: 'Vollständig digital', score: 3 },
    ],
  },
  {
    id: 'pain',
    question: 'Was ist Ihr größtes Problem?',
    options: [
      { value: 'time', label: 'Zeitaufwand & Überstunden', score: 'time' },
      { value: 'compliance', label: 'DSGVO / Dokumentation', score: 'compliance' },
      { value: 'costs', label: 'Kosten & Ressourcen', score: 'costs' },
    ],
  },
]

const RECOMMENDATIONS = {
  time: {
    title: 'Effizienz-Fokus',
    description: 'Automatisierung von Routineaufgaben spart durchschnittlich 8-12 Stunden pro Woche.',
    products: [
      { id: 'praxis-manager', name: 'Praxis Manager', match: 95 },
      { id: 'anamnese', name: 'KI-Anamnese', match: 88 },
      { id: 'kiosk', name: 'Kiosk-System', match: 72 },
    ],
  },
  compliance: {
    title: 'Compliance-Fokus',
    description: 'DSGVO, MDR und BSI-Grundschutz automatisch dokumentiert und überwacht.',
    products: [
      { id: 'ai-daten-check', name: 'AI Daten-Check', match: 98 },
      { id: 'praxis-it', name: 'Praxis IT Manager', match: 90 },
      { id: 'lageropt', name: 'Lageroptimierung', match: 75 },
    ],
  },
  costs: {
    title: 'ROI-Fokus',
    description: 'Messbare Einsparungen durch optimierte Prozesse und Ressourcenplanung.',
    products: [
      { id: 'roi', name: 'ROI-Rechner', match: 100 },
      { id: 'lageropt', name: 'Lageroptimierung', match: 85 },
      { id: 'praxis-manager', name: 'Praxis Manager', match: 78 },
    ],
  },
}

export default function AIReadinessWizard({ onComplete, compact = false }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  const currentStep = WIZARD_STEPS[step]
  const progress = ((step + 1) / WIZARD_STEPS.length) * 100

  const handleSelect = useCallback((value, score) => {
    const newAnswers = { ...answers, [currentStep.id]: { value, score } }
    setAnswers(newAnswers)

    if (step < WIZARD_STEPS.length - 1) {
      setStep(step + 1)
    } else {
      setShowResult(true)
      onComplete?.(newAnswers)
    }
  }, [answers, currentStep, step, onComplete])

  const handleBack = useCallback(() => {
    if (step > 0) setStep(step - 1)
  }, [step])

  const handleReset = useCallback(() => {
    setStep(0)
    setAnswers({})
    setShowResult(false)
  }, [])

  // Calculate recommendation based on pain point
  const getRecommendation = () => {
    const painAnswer = answers.pain?.score || 'time'
    return RECOMMENDATIONS[painAnswer]
  }

  if (showResult) {
    const recommendation = getRecommendation()
    
    return (
      <div className={`${compact ? '' : 'card-clinical'} animate-in`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-medical-accent-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-medical-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ihre Empfehlung</h3>
            <p className="text-sm text-medical-accent-600 font-medium">{recommendation.title}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{recommendation.description}</p>

        <div className="space-y-3 mb-6">
          {recommendation.products.map((product) => (
            <Link
              key={product.id}
              to={`/${product.id}`}
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-medical-blue-50 rounded-lg border border-clinical-border transition-all group"
            >
              <span className="font-medium text-gray-900 group-hover:text-medical-blue-700">
                {product.name}
              </span>
              <span className="text-sm font-semibold text-medical-accent-600">
                {product.match}% Match
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/kontakt" className="btn-trust">
            Beratung anfragen
          </Link>
          <button onClick={handleReset} className="btn-secondary">
            Neu starten
          </button>
        </div>

        {/* EU Trust Badges */}
        <div className="mt-6 pt-4 border-t border-clinical-border">
          <div className="flex flex-wrap gap-2">
            <span className="badge-dsgvo">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              DSGVO
            </span>
            <span className="badge-bsi">BSI-Grundschutz</span>
            <span className="badge-iso">ISO 27001</span>
            <span className="badge-eu">EU AI Act Ready</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${compact ? '' : 'card-clinical'} animate-in`}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Schritt {step + 1} von {WIZARD_STEPS.length}
          </span>
          <span className="text-sm text-medical-blue-600 font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-trust rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {currentStep.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentStep.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value, option.score)}
            className="w-full text-left p-4 bg-gray-50 hover:bg-medical-blue-50 border border-clinical-border hover:border-medical-blue-300 rounded-lg transition-all group"
          >
            <span className="font-medium text-gray-900 group-hover:text-medical-blue-700">
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {/* Back Button */}
      {step > 0 && (
        <button onClick={handleBack} className="text-sm text-gray-500 hover:text-gray-700">
          ← Zurück
        </button>
      )}

      {/* EU Trust Indicator */}
      <div className="mt-6 pt-4 border-t border-clinical-border">
        <div className="trust-indicator inline-flex">
          <svg className="w-4 h-4 text-medical-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-gray-600">
            Keine Daten gespeichert · EU-konform
          </span>
        </div>
      </div>
    </div>
  )
}
