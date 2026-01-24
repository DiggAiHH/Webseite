import crypto from 'crypto'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { GoogleGenerativeAI } from '@google/generative-ai'
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

  app.post('/api/chat', async (req, res) => {
    // Basic validation
    if (!req.body || typeof req.body.message !== 'string') {
      return res.status(400).json({ error: 'INVALID_REQUEST' })
    }

    if (!env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI_NOT_CONFIGURED' })
    }

    try {
      const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

      const { avatarId, message, context } = req.body
      let systemInstruction = "Du bist ein hilfreicher KI-Assistent für DiggAiHH."

      // Persona Selection
      if (avatarId === 'medical-assistant') {
          systemInstruction = "Du bist Dr. Med. Assistent. Antworte in medizinischem Kontext, aber weise immer darauf hin, dass du keine Diagnosen stellst. Nutze Markdown für Listen und wichtige Punkte."
      } else if (avatarId === 'inventory-expert') {
          systemInstruction = "Du bist der Lager-Experte. Dein Fokus liegt auf Logistik, Bestandsoptimierung und Effizienz. Nutze Markdown Tabellen für Daten."
      } else if (avatarId === 'data-analyst') {
          systemInstruction = "Du bist der Daten-Analyst. Antworte mit Fokus auf Zahlen, ROI und geschäftliche Analysen. Formatiere deine Antworten strukturiert mit Markdown."
      }

      // Context Injection
      let userMessage = message;
      if (context) {
        userMessage += `\n\n[System Context Info]:\nURL: ${context.url || 'Unbekannt'}\nPage Title: ${context.title || 'Unbekannt'}\nTime: ${context.timestamp || new Date().toISOString()}`
      }

      const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemInstruction }],
            },
            {
                role: "model",
                parts: [{ text: "Verstanden. Ich nehme diese Rolle an und nutze Markdown zur Formatierung." }],
            }
        ],
      })

      const result = await chat.sendMessageStream(userMessage)
      
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      res.setHeader('Transfer-Encoding', 'chunked')

      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        res.write(chunkText)
      }
      res.end()

    } catch (err) {
      // safe logging
      console.error("AI Error (sanitized):", err.message)
      res.status(500).json({ error: 'AI_ERROR' })
    }
  })

  return app
}
