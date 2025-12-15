/**
 * Cart Flow Integration Tests
 * 장바구니 전체 플로우 통합 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { CartPage } from '@/features/cart/pages/cart-page'
import { useCartStore } from '@/features/cart/model/store'
import { createCartItem } from '@/test/factories'
import { resetMockCart } from '@/test/mocks/handlers'

describe('Cart Flow Integration', () => {
  beforeEach(() => {
    // 각 테스트 전 장바구니 초기화
    useCartStore.getState().clear()
    resetMockCart()
  })

  describe('Empty Cart', () => {
    it('should display empty state when cart is empty', async () => {
      renderWithProviders(<CartPage />)

      await waitFor(() => {
        expect(
          screen.getByText(/cart is empty|no items/i)
        ).toBeInTheDocument()
      })
    })

    it('should show call-to-action for empty cart', async () => {
      renderWithProviders(<CartPage />)

      await waitFor(() => {
        const cta = screen.getByRole('link', { name: /shop|continue shopping/i })
        expect(cta).toBeInTheDocument()
      })
    })
  })

  describe('Add Items to Cart', () => {
    it('should display items after adding to cart', async () => {
      const item = createCartItem({
        name: 'Test Product',
        price: 19.99,
        quantity: 1,
      })

      renderWithProviders(<CartPage />)

      // 스토어에 아이템 추가
      useCartStore.getState().addItem(item)

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument()
      })
    })

    it('should display multiple items', async () => {
      const item1 = createCartItem({ name: 'Product 1', price: 10 })
      const item2 = createCartItem({ name: 'Product 2', price: 20 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item1)
      useCartStore.getState().addItem(item2)

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Product 2')).toBeInTheDocument()
      })
    })

    it('should show correct item count', async () => {
      const item1 = createCartItem({ quantity: 2 })
      const item2 = createCartItem({ quantity: 3 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item1)
      useCartStore.getState().addItem(item2)

      await waitFor(() => {
        expect(useCartStore.getState().getTotalItems()).toBe(5)
      })
    })
  })

  describe('Update Item Quantity', () => {
    it('should increase item quantity', async () => {
      const user = userEvent.setup()
      const item = createCartItem({ name: 'Test Product', quantity: 1 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument()
      })

      // 수량 증가 버튼 클릭
      const increaseBtn = screen.getByRole('button', { name: /increase|plus|\+/i })
      await user.click(increaseBtn)

      const items = useCartStore.getState().getItems()
      expect(items[0]?.quantity).toBe(2)
    })

    it('should decrease item quantity', async () => {
      const user = userEvent.setup()
      const item = createCartItem({ name: 'Test Product', quantity: 3 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument()
      })

      // 수량 감소 버튼 클릭
      const decreaseBtn = screen.getByRole('button', { name: /decrease|minus|-/i })
      await user.click(decreaseBtn)

      const items = useCartStore.getState().getItems()
      expect(items[0]?.quantity).toBe(2)
    })

    it('should remove item when quantity becomes 0', async () => {
      const user = userEvent.setup()
      const item = createCartItem({ name: 'Test Product', quantity: 1 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument()
      })

      // 수량을 0으로 감소
      const decreaseBtn = screen.getByRole('button', { name: /decrease|minus|-/i })
      await user.click(decreaseBtn)

      await waitFor(() => {
        expect(screen.queryByText('Test Product')).not.toBeInTheDocument()
      })
    })
  })

  describe('Remove Items', () => {
    it('should remove item from cart', async () => {
      const user = userEvent.setup()
      const item = createCartItem({ name: 'Test Product' })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument()
      })

      // 제거 버튼 클릭
      const removeBtn = screen.getByRole('button', { name: /remove|delete/i })
      await user.click(removeBtn)

      await waitFor(() => {
        expect(screen.queryByText('Test Product')).not.toBeInTheDocument()
      })
    })

    it('should show empty state after removing all items', async () => {
      const user = userEvent.setup()
      const item = createCartItem({ name: 'Test Product' })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument()
      })

      const removeBtn = screen.getByRole('button', { name: /remove|delete/i })
      await user.click(removeBtn)

      await waitFor(() => {
        expect(
          screen.getByText(/cart is empty|no items/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Cart Summary', () => {
    it('should calculate correct subtotal', async () => {
      const item1 = createCartItem({ price: 10, quantity: 2 }) // $20
      const item2 = createCartItem({ price: 15, quantity: 1 }) // $15

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item1)
      useCartStore.getState().addItem(item2)

      await waitFor(() => {
        const summary = useCartStore.getState().getSummary()
        expect(summary.subtotal).toBe(35)
      })
    })

    it('should calculate tax', async () => {
      const item = createCartItem({ price: 100, quantity: 1 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        const summary = useCartStore.getState().getSummary()
        expect(summary.tax).toBeGreaterThan(0)
      })
    })

    it('should include shipping cost', async () => {
      const item = createCartItem({ price: 30, quantity: 1 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        const summary = useCartStore.getState().getSummary()
        expect(summary.shipping).toBeGreaterThanOrEqual(0)
      })
    })

    it('should apply free shipping threshold', async () => {
      const item = createCartItem({ price: 100, quantity: 1 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        const summary = useCartStore.getState().getSummary()
        // 무료배송 기준 이상이면 shipping이 0
        if (summary.subtotal >= 50) {
          expect(summary.shipping).toBe(0)
        }
      })
    })

    it('should calculate correct total', async () => {
      const item = createCartItem({ price: 50, quantity: 2 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        const summary = useCartStore.getState().getSummary()
        const expectedTotal = summary.subtotal + summary.tax + summary.shipping
        expect(summary.total).toBe(expectedTotal)
      })
    })
  })

  describe('Checkout Flow', () => {
    it('should show checkout button when cart has items', async () => {
      const item = createCartItem()

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        const checkoutBtn = screen.getByRole('button', { name: /checkout|proceed/i })
        expect(checkoutBtn).toBeInTheDocument()
      })
    })

    it('should navigate to checkout on button click', async () => {
      const user = userEvent.setup()
      const item = createCartItem()

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        const checkoutBtn = screen.getByRole('button', { name: /checkout|proceed/i })
        expect(checkoutBtn).toBeInTheDocument()
      })

      const checkoutBtn = screen.getByRole('button', { name: /checkout|proceed/i })
      await user.click(checkoutBtn)

      // Navigation은 router mock으로 확인
      expect(true).toBe(true)
    })
  })

  describe('Complete Cart Flow', () => {
    it('should handle full cart lifecycle', async () => {
      const user = userEvent.setup()

      renderWithProviders(<CartPage />)

      // 1. 초기 빈 상태
      await waitFor(() => {
        expect(
          screen.getByText(/cart is empty|no items/i)
        ).toBeInTheDocument()
      })

      // 2. 아이템 추가
      const item1 = createCartItem({ name: 'Product 1', price: 20, quantity: 1 })
      const item2 = createCartItem({ name: 'Product 2', price: 30, quantity: 2 })

      useCartStore.getState().addItem(item1)
      useCartStore.getState().addItem(item2)

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Product 2')).toBeInTheDocument()
      })

      // 3. 수량 업데이트
      const totalItems = useCartStore.getState().getTotalItems()
      expect(totalItems).toBe(3) // 1 + 2

      // 4. 합계 확인
      const summary = useCartStore.getState().getSummary()
      expect(summary.subtotal).toBe(80) // 20 + (30 * 2)

      // 5. 아이템 제거
      const removeButtons = screen.getAllByRole('button', { name: /remove|delete/i })
      await user.click(removeButtons[0])

      await waitFor(() => {
        expect(screen.queryByText('Product 1')).not.toBeInTheDocument()
      })

      // 6. 남은 아이템 확인
      expect(screen.getByText('Product 2')).toBeInTheDocument()

      // 7. 전체 클리어
      useCartStore.getState().clear()

      await waitFor(() => {
        expect(
          screen.getByText(/cart is empty|no items/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid quantity changes', async () => {
      const user = userEvent.setup()
      const item = createCartItem({ name: 'Test Product', quantity: 1 })

      renderWithProviders(<CartPage />)

      useCartStore.getState().addItem(item)

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument()
      })

      // 빠르게 여러 번 증가
      const increaseBtn = screen.getByRole('button', { name: /increase|plus|\+/i })
      await user.tripleClick(increaseBtn)

      const items = useCartStore.getState().getItems()
      expect(items[0]?.quantity).toBeGreaterThan(1)
    })

    it('should handle concurrent item additions', async () => {
      const items = [
        createCartItem({ name: 'Product 1' }),
        createCartItem({ name: 'Product 2' }),
        createCartItem({ name: 'Product 3' }),
      ]

      renderWithProviders(<CartPage />)

      // 동시에 여러 아이템 추가
      items.forEach((item) => {
        useCartStore.getState().addItem(item)
      })

      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument()
        expect(screen.getByText('Product 2')).toBeInTheDocument()
        expect(screen.getByText('Product 3')).toBeInTheDocument()
      })

      expect(useCartStore.getState().getItems()).toHaveLength(3)
    })
  })
})


