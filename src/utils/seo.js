import { PRODUCT_SEO_INDEX, getProductSeoById } from './productSeoIndex.js'

export const BASE_URL = 'https://diggaihh.de'

const ORGANIZATION_NAME = 'DiggAiHH UG'
const SERVICE_TYPES = ['MedTech SaaS', 'Praxisdigitalisierung', 'Datenschutzorientierte KI-Loesungen']
const SERVICE_AREAS = ['DE', 'AT', 'CH']

const POSTAL_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Jasminstrasse 24',
  postalCode: '44289',
  addressLocality: 'Dortmund',
  addressCountry: 'DE'
}

const GLOBAL_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DiggAiHH',
    url: BASE_URL
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    address: POSTAL_ADDRESS,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'laith.alshdaifat@hotmail.com',
      telephone: '+4915213814065',
      availableLanguage: ['German', 'English']
    },
    sameAs: ['https://github.com/DiggAiHH']
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: ORGANIZATION_NAME,
    url: BASE_URL,
    image: `${BASE_URL}/og-image.svg`,
    address: POSTAL_ADDRESS,
    telephone: '+4915213814065',
    email: 'laith.alshdaifat@hotmail.com',
    serviceType: SERVICE_TYPES,
    areaServed: SERVICE_AREAS.map((code) => ({ '@type': 'Country', name: code }))
  }
]

function normalizeJsonLd(jsonLd) {
  return Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []
}

function mergeJsonLd(globalJsonLd, localJsonLd) {
  const combined = [...normalizeJsonLd(globalJsonLd), ...normalizeJsonLd(localJsonLd)]
  const seen = new Set()
  const result = []

  for (const entry of combined) {
    if (!entry || typeof entry !== 'object') continue
    const type = entry['@type'] ?? ''
    const url = entry.url ?? entry.item ?? entry.name ?? ''
    const key = `${type}|${url}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push(entry)
  }

  return result.length > 0 ? result : undefined
}

const HOME_FAQ = [
  {
    question: 'Für wen sind die Lösungen gedacht?',
    answer:
      'Für Praxen, MVZ und medizinische Einrichtungen, die Abläufe digitalisieren, Prozesse vereinheitlichen und Entscheidungen mit belastbaren Kennzahlen treffen möchten.'
  },
  {
    question: 'Muss ich mit großen IT-Projekten rechnen?',
    answer:
      'Nein. Der Einstieg ist modular möglich: Start mit einem Pilot, klare Anforderungen, dann Rollout – ohne unnötige Datenerfassung.'
  },
  {
    question: 'Wie geht ihr mit Datenschutz um?',
    answer:
      'Fokus auf Datenminimierung und sichere Defaults. Bitte keine Gesundheitsdaten über Website/Formulare übermitteln.'
  },
  {
    question: 'Wie starte ich am schnellsten?',
    answer: 'Nutzen Sie den ROI-Rechner oder senden Sie eine kurze Anfrage über die Kontaktseite.'
  }
]

const PRODUCTS_FAQ = [
  {
    question: 'Gibt es zu jedem Produkt eine eigene Seite?',
    answer: 'Ja. Jedes Produkt hat eine indexierbare Detailseite mit Leistungsumfang, Tech-Stack und Richtpreis.'
  },
  {
    question: 'Sind die Preise verbindlich?',
    answer: 'Nein. Preise sind Richtwerte; der finale Preis hängt von Anforderungen, Integration und Anpassungen ab.'
  },
  {
    question: 'Welche Informationen helfen für ein Angebot?',
    answer: 'Einrichtungstyp, Fachrichtung/Teamgröße, gewünschte Lösung(en), Zeitplan und Integrationsbedarf (PVS/TI/Schnittstellen).'
  },
  {
    question: 'Kann ich nur ein Modul nutzen?',
    answer: 'Ja. Die Module sind einzeln nutzbar oder kombinierbar, je nach Ziel (Kosten, Qualität, Compliance, Entlastung).'
  }
]

const DEFAULT = {
  title: 'DiggAiHH - MedTech SaaS Platform | Digitale Lösungen für Praxen & Kliniken',
  description:
    'DiggAiHH ist MedTech SaaS für bessere Abläufe in Praxen & Kliniken – DSGVO-konform, sicher und auf messbaren Nutzen ausgelegt.',
  canonicalPath: '/',
  robots: 'index,follow',
  ogType: 'website',
  jsonLd: undefined
}

export const HOME_FAQ_ITEMS = HOME_FAQ
export const PRODUCTS_FAQ_ITEMS = PRODUCTS_FAQ

function buildWebPageJsonLd({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url
  }
}

function buildFeaturePageJsonLd(path, name, description) {
  return buildWebPageJsonLd({
    name,
    description,
    url: `${BASE_URL}${path}`
  })
}

function buildProductJsonLd({ id, title, description, priceEUR }) {
  const url = `${BASE_URL}/products/${id}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    brand: {
      '@type': 'Brand',
      name: 'DiggAiHH'
    },
    offers: {
      '@type': 'Offer',
      price: String(priceEUR),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url
    }
  }
}

