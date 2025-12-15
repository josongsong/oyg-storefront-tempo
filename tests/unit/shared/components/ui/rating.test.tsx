import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Rating } from '@/shared/components/ui/rating'

describe('Rating', () => {
  describe('렌더링', () => {
    it('별점이 렌더링되어야 함', () => {
      render(<Rating rating={4} />)
      const ratingElement = screen.getByRole('img')
      expect(ratingElement).toBeInTheDocument()
      expect(ratingElement).toHaveAttribute('aria-label', 'Rating: 4 out of 5 stars')
    })

    it('최대 별점이 5개가 기본값이어야 함', () => {
      const { container } = render(<Rating rating={3} />)
      const stars = container.querySelectorAll('svg')
      expect(stars).toHaveLength(5)
    })

    it('커스텀 최대 별점을 설정할 수 있어야 함', () => {
      const { container } = render(<Rating rating={8} maxRating={10} />)
      const stars = container.querySelectorAll('svg')
      expect(stars).toHaveLength(10)
    })
  })

  describe('별점 표시', () => {
    it('정수 별점을 올바르게 표시해야 함', () => {
      const { container } = render(<Rating rating={3} />)
      const fullStars = container.querySelectorAll('.fill-current.stroke-current')
      expect(fullStars.length).toBeGreaterThanOrEqual(3)
    })

    it('0점을 표시할 수 있어야 함', () => {
      const { container } = render(<Rating rating={0} />)
      const emptyStars = container.querySelectorAll('.fill-none')
      expect(emptyStars).toHaveLength(5)
    })

    it('만점을 표시할 수 있어야 함', () => {
      const { container } = render(<Rating rating={5} />)
      const fullStars = container.querySelectorAll('.fill-current.stroke-current')
      expect(fullStars.length).toBeGreaterThanOrEqual(5)
    })

    it('반별(0.5)을 표시해야 함', () => {
      const { container } = render(<Rating rating={3.5} />)
      // 반별은 relative 클래스를 가진 div로 감싸집니다
      const halfStar = container.querySelector('.relative')
      expect(halfStar).toBeInTheDocument()
    })

    it('0.5 미만의 소수점은 반올림해야 함', () => {
      const { container: container1 } = render(<Rating rating={3.3} />)
      const halfStar1 = container1.querySelector('.relative')
      expect(halfStar1).not.toBeInTheDocument()
    })

    it('0.5 이상의 소수점은 반별로 표시해야 함', () => {
      const { container } = render(<Rating rating={3.7} />)
      const halfStar = container.querySelector('.relative')
      expect(halfStar).toBeInTheDocument()
    })

    it('최댓값을 초과하는 별점을 제한해야 함', () => {
      render(<Rating rating={10} maxRating={5} />)
      const ratingElement = screen.getByRole('img')
      expect(ratingElement).toHaveAttribute('aria-label', 'Rating: 5 out of 5 stars')
    })

    it('음수 별점을 0으로 제한해야 함', () => {
      render(<Rating rating={-2} />)
      const ratingElement = screen.getByRole('img')
      expect(ratingElement).toHaveAttribute('aria-label', 'Rating: 0 out of 5 stars')
    })
  })

  describe('크기', () => {
    it('sm 크기를 적용할 수 있어야 함', () => {
      const { container } = render(<Rating rating={4} size="sm" />)
      const star = container.querySelector('svg')
      expect(star).toHaveClass('w-3', 'h-3')
    })

    it('md 크기가 기본값이어야 함', () => {
      const { container } = render(<Rating rating={4} />)
      const star = container.querySelector('svg')
      expect(star).toHaveClass('w-5', 'h-5')
    })

    it('lg 크기를 적용할 수 있어야 함', () => {
      const { container } = render(<Rating rating={4} size="lg" />)
      const star = container.querySelector('svg')
      expect(star).toHaveClass('w-6', 'h-6')
    })
  })

  describe('별점 값 표시', () => {
    it('showValue가 false일 때 값을 표시하지 않아야 함', () => {
      render(<Rating rating={4.2} showValue={false} />)
      expect(screen.queryByText('4.2')).not.toBeInTheDocument()
    })

    it('showValue가 true일 때 값을 표시해야 함', () => {
      render(<Rating rating={4.2} showValue />)
      expect(screen.getByText('4.2')).toBeInTheDocument()
    })

    it('소수점 첫째 자리까지 표시해야 함', () => {
      render(<Rating rating={3.678} showValue />)
      expect(screen.getByText('3.7')).toBeInTheDocument()
    })
  })

  describe('스타일링', () => {
    it('커스텀 className을 적용할 수 있어야 함', () => {
      const { container } = render(<Rating rating={4} className="custom-class" />)
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('custom-class')
    })
  })
})

