/**
 * MSW Browser
 * 브라우저 개발 환경에서 사용
 */

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
