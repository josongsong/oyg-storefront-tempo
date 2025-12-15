/**
 * Legacy Glossier Types
 * @deprecated 이 타입들은 마이그레이션 중입니다.
 * 
 * 새로운 코드는 다음을 사용하세요:
 * - Product 관련: @/entities/product
 * - Feature 특화 타입: @/features/[feature]/types
 * 
 * 이 파일은 호환성을 위해 유지됩니다.
 */

// Menu types - constants로 이동 예정
export interface MenuItem {
  label: string
  link: string
  isNew?: boolean
}

export interface MenuColumn {
  title?: string
  items: MenuItem[]
}

export interface MegaMenuAd {
  image: string
  title: string
  subtitle: string
  linkText: string
  isSale?: boolean
}

export interface MegaMenu {
  columns: MenuColumn[]
  ad?: MegaMenuAd
}

export interface MegaMenuCategory {
  [key: string]: MegaMenu
}

// Filter types - features/product/types로 이동 예정
export interface FilterOption {
  label: string
  count?: number
}

export interface Filter {
  id: string
  label?: string
  title?: string
  type?: 'checkbox' | 'radio' | 'range'
  hasSearch?: boolean
  isOpen?: boolean
  options: FilterOption[]
}

// Product types - entities/product로 마이그레이션됨
export interface Flavor {
  id: string
  name: string
  description: string
  color: string
  labelColor: string
  tubeColor: string
  capColor: string
}

/**
 * @deprecated Use Product from @/entities/product instead
 */
export interface GlossierProduct {
  id: number | string
  brand: string
  name: string
  price: string
  rating: number
  reviews: number
  badge?: string
  badgeSecondary?: string
  valueText?: string
  image: string
  originalPrice?: string
  isNew?: boolean
}
