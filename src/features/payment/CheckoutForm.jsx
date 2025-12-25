import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

/**
 * CheckoutForm Component
 * 
 * Stripe Elements checkout form with validation and error handling.
 * Handles the actual payment processing.
 * 
 * @param {Object} props
 * @param {Object} props.product - The product being purchased
 * @param {Function} props.onSuccess - Callback when payment succeeds
 * @param {Function} props.onCancel - Callback when user cancels
 */
const CheckoutForm = ({ product, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '-'
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // In production, confirm payment with your PaymentIntent client secret
      // const { error: submitError } = await stripe.confirmPayment({
      //   elements,
      //   confirmParams: {
      //     return_url: `${window.location.origin}/payment-success`,
      //   },
      // })

      // For demo, simulate success
      console.log('Processing payment for:', product.title)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (onSuccess) {
        onSuccess({
          product,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-blue-600 to-medical-blue-800 text-white p-6">
          <h1 className="text-2xl font-bold">Sichere Zahlung</h1>
          <p className="text-medical-blue-100 mt-1">Powered by Stripe</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-900">{product.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{product.shortDescription}</p>
              </div>
              <span className="text-xl font-bold text-medical-blue-600">
                {formatPrice(product.priceEUR)}
              </span>
            </div>
          </div>

          {/* Payment Element */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Zahlungsmethode
            </label>
            <div className="border border-gray-200 rounded-lg p-4">
              <PaymentElement 
                options={{
                  layout: 'tabs',
                }}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full px-6 py-4 bg-medical-accent-600 text-white rounded-lg hover:bg-medical-accent-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Zahlung wird verarbeitet...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Jetzt bezahlen - {formatPrice(product.priceEUR)}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="w-full px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Abbrechen
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
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                </svg>
                Stripe Secure
              </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Ihre Zahlungsdaten werden sicher von Stripe verarbeitet und niemals auf unseren Servern gespeichert.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm
