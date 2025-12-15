/**
 * Auth API Service
 * 인증 관련 HTTP 요청
 */

import { apiClient } from '@/shared/api'
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '../types'

export const authApi = {
  /**
   * 로그인
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post('auth/login', { json: data }).json()
  },

  /**
   * 회원가입
   */
  register: async (data: RegisterRequest): Promise<User> => {
    return apiClient.post('auth/register', { json: data }).json()
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    localStorage.removeItem('access_token')
    return apiClient.post('auth/logout').json()
  },

  /**
   * 현재 사용자 정보 조회
   */
  getMe: async (): Promise<User> => {
    return apiClient.get('auth/me').json()
  },

  /**
   * 토큰 갱신
   */
  refreshToken: async (): Promise<LoginResponse> => {
    return apiClient.post('auth/refresh').json()
  },
}

// Backward compatibility
export const authService = authApi
