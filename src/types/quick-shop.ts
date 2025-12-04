export interface QuickShopProduct {
  id: string | number
  name: string
  brand: string
  price: string
  originalPrice?: string
  rating: number
  reviews: number
  images: string[]
  shades?: Shade[]
  sizes?: Size[]
  description?: string
  badge?: string
}

export interface Shade {
  id: string
  name: string
  color?: string
  image?: string
}

export interface Size {
  id: string
  name: string
  inStock: boolean
}

