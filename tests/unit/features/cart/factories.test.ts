/**
 * Cart Factory Tests
 * Factory 패턴이 올바르게 동작하는지 검증
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  createCartItem,
  createCartItems,
  createCart,
  createCartSummary,
  createWishlistItem,
  createWishlistItems,
  resetCartCounter,
} from '@/test/factories/cart.factory'

describe('Cart Factory', () => {
  beforeEach(() => {
    resetCartCounter()
  })

  describe('createCartItem', () => {
    it('기본 CartItem을 생성한다', () => {
      const item = createCartItem()

      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('productId')
      expect(item).toHaveProperty('quantity', 1)
      expect(item).toHaveProperty('price')
      expect(item).toHaveProperty('sku')
      expect(item.product).toHaveProperty('name')
      expect(item.product).toHaveProperty('brand')
    })

    it('커스텀 옵션으로 생성한다', () => {
      const item = createCartItem({
        name: 'Custom Product',
        brand: 'Custom Brand',
        price: 99,
        quantity: 5,
      })

      expect(item.product.name).toBe('Custom Product')
      expect(item.product.brand).toBe('Custom Brand')
      expect(item.price).toBe(99)
      expect(item.quantity).toBe(5)
    })

    it('SKU가 유니크하다', () => {
      const item1 = createCartItem()
      const item2 = createCartItem()

      expect(item1.sku).not.toBe(item2.sku)
      expect(item1.sku).toMatch(/^I-\d{6}$/)
    })

    it('매번 다른 브랜드를 생성할 수 있다', () => {
      const brands = new Set()
      
      for (let i = 0; i < 20; i++) {
        const item = createCartItem()
        brands.add(item.product.brand)
      }

      // 20개 생성 시 최소 2개 이상의 브랜드가 나와야 함
      expect(brands.size).toBeGreaterThan(1)
    })
  })

  describe('createCartItems', () => {
    it('여러 아이템을 생성한다', () => {
      const items = createCartItems(5)

      expect(items).toHaveLength(5)
      expect(items[0].id).not.toBe(items[1].id)
    })

    it('동일한 옵션으로 여러 아이템을 생성한다', () => {
      const items = createCartItems(3, { brand: 'GLOSSIER' })

      items.forEach((item) => {
        expect(item.product.brand).toBe('GLOSSIER')
      })
    })
  })

  describe('createCartSummary', () => {
    it('올바른 subtotal을 계산한다', () => {
      const items = [
        createCartItem({ price: 10, quantity: 2 }),
        createCartItem({ price: 20, quantity: 1 }),
      ]

      const summary = createCartSummary(items)

      expect(summary.subtotal).toBe(40) // 10*2 + 20*1
    })

    it('무료 배송 기준 이상이면 배송비가 0이다', () => {
      const items = [
        createCartItem({ price: 70, quantity: 1 }),
      ]

      const summary = createCartSummary(items)

      expect(summary.shipping).toBe(0)
      expect(summary.shippingDiscount).toBe(10)
      expect(summary.remainingForFreeShipping).toBe(0)
    })

    it('무료 배송 기준 미만이면 배송비가 부과된다', () => {
      const items = [
        createCartItem({ price: 30, quantity: 1 }),
      ]

      const summary = createCartSummary(items)

      expect(summary.shipping).toBe(10)
      expect(summary.shippingDiscount).toBe(0)
      expect(summary.remainingForFreeShipping).toBe(30) // 60 - 30
    })

    it('GST(세금)를 올바르게 계산한다', () => {
      const items = [
        createCartItem({ price: 100, quantity: 1 }),
      ]

      const summary = createCartSummary(items)

      expect(summary.gst).toBe(7.00) // 100 * 0.07
    })

    it('최종 합계를 올바르게 계산한다', () => {
      const items = [
        createCartItem({ price: 100, quantity: 1 }),
      ]

      const summary = createCartSummary(items)

      // subtotal: 100, shipping: 0 (>= 60), shippingDiscount: 10, gst: 7
      // total: 100 + 0 - 10 + 7 = 97
      expect(summary.total).toBeCloseTo(97, 1)
    })
  })

  describe('createCart', () => {
    it('전체 Cart 객체를 생성한다', () => {
      const cart = createCart(3)

      expect(cart.items).toHaveLength(3)
      expect(cart.savedItems).toHaveLength(0)
      expect(cart).toHaveProperty('subtotal')
      expect(cart).toHaveProperty('total')
      expect(cart).toHaveProperty('shippingCountry', 'Australia')
    })

    it('아이템 개수를 지정할 수 있다', () => {
      const cart = createCart(10)

      expect(cart.items).toHaveLength(10)
    })
  })

  describe('createWishlistItem', () => {
    it('Wishlist 아이템을 생성한다', () => {
      const item = createWishlistItem()

      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('brand')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('price')
      expect(item).toHaveProperty('rating')
      expect(item).toHaveProperty('reviews')
      expect(item).toHaveProperty('image')
    })

    it('평점이 3.0 ~ 5.0 범위다', () => {
      for (let i = 0; i < 20; i++) {
        const item = createWishlistItem()
        expect(item.rating).toBeGreaterThanOrEqual(3.0)
        expect(item.rating).toBeLessThanOrEqual(5.0)
      }
    })
  })

  describe('createWishlistItems', () => {
    it('여러 Wishlist 아이템을 생성한다', () => {
      const items = createWishlistItems(5)

      expect(items).toHaveLength(5)
      items.forEach((item) => {
        expect(item.id).toMatch(/^w-\d+$/)
      })
    })
  })
})

