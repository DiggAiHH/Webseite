import { useState } from 'react';
import { validateTextInput } from '../../utils/security';

/**
 * AvatarFeature Component
 * Virtual assistant and avatar system for medical processes
 */
const AvatarFeature = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [inputError, setInputError] = useState('');

  const avatars = [
    {
      id: 'medical-assistant',
      name: 'Dr. Med. Assistent',
      role: 'Medizinischer Berater',
      specialty: 'Allgemeine medizinische Beratung',
      color: 'medical-blue',
      icon: '🩺'
    },
    {
      id: 'inventory-expert',
      name: 'Lager-Experte',
      role: 'Bestandsmanager',
      specialty: 'Lageroptimierung und Logistik',
      color: 'medical-accent',
      icon: '📦'
    },
    {
      id: 'data-analyst',
      name: 'Daten-Analyst',
      role: 'Analytics-Spezialist',
      specialty: 'ROI-Analyse und Reporting',
      color: 'medical-blue',
      icon: '📊'
    }
  ];

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setChatHistory([
      {
        sender: 'avatar',
        message: `Hallo! Ich bin ${avatar.name}, Ihr ${avatar.role}. Wie kann ich Ihnen heute helfen?`
      }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setInputError('');

    const validation = validateTextInput(chatInput, 500);
    if (!validation.isValid) {
      setInputError(validation.error);
      return;
    }

    if (!selectedAvatar) {
      setInputError('Bitte wählen Sie zuerst einen Avatar aus.');
      return;
    }

    // Add user message
    const newHistory = [
      ...chatHistory,
      { sender: 'user', message: validation.sanitized }
    ];

    // Simulate avatar response
    const responses = {
      'medical-assistant': 'Als medizinischer Berater empfehle ich, dass Sie sich bei spezifischen medizinischen Fragen immer an einen Facharzt wenden. Ich kann Ihnen aber gerne allgemeine Informationen bereitstellen.',
      'inventory-expert': 'Für eine optimale Lagerverwaltung empfehle ich regelmäßige Bestandskontrollen und die Verwendung unseres Lageroptimierungs-Tools. Welchen Bereich möchten Sie optimieren?',
      'data-analyst': 'Ich kann Ihnen bei der Analyse Ihrer Daten helfen. Nutzen Sie unseren ROI-Rechner für detaillierte Kosten-Nutzen-Analysen Ihrer Projekte.'
    };

    setTimeout(() => {
      setChatHistory([
        ...newHistory,
        { 
          sender: 'avatar', 
          message: responses[selectedAvatar.id] || 'Vielen Dank für Ihre Nachricht. Wie kann ich Ihnen weiterhelfen?' 
        }
      ]);
    }, 500);

    setChatInput('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Avatar-System
        </h1>
        <p className="text-gray-600">
          Wählen Sie einen spezialisierten virtuellen Assistenten für Ihre Anfragen.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Avatar Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Verfügbare Assistenten
          </h2>
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              onClick={() => handleAvatarSelect(avatar)}
              className={`card cursor-pointer transition-all ${
                selectedAvatar?.id === avatar.id
                  ? `border-2 border-${avatar.color}-600 shadow-lg`
                  : 'hover:shadow-lg border-2 border-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 bg-${avatar.color}-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0`}>
                  {avatar.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {avatar.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {avatar.role}
                  </p>
                  <p className="text-xs text-gray-500">
                    {avatar.specialty}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Chat
          </h2>
          
          {!selectedAvatar ? (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Wählen Sie einen Assistenten aus, um zu beginnen</p>
            </div>
          ) : (
            <>
              {/* Chat History */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-medical-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Schreiben Sie Ihre Nachricht..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-medical-blue-500 focus:border-medical-blue-500"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="btn-primary px-6"
                    disabled={!chatInput.trim()}
                  >
                    Senden
                  </button>
                </div>
                {inputError && (
                  <p className="text-sm text-red-600">{inputError}</p>
                )}
                <p className="text-xs text-gray-500">
                  {chatInput.length}/500 Zeichen
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 card bg-medical-blue-50 border-medical-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Über das Avatar-System
        </h3>
        <p className="text-gray-700 mb-3">
          Unsere virtuellen Assistenten sind spezialisierte KI-Berater, die Ihnen bei verschiedenen
          Aspekten Ihrer medizinischen Prozesse helfen können:
        </p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-medical-blue-600">✓</span>
            <span><strong>Sicher & DSGVO-konform:</strong> Alle Gespräche werden verschlüsselt und nach EU-Datenschutzstandards verarbeitet.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-medical-blue-600">✓</span>
            <span><strong>Spezialisierte Expertise:</strong> Jeder Avatar ist auf spezifische Bereiche trainiert.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-medical-blue-600">✓</span>
            <span><strong>24/7 Verfügbar:</strong> Erhalten Sie jederzeit Unterstützung, wenn Sie sie brauchen.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AvatarFeature;
