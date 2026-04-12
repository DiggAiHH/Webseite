import test from 'node:test'
import assert from 'node:assert/strict'
import { handler } from './health.mjs'

test('health function returns 200 payload for GET', async () => {
  const response = await handler({ httpMethod: 'GET' })

  assert.equal(response.statusCode, 200)
  assert.equal(response.headers['Content-Type'], 'application/json')
  assert.equal(response.headers['Cache-Control'], 'no-store')

  const body = JSON.parse(response.body)
  assert.equal(body.ok, true)
  assert.equal(body.status, 'healthy')
  assert.equal(body.runtime, 'netlify-functions')
  assert.ok(typeof body.timestamp === 'string' && body.timestamp.length > 10)
})

test('health function returns 405 for unsupported method', async () => {
  const response = await handler({ httpMethod: 'POST' })

  assert.equal(response.statusCode, 405)
  const body = JSON.parse(response.body)
  assert.equal(body.ok, false)
  assert.equal(body.error, 'METHOD_NOT_ALLOWED')
})
