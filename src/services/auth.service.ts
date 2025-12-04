import { api } from './api'

import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types/auth'

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return api.post('auth/login', { json: data }).json()
  },

  register: async (data: RegisterRequest): Promise<User> => {
    return api.post('auth/register', { json: data }).json()
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('access_token')
    return api.post('auth/logout').json()
  },

  getMe: async (): Promise<User> => {
    return api.get('auth/me').json()
  },

  refreshToken: async (): Promise<LoginResponse> => {
    return api.post('auth/refresh').json()
  },
}

