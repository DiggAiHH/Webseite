import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { ThemeProvider } from './utils/theme'

function renderApp(route = '/') {
  return render(
    <ThemeProvider>
      <HelmetProvider>
        <MemoryRouter initialEntries={[route]}>
          <App />
        </MemoryRouter>
      </HelmetProvider>
    </ThemeProvider>
  )
}

describe('App Router', () => {
  it('renders home page at /', async () => {
    renderApp('/')
    expect(await screen.findByRole('main')).toBeInTheDocument()
  })

  it('renders 404 page for unknown routes', async () => {
    renderApp('/nonexistent-page')
    expect(await screen.findByText('404')).toBeInTheDocument()
    expect(screen.getByText(/nicht gefunden/i)).toBeInTheDocument()
  })

  it('redirects /contact to /kontakt', async () => {
    renderApp('/contact')
    // After redirect, contact page content should appear
    expect(await screen.findByText(/anfrageformular/i)).toBeInTheDocument()
  })

  it('redirects /datenschutz to /privacy', async () => {
    renderApp('/datenschutz')
    expect(await screen.findByText(/datenschutzerkl/i)).toBeInTheDocument()
  })
})
