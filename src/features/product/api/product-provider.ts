/**
 * Product Data Provider
 * Mock/Real API를 환경변수로 전환
 */

import type { GlossierProduct } from '@/shared/types/glossier'
import { createGlossierProduct, createProducts as createProductsFactory } from '@/test/factories'

/**
 * 개발 모드인지 확인
 */
const isDevelopment = import.meta.env.DEV

/**
 * Mock 상품 데이터 생성 (개발용)
 */
function generateMockProducts(count: number = 8): GlossierProduct[] {
  return Array.from({ length: count }, (_, i) => 
    createGlossierProduct({
      id: String(i + 1),
      name: [
        'Milky Jelly Cleanser',
        'Water Sleeping Mask',
        'Super Pure Serum',
        'Hydrating Face Mist',
        'Daily Moisturizer',
        'Eye Cream',
        'Face Oil',
        'Night Repair',
      ][i] ?? `Product ${i + 1}`,
      brand: ['GLOSSIER', 'LANEIGE', 'MECCA MAX'][i % 3],
      badge: i % 3 === 0 ? 'BESTSELLER' : i % 4 === 0 ? 'NEW' : undefined,
    })
  )
}

/**
 * 실제 API에서 상품 가져오기 (프로덕션용)
 */
async function fetchRealProducts(): Promise<GlossierProduct[]> {
  try {
    // 실제 API 엔드포인트 호출
    const response = await fetch('/cosmetics/data/products-index.json')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to load real products, falling back to mock:', error)
    return generateMockProducts()
  }
}

/**
 * 상품 데이터 가져오기 (환경에 따라 자동 선택)
 */
export async function getProducts(): Promise<GlossierProduct[]> {
  if (isDevelopment) {
    // 개발 모드: 빠른 Mock 데이터
    return generateMockProducts(20)
  } else {
    // 프로덕션: 실제 API
    return fetchRealProducts()
  }
}

/**
 * 특정 상품 검색
 */
export async function searchProducts(query: string): Promise<GlossierProduct[]> {
  const products = await getProducts()
  
  if (!query) return products
  
  const lowerQuery = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery)
  )
}

/**
 * 카테고리별 필터링
 */
export async function getProductsByCategory(category: string): Promise<GlossierProduct[]> {
  const products = await getProducts()
  // 실제 카테고리 필드가 있다면 필터링
  return products
}

