import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  brand: string
  price: string
  image: string
  rating?: number
  reviews?: number
  badge?: string
}

interface WishlistState {
  items: WishlistItem[]
  isOpen: boolean
  showEmptyTooltip: boolean
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  toggleItem: (item: WishlistItem) => void
  openWishlist: () => void
  closeWishlist: () => void
  toggleWishlist: () => void
  getTotalItems: () => number
  openEmptyTooltip: () => void
  closeEmptyTooltip: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      showEmptyTooltip: false,

      addItem: (item) => {
        const items = get().items
        const exists = items.some((i) => i.id === item.id)
        
        if (!exists) {
          set({ items: [...items, item] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id)
      },

      toggleItem: (item) => {
        const isInList = get().isInWishlist(item.id)
        if (isInList) {
          get().removeItem(item.id)
        } else {
          get().addItem(item)
        }
      },

      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: () => {
        set({ isOpen: !get().isOpen })
      },
      getTotalItems: () => get().items.length,
      openEmptyTooltip: () => set({ showEmptyTooltip: true }),
      closeEmptyTooltip: () => set({ showEmptyTooltip: false }),
    }),
    {
      name: 'oliveyoung-wishlist',
      partialize: (state) => ({
        items: state.items,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate wishlist:', error)
        }
      },
    }
  )
)

