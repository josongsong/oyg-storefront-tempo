/**
 * MSW Handlers - Index
 * 모든 핸들러를 통합
 */

import { productHandlers } from './product.handlers'
import { cartHandlers } from './cart.handlers'
import { authHandlers } from './auth.handlers'

export const handlers = [
  ...productHandlers,
  ...cartHandlers,
  ...authHandlers,
]

export { productHandlers, cartHandlers, authHandlers }
export { resetMockCart } from './cart.handlers'
