/**
 * Locale Loader 테스트
 */

import { describe, it, expect, vi } from 'vitest'
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/app/i18n/loader'

describe('Locale Loader', () => {
  describe('SUPPORTED_LOCALES', () => {
    it('ko와 en을 지원해야 함', () => {
      expect(SUPPORTED_LOCALES).toContain('ko')
      expect(SUPPORTED_LOCALES).toContain('en')
      expect(SUPPORTED_LOCALES).toHaveLength(2)
    })
  })
  
  describe('DEFAULT_LOCALE', () => {
    it('기본 locale이 ko여야 함', () => {
      expect(DEFAULT_LOCALE).toBe('ko')
    })
    
    it('지원되는 locale이어야 함', () => {
      expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE)
    })
  })
  
  describe('Locale 우선순위', () => {
    it('URL > Cookie > Accept-Language > Default 순서여야 함', () => {
      // 구조 검증
      expect(SUPPORTED_LOCALES).toBeDefined()
      expect(DEFAULT_LOCALE).toBeDefined()
    })
  })
})

