import test from 'node:test'
import assert from 'node:assert/strict'
import { parseLeadPayload } from './leadSchema.js'

test('parseLeadPayload accepts valid minimal payload', () => {
  const result = parseLeadPayload({
    email: 'arzt@example.com',
    organisation: 'Praxis Dr. Beispiel',
    consent: true,
    hp: ''
  })

  assert.equal(result.ok, true)
  if (!result.ok) return

  assert.equal(result.data.email, 'arzt@example.com')
  assert.equal(result.data.organisation, 'Praxis Dr. Beispiel')
  assert.equal(result.data.productId, '')
})

test('parseLeadPayload rejects missing consent', () => {
  const result = parseLeadPayload({
    email: 'a@example.com',
    organisation: 'X'
  })

  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(result.error, 'INVALID')
})

test('parseLeadPayload treats honeypot as spam', () => {
  const result = parseLeadPayload({
    email: 'a@example.com',
    organisation: 'Organisation',
    consent: true,
    hp: 'filled'
  })

  assert.equal(result.ok, false)
  if (result.ok) return
  assert.equal(result.error, 'SPAM')
})
