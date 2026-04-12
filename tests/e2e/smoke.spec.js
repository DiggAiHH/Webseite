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

  // Force German locale so tests match German UI labels.
  await page.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    { key: 'i18nextLng', value: 'de' }
  )
})

test('Homepage lädt und hat sinnvollen Title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Praxis-IT')
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')

  await expect(page).toHaveTitle(/DiggAiHH/i)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/$/)
})

test('Navigation zu Kontakt funktioniert', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Kontakt' }).click()

  await expect(page).toHaveURL(/\/kontakt\/?$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kontakt')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/kontakt\/?$/)
})

test('Alias-Routen leiten auf kanonische Ziele', async ({ page }) => {
  await page.goto('/contact')
  await expect(page).toHaveURL(/\/kontakt\/?$/)

  await page.goto('/datenschutz')
  await expect(page).toHaveURL(/\/privacy\/?$/)
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

test('Agent-Manifest ist verfügbar', async ({ request }) => {
  const aiManifest = await request.get('/.well-known/ai.json')
  expect(aiManifest.ok()).toBeTruthy()

  const data = await aiManifest.json()
  expect(data).toHaveProperty('machineReadable')
  expect(data.machineReadable).toHaveProperty('products')
  expect(data.machineReadable).toHaveProperty('integrations')
  expect(data).toHaveProperty('repository')
  expect(data.repository).toHaveProperty('packCommand', 'npm run aeo:pack')
  expect(data.repository).toHaveProperty('validateCommand', 'npm run validate:aeo')
})

test('AEO-Ressourcen sind verfügbar', async ({ request }) => {
  const integrationManifest = await request.get('/.well-known/agent-integration.json')
  expect(integrationManifest.ok()).toBeTruthy()
  const integrationData = await integrationManifest.json()
  expect(Array.isArray(integrationData.sources)).toBeTruthy()
  expect(integrationData.sources.length).toBeGreaterThan(0)
  expect(integrationData).toHaveProperty('localBuild')
  expect(integrationData.localBuild).toHaveProperty('command', 'npm run aeo:pack')
  expect(integrationData.localBuild).toHaveProperty('validateCommand', 'npm run validate:aeo')

  const llms = await request.get('/llms.txt')
  expect(llms.ok()).toBeTruthy()
  const llmsText = await llms.text()
  expect(llmsText).toContain('Machine Readable Data')

  const integrationGuide = await request.get('/agent-integration.md')
  expect(integrationGuide.ok()).toBeTruthy()

  const integrationCatalog = await request.get('/data/agent-integrations.json')
  expect(integrationCatalog.ok()).toBeTruthy()
  const catalogData = await integrationCatalog.json()
  expect(Array.isArray(catalogData.integrations)).toBeTruthy()
  expect(catalogData.integrations.length).toBeGreaterThan(0)

  const entityMap = await request.get('/data/product-entity-map.json')
  expect(entityMap.ok()).toBeTruthy()
  const entityData = await entityMap.json()
  expect(Array.isArray(entityData.entities)).toBeTruthy()
  expect(entityData.entities.length).toBeGreaterThan(0)

  const comparison = await request.get('/data/product-comparison.json')
  expect(comparison.ok()).toBeTruthy()
  const comparisonData = await comparison.json()
  expect(Array.isArray(comparisonData.products)).toBeTruthy()
  expect(comparisonData.products.length).toBeGreaterThan(0)
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
  // react-helmet-async injects script tags asynchronously
  await page.waitForSelector('script[type="application/ld+json"]', { state: 'attached', timeout: 5000 })
  const homeLd = await getJsonLdBlocks(page)
  expect(homeLd.length).toBeGreaterThan(0)

  // Products
  await page.goto('/products')
  await page.waitForSelector('script[type="application/ld+json"]', { state: 'attached', timeout: 5000 })
  const productsLd = await getJsonLdBlocks(page)
  expect(productsLd.length).toBeGreaterThan(0)

  // Product detail (use first available product link)
  const firstProductLink = page.locator('a[href^="/products/"]').first()
  await expect(firstProductLink).toHaveCount(1)
  await firstProductLink.click()
  await expect(page).toHaveURL(/\/products\//)

  await page.waitForSelector('script[type="application/ld+json"]', { state: 'attached', timeout: 5000 })
  const detailLd = await getJsonLdBlocks(page)
  expect(detailLd.length).toBeGreaterThan(0)
})
