/**
 * Cart Domain Types
 */

import type { ProductId, Price } from '@/entities/product'

export type CartItemId = string & { readonly __brand: 'CartItemId' }

export const CartItemId = {
  create: (productId: ProductId, options?: CartItemOptions): CartItemId => {
    const optionKey = options 
      ? `${options.shade || ''}-${options.size || ''}`
      : ''
    return `${productId}-${optionKey}-${Date.now()}` as CartItemId
  },
}

export interface CartItemOptions {
  shade?: string
  size?: string
  sku?: string
}

export interface CartItem {
  readonly id: CartItemId
  readonly productId: ProductId
  readonly name: string
  readonly brand: string
  readonly image: string
  readonly price: Price
  readonly originalPrice?: Price
  quantity: number
  options?: CartItemOptions
  isNew?: boolean
}

export interface CartSummary {
  readonly itemCount: number
  readonly subtotal: Price
  readonly shipping: Price
  readonly tax: Price
  readonly total: Price
  readonly savings?: Price
}

export interface ShippingInfo {
  method: 'standard' | 'express' | 'overnight'
  cost: Price
  estimatedDays: number
}

export const SHIPPING_OPTIONS: Record<ShippingInfo['method'], Omit<ShippingInfo, 'method'>> = {
  standard: {
    cost: 0 as Price,
    estimatedDays: 5,
  },
  express: {
    cost: 9.99 as Price,
    estimatedDays: 2,
  },
  overnight: {
    cost: 19.99 as Price,
    estimatedDays: 1,
  },
}

export const TAX_RATE = 0.0875 // 8.75%
export const FREE_SHIPPING_THRESHOLD = 50 as Price

