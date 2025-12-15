/**
 * User Factory
 * 동적 사용자 데이터 생성
 */

let userCounter = 1

export interface CreateUserOptions {
  id?: string
  email?: string
  name?: string
  avatar?: string
}

/**
 * User 생성 팩토리
 */
export const createUser = (options: CreateUserOptions = {}) => {
  const id = options.id ?? `user-factory-${userCounter}`
  const email = options.email ?? `test${userCounter}@example.com`
  
  userCounter++
  
  return {
    id,
    email,
    name: options.name ?? `Test User ${userCounter}`,
    avatar: options.avatar ?? `/test/avatar-${userCounter}.jpg`,
  }
}

/**
 * 인증된 사용자 생성
 */
export const createAuthenticatedUser = (options: CreateUserOptions = {}) => {
  return {
    user: createUser(options),
    token: `mock-token-${Date.now()}`,
    expiresIn: 3600,
  }
}

/**
 * 카운터 리셋
 */
export const resetUserCounter = () => {
  userCounter = 1
}
