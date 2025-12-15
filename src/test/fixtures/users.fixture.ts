/**
 * User Test Fixtures
 * 재사용 가능한 사용자 테스트 데이터
 */

export const MOCK_USERS = {
  authenticated: {
    id: 'user-test-1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: '/test/avatar.jpg',
  },
  guest: {
    id: 'guest',
    email: '',
    name: 'Guest',
  },
} as const

export const MOCK_AUTH_TOKEN = 'mock-jwt-token-12345'

export const MOCK_AUTH_RESPONSE = {
  token: MOCK_AUTH_TOKEN,
  user: MOCK_USERS.authenticated,
  expiresIn: 3600,
} as const
