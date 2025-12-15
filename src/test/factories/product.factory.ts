/**
 * Product Factory
 * 동적 상품 데이터 생성 - Mock/Stub 제거, 실제처럼
 */

import type { ProductId, Price, Rating } from '@/entities/product'
import type { GlossierProduct } from '@/shared/types/glossier'

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
  badge?: string
  originalPrice?: string
}

/**
 * 랜덤 브랜드 선택
 */
const BRANDS = ['GLOSSIER', 'LANEIGE', 'MECCA MAX', 'Laura Mercier', 'Estée Lauder']
function randomBrand(): string {
  return BRANDS[Math.floor(Math.random() * BRANDS.length)]
}

/**
 * 랜덤 가격 생성
 */
function randomPrice(): string {
  const price = Math.floor(Math.random() * 80) + 10 // $10 ~ $90
  return `$${price}.00`
}

/**
 * 랜덤 평점 생성 (4.0 ~ 5.0)
 */
function randomRating(): number {
  return Number((Math.random() * 1 + 4).toFixed(1)) // 4.0 ~ 5.0
}

/**
 * 랜덤 리뷰 개수
 */
function randomReviews(): number {
  return Math.floor(Math.random() * 1000) + 10
}

/**
 * Product 생성 팩토리 (개선됨)
 */
export const createProduct = (options: CreateProductOptions = {}) => {
  const id = options.id ?? `prod-factory-${productCounter++}`
  
  return {
    id: id as ProductId,
    name: options.name ?? `Product ${productCounter}`,
    brand: options.brand ?? randomBrand(),
    price: options.price ?? randomPrice(),
    rating: (options.rating ?? randomRating()) as Rating,
    reviewCount: options.reviewCount ?? randomReviews(),
    image: options.image ?? `/cosmetics/cosmetic${productCounter % 2 + 1}.png`,
    categories: options.categories ?? ['skincare'],
    tags: options.tags ?? { product_type: ['serum'] },
  }
}

/**
 * GlossierProduct 생성 (홈페이지용)
 */
export const createGlossierProduct = (options: CreateProductOptions = {}): GlossierProduct => {
  const id = options.id ? Number(options.id.replace(/\D/g, '')) : productCounter
  
  productCounter++
  
  return {
    id,
    brand: options.brand ?? randomBrand(),
    name: options.name ?? `Product ${id}`,
    price: options.price ?? randomPrice(),
    rating: options.rating ?? randomRating(),
    reviews: options.reviewCount ?? randomReviews(),
    badge: options.badge,
    originalPrice: options.originalPrice,
    image: options.image ?? `/cosmetics/cosmetic${id % 2 + 1}.png`,
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
