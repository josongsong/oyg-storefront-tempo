/**
 * Product Test Fixtures
 * 재사용 가능한 상품 테스트 데이터
 */

import type { ProductId, Price, Rating } from '@/entities/product'

export const MOCK_PRODUCTS = [
  {
    id: 'prod-test-1' as ProductId,
    name: 'Test Product 1',
    brand: 'Test Brand',
    price: '$19.99',
    rating: 4.5 as Rating,
    reviewCount: 100,
    image: '/test/product-1.jpg',
    categories: ['skincare', 'serum'],
    tags: { product_type: ['serum'] },
  },
  {
    id: 'prod-test-2' as ProductId,
    name: 'Test Product 2',
    brand: 'Another Brand',
    price: '$29.99',
    rating: 4.8 as Rating,
    reviewCount: 250,
    image: '/test/product-2.jpg',
    categories: ['makeup', 'lipstick'],
    tags: { product_type: ['lipstick'] },
  },
  {
    id: 'prod-test-3' as ProductId,
    name: 'Test Product 3',
    brand: 'Premium Brand',
    price: '$49.99',
    rating: 4.9 as Rating,
    reviewCount: 500,
    image: '/test/product-3.jpg',
    categories: ['skincare', 'moisturizer'],
    tags: { product_type: ['moisturizer'] },
  },
] as const

export const MOCK_PRODUCT_DETAIL = {
  id: 'prod-detail-1' as ProductId,
  name: 'Detailed Test Product',
  brand: 'Test Brand',
  price: '$39.99' as any,
  rating: 4.7 as Rating,
  reviewCount: 150,
  image: '/test/product-detail.jpg',
  description: 'This is a detailed test product description',
  ingredients: ['Water', 'Glycerin', 'Test Ingredient'],
  howToUse: 'Apply to clean skin',
  categories: ['skincare'],
  tags: { product_type: ['serum'] },
} as const
