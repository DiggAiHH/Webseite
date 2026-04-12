import { describe, expect, it, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '../utils/theme'
import ThemeToggle from './ThemeToggle'

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    delete document.documentElement.dataset.theme
  })

  it('toggles between light and dark theme labels', () => {
    renderToggle()

    const toggle = screen.getByRole('button', { name: /dunkles design aktivieren/i })
    expect(toggle).toBeInTheDocument()

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: /helles design aktivieren/i })).toBeInTheDocument()
  })
})
