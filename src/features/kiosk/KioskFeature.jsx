import { useState } from 'react';

/**
 * KioskFeature Component
 * Self-service kiosk system for medical practices
 * Patient check-in, information display, and queue management
 */
const KioskFeature = () => {
  const [currentView, setCurrentView] = useState('welcome');

  const kioskModules = [
    {
      id: 'checkin',
      title: 'Patienten-Check-in',
      description: 'Selbstanmeldung mit Versichertenkarte',
      icon: '🏥',
      color: 'medical-blue'
    },
    {
      id: 'queue',
      title: 'Warteschlangen-Anzeige',
      description: 'Live-Status der Wartezeiten',
      icon: '⏱️',
      color: 'medical-accent'
    },
    {
      id: 'info',
      title: 'Informations-Terminal',
      description: 'Praxisinfos und Leistungen',
      icon: 'ℹ️',
      color: 'purple'
    },
    {
      id: 'forms',
      title: 'Digitale Formulare',
      description: 'Anamnesebögen digital ausfüllen',
      icon: '📋',
      color: 'orange'
    }
  ];

  const waitingQueue = [
    { number: 'A-001', status: 'in-treatment', room: 'Behandlungsraum 1' },
    { number: 'A-002', status: 'waiting', position: 1 },
    { number: 'A-003', status: 'waiting', position: 2 },
    { number: 'A-004', status: 'waiting', position: 3 },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kiosk-Systeme für Praxen
        </h1>
        <p className="text-gray-600">
          Moderne Self-Service-Terminals für Patientenanmeldung, Warteschlangen-Management 
          und digitale Formulare. Reduzieren Sie Wartezeiten und Personalaufwand.
        </p>
      </div>

      {/* Kiosk Module Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kioskModules.map((module) => (
          <div
            key={module.id}
            className={`card cursor-pointer hover:shadow-lg transition-all border-l-4 border-${module.color}-600`}
            onClick={() => setCurrentView(module.id)}
          >
            <div className="text-3xl mb-3">{module.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
            <p className="text-sm text-gray-600">{module.description}</p>
          </div>
        ))}
      </div>

      {/* Demo Kiosk Interface */}
      <div className="card bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-[500px]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-medical-blue-600 px-4 py-2 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Kiosk-Demo aktiv
          </div>
        </div>

        {currentView === 'welcome' && (
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold mb-4">Willkommen</h2>
            <p className="text-xl text-gray-300 mb-8">
              Bitte wählen Sie eine Option
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setCurrentView('checkin')}
                className="px-8 py-4 bg-medical-blue-600 hover:bg-medical-blue-700 rounded-xl text-lg font-medium transition-colors"
              >
                🏥 Ich habe einen Termin
              </button>
              <button
                onClick={() => setCurrentView('queue')}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-lg font-medium transition-colors"
              >
                ⏱️ Wartezeit anzeigen
              </button>
            </div>
          </div>
        )}

        {currentView === 'checkin' && (
          <div className="max-w-md mx-auto py-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              Patienten-Check-in
            </h2>
            <div className="space-y-4">
              <div className="p-6 bg-gray-800 rounded-xl text-center">
                <div className="text-5xl mb-4">💳</div>
                <p className="text-lg mb-4">Bitte halten Sie Ihre Versichertenkarte bereit</p>
                <div className="w-full h-16 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
                  <span className="text-gray-400">Kartenleser</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentView('welcome')}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
                >
                  ← Zurück
                </button>
                <button
                  onClick={() => setCurrentView('success')}
                  className="flex-1 py-3 bg-medical-accent-600 hover:bg-medical-accent-700 rounded-lg font-medium"
                >
                  Demo: Anmelden ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'queue' && (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-center mb-6">
              Aktuelle Warteschlange
            </h2>
            <div className="max-w-lg mx-auto space-y-3">
              {waitingQueue.map((item) => (
                <div
                  key={item.number}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    item.status === 'in-treatment'
                      ? 'bg-medical-accent-600'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold">{item.number}</span>
                    {item.status === 'in-treatment' && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        In Behandlung
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    {item.room ? (
                      <span>{item.room}</span>
                    ) : (
                      <span>Position {item.position}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setCurrentView('welcome')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
              >
                ← Zurück zum Start
              </button>
            </div>
          </div>
        )}

        {currentView === 'success' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-4">Erfolgreich angemeldet!</h2>
            <div className="inline-block bg-gray-800 p-6 rounded-xl mb-6">
              <div className="text-sm text-gray-400 mb-1">Ihre Wartemarke:</div>
              <div className="text-5xl font-bold text-medical-blue-400">A-005</div>
            </div>
            <p className="text-gray-300 mb-6">
              Geschätzte Wartezeit: <strong>ca. 15 Minuten</strong>
            </p>
            <button
              onClick={() => setCurrentView('welcome')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
            >
              Neue Anmeldung
            </button>
          </div>
        )}

        {(currentView === 'info' || currentView === 'forms') && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold mb-4">Modul in Entwicklung</h2>
            <p className="text-gray-300 mb-6">
              Dieses Feature wird in Kürze verfügbar sein.
            </p>
            <button
              onClick={() => setCurrentView('welcome')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
            >
              ← Zurück
            </button>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="mt-8 card bg-medical-blue-50 border-medical-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📱 Vorteile des Kiosk-Systems
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Reduzierte Wartezeiten:</strong> Schnellere Anmeldung ohne Personal</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Entlastung Empfang:</strong> Personal für wichtige Aufgaben</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Hygienisch:</strong> Kontaktlose Anmeldung möglich</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>24/7 verfügbar:</strong> Auch außerhalb der Sprechzeiten</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Mehrsprachig:</strong> Unterstützung für internationale Patienten</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Barrierefreiheit:</strong> Optimiert für alle Nutzergruppen</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KioskFeature;
