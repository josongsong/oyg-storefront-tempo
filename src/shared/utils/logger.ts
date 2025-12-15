/**
 * Logger Utility
 * 개발/프로덕션 환경별 로깅
 */

export const logger = {
  log: import.meta.env.DEV ? console.log : () => {},
  warn: console.warn,
  error: console.error,
  debug: import.meta.env.DEV ? console.debug : () => {},
} as const

