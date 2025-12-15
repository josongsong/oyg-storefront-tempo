/**
 * Quick Shop Store Tests
 * 
 * 검증 내용:
 * 1. 초기 상태 (닫힌 상태)
 * 2. openQuickShop으로 모달 열기
 * 3. closeQuickShop으로 모달 닫기
 * 4. 상품 정보가 올바르게 저장되는지
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useQuickShopStore } from '@/features/product/stores/quick-shop.store'
import type { QuickShopProduct } from '@/features/product/types'

describe('useQuickShopStore', () => {
  beforeEach(() => {
    // 각 테스트 전에 스토어 초기화
    const store = useQuickShopStore.getState()
    store.closeQuickShop()
  })

  const mockProduct: QuickShopProduct = {
    id: 'test-123',
    name: 'Test Product',
    brand: 'Test Brand',
    price: '$29.99',
    rating: 4.5,
    reviews: 100,
    images: ['/img1.jpg', '/img2.jpg'],
    shades: [
      { id: '1', name: 'Light', color: '#F5E6D3' },
      { id: '2', name: 'Medium', color: '#E6D5F5' },
    ],
    sizes: [
      { id: '1', name: 'Small', inStock: true },
      { id: '2', name: 'Large', inStock: false },
    ],
    description: 'Test description',
  }

  describe('초기 상태', () => {
    it('모달이 닫힌 상태로 시작한다', () => {
      const store = useQuickShopStore.getState()
      
      expect(store.isOpen).toBe(false)
    })

    it('상품 정보가 null이다', () => {
      const store = useQuickShopStore.getState()
      
      expect(store.product).toBeNull()
    })
  })

  describe('openQuickShop', () => {
    it('모달을 열고 상품 정보를 저장한다', () => {
      const store = useQuickShopStore.getState()
      
      store.openQuickShop(mockProduct)

      expect(store.isOpen).toBe(true)
      expect(store.product).toEqual(mockProduct)
    })

    it('상품 정보가 올바르게 저장된다', () => {
      const store = useQuickShopStore.getState()
      
      store.openQuickShop(mockProduct)

      const product = store.product
      expect(product?.id).toBe('test-123')
      expect(product?.name).toBe('Test Product')
      expect(product?.brand).toBe('Test Brand')
      expect(product?.price).toBe('$29.99')
      expect(product?.shades).toHaveLength(2)
      expect(product?.sizes).toHaveLength(2)
    })

    it('이전 상품을 덮어쓴다', () => {
      const store = useQuickShopStore.getState()
      
      const firstProduct = { ...mockProduct, id: 'first-123' }
      const secondProduct = { ...mockProduct, id: 'second-456' }

      store.openQuickShop(firstProduct)
      expect(store.product?.id).toBe('first-123')

      store.openQuickShop(secondProduct)
      expect(store.product?.id).toBe('second-456')
    })
  })

  describe('closeQuickShop', () => {
    it('모달을 닫는다', () => {
      const store = useQuickShopStore.getState()
      
      store.openQuickShop(mockProduct)
      expect(store.isOpen).toBe(true)

      store.closeQuickShop()
      expect(store.isOpen).toBe(false)
    })

    it('상품 정보를 유지한다 (다시 열 때를 위해)', () => {
      const store = useQuickShopStore.getState()
      
      store.openQuickShop(mockProduct)
      store.closeQuickShop()

      // 모달은 닫혔지만 상품 정보는 남아있음
      expect(store.isOpen).toBe(false)
      expect(store.product).toEqual(mockProduct)
    })
  })

  describe('엣지 케이스', () => {
    it('이미 열린 상태에서 다시 열어도 문제없다', () => {
      const store = useQuickShopStore.getState()
      
      store.openQuickShop(mockProduct)
      store.openQuickShop(mockProduct)

      expect(store.isOpen).toBe(true)
      expect(store.product).toEqual(mockProduct)
    })

    it('이미 닫힌 상태에서 다시 닫아도 문제없다', () => {
      const store = useQuickShopStore.getState()
      
      store.closeQuickShop()
      store.closeQuickShop()

      expect(store.isOpen).toBe(false)
    })

    it('상품 없이 열 수는 없다', () => {
      const store = useQuickShopStore.getState()
      
      // @ts-expect-error - 의도적으로 잘못된 호출
      store.openQuickShop(null)

      // TypeScript 에러가 발생해야 함
    })
  })
})

