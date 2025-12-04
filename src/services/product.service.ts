import { api } from './api'

import type { Product, ProductListParams, ProductListResponse } from '@/types/product'

export const productService = {
  getList: async (params?: ProductListParams): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', String(params.page))
    if (params?.limit) searchParams.set('limit', String(params.limit))
    if (params?.category) searchParams.set('category', params.category)
    if (params?.search) searchParams.set('search', params.search)

    return api.get('products', { searchParams }).json()
  },

  getById: async (id: string): Promise<Product> => {
    return api.get(`products/${id}`).json()
  },

  getByCategory: async (category: string): Promise<ProductListResponse> => {
    return api.get(`products/category/${category}`).json()
  },
}

