/**
 * Global Stores
 * 앱 전체에서 사용되는 전역 상태만 관리
 * 
 * Feature별 stores는 각 feature에서 직접 import:
 * - @/features/product/stores
 * - @/features/auth/stores
 * - @/features/cart/stores
 * - @/features/promotion/stores
 * - @/features/ai-assistant/stores
 * - @/features/locale/stores
 * - @/features/notification/stores
 */

export { useAppStore } from './app.store'
export { useToastStore } from './toast.store'
export type { Toast } from './toast.store'

// Test helpers
export {
  resetAllStores,
  resetCartStore,
  resetWishlistStore,
  resetToastStore,
  resetAppStore,
} from './test-helpers'
