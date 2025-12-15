import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingSpinner, LoadingDots, LoadingPulse } from '@/shared/components/ui/loading-spinner'

describe('LoadingSpinner', () => {
  describe('렌더링', () => {
    it('스피너가 렌더링되어야 함', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })

    it('텍스트 없이 렌더링할 수 있어야 함', () => {
      render(<LoadingSpinner />)
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    it('텍스트와 함께 렌더링할 수 있어야 함', () => {
      render(<LoadingSpinner text="Loading..." />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })
  })

  describe('크기', () => {
    it('sm 크기를 적용할 수 있어야 함', () => {
      const { container } = render(<LoadingSpinner size="sm" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-6', 'h-6')
    })

    it('md 크기를 적용할 수 있어야 함', () => {
      const { container } = render(<LoadingSpinner size="md" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-10', 'h-10')
    })

    it('lg 크기가 기본값이어야 함', () => {
      const { container } = render(<LoadingSpinner />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-16', 'h-16')
    })

    it('xl 크기를 적용할 수 있어야 함', () => {
      const { container } = render(<LoadingSpinner size="xl" />)
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toHaveClass('w-24', 'h-24')
    })
  })

  describe('스타일링', () => {
    it('커스텀 className을 적용할 수 있어야 함', () => {
      const { container } = render(<LoadingSpinner className="custom-class" />)
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })
})

describe('LoadingDots', () => {
  it('3개의 점이 렌더링되어야 함', () => {
    const { container } = render(<LoadingDots />)
    const dots = container.querySelectorAll('.animate-bounce')
    expect(dots).toHaveLength(3)
  })

  it('커스텀 className을 적용할 수 있어야 함', () => {
    const { container } = render(<LoadingDots className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('LoadingPulse', () => {
  it('3개의 펄스가 렌더링되어야 함', () => {
    const { container } = render(<LoadingPulse />)
    const pulses = container.querySelectorAll('.animate-pulse')
    expect(pulses.length).toBeGreaterThanOrEqual(3)
  })

  it('텍스트 없이 렌더링할 수 있어야 함', () => {
    render(<LoadingPulse />)
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  it('텍스트와 함께 렌더링할 수 있어야 함', () => {
    render(<LoadingPulse text="Please wait..." />)
    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('커스텀 className을 적용할 수 있어야 함', () => {
    const { container } = render(<LoadingPulse className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

