import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useNotificationStore } from '@/features/notification/stores/notification.store'
import { Button } from '@/shared/components/ui/button'

// Simple test component
function NotificationTestComponent() {
  const { notifications, isOpen, addNotification, markAsRead, clearAll, toggleOpen, getUnreadCount } =
    useNotificationStore()

  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      <div data-testid="unread-count">{getUnreadCount()}</div>
      <div data-testid="is-open">{isOpen ? 'open' : 'closed'}</div>

      <Button onClick={toggleOpen}>Toggle</Button>
      <Button
        onClick={() =>
          addNotification({
            type: 'order',
            title: 'New Order',
            message: 'Your order has been placed',
          })
        }
      >
        Add Notification
      </Button>
      <Button onClick={() => notifications[0] && markAsRead(notifications[0].id)}>Mark First Read</Button>
      <Button onClick={clearAll}>Clear All</Button>

      <div data-testid="notifications-list">
        {notifications.map((n) => (
          <div key={n.id} data-testid={`notification-${n.id}`}>
            {n.title} - {n.isRead ? 'read' : 'unread'}
          </div>
        ))}
      </div>
    </div>
  )
}

describe('Notification Flow Integration', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      notifications: [],
      isOpen: false,
    })
  })

  describe('알림 추가 플로우', () => {
    it('알림을 추가할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<NotificationTestComponent />)

      expect(screen.getByTestId('notification-count')).toHaveTextContent('0')

      await user.click(screen.getByText('Add Notification'))

      await waitFor(() => {
        expect(screen.getByTestId('notification-count')).toHaveTextContent('1')
      })

      expect(screen.getByText(/New Order/)).toBeInTheDocument()
    })

    it('여러 알림을 추가할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<NotificationTestComponent />)

      await user.click(screen.getByText('Add Notification'))
      await user.click(screen.getByText('Add Notification'))
      await user.click(screen.getByText('Add Notification'))

      await waitFor(() => {
        expect(screen.getByTestId('notification-count')).toHaveTextContent('3')
      })
    })
  })

  describe('읽음 표시 플로우', () => {
    it('알림을 읽음으로 표시할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<NotificationTestComponent />)

      await user.click(screen.getByText('Add Notification'))

      await waitFor(() => {
        expect(screen.getByText(/unread/)).toBeInTheDocument()
      })

      await user.click(screen.getByText('Mark First Read'))

      await waitFor(() => {
        expect(screen.getByText(/read/)).toBeInTheDocument()
      })
    })

    it('읽지 않은 알림 개수가 정확해야 함', async () => {
      const user = userEvent.setup()
      render(<NotificationTestComponent />)

      await user.click(screen.getByText('Add Notification'))
      await user.click(screen.getByText('Add Notification'))

      await waitFor(() => {
        expect(screen.getByTestId('unread-count')).toHaveTextContent('2')
      })

      await user.click(screen.getByText('Mark First Read'))

      await waitFor(() => {
        expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
      })
    })
  })

  describe('알림 센터 토글 플로우', () => {
    it('알림 센터를 열고 닫을 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<NotificationTestComponent />)

      expect(screen.getByTestId('is-open')).toHaveTextContent('closed')

      await user.click(screen.getByText('Toggle'))

      await waitFor(() => {
        expect(screen.getByTestId('is-open')).toHaveTextContent('open')
      })

      await user.click(screen.getByText('Toggle'))

      await waitFor(() => {
        expect(screen.getByTestId('is-open')).toHaveTextContent('closed')
      })
    })
  })

  describe('전체 삭제 플로우', () => {
    it('모든 알림을 삭제할 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<NotificationTestComponent />)

      await user.click(screen.getByText('Add Notification'))
      await user.click(screen.getByText('Add Notification'))

      await waitFor(() => {
        expect(screen.getByTestId('notification-count')).toHaveTextContent('2')
      })

      await user.click(screen.getByText('Clear All'))

      await waitFor(() => {
        expect(screen.getByTestId('notification-count')).toHaveTextContent('0')
      })
    })
  })

  describe('완전한 알림 플로우', () => {
    it('알림 추가 -> 읽음 표시 -> 삭제 플로우가 작동해야 함', async () => {
      const user = userEvent.setup()
      render(<NotificationTestComponent />)

      // 1. 알림 추가
      await user.click(screen.getByText('Add Notification'))
      await waitFor(() => {
        expect(screen.getByTestId('unread-count')).toHaveTextContent('1')
      })

      // 2. 읽음 표시
      await user.click(screen.getByText('Mark First Read'))
      await waitFor(() => {
        expect(screen.getByTestId('unread-count')).toHaveTextContent('0')
      })

      // 3. 전체 삭제
      await user.click(screen.getByText('Clear All'))
      await waitFor(() => {
        expect(screen.getByTestId('notification-count')).toHaveTextContent('0')
      })
    })
  })
})

