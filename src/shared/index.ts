// Shared API
export { apiClient, api } from './api'

// Shared types
export type {
  BaseEntity,
  PaginatedResponse,
  ApiResponse,
  ApiError,
  Nullable,
  Optional,
  LoadingState,
  AsyncState,
} from './types'

// Shared components
export { Modal } from './components/Modal'
export type { ModalProps } from './components/Modal'

export { Carousel, CarouselNavigation } from './components/Carousel'
export type { CarouselProps, CarouselNavigationProps } from './components/Carousel'

// Shared hooks
export { useModal } from './hooks/useModal'
export type { UseModalReturn, UseModalOptions } from './hooks/useModal'

export { useCarousel } from './hooks/useCarousel'
export type { UseCarouselReturn, UseCarouselOptions } from './hooks/useCarousel'

// Shared utils
export * from './utils'

// Shared constants
export * from './constants'

