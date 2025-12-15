/**
 * Store Test Helpers
 * 
 * 테스트용 유틸리티 함수들
 */

import { useCartStore } from '@/features/cart/stores'
import { useWishlistStore } from '@/features/product/stores/wishlist.store'
import { useToastStore } from './toast.store'
import { useAppStore } from './app.store'

/**
 * 모든 store 초기화
 */
export const resetAllStores = () => {
  resetCartStore()
  resetWishlistStore()
  resetToastStore()
  resetAppStore()
}

/**
 * Cart Store 초기화
 */
export const resetCartStore = () => {
  useCartStore.setState({
    items: new Map(),
    shippingMethod: 'standard',
  }, true)
}

/**
 * Wishlist Store 초기화
 */
export const resetWishlistStore = () => {
  useWishlistStore.setState({
    items: [],
    isOpen: false,
    showEmptyTooltip: false,
  }, true)
}

/**
 * Toast Store 초기화
 */
export const resetToastStore = () => {
  const state = useToastStore.getState()
  
  // Clear all timeouts
  state.toasts.forEach((toast) => {
    if (toast.timeoutId) {
      clearTimeout(toast.timeoutId)
    }
  })
  
  useToastStore.setState({
    toasts: [],
  }, true)
}

/**
 * App Store 초기화
 */
export const resetAppStore = () => {
  useAppStore.getState().reset()
}

