/**
 * Shared API Client
 * 모든 feature에서 사용하는 base API client
 */

import ky from 'ky'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // Handle 401 responses
        if (response.status === 401) {
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
        return response
      },
    ],
  },
})

// Backward compatibility
export { apiClient as api }
