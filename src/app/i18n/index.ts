/**
 * App i18n Layer
 * 
 * Paraglide 초기화 및 React Router 통합
 */

// Paraglide 생성 파일
// @ts-ignore - Paraglide generated files
export * from './paraglide/messages.js'
// @ts-ignore
export { getLocale, setLocale, locales, baseLocale } from './paraglide/runtime.js'

// Loader & Hooks
export * from './loader'
export * from './hooks'

// Re-export for convenience
export { dispatchSemanticMessage } from '@/shared/i18n/message-dispatch'
export type { SemanticCode } from '@/shared/i18n/semantic-codes'

