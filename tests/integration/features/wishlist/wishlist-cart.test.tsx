import { describe, it, expect, beforeEach } from 'vitest'
import { useWishlistStore } from '@/features/product/stores/wishlist.store'
import { useCartStore } from '@/features/cart/model/store'

describe('Wishlist + Cart Integration', () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] })
    useCartStore.setState({ items: [], savedItems: [] })
  })

  describe('위시리스트에서 장바구니로', () => {
    it('위시리스트 상품을 장바구니에 추가할 수 있어야 함', () => {
      const { addItem: addToWishlist } = useWishlistStore.getState()
      const { addItem: addToCart } = useCartStore.getState()

      // 위시리스트에 추가
      addToWishlist({
        id: 'p1',
        name: 'Test Product',
        brand: 'Test Brand',
        price: 29.99,
        image: '/test.jpg',
        rating: 4.5,
        reviews: 100,
      })

      const wishlistItem = useWishlistStore.getState().items[0]
      expect(wishlistItem).toBeDefined()

      // 장바구니에 추가
      addToCart({
        id: '1',
        productId: wishlistItem.id,
        name: wishlistItem.name,
        price: wishlistItem.price,
        quantity: 1,
        image: wishlistItem.image,
      })

      const cartItem = useCartStore.getState().items[0]
      expect(cartItem.productId).toBe('p1')
    })

    it('위시리스트 전체를 장바구니에 추가할 수 있어야 함', () => {
      const { addItem: addToWishlist } = useWishlistStore.getState()
      const { addItem: addToCart } = useCartStore.getState()

      // 여러 상품 위시리스트에 추가
      for (let i = 1; i <= 3; i++) {
        addToWishlist({
          id: `p${i}`,
          name: `Product ${i}`,
          brand: 'Brand',
          price: i * 10,
          image: `/test${i}.jpg`,
          rating: 4,
          reviews: 50,
        })
      }

      // 모두 장바구니에 추가
      const wishlistItems = useWishlistStore.getState().items
      wishlistItems.forEach((item, index) => {
        addToCart({
          id: `${index + 1}`,
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
        })
      })

      const cartItems = useCartStore.getState().items
      expect(cartItems).toHaveLength(3)
    })

    it('장바구니에 추가 후 위시리스트에서 제거 옵션', () => {
      const { addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore.getState()
      const { addItem: addToCart } = useCartStore.getState()

      addToWishlist({
        id: 'p1',
        name: 'Product',
        brand: 'Brand',
        price: 20,
        image: '/test.jpg',
        rating: 4.5,
        reviews: 100,
      })

      const wishlistItem = useWishlistStore.getState().items[0]
      
      // 장바구니에 추가
      addToCart({
        id: '1',
        productId: wishlistItem.id,
        name: wishlistItem.name,
        price: wishlistItem.price,
        quantity: 1,
        image: wishlistItem.image,
      })

      // 위시리스트에서 제거
      removeFromWishlist('p1')

      expect(useWishlistStore.getState().items).toHaveLength(0)
      expect(useCartStore.getState().items).toHaveLength(1)
    })
  })

  describe('중복 체크', () => {
    it('이미 장바구니에 있는 상품은 표시되어야 함', () => {
      const { addItem: addToWishlist } = useWishlistStore.getState()
      const { addItem: addToCart } = useCartStore.getState()

      addToWishlist({
        id: 'p1',
        name: 'Product',
        brand: 'Brand',
        price: 20,
        image: '/test.jpg',
        rating: 4,
        reviews: 50,
      })

      addToCart({
        id: '1',
        productId: 'p1',
        name: 'Product',
        price: 20,
        quantity: 1,
        image: '/test.jpg',
      })

      const wishlistItems = useWishlistStore.getState().items
      const cartItems = useCartStore.getState().items

      const isInCart = wishlistItems.some((w) =>
        cartItems.some((c) => c.productId === w.id)
      )

      expect(isInCart).toBe(true)
    })
  })

  describe('일괄 작업', () => {
    it('위시리스트 여러 상품을 선택하여 장바구니에 추가', () => {
      const { addItem: addToWishlist } = useWishlistStore.getState()
      const { addItem: addToCart } = useCartStore.getState()

      // 5개 상품 위시리스트에 추가
      for (let i = 1; i <= 5; i++) {
        addToWishlist({
          id: `p${i}`,
          name: `Product ${i}`,
          brand: 'Brand',
          price: i * 10,
          image: `/test${i}.jpg`,
          rating: 4,
          reviews: 50,
        })
      }

      // 처음 3개만 장바구니에 추가
      const selectedIds = ['p1', 'p2', 'p3']
      const wishlistItems = useWishlistStore.getState().items

      wishlistItems
        .filter((item) => selectedIds.includes(item.id))
        .forEach((item, index) => {
          addToCart({
            id: `${index + 1}`,
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image,
          })
        })

      expect(useCartStore.getState().items).toHaveLength(3)
      expect(useWishlistStore.getState().items).toHaveLength(5)
    })
  })
})

