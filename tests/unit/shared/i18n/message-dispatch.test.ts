/**
 * Message Dispatch 테스트
 */

import { describe, it, expect } from 'vitest'
import { dispatchSemanticMessage } from '@/shared/i18n/message-dispatch'
import {
  CartSemanticCode,
  ProductSemanticCode,
  CheckoutSemanticCode,
  CommonSemanticCode,
} from '@/shared/i18n/semantic-codes'

describe('dispatchSemanticMessage', () => {
  describe('Cart 메시지', () => {
    it('빈 카트 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        CartSemanticCode.EMPTY_STATE__NO_ITEMS
      )
      
      expect(message).toBeTruthy()
      expect(typeof message).toBe('string')
    })
    
    it('상품 추가 성공 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        CartSemanticCode.ACTION__ADD_SUCCESS,
        { productName: 'iPhone' }
      )
      
      expect(message).toContain('iPhone')
    })
    
    it('재고 부족 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        CartSemanticCode.ERROR__OUT_OF_STOCK,
        { productName: 'Galaxy' }
      )
      
      expect(message).toContain('Galaxy')
    })
  })
  
  describe('Product 메시지', () => {
    it('검색 결과 없음 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        ProductSemanticCode.EMPTY_STATE__NO_RESULTS
      )
      
      expect(message).toBeTruthy()
    })
    
    it('필터 매칭 없음 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        ProductSemanticCode.FILTER__NO_MATCHES
      )
      
      expect(message).toBeTruthy()
    })
  })
  
  describe('Checkout 메시지', () => {
    it('주소 유효성 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        CheckoutSemanticCode.VALIDATION__ADDRESS_INVALID
      )
      
      expect(message).toBeTruthy()
    })
    
    it('결제 실패 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        CheckoutSemanticCode.PAYMENT__FAILED
      )
      
      expect(message).toBeTruthy()
    })
  })
  
  describe('Common 메시지', () => {
    it('알 수 없는 에러 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        CommonSemanticCode.ERROR__UNKNOWN
      )
      
      expect(message).toBeTruthy()
    })
    
    it('네트워크 에러 메시지를 반환해야 함', () => {
      const message = dispatchSemanticMessage(
        CommonSemanticCode.ERROR__NETWORK
      )
      
      expect(message).toBeTruthy()
    })
  })
  
  describe('타입 안전성', () => {
    it('모든 Cart 의미 코드가 매핑되어야 함', () => {
      const codes = Object.values(CartSemanticCode)
      
      codes.forEach(code => {
        expect(() => {
          dispatchSemanticMessage(code as any)
        }).not.toThrow()
      })
    })
    
    it('파라미터가 없어도 동작해야 함', () => {
      expect(() => {
        dispatchSemanticMessage(
          CartSemanticCode.EMPTY_STATE__NO_ITEMS
        )
      }).not.toThrow()
    })
  })
})

