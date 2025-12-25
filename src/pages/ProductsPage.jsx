import { useState, useEffect, useRef, useCallback } from 'react'
import { validateURL } from '../utils/security'
import { CheckoutButton } from '../features/payment'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const closeButtonRef = useRef(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/data/products.json')
      
      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid product data structure')
      }
      
      setProducts(data.products)
      setError(null)
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Produkte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    const applyHashToSelection = () => {
      const hash = window.location.hash.replace('#', '')

      if (hash && products.length > 0) {
        const product = products.find(p => p.id === hash)
        if (product) {
          setSelectedProduct(product)
          return
        }
      }

      // If no valid hash or product not found, clear the selection
      setSelectedProduct(null)
    }

    // Apply current hash when products are loaded/updated
    applyHashToSelection()

    // Keep selection in sync with URL hash on browser navigation
    const handleHashChange = () => {
      applyHashToSelection()
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [products])

  const openProductDetail = (product) => {
    setSelectedProduct(product)
    window.location.hash = product.id
  }

  const closeProductDetail = () => {
    setSelectedProduct(null)
    window.location.hash = ''
  }

  useEffect(() => {
    if (!selectedProduct) {
      return
    }

    if (typeof document === 'undefined' || !document.body) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus close button when modal opens for accessibility
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    // Handle Escape key to close modal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeProductDetail()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedProduct])
  const formatPrice = (price, label = 'ab', locale = 'de-DE') => {
    if (price === null || price === undefined) {
      return label ? `${label} -` : '-'
    }

    const numericPrice = typeof price === 'number' ? price : Number(price)
    if (Number.isNaN(numericPrice)) {
      return label ? `${label} -` : '-'
    }

    return `${label} ${numericPrice.toLocaleString(locale)} €`
  }

  const getComplexityBadgeColor = (complexity) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityLabel = (complexity) => {
    switch (complexity) {
      case 'low':
        return 'Einfach'
      case 'medium':
        return 'Mittel'
      case 'high':
        return 'Komplex'
      default:
        return complexity
    }
  }

  // Validate repository URL for security - only show link if valid GitHub URL
  const getValidatedRepoUrl = useCallback((url) => {
    const validation = validateURL(url, ['github.com'])
    return validation.isValid ? validation.url : null
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-medical-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Produkte werden geladen...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-1">Fehler beim Laden</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadProducts}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-medical-blue-600 to-medical-blue-800 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Unsere Produkte & Lösungen
        </h1>
        <p className="text-xl md:text-2xl text-medical-blue-100 mb-4">
          Portfolio innovativer MedTech-Lösungen für Praxen und Kliniken
        </p>
        <p className="text-medical-blue-100 max-w-3xl">
          Alle Preise sind Beispielpreise und verstehen sich als Orientierungswerte.
          Die tatsächlichen Kosten hängen von Ihren spezifischen Anforderungen, 
          Anpassungswünschen und dem Umfang der Integration ab.
        </p>
      </section>

      {/* Products Grid */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {products.length} {products.length === 1 ? 'Produkt' : 'Produkte'} verfügbar
        </h2>
        
        {products.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">Keine Produkte verfügbar</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <article 
                key={product.id}
                className="card hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() => openProductDetail(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openProductDetail(product)
                  }
                }}
                aria-label={`Details zu ${product.title} anzeigen`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.title}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getComplexityBadgeColor(product.complexity)}`}>
                    {getComplexityLabel(product.complexity)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {product.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tech.slice(0, 3).map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 bg-medical-blue-50 text-medical-blue-700 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {product.tech.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      +{product.tech.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-medical-blue-600">
                    {formatPrice(product.priceEUR, product.priceLabel)}
                  </span>
                  <span className="text-medical-blue-600 font-medium flex items-center">
                    Details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeProductDetail}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-medical-blue-600 to-medical-blue-800 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 id="modal-title" className="text-3xl font-bold mb-2">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-medical-blue-100">
                    {selectedProduct.category}
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={closeProductDetail}
                  className="text-white hover:bg-medical-blue-700 rounded-lg p-2 transition-colors"
                  aria-label="Schließen"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {/* Description */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Beschreibung</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedProduct.longDescription}
                </p>
              </section>

              {/* Features */}
              {selectedProduct.features && selectedProduct.features.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {selectedProduct.features.map((feature, index) => (
                      <li key={`${feature}-${index}`} className="flex items-start">
                        <svg className="w-5 h-5 text-medical-accent-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Tech Stack */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Technologie-Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tech.map((tech, index) => (
                    <span 
                      key={`${tech}-${index}`}
                      className="px-3 py-1.5 bg-medical-blue-100 text-medical-blue-800 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              {/* Tags */}
              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Kategorien</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.tags.map((tag, index) => (
                      <span 
                        key={`${tag}-${index}`}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Pricing */}
              <section className="bg-medical-blue-50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Preisinformation</h3>
                    <p className="text-4xl font-bold text-medical-blue-600">
                      {formatPrice(selectedProduct.priceEUR, selectedProduct.priceLabel)}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getComplexityBadgeColor(selectedProduct.complexity)}`}>
                    Komplexität: {getComplexityLabel(selectedProduct.complexity)}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-4 border border-medical-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Preisbegründung</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedProduct.priceJustification}
                  </p>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  * Alle Preise sind Richtwerte. Finale Preise werden nach Analyse Ihrer spezifischen Anforderungen erstellt.
                </p>
              </section>

              {/* Action Buttons */}
              <section className="flex flex-wrap gap-4">
                {/* Checkout Button */}
                <CheckoutButton product={selectedProduct} />
                
                {/* Repository Link - Only show if URL is valid */}
                {(() => {
                  const validUrl = getValidatedRepoUrl(selectedProduct.repoUrl)
                  if (!validUrl) return null
                  return (
                    <a
                      href={validUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                      Zum GitHub Repository
                    </a>
                  )
                })()}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
