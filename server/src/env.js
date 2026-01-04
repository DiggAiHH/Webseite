import { z } from 'zod'

const emptyStringToUndefined = (value) => {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  return trimmed.length === 0 ? undefined : trimmed
}

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  SMTP_HOST: z.preprocess(emptyStringToUndefined, z.string().min(1).optional()),
  SMTP_PORT: z.preprocess(emptyStringToUndefined, z.coerce.number().int().positive().optional()),
  SMTP_SECURE: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .transform((v) => v === 'true')
      .optional()
  ),
  SMTP_USER: z.preprocess(emptyStringToUndefined, z.string().min(1).optional()),
  SMTP_PASS: z.preprocess(emptyStringToUndefined, z.string().min(1).optional()),
  MAIL_TO: z.preprocess(emptyStringToUndefined, z.string().email().optional()),
  MAIL_FROM: z.preprocess(emptyStringToUndefined, z.string().email().optional()),
  MAIL_SUBJECT_PREFIX: z.preprocess(emptyStringToUndefined, z.string().min(1).max(80).optional())
})

export function getEnv() {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error('Invalid environment configuration')
  }

  return parsed.data
}

export function isEmailConfigured(env) {
  return Boolean(
    env.SMTP_HOST &&
      env.SMTP_PORT &&
      typeof env.SMTP_SECURE === 'boolean' &&
      env.SMTP_USER &&
      env.SMTP_PASS &&
      env.MAIL_TO &&
      env.MAIL_FROM
  )
}