function buildItemListJsonLd() {
  const items = Array.from(PRODUCT_SEO_INDEX.entries()).map(([id, entry], idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    item: {
      '@type': 'Product',
      name: entry.title,
      url: `${BASE_URL}/products/${id}`
    }
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: items
  }
}

function buildBreadcrumbListJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

function buildFaqPageJsonLd({ name, urlPath, questions }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name,
    url: `${BASE_URL}${urlPath}`,
    mainEntity: questions.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer
      }
    }))
  }
}

function buildProductFaqItems(product) {
  const category = typeof product?.category === 'string' ? product.category : 'MedTech-Anwendung'
  const title = typeof product?.title === 'string' ? product.title : 'die Loesung'

  return [
    {
      question: `Fuer wen ist ${title} geeignet?`,
      answer: `${title} eignet sich fuer Praxen, MVZ und medizinische Einrichtungen, die ${category.toLowerCase()} strukturiert einfuehren und Prozesse messbar verbessern wollen.`
    },
    {
      question: 'Wie laeuft die Einfuehrung ab?',
      answer:
        'Der Einstieg erfolgt in der Regel ueber einen Pilot mit klaren Zielen, danach werden Integrationen und Rollout schrittweise geplant.'
    },
    {
      question: 'Wie werden Datenschutz und Sicherheit beruecksichtigt?',
      answer:
        'Der Fokus liegt auf Datenminimierung, sicheren Defaults und nachvollziehbaren Prozessen. Sensible Gesundheitsdaten sollen nicht ueber offene Formulare gesendet werden.'
    },
    {
      question: 'Wie starte ich am schnellsten?',
      answer: 'Am schnellsten ueber die Kontaktseite mit Einrichtungstyp, Zielbild, Zeitplan und Integrationsbedarf.'
    }
  ]
}

