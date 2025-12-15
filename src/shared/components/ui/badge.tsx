import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

type BadgeVariant = 'default' | 'premium' | 'danger' | 'success' | 'info'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'badge-default',
  premium: 'badge-premium',
  danger: 'badge-danger',
  success: 'bg-[var(--color-success)] text-white',
  info: 'bg-[var(--color-info)] text-white',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('badge', variantClasses[variant], className)}>
      {children}
    </span>
  )
}

interface CountBadgeProps {
  count: number
  className?: string
}

export function CountBadge({ count, className }: CountBadgeProps) {
  if (count === 0) return null
  
  return (
    <span className={cn('count-badge', className)}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

