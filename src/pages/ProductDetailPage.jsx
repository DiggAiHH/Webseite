import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { validateURL } from '../utils/security'
import CheckoutButton from '../features/payment/CheckoutButton'

function getValidatedRepoUrl(url) {
  const validation = validateURL(url, ['github.com'])
  return validation.isValid ? validation.url : null
}

const USE_CASES_BY_PRODUCT_ID = {
  'anamnese-a': [
    'Digitale Vorab-Anamnese vor dem Termin (strukturierte Erfassung).',
    'Tablet-Workflow im Wartezimmer mit barrierearmem UI.',
    'Export/Übergabe an Praxissoftware (PVS) nach Bedarf.'
  ],
  anamnese: [
    'Schneller Einstieg mit Standard-Fragebögen für häufige Fachrichtungen.',
    'Digitale Patientenerfassung ohne unnötigen Feature-Overhead.',
    'PDF-Export zur Ablage und Übergabe in bestehende Abläufe.'
  ],
  anonymisator: [
    'Datenaufbereitung für Forschung/Analyse mit Fokus auf Datenschutz.',
    'Anonymisierung/Pseudonymisierung von Dokumenten und Exporten.',
    'Audit-Trail für Nachvollziehbarkeit in Compliance-Kontexten.'
  ],
  sylt: [
    'Validierung und Verarbeitung komplexer Datenflüsse in größeren Setups.',
    'Integrationsschicht zwischen Systemen (z.B. Import/Export/Pipeline).',
    'Stabile Datenverarbeitung mit Tests und klarer Typisierung.'
  ],
  'jordan-health-app': [
    'Remote-Betreuung und Monitoring als Ergänzung zum Praxisalltag.',
    'Patientenkommunikation und Erinnerungen (z.B. Follow-ups).',
    'Dashboard-Übersicht für Trends und Verlaufsdaten.'
  ],
  jobetes: [
    'Follow-up und Verlaufsübersicht für chronische Erkrankungen.',
    'Reminder-Workflows und Warnungen bei kritischen Werten.',
    'Export/Reports zur ärztlichen Dokumentation.'
  ],
  'projekt-1': [
    'Schnelles Prototyping für neue MedTech-Ideen und Proof-of-Concepts.',
    'User-Research und Pilotprojekte mit schneller Iteration.',
    'Wiederverwendbares Setup für mehrere MVPs ohne Code-Duplikation.'
  ]
}

const PRODUCT_FAQ_BY_PRODUCT_ID = {
  'anamnese-a': [
    {
      question: 'Wie wird Anamnese-A in den Praxisalltag integriert?',
      answer:
        'Typischerweise ueber einen kurzen Pilot mit Vorlagen fuer Frageboegen. Danach erfolgt die Einbindung in bestehende Prozesse, zum Beispiel mit Export in vorhandene Systeme.'
    },
    {
      question: 'Ist Anamnese-A auch fuer Tablet-Workflows geeignet?',
      answer:
        'Ja, die Loesung ist fuer den Einsatz im Wartezimmer und in barrierearmen Oberflaechen ausgelegt, sodass Informationen strukturiert vor dem Termin erfasst werden koennen.'
    },
    {
      question: 'Was ist fuer ein erstes Angebot sinnvoll?',
      answer: 'Einrichtungstyp, Teamgroesse, gewuenschter Zeitrahmen und Hinweise zu Integrationen wie PVS oder Exportformaten.'
    }
  ],
  sylt: [
    {
      question: 'Wann ist Sylt die richtige Wahl?',
      answer: 'Wenn komplexe Datenfluesse, mehrere Schnittstellen und stabile Verarbeitung in einem groesseren Setup abgebildet werden sollen.'
    },
    {
      question: 'Kann Sylt in bestehende Systeme integriert werden?',
      answer: 'Ja, die Einbindung erfolgt ueber definierte Schnittstellen und klare Datenfluesse, inklusive Validierung und nachvollziehbarer Verarbeitung.'
    },
    {
      question: 'Wie startet ein Projekt mit Sylt?',
      answer: 'Mit einem technischen Scope-Check fuer Datenquellen, Zielprozesse und Sicherheitsanforderungen, danach folgt die schrittweise Umsetzung.'
    }
  ],
  anonymisator: [
    {
      question: 'Wofuer eignet sich der Anonymisator besonders?',
      answer: 'Fuer die datenschutzorientierte Aufbereitung von Dokumenten und Datenexporten in Forschung, Analyse und Compliance-Kontexten.'
    },
    {
      question: 'Wie wird die Nachvollziehbarkeit sichergestellt?',
      answer: 'Ueber klare Regeln und Audit-Trail-orientierte Prozesse, damit ersichtlich bleibt, welche Schritte bei der Verarbeitung erfolgt sind.'
    },
    {
      question: 'Welche Daten sollten uebermittelt werden?',
      answer: 'Moeglichst minimierte Testdaten und keine unnoetigen sensiblen Inhalte in offenen Formularen.'
    }
  ]
}

