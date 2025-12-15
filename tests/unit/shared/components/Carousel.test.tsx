/**
 * Carousel Component Tests
 * 캐러셀 컴포넌트의 렌더링 및 네비게이션 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Carousel } from '@/shared/components/Carousel/Carousel'

// Mock useCarousel hook
vi.mock('@/shared/hooks/useCarousel', () => ({
  useCarousel: vi.fn(() => ({
    scrollLeft: vi.fn(),
    scrollRight: vi.fn(),
  })),
}))

describe('Carousel', () => {
  const mockItems = [
    <div key="1">Item 1</div>,
    <div key="2">Item 2</div>,
    <div key="3">Item 3</div>,
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all children', () => {
      render(
        <Carousel id="test-carousel">
          {mockItems}
        </Carousel>
      )

      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(screen.getByText('Item 2')).toBeInTheDocument()
      expect(screen.getByText('Item 3')).toBeInTheDocument()
    })

    it('should render with correct id', () => {
      const { container } = render(
        <Carousel id="custom-id">
          {mockItems}
        </Carousel>
      )

      expect(container.querySelector('#custom-id')).toBeInTheDocument()
    })

    it('should apply gap classes', () => {
      const { container } = render(
        <Carousel id="test" gap={4}>
          {mockItems}
        </Carousel>
      )

      expect(container.querySelector('.gap-4')).toBeInTheDocument()
    })

    it('should show navigation by default', () => {
      render(
        <Carousel id="test">
          {mockItems}
        </Carousel>
      )

      expect(screen.getByLabelText(/previous/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/next/i)).toBeInTheDocument()
    })

    it('should hide navigation when showNavigation is false', () => {
      render(
        <Carousel id="test" showNavigation={false}>
          {mockItems}
        </Carousel>
      )

      expect(screen.queryByLabelText(/previous/i)).not.toBeInTheDocument()
      expect(screen.queryByLabelText(/next/i)).not.toBeInTheDocument()
    })
  })

  describe('Navigation Positions', () => {
    it('should render outside navigation by default', () => {
      const { container } = render(
        <Carousel id="test">
          {mockItems}
        </Carousel>
      )

      // Outside navigation은 mb-4 클래스를 가짐
      expect(container.querySelector('.mb-4')).toBeInTheDocument()
    })

    it('should render inside navigation when position is inside', () => {
      render(
        <Carousel id="test" navigationPosition="inside">
          {mockItems}
        </Carousel>
      )

      // Inside navigation은 absolute positioning
      const prevBtn = screen.getByLabelText(/previous/i)
      const nextBtn = screen.getByLabelText(/next/i)

      expect(prevBtn).toBeInTheDocument()
      expect(nextBtn).toBeInTheDocument()
    })
  })

  describe('Navigation Variants', () => {
    it('should render default navigation variant', () => {
      render(
        <Carousel id="test" navigationVariant="default">
          {mockItems}
        </Carousel>
      )

      expect(screen.getByLabelText(/previous/i)).toBeInTheDocument()
    })

    it('should render minimal navigation variant', () => {
      render(
        <Carousel id="test" navigationVariant="minimal">
          {mockItems}
        </Carousel>
      )

      expect(screen.getByLabelText(/previous/i)).toBeInTheDocument()
    })

    it('should render shadow navigation variant', () => {
      render(
        <Carousel id="test" navigationVariant="shadow">
          {mockItems}
        </Carousel>
      )

      expect(screen.getByLabelText(/previous/i)).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call scrollLeft when previous button clicked', async () => {
      const user = userEvent.setup()
      const mockScrollLeft = vi.fn()

      vi.mocked(await import('@/shared/hooks/useCarousel')).useCarousel.mockReturnValue({
        scrollLeft: mockScrollLeft,
        scrollRight: vi.fn(),
      } as any)

      render(
        <Carousel id="test">
          {mockItems}
        </Carousel>
      )

      const prevBtn = screen.getByLabelText(/previous/i)
      await user.click(prevBtn)

      expect(mockScrollLeft).toHaveBeenCalledTimes(1)
    })

    it('should call scrollRight when next button clicked', async () => {
      const user = userEvent.setup()
      const mockScrollRight = vi.fn()

      vi.mocked(await import('@/shared/hooks/useCarousel')).useCarousel.mockReturnValue({
        scrollLeft: vi.fn(),
        scrollRight: mockScrollRight,
      } as any)

      render(
        <Carousel id="test">
          {mockItems}
        </Carousel>
      )

      const nextBtn = screen.getByLabelText(/next/i)
      await user.click(nextBtn)

      expect(mockScrollRight).toHaveBeenCalledTimes(1)
    })
  })

  describe('Gap Variations', () => {
    it('should apply gap-0', () => {
      const { container } = render(
        <Carousel id="test" gap={0}>
          {mockItems}
        </Carousel>
      )

      expect(container.querySelector('.gap-0')).toBeInTheDocument()
    })

    it('should apply gap-2', () => {
      const { container } = render(
        <Carousel id="test" gap={2}>
          {mockItems}
        </Carousel>
      )

      expect(container.querySelector('.gap-2')).toBeInTheDocument()
    })

    it('should apply gap-8', () => {
      const { container } = render(
        <Carousel id="test" gap={8}>
          {mockItems}
        </Carousel>
      )

      expect(container.querySelector('.gap-8')).toBeInTheDocument()
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <Carousel id="test" className="custom-carousel">
          {mockItems}
        </Carousel>
      )

      expect(container.querySelector('.custom-carousel')).toBeInTheDocument()
    })
  })

  describe('Item Width', () => {
    it('should use default item width', () => {
      const mockUseCarousel = vi.fn()

      vi.mocked(await import('@/shared/hooks/useCarousel')).useCarousel = mockUseCarousel.mockReturnValue({
        scrollLeft: vi.fn(),
        scrollRight: vi.fn(),
      })

      render(
        <Carousel id="test">
          {mockItems}
        </Carousel>
      )

      expect(mockUseCarousel).toHaveBeenCalledWith({
        containerId: 'test',
        scrollAmount: 280,
      })
    })

    it('should use custom item width', () => {
      const mockUseCarousel = vi.fn()

      vi.mocked(await import('@/shared/hooks/useCarousel')).useCarousel = mockUseCarousel.mockReturnValue({
        scrollLeft: vi.fn(),
        scrollRight: vi.fn(),
      })

      render(
        <Carousel id="test" itemWidth={400}>
          {mockItems}
        </Carousel>
      )

      expect(mockUseCarousel).toHaveBeenCalledWith({
        containerId: 'test',
        scrollAmount: 400,
      })
    })
  })

  describe('Empty State', () => {
    it('should render without children', () => {
      const { container } = render(
        <Carousel id="test">
          {[]}
        </Carousel>
      )

      expect(container.querySelector('#test')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible navigation buttons', () => {
      render(
        <Carousel id="test">
          {mockItems}
        </Carousel>
      )

      const prevBtn = screen.getByLabelText(/previous/i)
      const nextBtn = screen.getByLabelText(/next/i)

      expect(prevBtn).toHaveAttribute('aria-label')
      expect(nextBtn).toHaveAttribute('aria-label')
    })

    it('should be keyboard navigable', () => {
      render(
        <Carousel id="test">
          {mockItems}
        </Carousel>
      )

      const prevBtn = screen.getByLabelText(/previous/i)
      const nextBtn = screen.getByLabelText(/next/i)

      expect(prevBtn.tagName).toBe('BUTTON')
      expect(nextBtn.tagName).toBe('BUTTON')
    })
  })
})


