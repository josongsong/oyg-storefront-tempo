import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useModal } from '@/shared/hooks/useModal'

describe('useModal', () => {
  describe('Basic functionality', () => {
    it('should start closed by default', () => {
      const { result } = renderHook(() => useModal())
      expect(result.current.isOpen).toBe(false)
    })

    it('should start open with defaultOpen', () => {
      const { result } = renderHook(() => useModal({ defaultOpen: true }))
      expect(result.current.isOpen).toBe(true)
    })

    it('should open modal', () => {
      const { result } = renderHook(() => useModal())
      
      act(() => {
        result.current.open()
      })

      expect(result.current.isOpen).toBe(true)
    })

    it('should close modal', () => {
      const { result } = renderHook(() => useModal({ defaultOpen: true }))
      
      act(() => {
        result.current.close()
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should toggle modal', () => {
      const { result } = renderHook(() => useModal())
      
      act(() => {
        result.current.toggle()
      })
      expect(result.current.isOpen).toBe(true)

      act(() => {
        result.current.toggle()
      })
      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('Callbacks', () => {
    it('should call onOpen when opening', () => {
      const onOpen = vi.fn()
      const { result } = renderHook(() => useModal({ onOpen }))
      
      act(() => {
        result.current.open()
      })

      expect(onOpen).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when closing', () => {
      const onClose = vi.fn()
      const { result } = renderHook(() => useModal({ 
        defaultOpen: true,
        onClose 
      }))
      
      act(() => {
        result.current.close()
      })

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('ESC key handling', () => {
    it('should close on ESC key when open', () => {
      const { result } = renderHook(() => useModal({ defaultOpen: true }))
      
      expect(result.current.isOpen).toBe(true)

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' })
        window.dispatchEvent(event)
      })

      expect(result.current.isOpen).toBe(false)
    })

    it('should not close on ESC when closeOnEsc is false', () => {
      const { result } = renderHook(() => useModal({ 
        defaultOpen: true,
        closeOnEsc: false 
      }))
      
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' })
        window.dispatchEvent(event)
      })

      expect(result.current.isOpen).toBe(true)
    })

    it('should not close on other keys', () => {
      const { result } = renderHook(() => useModal({ defaultOpen: true }))
      
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Enter' })
        window.dispatchEvent(event)
      })

      expect(result.current.isOpen).toBe(true)
    })
  })

  describe('Scroll lock', () => {
    it('should lock scroll when modal opens', () => {
      const { result } = renderHook(() => useModal())
      
      act(() => {
        result.current.open()
      })

      expect(document.body.style.position).toBe('fixed')
      expect(document.body.style.overflowY).toBe('scroll')
    })

    it('should restore scroll when modal closes', () => {
      const { result } = renderHook(() => useModal({ defaultOpen: true }))
      
      act(() => {
        result.current.close()
      })

      expect(document.body.style.position).toBe('')
      expect(document.body.style.top).toBe('')
    })

    it('should not lock scroll when lockScroll is false', () => {
      const { result } = renderHook(() => useModal({ lockScroll: false }))
      
      act(() => {
        result.current.open()
      })

      expect(document.body.style.position).toBe('')
    })
  })
})
