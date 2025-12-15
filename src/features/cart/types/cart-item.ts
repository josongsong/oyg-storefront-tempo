/**
 * Cart Item Types
 * 타입 안전성 강화
 */

import type { ProductId, Price } from '@/entities/product'

/**
 * CartItemId - Branded Type
 */
export type CartItemId = string & { readonly __brand: 'CartItemId' }

/**
 * CartItem 옵션 (색상, 사이즈 등)
 */
export interface CartItemOptions {
  shade?: string
  size?: string
  [key: string]: string | undefined
}

/**
 * CartItem 인터페이스
 */
export interface CartItem {
  id: CartItemId
  productId: ProductId
  name: string
  brand: string
  price: Price
  originalPrice?: Price
  quantity: number
  image: string
  sku?: string
  options?: CartItemOptions
}

/**
 * CartItem 생성 헬퍼
 */
export function createCartItemId(id: string): CartItemId {
  return id as CartItemId
}

/**
 * Type Guard
 */
export function isValidCartItem(item: unknown): item is CartItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.productId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.brand === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number' &&
    typeof item.image === 'string'
  )
}

