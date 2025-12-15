/**
 * Semantic Codes 테스트
 */

import { describe, it, expect } from 'vitest'
import {
  CartSemanticCode,
  ProductSemanticCode,
  CheckoutSemanticCode,
  CommonSemanticCode,
  isCartCode,
  isProductCode,
  isCheckoutCode,
  isCommonCode,
} from '@/shared/i18n/semantic-codes'

describe('Semantic Codes', () => {
  describe('CartSemanticCode', () => {
    it('올바른 형식이어야 함', () => {
      expect(CartSemanticCode.EMPTY_STATE__NO_ITEMS).toBe('CART__EMPTY_STATE__NO_ITEMS')
      expect(CartSemanticCode.ACTION__ADD_SUCCESS).toBe('CART__ACTION__ADD_SUCCESS')
    })
    
    it('모든 값이 CART__로 시작해야 함', () => {
      Object.values(CartSemanticCode).forEach(code => {
        expect(code).toMatch(/^CART__/)
      })
    })
  })
  
  describe('ProductSemanticCode', () => {
    it('올바른 형식이어야 함', () => {
      expect(ProductSemanticCode.EMPTY_STATE__NO_RESULTS).toBe('PRODUCT__EMPTY_STATE__NO_RESULTS')
    })
    
    it('모든 값이 PRODUCT__로 시작해야 함', () => {
      Object.values(ProductSemanticCode).forEach(code => {
        expect(code).toMatch(/^PRODUCT__/)
      })
    })
  })
  
  describe('Type Guards', () => {
    it('isCartCode가 Cart 코드를 식별해야 함', () => {
      expect(isCartCode(CartSemanticCode.EMPTY_STATE__NO_ITEMS)).toBe(true)
      expect(isCartCode(ProductSemanticCode.EMPTY_STATE__NO_RESULTS as any)).toBe(false)
    })
    
    it('isProductCode가 Product 코드를 식별해야 함', () => {
      expect(isProductCode(ProductSemanticCode.EMPTY_STATE__NO_RESULTS)).toBe(true)
      expect(isProductCode(CartSemanticCode.EMPTY_STATE__NO_ITEMS as any)).toBe(false)
    })
    
    it('isCheckoutCode가 Checkout 코드를 식별해야 함', () => {
      expect(isCheckoutCode(CheckoutSemanticCode.PAYMENT__SUCCESS)).toBe(true)
      expect(isCheckoutCode(CartSemanticCode.EMPTY_STATE__NO_ITEMS as any)).toBe(false)
    })
    
    it('isCommonCode가 Common 코드를 식별해야 함', () => {
      expect(isCommonCode(CommonSemanticCode.ERROR__UNKNOWN)).toBe(true)
      expect(isCommonCode(CartSemanticCode.EMPTY_STATE__NO_ITEMS as any)).toBe(false)
    })
  })
  
  describe('Enum 완전성', () => {
    it('Cart 코드가 6개 이상이어야 함', () => {
      const count = Object.keys(CartSemanticCode).length
      expect(count).toBeGreaterThanOrEqual(6)
    })
    
    it('Product 코드가 5개 이상이어야 함', () => {
      const count = Object.keys(ProductSemanticCode).length
      expect(count).toBeGreaterThanOrEqual(5)
    })
    
    it('Common 코드가 5개 이상이어야 함', () => {
      const count = Object.keys(CommonSemanticCode).length
      expect(count).toBeGreaterThanOrEqual(5)
    })
  })
})

