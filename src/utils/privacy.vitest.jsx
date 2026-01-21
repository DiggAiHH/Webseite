import { describe, expect, it, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { usePrivacyConsent, useSessionTimeout } from './privacy'

function ConsentHarness() {
  const { consent, updateConsent, hasConsented, isHydrated } = usePrivacyConsent()

  return (
    <div>
      <div data-testid="isHydrated">{String(isHydrated)}</div>
      <div data-testid="hasConsented">{String(hasConsented)}</div>
      <div data-testid="analytics">{String(consent.analytics)}</div>
      <button onClick={() => updateConsent({ analytics: true })}>enable analytics</button>
    </div>
  )
}

function SessionHarness({ timeoutMinutes }) {
  const { isActive } = useSessionTimeout(timeoutMinutes)
  return <div data-testid="active">{String(isActive)}</div>
}

describe('privacy hooks', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('usePrivacyConsent hydrates and persists to localStorage', async () => {
    render(<ConsentHarness />)

    // Wait for hydration
    await waitFor(() => {
      expect(screen.getByTestId('isHydrated')).toHaveTextContent('true')
    })

    expect(screen.getByTestId('hasConsented')).toHaveTextContent('false')
    expect(screen.getByTestId('analytics')).toHaveTextContent('false')

    act(() => {
      screen.getByRole('button', { name: /enable analytics/i }).click()
    })

    expect(screen.getByTestId('hasConsented')).toHaveTextContent('true')
    expect(screen.getByTestId('analytics')).toHaveTextContent('true')

    const raw = localStorage.getItem('diggai-privacy-consent')
    expect(raw).toBeTruthy()
    const stored = JSON.parse(raw)
    expect(stored).toMatchObject({ essential: true, analytics: true })
    expect(typeof stored.timestamp).toBe('string')
    expect(stored.timestamp.length).toBeGreaterThan(10)
  })

  it('useSessionTimeout flips inactive after timeout and becomes active on user activity', () => {
    vi.useFakeTimers()

    render(<SessionHarness timeoutMinutes={0} />)
    expect(screen.getByTestId('active')).toHaveTextContent('true')

    act(() => {
      vi.advanceTimersByTime(60_001)
    })

    expect(screen.getByTestId('active')).toHaveTextContent('false')

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    })

    expect(screen.getByTestId('active')).toHaveTextContent('true')

    vi.useRealTimers()
  })
})
