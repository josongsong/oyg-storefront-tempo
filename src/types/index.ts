// Common types
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Re-exports
export * from './auth'
export * from './product'
export * from './cart'
export * from './glossier'
