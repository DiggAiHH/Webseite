import { useState, useEffect, useRef } from 'react'
import { isStripeConfigured } from './stripeConfig'

/**
 * CheckoutButton Component
 * 
 * Renders a checkout button that initiates the payment flow.
 * Shows a demo mode message if Stripe is not configured.
 * 
 * @param {Object} props
 * @param {Object} props.product - The product to purchase
 * @param {string} props.className - Additional CSS classes
 */
const CheckoutButton = ({ product, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoModal, setShowDemoModal] = useState(false)
  const [error, setError] = useState(null)
  const closeButtonRef = useRef(null)

  // Extract product fields with defaults for safety
  const title = product?.title || ''
  const priceEUR = product?.priceEUR

  // Modal accessibility: focus management and keyboard handling
  useEffect(() => {
    if (!showDemoModal) return

    // Focus close button when modal opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    // Lock body scroll
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Handle Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowDemoModal(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [showDemoModal])

  // Validate product prop after hooks
  if (!product || typeof product !== 'object') {
    return null
  }

  const handleCheckout = async () => {
    setError(null)
    
    if (!isStripeConfigured()) {
      // Show demo modal when Stripe is not configured
      setShowDemoModal(true)
      return
    }

    setIsLoading(true)

    try {
      // In production, this would call your backend to create a Checkout Session
      // Example: Call backend to create checkout session
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     productId: product.id,
      //     priceEUR: product.priceEUR,
      //     productName: product.title,
      //   }),
      // })
      // const { sessionUrl } = await response.json()
      // window.location.href = sessionUrl

      // Demo mode - show modal
      setShowDemoModal(true)
    } catch (err) {
      setError('Fehler beim Initialisieren der Zahlung. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '-'
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <>
      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`inline-flex items-center justify-center px-6 py-3 bg-medical-accent-600 text-white rounded-lg hover:bg-medical-accent-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label={`${title} kaufen für ${formatPrice(priceEUR)}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Verarbeite...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Jetzt anfragen
          </>
        )}
      </button>

      {/* Demo Modal */}
      {showDemoModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDemoModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="demo-modal-title"
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-medical-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <h3 id="demo-modal-title" className="text-xl font-bold text-gray-900 mb-2">
                Demo-Modus
              </h3>
              
              <p className="text-gray-600 mb-4">
                Die Zahlungsintegration befindet sich im Demo-Modus. 
                In der Produktionsversion werden Sie zur sicheren Stripe-Zahlung weitergeleitet.
              </p>

              <div className="bg-medical-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-medical-blue-900">
                  Produkt: {title}
                </p>
                <p className="text-2xl font-bold text-medical-blue-600">
                  {formatPrice(priceEUR)}
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:kontakt@diggaihh.de?subject=${encodeURIComponent(`Anfrage: ${title}`)}&body=${encodeURIComponent(`Ich interessiere mich für das Produkt "${title}" zum Preis von ${formatPrice(priceEUR)}.`)}`}
                  className="block w-full px-4 py-3 bg-medical-blue-600 text-white rounded-lg hover:bg-medical-blue-700 transition-colors font-medium"
                >
                  Per E-Mail anfragen
                </a>
                <button
                  ref={closeButtonRef}
                  onClick={() => setShowDemoModal(false)}
                  className="block w-full px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CheckoutButton
