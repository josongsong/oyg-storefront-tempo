/**
 * Route Type Definitions
 * React Router v7 타입 안전성
 */

export interface RouteParams {
  slug?: string
}

export interface ProductListSearchParams {
  q?: string
  category?: string
}

export interface RouteHandle {
  title?: string
  description?: string
  requireAuth?: boolean
}

