/**
 * MSW Handlers - Cart API
 */

import { http, HttpResponse } from 'msw'

let mockCart: any[] = []

export const cartHandlers = [
  // Add to cart
  http.post('/api/cart/add', async ({ request }) => {
    const item = await request.json()
    mockCart.push(item)
    
    return HttpResponse.json({
      success: true,
      item,
      cart: mockCart,
    })
  }),

  // Get cart
  http.get('/api/cart', () => {
    return HttpResponse.json({
      items: mockCart,
      total: mockCart.reduce((sum, item: any) => sum + item.price * item.quantity, 0),
    })
  }),

  // Update cart item
  http.patch('/api/cart/:itemId', async ({ params, request }) => {
    const { itemId } = params
    const updates = await request.json()
    
    const index = mockCart.findIndex((item: any) => item.id === itemId)
    if (index !== -1) {
      mockCart[index] = { ...mockCart[index], ...updates }
      return HttpResponse.json({ success: true, item: mockCart[index] })
    }
    
    return new HttpResponse(null, { status: 404 })
  }),

  // Remove from cart
  http.delete('/api/cart/:itemId', ({ params }) => {
    const { itemId } = params
    const initialLength = mockCart.length
    mockCart = mockCart.filter((item: any) => item.id !== itemId)
    
    return HttpResponse.json({
      success: mockCart.length < initialLength,
      cart: mockCart,
    })
  }),

  // Clear cart
  http.delete('/api/cart', () => {
    mockCart = []
    return HttpResponse.json({ success: true })
  }),
]

// Helper to reset cart in tests
export const resetMockCart = () => {
  mockCart = []
}
