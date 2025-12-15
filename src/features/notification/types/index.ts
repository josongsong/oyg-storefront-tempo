export type NotificationType = 'order' | 'promotion' | 'system' | 'review'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  link?: string
}

