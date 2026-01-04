import { z } from 'zod'

const MAX_MESSAGE_LENGTH = 2000

export const leadSchema = z
  .object({
    email: z.string().trim().email().max(254),
    organisation: z.string().trim().min(2).max(200),
    phone: z.string().trim().max(50).optional().or(z.literal('')),
    message: z.string().trim().max(MAX_MESSAGE_LENGTH).optional().or(z.literal('')),
    productId: z.string().trim().max(80).optional().or(z.literal('')),
    consent: z.literal(true),
    hp: z.string().max(200).optional() // honeypot, must remain empty
  })
  .strict()

/**
 * Parses and validates a lead payload.
 * 
 * @returns {{ok: true, data: {email: string, organisation: string, phone: string, message: string, productId: string}} | {ok: false, error: 'INVALID'|'SPAM', details?: Array<{path: string, message: string}>}}
 */
export function parseLeadPayload(payload) {
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
