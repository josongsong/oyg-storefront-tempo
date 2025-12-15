/**
 * Cart Items Slice
 * 장바구니 아이템 CRUD 담당
 */

import type { StateCreator } from 'zustand'
import { useToastStore } from '@/app/stores/toast.store'
import type { CartItem, CartItemId, CartItemOptions } from '../types'
import { CartItemId as CartItemIdFactory } from '../types'

export interface CartItemsSlice {
  items: Map<CartItemId, CartItem>
  
  // CRUD Operations
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void
  removeItem: (id: CartItemId) => void
  updateQuantity: (id: CartItemId, quantity: number) => void
  updateOptions: (id: CartItemId, options: Partial<CartItemOptions>) => void
  clear: () => void
}

export const createCartItemsSlice: StateCreator<
  CartItemsSlice,
  [['zustand/immer', never]],
  [],
  CartItemsSlice
> = (set) => ({
  items: new Map(),
  
  addItem: (item, quantity = 1) => {
    set((state) => {
      const itemsArray = Array.from(state.items.values())
      const existingItem = itemsArray.find(
        (i) =>
          i.productId === item.productId &&
          i.options?.shade === item.options?.shade &&
          i.options?.size === item.options?.size
      )
      
      if (existingItem) {
        existingItem.quantity += quantity
        useToastStore.getState().addToast('Quantity updated', 'success', 2000)
      } else {
        const id = CartItemIdFactory.create(item.productId, item.options)
        const newItem: CartItem = { ...item, id, quantity }
        state.items.set(id, newItem)
        useToastStore.getState().addToast('Added to cart', 'success', 2000)
      }
    })
  },
  
  removeItem: (id) => {
    set((state) => {
      state.items.delete(id)
    })
  },
  
  updateQuantity: (id, quantity) => {
    set((state) => {
      const item = state.items.get(id)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
    })
  },
  
  updateOptions: (id, options) => {
    set((state) => {
      const item = state.items.get(id)
      if (item && item.options) {
        Object.assign(item.options, options)
      }
    })
  },
  
  clear: () => {
    set((state) => {
      state.items.clear()
    })
  },
})

