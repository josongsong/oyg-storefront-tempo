/**
 * Auth Domain
 * 
 * 인증 및 사용자 관리
 * - 로그인/로그아웃
 * - 회원가입
 * - 사용자 정보 관리
 */

// Components
export { AuthPopup } from './components'

// Hooks
export { useUser, useLogin, useRegister, useLogout, authKeys } from './hooks/use-auth'

// Stores
export { useAuthPopupStore, useUserStore } from './stores'

// Types
export type { User, LoginRequest, LoginResponse, RegisterRequest } from './types'
