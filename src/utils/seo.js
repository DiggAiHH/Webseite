import { PRODUCT_SEO_INDEX, getProductSeoById } from './productSeoIndex.js'

const BASE_URL = 'https://diggaihh.de'

const ORGANIZATION_NAME = 'DiggAiHH UG'

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
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jasminstraße 24',
      postalCode: '44289',
      addressLocality: 'Dortmund',
      addressCountry: 'DE'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'laith.alshdaifat@hotmail.com',
      telephone: '+4915213814065',
      availableLanguage: ['German', 'English']
    },
    sameAs: ['https://github.com/DiggAiHH']
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

function buildWebPageJsonLd({ name, description, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url
  }
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
      canonicalPath: '/lageropt'
    }
  ],
  [
    '/lageropt-basic',
    {
      title: 'Lageroptimierung (Basis) | DiggAiHH',
      description: 'Basis-Ansicht zur Lageroptimierung. Für Details und MHD-Tracking bitte die erweiterte Version nutzen.',
      canonicalPath: '/lageropt-basic',
      robots: 'noindex,follow'
    }
  ],
  [
    '/roi',
    {
      title: 'ROI-Rechner | DiggAiHH',
      description: 'Berechnen Sie den ROI Ihrer Digitalisierung mit Fokus auf Arbeitszeit-Einsparungen und Break-Even.',
      canonicalPath: '/roi'
    }
  ],
  [
    '/roi-basic',
    {
      title: 'ROI-Rechner (Basis) | DiggAiHH',
      description: 'Basis-Ansicht des ROI-Rechners. Für erweiterte Analysen bitte die Standard-Ansicht nutzen.',
      canonicalPath: '/roi-basic',
      robots: 'noindex,follow'
    }
  ],
  [
    '/avatar',
    {
      title: 'Avatar-System | DiggAiHH',
      description: 'Personalisierte Assistenten und virtuelle Berater für medizinische Prozesse und Patienteninteraktion.',
      canonicalPath: '/avatar'
    }
  ],
  [
    '/praxis-twin',
    {
      title: 'Praxis-Twin | DiggAiHH',
      description: 'Gamification-System für den digitalen Praxisaufbau – Module per Drag & Drop, Fortschritt und Motivation.',
      canonicalPath: '/praxis-twin'
    }
  ],
  [
    '/ai-god-mode',
    {
      title: 'Assistenzmodus (AI God Mode) | DiggAiHH',
      description: 'Requirements Wizard zur strukturierten Erfassung von Anforderungen inklusive JSON-Export.',
      canonicalPath: '/ai-god-mode'
    }
  ],
  [
    '/praxis-manager',
    {
      title: 'Praxis Manager | DiggAiHH',
      description: 'Zentrale Steuerung Ihrer Praxis: Prozesse, Ressourcen und effiziente Abläufe in einem System.',
      canonicalPath: '/praxis-manager'
    }
  ],
  [
    '/ai-daten-check',
    {
      title: 'AI Daten-Check & Anonymisator | DiggAiHH',
      description: 'KI-gestützte Analyse und Anonymisierung personenbezogener Daten – Datenschutz und Datenminimierung im Fokus.',
      canonicalPath: '/ai-daten-check'
    }
  ],
  [
    '/kiosk',
    {
      title: 'Kiosk-Systeme für Praxen | DiggAiHH',
      description: 'Self-Service-Terminals für Anmeldung, Warteschlangen-Management und digitale Formulare in der Praxis.',
      canonicalPath: '/kiosk'
    }
  ],
  [
    '/anamnese',
    {
      title: 'Online-Anamnese | DiggAiHH',
      description: 'Digitale Vorab-Befragung für Praxen – strukturierte Erfassung und effiziente Vorbereitung von Terminen.',
      canonicalPath: '/anamnese'
    }
  ],
  [
    '/praxis-it',
    {
      title: 'Praxis IT | DiggAiHH',
      description: 'IT-Management und Compliance-Unterstützung für Praxen: Geräte, Netzwerk, FAQ und Security-Überblick.',
      canonicalPath: '/praxis-it'
    }
  ]
])

export function getSeoForPath(pathname) {
  const key = typeof pathname === 'string' ? pathname.replace(/\/$/, '') || '/' : '/'

  if (key.startsWith('/products/') && key !== '/products') {
    const productId = key.split('/')[2] || ''
    const product = getProductSeoById(productId)

    if (product) {
      const title = `${product.title} | DiggAiHH`
      const description = product.description
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
          ])
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
