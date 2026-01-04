import test from 'node:test'
import assert from 'node:assert/strict'

import { createApp } from './app.js'

async function start(app) {
  const server = app.listen(0, '127.0.0.1')
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve()))
  }
}

test('GET /health returns ok', async () => {
  const app = createApp({ env: { PORT: 3000 } })
  const { baseUrl, close } = await start(app)

  try {
    const res = await fetch(`${baseUrl}/health`)
    assert.equal(res.status, 200)
    const text = await res.text()
    assert.equal(text, 'ok')
  } finally {
    await close()
  }
})

test('POST /lead returns 400 for invalid payload', async () => {
  const app = createApp({ env: { PORT: 3000 }, sendLeadEmail: async () => ({ ok: true }) })
  const { baseUrl, close } = await start(app)

  try {
    const res = await fetch(`${baseUrl}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })

    assert.equal(res.status, 400)
    const json = await res.json()
    assert.equal(json.ok, false)
    assert.equal(json.error, 'INVALID_REQUEST')
    assert.equal(typeof json.requestId, 'string')
    assert.ok(json.requestId.length > 10)
  } finally {
    await close()
  }
})

test('POST /lead returns 204 for honeypot spam', async () => {
  const app = createApp({ env: { PORT: 3000 }, sendLeadEmail: async () => ({ ok: true }) })
  const { baseUrl, close } = await start(app)

  try {
    const res = await fetch(`${baseUrl}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'arzt@example.com',
        organisation: 'Praxis Dr. Beispiel',
        consent: true,
        hp: 'filled'
      })
    })

    assert.equal(res.status, 204)
  } finally {
    await close()
  }
})

test('POST /lead returns 503 when service not configured', async () => {
  const app = createApp({
    env: { PORT: 3000 },
    sendLeadEmail: async () => ({ ok: false, error: 'NOT_CONFIGURED' })
  })
  const { baseUrl, close } = await start(app)

  try {
    const res = await fetch(`${baseUrl}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'arzt@example.com',
        organisation: 'Praxis Dr. Beispiel',
        consent: true,
        hp: ''
      })
    })

    assert.equal(res.status, 503)
    const json = await res.json()
    assert.equal(json.ok, false)
    assert.equal(json.error, 'SERVICE_NOT_CONFIGURED')
    assert.equal(typeof json.requestId, 'string')
  } finally {
    await close()
  }
})

test('POST /lead returns 200 on success and passes requestId to sender', async () => {
  /** @type {any} */
  let captured = null

  const app = createApp({
    env: { PORT: 3000 },
    sendLeadEmail: async (env, lead) => {
      captured = { env, lead }
      return { ok: true }
    }
  })
  const { baseUrl, close } = await start(app)

  try {
    const res = await fetch(`${baseUrl}/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'arzt@example.com',
        organisation: 'Praxis Dr. Beispiel',
        consent: true,
        hp: '',
        phone: '0123',
        message: 'Hallo',
        productId: 'prod-1'
      })
    })

    assert.equal(res.status, 200)
    const json = await res.json()
    assert.equal(json.ok, true)
    assert.equal(typeof json.requestId, 'string')

    assert.ok(captured)
    assert.equal(captured.lead.email, 'arzt@example.com')
    assert.equal(captured.lead.organisation, 'Praxis Dr. Beispiel')
    assert.equal(captured.lead.productId, 'prod-1')
    assert.equal(captured.lead.requestId, json.requestId)
  } finally {
    await close()
  }
})
