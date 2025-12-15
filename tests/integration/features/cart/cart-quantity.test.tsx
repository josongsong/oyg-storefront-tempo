import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useCartStore } from '@/features/cart/model/store'
import { Button } from '@/shared/components/ui/button'

function CartQuantityTest() {
  const { items, updateQuantity, removeItem } = useCartStore()

  return (
    <div>
      <div data-testid="cart-items">
        {items.map((item) => (
          <div key={item.id} data-testid={`cart-item-${item.id}`}>
            <span data-testid={`item-name-${item.id}`}>{item.name}</span>
            <span data-testid={`item-quantity-${item.id}`}>{item.quantity}</span>
            <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
            <Button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button>
            <Button onClick={() => removeItem(item.id)}>Remove</Button>
          </div>
        ))}
      </div>
      <div data-testid="total-items">{items.length}</div>
    </div>
  )
}

describe('Cart Quantity Integration', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], savedItems: [] })
  })

  describe('수량 증가', () => {
    it('상품 수량을 증가시킬 수 있어야 함', async () => {
      useCartStore.getState().addItem({
        id: '1',
        productId: 'p1',
        name: 'Test Product',
        price: 10,
        quantity: 1,
        image: '/test.jpg',
      })

      const user = userEvent.setup()
      render(<CartQuantityTest />)

      expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('1')

      await user.click(screen.getAllByText('+')[0])

      await waitFor(() => {
        expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('2')
      })
    })

    it('여러 번 증가시킬 수 있어야 함', async () => {
      useCartStore.getState().addItem({
        id: '1',
        productId: 'p1',
        name: 'Test',
        price: 10,
        quantity: 1,
        image: '/test.jpg',
      })

      const user = userEvent.setup()
      render(<CartQuantityTest />)

      const plusBtn = screen.getAllByText('+')[0]
      await user.click(plusBtn)
      await user.click(plusBtn)
      await user.click(plusBtn)

      await waitFor(() => {
        expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('4')
      })
    })
  })

  describe('수량 감소', () => {
    it('상품 수량을 감소시킬 수 있어야 함', async () => {
      useCartStore.getState().addItem({
        id: '1',
        productId: 'p1',
        name: 'Test',
        price: 10,
        quantity: 3,
        image: '/test.jpg',
      })

      const user = userEvent.setup()
      render(<CartQuantityTest />)

      await user.click(screen.getAllByText('-')[0])

      await waitFor(() => {
        expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('2')
      })
    })

    it('수량은 1 미만으로 내려가지 않아야 함', async () => {
      useCartStore.getState().addItem({
        id: '1',
        productId: 'p1',
        name: 'Test',
        price: 10,
        quantity: 1,
        image: '/test.jpg',
      })

      const user = userEvent.setup()
      render(<CartQuantityTest />)

      await user.click(screen.getAllByText('-')[0])

      await waitFor(() => {
        expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('1')
      })
    })
  })

  describe('상품 제거', () => {
    it('상품을 제거할 수 있어야 함', async () => {
      useCartStore.getState().addItem({
        id: '1',
        productId: 'p1',
        name: 'Test',
        price: 10,
        quantity: 1,
        image: '/test.jpg',
      })

      const user = userEvent.setup()
      render(<CartQuantityTest />)

      expect(screen.getByTestId('total-items')).toHaveTextContent('1')

      await user.click(screen.getByText('Remove'))

      await waitFor(() => {
        expect(screen.getByTestId('total-items')).toHaveTextContent('0')
      })
    })

    it('여러 상품 중 하나만 제거할 수 있어야 함', async () => {
      useCartStore.getState().addItem({
        id: '1',
        productId: 'p1',
        name: 'Product 1',
        price: 10,
        quantity: 1,
        image: '/test1.jpg',
      })
      useCartStore.getState().addItem({
        id: '2',
        productId: 'p2',
        name: 'Product 2',
        price: 20,
        quantity: 1,
        image: '/test2.jpg',
      })

      const user = userEvent.setup()
      render(<CartQuantityTest />)

      expect(screen.getByTestId('total-items')).toHaveTextContent('2')

      await user.click(screen.getAllByText('Remove')[0])

      await waitFor(() => {
        expect(screen.getByTestId('total-items')).toHaveTextContent('1')
        expect(screen.getByTestId('item-name-2')).toBeInTheDocument()
      })
    })
  })

  describe('수량 변경과 가격 계산', () => {
    it('수량 변경시 아이템 가격이 업데이트되어야 함', async () => {
      useCartStore.getState().addItem({
        id: '1',
        productId: 'p1',
        name: 'Test',
        price: 10,
        quantity: 1,
        image: '/test.jpg',
      })

      const user = userEvent.setup()
      render(<CartQuantityTest />)

      await user.click(screen.getAllByText('+')[0])

      await waitFor(() => {
        const { items } = useCartStore.getState()
        expect(items[0].quantity).toBe(2)
      })
    })

    it('여러 상품의 수량을 각각 변경할 수 있어야 함', async () => {
      useCartStore.getState().addItem({
        id: '1',
        productId: 'p1',
        name: 'Product 1',
        price: 10,
        quantity: 1,
        image: '/test1.jpg',
      })
      useCartStore.getState().addItem({
        id: '2',
        productId: 'p2',
        name: 'Product 2',
        price: 20,
        quantity: 1,
        image: '/test2.jpg',
      })

      const user = userEvent.setup()
      render(<CartQuantityTest />)

      // 첫 번째 상품 수량 증가
      await user.click(screen.getAllByText('+')[0])
      // 두 번째 상품 수량 증가
      await user.click(screen.getAllByText('+')[1])
      await user.click(screen.getAllByText('+')[1])

      await waitFor(() => {
        expect(screen.getByTestId('item-quantity-1')).toHaveTextContent('2')
        expect(screen.getByTestId('item-quantity-2')).toHaveTextContent('3')
      })
    })
  })
})

