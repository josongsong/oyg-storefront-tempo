import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  searchProducts,
  filterByCategory,
  filterByBrand,
  sortProducts,
  getTrendingProducts,
  getRecommendedProducts,
} from '@/features/product/utils/product-loader'
import type { ProductListItem } from '@/features/product/types'

const mockProducts: ProductListItem[] = [
  {
    id: 'prod-1',
    name: 'Cloud Paint',
    brand: 'Glossier',
    price: '$18.00',
    rating: 4.8,
    reviewCount: 1234,
    image: '/images/cloud-paint.jpg',
    categories: ['makeup', 'blush'],
    tags: {
      product_type: ['blush'],
      special_features: ['vegan'],
    },
  },
  {
    id: 'prod-2',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    price: '$6.00',
    rating: 4.9,
    reviewCount: 5678,
    image: '/images/niacinamide.jpg',
    categories: ['skincare', 'serum'],
    tags: {
      product_type: ['serum'],
    },
  },
  {
    id: 'prod-3',
    name: 'Boy Brow',
    brand: 'Glossier',
    price: '$16.00',
    rating: 4.7,
    reviewCount: 890,
    image: '/images/boy-brow.jpg',
    categories: ['makeup', 'eyebrow'],
    tags: {
      product_type: ['brow gel'],
    },
  },
  {
    id: 'prod-4',
    name: 'Hyaluronic Acid 2% + B5',
    brand: 'The Ordinary',
    price: '$7.90',
    rating: 4.6,
    reviewCount: 3456,
    image: '/images/hyaluronic.jpg',
    categories: ['skincare', 'moisturizer'],
    tags: {
      product_type: ['serum'],
      special_features: ['hydrating'],
    },
  },
]

describe('searchProducts', () => {
  it('should find products by name', () => {
    const result = searchProducts(mockProducts, 'cloud')
    expect(result).toHaveLength(1)
    expect(result[0].name).toContain('Cloud')
  })

  it('should search case-insensitive', () => {
    const result = searchProducts(mockProducts, 'GLOSSIER')
    expect(result).toHaveLength(2)
  })

  it('should find by brand', () => {
    const result = searchProducts(mockProducts, 'ordinary')
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.brand === 'The Ordinary')).toBe(true)
  })

  it('should find by category', () => {
    const result = searchProducts(mockProducts, 'serum')
    expect(result.length).toBeGreaterThan(0)
  })

  it('should find by product type tag', () => {
    const result = searchProducts(mockProducts, 'blush')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('prod-1')
  })

  it('should find by special features tag', () => {
    const result = searchProducts(mockProducts, 'vegan')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('prod-1')
  })

  it('should return all products if query is empty', () => {
    const result = searchProducts(mockProducts, '')
    expect(result).toHaveLength(4)
  })

  it('should return empty array if no matches', () => {
    const result = searchProducts(mockProducts, 'nonexistent')
    expect(result).toHaveLength(0)
  })
})

describe('filterByCategory', () => {
  it('should filter by exact category', () => {
    const result = filterByCategory(mockProducts, 'makeup')
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.categories.includes('makeup'))).toBe(true)
  })

  it('should filter by partial category match', () => {
    const result = filterByCategory(mockProducts, 'skin')
    expect(result).toHaveLength(2)
  })

  it('should be case-insensitive', () => {
    const result = filterByCategory(mockProducts, 'MAKEUP')
    expect(result).toHaveLength(2)
  })

  it('should return all products if category is empty', () => {
    const result = filterByCategory(mockProducts, '')
    expect(result).toHaveLength(4)
  })
})

describe('filterByBrand', () => {
  it('should filter by exact brand', () => {
    const result = filterByBrand(mockProducts, 'Glossier')
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.brand === 'Glossier')).toBe(true)
  })

  it('should be case-insensitive', () => {
    const result = filterByBrand(mockProducts, 'glossier')
    expect(result).toHaveLength(2)
  })

  it('should return all products if brand is empty', () => {
    const result = filterByBrand(mockProducts, '')
    expect(result).toHaveLength(4)
  })

  it('should return empty if brand not found', () => {
    const result = filterByBrand(mockProducts, 'NonExistentBrand')
    expect(result).toHaveLength(0)
  })
})

