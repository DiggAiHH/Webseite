export const PRODUCT_SEO_INDEX = new Map([
  [
    'anamnese-a',
    {
      title: 'Anamnese-A',
      description: 'Erweiterte Online-Anamnese-Lösung mit intelligenter Fragebogenführung für Praxen',
      category: 'Frontend Application',
      priceEUR: 2500
    }
  ],
  [
    'sylt',
    {
      title: 'Sylt',
      description: 'TypeScript-basierte MedTech-Anwendung für intelligente Datenverarbeitung',
      category: 'Backend/Data Processing',
      priceEUR: 8500
    }
  ],
  [
    'jordan-health-app',
    {
      title: 'Jordan Health App',
      description: 'Mobile-First Gesundheits-App für Patientenbetreuung und Monitoring',
      category: 'Mobile Application',
      priceEUR: 12000
    }
  ],
  [
    'anonymisator',
    {
      title: 'Anonymisator',
      description: 'DSGVO-konforme Anonymisierung und Pseudonymisierung medizinischer Daten',
      category: 'Data Privacy Tool',
      priceEUR: 6500
    }
  ],
  [
    'jobetes',
    {
      title: 'JoBetes',
      description: 'Dr. Alshdaifat Jordan Patients Follow-Up - Diabetes-Management-System',
      category: 'Specialized Medical Application',
      priceEUR: 9500
    }
  ],
  [
    'anamnese',
    {
      title: 'Anamnese',
      description: 'Basis Online-Anamnese-System für schnelle Patientenerfassung',
      category: 'Frontend Application',
      priceEUR: 1800
    }
  ],
  [
    'projekt-1',
    {
      title: 'Projekt-1',
      description: 'Experimentelles MedTech-Prototyping-Projekt für innovative Lösungsansätze',
      category: 'Development Framework',
      priceEUR: 4500
    }
  ]
])

export function getProductSeoById(productId) {
  if (typeof productId !== 'string' || productId.trim().length === 0) return null
  return PRODUCT_SEO_INDEX.get(productId) ?? null
}
