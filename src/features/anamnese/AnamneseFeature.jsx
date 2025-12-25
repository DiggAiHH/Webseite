import { useState } from 'react';

/**
 * AnamneseFeature Component
 * Online anamnesis questionnaire with AI-powered analysis
 * Provides appointment recommendations and resource management
 */
const AnamneseFeature = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const questions = [
    {
      id: 'reason',
      question: 'Was ist der Hauptgrund für Ihren Besuch?',
      type: 'select',
      options: [
        { value: 'acute', label: 'Akute Beschwerden (heute aufgetreten)' },
        { value: 'ongoing', label: 'Anhaltende Beschwerden (mehrere Tage)' },
        { value: 'checkup', label: 'Vorsorgeuntersuchung / Check-up' },
        { value: 'followup', label: 'Nachuntersuchung / Kontrolle' },
        { value: 'prescription', label: 'Rezept / Überweisung' },
      ]
    },
    {
      id: 'symptoms',
      question: 'Welche Symptome haben Sie?',
      type: 'multiselect',
      options: [
        { value: 'pain', label: 'Schmerzen' },
        { value: 'fever', label: 'Fieber' },
        { value: 'fatigue', label: 'Müdigkeit / Erschöpfung' },
        { value: 'breathing', label: 'Atembeschwerden' },
        { value: 'digestive', label: 'Verdauungsprobleme' },
        { value: 'skin', label: 'Hautveränderungen' },
        { value: 'other', label: 'Andere Beschwerden' },
      ]
    },
    {
      id: 'duration',
      question: 'Seit wann bestehen die Beschwerden?',
      type: 'select',
      options: [
        { value: 'today', label: 'Seit heute' },
        { value: 'days', label: '1-3 Tage' },
        { value: 'week', label: '1 Woche' },
        { value: 'weeks', label: 'Mehrere Wochen' },
        { value: 'months', label: 'Länger als 1 Monat' },
      ]
    },
    {
      id: 'painLevel',
      question: 'Wie stark sind Ihre Beschwerden auf einer Skala von 1-10?',
      type: 'scale',
      min: 1,
      max: 10
    },
    {
      id: 'medications',
      question: 'Nehmen Sie aktuell Medikamente?',
      type: 'select',
      options: [
        { value: 'none', label: 'Nein, keine Medikamente' },
        { value: 'occasional', label: 'Gelegentlich (z.B. Schmerzmittel)' },
        { value: 'regular', label: 'Ja, regelmäßig Medikamente' },
        { value: 'many', label: 'Ja, mehrere verschiedene Medikamente' },
      ]
    },
    {
      id: 'conditions',
      question: 'Haben Sie bekannte Vorerkrankungen?',
      type: 'multiselect',
      options: [
        { value: 'none', label: 'Keine bekannten Vorerkrankungen' },
        { value: 'diabetes', label: 'Diabetes' },
        { value: 'hypertension', label: 'Bluthochdruck' },
        { value: 'heart', label: 'Herzerkrankung' },
        { value: 'respiratory', label: 'Atemwegserkrankung' },
        { value: 'other', label: 'Andere chronische Erkrankung' },
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (questionId, value) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      }
      return { ...prev, [questionId]: [...current, value] };
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      analyzeAndRecommend();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const analyzeAndRecommend = () => {
    // AI-powered recommendation logic
    const reason = answers.reason;
    const painLevel = answers.painLevel || 5;
    const duration = answers.duration;
    const symptoms = answers.symptoms || [];

    let urgency = 'normal';
    let appointmentType = 'standard';
    let estimatedDuration = 15;
    let suggestedTimeframe = 'Diese Woche';
    let aiInsights = [];

    // Urgency assessment
    if (reason === 'acute' && painLevel >= 7) {
      urgency = 'high';
      appointmentType = 'urgent';
      suggestedTimeframe = 'Heute';
      aiInsights.push('Hohe Schmerzintensität bei akuten Beschwerden erfordert zeitnahe Behandlung.');
    } else if (reason === 'acute' || painLevel >= 6) {
      urgency = 'medium';
      suggestedTimeframe = 'Innerhalb von 1-2 Tagen';
      aiInsights.push('Akute Beschwerden sollten zeitnah abgeklärt werden.');
    }

    // Duration-based insights
    if (duration === 'months') {
      estimatedDuration = 30;
      aiInsights.push('Bei länger bestehenden Beschwerden empfehlen wir eine ausführliche Untersuchung.');
    } else if (duration === 'weeks') {
      estimatedDuration = 20;
    }

    // Symptom-based insights
    if (symptoms.includes('breathing')) {
      urgency = urgency === 'high' ? 'high' : 'medium';
      aiInsights.push('Atembeschwerden sollten prioritär abgeklärt werden.');
    }

    if (symptoms.includes('fever') && symptoms.includes('pain')) {
      urgency = 'medium';
      aiInsights.push('Die Kombination von Fieber und Schmerzen deutet auf eine mögliche Infektion hin.');
    }

    // Appointment type
    if (reason === 'prescription') {
      appointmentType = 'quick';
      estimatedDuration = 10;
      suggestedTimeframe = 'Flexibel';
      aiInsights.push('Für Rezeptanfragen können Sie auch unseren Online-Service nutzen.');
    } else if (reason === 'checkup') {
      appointmentType = 'checkup';
      estimatedDuration = 45;
      suggestedTimeframe = 'Innerhalb von 2 Wochen';
    }

    setRecommendation({
      urgency,
      appointmentType,
      estimatedDuration,
      suggestedTimeframe,
      aiInsights,
      suggestedSlots: [
        { date: 'Morgen', time: '09:00', available: true },
        { date: 'Morgen', time: '11:30', available: true },
        { date: 'Übermorgen', time: '14:00', available: true },
      ]
    });
    setShowResult(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
    setRecommendation(null);
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Online-Anamnese mit KI-Analyse
        </h1>
        <p className="text-gray-600">
          Beantworten Sie wenige Fragen und erhalten Sie eine personalisierte 
          Terminempfehlung mit optimaler Ressourcenplanung.
        </p>
      </div>

      {!showResult ? (
        <div className="card">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Frage {currentStep + 1} von {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-medical-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="min-h-[300px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.type === 'select' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-medical-blue-600 bg-medical-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiselect' && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const selected = (answers[currentQuestion.id] || []).includes(option.value);
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleMultiSelect(currentQuestion.id, option.value)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all flex items-center gap-3 ${
                        selected
                          ? 'border-medical-blue-600 bg-medical-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        selected ? 'bg-medical-blue-600 text-white' : 'border-2 border-gray-300'
                      }`}>
                        {selected && '✓'}
                      </div>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === 'scale' && (
              <div className="py-8">
                <div className="flex justify-between mb-4">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleAnswer(currentQuestion.id, num)}
                      className={`w-10 h-10 rounded-full font-semibold transition-all ${
                        answers[currentQuestion.id] === num
                          ? 'bg-medical-blue-600 text-white scale-110'
                          : num <= 3 ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : num <= 6 ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Leicht</span>
                  <span>Mittel</span>
                  <span>Stark</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-md font-medium ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Zurück
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="px-6 py-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === questions.length - 1 ? 'Analyse starten' : 'Weiter'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Recommendation Card */}
          <div className={`card border-l-4 ${
            recommendation.urgency === 'high' ? 'border-l-red-500 bg-red-50' :
            recommendation.urgency === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
            'border-l-medical-accent-500 bg-medical-accent-50'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                recommendation.urgency === 'high' ? 'bg-red-100' :
                recommendation.urgency === 'medium' ? 'bg-yellow-100' :
                'bg-medical-accent-100'
              }`}>
                {recommendation.urgency === 'high' ? '⚠️' :
                 recommendation.urgency === 'medium' ? '📋' : '✅'}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ihre Terminempfehlung
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Dringlichkeit:</span>
                    <span className={`ml-2 font-semibold ${
                      recommendation.urgency === 'high' ? 'text-red-700' :
                      recommendation.urgency === 'medium' ? 'text-yellow-700' :
                      'text-medical-accent-700'
                    }`}>
                      {recommendation.urgency === 'high' ? 'Zeitnah' :
                       recommendation.urgency === 'medium' ? 'Mittelfristig' : 'Regulär'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Empfohlener Zeitraum:</span>
                    <span className="ml-2 font-semibold text-gray-900">{recommendation.suggestedTimeframe}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Geschätzte Dauer:</span>
                    <span className="ml-2 font-semibold text-gray-900">{recommendation.estimatedDuration} Minuten</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Terminart:</span>
                    <span className="ml-2 font-semibold text-gray-900 capitalize">{recommendation.appointmentType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          {recommendation.aiInsights.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                🤖 KI-Analyse
              </h3>
              <ul className="space-y-2">
                {recommendation.aiInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <span className="text-medical-blue-600 mt-1">→</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Available Slots */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verfügbare Termine
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              {recommendation.suggestedSlots.map((slot, idx) => (
                <button
                  key={idx}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-medical-blue-600 hover:bg-medical-blue-50 transition-all text-center"
                >
                  <div className="font-semibold text-gray-900">{slot.date}</div>
                  <div className="text-xl font-bold text-medical-blue-600">{slot.time}</div>
                  <div className="text-sm text-medical-accent-600">Verfügbar</div>
                </button>
              ))}
            </div>
            <button className="w-full mt-4 btn-primary">
              Termin buchen
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={handleReset} className="flex-1 btn-secondary">
              Neue Anamnese starten
            </button>
            <button className="flex-1 btn-primary">
              📄 Zusammenfassung drucken
            </button>
          </div>
        </div>
      )}

      {/* Feature Info */}
      <div className="mt-8 card bg-medical-blue-50 border-medical-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏥 Vorteile der Online-Anamnese
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Zeit sparen:</strong> Schnellere Aufnahme beim Arztbesuch</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Bessere Vorbereitung:</strong> Arzt kennt Symptome vorab</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Optimale Terminplanung:</strong> Passende Zeitfenster</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Ressourcenoptimierung:</strong> Effizientere Praxisauslastung</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnamneseFeature;
