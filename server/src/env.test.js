import test from 'node:test'
import assert from 'node:assert/strict'
import { getEnv } from './env.js'

test('getEnv tolerates empty optional strings', () => {
  const previous = { ...process.env }

  try {
    process.env = {
      ...previous,
      PORT: '3000',
      SMTP_HOST: '',
      SMTP_USER: '',
      SMTP_PASS: '',
      MAIL_TO: 'kontakt@diggaihh.de',
      MAIL_FROM: 'no-reply@diggaihh.de',
      SMTP_SECURE: ''
    }

    const env = getEnv()
    assert.equal(env.PORT, 3000)
    assert.equal(env.SMTP_HOST, undefined)
    assert.equal(env.SMTP_USER, undefined)
    assert.equal(env.SMTP_PASS, undefined)
    assert.equal(env.SMTP_SECURE, undefined)
  } finally {
    process.env = previous
  }
})

test('getEnv parses SMTP_SECURE boolean', () => {
  const previous = { ...process.env }

  try {
    process.env = {
      ...previous,
      PORT: '3000',
      SMTP_SECURE: 'true'
    }

    const env = getEnv()
    assert.equal(env.SMTP_SECURE, true)
  } finally {
    process.env = previous
  }
})
