/**
 * Product Flow Integration Tests
 * 상품 검색 → 상세 → 장바구니 플로우 통합 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { ProductListPage } from '@/features/product/pages/product-list-page'
import { ProductDetailPage } from '@/features/product/pages/product-detail-page'
import { useCartStore } from '@/features/cart/model/store'
import { useWishlistStore } from '@/features/product/stores/wishlist.store'
import { server } from '@/test/mocks/server'
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } from '@/test/fixtures'
import { http, HttpResponse } from 'msw'

// Mock router params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: 'prod-detail-1' }),
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  }
})

describe('Product Flow Integration', () => {
  beforeEach(() => {
    useCartStore.getState().clear()
    useWishlistStore.getState().clear()
  })

  describe('Product List View', () => {
    it('should display product list', async () => {
      server.use(
        http.get('*/products', () => {
          return HttpResponse.json(MOCK_PRODUCTS)
        })
      )

      renderWithProviders(<ProductListPage />)

      await waitFor(() => {
        expect(screen.getByText(/Test Product 1|product/i)).toBeInTheDocument()
      })
    })

    it('should filter products by category', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products', ({ request }) => {
          const url = new URL(request.url)
          const category = url.searchParams.get('category')

          if (category === 'skincare') {
            return HttpResponse.json(
              MOCK_PRODUCTS.filter((p) => p.categories.includes('skincare'))
            )
          }

          return HttpResponse.json(MOCK_PRODUCTS)
        })
      )

      renderWithProviders(<ProductListPage />)

      // 카테고리 필터 클릭
      const categoryFilter = screen.getByRole('button', { name: /skincare/i })
      await user.click(categoryFilter)

      await waitFor(() => {
        // Filtered results
        expect(screen.getAllByRole('article')).toBeDefined()
      })
    })

    it('should search products', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products/search', ({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get('search')

          const filtered = MOCK_PRODUCTS.filter((p) =>
            p.name.toLowerCase().includes(query?.toLowerCase() || '')
          )

          return HttpResponse.json(filtered)
        })
      )

      renderWithProviders(<ProductListPage />)

      // 검색
      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'Test Product 1')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument()
      })
    })

    it('should sort products', async () => {
      const user = userEvent.setup()

      renderWithProviders(<ProductListPage />)

      // 정렬 옵션 선택
      const sortSelect = screen.getByRole('combobox', { name: /sort/i })
      await user.selectOptions(sortSelect, 'price-low')

      await waitFor(() => {
        // Sorted results
        expect(screen.getAllByRole('article')).toBeDefined()
      })
    })
  })

  describe('Product Detail View', () => {
    it('should display product details', async () => {
      server.use(
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      renderWithProviders(<ProductDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(/Detailed Test Product/i)).toBeInTheDocument()
      })

      // 상세 정보 확인
      expect(screen.getByText(/description|ingredients/i)).toBeInTheDocument()
    })

    it('should show product images', async () => {
      server.use(
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      renderWithProviders(<ProductDetailPage />)

      await waitFor(() => {
        const images = screen.getAllByRole('img')
        expect(images.length).toBeGreaterThan(0)
      })
    })

    it('should display product rating and reviews', async () => {
      server.use(
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      renderWithProviders(<ProductDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(/4\.7|rating/i)).toBeInTheDocument()
        expect(screen.getByText(/150|reviews/i)).toBeInTheDocument()
      })
    })
  })

  describe('Add to Cart Flow', () => {
    it('should add product to cart from detail page', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      renderWithProviders(<ProductDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(/Detailed Test Product/i)).toBeInTheDocument()
      })

      // 장바구니 추가 버튼 클릭
      const addToCartBtn = screen.getByRole('button', { name: /add to cart/i })
      await user.click(addToCartBtn)

      await waitFor(() => {
        expect(useCartStore.getState().getTotalItems()).toBeGreaterThan(0)
      })
    })

    it('should show success message after adding to cart', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      renderWithProviders(<ProductDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(/Detailed Test Product/i)).toBeInTheDocument()
      })

      const addToCartBtn = screen.getByRole('button', { name: /add to cart/i })
      await user.click(addToCartBtn)

      await waitFor(() => {
        expect(
          screen.getByText(/added to cart|success/i)
        ).toBeInTheDocument()
      })
    })

    it('should update cart count', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      renderWithProviders(<ProductDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(/Detailed Test Product/i)).toBeInTheDocument()
      })

      const initialCount = useCartStore.getState().getTotalItems()

      const addToCartBtn = screen.getByRole('button', { name: /add to cart/i })
      await user.click(addToCartBtn)

      await waitFor(() => {
        const newCount = useCartStore.getState().getTotalItems()
        expect(newCount).toBeGreaterThan(initialCount)
      })
    })
  })

  describe('Wishlist Flow', () => {
    it('should add product to wishlist', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      renderWithProviders(<ProductDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(/Detailed Test Product/i)).toBeInTheDocument()
      })

      // 위시리스트 버튼 클릭
      const wishlistBtn = screen.getByRole('button', { name: /wishlist|favorite/i })
      await user.click(wishlistBtn)

      await waitFor(() => {
        expect(useWishlistStore.getState().items.length).toBeGreaterThan(0)
      })
    })

    it('should toggle wishlist state', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      renderWithProviders(<ProductDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(/Detailed Test Product/i)).toBeInTheDocument()
      })

      const wishlistBtn = screen.getByRole('button', { name: /wishlist|favorite/i })

      // 추가
      await user.click(wishlistBtn)
      await waitFor(() => {
        expect(useWishlistStore.getState().items.length).toBe(1)
      })

      // 제거
      await user.click(wishlistBtn)
      await waitFor(() => {
        expect(useWishlistStore.getState().items.length).toBe(0)
      })
    })
  })

  describe('Quick Shop Flow', () => {
    it('should open quick shop modal from product list', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products', () => {
          return HttpResponse.json(MOCK_PRODUCTS)
        })
      )

      renderWithProviders(<ProductListPage />)

      await waitFor(() => {
        expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument()
      })

      // Quick Shop 버튼 클릭
      const quickShopBtn = screen.getByRole('button', { name: /quick.*shop/i })
      await user.click(quickShopBtn)

      await waitFor(() => {
        // 모달이 열렸는지 확인
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })
    })

    it('should add to cart from quick shop modal', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products', () => {
          return HttpResponse.json(MOCK_PRODUCTS)
        })
      )

      renderWithProviders(<ProductListPage />)

      await waitFor(() => {
        expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument()
      })

      const quickShopBtn = screen.getByRole('button', { name: /quick.*shop/i })
      await user.click(quickShopBtn)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // 모달 내에서 장바구니 추가
      const addBtn = screen.getByRole('button', { name: /add to cart/i })
      await user.click(addBtn)

      await waitFor(() => {
        expect(useCartStore.getState().getTotalItems()).toBeGreaterThan(0)
      })
    })
  })

  describe('Complete Product Journey', () => {
    it('should handle full product discovery to purchase flow', async () => {
      const user = userEvent.setup()

      server.use(
        http.get('*/products', () => {
          return HttpResponse.json(MOCK_PRODUCTS)
        }),
        http.get('*/products/:id', () => {
          return HttpResponse.json(MOCK_PRODUCT_DETAIL)
        })
      )

      // 1. 상품 목록 조회
      const { rerender } = renderWithProviders(<ProductListPage />)

      await waitFor(() => {
        expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument()
      })

      // 2. 상품 검색
      const searchInput = screen.getByPlaceholderText(/search/i)
      await user.type(searchInput, 'serum')

      // 3. 상품 상세로 이동
      rerender(<ProductDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(/Detailed Test Product/i)).toBeInTheDocument()
      })

      // 4. 위시리스트 추가
      const wishlistBtn = screen.getByRole('button', { name: /wishlist|favorite/i })
      await user.click(wishlistBtn)

      expect(useWishlistStore.getState().items.length).toBe(1)

      // 5. 장바구니 추가
      const addToCartBtn = screen.getByRole('button', { name: /add to cart/i })
      await user.click(addToCartBtn)

      await waitFor(() => {
        expect(useCartStore.getState().getTotalItems()).toBe(1)
      })

      // 6. 장바구니 확인
      const cartItems = useCartStore.getState().getItems()
      expect(cartItems.length).toBe(1)

      // 7. 합계 확인
      const summary = useCartStore.getState().getSummary()
      expect(summary.subtotal).toBeGreaterThan(0)
      expect(summary.total).toBeGreaterThan(0)
    })
  })
})


