/**
 * Cart Selectors Slice
 * 장바구니 조회 로직 담당
 */

import type { StateCreator } from 'zustand'
import type { CartItem, CartItemId, CartItemOptions } from '../types'
import type { ProductId } from '@/entities/product'
import type { CartItemsSlice } from './cart-items.slice'

export interface CartSelectorsSlice {
  // Selectors
  getItem: (id: CartItemId) => CartItem | undefined
  getItems: () => CartItem[]
  getTotalItems: () => number
  hasItem: (productId: ProductId, options?: CartItemOptions) => boolean
}

export const createCartSelectorsSlice: StateCreator<
  CartItemsSlice & CartSelectorsSlice,
  [['zustand/immer', never]],
  [],
  CartSelectorsSlice
> = (_set, get) => ({
  getItem: (id) => {
    return get().items.get(id)
  },
  
  getItems: () => {
    return Array.from(get().items.values())
  },
  
  getTotalItems: () => {
    return Array.from(get().items.values())
      .reduce((sum, item) => sum + item.quantity, 0)
  },
  
  hasItem: (productId, options) => {
    const items = Array.from(get().items.values())
    return items.some(item => 
      item.productId === productId &&
      (!options || (
        item.options?.shade === options.shade &&
        item.options?.size === options.size
      ))
    )
  },
})

