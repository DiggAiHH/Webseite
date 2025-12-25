import { loadStripe } from '@stripe/stripe-js'

/**
 * Stripe Configuration for DiggAiHH MedTech Platform
 * 
 * IMPORTANT: Replace with your actual Stripe publishable key in production.
 * The publishable key is safe to expose in client-side code.
 * 
 * For production, set this via environment variable:
 * VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
 */

// Use test key for development, production key will be set via env
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'

// Lazy load Stripe to improve initial page load performance
let stripePromise = null

/**
 * Get the Stripe instance (lazy loaded)
 * @returns {Promise<import('@stripe/stripe-js').Stripe | null>}
 */
export const getStripe = () => {
  if (!stripePromise) {
    if (STRIPE_PUBLISHABLE_KEY !== 'pk_test_placeholder') {
      stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
    } else {
      // Always return a Promise to avoid runtime errors when Stripe is not configured
      stripePromise = Promise.resolve(null)
    }
  }
  return stripePromise
}

/**
 * Check if Stripe is properly configured
 * @returns {boolean}
 */
export const isStripeConfigured = () => {
  return STRIPE_PUBLISHABLE_KEY !== 'pk_test_placeholder'
}

/**
 * Stripe appearance configuration for consistent branding
 */
export const stripeAppearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#0284c7', // medical-blue-600
    colorBackground: '#ffffff',
    colorText: '#1f2937', // gray-800
    colorDanger: '#dc2626',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  rules: {
    '.Input': {
      border: '1px solid #d1d5db',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    },
    '.Input:focus': {
      border: '1px solid #0284c7',
      boxShadow: '0 0 0 3px rgba(2, 132, 199, 0.1)',
    },
    '.Label': {
      fontWeight: '500',
    },
  },
}

/**
 * Supported currencies
 */
export const SUPPORTED_CURRENCIES = {
  EUR: { symbol: '€', name: 'Euro', code: 'eur' },
}

/**
 * Default payment options
 */
export const PAYMENT_OPTIONS = {
  currency: 'eur',
  paymentMethodTypes: ['card', 'sepa_debit'],
  mode: 'payment',
}

export default {
  getStripe,
  isStripeConfigured,
  stripeAppearance,
  SUPPORTED_CURRENCIES,
  PAYMENT_OPTIONS,
}
