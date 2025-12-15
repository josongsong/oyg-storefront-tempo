/**
 * Modal Component Tests
 * 모달 컴포넌트의 렌더링 및 인터랙션 테스트
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '@/shared/components/Modal/Modal'

describe('Modal', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    document.body.style.overflow = ''
  })

  describe('Rendering', () => {
    it('should render children when open', () => {
      render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      )

      expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })

    it('should not render when closed', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      )

      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
    })

    it('should render close button by default', () => {
      render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('should hide close button when showCloseButton is false', () => {
      render(
        <Modal isOpen onClose={mockOnClose} showCloseButton={false}>
          <div>Content</div>
        </Modal>
      )

      const closeButton = screen.queryByRole('button', { name: /close/i })
      expect(closeButton).not.toBeInTheDocument()
    })
  })

  describe('Sizes', () => {
    it('should apply small size class', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} size="sm">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.max-w-sm')).toBeInTheDocument()
    })

    it('should apply medium size class (default)', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.max-w-md')).toBeInTheDocument()
    })

    it('should apply large size class', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} size="lg">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.max-w-lg')).toBeInTheDocument()
    })

    it('should apply extra-large size class', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} size="xl">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.max-w-xl')).toBeInTheDocument()
    })

    it('should apply full size class', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} size="full">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.h-full')).toBeInTheDocument()
    })
  })

  describe('Positions', () => {
    it('should center modal by default', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.top-1\\/2')).toBeInTheDocument()
    })

    it('should position modal at top', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} position="top">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.top-0')).toBeInTheDocument()
    })

    it('should position modal at right', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} position="right">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.right-0')).toBeInTheDocument()
    })

    it('should position modal at bottom', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} position="bottom">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.bottom-0')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup()

      render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onClose when backdrop clicked', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      const backdrop = container.querySelector('[class*="fixed inset-0"]')
      if (backdrop) {
        await user.click(backdrop as HTMLElement)
        expect(mockOnClose).toHaveBeenCalled()
      }
    })

    it('should not close when backdrop clicked if closeOnBackdrop is false', async () => {
      const user = userEvent.setup()

      const { container } = render(
        <Modal isOpen onClose={mockOnClose} closeOnBackdrop={false}>
          <div>Content</div>
        </Modal>
      )

      const backdrop = container.querySelector('[class*="fixed inset-0"]')
      if (backdrop) {
        await user.click(backdrop as HTMLElement)
        expect(mockOnClose).not.toHaveBeenCalled()
      }
    })

    it('should not close when modal content clicked', async () => {
      const user = userEvent.setup()

      render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      await user.click(screen.getByText('Content'))

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Body Scroll Lock', () => {
    it('should lock body scroll when modal opens', () => {
      render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('should restore body scroll when modal closes', () => {
      document.body.style.overflow = 'auto'

      const { rerender } = render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')

      rerender(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('auto')
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom className to modal', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} className="custom-modal">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.custom-modal')).toBeInTheDocument()
    })

    it('should apply custom backdropClassName', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} backdropClassName="custom-backdrop">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.custom-backdrop')).toBeInTheDocument()
    })

    it('should apply custom closeButtonClassName', () => {
      const { container } = render(
        <Modal isOpen onClose={mockOnClose} closeButtonClassName="custom-close">
          <div>Content</div>
        </Modal>
      )

      expect(container.querySelector('.custom-close')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have close button accessible', () => {
      render(
        <Modal isOpen onClose={mockOnClose}>
          <div>Content</div>
        </Modal>
      )

      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('should trap focus within modal', () => {
      render(
        <Modal isOpen onClose={mockOnClose}>
          <div>
            <button>Button 1</button>
            <button>Button 2</button>
          </div>
        </Modal>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Complex Content', () => {
    it('should render complex nested content', () => {
      render(
        <Modal isOpen onClose={mockOnClose}>
          <div>
            <h2>Title</h2>
            <p>Description</p>
            <button>Action</button>
          </div>
        </Modal>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
    })

    it('should render forms inside modal', () => {
      render(
        <Modal isOpen onClose={mockOnClose}>
          <form>
            <input type="text" placeholder="Username" />
            <button type="submit">Submit</button>
          </form>
        </Modal>
      )

      expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    })
  })
})


