import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '../test/setup'
import LeadForm from './LeadForm'

function renderWithRouter(ui) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{ui}</MemoryRouter>
    </I18nextProvider>
  )
}

describe('LeadForm', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('disables submit until required fields and consent are set', () => {
    renderWithRouter(<LeadForm productId="p1" />)

    const submit = screen.getByRole('button', { name: /anfrage senden/i })
    expect(submit).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/e-mail \*/i), { target: { value: 'arzt@example.com' } })
    fireEvent.change(screen.getByLabelText(/praxis \/ einrichtung \*/i), { target: { value: 'Praxis Dr. Beispiel' } })

    expect(submit).toBeDisabled()

    fireEvent.click(screen.getByLabelText(/ich willige ein/i))
    expect(submit).toBeEnabled()
  })

  it('submits payload and shows success on 200', async () => {
    const fetchMock = vi.fn(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true, requestId: 'req-1' })
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithRouter(<LeadForm productId="prod-1" />)

    fireEvent.change(screen.getByLabelText(/e-mail \*/i), { target: { value: 'arzt@example.com' } })
    fireEvent.change(screen.getByLabelText(/praxis \/ einrichtung \*/i), { target: { value: 'Praxis Dr. Beispiel' } })
    fireEvent.change(screen.getByLabelText(/telefon/i), { target: { value: '0123' } })
    fireEvent.change(screen.getByLabelText(/nachricht/i), { target: { value: 'Hallo' } })
    fireEvent.click(screen.getByLabelText(/ich willige ein/i))

    fireEvent.click(screen.getByRole('button', { name: /anfrage senden/i }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/übermittelt/i)
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/lead')
    expect(options.method).toBe('POST')

    const body = JSON.parse(options.body)
    expect(body).toMatchObject({
      email: 'arzt@example.com',
      organisation: 'Praxis Dr. Beispiel',
      phone: '0123',
      message: 'Hallo',
      productId: 'prod-1',
      consent: true
    })
  })

  it('shows helpful error on 503 (not configured)', async () => {
    const fetchMock = vi.fn(async () => {
      return {
        ok: false,
        status: 503,
        json: async () => ({ ok: false, requestId: 'req-x' })
      }
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithRouter(<LeadForm />)

    fireEvent.change(screen.getByLabelText(/e-mail \*/i), { target: { value: 'arzt@example.com' } })
    fireEvent.change(screen.getByLabelText(/praxis \/ einrichtung \*/i), { target: { value: 'Praxis Dr. Beispiel' } })
    fireEvent.click(screen.getByLabelText(/ich willige ein/i))

    fireEvent.click(screen.getByRole('button', { name: /anfrage senden/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/nicht konfiguriert/i)
    })
  })
})
