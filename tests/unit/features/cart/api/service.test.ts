/**
 * Cart API Service Tests
 * MSW를 사용한 장바구니 API 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { cartApi } from '@/features/cart/api/service'
import { server } from '@/test/mocks/server'
import { resetMockCart } from '@/test/mocks/handlers'
import { http, HttpResponse } from 'msw'

describe('cartApi', () => {
  beforeEach(() => {
    resetMockCart()
  })

  describe('getCart', () => {
    it('should fetch cart', async () => {
      const cart = await cartApi.getCart()
      
      expect(cart).toBeDefined()
      expect(cart).toHaveProperty('items')
      expect(Array.isArray(cart.items)).toBe(true)
    })

    it('should return empty cart initially', async () => {
      const cart = await cartApi.getCart()
      
      expect(cart.items).toHaveLength(0)
    })

    it('should handle API error', async () => {
      server.use(
        http.get('*/cart', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(cartApi.getCart()).rejects.toThrow()
    })
  })

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const itemData = {
        productId: 'prod-1',
        name: 'Test Product',
        price: 19.99,
        quantity: 1,
        image: '/test.jpg',
      }

      const result = await cartApi.addItem(itemData)
      
      expect(result).toBeDefined()
      expect(result).toMatchObject(itemData)
    })

    it('should add multiple items', async () => {
      const item1 = {
        productId: 'prod-1',
        name: 'Product 1',
        price: 10,
        quantity: 1,
        image: '/test1.jpg',
      }

      const item2 = {
        productId: 'prod-2',
        name: 'Product 2',
        price: 20,
        quantity: 2,
        image: '/test2.jpg',
      }

      await cartApi.addItem(item1)
      await cartApi.addItem(item2)

      const cart = await cartApi.getCart()
      expect(cart.items).toHaveLength(2)
    })

    it('should handle validation error', async () => {
      server.use(
        http.post('*/cart/items', () => {
          return HttpResponse.json(
            { error: 'Invalid item data' },
            { status: 400 }
          )
        })
      )

      const invalidData = {
        productId: '',
        name: '',
        price: -1,
        quantity: 0,
        image: '',
      }

      await expect(cartApi.addItem(invalidData)).rejects.toThrow()
    })
  })

  describe('updateItem', () => {
    it('should update cart item', async () => {
      // 먼저 아이템 추가
      const item = {
        productId: 'prod-1',
        name: 'Test Product',
        price: 19.99,
        quantity: 1,
        image: '/test.jpg',
      }
      const added = await cartApi.addItem(item)

      // 수량 업데이트
      const updated = await cartApi.updateItem(added.id || 'mock-id', { 
        quantity: 3 
      })

      expect(updated).toBeDefined()
      expect(updated.quantity).toBe(3)
    })

    it('should handle not found error', async () => {
      server.use(
        http.patch('*/cart/items/:id', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      await expect(
        cartApi.updateItem('non-existent', { quantity: 2 })
      ).rejects.toThrow()
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      // 아이템 추가
      const item = {
        productId: 'prod-1',
        name: 'Test Product',
        price: 19.99,
        quantity: 1,
        image: '/test.jpg',
      }
      const added = await cartApi.addItem(item)

      // 제거
      await cartApi.removeItem(added.id || 'mock-id')

      const cart = await cartApi.getCart()
      expect(cart.items).toHaveLength(0)
    })

    it('should handle not found gracefully', async () => {
      server.use(
        http.delete('*/cart/items/:id', () => {
          return HttpResponse.json({ success: false })
        })
      )

      await expect(
        cartApi.removeItem('non-existent')
      ).resolves.not.toThrow()
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      // 여러 아이템 추가
      await cartApi.addItem({
        productId: 'prod-1',
        name: 'Product 1',
        price: 10,
        quantity: 1,
        image: '/test1.jpg',
      })
      await cartApi.addItem({
        productId: 'prod-2',
        name: 'Product 2',
        price: 20,
        quantity: 1,
        image: '/test2.jpg',
      })

      // 클리어
      await cartApi.clearCart()

      const cart = await cartApi.getCart()
      expect(cart.items).toHaveLength(0)
    })
  })

  describe('Cart flow integration', () => {
    it('should handle complete cart flow', async () => {
      // 1. 빈 카트 확인
      let cart = await cartApi.getCart()
      expect(cart.items).toHaveLength(0)

      // 2. 아이템 추가
      const item = await cartApi.addItem({
        productId: 'prod-1',
        name: 'Test Product',
        price: 19.99,
        quantity: 1,
        image: '/test.jpg',
      })

      cart = await cartApi.getCart()
      expect(cart.items).toHaveLength(1)

      // 3. 수량 업데이트
      await cartApi.updateItem(item.id || 'mock-id', { quantity: 3 })

      // 4. 제거
      await cartApi.removeItem(item.id || 'mock-id')

      cart = await cartApi.getCart()
      expect(cart.items).toHaveLength(0)
    })
  })
})


