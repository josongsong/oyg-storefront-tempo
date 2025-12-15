/**
 * API Contract Types
 * 
 * 서버-클라이언트 계약
 * 의미 코드 기반 응답
 */

import type { SemanticCode } from '@/shared/i18n/semantic-codes'

export interface ResponseMeta {
  retryable?: boolean
  target?: string
  timestamp?: string
  correlationId?: string
}

export interface ApiResponse<T = unknown> {
  success: true
  data: T
  semanticCode?: SemanticCode
  params?: Record<string, string | number>
  meta?: ResponseMeta
}

export interface ApiError {
  success: false
  semanticCode: SemanticCode
  params?: Record<string, string | number>
  meta?: ResponseMeta
}

export type ApiResult<T> = ApiResponse<T> | ApiError

export function isApiSuccess<T>(result: ApiResult<T>): result is ApiResponse<T> {
  return result.success === true
}

export function isApiError<T>(result: ApiResult<T>): result is ApiError {
  return result.success === false
}
