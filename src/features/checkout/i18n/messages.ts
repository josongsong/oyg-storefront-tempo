/**
 * Checkout Feature Messages
 */

// @ts-ignore - Paraglide generated file
import * as m from '@/app/i18n/paraglide/messages.js'

export const checkoutMessages = {
  addressInvalid: m.checkout_address_invalid,
  phoneInvalid: m.checkout_phone_invalid,
  paymentProcessing: m.checkout_payment_processing,
  paymentSuccess: m.checkout_payment_success,
  paymentFailed: m.checkout_payment_failed,
  orderConfirmed: m.checkout_order_confirmed,
  freeShipping: m.checkout_free_shipping,
  expressAvailable: m.checkout_express_available,
} as const

export type CheckoutMessageKey = keyof typeof checkoutMessages

