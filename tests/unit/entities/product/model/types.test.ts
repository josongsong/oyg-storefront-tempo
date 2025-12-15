import { describe, it, expect } from 'vitest'
import { 
  ProductId, 
  Price, 
  Rating,
  createProductWithMetrics,
  toProduct,
  toProductListItem
} from '@/entities/product/model/types'
import type { Product, ProductListItem } from '@/entities/product/model/types'

describe('ProductId', () => {
  describe('create', () => {
    it('should create valid ProductId', () => {
      const id = ProductId.create('prod-123')
      expect(id).toBe('prod-123')
    })

    it('should throw on empty id', () => {
      expect(() => ProductId.create('')).toThrow('ProductId cannot be empty')
    })
  })

  describe('fromNumber', () => {
    it('should convert number to ProductId', () => {
      const id = ProductId.fromNumber(123)
      expect(id).toBe('123')
    })
  })

  describe('isValid', () => {
    it('should validate non-empty string', () => {
      expect(ProductId.isValid('prod-123')).toBe(true)
      expect(ProductId.isValid('')).toBe(false)
    })
  })
})

describe('Price', () => {
  describe('create', () => {
    it('should create valid price', () => {
      const price = Price.create(19.99)
      expect(price).toBe(19.99)
    })

    it('should accept zero', () => {
      const price = Price.create(0)
      expect(price).toBe(0)
    })

    it('should reject negative prices', () => {
      expect(() => Price.create(-10)).toThrow('Price cannot be negative')
    })

    it('should reject non-finite values', () => {
      expect(() => Price.create(Infinity)).toThrow('Price must be a finite number')
      expect(() => Price.create(NaN)).toThrow('Price must be a finite number')
    })
  })

  describe('fromString', () => {
    it('should parse price string with dollar sign', () => {
      const price = Price.fromString('$19.99')
      expect(price).toBe(19.99)
    })

    it('should parse price string without dollar sign', () => {
      const price = Price.fromString('19.99')
      expect(price).toBe(19.99)
    })

    it('should handle complex currency format', () => {
      const price = Price.fromString('$1,299.99')
      expect(price).toBe(1299.99)
    })
  })

  describe('format', () => {
    it('should format price in USD', () => {
      const price = Price.create(19.99)
      expect(Price.format(price)).toBe('$19.99')
    })

    it('should format price in different currency', () => {
      const price = Price.create(19.99)
      const formatted = Price.format(price, 'ko-KR', 'KRW')
      expect(formatted).toContain('20')
    })
  })
})

describe('Rating', () => {
  describe('create', () => {
    it('should create valid rating', () => {
      const rating = Rating.create(4.5)
      expect(rating).toBe(4.5)
    })

    it('should accept 0', () => {
      const rating = Rating.create(0)
      expect(rating).toBe(0)
    })

    it('should accept 5', () => {
      const rating = Rating.create(5)
      expect(rating).toBe(5)
    })

    it('should reject rating < 0', () => {
      expect(() => Rating.create(-1)).toThrow('Rating must be between 0 and 5')
    })

    it('should reject rating > 5', () => {
      expect(() => Rating.create(5.5)).toThrow('Rating must be between 0 and 5')
    })
  })

  describe('isHighlyRated', () => {
    it('should return true for rating >= 4.5', () => {
      const rating = Rating.create(4.5)
      expect(Rating.isHighlyRated(rating)).toBe(true)
    })

    it('should return false for rating < 4.5', () => {
      const rating = Rating.create(4.0)
      expect(Rating.isHighlyRated(rating)).toBe(false)
    })

    it('should use custom threshold', () => {
      const rating = Rating.create(4.0)
      expect(Rating.isHighlyRated(rating, 4.0)).toBe(true)
      expect(Rating.isHighlyRated(rating, 4.1)).toBe(false)
    })
  })
})

describe('createProductWithMetrics', () => {
  const baseProduct: Product = {
    id: ProductId.create('prod-1'),
    name: 'Test Product',
    brand: 'Test Brand',
    price: Price.create(20),
    rating: Rating.create(4.8),
    reviewCount: 150,
    image: '/test.jpg',
  }

  it('should calculate isHighlyRated correctly', () => {
    const product = createProductWithMetrics(baseProduct)
    expect(product.isHighlyRated).toBe(true) // rating 4.8 >= 4.5 && reviewCount 150 > 100
  })

  it('should not be highly rated with low review count', () => {
    const product = createProductWithMetrics({
      ...baseProduct,
      reviewCount: 50,
    })
    expect(product.isHighlyRated).toBe(false)
  })

  it('should calculate discount correctly', () => {
    const product = createProductWithMetrics({
      ...baseProduct,
      originalPrice: Price.create(30),
    })
    expect(product.hasDiscount).toBe(true)
    expect(product.discountPercentage).toBe(33) // (30-20)/30 = 0.33
  })

  it('should format prices', () => {
    const product = createProductWithMetrics(baseProduct)
    expect(product.formattedPrice).toBe('$20.00')
  })
})

describe('Conversion utilities', () => {
  const productListItem: ProductListItem = {
    id: ProductId.create('prod-1'),
    name: 'Test Product',
    brand: 'Test Brand',
    price: '$19.99',
    rating: Rating.create(4.5),
    reviewCount: 100,
    image: '/test.jpg',
  }

  describe('toProduct', () => {
    it('should convert ProductListItem to Product', () => {
      const product = toProduct(productListItem)
      expect(product.id).toBe('prod-1')
      expect(product.price).toBe(19.99)
    })
  })

  describe('toProductListItem', () => {
    it('should convert Product to ProductListItem', () => {
      const product: Product = {
        id: ProductId.create('prod-1'),
        name: 'Test Product',
        brand: 'Test Brand',
        price: Price.create(19.99),
        rating: Rating.create(4.5),
        reviewCount: 100,
        image: '/test.jpg',
      }
      
      const listItem = toProductListItem(product)
      expect(listItem.price).toBe('$19.99')
    })
  })
})
