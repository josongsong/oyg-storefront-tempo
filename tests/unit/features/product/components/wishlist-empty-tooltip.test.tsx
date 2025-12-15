import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WishlistEmptyTooltip } from '@/features/product/components/wishlist-empty-tooltip'

describe('WishlistEmptyTooltip', () => {
  const mockOnClose = vi.fn()
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    mockOnLogin.mockClear()
  })

  it('should render when isOpen is true', async () => {
    render(
      <WishlistEmptyTooltip
        isOpen={true}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("Don't lose your wishlist!")).toBeInTheDocument()
    })
  })

  it('should not render when isOpen is false', () => {
    render(
      <WishlistEmptyTooltip
        isOpen={false}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    )

    expect(screen.queryByText("Don't lose your wishlist!")).not.toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    render(
      <WishlistEmptyTooltip
        isOpen={true}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("Don't lose your wishlist!")).toBeInTheDocument()
    })

    const closeButtons = screen.getAllByRole('button')
    const closeButton = closeButtons.find(btn => btn.querySelector('svg'))
    
    if (closeButton) {
      fireEvent.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    }
  })

  it('should call onClose when backdrop is clicked', async () => {
    const { container } = render(
      <WishlistEmptyTooltip
        isOpen={true}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("Don't lose your wishlist!")).toBeInTheDocument()
    })

    const backdrop = container.querySelector('.fixed.inset-0')
    if (backdrop) {
      fireEvent.click(backdrop)
      expect(mockOnClose).toHaveBeenCalled()
    }
  })

  it('should call onLogin and onClose when login button is clicked', async () => {
    render(
      <WishlistEmptyTooltip
        isOpen={true}
        onClose={mockOnClose}
        onLogin={mockOnLogin}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Login or sign up')).toBeInTheDocument()
    })

    const loginButton = screen.getByText('Login or sign up')
    fireEvent.click(loginButton)

    expect(mockOnLogin).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
