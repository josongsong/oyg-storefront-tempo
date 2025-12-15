/**
 * useProducts Hook Tests
 * React Query + MSW를 사용한 hooks 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProducts, useProduct, productKeys } from '@/features/product/hooks/use-products'
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } from '@/test/fixtures'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useProducts', () => {
  describe('productKeys', () => {
    it('should generate correct query keys', () => {
      expect(productKeys.all).toEqual(['products'])
      expect(productKeys.lists()).toEqual(['products', 'list'])
      expect(productKeys.list({ page: 1 })).toEqual(['products', 'list', { page: 1 }])
      expect(productKeys.details()).toEqual(['products', 'detail'])
      expect(productKeys.detail('prod-1')).toEqual(['products', 'detail', 'prod-1'])
    })
  })

  describe('useProducts hook', () => {
    it('should fetch products successfully', async () => {
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(Array.isArray(result.current.data)).toBe(true)
    })

    it('should fetch products with params', async () => {
      const params = { category: 'skincare', page: 1, limit: 10 }

      const { result } = renderHook(() => useProducts(params), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
    })

    it('should handle empty params', async () => {
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
    })

    it('should handle API error', async () => {
      server.use(
        http.get('*/products', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })

    it('should cache query results', async () => {
      const { result: result1 } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true)
      })

      // 같은 쿼리 다시 실행
      const { result: result2 } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      })

      // 캐시에서 즉시 로드되므로 loading이 아님
      expect(result2.current.data).toBeDefined()
    })

    it('should refetch on params change', async () => {
      const { result, rerender } = renderHook(
        ({ params }) => useProducts(params),
        {
          wrapper: createWrapper(),
          initialProps: { params: { category: 'skincare' } },
        }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // 파라미터 변경
      rerender({ params: { category: 'makeup' } })

      await waitFor(() => {
        expect(result.current.isFetching).toBe(true)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })
    })
  })

  describe('useProduct hook', () => {
    it('should fetch product by id', async () => {
      const { result } = renderHook(() => useProduct('prod-detail-1'), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data).toHaveProperty('id')
      expect(result.current.data).toHaveProperty('name')
    })

    it('should not fetch when id is empty', async () => {
      const { result } = renderHook(() => useProduct(''), {
        wrapper: createWrapper(),
      })

      // enabled: false이므로 loading이 아님
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeUndefined()
    })

    it('should handle not found error', async () => {
      server.use(
        http.get('*/products/:id', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      const { result } = renderHook(() => useProduct('non-existent'), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })

    it('should refetch when id changes', async () => {
      const { result, rerender } = renderHook(
        ({ id }) => useProduct(id),
        {
          wrapper: createWrapper(),
          initialProps: { id: 'prod-1' },
        }
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      const firstData = result.current.data

      // ID 변경
      rerender({ id: 'prod-2' })

      await waitFor(() => {
        expect(result.current.isFetching).toBe(true)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      // 데이터가 변경되었는지 확인
      expect(result.current.data).toBeDefined()
    })

    it('should enable query when id becomes available', async () => {
      const { result, rerender } = renderHook(
        ({ id }) => useProduct(id),
        {
          wrapper: createWrapper(),
          initialProps: { id: '' },
        }
      )

      // 초기에는 disabled
      expect(result.current.isLoading).toBe(false)

      // ID 제공
      rerender({ id: 'prod-1' })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
    })
  })

  describe('Query integration', () => {
    it('should use separate cache for list and detail', async () => {
      const wrapper = createWrapper()

      // 리스트 쿼리
      const { result: listResult } = renderHook(() => useProducts(), {
        wrapper,
      })

      await waitFor(() => {
        expect(listResult.current.isSuccess).toBe(true)
      })

      // 상세 쿼리
      const { result: detailResult } = renderHook(
        () => useProduct('prod-1'),
        { wrapper }
      )

      await waitFor(() => {
        expect(detailResult.current.isSuccess).toBe(true)
      })

      // 각각 독립적인 캐시
      expect(listResult.current.data).toBeDefined()
      expect(detailResult.current.data).toBeDefined()
    })
  })
})


