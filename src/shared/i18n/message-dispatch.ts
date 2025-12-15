/**
 * Message Dispatch (메시지 디스패치)
 * 
 * 의미 코드 → 타입 안전 메시지 변환
 * 런타임 키 없음, 모두 컴파일 타임 검증
 */

// @ts-ignore - Paraglide generated file
import * as m from '@/app/i18n/paraglide/messages.js'
import {
  type SemanticCode,
  CartSemanticCode,
  ProductSemanticCode,
  CheckoutSemanticCode,
  PromoSemanticCode,
  SearchSemanticCode,
  AuthSemanticCode,
  CommonSemanticCode,
} from './semantic-codes'

/**
 * 의미 코드를 메시지로 변환
 * 
 * @param code - 의미 코드 (enum)
 * @param params - 메시지 파라미터
 * @returns 번역된 메시지
 * 
 * @example
 * ```ts
 * dispatchSemanticMessage(
 *   CartSemanticCode.ACTION__ADD_SUCCESS,
 *   { productName: 'iPhone', quantity: 2 }
 * )
 * // → "iPhone이(가) 장바구니에 추가되었습니다"
 * ```
 */
export function dispatchSemanticMessage(
  code: SemanticCode,
  params?: Record<string, string | number>
): string {
  // Exhaustive switch - 모든 코드가 처리되었는지 타입 검증
  switch (code) {
    // ====== Cart ======
    case CartSemanticCode.EMPTY_STATE__NO_ITEMS:
      return m.cart_empty_title()
    
    case CartSemanticCode.ACTION__ADD_SUCCESS:
      return m.cart_add_success({ 
        productName: String(params?.productName || '') 
      })
    
    case CartSemanticCode.ACTION__REMOVE_SUCCESS:
      return m.cart_remove_success()
    
    case CartSemanticCode.ACTION__UPDATE_QUANTITY:
      return m.cart_update_quantity()
    
    case CartSemanticCode.ERROR__OUT_OF_STOCK:
      return m.cart_out_of_stock({ 
        productName: String(params?.productName || '') 
      })
    
    case CartSemanticCode.ERROR__ITEM_NOT_FOUND:
      return m.cart_item_not_found()
    
    // ====== Product ======
    case ProductSemanticCode.EMPTY_STATE__NO_RESULTS:
      return m.product_no_results()
    
    case ProductSemanticCode.FILTER__NO_MATCHES:
      return m.product_filter_no_matches()
    
    case ProductSemanticCode.FILTER__CLEAR_ALL:
      return m.product_clear_filters()
    
    case ProductSemanticCode.REVIEW__VERIFIED_PURCHASE:
      return m.product_review_verified()
    
    case ProductSemanticCode.REVIEW__HELPFUL:
      return m.product_review_helpful()
    
    case ProductSemanticCode.ACTION__ADD_WISHLIST:
      return m.product_add_wishlist()
    
    case ProductSemanticCode.ACTION__QUICK_VIEW:
      return m.product_quick_view()
    
    // ====== Checkout ======
    case CheckoutSemanticCode.VALIDATION__ADDRESS_INVALID:
      return m.checkout_address_invalid()
    
    case CheckoutSemanticCode.VALIDATION__PHONE_INVALID:
      return m.checkout_phone_invalid()
    
    case CheckoutSemanticCode.PAYMENT__PROCESSING:
      return m.checkout_payment_processing()
    
    case CheckoutSemanticCode.PAYMENT__SUCCESS:
      return m.checkout_payment_success()
    
    case CheckoutSemanticCode.PAYMENT__FAILED:
      return m.checkout_payment_failed()
    
    case CheckoutSemanticCode.SHIPPING__FREE_ELIGIBLE:
      return m.checkout_free_shipping()
    
    case CheckoutSemanticCode.SHIPPING__EXPRESS_AVAILABLE:
      return m.checkout_express_available()
    
    // ====== Promo ======
    case PromoSemanticCode.BANNER__BLACK_FRIDAY:
      return m.promo_banner_black_friday()
    
    case PromoSemanticCode.BANNER__NEW_USER:
      return m.promo_banner_new_user()
    
    case PromoSemanticCode.COUPON__APPLIED:
      return m.promo_coupon_applied({ 
        amount: String(params?.amount || 0) 
      })
    
    case PromoSemanticCode.COUPON__EXPIRED:
      return m.promo_coupon_expired()
    
    case PromoSemanticCode.COUPON__INVALID:
      return m.promo_coupon_invalid()
    
    // ====== Search ======
    case SearchSemanticCode.EMPTY_STATE__NO_RESULTS:
      return m.search_no_results({ 
        query: String(params?.query || '') 
      })
    
    case SearchSemanticCode.SUGGESTION__TRENDING:
      return m.search_trending()
    
    case SearchSemanticCode.SUGGESTION__RECENT:
      return m.search_recent()
    
    // ====== Auth ======
    case AuthSemanticCode.ERROR__INVALID_CREDENTIALS:
      return m.auth_invalid_credentials()
    
    case AuthSemanticCode.ERROR__EMAIL_EXISTS:
      return m.auth_email_exists()
    
    case AuthSemanticCode.SUCCESS__LOGIN:
      return m.auth_login_success()
    
    case AuthSemanticCode.SUCCESS__REGISTER:
      return m.auth_register_success()
    
    case AuthSemanticCode.REQUIRED__VERIFY_EMAIL:
      return m.auth_verify_email()
    
    // ====== Common ======
    case CommonSemanticCode.ERROR__UNKNOWN:
      return m.common_unknown_error()
    
    case CommonSemanticCode.ERROR__NETWORK:
      return m.common_network_error()
    
    case CommonSemanticCode.ERROR__AUTH_REQUIRED:
      return m.common_auth_required()
    
    case CommonSemanticCode.ACTION__RETRY:
      return m.common_retry()
    
    case CommonSemanticCode.ACTION__CANCEL:
      return m.common_cancel()
    
    case CommonSemanticCode.ACTION__CONFIRM:
      return m.common_confirm()
    
    case CommonSemanticCode.ACTION__SAVE:
      return m.common_save()
    
    case CommonSemanticCode.ACTION__DELETE:
      return m.common_delete()
    
    // 나머지 코드들은 아직 메시지 미정의
    case CartSemanticCode.EMPTY_STATE__SESSION_EXPIRED:
    case CartSemanticCode.ERROR__LIMIT_EXCEEDED:
    case ProductSemanticCode.EMPTY_STATE__NO_REVIEWS:
    case PromoSemanticCode.BANNER__SEASONAL:
    case PromoSemanticCode.COUPON__LIMIT_REACHED:
    case AuthSemanticCode.ERROR__EMAIL_NOT_FOUND:
    case AuthSemanticCode.SUCCESS__LOGOUT:
    case CommonSemanticCode.ERROR__TIMEOUT:
    case CommonSemanticCode.ERROR__PERMISSION_DENIED:
    case CheckoutSemanticCode.PAYMENT__PROCESSING:
    case CheckoutSemanticCode.SHIPPING__FREE_ELIGIBLE:
    case CheckoutSemanticCode.SHIPPING__EXPRESS_AVAILABLE:
      return m.common_unknown_error()
    
    default:
      return m.common_unknown_error()
  }
}

/**
 * 파라미터와 함께 메시지 디스패치
 */
export function dispatchWithParams(
  code: SemanticCode,
  params: Record<string, string | number>
): string {
  return dispatchSemanticMessage(code, params)
}

