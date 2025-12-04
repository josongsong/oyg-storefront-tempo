import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useToastStore } from './toast.store'

export interface CartItem {
  id: string
  productId: string
  name: string
  brand: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  sku?: string
  shade?: string
  shadeOptions?: string[]
  size?: string
  isNew?: boolean
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateShade: (id: string, shade: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // 같은 상품 + 같은 옵션(shade, size)이 있는지 확인
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.shade === item.shade &&
              i.size === item.size
          )

          if (existingItemIndex !== -1) {
            // 이미 있으면 수량만 증가
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += item.quantity
            
            // Show toast
            useToastStore.getState().addToast(
              `Updated ${item.name} quantity in cart`,
              'success',
              3000
            )
            
            return { items: newItems }
          } else {
            // 없으면 새로 추가
            const newItem: CartItem = {
              ...item,
              id: `${item.productId}-${Date.now()}`,
            }
            
            // Show toast
            useToastStore.getState().addToast(
              `Added ${item.name} to cart`,
              'success',
              3000
            )
            
            return { items: [...state.items, newItem] }
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }))
      },

      updateShade: (id, shade) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, shade } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

