import { useState } from 'react';

/**
 * PraxisManagerFeature Component
 * Comprehensive practice management system for medical practices
 * Includes appointment scheduling, patient management, and resource optimization
 */
const PraxisManagerFeature = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments] = useState([
    { id: 1, patient: 'Max Mustermann', date: '2024-12-26', time: '09:00', type: 'Erstberatung', status: 'confirmed' },
    { id: 2, patient: 'Anna Schmidt', date: '2024-12-26', time: '10:30', type: 'Nachuntersuchung', status: 'pending' },
    { id: 3, patient: 'Peter Weber', date: '2024-12-26', time: '14:00', type: 'Kontrolltermin', status: 'confirmed' },
  ]);

  const stats = [
    { label: 'Termine heute', value: '12', change: '+2', positive: true },
    { label: 'Patienten diese Woche', value: '48', change: '+8', positive: true },
    { label: 'Auslastung', value: '87%', change: '+5%', positive: true },
    { label: 'Wartezeit Ø', value: '8 min', change: '-3 min', positive: true },
  ];

  const resources = [
    { name: 'Behandlungsraum 1', status: 'available', nextFree: 'Jetzt' },
    { name: 'Behandlungsraum 2', status: 'occupied', nextFree: '10:45' },
    { name: 'Labor', status: 'available', nextFree: 'Jetzt' },
    { name: 'EKG-Raum', status: 'maintenance', nextFree: '14:00' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Praxis Verwaltung Manager
        </h1>
        <p className="text-gray-600">
          Zentrale Steuerung Ihrer Praxis: Terminplanung, Patientenverwaltung und 
          Ressourcenoptimierung in einem System.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="card">
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className={`text-sm ${stat.positive ? 'text-medical-accent-600' : 'text-red-600'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['dashboard', 'termine', 'patienten', 'ressourcen'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-medical-blue-600 border-b-2 border-medical-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Appointments */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Heutige Termine
          </h2>
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-medical-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-medical-blue-600 font-semibold">
                      {apt.patient.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{apt.patient}</div>
                    <div className="text-sm text-gray-600">{apt.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{apt.time}</div>
                  <div className={`text-sm ${
                    apt.status === 'confirmed' ? 'text-medical-accent-600' : 'text-yellow-600'
                  }`}>
                    {apt.status === 'confirmed' ? 'Bestätigt' : 'Ausstehend'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 btn-primary">
            + Neuen Termin anlegen
          </button>
        </div>

        {/* Resources */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Ressourcen-Status
          </h2>
          <div className="space-y-3">
            {resources.map((resource, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900">{resource.name}</div>
                  <div className="text-sm text-gray-600">
                    Nächste Verfügbarkeit: {resource.nextFree}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  resource.status === 'available' ? 'bg-medical-accent-500' :
                  resource.status === 'occupied' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mt-8 card bg-medical-blue-50 border-medical-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏥 Praxis Manager Funktionen
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Intelligente Terminplanung:</strong> Automatische Optimierung der Terminvergabe</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Patientenakte digital:</strong> Alle Dokumente an einem Ort</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Ressourcenmanagement:</strong> Räume, Geräte, Personal optimal nutzen</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>Abrechnungsintegration:</strong> KV-konforme Dokumentation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PraxisManagerFeature;
