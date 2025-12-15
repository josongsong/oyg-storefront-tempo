import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Button } from '@/shared/components/ui/button'

// Mock product filtering
function ProductFilterTest() {
  const [filters, setFilters] = React.useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
  })
  const [products, setProducts] = React.useState([
    { id: '1', name: 'Product 1', category: 'skincare', price: 20, rating: 4 },
    { id: '2', name: 'Product 2', category: 'makeup', price: 50, rating: 5 },
    { id: '3', name: 'Product 3', category: 'skincare', price: 30, rating: 3 },
  ])

  const filteredProducts = products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false
    if (p.rating < filters.rating) return false
    return true
  })

  return (
    <div>
      <div data-testid="filter-controls">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          data-testid="category-filter"
        >
          <option value="">All</option>
          <option value="skincare">Skincare</option>
          <option value="makeup">Makeup</option>
        </select>

        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
          data-testid="price-min"
        />
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          data-testid="price-max"
        />

        <select
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
          data-testid="rating-filter"
        >
          <option value="0">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>

      <div data-testid="product-list">
        {filteredProducts.map((product) => (
          <div key={product.id} data-testid="product-item">
            {product.name} - ${product.price} - {product.rating}★
          </div>
        ))}
        {filteredProducts.length === 0 && <div data-testid="no-results">No products found</div>}
      </div>
    </div>
  )
}

describe('Product Filter Integration', () => {
  beforeEach(() => {
    // Reset state
  })

  describe('카테고리 필터', () => {
    it('카테고리별로 상품을 필터링할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      const categoryFilter = screen.getByTestId('category-filter')
      await user.selectOptions(categoryFilter, 'skincare')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(2)
      })
    })

    it('전체 카테고리를 선택할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      const categoryFilter = screen.getByTestId('category-filter')
      await user.selectOptions(categoryFilter, '')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(3)
      })
    })
  })

  describe('가격 필터', () => {
    it('최소 가격으로 필터링할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      const minPriceInput = screen.getByTestId('price-min')
      await user.clear(minPriceInput)
      await user.type(minPriceInput, '25')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(2) // $30, $50
      })
    })

    it('최대 가격으로 필터링할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      const maxPriceInput = screen.getByTestId('price-max')
      await user.clear(maxPriceInput)
      await user.type(maxPriceInput, '40')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(2) // $20, $30
      })
    })

    it('가격 범위로 필터링할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      const minPriceInput = screen.getByTestId('price-min')
      const maxPriceInput = screen.getByTestId('price-max')

      await user.clear(minPriceInput)
      await user.type(minPriceInput, '25')
      await user.clear(maxPriceInput)
      await user.type(maxPriceInput, '35')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(1) // $30
      })
    })
  })

  describe('별점 필터', () => {
    it('4점 이상으로 필터링할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      const ratingFilter = screen.getByTestId('rating-filter')
      await user.selectOptions(ratingFilter, '4')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(2) // rating 4, 5
      })
    })

    it('5점으로 필터링할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      const ratingFilter = screen.getByTestId('rating-filter')
      await user.selectOptions(ratingFilter, '5')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(1)
      })
    })
  })

  describe('복합 필터', () => {
    it('카테고리와 가격을 함께 필터링할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      const categoryFilter = screen.getByTestId('category-filter')
      const minPriceInput = screen.getByTestId('price-min')

      await user.selectOptions(categoryFilter, 'skincare')
      await user.clear(minPriceInput)
      await user.type(minPriceInput, '25')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(1) // Product 3 only
      })
    })

    it('모든 필터를 함께 적용할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      await user.selectOptions(screen.getByTestId('category-filter'), 'skincare')
      await user.clear(screen.getByTestId('price-min'))
      await user.type(screen.getByTestId('price-min'), '15')
      await user.clear(screen.getByTestId('price-max'))
      await user.type(screen.getByTestId('price-max'), '25')
      await user.selectOptions(screen.getByTestId('rating-filter'), '4')

      await waitFor(() => {
        const products = screen.getAllByTestId('product-item')
        expect(products).toHaveLength(1) // Product 1: skincare, $20, 4★
      })
    })

    it('조건에 맞는 상품이 없으면 메시지를 표시해야 함', async () => {
      const user = userEvent.setup()
      render(<ProductFilterTest />)

      await user.clear(screen.getByTestId('price-min'))
      await user.type(screen.getByTestId('price-min'), '1000')

      await waitFor(() => {
        expect(screen.getByTestId('no-results')).toBeInTheDocument()
      })
    })
  })
})

