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

test('Kontakt: Submit ist erst nach Pflichtfeldern + Consent möglich', async ({ page }) => {
  await page.goto('/kontakt')

  const submit = page.getByRole('button', { name: /anfrage senden/i })
  await expect(submit).toBeDisabled()

  await page.getByLabel(/e-mail \*/i).fill('arzt@example.com')
  await page.getByLabel(/praxis \/ einrichtung \*/i).fill('Praxis Dr. Beispiel')

  await expect(submit).toBeDisabled()
  await page.getByLabel(/ich willige ein/i).check()
  await expect(submit).toBeEnabled()
})

test('Kontakt: erfolgreicher Submit zeigt Success (API gemockt)', async ({ page }) => {
  await page.route('**/api/lead', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback()
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, requestId: 'req-1' })
    })
  })

  await page.goto('/kontakt')

  await page.getByLabel(/e-mail \*/i).fill('arzt@example.com')
  await page.getByLabel(/praxis \/ einrichtung \*/i).fill('Praxis Dr. Beispiel')
  await page.getByLabel(/ich willige ein/i).check()

  await page.getByRole('button', { name: /anfrage senden/i }).click()

  const form = page.getByRole('form', { name: 'Anfrageformular' })
  await expect(form.getByRole('status')).toContainText(/übermittelt/i)
})

test('Produkte: Modal -> Anfrage senden funktioniert (API gemockt)', async ({ page }) => {
  await page.route('**/api/lead', async (route) => {
    if (route.request().method() !== 'POST') return route.fallback()
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, requestId: 'req-prod-1' })
    })
  })

  await page.goto('/products')

  // Open any product details via aria-label
  await page.getByRole('button', { name: /details zu/i }).first().click()

  // The checkout/lead CTA opens the lead modal
  await page.getByRole('button', { name: /anfrage zu/i }).click()

  const dialog = page.getByRole('dialog', { name: /anfrage senden/i })
  await expect(dialog).toBeVisible()

  // Fill LeadForm in modal
  await page.getByLabel(/e-mail \*/i).fill('arzt@example.com')
  await page.getByLabel(/praxis \/ einrichtung \*/i).fill('Praxis Dr. Beispiel')
  await page.getByLabel(/ich willige ein/i).check()

  const responsePromise = page.waitForResponse((response) => {
    return response.url().includes('/api/lead') && response.request().method() === 'POST'
  })

  await page.getByRole('button', { name: /anfrage senden/i }).click()
  const response = await responsePromise
  expect(response.ok()).toBeTruthy()

  // On success the modal closes (onSuccess callback).
  await expect(dialog).toHaveCount(0)
})
