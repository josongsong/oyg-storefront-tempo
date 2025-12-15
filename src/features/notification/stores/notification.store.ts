import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createInitialNotifications } from '../constants/initial-notifications'

export interface Notification {
  id: string
  type: 'order' | 'promotion' | 'system' | 'review'
  title: string
  message: string
  timestamp: number
  isRead: boolean
  link?: string
  imageUrl?: string
}

interface NotificationState {
  notifications: Notification[]
  isOpen: boolean
  
  // Commands
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  
  // UI Actions
  toggleOpen: () => void
  closeNotification: () => void
  
  // Queries
  getUnreadCount: () => number
}

const isDev = import.meta.env.DEV
const middleware = isDev ? devtools : ((f: any) => f)
const MAX_NOTIFICATIONS = 50

export const useNotificationStore = create<NotificationState>()(
  middleware(
    persist(
      immer<NotificationState>((set, get) => ({
        notifications: isDev ? createInitialNotifications() : [],
        isOpen: false,

        addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
          set((state: NotificationState) => {
            const newNotification: Notification = {
              ...notification,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              isRead: false,
            }
            state.notifications = [newNotification, ...state.notifications].slice(0, MAX_NOTIFICATIONS)
          })
        },

        markAsRead: (id: string) => {
          set((state: NotificationState) => {
            const notification = state.notifications.find((n: Notification) => n.id === id)
            if (notification) {
              notification.isRead = true
            }
          })
        },

        markAllAsRead: () => {
          set((state: NotificationState) => {
            state.notifications.forEach((n: Notification) => {
              n.isRead = true
            })
          })
        },

        removeNotification: (id: string) => {
          set((state: NotificationState) => {
            state.notifications = state.notifications.filter((n: Notification) => n.id !== id)
          })
        },

        clearAll: () => {
          set({ notifications: [] })
        },

        toggleOpen: () => {
          set((state: NotificationState) => { 
            state.isOpen = !state.isOpen 
          })
        },

        closeNotification: () => {
          set({ isOpen: false })
        },

        getUnreadCount: () => {
          return get().notifications.filter((n: Notification) => !n.isRead).length
        },
      })),
      {
        name: 'notification-storage-v2',
        partialize: (state: NotificationState) => ({ notifications: state.notifications }),
      }
    ),
    { name: 'NotificationStore', enabled: isDev }
  )
)

// Selector hooks
export const useNotifications = () => useNotificationStore((s) => s.notifications)
export const useUnreadCount = () => useNotificationStore((s) => s.getUnreadCount())
