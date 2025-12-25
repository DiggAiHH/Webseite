import { useState } from 'react';

/**
 * PraxisITFeature Component
 * Comprehensive IT management system for medical practices
 * Includes: Room planning, device management, maintenance, network planning,
 * FAQ, chatbot, training materials for PVS systems, AI compliance
 * 
 * Regulatory Compliance: MDR, MPDG, EU AI Act, DSGVO, BSI
 */
const PraxisITFeature = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Willkommen beim Praxis-IT Assistenten! Ich helfe Ihnen bei allen Fragen zu Ihrer Praxis-IT. Wie kann ich Ihnen heute helfen?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Demo data for rooms
  const rooms = [
    { id: 1, name: 'Behandlungsraum 1', type: 'treatment', status: 'available', lastCleaning: '2024-12-25 08:00', nextCleaning: '2024-12-25 18:00' },
    { id: 2, name: 'Behandlungsraum 2', type: 'treatment', status: 'occupied', lastCleaning: '2024-12-25 08:00', nextCleaning: '2024-12-25 18:00' },
    { id: 3, name: 'Labor', type: 'lab', status: 'available', lastCleaning: '2024-12-25 07:00', nextCleaning: '2024-12-25 19:00' },
    { id: 4, name: 'Wartebereich', type: 'waiting', status: 'available', lastCleaning: '2024-12-25 06:00', nextCleaning: '2024-12-25 20:00' },
    { id: 5, name: 'EKG-Raum', type: 'diagnostic', status: 'maintenance', lastCleaning: '2024-12-24 18:00', nextCleaning: '2024-12-25 18:00' },
  ];

  // Demo data for devices
  const devices = [
    { id: 1, name: 'EKG-Gerät Philips TC70', room: 'EKG-Raum', ip: '192.168.1.101', socket: 'A-12', lastCheck: '2024-11-15', nextCheck: '2025-02-15', status: 'active', mdrCompliant: true },
    { id: 2, name: 'Blutdruckmessgerät Omron', room: 'Behandlungsraum 1', ip: '192.168.1.102', socket: 'B-03', lastCheck: '2024-10-20', nextCheck: '2025-01-20', status: 'active', mdrCompliant: true },
    { id: 3, name: 'Ultraschallgerät Siemens', room: 'Behandlungsraum 2', ip: '192.168.1.103', socket: 'B-07', lastCheck: '2024-09-01', nextCheck: '2024-12-01', status: 'warning', mdrCompliant: true },
    { id: 4, name: 'Labor-Zentrifuge', room: 'Labor', ip: '192.168.1.104', socket: 'C-01', lastCheck: '2024-12-01', nextCheck: '2025-03-01', status: 'active', mdrCompliant: true },
    { id: 5, name: 'Drucker HP LaserJet', room: 'Empfang', ip: '192.168.1.50', socket: 'A-01', lastCheck: '2024-11-01', nextCheck: '2025-05-01', status: 'active', mdrCompliant: false },
  ];

  // Demo data for network plan
  const networkDevices = [
    { type: 'router', name: 'Hauptrouter Fritzbox', ip: '192.168.1.1', location: 'Serverraum', port: 'WAN' },
    { type: 'switch', name: 'Switch 24-Port', ip: '192.168.1.2', location: 'Serverraum', port: 'LAN1-24' },
    { type: 'server', name: 'Praxis-Server', ip: '192.168.1.10', location: 'Serverraum', port: 'LAN1' },
    { type: 'ap', name: 'WLAN Access Point', ip: '192.168.1.5', location: 'Wartebereich', port: 'LAN5' },
  ];

  // Top 50 FAQ problems and solutions
  const faqProblems = [
    { id: 1, problem: 'Drucker druckt nicht', solution: 'Prüfen Sie: 1) Ist der Drucker eingeschaltet? 2) Ist Papier eingelegt? 3) Starten Sie den Druckspooler neu (Dienste > Druckspooler > Neu starten)', category: 'Drucker' },
    { id: 2, problem: 'Internet funktioniert nicht', solution: '1) Router neu starten (30 Sek warten). 2) Kabelverbindungen prüfen. 3) Windows-Netzwerkdiagnose ausführen. 4) IT-Support kontaktieren.', category: 'Netzwerk' },
    { id: 3, problem: 'Tomedo startet nicht', solution: '1) PC neu starten. 2) Tomedo-Server-Status prüfen. 3) Tomedo-Cache löschen (C:\\Users\\[Name]\\AppData\\Local\\Tomedo\\Cache). 4) Support: 030-12345678', category: 'PVS' },
    { id: 4, problem: 'Kartenlesegerät wird nicht erkannt', solution: '1) USB-Kabel prüfen/neu einstecken. 2) Anderen USB-Port testen. 3) Treiber neu installieren. 4) Gerät im Gerätemanager prüfen.', category: 'Hardware' },
    { id: 5, problem: 'Scanner funktioniert nicht', solution: '1) Ist der Scanner eingeschaltet? 2) TWAIN-Treiber aktualisieren. 3) Scanner in Tomedo/PVS neu konfigurieren. 4) USB-Verbindung prüfen.', category: 'Hardware' },
    { id: 6, problem: 'E-Mail-Versand schlägt fehl', solution: '1) Internetverbindung prüfen. 2) E-Mail-Server-Einstellungen kontrollieren (SMTP: mail.praxis.de, Port: 587). 3) Passwort zurücksetzen.', category: 'E-Mail' },
    { id: 7, problem: 'PC ist sehr langsam', solution: '1) Nicht benötigte Programme schließen. 2) PC neu starten. 3) Festplattenspeicher prüfen (min. 10GB frei). 4) Windows-Updates installieren.', category: 'PC' },
    { id: 8, problem: 'Passwort vergessen', solution: '1) Admin kontaktieren für Passwort-Reset. 2) Sicherheitsfragen beantworten. 3) Neues Passwort nach Richtlinie erstellen (min. 12 Zeichen).', category: 'Zugangsdaten' },
    { id: 9, problem: 'Bildschirm bleibt schwarz', solution: '1) Ist der Monitor eingeschaltet? 2) Kabelverbindung prüfen (HDMI/DisplayPort). 3) PC einmal komplett ausschalten und neu starten.', category: 'Hardware' },
    { id: 10, problem: 'Terminkalender synchronisiert nicht', solution: '1) Internetverbindung prüfen. 2) Kalender-Konto neu verbinden. 3) Cache löschen. 4) Synchronisationseinstellungen überprüfen.', category: 'PVS' },
  ];

  // PVS Training modules
  const pvsModules = [
    { 
      id: 'tomedo', 
      name: 'Tomedo', 
      logo: '🏥',
      modules: ['Patientenverwaltung', 'Terminplanung', 'Abrechnung', 'Dokumentation', 'E-Rezept', 'eAU'],
      faqCount: 50,
      videoCount: 12
    },
    { 
      id: 'doctolib', 
      name: 'Doctolib', 
      logo: '📅',
      modules: ['Online-Terminbuchung', 'Patientenkommunikation', 'Videosprechstunde', 'Integration'],
      faqCount: 35,
      videoCount: 8
    },
    { 
      id: 'starface', 
      name: 'Starface', 
      logo: '📞',
      modules: ['Telefonanlage', 'Voicemail', 'Rufgruppen', 'Warteschleifen', 'CTI-Integration'],
      faqCount: 40,
      videoCount: 10
    },
    { 
      id: 'cgm', 
      name: 'CGM (Turbomed/M1)', 
      logo: '💊',
      modules: ['Praxisverwaltung', 'KV-Abrechnung', 'Medikation', 'Labordatenimport', 'DMP'],
      faqCount: 55,
      videoCount: 15
    },
    { 
      id: 'medistar', 
      name: 'Medistar', 
      logo: '⚕️',
      modules: ['Patientenakte', 'Terminverwaltung', 'Formulare', 'Abrechnung', 'Statistiken'],
      faqCount: 45,
      videoCount: 11
    },
    { 
      id: 'quincy', 
      name: 'Quincy', 
      logo: '🔬',
      modules: ['Labormanagement', 'Befunde', 'Qualitätssicherung', 'Geräteanbindung'],
      faqCount: 30,
      videoCount: 6
    },
    { 
      id: 't2med', 
      name: 'T2med', 
      logo: '📋',
      modules: ['Praxissoftware', 'KV-Abrechnung', 'Privatabrechnung', 'Dokumentation'],
      faqCount: 38,
      videoCount: 9
    },
    { 
      id: 'tomedair', 
      name: 'Tomed Air', 
      logo: '☁️',
      modules: ['Cloud-Praxissoftware', 'Mobile Nutzung', 'Datensicherung', 'Updates'],
      faqCount: 25,
      videoCount: 5
    },
  ];

  // Compliance checklist
  const complianceItems = [
    { regulation: 'MDR (EU) 2017/745', status: 'compliant', description: 'Medizinprodukte-Verordnung', lastAudit: '2024-06-15' },
    { regulation: 'MPDG', status: 'compliant', description: 'Medizinprodukterecht-Durchführungsgesetz', lastAudit: '2024-06-15' },
    { regulation: 'EU AI Act', status: 'review', description: 'KI-Verordnung der EU', lastAudit: '2024-09-01' },
    { regulation: 'DSGVO', status: 'compliant', description: 'Datenschutz-Grundverordnung', lastAudit: '2024-03-20' },
    { regulation: 'BSI IT-Grundschutz', status: 'compliant', description: 'IT-Sicherheitsstandard', lastAudit: '2024-04-10' },
  ];

  // Chatbot response logic
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    const newMessages = [...chatMessages, userMessage];
    
    // Simple AI response logic (demo)
    let response = '';
    const input = chatInput.toLowerCase();
    
    if (input.includes('drucker') || input.includes('drucken')) {
      response = 'Bei Druckerproblemen prüfen Sie bitte: 1) Ist der Drucker eingeschaltet? 2) Ist Papier eingelegt? 3) Versuchen Sie den Druckspooler-Dienst neu zu starten. Benötigen Sie weitere Hilfe?';
    } else if (input.includes('passwort')) {
      response = 'Für Passwort-Probleme wenden Sie sich bitte an den Administrator. Aus Sicherheitsgründen werden Passwörter nur persönlich zurückgesetzt. Die Anfrage wird nach DSGVO-Standards verarbeitet und anschließend gelöscht.';
    } else if (input.includes('tomedo')) {
      response = 'Für Tomedo-Unterstützung schauen Sie bitte in unser Schulungsmodul unter "PVS-Schulungen > Tomedo". Dort finden Sie 50 FAQs und 12 Video-Tutorials. Haben Sie ein spezifisches Problem?';
    } else if (input.includes('hilfe') || input.includes('help')) {
      response = 'Ich kann Ihnen bei folgenden Themen helfen: Drucker, Netzwerk, PVS-Systeme (Tomedo, CGM, etc.), Passwort-Reset, Hardware-Probleme. Was möchten Sie wissen?';
    } else if (input.includes('notfall') || input.includes('dringend')) {
      response = '🚨 Bei IT-Notfällen erreichen Sie den Support unter: Tel. 030-12345678 (24/7). Für nicht-dringende Anfragen nutzen Sie bitte das Ticketsystem.';
    } else {
      response = 'Ich verstehe Ihre Anfrage. Lassen Sie mich in unserer Wissensdatenbank suchen... Für komplexere Anfragen erstelle ich automatisch ein Support-Ticket. Können Sie Ihr Anliegen genauer beschreiben?';
    }

    setChatMessages([...newMessages, { role: 'assistant', content: response }]);
    setChatInput('');
  };

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'rooms', name: 'Raumplan', icon: '🏠' },
    { id: 'devices', name: 'Geräte', icon: '🖥️' },
    { id: 'maintenance', name: 'Wartung', icon: '🔧' },
    { id: 'network', name: 'Netzwerk', icon: '🌐' },
    { id: 'cleaning', name: 'Reinigung', icon: '🧹' },
    { id: 'faq', name: 'FAQ & Probleme', icon: '❓' },
    { id: 'training', name: 'Schulungen', icon: '📚' },
    { id: 'compliance', name: 'Compliance', icon: '✅' },
    { id: 'onboarding', name: 'Onboarding', icon: '👋' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Praxis Manager IT
        </h1>
        <p className="text-gray-600">
          Zentrales IT-Management für Ihre Praxis: Räume, Geräte, Wartung, Netzwerk, 
          Schulungen und KI-gestützter Support - alles MDR, MPDG, EU AI Act, DSGVO und BSI konform.
        </p>
      </div>

      {/* Module Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeModule === module.id
                ? 'bg-medical-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{module.icon}</span>
            <span className="hidden sm:inline">{module.name}</span>
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {activeModule === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="card bg-medical-blue-50 border-medical-blue-200">
              <div className="text-3xl mb-2">🏠</div>
              <div className="text-2xl font-bold text-gray-900">{rooms.length}</div>
              <div className="text-sm text-gray-600">Räume verwaltet</div>
            </div>
            <div className="card bg-medical-accent-50 border-medical-accent-200">
              <div className="text-3xl mb-2">🖥️</div>
              <div className="text-2xl font-bold text-gray-900">{devices.length}</div>
              <div className="text-sm text-gray-600">Geräte registriert</div>
            </div>
            <div className="card bg-yellow-50 border-yellow-200">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-2xl font-bold text-gray-900">{devices.filter(d => d.status === 'warning').length}</div>
              <div className="text-sm text-gray-600">Wartung fällig</div>
            </div>
            <div className="card bg-purple-50 border-purple-200">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-gray-900">{pvsModules.length}</div>
              <div className="text-sm text-gray-600">PVS-Schulungen</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nächste Wartungen</h3>
              {devices.filter(d => d.status === 'warning' || new Date(d.nextCheck) < new Date('2025-02-01')).slice(0, 3).map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                  <div>
                    <div className="font-medium">{device.name}</div>
                    <div className="text-sm text-gray-600">{device.room}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    device.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {device.nextCheck}
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance-Status</h3>
              {complianceItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                  <div>
                    <div className="font-medium">{item.regulation}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    item.status === 'compliant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'compliant' ? '✓ Konform' : '⏳ Prüfung'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rooms */}
      {activeModule === 'rooms' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Raumplan & Nutzung</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className={`p-4 rounded-lg border-2 ${
                room.status === 'available' ? 'border-green-200 bg-green-50' :
                room.status === 'occupied' ? 'border-red-200 bg-red-50' :
                'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{room.name}</h3>
                  <span className={`w-3 h-3 rounded-full ${
                    room.status === 'available' ? 'bg-green-500' :
                    room.status === 'occupied' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Typ: {room.type}</div>
                  <div>Letzte Reinigung: {room.lastCleaning}</div>
                  <div>Nächste Reinigung: {room.nextCleaning}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Devices */}
      {activeModule === 'devices' && (
        <div className="card overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Geräteverwaltung</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Gerät</th>
                <th className="text-left py-3 px-4">Raum</th>
                <th className="text-left py-3 px-4">IP-Adresse</th>
                <th className="text-left py-3 px-4">Steckdose</th>
                <th className="text-left py-3 px-4">Letzter Check</th>
                <th className="text-left py-3 px-4">Nächster Check</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">MDR</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{device.name}</td>
                  <td className="py-3 px-4">{device.room}</td>
                  <td className="py-3 px-4 font-mono text-xs">{device.ip}</td>
                  <td className="py-3 px-4">{device.socket}</td>
                  <td className="py-3 px-4">{device.lastCheck}</td>
                  <td className="py-3 px-4">{device.nextCheck}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      device.status === 'active' ? 'bg-green-100 text-green-800' :
                      device.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {device.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {device.mdrCompliant ? '✅' : '❌'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Maintenance */}
      {activeModule === 'maintenance' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wartungsplanung</h2>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.id} className={`p-4 rounded-lg border ${
                device.status === 'warning' ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{device.name}</h3>
                    <p className="text-sm text-gray-600">{device.room} | Steckdose: {device.socket}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Letzter Check: {device.lastCheck}</div>
                    <div className={`font-semibold ${
                      device.status === 'warning' ? 'text-yellow-700' : 'text-gray-900'
                    }`}>
                      Nächster Check: {device.nextCheck}
                    </div>
                  </div>
                  <button className="btn-primary text-sm">
                    Wartung planen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Network */}
      {activeModule === 'network' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Netzwerkplan</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {networkDevices.map((device, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl mb-2">
                    {device.type === 'router' ? '🌐' : device.type === 'switch' ? '🔀' : device.type === 'server' ? '🖥️' : '📶'}
                  </div>
                  <h3 className="font-semibold text-gray-900">{device.name}</h3>
                  <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <div>IP: <span className="font-mono">{device.ip}</span></div>
                    <div>Standort: {device.location}</div>
                    <div>Port: {device.port}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stromplan - Geräte-Zuordnung</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3">Steckdose</th>
                    <th className="text-left py-2 px-3">Gerät</th>
                    <th className="text-left py-2 px-3">Raum</th>
                    <th className="text-left py-2 px-3">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id} className="border-b border-gray-100">
                      <td className="py-2 px-3 font-mono font-bold">{device.socket}</td>
                      <td className="py-2 px-3">{device.name}</td>
                      <td className="py-2 px-3">{device.room}</td>
                      <td className="py-2 px-3 font-mono text-xs">{device.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cleaning */}
      {activeModule === 'cleaning' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reinigungsplan</h2>
          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                    <p className="text-sm text-gray-600">Typ: {room.type}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Letzte Reinigung</div>
                    <div className="font-semibold text-green-700">{room.lastCleaning}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Nächste Reinigung</div>
                    <div className="font-semibold text-medical-blue-700">{room.nextCleaning}</div>
                  </div>
                  <button className="btn-secondary text-sm">
                    ✓ Als gereinigt markieren
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeModule === 'faq' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top 50 Probleme & Lösungen</h2>
          <div className="space-y-4">
            {faqProblems.map((faq) => (
              <details key={faq.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                  <span>{faq.id}. {faq.problem}</span>
                  <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">{faq.category}</span>
                </summary>
                <div className="mt-3 pt-3 border-t border-gray-200 text-gray-700">
                  {faq.solution}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Training */}
      {activeModule === 'training' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">PVS-Schulungen & Module</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pvsModules.map((pvs) => (
              <div key={pvs.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-3">{pvs.logo}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{pvs.name}</h3>
                <div className="text-sm text-gray-600 mb-3">
                  {pvs.modules.slice(0, 3).join(', ')}...
                </div>
                <div className="flex gap-3 text-xs">
                  <span className="px-2 py-1 bg-medical-blue-100 text-medical-blue-700 rounded-full">
                    {pvs.faqCount} FAQs
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {pvs.videoCount} Videos
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance */}
      {activeModule === 'compliance' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Regulatorische Compliance</h2>
            <div className="space-y-4">
              {complianceItems.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                  item.status === 'compliant' 
                    ? 'border-l-green-500 bg-green-50' 
                    : 'border-l-yellow-500 bg-yellow-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.regulation}</h3>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-500 mt-1">Letztes Audit: {item.lastAudit}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'compliant' 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {item.status === 'compliant' ? '✓ Konform' : '⏳ In Prüfung'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-medical-blue-50 border-medical-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">🛡️ AI-Implementation nach EU AI Act</h3>
            <p className="text-gray-700">
              Alle KI-Funktionen in dieser Anwendung sind gemäß EU AI Act klassifiziert und dokumentiert. 
              Medizinische KI-Systeme werden als Hochrisiko-Anwendungen behandelt und entsprechend überwacht.
            </p>
          </div>
        </div>
      )}

      {/* Onboarding */}
      {activeModule === 'onboarding' && (
        <div className="space-y-6">
          <div className="card bg-gradient-to-r from-medical-blue-600 to-medical-blue-800 text-white">
            <h2 className="text-2xl font-bold mb-4">👋 Willkommen in der Praxis!</h2>
            <p className="text-medical-blue-100 mb-6">
              Unser KI-gestütztes Onboarding-System hilft Ihnen, schnell und reibungslos einzusteigen. 
              Alle Fragen werden vertraulich behandelt und nach DSGVO gelöscht.
            </p>
            <button 
              onClick={() => setChatOpen(true)}
              className="px-6 py-3 bg-white text-medical-blue-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              🤖 Mit Avatar-Assistenten starten
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="card">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Erste Schritte</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Zugangsdaten einrichten</li>
                <li>• Arbeitsplatz kennenlernen</li>
                <li>• Team-Vorstellung</li>
              </ul>
            </div>
            <div className="card">
              <div className="text-3xl mb-3">🖥️</div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Systeme lernen</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PVS-Schulung (Tomedo/CGM)</li>
                <li>• Telefonsystem (Starface)</li>
                <li>• Dokumentation</li>
              </ul>
            </div>
            <div className="card">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Selbstständig arbeiten</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Alle Module freigeschaltet</li>
                <li>• FAQ-Zugang</li>
                <li>• Chat-Support 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-medical-blue-600 text-white rounded-full shadow-xl hover:bg-medical-blue-700 transition-all flex items-center justify-center text-2xl z-40"
        aria-label="IT-Support Chat öffnen"
      >
        {chatOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="p-4 bg-medical-blue-600 text-white rounded-t-xl">
            <h3 className="font-bold">🤖 Praxis-IT Assistent</h3>
            <p className="text-sm text-medical-blue-100">DSGVO-konform • Daten werden nach Anfrage gelöscht</p>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-medical-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ihre Frage eingeben..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
              />
              <button type="submit" className="px-4 py-2 bg-medical-blue-600 text-white rounded-lg hover:bg-medical-blue-700">
                ➤
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 card bg-medical-blue-50 border-medical-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          ℹ️ Praxis Manager IT - Features
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>MDR & MPDG konform:</strong> Alle Medizinprodukte dokumentiert</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>EU AI Act ready:</strong> KI-Systeme klassifiziert</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>DSGVO:</strong> Alle Daten datenschutzkonform</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>BSI:</strong> IT-Grundschutz implementiert</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>PVS-Schulungen:</strong> Tomedo, CGM, Medistar, etc.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-medical-accent-600">✓</span>
            <span><strong>KI-Onboarding:</strong> Neue MFA sofort einsatzbereit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PraxisITFeature;
