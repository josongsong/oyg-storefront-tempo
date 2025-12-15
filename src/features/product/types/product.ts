import type { BaseEntity, PaginatedResponse } from '@/shared'

export interface Product extends BaseEntity {
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  brand: string
  stock: number
  rating: number
  reviewCount: number
  tags: string[]
  variants?: ProductVariant[]
  isActive: boolean
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
  sku: string
  options: Record<string, string>
}

export interface ProductListParams {
  page?: number
  limit?: number
  category?: string
  brand?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'rating' | 'newest' | 'bestseller'
  sortOrder?: 'asc' | 'desc'
}

export type ProductListResponse = PaginatedResponse<Product>