const ROUTES = new Map([
  ['/', { canonicalPath: '/', jsonLd: buildFaqPageJsonLd({ name: 'FAQ', urlPath: '/', questions: HOME_FAQ }) }],
  [
    '/products',
    {
      title: 'Produkte | DiggAiHH',
      description: 'Produktübersicht der DiggAiHH MedTech SaaS-Lösungen inklusive Funktionen und Einsatzbereichen.',
      canonicalPath: '/products',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Produkte',
          url: `${BASE_URL}/products`
        },
        buildItemListJsonLd(),
        buildFaqPageJsonLd({ name: 'Produkte FAQ', urlPath: '/products', questions: PRODUCTS_FAQ })
      ]
    }
  ],
  [
    '/kontakt',
    {
      title: 'Kontakt | DiggAiHH',
      description: 'Kontaktieren Sie DiggAiHH. Kurze Anfrage senden – wir melden uns mit einem konkreten Vorschlag.',
      canonicalPath: '/kontakt',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Kontakt',
        url: 'https://diggaihh.de/kontakt'
      }
    }
  ],
  [
    '/privacy',
    {
      title: 'Datenschutzerklärung | DiggAiHH',
      description: 'Informationen zur Verarbeitung personenbezogener Daten und zu Ihren Rechten nach DSGVO.',
      canonicalPath: '/privacy',
      robots: 'noindex,follow',
      jsonLd: buildWebPageJsonLd({
        name: 'Datenschutzerklärung',
        description: 'Informationen zur Verarbeitung personenbezogener Daten und zu Ihren Rechten nach DSGVO.',
        url: 'https://diggaihh.de/privacy'
      })
    }
  ],
  [
    '/impressum',
    {
      title: 'Impressum | DiggAiHH',
      description: 'Impressum und Anbieterkennzeichnung gemäß den gesetzlichen Vorgaben.',
      canonicalPath: '/impressum',
      robots: 'noindex,follow',
      jsonLd: buildWebPageJsonLd({
        name: 'Impressum',
        description: 'Impressum und Anbieterkennzeichnung gemäß den gesetzlichen Vorgaben.',
        url: 'https://diggaihh.de/impressum'
      })
    }
  ],
  [
    '/security',
    {
      title: 'Sicherheit & Compliance | DiggAiHH',
      description: 'Überblick über Security- und Compliance-Maßnahmen (DSGVO, BSI IT-Grundschutz, ISO 27001).',
      canonicalPath: '/security',
      jsonLd: buildWebPageJsonLd({
        name: 'Sicherheit & Compliance',
        description: 'Überblick über Security- und Compliance-Maßnahmen (DSGVO, BSI IT-Grundschutz, ISO 27001).',
        url: 'https://diggaihh.de/security'
      })
    }
  ],
  [
    '/lageropt',
    {
      title: 'Lageroptimierung mit MHD | DiggAiHH',
      description: 'Intelligente Bestandsverwaltung mit MHD-Tracking, Chargenverfolgung und MDR-konformer Dokumentation.',
      canonicalPath: '/lageropt',
      jsonLd: buildFeaturePageJsonLd(
        '/lageropt',
        'Lageroptimierung mit MHD',
        'Intelligente Bestandsverwaltung mit MHD-Tracking, Chargenverfolgung und MDR-konformer Dokumentation.'
      )
    }
  ],
  [
    '/lageropt-basic',
    {
      title: 'Lageroptimierung (Basis) | DiggAiHH',
      description: 'Basis-Ansicht zur Lageroptimierung. Für Details und MHD-Tracking bitte die erweiterte Version nutzen.',
      canonicalPath: '/lageropt-basic',
      robots: 'noindex,follow',
      jsonLd: buildFeaturePageJsonLd(
        '/lageropt-basic',
        'Lageroptimierung Basis',
        'Basis-Ansicht zur Lageroptimierung fuer einen schnellen Einstieg.'
      )
    }
  ],
  [
    '/roi',
    {
      title: 'ROI-Rechner | DiggAiHH',
      description: 'Berechnen Sie den ROI Ihrer Digitalisierung mit Fokus auf Arbeitszeit-Einsparungen und Break-Even.',
      canonicalPath: '/roi',
      jsonLd: buildFeaturePageJsonLd(
        '/roi',
        'ROI-Rechner',
        'Berechnen Sie den ROI Ihrer Digitalisierung mit Fokus auf Arbeitszeit-Einsparungen und Break-Even.'
      )
    }
  ],
  [
    '/roi-basic',
    {
      title: 'ROI-Rechner (Basis) | DiggAiHH',
      description: 'Basis-Ansicht des ROI-Rechners. Für erweiterte Analysen bitte die Standard-Ansicht nutzen.',
      canonicalPath: '/roi-basic',
      robots: 'noindex,follow',
      jsonLd: buildFeaturePageJsonLd('/roi-basic', 'ROI-Rechner Basis', 'Basis-Ansicht des ROI-Rechners.')
    }
  ],
  [
    '/avatar',
    {
      title: 'Avatar-System | DiggAiHH',
      description: 'Personalisierte Assistenten und virtuelle Berater für medizinische Prozesse und Patienteninteraktion.',
      canonicalPath: '/avatar',
      jsonLd: buildFeaturePageJsonLd(
        '/avatar',
        'Avatar-System',
        'Personalisierte Assistenten und virtuelle Berater fuer medizinische Prozesse und Patienteninteraktion.'
      )
    }
  ],
  [
    '/praxis-twin',
    {
      title: 'Praxis-Twin | DiggAiHH',
      description: 'Gamification-System für den digitalen Praxisaufbau – Module per Drag & Drop, Fortschritt und Motivation.',
      canonicalPath: '/praxis-twin',
      jsonLd: buildFeaturePageJsonLd(
        '/praxis-twin',
        'Praxis-Twin',
        'Gamification-System fuer den digitalen Praxisaufbau mit Modulen und Fortschrittstracking.'
      )
    }
  ],
  [
    '/ai-god-mode',
    {
      title: 'Assistenzmodus (AI God Mode) | DiggAiHH',
      description: 'Requirements Wizard zur strukturierten Erfassung von Anforderungen inklusive JSON-Export.',
      canonicalPath: '/ai-god-mode',
      jsonLd: buildFeaturePageJsonLd(
        '/ai-god-mode',
        'Assistenzmodus',
        'Requirements Wizard zur strukturierten Erfassung von Anforderungen inklusive JSON-Export.'
      )
    }
  ],
  [
    '/praxis-manager',
    {
      title: 'Praxis Manager | DiggAiHH',
      description: 'Zentrale Steuerung Ihrer Praxis: Prozesse, Ressourcen und effiziente Abläufe in einem System.',
      canonicalPath: '/praxis-manager',
      jsonLd: buildFeaturePageJsonLd(
        '/praxis-manager',
        'Praxis Manager',
        'Zentrale Steuerung der Praxis mit Fokus auf Prozesse, Ressourcen und effiziente Ablaeufe.'
      )
    }
  ],
  [
    '/ai-daten-check',
    {
      title: 'AI Daten-Check & Anonymisator | DiggAiHH',
      description: 'KI-gestützte Analyse und Anonymisierung personenbezogener Daten – Datenschutz und Datenminimierung im Fokus.',
      canonicalPath: '/ai-daten-check',
      jsonLd: buildFeaturePageJsonLd(
        '/ai-daten-check',
        'AI Daten-Check',
        'KI-gestuetzte Analyse und Anonymisierung personenbezogener Daten mit Fokus auf Datenschutz.'
      )
    }
  ],
  [
    '/kiosk',
    {
      title: 'Kiosk-Systeme für Praxen | DiggAiHH',
      description: 'Self-Service-Terminals für Anmeldung, Warteschlangen-Management und digitale Formulare in der Praxis.',
      canonicalPath: '/kiosk',
      jsonLd: buildFeaturePageJsonLd(
        '/kiosk',
        'Kiosk-Systeme',
        'Self-Service-Terminals fuer Anmeldung, Warteschlangen-Management und digitale Formulare in der Praxis.'
      )
    }
  ],
  [
    '/anamnese',
    {
      title: 'Online-Anamnese | DiggAiHH',
      description: 'Digitale Vorab-Befragung für Praxen – strukturierte Erfassung und effiziente Vorbereitung von Terminen.',
      canonicalPath: '/anamnese',
      jsonLd: buildFeaturePageJsonLd(
        '/anamnese',
        'Online-Anamnese',
        'Digitale Vorab-Befragung fuer Praxen zur strukturierten Erfassung und effizienten Vorbereitung von Terminen.'
      )
    }
  ],
  [
    '/praxis-it',
    {
      title: 'Praxis IT | DiggAiHH',
      description: 'IT-Management und Compliance-Unterstützung für Praxen: Geräte, Netzwerk, FAQ und Security-Überblick.',
      canonicalPath: '/praxis-it',
      jsonLd: buildFeaturePageJsonLd(
        '/praxis-it',
        'Praxis IT',
        'IT-Management und Compliance-Unterstuetzung fuer Praxen mit Schwerpunkt auf Geraeten, Netzwerk und Sicherheit.'
      )
    }
  ]
])

