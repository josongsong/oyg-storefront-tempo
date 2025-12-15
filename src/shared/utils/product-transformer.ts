/**
 * Product Transformer Utility
 * 중복된 toGlossierProduct 로직 통합
 */

import type { GlossierProduct } from '@/shared/types/glossier'
import type { ProductListItem } from '@/features/product/types'

/**
 * ProductListItem → GlossierProduct 변환
 * 
 * 사용처:
 * - product-list-page.tsx
 * - search-overlay.tsx
 * - 기타 상품 목록 표시
 */
export function toGlossierProduct(item: ProductListItem): GlossierProduct {
  // ID 추출 (숫자만)
  const numericId = Number(item.id.replace(/\D/g, '')) || 0

  return {
    id: numericId,
    brand: item.brand || 'Unknown',
    name: item.name,
    price: item.price,
    rating: item.rating,
    reviews: item.reviewCount || 0,
    badge: item.badge,
    image: item.image,
  }
}

/**
 * 여러 ProductListItem을 GlossierProduct로 변환
 */
export function toGlossierProducts(items: ProductListItem[]): GlossierProduct[] {
  return items.map(toGlossierProduct)
}

/**
 * 배열 랜덤 섞기 (Fisher-Yates shuffle)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 랜덤 상품 선택
 */
export function getRandomProducts<T>(products: T[], count: number): T[] {
  const shuffled = shuffleArray(products)
  return shuffled.slice(0, count)
}

