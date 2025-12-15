/**
 * Initial Notifications Data
 * Mock 데이터를 store에서 분리
 */

import type { Notification } from '../stores/notification.store'

export const createInitialNotifications = (): Notification[] => [
  {
    id: crypto.randomUUID(),
    type: 'promotion',
    title: 'Special Discount Event',
    message: 'Up to 30% off on all Oliveyoung products! Check it out now.',
    timestamp: Date.now() - 3600000,
    isRead: false,
    link: '/promotions',
  },
  {
    id: crypto.randomUUID(),
    type: 'order',
    title: 'Delivery Complete',
    message: 'Your order has been delivered.',
    timestamp: Date.now() - 7200000,
    isRead: false,
    link: '/orders',
  },
  {
    id: crypto.randomUUID(),
    type: 'system',
    title: 'System Notice',
    message: 'Oliveyoung USA Times Square store now open!',
    timestamp: Date.now() - 86400000,
    isRead: true,
  },
]

