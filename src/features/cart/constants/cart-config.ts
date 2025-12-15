/**
 * Cart Configuration Constants
 * 매직 넘버 제거 및 중앙 관리
 */

import type { Price } from '@/entities/product'

/**
 * 배송 관련 상수
 */
export const SHIPPING_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 60 as Price,
  STANDARD_SHIPPING_COST: 10 as Price,
  EXPRESS_SHIPPING_COST: 9.99 as Price,
  SAME_DAY_SHIPPING_COST: 14.99 as Price,
} as const

/**
 * 세금 관련 상수
 */
export const TAX_CONFIG = {
  GST_RATE: 0.07, // 7% GST
  PST_RATE: 0.0,  // 지역별로 다를 수 있음
} as const

/**
 * 장바구니 제한 상수
 */
export const CART_LIMITS = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 99,
  MAX_ITEMS: 50,
} as const

/**
 * 기본 평점/리뷰 (fallback)
 */
export const DEFAULT_PRODUCT_META = {
  RATING: 4.5,
  REVIEWS: 100,
} as const

/**
 * 추천 상품 개수
 */
export const RECOMMENDATION_CONFIG = {
  SIMILAR_ITEMS_COUNT: 6,
  YOU_MAY_LIKE_COUNT: 12,
  RECENTLY_VIEWED_COUNT: 8,
} as const

