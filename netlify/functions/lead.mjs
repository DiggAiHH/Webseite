import crypto from 'node:crypto'
import { z } from 'zod'
import nodemailer from 'nodemailer'

// ---------- ENV SCHEMA ----------
const emptyStringToUndefined = (value) => {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  return trimmed.length === 0 ? undefined : trimmed
}

const envSchema = z.object({
  SMTP_HOST: z.preprocess(emptyStringToUndefined, z.string().min(1).optional()),
  SMTP_PORT: z.preprocess(emptyStringToUndefined, z.coerce.number().int().positive().optional()),
  SMTP_SECURE: z.preprocess(
    emptyStringToUndefined,
    z.string().transform((v) => v === 'true').optional()
  ),
  SMTP_USER: z.preprocess(emptyStringToUndefined, z.string().min(1).optional()),
  SMTP_PASS: z.preprocess(emptyStringToUndefined, z.string().min(1).optional()),
  MAIL_TO: z.preprocess(emptyStringToUndefined, z.string().email().optional()),
  MAIL_FROM: z.preprocess(emptyStringToUndefined, z.string().email().optional()),
  MAIL_SUBJECT_PREFIX: z.preprocess(emptyStringToUndefined, z.string().min(1).max(80).optional())
})

function getEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    return null
  }
  return parsed.data
}

function isEmailConfigured(env) {
  return Boolean(
    env?.SMTP_HOST &&
    env?.SMTP_PORT &&
    typeof env?.SMTP_SECURE === 'boolean' &&
    env?.SMTP_USER &&
    env?.SMTP_PASS &&
    env?.MAIL_TO &&
    env?.MAIL_FROM
  )
}

// ---------- LEAD SCHEMA ----------
const MAX_MESSAGE_LENGTH = 2000

const leadSchema = z
  .object({
    email: z.string().trim().email().max(254),
    organisation: z.string().trim().min(2).max(200),
    phone: z.string().trim().max(50).optional().or(z.literal('')),
    message: z.string().trim().max(MAX_MESSAGE_LENGTH).optional().or(z.literal('')),
    productId: z.string().trim().max(80).optional().or(z.literal('')),
    consent: z.literal(true),
    hp: z.string().max(200).optional()
  })
  .strict()

function parseLeadPayload(payload) {
  const parsed = leadSchema.safeParse(payload)

  if (!parsed.success) {
    return {
      ok: false,
      error: 'INVALID',
      details: parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    }
  }

  const honeypot = (parsed.data.hp ?? '').trim()
  if (honeypot.length > 0) {
    return { ok: false, error: 'SPAM' }
  }

  return {
    ok: true,
    data: {
      email: parsed.data.email,
      organisation: parsed.data.organisation,
      phone: (parsed.data.phone ?? '').trim(),
      message: (parsed.data.message ?? '').trim(),
      productId: (parsed.data.productId ?? '').trim()
    }
  }
}

// ---------- SEND EMAIL ----------
async function sendLeadEmail(env, lead) {
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
    }
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

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.MAIL_TO,
    subject,
    text
  })

  return { ok: true }
}

// ---------- NETLIFY FUNCTION HANDLER ----------
export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff'
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' })
    }
  }

  const requestId = crypto.randomUUID()

  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'INVALID_JSON', requestId })
    }
  }

  const parsed = parseLeadPayload(body)
  if (!parsed.ok) {
    if (parsed.error === 'SPAM') {
      return { statusCode: 204, headers, body: '' }
    }
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ ok: false, error: 'INVALID_REQUEST', requestId })
    }
  }

  const env = getEnv()

  try {
    const result = await sendLeadEmail(env, { requestId, ...parsed.data })

    if (!result.ok && result.error === 'NOT_CONFIGURED') {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ ok: false, error: 'SERVICE_NOT_CONFIGURED', requestId })
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, requestId })
    }
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: 'INTERNAL_ERROR', requestId })
    }
  }
}
