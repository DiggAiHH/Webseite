import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe, isStripeConfigured, stripeAppearance } from './stripeConfig'
import CheckoutForm from './CheckoutForm'

/**
 * PaymentPage Component
 * 
 * Full checkout page with Stripe Elements integration.
 * Handles the complete payment flow including form display and processing.
 * 
 * @param {Object} props
 * @param {Object} props.product - The product being purchased
 * @param {Function} props.onSuccess - Callback when payment succeeds
 * @param {Function} props.onCancel - Callback when user cancels
 */
const PaymentPage = ({ product, onSuccess, onCancel }) => {
  const [stripeReady, setStripeReady] = useState(false)
  const [stripeError, setStripeError] = useState(null)

  // Extract product fields with defaults for safety
  const title = product?.title || ''
  const shortDescription = product?.shortDescription || ''
  const priceEUR = product?.priceEUR

  useEffect(() => {
    if (isStripeConfigured()) {
      getStripe()
        .then((stripe) => {
          if (stripe) {
            setStripeReady(true)
          } else {
            setStripeError('Stripe konnte nicht geladen werden.')
          }
        })
        .catch(() => {
          setStripeError('Fehler beim Laden der Zahlungsschnittstelle.')
        })
    }
  }, [])

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '-'
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  // Validate product prop after hooks
  if (!product || typeof product !== 'object') {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-red-600">Produktdaten nicht verfügbar.</p>
        {onCancel && (
          <button onClick={onCancel} className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-900">
            Zurück
          </button>
        )}
      </div>
    )
  }

  // Demo mode when Stripe is not configured
  if (!isStripeConfigured()) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-medical-blue-600 to-medical-blue-800 text-white p-6">
            <h1 className="text-2xl font-bold">Bestellung aufgeben</h1>
            <p className="text-medical-blue-100 mt-1">Sichere Zahlung mit Stripe</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Product Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-2">{title}</h2>
              <p className="text-sm text-gray-600 mb-3">{shortDescription}</p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-600">Gesamtbetrag:</span>
                <span className="text-2xl font-bold text-medical-blue-600">
                  {formatPrice(priceEUR)}
                </span>
              </div>
            </div>

            {/* Demo Mode Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-medium text-amber-800">Demo-Modus aktiv</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Die Online-Zahlung ist derzeit im Demo-Modus. Bitte kontaktieren Sie uns für eine Bestellung.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div className="space-y-4">
              <a
                href={`mailto:kontakt@diggaihh.de?subject=${encodeURIComponent(`Bestellung: ${title}`)}&body=${encodeURIComponent(`Ich interessiere mich für das Produkt "${title}" zum Preis von ${formatPrice(priceEUR)}.`)}`}
                className="flex items-center justify-center w-full px-6 py-3 bg-medical-blue-600 text-white rounded-lg hover:bg-medical-blue-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Per E-Mail anfragen
              </a>

              <button
                onClick={onCancel}
                className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Zurück zur Produktübersicht
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SSL-Verschlüsselt
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  DSGVO-konform
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (!stripeReady && !stripeError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-medical-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Zahlungsschnittstelle wird geladen...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (stripeError) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Fehler</h3>
          <p className="text-red-700 mb-4">{stripeError}</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Zurück
          </button>
        </div>
      </div>
    )
  }

  // Stripe Elements (production mode)
  return (
    <Elements stripe={getStripe()} options={{ appearance: stripeAppearance }}>
      <CheckoutForm product={product} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  )
}

export default PaymentPage
