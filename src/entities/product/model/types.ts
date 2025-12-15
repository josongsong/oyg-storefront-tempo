/**
 * Product Domain Types
 * Branded types for type safety
 */

// Branded Types
export type ProductId = string & { readonly __brand: 'ProductId' }
export type Price = number & { readonly __brand: 'Price' }
export type Rating = number & { readonly __brand: 'Rating' }

// Smart Constructors
export const ProductId = {
  create: (id: string): ProductId => {
    if (!id || id.length === 0) {
      throw new Error('ProductId cannot be empty')
    }
    return id as ProductId
  },
  
  fromNumber: (id: number): ProductId => {
    return ProductId.create(String(id))
  },
  
  isValid: (id: string): boolean => {
    return id.length > 0
  },
}

export const Price = {
  create: (value: number): Price => {
    if (value < 0) {
      throw new Error('Price cannot be negative')
    }
    if (!Number.isFinite(value)) {
      throw new Error('Price must be a finite number')
    }
    return value as Price
  },
  
  fromString: (priceStr: string): Price => {
    const cleaned = priceStr.replace(/[^0-9.]/g, '')
    const value = parseFloat(cleaned)
    return Price.create(value)
  },
  
  format: (price: Price, locale = 'en-US', currency = 'USD'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(price)
  },
}

export const Rating = {
  create: (value: number): Rating => {
    if (value < 0 || value > 5) {
      throw new Error('Rating must be between 0 and 5')
    }
    return value as Rating
  },
  
  isHighlyRated: (rating: Rating, threshold: number = 4.5): boolean => {
    return rating >= threshold
  },
}

// Product Core Types
export interface Product {
  readonly id: ProductId
  readonly name: string
  readonly brand: string
  readonly price: Price
  readonly rating: Rating
  readonly reviewCount: number
  readonly image: string
  readonly badge?: ProductBadge
  readonly originalPrice?: Price
}

export type ProductBadge = 
  | 'BESTSELLER' 
  | 'NEW' 
  | 'LIMITED EDITION' 
  | 'SALE' 
  | 'COLLECTABLE'

// Product with computed properties
export interface ProductWithMetrics extends Product {
  readonly isHighlyRated: boolean
  readonly hasDiscount: boolean
  readonly discountPercentage?: number
  readonly formattedPrice: string
  readonly formattedOriginalPrice?: string
}

// Helper to create ProductWithMetrics
export const createProductWithMetrics = (product: Product): ProductWithMetrics => {
  const hasDiscount = product.originalPrice !== undefined
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : undefined

  return {
    ...product,
    isHighlyRated: Rating.isHighlyRated(product.rating) && product.reviewCount > 100,
    hasDiscount,
    discountPercentage,
    formattedPrice: Price.format(product.price),
    formattedOriginalPrice: product.originalPrice 
      ? Price.format(product.originalPrice)
      : undefined,
  }
}

// Product List Item (for list views)
export interface ProductListItem {
  readonly id: ProductId
  readonly name: string
  readonly brand: string
  readonly price: string
  readonly rating: Rating
  readonly reviewCount: number
  readonly image: string
  readonly badge?: ProductBadge
  readonly originalPrice?: string
}

// Conversion utilities
export const toProduct = (item: ProductListItem): Product => ({
  id: item.id,
  name: item.name,
  brand: item.brand,
  price: Price.fromString(item.price),
  rating: item.rating,
  reviewCount: item.reviewCount,
  image: item.image,
  badge: item.badge,
  originalPrice: item.originalPrice ? Price.fromString(item.originalPrice) : undefined,
})

export const toProductListItem = (product: Product): ProductListItem => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  price: Price.format(product.price),
  rating: product.rating,
  reviewCount: product.reviewCount,
  image: product.image,
  badge: product.badge,
  originalPrice: product.originalPrice ? Price.format(product.originalPrice) : undefined,
})

