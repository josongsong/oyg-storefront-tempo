import { create } from 'zustand'

export interface Toast {
  id: string
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
  timeoutId?: ReturnType<typeof setTimeout>
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type'], duration?: number) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (message, type = 'success', duration = 3000) => {
    const id = crypto.randomUUID()
    
    set((state) => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined
      
      // Auto remove after duration
      if (duration > 0) {
        timeoutId = setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
          }))
        }, duration)
      }
      
      const toast: Toast = { id, message, type, duration, timeoutId }
      
      // 최대 3개까지만 표시, 오래된 것부터 제거
      const newToasts = [...state.toasts, toast]
      const limitedToasts = newToasts.slice(-3)
      
      return { toasts: limitedToasts }
    })
  },
  
  removeToast: (id) => {
    set((state) => {
      // Clear timeout before removing
      const toast = state.toasts.find((t) => t.id === id)
      if (toast?.timeoutId) {
        clearTimeout(toast.timeoutId)
      }
      
      return {
        toasts: state.toasts.filter((t) => t.id !== id)
      }
    })
  },
  
  clearToasts: () => {
    set((state) => {
      // Clear all timeouts before clearing
      state.toasts.forEach((toast) => {
        if (toast.timeoutId) {
          clearTimeout(toast.timeoutId)
        }
      })
      
      return { toasts: [] }
    })
  }
}))

