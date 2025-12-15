import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Package, Tag, AlertCircle, MessageSquare, X, Check, Trash2 } from 'lucide-react'
import { useNotificationStore } from '@/features/notification/stores'
import { useEffect, useRef } from 'react'
import type { Notification } from '@/features/notification/stores/notification.store'

const NOTIFICATION_ICONS = {
  order: Package,
  promotion: Tag,
  system: AlertCircle,
  review: MessageSquare,
}

const NOTIFICATION_COLORS = {
  order: 'text-gray-700',
  promotion: 'text-gray-700',
  system: 'text-gray-700',
  review: 'text-gray-700',
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLDivElement | null>
}

export function NotificationCenter({ isOpen, onClose, triggerRef }: NotificationCenterProps) {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, getUnreadCount } = useNotificationStore()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, triggerRef])

  // Calculate position based on trigger element
  const getPosition = () => {
    if (!triggerRef.current) return { top: 70, right: 20 }
    
    const rect = triggerRef.current.getBoundingClientRect()
    const isMobile = window.innerWidth < 768
    
    if (isMobile) {
      return {
        top: rect.bottom + 10,
        right: 10,
        left: 10,
      }
    }
    
    return {
      top: rect.bottom + 10,
      right: window.innerWidth - rect.right,
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.link) {
      // Navigate to link if needed
      logger.debug('Navigate to:', notification.link)
    }
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const unreadCount = getUnreadCount()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            ref={panelRef}
            className="fixed z-50 bg-white shadow-2xl overflow-hidden border border-gray-200"
            style={getPosition()}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          >
            <div className="w-full md:w-[420px] max-h-[calc(100vh-100px)] md:max-h-[600px] flex flex-col">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="p-2"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Bell className="w-4 h-4 text-gray-700" />
                    </motion.div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>Notifications</h3>
                      {unreadCount > 0 && (
                        <p className="text-xs text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>
                          Unread {unreadCount}
                        </p>
                      )}
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </motion.button>
                </div>

                {/* Action buttons */}
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <motion.button
                        onClick={markAllAsRead}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-black hover:bg-gray-800 transition-colors"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark all read
                      </motion.button>
                    )}
                    <motion.button
                      onClick={clearAll}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear all
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <motion.div
                      className="mb-4 p-4 bg-gray-100"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <Bell className="w-8 h-8 text-gray-400" />
                    </motion.div>
                    <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>No notifications</p>
                    <p className="text-xs text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>New notifications will appear here</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {notifications.map((notification, index) => {
                      const Icon = NOTIFICATION_ICONS[notification.type]
                      const colorClass = NOTIFICATION_COLORS[notification.type]

                      return (
                        <motion.div
                          key={notification.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                            delay: index * 0.03,
                          }}
                          className={`relative border-b border-gray-100 last:border-b-0 transition-colors ${
                            !notification.isRead ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div
                            className="px-5 py-4 cursor-pointer"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex gap-3">
                              {/* Icon */}
                              <div className={`shrink-0 p-2 ${colorClass}`}>
                                <Icon className="w-5 h-5" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.isRead && (
                                    <motion.div
                                      className="shrink-0 w-2 h-2 bg-[var(--color-danger)] rounded-full"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: 'spring', stiffness: 500 }}
                                    />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-500">
                                    {formatTime(notification.timestamp)}
                                  </span>
                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeNotification(notification.id)
                                    }}
                                    className="p-1 hover:bg-gray-200 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <X className="w-3.5 h-3.5 text-gray-400" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

