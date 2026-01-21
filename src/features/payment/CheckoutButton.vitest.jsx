import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CheckoutButton from './CheckoutButton'

vi.mock('./stripeConfig', () => {
  return {
    isStripeConfigured: () => false
  }
})

vi.mock('../../components/LeadForm', () => {
  return {
    default: function MockLeadForm() {
      return <div>MOCK_LEADFORM</div>
    }
  }
})

describe('CheckoutButton', () => {
  it('does not render LeadForm until modal is opened', async () => {
    render(<CheckoutButton product={{ id: 'p1', title: 'Produkt X', priceEUR: 123 }} />)

    expect(screen.queryByText('MOCK_LEADFORM')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: /anfrage zu produkt x senden/i }))

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(await screen.findByText('MOCK_LEADFORM')).toBeInTheDocument()
  })
})
