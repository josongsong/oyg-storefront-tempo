import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type IconButtonVariant = 'default' | 'bordered'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  children: ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
  className?: string
}

const variantClasses: Record<IconButtonVariant, string> = {
  default: 'icon-btn',
  bordered: 'icon-btn-bordered',
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3',
}

export function IconButton({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

