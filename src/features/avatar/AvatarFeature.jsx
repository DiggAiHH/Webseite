import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const [isTyping, setIsTyping] = useState(false);

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

  const getGreeting = (avatar) => (
    `Hallo! Ich bin ${avatar.name}, Ihr ${avatar.role}. Wie kann ich Ihnen heute helfen?`
  );

  const quickActionsMap = {
    'medical-assistant': [
      { label: 'Symptom-Checkliste', message: 'Erstelle eine symptomorientierte Checkliste für einen ersten Überblick (ohne Diagnose).' },
      { label: 'Patientenaufklärung', message: 'Erstelle eine kurze Patientenaufklärung zu einem häufigen Praxis-Thema.' },
      { label: 'Praxis-Workflow', message: 'Gib mir einen strukturierten Vorschlag für einen effizienten Praxis-Workflow.' }
    ],
    'inventory-expert': [
      { label: 'Bestandsanalyse', message: 'Analysiere typische Lagerfehler und gib Optimierungsvorschläge.' },
      { label: 'Nachbestell-Strategie', message: 'Empfiehl eine Nachbestell-Strategie für Verbrauchsmaterialien.' },
      { label: 'Prozess-KPI', message: 'Nenne 5 KPIs für Lager- und Logistik-Performance in Praxen.' }
    ],
    'data-analyst': [
      { label: 'ROI-Quickcheck', message: 'Gib mir einen ROI-Quickcheck-Rahmen mit Beispielannahmen.' },
      { label: 'Dashboards', message: 'Schlage ein Dashboard-Layout für Praxiskennzahlen vor.' },
      { label: 'Datenqualität', message: 'Wie sichere ich Datenqualität für valide Reports?' }
    ]
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setChatHistory([
      {
        sender: 'avatar',
        message: getGreeting(avatar)
      }
    ]);
  };

  const sendMessage = async (text) => {
    setInputError('');

    const validation = validateTextInput(text, 500);
    if (!validation.isValid) {
      setInputError(validation.error);
      return;
    }

    if (!selectedAvatar) {
      setInputError('Bitte wählen Sie zuerst einen Avatar aus.');
      return;
    }

    // Add user message
    const userMsg = { sender: 'user', message: validation.sanitized };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const context = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: validation.sanitized,
          avatarId: selectedAvatar.id,
          context
        })
      });

      if (!response.ok) {
        throw new Error('Server unavailable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';
      
      // Init bot message
      setChatHistory((prev) => [...prev, { sender: 'avatar', message: '' }]);

      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (done) break;
        const value = result.value;
        
        const chunk = decoder.decode(value, { stream: true });
        botText += chunk;

        setChatHistory((prev) => {
          const newHist = [...prev];
          // Update last message
          newHist[newHist.length - 1] = {
            sender: 'avatar',
            message: botText
          };
          return newHist;
        });
      }

    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { sender: 'system', message: 'Verbindung zum AI-Agent unterbrochen. Bitte versuchen Sie es später erneut.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessage(chatInput);
  };

  const handleQuickAction = async (message) => {
    await sendMessage(message);
  };

  const handleClearChat = () => {
    if (selectedAvatar) {
      setChatHistory([{ sender: 'avatar', message: getGreeting(selectedAvatar) }]);
    } else {
      setChatHistory([]);
    }
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
          {selectedAvatar && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {quickActionsMap[selectedAvatar.id]?.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => handleQuickAction(action.message)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-medical-blue-50 text-medical-blue-700 border border-medical-blue-100 hover:bg-medical-blue-100 transition"
                >
                  {action.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearChat}
                className="ml-auto px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition"
              >
                Chat leeren
              </button>
            </div>
          )}
          
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
                       {msg.sender === 'avatar' ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.message}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.message}</p>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Tippt</span>
                        <span className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
