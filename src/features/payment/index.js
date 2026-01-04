/**
 * Payment Feature Module
 * 
 * Stripe-based payment integration for DiggAiHH MedTech Platform.
 * 
 * Usage:
 * - CheckoutButton: Simple button to initiate checkout for a product
 * - stripeConfig: Configuration and utilities for Stripe
 */

export { default as CheckoutButton } from './CheckoutButton'
export { 
  getStripe, 
  isStripeConfigured, 
  stripeAppearance,
  SUPPORTED_CURRENCIES,
  PAYMENT_OPTIONS 
} from './stripeConfig'
