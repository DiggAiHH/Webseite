import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import Seo from './Seo'

function renderSeo(props) {
  return render(
    <HelmetProvider>
      <Seo {...props} />
    </HelmetProvider>
  )
}

describe('Seo', () => {
  it('sets title, canonical, robots and JSON-LD', async () => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Test Page',
      url: 'https://example.test/test'
    }

    renderSeo({
      title: 'Test Title',
      description: 'Test Description',
      canonicalPath: '/test',
      robots: 'noindex,follow',
      ogType: 'website',
      jsonLd
    })

    await waitFor(() => {
      expect(document.title).toBe('Test Title')
    })

    const canonical = document.querySelector('link[rel="canonical"]')
    expect(canonical).toBeTruthy()
    expect(canonical.getAttribute('href')).toContain('/test')

    const robots = document.querySelector('meta[name="robots"]')
    expect(robots).toBeTruthy()
    expect(robots.getAttribute('content')).toBe('noindex,follow')

    await waitFor(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
      expect(scripts.length).toBeGreaterThan(0)

      const hasWebPage = scripts.some((node) => {
        try {
          const raw = node.innerHTML || node.textContent || ''
          const parsed = JSON.parse(raw)
          return parsed && parsed['@type'] === 'WebPage'
        } catch {
          return false
        }
      })

      expect(hasWebPage).toBe(true)
    })
  })
})
