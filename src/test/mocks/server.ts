/**
 * MSW Server (Node.js)
 * 테스트 환경에서 사용
 */

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
