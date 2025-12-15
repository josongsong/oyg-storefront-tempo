/**
 * MSW Handlers - Auth API
 */

import { http, HttpResponse } from 'msw'
import { MOCK_USERS, MOCK_AUTH_RESPONSE } from '@/test/fixtures'

export const authHandlers = [
  // Login
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as any
    const { email, password } = body
    
    // Mock successful login
    if (email === 'test@example.com' && password === 'password123') {
      return HttpResponse.json(MOCK_AUTH_RESPONSE)
    }
    
    // Mock failed login
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Register
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as any
    const { email, password, name } = body
    
    // Mock validation
    if (!email || !password) {
      return HttpResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      ...MOCK_AUTH_RESPONSE,
      user: {
        ...MOCK_AUTH_RESPONSE.user,
        email,
        name,
      },
    })
  }),

  // Logout
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),

  // Get current user
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return HttpResponse.json(MOCK_USERS.authenticated)
  }),

  // Refresh token
  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      token: 'new-mock-token-67890',
      expiresIn: 3600,
    })
  }),
]
