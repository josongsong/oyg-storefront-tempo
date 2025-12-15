import type { BaseEntity } from '@/shared'

export interface User extends BaseEntity {
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'user' | 'admin'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

