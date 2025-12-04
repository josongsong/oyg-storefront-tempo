import ky from 'ky'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 10000,
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
        if (response.status === 401) {
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
        return response
      },
    ],
  },
})