describe('sortProducts', () => {
  it('should sort by best-sellers (reviewCount * rating)', () => {
    const result = sortProducts(mockProducts, 'best-sellers')
    expect(result[0].id).toBe('prod-2') // 5678 * 4.9 = highest
    expect(result[result.length - 1].id).toBe('prod-3') // 890 * 4.7 = lowest
  })

  it('should sort by top-rated', () => {
    const result = sortProducts(mockProducts, 'top-rated')
    expect(result[0].rating).toBe(4.9)
    expect(result[result.length - 1].rating).toBe(4.6)
  })

  it('should sort by name a-z', () => {
    const result = sortProducts(mockProducts, 'a-z')
    expect(result[0].name).toBe('Boy Brow')
    expect(result[result.length - 1].name).toBe('Niacinamide 10% + Zinc 1%')
  })

  it('should sort by name z-a', () => {
    const result = sortProducts(mockProducts, 'z-a')
    expect(result[0].name).toBe('Niacinamide 10% + Zinc 1%')
    expect(result[result.length - 1].name).toBe('Boy Brow')
  })

  it('should sort by price low to high', () => {
    const result = sortProducts(mockProducts, 'price-low')
    expect(result[0].price).toBe('$6.00')
    expect(result[result.length - 1].price).toBe('$18.00')
  })

  it('should sort by price high to low', () => {
    const result = sortProducts(mockProducts, 'price-high')
    expect(result[0].price).toBe('$18.00')
    expect(result[result.length - 1].price).toBe('$6.00')
  })

  it('should reverse order for whats-new', () => {
    const result = sortProducts(mockProducts, 'whats-new')
    expect(result[0].id).toBe('prod-4')
    expect(result[result.length - 1].id).toBe('prod-1')
  })

  it('should not mutate original array', () => {
    const original = [...mockProducts]
    sortProducts(mockProducts, 'price-low')
    expect(mockProducts).toEqual(original)
  })
})

describe('getTrendingProducts', () => {
  it('should return top products by best-sellers algorithm', () => {
    const result = getTrendingProducts(mockProducts, 2)
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('prod-2')
  })

  it('should default to 10 items if limit not specified', () => {
    const result = getTrendingProducts(mockProducts)
    expect(result.length).toBeLessThanOrEqual(10)
  })

  it('should limit results correctly', () => {
    const result = getTrendingProducts(mockProducts, 1)
    expect(result).toHaveLength(1)
  })
})

describe('getRecommendedProducts', () => {
  const currentProduct = mockProducts[0] // Glossier Cloud Paint (makeup, blush)

  it('should return products with common categories', () => {
    const result = getRecommendedProducts(mockProducts, currentProduct, 12)
    
    // Should not include current product
    expect(result.every((p) => p.id !== currentProduct.id)).toBe(true)
    
    // Should include products with common categories
    const hasMakeup = result.some((p) => p.categories.includes('makeup'))
    expect(hasMakeup).toBe(true)
  })

  it('should exclude current product', () => {
    const result = getRecommendedProducts(mockProducts, currentProduct, 12)
    expect(result.find((p) => p.id === currentProduct.id)).toBeUndefined()
  })

  it('should limit results', () => {
    const result = getRecommendedProducts(mockProducts, currentProduct, 1)
    expect(result).toHaveLength(1)
  })

  it('should sort by best-sellers algorithm', () => {
    const result = getRecommendedProducts(mockProducts, currentProduct, 12)
    
    // Check if sorted by reviewCount * rating
    for (let i = 0; i < result.length - 1; i++) {
      const scoreA = result[i].reviewCount * result[i].rating
      const scoreB = result[i + 1].reviewCount * result[i + 1].rating
      expect(scoreA).toBeGreaterThanOrEqual(scoreB)
    }
  })

  it('should return empty if no similar products', () => {
    const uniqueProduct: ProductListItem = {
      id: 'prod-unique',
      name: 'Unique Product',
      brand: 'Unique Brand',
      price: '$10.00',
      rating: 4.5,
      reviewCount: 100,
      image: '/unique.jpg',
      categories: ['unique-category'],
      tags: {},
    }
    
    const result = getRecommendedProducts(mockProducts, uniqueProduct, 12)
    expect(result).toHaveLength(0)
  })
})
