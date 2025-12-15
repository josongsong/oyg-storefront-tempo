/**
 * Cart API Service
 * 장바구니 관련 HTTP 요청
 */

import { apiClient } from '@/shared/api'
import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../types'

export const cartApi = {
  /**
   * 장바구니 조회
   */
  getCart: async (): Promise<Cart> => {
    return apiClient.get('cart').json()
  },

  /**
   * 장바구니 상품 추가
   */
  addItem: async (data: AddToCartRequest): Promise<CartItem> => {
    return apiClient.post('cart/items', { json: data }).json()
  },

  /**
   * 장바구니 상품 수정
   */
  updateItem: async (itemId: string, data: UpdateCartItemRequest): Promise<CartItem> => {
    return apiClient.patch(`cart/items/${itemId}`, { json: data }).json()
  },

  /**
   * 장바구니 상품 삭제
   */
  removeItem: async (itemId: string): Promise<void> => {
    return apiClient.delete(`cart/items/${itemId}`).json()
  },

  /**
   * 장바구니 비우기
   */
  clearCart: async (): Promise<void> => {
    return apiClient.delete('cart').json()
  },
}

// Backward compatibility
export const cartService = cartApi
