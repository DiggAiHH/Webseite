import nodemailer from 'nodemailer'
import { isEmailConfigured } from './env.js'

/**
 * Sends a lead email. Never log PII.
 * 
 * @param {import('./env.js').getEnv extends (...args:any)=>infer R ? R : any} env
 * @param {{requestId: string, email: string, organisation: string, phone: string, message: string, productId: string}} lead
 */
export async function sendLeadEmail(env, lead) {
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
