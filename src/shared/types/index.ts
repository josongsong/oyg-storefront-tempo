/**
 * Shared Types
 * 전역적으로 사용되는 공통 타입 정의
 */

// Base Entity - 모든 엔티티의 기본 구조
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Paginated Response - API 페이지네이션 응답
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

// Utility Types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: Optional<T>
  error: Optional<Error>
  status: LoadingState
}

// Legacy Glossier types (호환성 유지)
export * from './glossier'
