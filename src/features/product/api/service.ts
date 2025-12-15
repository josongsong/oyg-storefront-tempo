/**
 * Product API Service
 * HTTP 요청을 담당하는 레이어
 */

import { apiClient } from '@/shared/api'
import type { Product, ProductListParams, ProductListResponse } from '../types'
import type { ReviewSubmitData } from '../types/product-data'

export const productApi = {
  /**
   * 상품 목록 조회
   */
  getList: async (params?: ProductListParams): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.brand) searchParams.set('brand', params.brand)
    if (params?.minPrice) searchParams.set('minPrice', String(params.minPrice))
    if (params?.maxPrice) searchParams.set('maxPrice', String(params.maxPrice))
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder)

    return apiClient.get('products', { searchParams }).json()
  },

  /**
   * 상품 상세 조회
   */
  getById: async (id: string): Promise<Product> => {
    return apiClient.get(`products/${id}`).json()
  },

  /**
   * 카테고리별 상품 조회
   */
  getByCategory: async (category: string): Promise<ProductListResponse> => {
    return apiClient.get(`products/category/${category}`).json()
  },

  /**
   * 상품 검색
   */
  search: async (query: string, params?: Omit<ProductListParams, 'search'>): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams({ search: query })
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.category) searchParams.set('category', params.category)

    return apiClient.get('products/search', { searchParams }).json()
  },

  /**
   * 리뷰 제출
   */
  submitReview: async (data: ReviewSubmitData): Promise<{ success: boolean; review_id: string }> => {
    const formData = new FormData()
    formData.append('product_id', data.product_id)
    formData.append('rating', String(data.rating))
    formData.append('headline', data.headline)
    formData.append('comments', data.comments)
    formData.append('recommend', String(data.recommend))
    formData.append('first_name', data.first_name)
    if (data.location) formData.append('location', data.location)
    formData.append('email', data.email)
    
    if (data.images) {
      data.images.forEach((image, index) => {
        formData.append(`image_${index}`, image)
      })
    }

    return apiClient.post('reviews', { body: formData }).json()
  },
}

// Backward compatibility
export const productService = productApi
