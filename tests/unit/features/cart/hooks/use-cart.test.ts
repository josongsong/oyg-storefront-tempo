/**
 * useCart Hooks Tests
 * React Query mutations + MSW 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  cartKeys,
} from '@/features/cart/hooks/use-cart'
import { resetMockCart } from '@/test/mocks/handlers'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useCart Hooks', () => {
  beforeEach(() => {
    resetMockCart()
  })

  describe('cartKeys', () => {
    it('should generate correct query keys', () => {
      expect(cartKeys.all).toEqual(['cart'])
      expect(cartKeys.detail()).toEqual(['cart', 'detail'])
    })
  })

  describe('useCart', () => {
    it('should fetch cart data', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(),
      })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data).toHaveProperty('items')
    })

    it('should return empty cart initially', async () => {
      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.items).toHaveLength(0)
    })

    it('should handle API error', async () => {
      server.use(
        http.get('*/cart', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const { result } = renderHook(() => useCart(), {
        wrapper: createWrapper(),
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
    })
  })

  describe('useAddToCart', () => {
    it('should add item to cart', async () => {
      const wrapper = createWrapper()

      const { result: cartResult } = renderHook(() => useCart(), { wrapper })
      const { result: mutationResult } = renderHook(() => useAddToCart(), { wrapper })

      await waitFor(() => {
        expect(cartResult.current.isSuccess).toBe(true)
      })

      // 아이템 추가
      await act(async () => {
        await mutationResult.current.mutateAsync({
          productId: 'prod-1',
          name: 'Test Product',
          price: 19.99,
          quantity: 1,
          image: '/test.jpg',
        })
      })

      expect(mutationResult.current.isSuccess).toBe(true)

      // 캐시 무효화로 인한 리페치 대기
      await waitFor(() => {
        expect(cartResult.current.data?.items.length).toBeGreaterThan(0)
      })
    })

    it('should handle multiple additions', async () => {
      const wrapper = createWrapper()

      const { result: cartResult } = renderHook(() => useCart(), { wrapper })
      const { result: mutationResult } = renderHook(() => useAddToCart(), { wrapper })

      await waitFor(() => {
        expect(cartResult.current.isSuccess).toBe(true)
      })

      // 여러 아이템 추가
      await act(async () => {
        await mutationResult.current.mutateAsync({
          productId: 'prod-1',
          name: 'Product 1',
          price: 10,
          quantity: 1,
          image: '/test1.jpg',
        })
      })

      await act(async () => {
        await mutationResult.current.mutateAsync({
          productId: 'prod-2',
          name: 'Product 2',
          price: 20,
          quantity: 1,
          image: '/test2.jpg',
        })
      })

      await waitFor(() => {
        expect(cartResult.current.data?.items.length).toBe(2)
      })
    })

    it('should handle validation error', async () => {
      server.use(
        http.post('*/cart/items', () => {
          return HttpResponse.json(
            { error: 'Invalid data' },
            { status: 400 }
          )
        })
      )

      const { result } = renderHook(() => useAddToCart(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        try {
          await result.current.mutateAsync({
            productId: '',
            name: '',
            price: -1,
            quantity: 0,
            image: '',
          })
        } catch (error) {
          expect(error).toBeDefined()
        }
      })

      expect(result.current.isError).toBe(true)
    })
  })

  describe('useUpdateCartItem', () => {
    it('should update cart item', async () => {
      const wrapper = createWrapper()

      const { result: addResult } = renderHook(() => useAddToCart(), { wrapper })
      const { result: updateResult } = renderHook(() => useUpdateCartItem(), { wrapper })

      // 먼저 아이템 추가
      let addedItem: any
      await act(async () => {
        addedItem = await addResult.current.mutateAsync({
          productId: 'prod-1',
          name: 'Test Product',
          price: 19.99,
          quantity: 1,
          image: '/test.jpg',
        })
      })

      // 수량 업데이트
      await act(async () => {
        await updateResult.current.mutateAsync({
          itemId: addedItem.id || 'mock-id',
          data: { quantity: 3 },
        })
      })

      expect(updateResult.current.isSuccess).toBe(true)
    })

    it('should handle not found error', async () => {
      server.use(
        http.patch('*/cart/items/:id', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      const { result } = renderHook(() => useUpdateCartItem(), {
        wrapper: createWrapper(),
      })

      await act(async () => {
        try {
          await result.current.mutateAsync({
            itemId: 'non-existent',
            data: { quantity: 2 },
          })
        } catch (error) {
          expect(error).toBeDefined()
        }
      })

      expect(result.current.isError).toBe(true)
    })
  })

  describe('useRemoveCartItem', () => {
    it('should remove item from cart', async () => {
      const wrapper = createWrapper()

      const { result: cartResult } = renderHook(() => useCart(), { wrapper })
      const { result: addResult } = renderHook(() => useAddToCart(), { wrapper })
      const { result: removeResult } = renderHook(() => useRemoveCartItem(), { wrapper })

      await waitFor(() => {
        expect(cartResult.current.isSuccess).toBe(true)
      })

      // 아이템 추가
      let addedItem: any
      await act(async () => {
        addedItem = await addResult.current.mutateAsync({
          productId: 'prod-1',
          name: 'Test Product',
          price: 19.99,
          quantity: 1,
          image: '/test.jpg',
        })
      })

      await waitFor(() => {
        expect(cartResult.current.data?.items.length).toBe(1)
      })

      // 아이템 제거
      await act(async () => {
        await removeResult.current.mutateAsync(addedItem.id || 'mock-id')
      })

      expect(removeResult.current.isSuccess).toBe(true)

      await waitFor(() => {
        expect(cartResult.current.data?.items.length).toBe(0)
      })
    })
  })

  describe('Cart flow integration', () => {
    it('should handle complete cart mutation flow', async () => {
      const wrapper = createWrapper()

      const { result: cartResult } = renderHook(() => useCart(), { wrapper })
      const { result: addResult } = renderHook(() => useAddToCart(), { wrapper })
      const { result: updateResult } = renderHook(() => useUpdateCartItem(), { wrapper })
      const { result: removeResult } = renderHook(() => useRemoveCartItem(), { wrapper })

      // 1. 초기 빈 카트
      await waitFor(() => {
        expect(cartResult.current.isSuccess).toBe(true)
      })
      expect(cartResult.current.data?.items).toHaveLength(0)

      // 2. 아이템 추가
      let item: any
      await act(async () => {
        item = await addResult.current.mutateAsync({
          productId: 'prod-1',
          name: 'Test Product',
          price: 19.99,
          quantity: 1,
          image: '/test.jpg',
        })
      })

      await waitFor(() => {
        expect(cartResult.current.data?.items.length).toBe(1)
      })

      // 3. 수량 업데이트
      await act(async () => {
        await updateResult.current.mutateAsync({
          itemId: item.id || 'mock-id',
          data: { quantity: 3 },
        })
      })

      expect(updateResult.current.isSuccess).toBe(true)

      // 4. 제거
      await act(async () => {
        await removeResult.current.mutateAsync(item.id || 'mock-id')
      })

      await waitFor(() => {
        expect(cartResult.current.data?.items.length).toBe(0)
      })
    })
  })
})


