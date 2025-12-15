import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCartStore } from '@/features/cart/model/store'
import type { ProductId, Price } from '@/entities/product'

// Mock toast store
vi.mock('@/app/stores/toast.store', () => ({
  useToastStore: {
    getState: () => ({
      addToast: vi.fn(),
    }),
  },
}))

describe('useCartStore', () => {
  beforeEach(() => {
    // Clear store before each test
    useCartStore.getState().clear()
    localStorage.clear()
  })

  const testItem = {
    productId: 'prod-123' as ProductId,
    name: 'Test Product',
    brand: 'Test Brand',
    price: 19.99 as Price,
    image: '/test.jpg',
  }

  describe('Initial State', () => {
    it('should start with empty cart', () => {
      const store = useCartStore.getState()
      expect(store.getTotalItems()).toBe(0)
      expect(store.getItems()).toHaveLength(0)
    })

    it('should have default shipping method', () => {
      const store = useCartStore.getState()
      expect(store.shippingMethod).toBe('standard')
    })
  })

  describe('addItem', () => {
    it('should add item to cart', () => {
      const store = useCartStore.getState()
      
      store.addItem(testItem)

      expect(store.getTotalItems()).toBe(1)
      expect(store.getItems()).toHaveLength(1)
      
      const items = store.getItems()
      expect(items[0].name).toBe('Test Product')
      expect(items[0].quantity).toBe(1)
    })

    it('should add item with custom quantity', () => {
      const store = useCartStore.getState()
      
      store.addItem(testItem, 3)

      expect(store.getTotalItems()).toBe(3)
      const items = store.getItems()
      expect(items[0].quantity).toBe(3)
    })

    it('should increase quantity for duplicate items', () => {
      const store = useCartStore.getState()
      
      store.addItem(testItem)
      store.addItem(testItem)

      expect(store.getTotalItems()).toBe(2)
      expect(store.getItems()).toHaveLength(1) // Same item
      
      const items = store.getItems()
      expect(items[0].quantity).toBe(2)
    })

    it('should add as separate item with different options', () => {
      const store = useCartStore.getState()
      
      store.addItem({ ...testItem, options: { shade: 'light' } })
      store.addItem({ ...testItem, options: { shade: 'medium' } })

      expect(store.getItems()).toHaveLength(2) // Different items
      expect(store.getTotalItems()).toBe(2)
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const store = useCartStore.getState()
      
      store.addItem(testItem)
      const items = store.getItems()
      const itemId = items[0].id

      store.removeItem(itemId)

      expect(store.getTotalItems()).toBe(0)
      expect(store.getItems()).toHaveLength(0)
    })
  })

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const store = useCartStore.getState()
      
      store.addItem(testItem)
      const items = store.getItems()
      const itemId = items[0].id

      store.updateQuantity(itemId, 5)

      expect(store.getTotalItems()).toBe(5)
      const updatedItems = store.getItems()
      expect(updatedItems[0].quantity).toBe(5)
    })

    it('should enforce minimum quantity of 1', () => {
      const store = useCartStore.getState()
      
      store.addItem(testItem)
      const items = store.getItems()
      const itemId = items[0].id

      store.updateQuantity(itemId, 0)

      const updatedItems = store.getItems()
      expect(updatedItems[0].quantity).toBe(1)
    })
  })

  describe('updateOptions', () => {
    it('should update item options', () => {
      const store = useCartStore.getState()
      
      store.addItem({ ...testItem, options: { shade: 'light' } })
      const items = store.getItems()
      const itemId = items[0].id

      store.updateOptions(itemId, { shade: 'medium' })

      const updatedItems = store.getItems()
      expect(updatedItems[0].options?.shade).toBe('medium')
    })
  })

  describe('getSummary', () => {
    it('should calculate correct subtotal', () => {
      const store = useCartStore.getState()
      
      store.addItem(testItem, 2)

      const summary = store.getSummary()
      expect(summary.subtotal).toBeCloseTo(39.98)
      expect(summary.itemCount).toBe(2)
    })

    it('should calculate tax', () => {
      const store = useCartStore.getState()
      
      store.addItem({ ...testItem, price: 100 as Price })

      const summary = store.getSummary()
      expect(summary.tax).toBe(8.75) // 100 * 0.0875
    })

    it('should apply free shipping for orders >= $50', () => {
      const store = useCartStore.getState()
      
      store.addItem({ ...testItem, price: 100 as Price })

      const summary = store.getSummary()
      expect(summary.shipping).toBe(0)
    })

    it('should calculate savings when original price exists', () => {
      const store = useCartStore.getState()
      
      store.addItem({
        ...testItem,
        price: 15 as Price,
        originalPrice: 25 as Price,
      }, 2)

      const summary = store.getSummary()
      expect(summary.savings).toBe(20) // (25-15) * 2
    })

    it('should calculate correct total', () => {
      const store = useCartStore.getState()
      
      store.addItem({ ...testItem, price: 100 as Price })

      const summary = store.getSummary()
      // subtotal: 100
      // shipping: 0 (>= 50)
      // tax: 8.75
      // total: 108.75
      expect(summary.total).toBe(108.75)
    })
  })

  describe('setShippingMethod', () => {
    it('should update shipping method', () => {
      useCartStore.getState().setShippingMethod('express')

      const store = useCartStore.getState()
      expect(store.shippingMethod).toBe('express')
    })

    it('should affect shipping cost in summary', () => {
      const store = useCartStore.getState()
      
      store.addItem({ ...testItem, price: 10 as Price })
      store.setShippingMethod('express')

      const summary = store.getSummary()
      expect(summary.shipping).toBe(9.99)
    })
  })

  describe('hasItem', () => {
    it('should return true if item exists', () => {
      const store = useCartStore.getState()
      const productId = 'prod-1' as ProductId
      
      store.addItem({ ...testItem, productId })

      expect(store.hasItem(productId)).toBe(true)
    })

    it('should return false if item does not exist', () => {
      const store = useCartStore.getState()
      
      expect(store.hasItem('prod-999' as ProductId)).toBe(false)
    })

    it('should check with options', () => {
      const store = useCartStore.getState()
      const productId = 'prod-1' as ProductId
      
      store.addItem({
        ...testItem,
        productId,
        options: { shade: 'light' },
      })

      expect(store.hasItem(productId, { shade: 'light' })).toBe(true)
      expect(store.hasItem(productId, { shade: 'dark' })).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all items', () => {
      const store = useCartStore.getState()
      
      store.addItem({ ...testItem, productId: 'prod-1' as ProductId })
      store.addItem({ ...testItem, productId: 'prod-2' as ProductId })

      expect(store.getTotalItems()).toBe(2)

      store.clear()

      expect(store.getTotalItems()).toBe(0)
      expect(store.getItems()).toHaveLength(0)
    })
  })
})
