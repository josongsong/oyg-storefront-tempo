import type { BaseEntity } from '@/shared'
import type { Product, ProductVariant } from '@/features/product/types'

export interface CartItem extends BaseEntity {
  productId: string
  variantId?: string
  quantity: number
  product: Product
  variant?: ProductVariant
  price: number
  originalPrice?: number
  sku?: string
  shade?: string
  shadeOptions?: string[]
  isNew?: boolean
}

export interface Cart extends BaseEntity {
  userId?: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  promoCode?: string
  shippingCountry: string
  freeShippingThreshold: number
  remainingForFreeShipping: number
}

export interface AddToCartRequest {
  productId: string
  variantId?: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface PromoCode {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}
