import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthPopupStore } from '@/features/auth/stores/auth-popup.store'

describe('useAuthPopupStore', () => {
  beforeEach(() => {
    useAuthPopupStore.setState({ isOpen: false })
  })

  it('should start closed', () => {
    expect(useAuthPopupStore.getState().isOpen).toBe(false)
  })

  it('should open popup', () => {
    useAuthPopupStore.getState().openPopup()
    expect(useAuthPopupStore.getState().isOpen).toBe(true)
  })

  it('should close popup', () => {
    useAuthPopupStore.getState().openPopup()
    useAuthPopupStore.getState().closePopup()
    expect(useAuthPopupStore.getState().isOpen).toBe(false)
  })

  it('should toggle state', () => {
    useAuthPopupStore.getState().openPopup()
    expect(useAuthPopupStore.getState().isOpen).toBe(true)
    
    useAuthPopupStore.getState().closePopup()
    expect(useAuthPopupStore.getState().isOpen).toBe(false)
  })
})
