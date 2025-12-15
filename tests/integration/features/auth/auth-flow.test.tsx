import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAuthPopupStore } from '@/features/auth/stores/auth-popup.store'
import { useUserStore } from '@/features/auth/stores/user.store'
import { Button } from '@/shared/components/ui/button'

// Simple test component to simulate auth flow
function AuthTestComponent() {
  const { openPopup, mode } = useAuthPopupStore()
  const { user, isAuthenticated } = useUserStore()

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? `Logged in as ${user?.name}` : 'Not logged in'}
      </div>
      <div data-testid="popup-mode">{mode}</div>
      <Button onClick={() => openPopup('login')}>Login</Button>
      <Button onClick={() => openPopup('register')}>Register</Button>
    </div>
  )
}

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    useAuthPopupStore.setState({
      isOpen: false,
      mode: 'login',
    })
    useUserStore.setState({
      user: null,
      isAuthenticated: false,
    })
  })

  describe('초기 상태', () => {
    it('로그인되지 않은 상태여야 함', () => {
      render(<AuthTestComponent />)
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not logged in')
    })
  })

  describe('팝업 모드 전환', () => {
    it('로그인 팝업을 열 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<AuthTestComponent />)

      await user.click(screen.getByText('Login'))

      const { isOpen, mode } = useAuthPopupStore.getState()
      expect(isOpen).toBe(true)
      expect(mode).toBe('login')
    })

    it('회원가입 팝업을 열 수 있어야 함', async () => {
      const user = userEvent.setup()
      render(<AuthTestComponent />)

      await user.click(screen.getByText('Register'))

      const { isOpen, mode } = useAuthPopupStore.getState()
      expect(isOpen).toBe(true)
      expect(mode).toBe('register')
    })
  })

  describe('로그인 플로우', () => {
    it('로그인 후 사용자 정보가 설정되어야 함', async () => {
      render(<AuthTestComponent />)

      // Simulate successful login
      useUserStore.getState().setUser({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      })

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in as Test User')
      })

      const { isAuthenticated } = useUserStore.getState()
      expect(isAuthenticated).toBe(true)
    })
  })

  describe('로그아웃 플로우', () => {
    it('로그아웃 후 사용자 정보가 초기화되어야 함', async () => {
      render(<AuthTestComponent />)

      // Login first
      useUserStore.getState().setUser({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      })

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged in as Test User')
      })

      // Logout
      useUserStore.getState().clearUser()

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not logged in')
      })

      const { isAuthenticated, user } = useUserStore.getState()
      expect(isAuthenticated).toBe(false)
      expect(user).toBeNull()
    })
  })

  describe('팝업 상태 관리', () => {
    it('팝업을 열고 닫을 수 있어야 함', () => {
      const { openPopup, closePopup } = useAuthPopupStore.getState()

      openPopup('login')
      expect(useAuthPopupStore.getState().isOpen).toBe(true)
      expect(useAuthPopupStore.getState().mode).toBe('login')

      closePopup()
      expect(useAuthPopupStore.getState().isOpen).toBe(false)
    })

    it('모드를 전환할 수 있어야 함', () => {
      const { openPopup, switchMode } = useAuthPopupStore.getState()

      openPopup('login')
      expect(useAuthPopupStore.getState().mode).toBe('login')

      switchMode()
      expect(useAuthPopupStore.getState().mode).toBe('register')

      switchMode()
      expect(useAuthPopupStore.getState().mode).toBe('login')
    })
  })
})