function isNoindex(robotsValue) {
  return typeof robotsValue === 'string' && robotsValue.toLowerCase().startsWith('noindex')
}

export function getIndexableRoutePaths() {
  return Array.from(ROUTES.entries())
    .filter(([, value]) => !isNoindex(value?.robots ?? DEFAULT.robots))
    .map(([path]) => path)
}

export function getSeoForPath(pathname) {
  const rawKey = typeof pathname === 'string' ? pathname.replace(/\/$/, '') || '/' : '/'
  const key = rawKey === '/contact' ? '/kontakt' : rawKey === '/datenschutz' ? '/privacy' : rawKey

  if (key.startsWith('/products/') && key !== '/products') {
    const productId = key.split('/')[2] || ''
    const product = getProductSeoById(productId)

    if (product) {
      const title = `${product.title} | DiggAiHH`
      const description = product.description
      const productFaq = buildProductFaqItems(product)
      return {
        ...DEFAULT,
        title,
        description,
        canonicalPath: key,
        ogType: 'article',
        jsonLd: mergeJsonLd(GLOBAL_JSON_LD, [
          buildProductJsonLd({
            id: productId,
            title: product.title,
            description: product.description,
            priceEUR: product.priceEUR
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Startseite', url: `${BASE_URL}/` },
            { name: 'Produkte', url: `${BASE_URL}/products` },
            { name: product.title, url: `${BASE_URL}${key}` }
          ]),
          buildFaqPageJsonLd({
            name: `${product.title} FAQ`,
            urlPath: key,
            questions: productFaq
          })
        ])
      }
    }

    return {
      ...DEFAULT,
      title: 'Produktdetails | DiggAiHH',
      description: DEFAULT.description,
      canonicalPath: key,
      ogType: 'article',
      jsonLd: mergeJsonLd(GLOBAL_JSON_LD, [
        buildWebPageJsonLd({
          name: 'Produktdetails',
          description: DEFAULT.description,
          url: `${BASE_URL}${key}`
        }),
        buildBreadcrumbListJsonLd([
          { name: 'Startseite', url: `${BASE_URL}/` },
          { name: 'Produkte', url: `${BASE_URL}/products` },
          { name: 'Produktdetails', url: `${BASE_URL}${key}` }
        ])
      ])
    }
  }

  const candidate = ROUTES.get(key)
  if (candidate) {
    const merged = { ...DEFAULT, ...candidate }
    merged.jsonLd = mergeJsonLd(GLOBAL_JSON_LD, merged.jsonLd)
    return merged
  }

  return { ...DEFAULT, canonicalPath: key, jsonLd: mergeJsonLd(GLOBAL_JSON_LD, null) }
}
