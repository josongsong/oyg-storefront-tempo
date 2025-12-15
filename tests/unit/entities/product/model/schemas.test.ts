import { describe, it, expect } from 'vitest'
import {
  ProductIdSchema,
  PriceSchema,
  PriceStringSchema,
  RatingSchema,
  ProductBadgeSchema,
  ProductSchema,
  ProductListItemSchema,
  validateProduct,
  safeValidateProduct,
} from '@/entities/product/model/schemas'

describe('ProductIdSchema', () => {
  it('should validate and transform valid id', () => {
    const result = ProductIdSchema.safeParse('prod-123')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe('prod-123')
    }
  })

  it('should reject empty id', () => {
    const result = ProductIdSchema.safeParse('')
    expect(result.success).toBe(false)
  })
})

describe('PriceSchema', () => {
  it('should validate positive price', () => {
    const result = PriceSchema.safeParse(19.99)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe(19.99)
    }
  })

  it('should validate zero', () => {
    const result = PriceSchema.safeParse(0)
    expect(result.success).toBe(true)
  })

  it('should reject negative price', () => {
    const result = PriceSchema.safeParse(-10)
    expect(result.success).toBe(false)
  })

  it('should reject non-finite price', () => {
    expect(PriceSchema.safeParse(Infinity).success).toBe(false)
    expect(PriceSchema.safeParse(NaN).success).toBe(false)
  })
})

describe('PriceStringSchema', () => {
  it('should parse price string with dollar sign', () => {
    const result = PriceStringSchema.safeParse('$19.99')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe(19.99)
    }
  })

  it('should parse price string without dollar sign', () => {
    const result = PriceStringSchema.safeParse('19.99')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe(19.99)
    }
  })
})

describe('RatingSchema', () => {
  it('should validate rating in range', () => {
    expect(RatingSchema.safeParse(0).success).toBe(true)
    expect(RatingSchema.safeParse(2.5).success).toBe(true)
    expect(RatingSchema.safeParse(5).success).toBe(true)
  })

  it('should reject rating out of range', () => {
    expect(RatingSchema.safeParse(-1).success).toBe(false)
    expect(RatingSchema.safeParse(5.5).success).toBe(false)
  })
})

describe('ProductBadgeSchema', () => {
  it('should validate valid badges', () => {
    const validBadges = ['BESTSELLER', 'NEW', 'LIMITED EDITION', 'SALE', 'COLLECTABLE']
    
    validBadges.forEach((badge) => {
      const result = ProductBadgeSchema.safeParse(badge)
      expect(result.success).toBe(true)
    })
  })

  it('should reject invalid badge', () => {
    const result = ProductBadgeSchema.safeParse('INVALID')
    expect(result.success).toBe(false)
  })
})

describe('ProductSchema', () => {
  const validProduct = {
    id: 'prod-123',
    name: 'Test Product',
    brand: 'Test Brand',
    price: 19.99,
    rating: 4.5,
    reviewCount: 100,
    image: '/test.jpg',
  }

  it('should validate correct product', () => {
    const result = ProductSchema.safeParse(validProduct)
    expect(result.success).toBe(true)
  })

  it('should accept number id', () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      id: 123,
    })
    expect(result.success).toBe(true)
  })

  it('should accept price as string', () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      price: '$19.99',
    })
    expect(result.success).toBe(true)
  })

  it('should validate optional fields', () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      badge: 'NEW',
      originalPrice: 29.99,
    })
    expect(result.success).toBe(true)
  })

  it('should reject missing required fields', () => {
    const { name, ...invalid } = validProduct
    const result = ProductSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })

  it('should reject invalid price', () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      price: -10,
    })
    expect(result.success).toBe(false)
  })

  it('should reject invalid rating', () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      rating: 5.5,
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative review count', () => {
    const result = ProductSchema.safeParse({
      ...validProduct,
      reviewCount: -10,
    })
    expect(result.success).toBe(false)
  })
})

describe('ProductListItemSchema', () => {
  const validListItem = {
    id: 'prod-123',
    name: 'Test Product',
    brand: 'Test Brand',
    price: '$19.99',
    rating: 4.5,
    reviewCount: 100,
    image: '/test.jpg',
  }

  it('should validate correct list item', () => {
    const result = ProductListItemSchema.safeParse(validListItem)
    expect(result.success).toBe(true)
  })

  it('should validate with optional fields', () => {
    const result = ProductListItemSchema.safeParse({
      ...validListItem,
      badge: 'BESTSELLER',
      originalPrice: '$29.99',
    })
    expect(result.success).toBe(true)
  })

  it('should reject missing required fields', () => {
    const { price, ...invalid } = validListItem
    const result = ProductListItemSchema.safeParse(invalid)
    expect(result.success).toBe(false)
  })
})

describe('Validation helpers', () => {
  const validProduct = {
    id: 'prod-123',
    name: 'Test Product',
    brand: 'Test Brand',
    price: 19.99,
    rating: 4.5,
    reviewCount: 100,
    image: '/test.jpg',
  }

  describe('validateProduct', () => {
    it('should return validated product', () => {
      const product = validateProduct(validProduct)
      expect(product.id).toBe('prod-123')
      expect(product.price).toBe(19.99)
    })

    it('should throw on invalid data', () => {
      expect(() => validateProduct({ ...validProduct, price: -10 })).toThrow()
    })
  })

  describe('safeValidateProduct', () => {
    it('should return success result', () => {
      const result = safeValidateProduct(validProduct)
      expect(result.success).toBe(true)
    })

    it('should return error result without throwing', () => {
      const result = safeValidateProduct({ ...validProduct, price: -10 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeDefined()
      }
    })
  })
})
