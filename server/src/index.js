import { getEnv } from './env.js'
import { sendLeadEmail } from './sendLeadEmail.js'

import { createApp } from './app.js'

const env = getEnv()

const app = createApp({ env, sendLeadEmail })

app.listen(env.PORT, '0.0.0.0', () => {
  // No PII here
  console.info(`Lead API listening on :${env.PORT}`)
})
