/**
 * Test Data Factories
 * Mock data generators for testing
 */

import type { ProductId, Price, Rating } from '@/entities/product'

export function createMockProductId(id: string = 'test-product-123'): ProductId {
  return id as ProductId
}

export function createMockPrice(value: number = 19.99): Price {
  return value as Price
}

export function createMockRating(value: number = 4.5): Rating {
  return value as Rating
}
