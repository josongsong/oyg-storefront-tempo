/**
 * Product Domain
 * 
 * 상품 관련 모든 기능을 담당하는 도메인
 * - 상품 목록/상세 조회
 * - 퀵샵 (Quick Shop)
 * - 찜하기 (Wishlist)
 * - 상품 검색/필터
 */

// Components
export {
  ProductCard,
  ProductDetailView,
  QuickShopModal,
  WishlistPopup,
  BalmSelector,
  TubeVisual,
  AITrioPicker,
  FilterFacet,
  ProductComparison,
  ProductImageGallery,
  ReviewCard,
} from './components'

// Hooks
export { useProducts, productKeys } from './hooks/use-products'

// Stores
export { useQuickShopStore, useWishlistStore } from './stores'

// Types
export type {
  Product,
  ProductListItem,
  ProductData,
  QuickShopProduct,
  Review,
} from './types'

// Mocks (for development)
export { MOCK_PRODUCTS } from './mocks'
