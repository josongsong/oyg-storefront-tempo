import { create } from 'zustand'

import type { QuickShopProduct } from '@/features/product/types'

interface QuickShopState {
  isOpen: boolean
  product: QuickShopProduct | null
  selectedShade: string | null
  selectedSize: string | null
  quantity: number

  openQuickShop: (product: QuickShopProduct) => void
  closeQuickShop: () => void
  setSelectedShade: (shadeId: string) => void
  setSelectedSize: (sizeId: string) => void
  setQuantity: (quantity: number) => void
  reset: () => void
}

export const useQuickShopStore = create<QuickShopState>((set) => ({
  isOpen: false,
  product: null,
  selectedShade: null,
  selectedSize: null,
  quantity: 1,

  openQuickShop: (product) =>
    set({
      isOpen: true,
      product,
      selectedShade: product.shades?.[0]?.id || null,
      selectedSize: product.sizes?.find((s) => s.inStock)?.id || null,
      quantity: 1,
    }),

  closeQuickShop: () =>
    set({
      isOpen: false,
      product: null,
      selectedShade: null,
      selectedSize: null,
      quantity: 1,
    }),

  setSelectedShade: (shadeId) => set({ selectedShade: shadeId }),
  setSelectedSize: (sizeId) => set({ selectedSize: sizeId }),
  setQuantity: (quantity) => set({ quantity }),
  reset: () =>
    set({
      isOpen: false,
      product: null,
      selectedShade: null,
      selectedSize: null,
      quantity: 1,
    }),
}))

