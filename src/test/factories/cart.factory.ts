/**
 * Cart Factory
 * 동적 장바구니 데이터 생성
 */

import type { ProductId, Price } from '@/entities/product'
import { createProduct } from './product.factory'

let cartItemCounter = 1

export interface CreateCartItemOptions {
  id?: string
  productId?: ProductId
  name?: string
  price?: number
  quantity?: number
  image?: string
}

/**
 * CartItem 생성 팩토리
 */
export const createCartItem = (options: CreateCartItemOptions = {}) => {
  const product = createProduct({
    id: options.productId as string,
    name: options.name,
  })
  
  return {
    id: options.id ?? `cart-item-${cartItemCounter++}`,
    productId: product.id,
    name: product.name,
    price: (options.price ?? 19.99) as Price,
    quantity: options.quantity ?? 1,
    image: options.image ?? product.image,
  }
}

/**
 * 여러 CartItem 생성
 */
export const createCartItems = (count: number, options: CreateCartItemOptions = {}) => {
  return Array.from({ length: count }, () => createCartItem(options))
}

/**
 * 카운터 리셋
 */
export const resetCartItemCounter = () => {
  cartItemCounter = 1
}
