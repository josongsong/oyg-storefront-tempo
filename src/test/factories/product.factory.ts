/**
 * Product Factory
 * 동적 상품 데이터 생성
 */

import type { ProductId, Price, Rating } from '@/entities/product'

let productCounter = 1

export interface CreateProductOptions {
  id?: string
  name?: string
  brand?: string
  price?: string
  rating?: number
  reviewCount?: number
  image?: string
  categories?: string[]
  tags?: Record<string, string[]>
}

/**
 * Product 생성 팩토리
 */
export const createProduct = (options: CreateProductOptions = {}) => {
  const id = options.id ?? `prod-factory-${productCounter++}`
  
  return {
    id: id as ProductId,
    name: options.name ?? `Test Product ${productCounter}`,
    brand: options.brand ?? 'Test Brand',
    price: options.price ?? '$19.99',
    rating: (options.rating ?? 4.5) as Rating,
    reviewCount: options.reviewCount ?? 100,
    image: options.image ?? `/test/product-${productCounter}.jpg`,
    categories: options.categories ?? ['skincare'],
    tags: options.tags ?? { product_type: ['serum'] },
  }
}

/**
 * 여러 Product 생성
 */
export const createProducts = (count: number, options: CreateProductOptions = {}) => {
  return Array.from({ length: count }, (_, i) =>
    createProduct({ ...options, name: `${options.name ?? 'Product'} ${i + 1}` })
  )
}

/**
 * 상세 Product 생성
 */
export const createProductDetail = (options: CreateProductOptions = {}) => {
  return {
    ...createProduct(options),
    description: 'Detailed product description for testing',
    ingredients: ['Water', 'Glycerin', 'Test Ingredient'],
    howToUse: 'Apply to clean skin',
  }
}

/**
 * 카운터 리셋 (테스트 격리용)
 */
export const resetProductCounter = () => {
  productCounter = 1
}
