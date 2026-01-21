import test from 'node:test'
import assert from 'node:assert/strict'
import { getSeoForPath } from './seo.js'

function normalizeJsonLd(jsonLd) {
  return Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []
}

test('getSeoForPath returns defaults for root', () => {
  const seo = getSeoForPath('/')
  assert.equal(typeof seo.title, 'string')
  assert.ok(seo.title.length > 0)
  assert.equal(seo.canonicalPath, '/')
})

test('getSeoForPath normalizes trailing slashes', () => {
  const a = getSeoForPath('/kontakt')
  const b = getSeoForPath('/kontakt/')
  assert.equal(a.canonicalPath, '/kontakt')
  assert.deepEqual(a, b)
})

test('getSeoForPath falls back for unknown routes', () => {
  const seo = getSeoForPath('/does-not-exist')
  assert.equal(seo.canonicalPath, '/does-not-exist')
  assert.ok(seo.title)
  assert.ok(seo.description)
})

test('getSeoForPath marks basic feature variants as noindex', () => {
  const lageropt = getSeoForPath('/lageropt-basic')
  assert.equal(lageropt.robots, 'noindex,follow')

  const roi = getSeoForPath('/roi-basic')
  assert.equal(roi.robots, 'noindex,follow')
})

test('getSeoForPath resolves product detail routes', () => {
  const seo = getSeoForPath('/products/anamnese-a')
  assert.equal(seo.canonicalPath, '/products/anamnese-a')
  assert.ok(seo.title.includes('Anamnese-A'))
  assert.ok(seo.description.includes('Online-Anamnese'))
})

test('getSeoForPath adds ItemList and FAQPage JSON-LD for products overview', () => {
  const seo = getSeoForPath('/products')
  const list = normalizeJsonLd(seo.jsonLd)

  assert.ok(list.some((entry) => entry && entry['@type'] === 'ItemList'))
  assert.ok(list.some((entry) => entry && entry['@type'] === 'FAQPage'))
})

test('getSeoForPath adds BreadcrumbList JSON-LD for product detail pages', () => {
  const seo = getSeoForPath('/products/anamnese-a')
  const list = normalizeJsonLd(seo.jsonLd)

  assert.ok(list.some((entry) => entry && entry['@type'] === 'BreadcrumbList'))
})

test('getSeoForPath includes Organization JSON-LD globally', () => {
  const seo = getSeoForPath('/products')
  const list = normalizeJsonLd(seo.jsonLd)
  assert.ok(list.some((entry) => entry && entry['@type'] === 'Organization'))
})
