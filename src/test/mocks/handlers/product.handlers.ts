/**
 * MSW Handlers - Product API
 */

import { http, HttpResponse } from 'msw'
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAIL } from '@/test/fixtures'

export const productHandlers = [
  // Get product list
  http.get('/cosmetics/data/products-index.json', () => {
    return HttpResponse.json(MOCK_PRODUCTS)
  }),

  // Get product by filename
  http.get('/cosmetics/data/:filename', ({ params }) => {
    const { filename } = params
    
    // Extract product ID from filename (e.g., 'product-1.json' -> 'prod-test-1')
    const productId = filename?.toString().replace('.json', '')
    
    if (productId === 'prod-detail-1') {
      return HttpResponse.json(MOCK_PRODUCT_DETAIL)
    }
    
    return HttpResponse.json(MOCK_PRODUCT_DETAIL)
  }),

  // Search products
  http.get('/api/products/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.toLowerCase()
    
    if (!query) {
      return HttpResponse.json(MOCK_PRODUCTS)
    }
    
    const filtered = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
    )
    
    return HttpResponse.json(filtered)
  }),

  // Get product by ID (alternative endpoint)
  http.get('/api/products/:id', ({ params }) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === params.id)
    
    if (!product) {
      return new HttpResponse(null, { status: 404 })
    }
    
    return HttpResponse.json(product)
  }),
]
