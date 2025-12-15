/**
 * Product API Service Tests
 * MSW를 사용한 API 레이어 유닛 테스트
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { productApi } from '@/features/product/api/service'
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } from '@/test/fixtures'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

describe('productApi', () => {
  describe('getList', () => {
    it('should fetch product list', async () => {
      const result = await productApi.getList()
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should fetch products with pagination', async () => {
      const result = await productApi.getList({ page: 1, limit: 10 })
      
      expect(result).toBeDefined()
    })

    it('should fetch products with category filter', async () => {
      const result = await productApi.getList({ category: 'skincare' })
      
      expect(result).toBeDefined()
    })

    it('should fetch products with search query', async () => {
      const result = await productApi.getList({ search: 'serum' })
      
      expect(result).toBeDefined()
    })

    it('should fetch products with price range', async () => {
      const result = await productApi.getList({ 
        minPrice: 10, 
        maxPrice: 50 
      })
      
      expect(result).toBeDefined()
    })

    it('should fetch products with sorting', async () => {
      const result = await productApi.getList({ 
        sortBy: 'price', 
        sortOrder: 'asc' 
      })
      
      expect(result).toBeDefined()
    })

    it('should handle API error', async () => {
      server.use(
        http.get('*/products', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(productApi.getList()).rejects.toThrow()
    })
  })

  describe('getById', () => {
    it('should fetch product by id', async () => {
      const result = await productApi.getById('prod-detail-1')
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('price')
    })

    it('should handle not found error', async () => {
      server.use(
        http.get('*/products/:id', () => {
          return new HttpResponse(null, { status: 404 })
        })
      )

      await expect(productApi.getById('non-existent')).rejects.toThrow()
    })
  })

  describe('getByCategory', () => {
    it('should fetch products by category', async () => {
      const result = await productApi.getByCategory('skincare')
      
      expect(result).toBeDefined()
    })
  })

  describe('search', () => {
    it('should search products by query', async () => {
      const result = await productApi.search('glossier')
      
      expect(result).toBeDefined()
    })

    it('should search with pagination', async () => {
      const result = await productApi.search('serum', { 
        page: 1, 
        limit: 10 
      })
      
      expect(result).toBeDefined()
    })
  })

  describe('submitReview', () => {
    it('should submit review successfully', async () => {
      server.use(
        http.post('*/reviews', () => {
          return HttpResponse.json({ 
            success: true, 
            review_id: 'review-123' 
          })
        })
      )

      const reviewData = {
        product_id: 'prod-1',
        rating: 5,
        headline: 'Great product!',
        comments: 'Love it!',
        recommend: true,
        first_name: 'John',
        email: 'john@example.com',
      }

      const result = await productApi.submitReview(reviewData)
      
      expect(result.success).toBe(true)
      expect(result.review_id).toBe('review-123')
    })

    it('should submit review with images', async () => {
      server.use(
        http.post('*/reviews', () => {
          return HttpResponse.json({ 
            success: true, 
            review_id: 'review-456' 
          })
        })
      )

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      const reviewData = {
        product_id: 'prod-1',
        rating: 4,
        headline: 'Good',
        comments: 'Nice',
        recommend: true,
        first_name: 'Jane',
        email: 'jane@example.com',
        images: [mockFile],
      }

      const result = await productApi.submitReview(reviewData)
      
      expect(result.success).toBe(true)
    })

    it('should handle validation error', async () => {
      server.use(
        http.post('*/reviews', () => {
          return HttpResponse.json(
            { error: 'Invalid data' },
            { status: 400 }
          )
        })
      )

      const invalidData = {
        product_id: '',
        rating: 0,
        headline: '',
        comments: '',
        recommend: true,
        first_name: '',
        email: 'invalid-email',
      }

      await expect(productApi.submitReview(invalidData)).rejects.toThrow()
    })
  })
})


