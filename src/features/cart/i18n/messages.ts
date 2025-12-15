/**
 * Cart Feature Messages
 * 
 * Paraglide 메시지 re-export
 */

// @ts-ignore - Paraglide generated file
import * as m from '@/app/i18n/paraglide/messages.js'

// Cart 메시지만 export
export const cartMessages = {
  emptyTitle: m.cart_empty_title,
  emptyDescription: m.cart_empty_description,
  itemCount: m.cart_item_count,
  addSuccess: m.cart_add_success,
  removeSuccess: m.cart_remove_success,
  updateQuantity: m.cart_update_quantity,
  outOfStock: m.cart_out_of_stock,
  itemNotFound: m.cart_item_not_found,
  continueShopping: m.cart_continue_shopping,
} as const

// Type-safe message keys
export type CartMessageKey = keyof typeof cartMessages

