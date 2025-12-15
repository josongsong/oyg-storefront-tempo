/**
 * i18n 메시지 통합 테스트
 */

import { describe, it, expect } from 'vitest'
// @ts-ignore
import * as m from '@/app/i18n/paraglide/messages.js'

describe('i18n 메시지 통합', () => {
  describe('메시지 존재 확인', () => {
    it('모든 Cart 메시지가 존재해야 함', () => {
      expect(m.cart_empty_title).toBeDefined()
      expect(m.cart_empty_description).toBeDefined()
      expect(m.cart_item_count).toBeDefined()
      expect(m.cart_add_success).toBeDefined()
    })
    
    it('모든 Product 메시지가 존재해야 함', () => {
      expect(m.product_no_results).toBeDefined()
      expect(m.product_filter_no_matches).toBeDefined()
    })
    
    it('모든 Common 메시지가 존재해야 함', () => {
      expect(m.common_unknown_error).toBeDefined()
      expect(m.common_retry).toBeDefined()
    })
  })
  
  describe('메시지 호출', () => {
    it('단순 메시지를 반환해야 함', () => {
      expect(m.cart_empty_title()).toBeTruthy()
      expect(m.product_no_results()).toBeTruthy()
      expect(m.common_unknown_error()).toBeTruthy()
    })
    
    it('파라미터 메시지를 반환해야 함', () => {
      const msg = m.cart_add_success({ productName: 'Test' })
      expect(msg).toContain('Test')
    })
    
    it('Plural 메시지를 반환해야 함', () => {
      const msg0 = m.cart_item_count({ count: 0 })
      const msg1 = m.cart_item_count({ count: 1 })
      const msg5 = m.cart_item_count({ count: 5 })
      
      expect(msg0).toBeTruthy()
      expect(msg1).toBeTruthy()
      expect(msg5).toBeTruthy()
    })
  })
})
