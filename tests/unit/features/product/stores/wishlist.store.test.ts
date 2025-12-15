import { describe, it, expect, beforeEach } from 'vitest'
import { useWishlistStore, type WishlistItem } from '@/features/product/stores/wishlist.store'

describe('useWishlistStore', () => {
  beforeEach(() => {
    // Clear items only, don't replace the whole state
    useWishlistStore.setState({
      items: [],
      isOpen: false,
      showEmptyTooltip: false,
    })
    localStorage.clear()
  })

  const mockItem: WishlistItem = {
    id: 'prod-1',
    name: 'Test Product',
    brand: 'Test Brand',
    price: '$19.99',
    image: '/test.jpg',
    rating: 4.5,
    reviews: 100,
  }

  describe('addItem', () => {
    it('should add item to wishlist', () => {
      useWishlistStore.getState().addItem(mockItem)

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0]).toEqual(mockItem)
    })

    it('should not add duplicate items', () => {
      useWishlistStore.getState().addItem(mockItem)
      useWishlistStore.getState().addItem(mockItem)

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(1)
    })

    it('should add multiple different items', () => {
      const item2 = { ...mockItem, id: 'prod-2', name: 'Product 2' }
      
      useWishlistStore.getState().addItem(mockItem)
      useWishlistStore.getState().addItem(item2)

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(2)
    })
  })

  describe('removeItem', () => {
    it('should remove item from wishlist', () => {
      useWishlistStore.getState().addItem(mockItem)
      useWishlistStore.getState().removeItem('prod-1')

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(0)
    })

    it('should only remove specified item', () => {
      const item2 = { ...mockItem, id: 'prod-2' }
      
      useWishlistStore.getState().addItem(mockItem)
      useWishlistStore.getState().addItem(item2)
      useWishlistStore.getState().removeItem('prod-1')

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(1)
      expect(items[0].id).toBe('prod-2')
    })
  })

  describe('isInWishlist', () => {
    it('should return true for items in wishlist', () => {
      useWishlistStore.getState().addItem(mockItem)

      expect(useWishlistStore.getState().isInWishlist('prod-1')).toBe(true)
    })

    it('should return false for items not in wishlist', () => {
      expect(useWishlistStore.getState().isInWishlist('prod-999')).toBe(false)
    })
  })

  describe('toggleItem', () => {
    it('should add item if not in wishlist', () => {
      useWishlistStore.getState().toggleItem(mockItem)

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(1)
    })

    it('should remove item if in wishlist', () => {
      useWishlistStore.getState().addItem(mockItem)
      useWishlistStore.getState().toggleItem(mockItem)

      const items = useWishlistStore.getState().items
      expect(items).toHaveLength(0)
    })
  })

  describe('Wishlist UI', () => {
    it('should open wishlist', () => {
      useWishlistStore.getState().openWishlist()
      expect(useWishlistStore.getState().isOpen).toBe(true)
    })

    it('should close wishlist', () => {
      useWishlistStore.getState().isOpen = true
      useWishlistStore.getState().closeWishlist()
      expect(useWishlistStore.getState().isOpen).toBe(false)
    })

    it('should toggle wishlist when items exist', () => {
      useWishlistStore.getState().addItem(mockItem)
      useWishlistStore.getState().toggleWishlist()
      expect(useWishlistStore.getState().isOpen).toBe(true)
      expect(useWishlistStore.getState().showEmptyTooltip).toBe(false)

      useWishlistStore.getState().toggleWishlist()
      expect(useWishlistStore.getState().isOpen).toBe(false)
    })

    it('should toggle wishlist', () => {
      useWishlistStore.getState().toggleWishlist()
      // toggleWishlist just toggles isOpen, doesn't handle empty tooltip
      expect(useWishlistStore.getState().isOpen).toBe(true)
    })
  })

  describe('Empty Tooltip', () => {
    it('should open empty tooltip', () => {
      useWishlistStore.getState().openEmptyTooltip()
      expect(useWishlistStore.getState().showEmptyTooltip).toBe(true)
    })

    it('should close empty tooltip', () => {
      useWishlistStore.getState().showEmptyTooltip = true
      useWishlistStore.getState().closeEmptyTooltip()
      expect(useWishlistStore.getState().showEmptyTooltip).toBe(false)
    })
  })

  describe('getTotalItems', () => {
    it('should return 0 for empty wishlist', () => {
      expect(useWishlistStore.getState().getTotalItems()).toBe(0)
    })

    it('should return correct count', () => {
      useWishlistStore.getState().addItem(mockItem)
      useWishlistStore.getState().addItem({ ...mockItem, id: 'prod-2' })

      expect(useWishlistStore.getState().getTotalItems()).toBe(2)
    })
  })
})
