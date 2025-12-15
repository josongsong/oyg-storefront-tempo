import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useToastStore } from '@/app/stores/toast.store'

describe('useToastStore', () => {
  beforeEach(() => {
    // Clear all toasts and timeouts
    useToastStore.getState().clearToasts()
    
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Clear all toasts and timeouts
    useToastStore.getState().clearToasts()
    
    vi.restoreAllMocks()
  })

  describe('addToast', () => {
    it('should add toast with default type', () => {
      useToastStore.getState().addToast('Test message')

      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(1)
      expect(toasts[0].message).toBe('Test message')
      expect(toasts[0].type).toBe('success')
    })

    it('should add toast with custom type', () => {
      useToastStore.getState().addToast('Error message', 'error')

      const toasts = useToastStore.getState().toasts
      expect(toasts[0].type).toBe('error')
    })

    it('should add toast with custom duration', () => {
      useToastStore.getState().addToast('Message', 'info', 5000)

      const toasts = useToastStore.getState().toasts
      expect(toasts[0].duration).toBe(5000)
    })

    it('should limit to 3 toasts', () => {
      useToastStore.getState().addToast('Message 1')
      useToastStore.getState().addToast('Message 2')
      useToastStore.getState().addToast('Message 3')
      useToastStore.getState().addToast('Message 4')

      const toasts = useToastStore.getState().toasts
      expect(toasts).toHaveLength(3)
      expect(toasts[0].message).toBe('Message 2') // 첫 번째 제거됨
    })

    it('should auto-remove toast after duration', () => {
      useToastStore.getState().addToast('Test', 'success', 1000)

      expect(useToastStore.getState().toasts).toHaveLength(1)

      vi.advanceTimersByTime(1000)

      expect(useToastStore.getState().toasts).toHaveLength(0)
    })

    it('should not auto-remove if duration is 0', () => {
      useToastStore.getState().addToast('Test', 'success', 0)

      vi.advanceTimersByTime(5000)

      expect(useToastStore.getState().toasts).toHaveLength(1)
    })
  })

  describe('removeToast', () => {
    it('should remove specific toast', () => {
      useToastStore.getState().addToast('Toast 1')
      useToastStore.getState().addToast('Toast 2')

      const toasts = useToastStore.getState().toasts
      const firstId = toasts[0].id

      useToastStore.getState().removeToast(firstId)

      const remainingToasts = useToastStore.getState().toasts
      expect(remainingToasts).toHaveLength(1)
      expect(remainingToasts[0].message).toBe('Toast 2')
    })

    it('should handle removing non-existent toast', () => {
      useToastStore.getState().addToast('Toast 1')
      
      useToastStore.getState().removeToast('non-existent-id')

      expect(useToastStore.getState().toasts).toHaveLength(1)
    })
  })

  describe('clearToasts', () => {
    it('should remove all toasts', () => {
      useToastStore.getState().addToast('Toast 1')
      useToastStore.getState().addToast('Toast 2')
      useToastStore.getState().addToast('Toast 3')

      useToastStore.getState().clearToasts()

      expect(useToastStore.getState().toasts).toHaveLength(0)
    })

    it('should work on empty toast list', () => {
      useToastStore.getState().clearToasts()
      expect(useToastStore.getState().toasts).toHaveLength(0)
    })
  })

  describe('Toast ID generation', () => {
    it('should generate unique IDs', () => {
      useToastStore.getState().addToast('Toast 1')
      useToastStore.getState().addToast('Toast 2')

      const toasts = useToastStore.getState().toasts
      expect(toasts[0].id).not.toBe(toasts[1].id)
    })
  })
})
