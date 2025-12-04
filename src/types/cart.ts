import type { BaseEntity } from './index'
import type { Product, ProductVariant } from './product'

export interface CartItem extends BaseEntity {
  productId: string
  variantId?: string
  quantity: number
  product: Product
  variant?: ProductVariant
}

export interface Cart extends BaseEntity {
  userId?: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export interface AddToCartRequest {
  productId: string
  variantId?: string
  quantity: number
}

export interface UpdateCartItemRequest {
  quantity: number
}

