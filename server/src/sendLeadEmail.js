import nodemailer from 'nodemailer'
import { isEmailConfigured } from './env.js'

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

/**
 * Delay helper for retry logic
 * @param {number} ms - Milliseconds to wait
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Sends a lead email with retry logic. Never log PII.
 * @security Handles PII (email, phone, organisation) - no logging of payload content
 * 
 * @param {import('./env.js').getEnv extends (...args:any)=>infer R ? R : any} env
 * @param {{requestId: string, email: string, organisation: string, phone: string, message: string, productId: string}} lead
 * @param {{maxRetries?: number, retryDelayMs?: number}} [options]
 */
export async function sendLeadEmail(env, lead, options = {}) {
  const maxRetries = options.maxRetries ?? MAX_RETRIES
  const retryDelayMs = options.retryDelayMs ?? RETRY_DELAY_MS

  if (!isEmailConfigured(env)) {
    return { ok: false, error: 'NOT_CONFIGURED' }
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  })

  const subjectPrefix = env.MAIL_SUBJECT_PREFIX ?? '[DiggAiHH Anfrage]'
  const subject = `${subjectPrefix} ${lead.productId ? `(${lead.productId}) ` : ''}${lead.organisation}`.trim()

  const text = [
    `Request-ID: ${lead.requestId}`,
    '',
    `Organisation: ${lead.organisation}`,
    `E-Mail: ${lead.email}`,
    `Telefon: ${lead.phone || '-'}`,
    `Produkt-ID: ${lead.productId || '-'}`,
    '',
    'Nachricht:',
    lead.message || '-',
    ''
  ].join('\n')

  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await transporter.sendMail({
        from: env.MAIL_FROM,
        to: env.MAIL_TO,
        subject,
        text
      })
      return { ok: true, attempts: attempt }
    } catch (err) {
      lastError = err
      // Log attempt count only, never PII
      if (attempt < maxRetries) {
        await delay(retryDelayMs * attempt) // Exponential backoff
      }
    }
  }

  // Return structured error without exposing internal details
  return { 
    ok: false, 
    error: 'SEND_FAILED', 
    attempts: maxRetries,
    retriable: isRetriableError(lastError)
  }
}

/**
 * Determines if an SMTP error is retriable
 * @param {Error|null} err
 */
function isRetriableError(err) {
  if (!err) return false
  const code = err.code || ''
  // Network/timeout errors are retriable
  return ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ESOCKET'].includes(code)
}
