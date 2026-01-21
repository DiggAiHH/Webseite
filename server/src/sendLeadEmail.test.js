import test, { mock } from 'node:test'
import assert from 'node:assert/strict'
import nodemailer from 'nodemailer'
import { sendLeadEmail } from './sendLeadEmail.js'

test('sendLeadEmail returns NOT_CONFIGURED when SMTP is missing', async () => {
  const env = {
    PORT: 3000,
    MAIL_TO: 'kontakt@diggaihh.de',
    MAIL_FROM: 'no-reply@diggaihh.de',
    MAIL_SUBJECT_PREFIX: '[DiggAiHH Anfrage]'
  }

  const result = await sendLeadEmail(env, {
    requestId: 'r-1',
    email: 'arzt@example.com',
    organisation: 'Praxis Dr. Beispiel',
    phone: '',
    message: 'Test',
    productId: 'p'
  })

  assert.deepEqual(result, { ok: false, error: 'NOT_CONFIGURED' })
})

test('sendLeadEmail calls nodemailer with expected fields', async () => {
  let capturedMail = null

  const mocked = mock.method(nodemailer, 'createTransport', () => {
    return {
      sendMail: async (mail) => {
        capturedMail = mail
        return { messageId: 'm-1' }
      }
    }
  })

  try {
    const env = {
      PORT: 3000,
      SMTP_HOST: 'smtp.example.local',
      SMTP_PORT: 587,
      SMTP_SECURE: false,
      SMTP_USER: 'user',
      SMTP_PASS: 'pass',
      MAIL_TO: 'kontakt@diggaihh.de',
      MAIL_FROM: 'no-reply@diggaihh.de',
      MAIL_SUBJECT_PREFIX: '[DiggAiHH Anfrage]'
    }

    const result = await sendLeadEmail(env, {
      requestId: 'r-2',
      email: 'arzt@example.com',
      organisation: 'Praxis Dr. Beispiel',
      phone: '0123',
      message: 'Hallo',
      productId: 'prod-1'
    })

    assert.deepEqual(result, { ok: true, attempts: 1 })
    assert.ok(capturedMail)
    assert.equal(capturedMail.from, 'no-reply@diggaihh.de')
    assert.equal(capturedMail.to, 'kontakt@diggaihh.de')
    assert.match(capturedMail.subject, /\[DiggAiHH Anfrage\]/)
    assert.match(capturedMail.text, /Request-ID: r-2/)
    assert.match(capturedMail.text, /E-Mail: arzt@example.com/)
  } finally {
    mocked.mock.restore()
  }
})

test('sendLeadEmail retries on transient errors and returns SEND_FAILED', async () => {
  let attempts = 0

  const mocked = mock.method(nodemailer, 'createTransport', () => {
    return {
      sendMail: async () => {
        attempts++
        const err = new Error('Connection refused')
        err.code = 'ECONNREFUSED'
        throw err
      }
    }
  })

  try {
    const env = {
      PORT: 3000,
      SMTP_HOST: 'smtp.example.local',
      SMTP_PORT: 587,
      SMTP_SECURE: false,
      SMTP_USER: 'user',
      SMTP_PASS: 'pass',
      MAIL_TO: 'kontakt@diggaihh.de',
      MAIL_FROM: 'no-reply@diggaihh.de'
    }

    const result = await sendLeadEmail(
      env,
      {
        requestId: 'r-3',
        email: 'test@example.com',
        organisation: 'Test Org',
        phone: '',
        message: '',
        productId: ''
      },
      { maxRetries: 2, retryDelayMs: 10 }
    )

    assert.equal(result.ok, false)
    assert.equal(result.error, 'SEND_FAILED')
    assert.equal(result.attempts, 2)
    assert.equal(result.retriable, true)
    assert.equal(attempts, 2)
  } finally {
    mocked.mock.restore()
  }
})
