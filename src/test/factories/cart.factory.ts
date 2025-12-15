/**
 * Cart Factory
 * 동적 장바구니 데이터 생성 - 하드코딩 제거
 */

import type { ProductId, Price } from '@/entities/product'

let itemCounter = 1

export interface CreateCartItemOptions {
  id?: string
  productId?: string
  name?: string
  brand?: string
  price?: number
  quantity?: number
  sku?: string
  shade?: string
  image?: string
}

/**
 * 랜덤 SKU 생성
 */
function generateSKU(): string {
  return `I-${String(Math.floor(Math.random() * 900000) + 100000)}`
}

/**
 * 랜덤 가격 생성 (10 ~ 100)
 */
function randomPrice(): number {
  return Math.floor(Math.random() * 90) + 10
}

/**
 * 랜덤 브랜드 선택
 */
const BRANDS = ['MECCA MAX', 'GLOSSIER', 'LANEIGE', 'Laura Mercier', 'Estée Lauder']
function randomBrand(): string {
  return BRANDS[Math.floor(Math.random() * BRANDS.length)]
}

/**
 * CartItem 생성 팩토리
 */
export const createCartItem = (options: CreateCartItemOptions = {}) => {
  const id = options.id ?? `cart-${itemCounter}`
  const productId = options.productId ?? `prod-${itemCounter}`
  
  itemCounter++

  return {
    id,
    productId: productId as ProductId,
    quantity: options.quantity ?? 1,
    price: options.price ?? randomPrice(),
    sku: options.sku ?? generateSKU(),
    shade: options.shade,
    product: {
      id: productId,
      name: options.name ?? `Product ${itemCounter}`,
      brand: options.brand ?? randomBrand(),
      image: options.image ?? `/cosmetics/cosmetic${itemCounter % 2 + 1}.png`,
    },
  }
}

/**
 * 여러 CartItem 생성
 */
export const createCartItems = (count: number, options: CreateCartItemOptions = {}) => {
  return Array.from({ length: count }, () => createCartItem(options))
}

/**
 * Cart Summary 생성
 */
export const createCartSummary = (items: ReturnType<typeof createCartItem>[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const freeShippingThreshold = 60
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const shipping = subtotal >= freeShippingThreshold ? 0 : 10
  const shippingDiscount = subtotal >= freeShippingThreshold ? 10 : 0
  const gst = subtotal * 0.07 // 7% 세금
  const total = subtotal + shipping - shippingDiscount + gst

  return {
    subtotal,
    shipping,
    shippingDiscount,
    gst: Number(gst.toFixed(2)),
    total: Number(total.toFixed(2)),
    shippingCountry: 'Australia',
    freeShippingThreshold,
    remainingForFreeShipping,
  }
}

/**
 * 전체 Cart 데이터 생성
 */
export const createCart = (itemCount: number = 3) => {
  const items = createCartItems(itemCount)
  const summary = createCartSummary(items)

  return {
    items,
    savedItems: [],
    ...summary,
  }
}

/**
 * Wishlist Item 생성
 */
export const createWishlistItem = (options: CreateCartItemOptions = {}) => {
  const id = options.id ?? `w-${itemCounter++}`
  
  return {
    id,
    brand: options.brand ?? randomBrand(),
    name: options.name ?? `Wishlist Product ${itemCounter}`,
    price: options.price ?? randomPrice(),
    rating: Math.random() * 2 + 3, // 3.0 ~ 5.0
    reviews: Math.floor(Math.random() * 500),
    image: options.image ?? `/cosmetics/cosmetic${itemCounter % 2 + 1}.png`,
  }
}

/**
 * 여러 Wishlist Item 생성
 */
export const createWishlistItems = (count: number) => {
  return Array.from({ length: count }, () => createWishlistItem())
}

/**
 * 카운터 리셋 (테스트 격리용)
 */
export const resetCartCounter = () => {
  itemCounter = 1
}