function buildUseCases(product) {
  const curated = product?.id ? USE_CASES_BY_PRODUCT_ID[product.id] : null
  if (Array.isArray(curated) && curated.length > 0) return curated

  const tags = Array.isArray(product?.tags) ? product.tags : []
  const useCases = []

  if (tags.some((t) => String(t).toLowerCase().includes('anamnese'))) {
    useCases.push('Digitale Vorab-Erfassung von Informationen vor dem Termin.')
  }
  if (tags.some((t) => String(t).toLowerCase().includes('dsgvo') || String(t).toLowerCase().includes('datenschutz'))) {
    useCases.push('Datenschutzorientierte Prozesse (Datenminimierung, klare Zwecke).')
  }
  if (tags.some((t) => String(t).toLowerCase().includes('monitoring') || String(t).toLowerCase().includes('telemedizin'))) {
    useCases.push('Monitoring/Follow-up als Ergänzung zur Versorgung und Kommunikation.')
  }

  if (useCases.length === 0) {
    useCases.push('Pilotierung und Einführung entlang Ihrer Praxis-/Klinikprozesse.')
    useCases.push('Integration nach Bedarf (Workflows, Schnittstellen, Exporte).')
  }

  return useCases.slice(0, 3)
}

function buildFitBullets(product) {
  const category = typeof product?.category === 'string' ? product.category : ''
  const tech = Array.isArray(product?.tech) ? product.tech : []
  const tags = Array.isArray(product?.tags) ? product.tags : []

  const forWhomParts = []
  if (tags.some((t) => String(t).toLowerCase().includes('praxis'))) {
    forWhomParts.push('Praxen und MVZ')
  }
  if (category.toLowerCase().includes('clinic') || category.toLowerCase().includes('enterprise')) {
    forWhomParts.push('Kliniken und größere Setups')
  }
  if (forWhomParts.length === 0) {
    forWhomParts.push('Praxen, MVZ und medizinische Einrichtungen')
  }

  const prerequisitesParts = []
  if (tech.some((t) => String(t).toLowerCase().includes('node'))) {
    prerequisitesParts.push('klare technische Rahmenbedingungen (z.B. Systemzugriffe/Interfaces)')
  }
  if (tags.some((t) => String(t).toLowerCase().includes('dsgvo') || String(t).toLowerCase().includes('datenschutz'))) {
    prerequisitesParts.push('Datenschutzanforderungen und Zweckbindung sind vorab definiert')
  }
  if (prerequisitesParts.length === 0) {
    prerequisitesParts.push('kurzer Pilot-Check (Ziele, Prozesse, Datenflüsse)')
  }

  const integrationParts = []
  if (tags.some((t) => String(t).toLowerCase().includes('pvs')) || String(product?.longDescription || '').toLowerCase().includes('pvs')) {
    integrationParts.push('Export/Übergabe an Praxissoftware (PVS) nach Bedarf')
  }
  integrationParts.push('Schnittstellen/Exporte und Workflows nach Ihren Anforderungen')

  return [
    {
      label: 'Für wen',
      text: forWhomParts.join(', ') + ' – wenn Abläufe standardisiert und Zeit gespart werden sollen.'
    },
    {
      label: 'Voraussetzungen',
      text: prerequisitesParts.join('; ') + '.'
    },
    {
      label: 'Integrationen',
      text: integrationParts.join(' · ') + '.'
    }
  ]
}

