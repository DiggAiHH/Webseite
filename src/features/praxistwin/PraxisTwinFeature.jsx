import { useState } from 'react';

/**
 * PraxisTwinFeature Component
 * Gamification system with visual practice avatar and module-based progression
 * Uses SVG and CSS animations (no heavy 3D engines for performance on practice PCs)
 */
const PraxisTwinFeature = () => {
  const [praxisLevel, setPraxisLevel] = useState(1);
  const [installedModules, setInstalledModules] = useState([]);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [draggedModule, setDraggedModule] = useState(null);

  // Available modules that can be "installed" on the practice
  const modules = [
    {
      id: 'security',
      name: 'IT-Sicherheit',
      icon: '🔒',
      color: '#0284c7',
      points: 10,
      description: 'Firewall, Verschlüsselung, Zugangskontrollen',
      benefits: ['Schutz vor Cyberangriffen', 'DSGVO-Konformität', 'Patientendaten-Sicherheit']
    },
    {
      id: 'network',
      name: 'Netzwerk-Infrastruktur',
      icon: '🌐',
      color: '#059669',
      points: 8,
      description: 'Stabile und sichere Netzwerkverbindungen',
      benefits: ['Schnelle Datenübertragung', 'Redundante Systeme', 'Cloud-Integration']
    },
    {
      id: 'hygiene',
      name: 'Hygiene-Management',
      icon: '🧼',
      color: '#0891b2',
      points: 12,
      description: 'Digitale Hygienepläne und Dokumentation',
      benefits: ['RKI-konforme Dokumentation', 'Automatische Erinnerungen', 'Audit-Trail']
    },
    {
      id: 'patient',
      name: 'Patientenverwaltung',
      icon: '👥',
      color: '#7c3aed',
      points: 15,
      description: 'Modernes Patienten-Management-System',
      benefits: ['Digitale Patientenakte', 'Terminverwaltung', 'Abrechnungsintegration']
    },
    {
      id: 'telemedicine',
      name: 'Telemedizin',
      icon: '💻',
      color: '#dc2626',
      points: 20,
      description: 'Videosprechstunde und Remote-Beratung',
      benefits: ['Flexible Patientenbetreuung', 'Zeitersparnis', 'Erweiterte Erreichbarkeit']
    },
    {
      id: 'analytics',
      name: 'Daten-Analytics',
      icon: '📊',
      color: '#ea580c',
      points: 18,
      description: 'KI-gestützte Analyse und Reporting',
      benefits: ['Geschäftsintelligenz', 'Vorhersagemodelle', 'Optimierungsempfehlungen']
    }
  ];

  const handleDragStart = (module) => {
    setDraggedModule(module);
  };

  const handleDragEnd = () => {
    setDraggedModule(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedModule && !installedModules.find(m => m.id === draggedModule.id)) {
      const newModules = [...installedModules, draggedModule];
      setInstalledModules(newModules);
      
      const newPoints = availablePoints + draggedModule.points;
      setAvailablePoints(newPoints);
      
      // Level up every 50 points
      const newLevel = Math.floor(newPoints / 50) + 1;
      if (newLevel > praxisLevel) {
        setPraxisLevel(newLevel);
      }
    }
    setDraggedModule(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveModule = (moduleId) => {
    const module = installedModules.find(m => m.id === moduleId);
    if (module) {
      setInstalledModules(installedModules.filter(m => m.id !== moduleId));
      const newPoints = Math.max(0, availablePoints - module.points);
      setAvailablePoints(newPoints);
      // Ensure minimum level is 1
      setPraxisLevel(Math.max(1, Math.floor(newPoints / 50) + 1));
    }
  };

  const progressToNextLevel = ((availablePoints % 50) / 50) * 100;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Praxis-Twin: Ihr digitaler Praxis-Avatar
        </h1>
        <p className="text-gray-600">
          Bauen Sie Ihre digitale Praxis auf! Ziehen Sie Module per Drag & Drop auf Ihren Praxis-Avatar 
          und erhöhen Sie Ihr Praxis-Level.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar Area */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Ihre Praxis
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-medical-blue-600">Level {praxisLevel}</div>
                <div className="text-xs text-gray-500">{availablePoints} Punkte</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Fortschritt zum nächsten Level</span>
              <span>{Math.round(progressToNextLevel)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-medical-blue-500 to-medical-accent-500 transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
          </div>

          {/* Drop Zone with Avatar */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={`relative min-h-[400px] bg-gradient-to-br from-medical-blue-50 to-medical-accent-50 rounded-lg p-8 border-2 border-dashed ${
              draggedModule ? 'border-medical-blue-500 bg-medical-blue-100' : 'border-gray-300'
            } transition-all duration-300`}
          >
            {/* SVG Avatar */}
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-48 h-48 mb-4"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Base building */}
                <rect
                  x="50"
                  y="80"
                  width="100"
                  height="100"
                  fill="#0284c7"
                  rx="5"
                  className="transition-all duration-500"
                  style={{
                    opacity: 0.2 + (praxisLevel * 0.1),
                    transform: `scale(${0.9 + (praxisLevel * 0.02)})`
                  }}
                />
                
                {/* Windows */}
                <rect x="65" y="95" width="15" height="15" fill="#fff" rx="2" />
                <rect x="92.5" y="95" width="15" height="15" fill="#fff" rx="2" />
                <rect x="120" y="95" width="15" height="15" fill="#fff" rx="2" />
                <rect x="65" y="120" width="15" height="15" fill="#fff" rx="2" />
                <rect x="92.5" y="120" width="15" height="15" fill="#fff" rx="2" />
                <rect x="120" y="120" width="15" height="15" fill="#fff" rx="2" />
                
                {/* Door */}
                <rect x="85" y="145" width="30" height="35" fill="#fff" rx="3" />
                
                {/* Roof */}
                <polygon
                  points="100,60 40,80 160,80"
                  fill="#059669"
                  className="transition-all duration-500"
                  style={{
                    opacity: 0.3 + (praxisLevel * 0.1)
                  }}
                />
                
                {/* Plus sign (medical symbol) */}
                <circle cx="100" cy="40" r="15" fill="#dc2626" 
                  className="animate-pulse"
                  style={{
                    opacity: 0.5 + (installedModules.length * 0.1)
                  }}
                />
                <rect x="95" y="30" width="10" height="20" fill="#fff" rx="1" />
                <rect x="90" y="35" width="20" height="10" fill="#fff" rx="1" />
              </svg>

              {draggedModule && (
                <div className="text-center text-medical-blue-600 font-medium animate-bounce">
                  Modul hier ablegen: {draggedModule.name}
                </div>
              )}

              {installedModules.length === 0 && !draggedModule && (
                <div className="text-center text-gray-500">
                  <p className="text-lg font-medium mb-2">Ziehen Sie Module hierher</p>
                  <p className="text-sm">um Ihre digitale Praxis aufzubauen</p>
                </div>
              )}
            </div>

            {/* Installed Modules Display */}
            {installedModules.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Installierte Module:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {installedModules.map((module) => (
                    <div
                      key={module.id}
                      className="bg-white rounded-lg p-3 shadow-md border-2 animate-fadeIn"
                      style={{ borderColor: module.color }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{module.icon}</span>
                        <button
                          onClick={() => handleRemoveModule(module.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          aria-label="Modul entfernen"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{module.name}</div>
                      <div className="text-xs text-gray-500">+{module.points} Punkte</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Level Benefits */}
          <div className="mt-4 p-4 bg-medical-accent-50 rounded-lg border border-medical-accent-200">
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Level {praxisLevel} Vorteile:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {praxisLevel >= 1 && <li>✓ Basis-Digitalisierung aktiviert</li>}
              {praxisLevel >= 2 && <li>✓ Erweiterte Sicherheitsfeatures freigeschaltet</li>}
              {praxisLevel >= 3 && <li>✓ Premium-Support verfügbar</li>}
              {praxisLevel >= 4 && <li>✓ KI-Assistenten aktiviert</li>}
              {praxisLevel >= 5 && <li>✓ Vollständig digitalisierte Praxis!</li>}
            </ul>
          </div>
        </div>

        {/* Module Library */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Verfügbare Module
          </h2>
          <div className="space-y-3">
            {modules.map((module) => {
              const isInstalled = installedModules.find(m => m.id === module.id);
              return (
                <div
                  key={module.id}
                  draggable={!isInstalled}
                  onDragStart={() => handleDragStart(module)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isInstalled
                      ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:border-medical-blue-500 hover:shadow-lg cursor-move'
                  }`}
                  style={{
                    borderLeftColor: !isInstalled ? module.color : undefined,
                    borderLeftWidth: !isInstalled ? '4px' : undefined
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl flex-shrink-0">{module.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{module.name}</h3>
                        <span className="text-sm font-medium text-medical-blue-600 ml-2">
                          +{module.points}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{module.description}</p>
                      {isInstalled && (
                        <div className="text-xs font-medium text-medical-accent-600">
                          ✓ Installiert
                        </div>
                      )}
                      {!isInstalled && (
                        <div className="text-xs text-gray-500 italic">
                          Ziehen Sie das Modul auf die Praxis
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits collapsed by default, expand on hover */}
                  {!isInstalled && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Vorteile:</div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {module.benefits.map((benefit, idx) => (
                          <li key={idx}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="card bg-medical-blue-50 border-medical-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-medical-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {installedModules.length}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{installedModules.length}/{modules.length}</div>
              <div className="text-sm text-gray-600">Module installiert</div>
            </div>
          </div>
        </div>

        <div className="card bg-medical-accent-50 border-medical-accent-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-medical-accent-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {availablePoints}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{availablePoints} Punkte</div>
              <div className="text-sm text-gray-600">Gesammelt</div>
            </div>
          </div>
        </div>

        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {Math.round((installedModules.length / modules.length) * 100)}%
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((installedModules.length / modules.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Digitalisierung</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 card bg-medical-blue-50 border-medical-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🎮 Über das Praxis-Twin System
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Gamification für Ihre Digitalisierung:</strong> Der Praxis-Twin visualisiert 
            den Fortschritt Ihrer digitalen Transformation spielerisch. Jedes installierte Modul 
            bringt Punkte und hebt Ihr Praxis-Level.
          </p>
          <p>
            <strong>Drag & Drop:</strong> Ziehen Sie Module einfach per Drag & Drop auf Ihren 
            Praxis-Avatar. Die Installation ist sofort sichtbar und zählt zu Ihrem Gesamtscore.
          </p>
          <p>
            <strong>Performance-Optimiert:</strong> Verwendet SVG und CSS-Animationen statt 
            schwerer 3D-Engines für optimale Performance auf Praxis-Rechnern.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PraxisTwinFeature;
