/**
 * Product API Queries
 * Using React Query v5 Query Factory Pattern
 */

import { queryOptions, useSuspenseQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import type { ProductId, Product } from '@/entities/product'
import { validateProduct, validateProductArray } from '@/entities/product'

// API client (placeholder - implement actual API calls)
const fetchProduct = async (id: ProductId): Promise<Product> => {
  const response = await fetch(`/api/products/${id}`)
  if (!response.ok) throw new Error('Failed to fetch product')
  const data = await response.json()
  return validateProduct(data)
}

const fetchProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams()
  if (filters?.category) params.append('category', filters.category)
  if (filters?.brand) params.append('brand', filters.brand)
  if (filters?.minPrice) params.append('minPrice', String(filters.minPrice))
  if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice))
  if (filters?.minRating) params.append('minRating', String(filters.minRating))
  if (filters?.search) params.append('search', filters.search)
  
  const response = await fetch(`/api/products?${params}`)
  if (!response.ok) throw new Error('Failed to fetch products')
  const data = await response.json()
  return validateProductArray(data)
}

const fetchProductReviews = async (id: ProductId) => {
  const response = await fetch(`/api/products/${id}/reviews`)
  if (!response.ok) throw new Error('Failed to fetch reviews')
  return response.json()
}

// Filters
export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  search?: string
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular'
  page?: number
  limit?: number
}

// Query Factory
export const productQueries = {
  all: ['products'] as const,
  
  lists: () => [...productQueries.all, 'list'] as const,
  list: (filters?: ProductFilters) =>
    queryOptions({
      queryKey: [...productQueries.lists(), filters] as const,
      queryFn: () => fetchProducts(filters),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }),
  
  details: () => [...productQueries.all, 'detail'] as const,
  detail: (id: ProductId) =>
    queryOptions({
      queryKey: [...productQueries.details(), id] as const,
      queryFn: () => fetchProduct(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    }),
  
  reviews: (id: ProductId) =>
    queryOptions({
      queryKey: [...productQueries.all, 'reviews', id] as const,
      queryFn: () => fetchProductReviews(id),
      staleTime: 5 * 60 * 1000,
    }),
}

// Hooks
export function useProduct(id: ProductId) {
  return useSuspenseQuery(productQueries.detail(id))
}

export function useProductOptional(id: ProductId | null) {
  return useQuery({
    ...productQueries.detail(id!),
    enabled: id !== null,
  })
}

export function useProducts(filters?: ProductFilters) {
  return useQuery(productQueries.list(filters))
}

export function useProductReviews(id: ProductId) {
  return useQuery(productQueries.reviews(id))
}

// Prefetch utilities
export function usePrefetchProduct() {
  const queryClient = useQueryClient()
  
  return useCallback(
    (id: ProductId) => {
      queryClient.prefetchQuery(productQueries.detail(id))
    },
    [queryClient]
  )
}

export function usePrefetchProducts() {
  const queryClient = useQueryClient()
  
  return useCallback(
    (filters?: ProductFilters) => {
      queryClient.prefetchQuery(productQueries.list(filters))
    },
    [queryClient]
  )
}

// Optimistic updates
export function useInvalidateProduct() {
  const queryClient = useQueryClient()
  
  return useCallback(
    (id: ProductId) => {
      queryClient.invalidateQueries({
        queryKey: productQueries.details(),
      })
      queryClient.invalidateQueries({
        queryKey: productQueries.detail(id).queryKey,
      })
    },
    [queryClient]
  )
}

export function useInvalidateProducts() {
  const queryClient = useQueryClient()
  
  return useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: productQueries.lists(),
    })
  }, [queryClient])
}

