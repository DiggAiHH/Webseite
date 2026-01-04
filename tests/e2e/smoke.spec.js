import { test, expect } from '@playwright/test'

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
