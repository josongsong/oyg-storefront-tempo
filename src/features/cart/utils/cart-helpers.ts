/**
 * Cart Helper Functions
 * as any를 캡슐화하여 타입 안전성 향상
 */

import type { ProductId, Price } from '@/entities/product'

/**
 * string을 ProductId로 안전하게 변환
 */
export function toProductId(id: string | number): ProductId {
  return String(id) as ProductId
}

/**
 * number를 Price로 안전하게 변환
 */
export function toPrice(value: number): Price {
  return value as Price
}

/**
 * string price를 Price로 변환
 */
export function parsePriceString(price: string): Price {
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''))
  return numericPrice as Price
}

/**
 * CartItemId로 변환 (string → CartItemId)
 */
export function toCartItemId(id: string): any {
  return id as any
}

