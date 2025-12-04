// Glossier UI 타입 정의

export interface Flavor {
  id: string
  name: string
  description: string
  color: string
  labelColor: string
  tubeColor: string
  capColor: string
}

export interface MenuItem {
  label: string
  link: string
  isNew?: boolean
}

export interface MenuColumn {
  title: string
  items: MenuItem[]
}

export interface MenuAd {
  image: string
  title: string
  subtitle: string
  linkText: string
  isSale?: boolean
}

export interface MegaMenuCategory {
  columns: MenuColumn[]
  ad?: MenuAd
}

export interface FilterOption {
  label: string
  count: number
}

export interface Filter {
  id: string
  title: string
  type: 'radio' | 'checkbox'
  isOpen: boolean
  hasSearch?: boolean
  options: FilterOption[]
}

export interface GlossierProduct {
  id: number | string
  brand: string
  name: string
  price: string
  rating: number
  reviews: number
  badge?: string
  valueText?: string
  image: string
}

