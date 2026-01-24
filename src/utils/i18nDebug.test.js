import { describe, expect, it } from 'vitest'
import { getI18nDebugFlag } from './i18nDebug'

describe('getI18nDebugFlag', () => {
  it('returns a boolean', () => {
    expect(typeof getI18nDebugFlag()).toBe('boolean')
  })
})
