import { describe, expect, it, vi } from 'vitest'
import {
  rateLimit,
  validateEmail,
  validateNumericInput,
  validatePhone,
  validateTextInput,
  validateURL
} from './security'

describe('security utils', () => {
  describe('validateEmail', () => {
    it('accepts valid emails and trims', () => {
      expect(validateEmail('arzt@example.com')).toBe(true)
      expect(validateEmail('  arzt@example.com  ')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail(null)).toBe(false)
      expect(validateEmail('not-an-email')).toBe(false)
      expect(validateEmail('a@b')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('accepts common phone formats', () => {
      expect(validatePhone('040 1234567')).toBe(true)
      expect(validatePhone('+49 40 1234567')).toBe(true)
      expect(validatePhone('040-1234567')).toBe(true)
    })

    it('rejects empty/non-string', () => {
      expect(validatePhone('')).toBe(false)
      expect(validatePhone(undefined)).toBe(false)
    })
  })

  describe('validateTextInput', () => {
    it('rejects missing/empty input', () => {
      expect(validateTextInput('')).toMatchObject({ isValid: false })
      expect(validateTextInput('   ')).toMatchObject({ isValid: false })
      expect(validateTextInput(null)).toMatchObject({ isValid: false })
    })

    it('trims and sanitizes script tags and angle brackets', () => {
      const res = validateTextInput('  <script>alert(1)</script><b>ok</b>  ')
      expect(res.isValid).toBe(true)
      expect(res.sanitized).not.toMatch(/script/i)
      expect(res.sanitized).not.toContain('<')
      expect(res.sanitized).not.toContain('>')
    })

    it('enforces max length and truncates', () => {
      const res = validateTextInput('a'.repeat(10), 5)
      expect(res.isValid).toBe(false)
      expect(res.sanitized.length).toBe(5)
    })
  })

  describe('validateNumericInput', () => {
    it('accepts numbers within range', () => {
      expect(validateNumericInput('10', 0, 20)).toEqual({ isValid: true, value: 10, error: null })
    })

    it('rejects NaN', () => {
      expect(validateNumericInput('x')).toMatchObject({ isValid: false, error: expect.stringMatching(/number/i) })
    })

    it('rejects below min / above max', () => {
      expect(validateNumericInput(1, 2, 10)).toMatchObject({ isValid: false })
      expect(validateNumericInput(11, 2, 10)).toMatchObject({ isValid: false })
    })
  })

  describe('validateURL', () => {
    it('accepts https github urls incl subdomains', () => {
      expect(validateURL('https://github.com/org/repo')).toMatchObject({ isValid: true })
      expect(validateURL('https://raw.github.com/org/repo')).toMatchObject({ isValid: true })
    })

    it('rejects non-https', () => {
      expect(validateURL('http://github.com/org/repo')).toMatchObject({ isValid: false })
    })

    it('rejects non-allowed domains', () => {
      expect(validateURL('https://example.com/x')).toMatchObject({ isValid: false })
    })

    it('rejects malformed', () => {
      expect(validateURL('not a url')).toMatchObject({ isValid: false })
    })
  })

  describe('rateLimit', () => {
    it('executes immediately then delays subsequent calls', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const wrapped = rateLimit(fn, 1000)

      wrapped('a')
      wrapped('b')
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenLastCalledWith('a')

      vi.advanceTimersByTime(999)
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(1)
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith('b')

      vi.useRealTimers()
    })
  })
})
