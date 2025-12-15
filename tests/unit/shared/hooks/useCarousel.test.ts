import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useCarousel } from '@/shared/hooks/useCarousel'

describe('useCarousel', () => {
  let mockContainer: HTMLDivElement

  beforeEach(() => {
    // Mock container element
    mockContainer = document.createElement('div')
    mockContainer.id = 'test-carousel'
    mockContainer.scrollLeft = 0
    mockContainer.scrollTo = vi.fn()
    document.body.appendChild(mockContainer)
  })

  afterEach(() => {
    document.body.removeChild(mockContainer)
  })

  describe('scrollTo', () => {
    it('should scroll to specific position', () => {
      const { result } = renderHook(() => 
        useCarousel({ containerId: 'test-carousel' })
      )

      result.current.scrollTo(500)

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 500,
        behavior: 'smooth',
      })
    })

    it('should use auto behavior when smooth is false', () => {
      const { result } = renderHook(() => 
        useCarousel({ containerId: 'test-carousel', smooth: false })
      )

      result.current.scrollTo(500)

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 500,
        behavior: 'auto',
      })
    })

    it('should not error if container not found', () => {
      const { result } = renderHook(() => 
        useCarousel({ containerId: 'non-existent' })
      )

      expect(() => result.current.scrollTo(500)).not.toThrow()
    })
  })

  describe('scrollBy', () => {
    it('should scroll by amount', () => {
      mockContainer.scrollLeft = 100

      const { result } = renderHook(() => 
        useCarousel({ containerId: 'test-carousel' })
      )

      result.current.scrollBy(200)

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 300, // 100 + 200
        behavior: 'smooth',
      })
    })

    it('should scroll backward with negative amount', () => {
      mockContainer.scrollLeft = 500

      const { result } = renderHook(() => 
        useCarousel({ containerId: 'test-carousel' })
      )

      result.current.scrollBy(-200)

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 300, // 500 - 200
        behavior: 'smooth',
      })
    })
  })

  describe('scrollLeft', () => {
    it('should scroll left by 2x scrollAmount', () => {
      mockContainer.scrollLeft = 600

      const { result } = renderHook(() => 
        useCarousel({ 
          containerId: 'test-carousel',
          scrollAmount: 280 
        })
      )

      result.current.scrollLeft()

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 40, // 600 - (280 * 2)
        behavior: 'smooth',
      })
    })

    it('should use custom scrollAmount', () => {
      mockContainer.scrollLeft = 500

      const { result } = renderHook(() => 
        useCarousel({ 
          containerId: 'test-carousel',
          scrollAmount: 100 
        })
      )

      result.current.scrollLeft()

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 300, // 500 - (100 * 2)
        behavior: 'smooth',
      })
    })
  })

  describe('scrollRight', () => {
    it('should scroll right by 2x scrollAmount', () => {
      mockContainer.scrollLeft = 100

      const { result } = renderHook(() => 
        useCarousel({ 
          containerId: 'test-carousel',
          scrollAmount: 280 
        })
      )

      result.current.scrollRight()

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 660, // 100 + (280 * 2)
        behavior: 'smooth',
      })
    })

    it('should use custom scrollAmount', () => {
      mockContainer.scrollLeft = 100

      const { result } = renderHook(() => 
        useCarousel({ 
          containerId: 'test-carousel',
          scrollAmount: 150 
        })
      )

      result.current.scrollRight()

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 400, // 100 + (150 * 2)
        behavior: 'smooth',
      })
    })
  })

  describe('Options', () => {
    it('should use default scrollAmount of 280', () => {
      mockContainer.scrollLeft = 0

      const { result } = renderHook(() => 
        useCarousel({ containerId: 'test-carousel' })
      )

      result.current.scrollRight()

      expect(mockContainer.scrollTo).toHaveBeenCalledWith({
        left: 560, // 280 * 2
        behavior: 'smooth',
      })
    })

    it('should use smooth scroll by default', () => {
      const { result } = renderHook(() => 
        useCarousel({ containerId: 'test-carousel' })
      )

      result.current.scrollTo(100)

      expect(mockContainer.scrollTo).toHaveBeenCalledWith(
        expect.objectContaining({ behavior: 'smooth' })
      )
    })
  })
})
