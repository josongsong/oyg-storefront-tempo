/**
 * Auth API Service Tests
 * MSW를 사용한 인증 API 테스트
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { authApi } from '@/features/auth/api/service'
import { MOCK_USERS, MOCK_AUTH_RESPONSE } from '@/test/fixtures'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

describe('authApi', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = await authApi.login(credentials)
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('token')
      expect(result).toHaveProperty('user')
      expect(result.user.email).toBe(credentials.email)
    })

    it('should return user data on successful login', async () => {
      const result = await authApi.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.user).toMatchObject({
        id: expect.any(String),
        email: 'test@example.com',
        name: expect.any(String),
      })
    })

    it('should fail with invalid credentials', async () => {
      const invalidCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      }

      await expect(authApi.login(invalidCredentials)).rejects.toThrow()
    })

    it('should handle missing email', async () => {
      server.use(
        http.post('*/auth/login', () => {
          return HttpResponse.json(
            { error: 'Email is required' },
            { status: 400 }
          )
        })
      )

      await expect(
        authApi.login({ email: '', password: 'password' })
      ).rejects.toThrow()
    })

    it('should handle missing password', async () => {
      server.use(
        http.post('*/auth/login', () => {
          return HttpResponse.json(
            { error: 'Password is required' },
            { status: 400 }
          )
        })
      )

      await expect(
        authApi.login({ email: 'test@example.com', password: '' })
      ).rejects.toThrow()
    })

    it('should handle server error', async () => {
      server.use(
        http.post('*/auth/login', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      await expect(
        authApi.login({ email: 'test@example.com', password: 'password' })
      ).rejects.toThrow()
    })
  })

  describe('register', () => {
    it('should register new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      }

      const result = await authApi.register(userData)
      
      expect(result).toBeDefined()
      expect(result.email).toBe(userData.email)
      expect(result.name).toBe(userData.name)
    })

    it('should handle duplicate email', async () => {
      server.use(
        http.post('*/auth/register', () => {
          return HttpResponse.json(
            { error: 'Email already exists' },
            { status: 409 }
          )
        })
      )

      await expect(
        authApi.register({
          email: 'existing@example.com',
          password: 'password',
          name: 'User',
        })
      ).rejects.toThrow()
    })

    it('should validate required fields', async () => {
      server.use(
        http.post('*/auth/register', () => {
          return HttpResponse.json(
            { error: 'Email and password are required' },
            { status: 400 }
          )
        })
      )

      await expect(
        authApi.register({ email: '', password: '', name: '' })
      ).rejects.toThrow()
    })

    it('should validate email format', async () => {
      server.use(
        http.post('*/auth/register', () => {
          return HttpResponse.json(
            { error: 'Invalid email format' },
            { status: 400 }
          )
        })
      )

      await expect(
        authApi.register({
          email: 'invalid-email',
          password: 'password',
          name: 'User',
        })
      ).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      // 먼저 토큰 설정
      localStorage.setItem('access_token', 'mock-token')
      
      await authApi.logout()
      
      expect(localStorage.getItem('access_token')).toBeNull()
    })

    it('should clear token from localStorage', async () => {
      localStorage.setItem('access_token', 'some-token')
      
      await authApi.logout()
      
      expect(localStorage.getItem('access_token')).toBeNull()
    })

    it('should handle logout even without token', async () => {
      await expect(authApi.logout()).resolves.not.toThrow()
    })
  })

  describe('getMe', () => {
    it('should get current user with valid token', async () => {
      const result = await authApi.getMe()
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('email')
    })

    it('should fail without authorization', async () => {
      server.use(
        http.get('*/auth/me', () => {
          return HttpResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        })
      )

      await expect(authApi.getMe()).rejects.toThrow()
    })

    it('should fail with invalid token', async () => {
      server.use(
        http.get('*/auth/me', () => {
          return HttpResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
          )
        })
      )

      await expect(authApi.getMe()).rejects.toThrow()
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const result = await authApi.refreshToken()
      
      expect(result).toBeDefined()
      expect(result).toHaveProperty('token')
      expect(result.token).toBeTruthy()
    })

    it('should return new token', async () => {
      const result = await authApi.refreshToken()
      
      expect(result.token).toBe('new-mock-token-67890')
    })

    it('should fail with invalid refresh token', async () => {
      server.use(
        http.post('*/auth/refresh', () => {
          return HttpResponse.json(
            { error: 'Invalid refresh token' },
            { status: 401 }
          )
        })
      )

      await expect(authApi.refreshToken()).rejects.toThrow()
    })
  })

  describe('Auth flow integration', () => {
    it('should handle complete auth flow', async () => {
      // 1. 회원가입
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }
      const user = await authApi.register(registerData)
      expect(user.email).toBe(registerData.email)

      // 2. 로그인
      const loginResult = await authApi.login({
        email: registerData.email,
        password: registerData.password,
      })
      expect(loginResult.token).toBeTruthy()

      // 3. 사용자 정보 조회
      const currentUser = await authApi.getMe()
      expect(currentUser).toBeDefined()

      // 4. 로그아웃
      await authApi.logout()
      expect(localStorage.getItem('access_token')).toBeNull()
    })

    it('should handle token refresh flow', async () => {
      // 1. 로그인
      await authApi.login({
        email: 'test@example.com',
        password: 'password123',
      })

      // 2. 토큰 만료 시뮬레이션
      server.use(
        http.get('*/auth/me', () => {
          return HttpResponse.json(
            { error: 'Token expired' },
            { status: 401 }
          )
        })
      )

      // 3. 토큰 갱신
      const refreshed = await authApi.refreshToken()
      expect(refreshed.token).toBeTruthy()

      // 4. 갱신된 토큰으로 재시도
      server.use(
        http.get('*/auth/me', () => {
          return HttpResponse.json(MOCK_USERS.authenticated)
        })
      )

      const user = await authApi.getMe()
      expect(user).toBeDefined()
    })
  })
})


