import test from 'node:test'
import assert from 'node:assert/strict'
import { getSeoForPath } from './seo.js'

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
