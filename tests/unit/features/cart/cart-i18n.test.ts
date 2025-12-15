/**
 * Cart i18n 테스트
 */

import { describe, it, expect } from 'vitest'
import { cartMessages } from '@/features/cart/i18n'

describe('Cart i18n', () => {
  describe('cartMessages', () => {
    it('모든 메시지가 정의되어야 함', () => {
      expect(cartMessages.emptyTitle).toBeDefined()
      expect(cartMessages.emptyDescription).toBeDefined()
      expect(cartMessages.itemCount).toBeDefined()
      expect(cartMessages.addSuccess).toBeDefined()
      expect(cartMessages.removeSuccess).toBeDefined()
      expect(cartMessages.continueShopping).toBeDefined()
    })
    
    it('emptyTitle이 문자열을 반환해야 함', () => {
      const message = cartMessages.emptyTitle()
      expect(typeof message).toBe('string')
      expect(message.length).toBeGreaterThan(0)
    })
    
    it('itemCount가 count에 따라 다른 메시지를 반환해야 함', () => {
      const msg0 = cartMessages.itemCount({ count: 0 })
      const msg1 = cartMessages.itemCount({ count: 1 })
      const msg5 = cartMessages.itemCount({ count: 5 })
      
      expect(msg0).toBeTruthy()
      expect(msg1).toBeTruthy()
      expect(msg5).toBeTruthy()
      
      // 각각 다른 메시지여야 함 (plural)
      expect(msg0).not.toBe(msg1)
      expect(msg1).not.toBe(msg5)
    })
    
    it('addSuccess가 productName을 포함해야 함', () => {
      const message = cartMessages.addSuccess({ productName: 'iPhone' })
      expect(message).toContain('iPhone')
    })
  })
  
  describe('타입 안전성', () => {
    it('파라미터 없이 호출 가능한 메시지', () => {
      expect(() => cartMessages.emptyTitle()).not.toThrow()
      expect(() => cartMessages.emptyDescription()).not.toThrow()
      expect(() => cartMessages.removeSuccess()).not.toThrow()
    })
    
    // 파라미터 필수인 메시지는 TypeScript가 컴파일 타임에 검증
    // 런타임에서는 any로 우회 가능하므로 테스트 생략
  })
})

