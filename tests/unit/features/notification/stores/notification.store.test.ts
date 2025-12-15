import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNotificationStore } from '@/features/notification/stores/notification.store'

describe('NotificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [],
      isOpen: false,
    })
  })

  describe('초기 상태', () => {
    it('알림이 비어있어야 함', () => {
      const { notifications } = useNotificationStore.getState()
      expect(notifications).toEqual([])
    })

    it('닫혀있어야 함', () => {
      const { isOpen } = useNotificationStore.getState()
      expect(isOpen).toBe(false)
    })
  })

  describe('addNotification', () => {
    it('새 알림을 추가할 수 있어야 함', () => {
      const { addNotification } = useNotificationStore.getState()
      
      addNotification({
        type: 'order',
        title: 'Test Notification',
        message: 'Test message',
      })
      
      const { notifications } = useNotificationStore.getState()
      expect(notifications).toHaveLength(1)
      expect(notifications[0].title).toBe('Test Notification')
      expect(notifications[0].type).toBe('order')
      expect(notifications[0].isRead).toBe(false)
    })

    it('알림에 ID와 timestamp가 자동 생성되어야 함', () => {
      const { addNotification } = useNotificationStore.getState()
      
      addNotification({
        type: 'promotion',
        title: 'Test',
        message: 'Test',
      })
      
      const { notifications } = useNotificationStore.getState()
      expect(notifications[0].id).toBeDefined()
      expect(notifications[0].timestamp).toBeDefined()
    })

    it('최대 50개까지만 저장되어야 함', () => {
      const { addNotification } = useNotificationStore.getState()
      
      // 51개 추가
      for (let i = 0; i < 51; i++) {
        addNotification({
          type: 'system',
          title: `Notification ${i}`,
          message: 'Test',
        })
      }
      
      const { notifications } = useNotificationStore.getState()
      expect(notifications).toHaveLength(50)
    })
  })

  describe('markAsRead', () => {
    it('특정 알림을 읽음으로 표시할 수 있어야 함', () => {
      const { addNotification, markAsRead } = useNotificationStore.getState()
      
      addNotification({
        type: 'order',
        title: 'Test',
        message: 'Test',
      })
      
      const { notifications: before } = useNotificationStore.getState()
      const notificationId = before[0].id
      
      markAsRead(notificationId)
      
      const { notifications: after } = useNotificationStore.getState()
      expect(after[0].isRead).toBe(true)
    })
  })

  describe('markAllAsRead', () => {
    it('모든 알림을 읽음으로 표시할 수 있어야 함', () => {
      const { addNotification, markAllAsRead } = useNotificationStore.getState()
      
      addNotification({ type: 'order', title: 'Test 1', message: 'Test' })
      addNotification({ type: 'promotion', title: 'Test 2', message: 'Test' })
      addNotification({ type: 'system', title: 'Test 3', message: 'Test' })
      
      markAllAsRead()
      
      const { notifications } = useNotificationStore.getState()
      expect(notifications.every((n) => n.isRead)).toBe(true)
    })
  })

  describe('removeNotification', () => {
    it('특정 알림을 삭제할 수 있어야 함', () => {
      const { addNotification, removeNotification } = useNotificationStore.getState()
      
      addNotification({ type: 'order', title: 'Test', message: 'Test' })
      
      const { notifications: before } = useNotificationStore.getState()
      const notificationId = before[0].id
      
      removeNotification(notificationId)
      
      const { notifications: after } = useNotificationStore.getState()
      expect(after).toHaveLength(0)
    })
  })

  describe('clearAll', () => {
    it('모든 알림을 삭제할 수 있어야 함', () => {
      const { addNotification, clearAll } = useNotificationStore.getState()
      
      addNotification({ type: 'order', title: 'Test 1', message: 'Test' })
      addNotification({ type: 'promotion', title: 'Test 2', message: 'Test' })
      
      clearAll()
      
      const { notifications } = useNotificationStore.getState()
      expect(notifications).toHaveLength(0)
    })
  })

  describe('toggleOpen', () => {
    it('열림/닫힘 상태를 토글할 수 있어야 함', () => {
      const { toggleOpen } = useNotificationStore.getState()
      
      toggleOpen()
      expect(useNotificationStore.getState().isOpen).toBe(true)
      
      toggleOpen()
      expect(useNotificationStore.getState().isOpen).toBe(false)
    })
  })

  describe('closeNotification', () => {
    it('알림 센터를 닫을 수 있어야 함', () => {
      const { toggleOpen, closeNotification } = useNotificationStore.getState()
      
      toggleOpen()
      closeNotification()
      
      const { isOpen } = useNotificationStore.getState()
      expect(isOpen).toBe(false)
    })
  })

  describe('getUnreadCount', () => {
    it('읽지 않은 알림 개수를 반환해야 함', () => {
      const { addNotification, markAsRead, getUnreadCount } = useNotificationStore.getState()
      
      addNotification({ type: 'order', title: 'Test 1', message: 'Test' })
      addNotification({ type: 'promotion', title: 'Test 2', message: 'Test' })
      addNotification({ type: 'system', title: 'Test 3', message: 'Test' })
      
      expect(getUnreadCount()).toBe(3)
      
      const { notifications } = useNotificationStore.getState()
      markAsRead(notifications[0].id)
      
      expect(getUnreadCount()).toBe(2)
    })
  })
})

