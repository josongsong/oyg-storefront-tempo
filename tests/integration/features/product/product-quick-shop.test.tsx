import { describe, it, expect, beforeEach } from 'vitest'
import { useQuickShopStore } from '@/features/product/stores/quick-shop.store'
import { useCartStore } from '@/features/cart/model/store'

describe('Quick Shop Integration', () => {
  beforeEach(() => {
    useQuickShopStore.setState({
      isOpen: false,
      product: null,
    })
    useCartStore.setState({ items: [], savedItems: [] })
  })

  describe('Quick Shop 모달', () => {
    it('상품 선택시 Quick Shop이 열려야 함', () => {
      const { openQuickShop } = useQuickShopStore.getState()

      openQuickShop({
        id: 'p1',
        name: 'Quick Shop Product',
        brand: 'Brand',
        price: 30,
        originalPrice: 40,
        rating: 4.5,
        reviews: 200,
        image: '/test.jpg',
        images: ['/test1.jpg', '/test2.jpg'],
        badge: 'NEW',
        description: 'Test description',
      })

      const { isOpen, product } = useQuickShopStore.getState()
      expect(isOpen).toBe(true)
      expect(product?.id).toBe('p1')
    })

    it('Quick Shop에서 장바구니에 추가할 수 있어야 함', () => {
      const { openQuickShop, closeQuickShop } = useQuickShopStore.getState()
      const { addItem } = useCartStore.getState()

      openQuickShop({
        id: 'p1',
        name: 'Product',
        brand: 'Brand',
        price: 25,
        rating: 4,
        reviews: 100,
        image: '/test.jpg',
        images: ['/test.jpg'],
      })

      const { product } = useQuickShopStore.getState()
      
      if (product) {
        addItem({
          id: '1',
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        })
      }

      closeQuickShop()

      expect(useCartStore.getState().items).toHaveLength(1)
      expect(useQuickShopStore.getState().isOpen).toBe(false)
    })

    it('Quick Shop에서 수량을 선택할 수 있어야 함', () => {
      const { openQuickShop } = useQuickShopStore.getState()
      const { addItem } = useCartStore.getState()

      openQuickShop({
        id: 'p1',
        name: 'Product',
        brand: 'Brand',
        price: 30,
        rating: 4,
        reviews: 50,
        image: '/test.jpg',
        images: ['/test.jpg'],
      })

      const { product } = useQuickShopStore.getState()

      // 수량 3으로 장바구니 추가
      if (product) {
        addItem({
          id: '1',
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 3,
          image: product.image,
        })
      }

      const cartItem = useCartStore.getState().items[0]
      expect(cartItem.quantity).toBe(3)
    })
  })

  describe('Quick Shop 플로우', () => {
    it('여러 상품을 Quick Shop으로 순차 추가할 수 있어야 함', () => {
      const { openQuickShop, closeQuickShop } = useQuickShopStore.getState()
      const { addItem } = useCartStore.getState()

      // 첫 번째 상품
      openQuickShop({
        id: 'p1',
        name: 'Product 1',
        brand: 'Brand',
        price: 20,
        rating: 4,
        reviews: 50,
        image: '/test1.jpg',
        images: ['/test1.jpg'],
      })

      let product = useQuickShopStore.getState().product
      if (product) {
        addItem({
          id: '1',
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        })
      }
      closeQuickShop()

      // 두 번째 상품
      openQuickShop({
        id: 'p2',
        name: 'Product 2',
        brand: 'Brand',
        price: 30,
        rating: 5,
        reviews: 100,
        image: '/test2.jpg',
        images: ['/test2.jpg'],
      })

      product = useQuickShopStore.getState().product
      if (product) {
        addItem({
          id: '2',
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        })
      }
      closeQuickShop()

      expect(useCartStore.getState().items).toHaveLength(2)
    })

    it('Quick Shop 취소시 장바구니에 추가되지 않아야 함', () => {
      const { openQuickShop, closeQuickShop } = useQuickShopStore.getState()

      openQuickShop({
        id: 'p1',
        name: 'Product',
        brand: 'Brand',
        price: 25,
        rating: 4,
        reviews: 50,
        image: '/test.jpg',
        images: ['/test.jpg'],
      })

      // 장바구니에 추가하지 않고 닫기
      closeQuickShop()

      expect(useCartStore.getState().items).toHaveLength(0)
    })
  })
})

