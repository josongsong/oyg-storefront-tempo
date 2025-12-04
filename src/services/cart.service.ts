import { api } from './api'

import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart'

export const cartService = {
  getCart: async (): Promise<Cart> => {
    return api.get('cart').json()
  },

  addItem: async (data: AddToCartRequest): Promise<CartItem> => {
    return api.post('cart/items', { json: data }).json()
  },

  updateItem: async (itemId: string, data: UpdateCartItemRequest): Promise<CartItem> => {
    return api.patch(`cart/items/${itemId}`, { json: data }).json()
  },

  removeItem: async (itemId: string): Promise<void> => {
    return api.delete(`cart/items/${itemId}`).json()
  },

  clearCart: async (): Promise<void> => {
    return api.delete('cart').json()
  },
}

