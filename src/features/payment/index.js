/**
 * Payment Feature Module
 * 
 * Stripe-based payment integration for DiggAiHH MedTech Platform.
 * 
 * Usage:
 * - CheckoutButton: Simple button to initiate checkout for a product
 * - PaymentPage: Full checkout page with Stripe Elements
 * - stripeConfig: Configuration and utilities for Stripe
 */

export { default as CheckoutButton } from './CheckoutButton'
export { default as PaymentPage } from './PaymentPage'
export { default as CheckoutForm } from './CheckoutForm'
export { 
  getStripe, 
  isStripeConfigured, 
  stripeAppearance,
  SUPPORTED_CURRENCIES,
  PAYMENT_OPTIONS 
} from './stripeConfig'
