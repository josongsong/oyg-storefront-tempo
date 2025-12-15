/**
 * Cart Store - Optimized with Immer
 */

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useToastStore } from '@/app/stores/toast.store'
import type { CartItem, CartItemId, CartItemOptions, CartSummary, ShippingInfo } from './types'
import { CartItemId as CartItemIdFactory, SHIPPING_OPTIONS, TAX_RATE, FREE_SHIPPING_THRESHOLD } from './types'
import type { ProductId, Price } from '@/entities/product'

interface CartState {
  // State
  items: Map<CartItemId, CartItem>
  shippingMethod: ShippingInfo['method']
  
  // Selectors
  getItem: (id: CartItemId) => CartItem | undefined
  getItems: () => CartItem[]
  getTotalItems: () => number
  getSummary: () => CartSummary
  hasItem: (productId: ProductId, options?: CartItemOptions) => boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void
  removeItem: (id: CartItemId) => void
  updateQuantity: (id: CartItemId, quantity: number) => void
  updateOptions: (id: CartItemId, options: Partial<CartItemOptions>) => void
  setShippingMethod: (method: ShippingInfo['method']) => void
  clear: () => void
}

const isDev = import.meta.env.DEV

const middleware = isDev ? devtools : ((f: any) => f)

export const useCartStore = create<CartState>()(
  middleware(
    persist(
      immer<CartState>((set, get) => ({
        items: new Map(),
        shippingMethod: 'standard',
        
        // Selectors
        getItem: (id: CartItemId) => {
          return get().items.get(id)
        },
        
        getItems: () => {
          return Array.from(get().items.values())
        },
        
        getTotalItems: () => {
          return Array.from(get().items.values())
            .reduce((sum, item) => sum + item.quantity, 0)
        },
        
        getSummary: () => {
          const items = Array.from(get().items.values())
          const subtotal = items.reduce(
            (sum, item) => sum + (item.price as number) * item.quantity,
            0
          ) as Price
          
          const savings = items.reduce(
            (sum, item) => {
              if (item.originalPrice) {
                return sum + ((item.originalPrice as number) - (item.price as number)) * item.quantity
              }
              return sum
            },
            0
          ) as Price | undefined
          
          const shippingInfo = SHIPPING_OPTIONS[get().shippingMethod]
          const shipping = (subtotal as number) >= (FREE_SHIPPING_THRESHOLD as number)
            ? (0 as Price)
            : shippingInfo.cost
          
          const tax = ((subtotal as number) * TAX_RATE) as Price
          const total = ((subtotal as number) + (shipping as number) + (tax as number)) as Price
          
          return {
            itemCount: get().getTotalItems(),
            subtotal,
            shipping,
            tax,
            total,
            savings: (savings as number) > 0 ? savings : undefined,
          }
        },
        
        hasItem: (productId: ProductId, options?: CartItemOptions) => {
          const items = Array.from(get().items.values())
          return items.some(item => 
            item.productId === productId &&
            (!options || (
              item.options?.shade === options.shade &&
              item.options?.size === options.size
            ))
          )
        },
        
        // Actions
        addItem: (item: Omit<CartItem, 'id' | 'quantity'>, quantity = 1) => {
          set((state: CartState) => {
            // Check if item with same product and options exists
            const itemsArray: CartItem[] = Array.from(state.items.values())
            const existingItem = itemsArray.find(
              (i) =>
                i.productId === item.productId &&
                i.options?.shade === item.options?.shade &&
                i.options?.size === item.options?.size
            )
            
            if (existingItem) {
              // Update quantity
              existingItem.quantity += quantity
              
              useToastStore.getState().addToast(
                'Quantity updated',
                'success',
                2000
              )
            } else {
              // Add new item
              const id = CartItemIdFactory.create(item.productId, item.options)
              const newItem: CartItem = {
                ...item,
                id,
                quantity,
              }
              
              state.items.set(id, newItem)
              
              useToastStore.getState().addToast(
                'Added to cart',
                'success',
                2000
              )
            }
          })
        },
        
        removeItem: (id: CartItemId) => {
          set((state: CartState) => {
            state.items.delete(id)
          })
        },
        
        updateQuantity: (id: CartItemId, quantity: number) => {
          set((state: CartState) => {
            const item = state.items.get(id)
            if (item) {
              item.quantity = Math.max(1, quantity)
            }
          })
        },
        
        updateOptions: (id: CartItemId, options: Partial<CartItemOptions>) => {
          set((state: CartState) => {
            const item = state.items.get(id)
            if (item && item.options) {
              Object.assign(item.options, options)
            }
          })
        },
        
        setShippingMethod: (method: ShippingInfo['method']) => {
          set((state: CartState) => {
            state.shippingMethod = method
          })
        },
        
        clear: () => {
          set((state: CartState) => {
            state.items.clear()
          })
        },
      })),
      {
        name: 'cart-storage',
        // Custom serialization for Map
        partialize: (state) => ({
          items: Array.from(state.items.entries()),
          shippingMethod: state.shippingMethod,
        }),
        merge: (persistedState: any, currentState) => {
          if (!persistedState || !persistedState.items) {
            return currentState
          }
          return {
            ...currentState,
            ...persistedState,
            items: new Map(persistedState.items || []),
          }
        },
        onRehydrateStorage: () => (_state, error) => {
          if (error) {
            console.error('Failed to rehydrate cart:', error)
          }
        },
      }
    ),
    { name: 'CartStore', enabled: isDev }
  )
)

// Selector hooks for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.getItems())
export const useCartTotalItems = () => useCartStore((state) => state.getTotalItems())
export const useCartSummary = () => useCartStore((state) => state.getSummary())
export const useCartItem = (id: CartItemId) => useCartStore((state) => state.getItem(id))
export const useHasCartItem = (productId: ProductId, options?: CartItemOptions) => 
  useCartStore((state) => state.hasItem(productId, options))

