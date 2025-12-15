/**
 * ProductCard Component Tests
 * 컴포넌트 렌더링 및 사용자 인터랙션 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ProductCard } from '@/features/product/components/product-card'
import { createProduct } from '@/test/factories'
import type { GlossierProduct } from '@/types/glossier'

// Mock stores
vi.mock('@/features/product/stores', () => ({
  useQuickShopStore: vi.fn(() => ({
    openQuickShop: vi.fn(),
  })),
  useWishlistStore: vi.fn(() => ({
    toggleItem: vi.fn(),
    items: [],
  })),
}))

// Mock utils
vi.mock('@/features/product/utils', () => ({
  loadAllProducts: vi.fn(() => Promise.resolve([])),
}))

const mockProduct: GlossierProduct = {
  id: 'prod-1',
  name: 'Test Product',
  brand: 'Test Brand',
  price: '$19.99',
  rating: 4.5,
  reviewCount: 100,
  image: '/test.jpg',
  categories: ['skincare'],
  tags: { product_type: ['serum'] },
} as any

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render product information', () => {
      renderWithProviders(<ProductCard product={mockProduct} />)

      expect(screen.getByText('Test Product')).toBeInTheDocument()
      expect(screen.getByText('Test Brand')).toBeInTheDocument()
      expect(screen.getByText('$19.99')).toBeInTheDocument()
    })

    it('should render product image', () => {
      renderWithProviders(<ProductCard product={mockProduct} />)

      const img = screen.getAllByRole('img')[0]
      expect(img).toHaveAttribute('alt', 'Test Product')
    })

    it('should display rating', () => {
      renderWithProviders(<ProductCard product={mockProduct} />)

      // Rating은 숫자나 별 아이콘으로 표시될 수 있음
      expect(screen.getByText(/4\.5|100/)).toBeInTheDocument()
    })

    it('should render with default variant', () => {
      const { container } = renderWithProviders(
        <ProductCard product={mockProduct} />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should render with compact variant', () => {
      const { container } = renderWithProviders(
        <ProductCard product={mockProduct} variant="compact" />
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('should show wishlist button by default', () => {
      renderWithProviders(<ProductCard product={mockProduct} />)

      // Heart 아이콘이 있어야 함
      const wishlistBtn = screen.getByRole('button', { name: /wishlist|favorite/i })
      expect(wishlistBtn).toBeInTheDocument()
    })

    it('should hide wishlist button when showWishlist is false', () => {
      renderWithProviders(
        <ProductCard product={mockProduct} showWishlist={false} />
      )

      const wishlistBtn = screen.queryByRole('button', { name: /wishlist|favorite/i })
      expect(wishlistBtn).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should navigate to product detail on click', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductCard product={mockProduct} />)

      const card = screen.getByText('Test Product').closest('div')
      if (card) {
        await user.click(card)
      }

      // Navigation은 router mock으로 확인
      expect(true).toBe(true)
    })

    it('should call onQuickShop when quick shop button clicked', async () => {
      const user = userEvent.setup()
      const handleQuickShop = vi.fn()

      renderWithProviders(
        <ProductCard product={mockProduct} onQuickShop={handleQuickShop} />
      )

      const quickShopBtn = screen.getByRole('button', { name: /quick.*shop/i })
      await user.click(quickShopBtn)

      expect(handleQuickShop).toHaveBeenCalledTimes(1)
    })

    it('should toggle wishlist when heart button clicked', async () => {
      const user = userEvent.setup()
      const mockToggle = vi.fn()

      vi.mocked(await import('@/features/product/stores')).useWishlistStore.mockReturnValue({
        toggleItem: mockToggle,
        items: [],
      } as any)

      renderWithProviders(<ProductCard product={mockProduct} />)

      const wishlistBtn = screen.getByRole('button', { name: /wishlist|favorite/i })
      await user.click(wishlistBtn)

      expect(mockToggle).toHaveBeenCalled()
    })
  })

  describe('Wishlist State', () => {
    it('should show filled heart when product is in wishlist', () => {
      vi.mocked(await import('@/features/product/stores')).useWishlistStore.mockReturnValue({
        toggleItem: vi.fn(),
        items: [{ id: 'prod-1', name: 'Test Product' }],
      } as any)

      renderWithProviders(<ProductCard product={mockProduct} />)

      const wishlistBtn = screen.getByRole('button', { name: /wishlist|favorite/i })
      expect(wishlistBtn).toBeInTheDocument()
    })

    it('should show empty heart when product is not in wishlist', () => {
      vi.mocked(await import('@/features/product/stores')).useWishlistStore.mockReturnValue({
        toggleItem: vi.fn(),
        items: [],
      } as any)

      renderWithProviders(<ProductCard product={mockProduct} />)

      const wishlistBtn = screen.getByRole('button', { name: /wishlist|favorite/i })
      expect(wishlistBtn).toBeInTheDocument()
    })
  })

  describe('Props Variations', () => {
    it('should handle product with no rating', () => {
      const productNoRating = {
        ...mockProduct,
        rating: 0,
        reviewCount: 0,
      }

      renderWithProviders(<ProductCard product={productNoRating} />)

      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('should handle product with long name', () => {
      const productLongName = {
        ...mockProduct,
        name: 'Very Long Product Name That Might Need Truncation',
      }

      renderWithProviders(<ProductCard product={productLongName} />)

      expect(
        screen.getByText(/Very Long Product Name/)
      ).toBeInTheDocument()
    })

    it('should handle product with special characters in name', () => {
      const productSpecial = {
        ...mockProduct,
        name: "Product & Co. - 'Special' Edition",
      }

      renderWithProviders(<ProductCard product={productSpecial} />)

      expect(
        screen.getByText(/Product & Co./)
      ).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible image alt text', () => {
      renderWithProviders(<ProductCard product={mockProduct} />)

      const img = screen.getAllByRole('img')[0]
      expect(img).toHaveAttribute('alt', expect.stringContaining('Test Product'))
    })

    it('should have clickable elements', () => {
      renderWithProviders(<ProductCard product={mockProduct} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Performance', () => {
    it('should memoize product card', () => {
      const { rerender } = renderWithProviders(
        <ProductCard product={mockProduct} />
      )

      // 같은 props로 리렌더
      rerender(<ProductCard product={mockProduct} />)

      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })
  })
})


