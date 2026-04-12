import { describe, expect, it, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from './theme'

function ThemeHarness() {
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="is-dark">{String(isDark)}</div>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

describe('theme utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    delete document.documentElement.dataset.theme
  })

  it('applies and persists selected theme', () => {
    render(
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    )

    const root = document.documentElement
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(root.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('diggai-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: /toggle/i }))

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true')
    expect(root.classList.contains('dark')).toBe(true)
    expect(root.classList.contains('theme-dark')).toBe(true)
    expect(root.dataset.theme).toBe('dark')
    expect(localStorage.getItem('diggai-theme')).toBe('dark')
  })
})
