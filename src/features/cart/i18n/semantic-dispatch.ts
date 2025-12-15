/**
 * Cart Semantic Dispatch
 * 
 * Cart 의미 코드 → 메시지 변환
 */

import { cartMessages } from './messages'
import { CartSemanticCode } from '@/shared/i18n/semantic-codes'

/**
 * Cart 의미 코드를 메시지로 변환
 */
export function dispatchCartMessage(
  code: CartSemanticCode,
  params?: Record<string, string | number>
): string {
  switch (code) {
    case CartSemanticCode.EMPTY_STATE__NO_ITEMS:
      return cartMessages.emptyTitle()
    
    case CartSemanticCode.ACTION__ADD_SUCCESS:
      return cartMessages.addSuccess({ 
        productName: String(params?.productName || '') 
      })
    
    case CartSemanticCode.ACTION__REMOVE_SUCCESS:
      return cartMessages.removeSuccess()
    
    case CartSemanticCode.ACTION__UPDATE_QUANTITY:
      return cartMessages.updateQuantity()
    
    case CartSemanticCode.ERROR__OUT_OF_STOCK:
      return cartMessages.outOfStock({ 
        productName: String(params?.productName || '') 
      })
    
    case CartSemanticCode.ERROR__ITEM_NOT_FOUND:
      return cartMessages.itemNotFound()
    
    case CartSemanticCode.EMPTY_STATE__SESSION_EXPIRED:
    case CartSemanticCode.ERROR__LIMIT_EXCEEDED:
      // 아직 메시지 미정의 - fallback
      return cartMessages.emptyTitle()
    
    default:
      return cartMessages.emptyTitle()
  }
}

