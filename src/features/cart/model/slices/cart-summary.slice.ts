/**
 * Cart Summary Slice
 * 주문 요약 계산 담당
 */

import type { StateCreator } from 'zustand'
import type { CartSummary, ShippingInfo } from '../types'
import { SHIPPING_OPTIONS, TAX_RATE, FREE_SHIPPING_THRESHOLD } from '../types'
import type { Price } from '@/entities/product'
import type { CartSelectorsSlice } from './cart-selectors.slice'

export interface CartSummarySlice {
  shippingMethod: ShippingInfo['method']
  
  // Summary
  getSummary: () => CartSummary
  setShippingMethod: (method: ShippingInfo['method']) => void
}

export const createCartSummarySlice: StateCreator<
  CartSelectorsSlice & CartSummarySlice,
  [['zustand/immer', never]],
  [],
  CartSummarySlice
> = (set, get) => ({
  shippingMethod: 'standard',
  
  getSummary: () => {
    const items = get().getItems()
    
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price as number) * item.quantity,
      0
    ) as Price
    
    const savings = items.reduce(
      (sum, item) => {
        if (item.originalPrice) {
          return sum + ((item.originalPrice as number) - (item.price as number)) * item.quantity
        }
        return sum
      },
      0
    ) as Price | undefined
    
    const shippingInfo = SHIPPING_OPTIONS[get().shippingMethod]
    const shipping = (subtotal as number) >= (FREE_SHIPPING_THRESHOLD as number)
      ? (0 as Price)
      : shippingInfo.cost
    
    const tax = ((subtotal as number) * TAX_RATE) as Price
    const total = ((subtotal as number) + (shipping as number) + (tax as number)) as Price
    
    return {
      itemCount: get().getTotalItems(),
      subtotal,
      shipping,
      tax,
      total,
      savings: (savings as number) > 0 ? savings : undefined,
    }
  },
  
  setShippingMethod: (method) => {
    set((state) => {
      state.shippingMethod = method
    })
  },
})

