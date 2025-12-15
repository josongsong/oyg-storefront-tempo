import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/shared/components/ui/button'

describe('Button', () => {
  describe('렌더링', () => {
    it('기본 버튼이 렌더링되어야 함', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('type이 기본값 button이어야 함', () => {
      render(<Button>Submit</Button>)
      expect(screen.getByText('Submit')).toHaveAttribute('type', 'button')
    })

    it('type을 submit으로 설정할 수 있어야 함', () => {
      render(<Button type="submit">Submit</Button>)
      expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit')
    })
  })

  describe('Variants', () => {
    it('primary 스타일이 적용되어야 함', () => {
      render(<Button variant="primary">Primary</Button>)
      const button = screen.getByText('Primary')
      expect(button).toHaveClass('bg-black', 'text-white')
    })

    it('secondary 스타일이 적용되어야 함', () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByText('Secondary')
      expect(button).toHaveClass('bg-gray-200', 'text-black')
    })

    it('outline 스타일이 적용되어야 함', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByText('Outline')
      expect(button).toHaveClass('border-2', 'border-black')
    })

    it('ghost 스타일이 적용되어야 함', () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByText('Ghost')
      expect(button).toHaveClass('hover:bg-gray-100')
    })
  })

  describe('Sizes', () => {
    it('sm 크기가 적용되어야 함', () => {
      render(<Button size="sm">Small</Button>)
      const button = screen.getByText('Small')
      expect(button).toHaveClass('px-4', 'py-2', 'text-xs')
    })

    it('md 크기가 기본값이어야 함', () => {
      render(<Button>Medium</Button>)
      const button = screen.getByText('Medium')
      expect(button).toHaveClass('px-6', 'py-2.5', 'text-sm')
    })

    it('lg 크기가 적용되어야 함', () => {
      render(<Button size="lg">Large</Button>)
      const button = screen.getByText('Large')
      expect(button).toHaveClass('px-8', 'py-3', 'text-base')
    })
  })

  describe('Props', () => {
    it('fullWidth가 작동해야 함', () => {
      render(<Button fullWidth>Full Width</Button>)
      const button = screen.getByText('Full Width')
      expect(button).toHaveClass('w-full')
    })

    it('icon을 렌더링할 수 있어야 함', () => {
      render(<Button icon={<span data-testid="icon">★</span>}>With Icon</Button>)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('disabled 상태가 작동해야 함', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByText('Disabled')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    it('isLoading 상태가 작동해야 함', () => {
      render(<Button isLoading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
      expect(button).toHaveClass('opacity-50')
    })

    it('loading 상태에서 스피너를 표시해야 함', () => {
      render(<Button isLoading>Loading</Button>)
      const spinner = document.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()
    })
  })

  describe('상호작용', () => {
    it('클릭 이벤트가 작동해야 함', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      render(<Button onClick={handleClick}>Click</Button>)
      
      await user.click(screen.getByText('Click'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('disabled 상태에서 클릭되지 않아야 함', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      render(<Button disabled onClick={handleClick}>Disabled</Button>)
      
      await user.click(screen.getByText('Disabled'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('loading 상태에서 클릭되지 않아야 함', async () => {
      const handleClick = vi.fn()
      const user = userEvent.setup()
      render(<Button isLoading onClick={handleClick}>Loading</Button>)
      
      await user.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })
})

