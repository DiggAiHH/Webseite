import { test, expect } from '@playwright/test'

async function getJsonLdBlocks(page) {
  const rawBlocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  const parsed = []

  for (const raw of rawBlocks) {
    const trimmed = (raw || '').trim()
    if (!trimmed) continue
    parsed.push(JSON.parse(trimmed))
  }

  return parsed
}

test.beforeEach(async ({ page }) => {
  // Prevent the privacy banner from intercepting clicks in E2E.
  const consent = {
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString()
  }

  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: 'diggai-privacy-consent', value: JSON.stringify(consent) }
  )
})

test('Homepage lädt und hat sinnvollen Title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Willkommen')

  await expect(page).toHaveTitle(/DiggAiHH/i)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$/)
})

test('Navigation zu Kontakt funktioniert', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Hauptnavigation').getByRole('link', { name: 'Kontakt' }).click()

  await expect(page).toHaveURL(/\/kontakt\/?$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kontakt')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/kontakt\/?$/)
})

test('robots.txt und sitemap.xml sind verfügbar', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.ok()).toBeTruthy()
  const robotsBody = await robots.text()
  expect(robotsBody).toContain('Sitemap:')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.ok()).toBeTruthy()
  const sitemapBody = await sitemap.text()
  expect(sitemapBody).toContain('<urlset')
})

test('Legal-Seiten sind noindex,follow', async ({ page }) => {
  for (const path of ['/privacy', '/impressum']) {
    await page.goto(path)

    const robotsMeta = page.locator('meta[name="robots"]')
    await expect(robotsMeta).toHaveCount(1)
    await expect(robotsMeta).toHaveAttribute('content', /noindex/i)
    await expect(robotsMeta).toHaveAttribute('content', /follow/i)
  }
})

test('JSON-LD ist auf Kernrouten vorhanden', async ({ page }) => {
  // Home
  await page.goto('/')
  const homeLd = await getJsonLdBlocks(page)
  expect(homeLd.length).toBeGreaterThan(0)

  // Products
  await page.goto('/products')
  const productsLd = await getJsonLdBlocks(page)
  expect(productsLd.length).toBeGreaterThan(0)

  // Product detail (use first available product link)
  const firstProductLink = page.locator('a[href^="/products/"]').first()
  await expect(firstProductLink).toHaveCount(1)
  await firstProductLink.click()
  await expect(page).toHaveURL(/\/products\//)

  const detailLd = await getJsonLdBlocks(page)
  expect(detailLd.length).toBeGreaterThan(0)
})
