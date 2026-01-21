import crypto from 'crypto'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { parseLeadPayload } from './leadSchema.js'
import { sendLeadEmail as defaultSendLeadEmail } from './sendLeadEmail.js'

/**
 * Create an Express app instance.
 * 
 * @param {{
 *  env: any,
 *  sendLeadEmail?: typeof defaultSendLeadEmail
 * }} options
 */
export function createApp({ env, sendLeadEmail = defaultSendLeadEmail }) {
  const app = express()
  app.disable('x-powered-by')

  // Behind nginx reverse proxy
  app.set('trust proxy', 1)

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-origin' }
    })
  )

  app.use(express.json({ limit: '20kb' }))

  // Rate limiting with externalized config
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      limit: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: { ok: false, error: 'RATE_LIMITED' }
    })
  )

  app.get('/health', (_req, res) => {
    res.status(200).type('text/plain').send('ok')
  })

  app.post('/lead', async (req, res) => {
    const requestId = crypto.randomUUID()

    const parsed = parseLeadPayload(req.body)
    if (!parsed.ok) {
      if (parsed.error === 'SPAM') {
        return res.status(204).end()
      }

      return res.status(400).json({
        ok: false,
        error: 'INVALID_REQUEST',
        requestId
      })
    }

    try {
      const result = await sendLeadEmail(env, {
        requestId,
        ...parsed.data
      })

      if (!result.ok && result.error === 'NOT_CONFIGURED') {
        return res.status(503).json({ ok: false, error: 'SERVICE_NOT_CONFIGURED', requestId })
      }

      return res.status(200).json({ ok: true, requestId })
    } catch (_err) {
      // Do not log PII or raw errors that may contain sensitive info.
      return res.status(500).json({ ok: false, error: 'INTERNAL_ERROR', requestId })
    }
  })

  return app
}
