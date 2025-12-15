export const NAV_LINKS = [
  'Skincare',
  'Makeup',
  'Balms',
  'Body',
  'Fragrance',
  'Glossier Goods',
  'Sets',
  'Shop All',
] as const

export type NavLink = (typeof NAV_LINKS)[number]

