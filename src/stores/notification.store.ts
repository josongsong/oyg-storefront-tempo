import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  toggleOpen: () => void
  closeNotification: () => void
  getUnreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        // Initial sample data
        {
          id: '1',
          type: 'promotion',
          title: 'Special Discount Event',
          message: 'Up to 30% off on all Oliveyoung products! Check it out now.',
          timestamp: Date.now() - 3600000,
          isRead: false,
          link: '/promotions',
        },
        {
          id: '2',
          type: 'order',
          title: 'Delivery Complete',
          message: 'Your order has been delivered.',
          timestamp: Date.now() - 7200000,
          isRead: false,
          link: '/orders',
        },
        {
          id: '3',
          type: 'system',
          title: 'System Notice',
          message: 'Oliveyoung USA Times Square store now open!',
          timestamp: Date.now() - 86400000,
          isRead: true,
        },
      ],
      isOpen: false,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          isRead: false,
        }
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
          ),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        }))
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((notification) => notification.id !== id),
        }))
      },

      clearAll: () => {
        set({ notifications: [] })
      },

      toggleOpen: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      closeNotification: () => {
        set({ isOpen: false })
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.isRead).length
      },
    }),
    {
      name: 'notification-storage-v2',
    }
  )
)