function buildProductFaq(product) {
  const curated = product?.id ? PRODUCT_FAQ_BY_PRODUCT_ID[product.id] : null
  if (Array.isArray(curated) && curated.length > 0) return curated

  const title = typeof product?.title === 'string' ? product.title : 'Diese Loesung'
  const category = typeof product?.category === 'string' ? product.category : 'MedTech-Anwendung'

  return [
    {
      question: `Fuer wen ist ${title} geeignet?`,
      answer: `${title} eignet sich fuer Praxen, MVZ und medizinische Einrichtungen, die ${category.toLowerCase()} strukturiert einfuehren und Prozesse vereinfachen wollen.`
    },
    {
      question: 'Wie laeuft die Einfuehrung typischerweise ab?',
      answer: 'Ueblich ist ein Pilot mit klaren Zielen, danach werden Integrationen, Rollen und der Rollout schrittweise umgesetzt.'
    },
    {
      question: 'Wie starte ich am schnellsten?',
      answer: 'Am schnellsten ueber eine kurze Anfrage mit Zielbild, Zeitplan und Integrationsbedarf.'
    }
  ]
}

export default function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/data/products.json')
        if (!response.ok) {
          throw new Error(`Failed to load products: ${response.status}`)
        }

        const data = await response.json()
        const products = Array.isArray(data?.products) ? data.products : []
        const found = products.find((p) => p?.id === productId) ?? null

        if (!cancelled) {
          setProduct(found)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Produkt konnte nicht geladen werden. Bitte versuchen Sie es später erneut.')
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [productId])

  const repoUrl = useMemo(() => {
    if (!product?.repoUrl) return null
    return getValidatedRepoUrl(product.repoUrl)
  }, [product?.repoUrl])

  const useCases = useMemo(() => buildUseCases(product), [product])
  const fitBullets = useMemo(() => buildFitBullets(product), [product])
  const productFaq = useMemo(() => buildProductFaq(product), [product])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-medical-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Produkt wird geladen...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-900 mb-2">Fehler</h1>
          <p className="text-red-700 mb-4">{error}</p>
          <Link to="/products" className="btn-secondary bg-gray-50 text-gray-800 hover:bg-gray-100">
            Zur Produktübersicht
          </Link>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Produkt nicht gefunden</h1>
          <p className="text-gray-600 mb-6">Dieses Produkt existiert nicht (mehr) oder die URL ist falsch.</p>
          <Link to="/products" className="btn-primary">
            Zur Produktübersicht
          </Link>
        </div>
      </div>
    )
  }

  const priceLabel = product.priceLabel || 'ab'
  const price = typeof product.priceEUR === 'number' ? product.priceEUR : Number(product.priceEUR)
  const formattedPrice = Number.isFinite(price) ? `${priceLabel} ${price.toLocaleString('de-DE')} €` : `${priceLabel} –`

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-medical-blue-600 to-medical-blue-800 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-5xl mx-auto">
          <nav className="text-medical-blue-100 text-sm mb-4" aria-label="Breadcrumb">
            <Link to="/products" className="hover:underline">
              Produkte
            </Link>
            <span className="mx-2">/</span>
            <span aria-current="page">{product.title}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
          <p className="text-xl md:text-2xl text-medical-blue-100 max-w-3xl">{product.shortDescription}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/kontakt" className="btn-primary bg-white text-medical-blue-700 hover:bg-gray-100">
              Beratung anfragen
            </Link>
            <Link to="/security" className="btn-secondary bg-medical-blue-700 text-white hover:bg-medical-blue-800 border-2 border-white">
              Security & Compliance
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Überblick</h2>
            <p className="text-gray-700">{product.longDescription}</p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Einsatz in der Praxis</h2>
            <p className="text-gray-700 mb-3">
              Typische Anwendungsfälle – als Orientierung, wie das Produkt in Abläufe eingebunden werden kann.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {useCases.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </section>

          {Array.isArray(product.features) && product.features.length > 0 ? (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Funktionen</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {Array.isArray(product.tech) && product.tech.length > 0 ? (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Technik</h2>
              <div className="flex flex-wrap gap-2">
                {product.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-medical-blue-50 text-medical-blue-700 rounded text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Für wen / Voraussetzungen / Integrationen</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {fitBullets.map((item) => (
                <li key={item.label}>
                  <span className="font-semibold">{item.label}:</span> {item.text}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Datenschutz & Sicherheit</h2>
            <p className="text-gray-700 mb-3">
              Fokus auf Datenminimierung, sichere Defaults und nachvollziehbare Verarbeitung – ohne unnötige personenbezogene Logs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/privacy" className="btn-secondary bg-gray-50 text-gray-800 hover:bg-gray-100">
                Datenschutzerklärung
              </Link>
              <Link to="/security" className="btn-secondary bg-gray-50 text-gray-800 hover:bg-gray-100">
                Security-Übersicht
              </Link>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Haeufige Fragen zu diesem Produkt</h2>
            <div className="space-y-3">
              {productFaq.map((qa) => (
                <details key={qa.question} className="border border-gray-200 rounded-lg p-4 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    <span>{qa.question}</span>
                    <span className="text-medical-blue-700 group-open:rotate-180 transition-transform">⌄</span>
                  </summary>
                  <p className="mt-2 text-gray-700 text-sm">{qa.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link to="/kontakt" className="text-medical-blue-700 hover:text-medical-blue-800 font-medium">
                Konkreten Bedarf besprechen
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/products" className="text-medical-blue-700 hover:text-medical-blue-800 font-medium">
                Weitere Produkte vergleichen
              </Link>
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Preis</h2>
            <p className="text-2xl font-bold text-medical-blue-700 mb-2">{formattedPrice}</p>
            {product.priceJustification ? <p className="text-gray-700 text-sm">{product.priceJustification}</p> : null}
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Nächster Schritt</h2>
            <p className="text-gray-700 text-sm mb-4">
              Kurze Anfrage senden – wir melden uns mit einem konkreten Vorschlag und einem realistischen Zeitplan.
            </p>
            <CheckoutButton product={product} />

            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/kontakt" className="text-sm text-medical-blue-700 hover:text-medical-blue-800 font-medium">
                Kontakt
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/roi" className="text-sm text-medical-blue-700 hover:text-medical-blue-800 font-medium">
                ROI prüfen
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/products" className="text-sm text-medical-blue-700 hover:text-medical-blue-800 font-medium">
                Alle Produkte
              </Link>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Weiterführend</h2>
            <div className="flex flex-wrap gap-2">
              <Link to="/security" className="btn-secondary bg-gray-50 text-gray-800 hover:bg-gray-100">
                Security
              </Link>
              <Link to="/privacy" className="btn-secondary bg-gray-50 text-gray-800 hover:bg-gray-100">
                Datenschutz
              </Link>
              <Link to="/" className="btn-secondary bg-gray-50 text-gray-800 hover:bg-gray-100">
                Startseite
              </Link>
            </div>
          </section>

          {repoUrl ? (
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Repository</h2>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-medical-blue-700 hover:text-medical-blue-800 font-medium"
              >
                GitHub öffnen
              </a>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
