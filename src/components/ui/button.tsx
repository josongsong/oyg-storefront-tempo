import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion, type MotionProps } from 'framer-motion'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  children: ReactNode
  icon?: ReactNode
  isLoading?: boolean
  motionProps?: Omit<MotionProps, 'children'>
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white hover:bg-gray-800 transition-colors',
  secondary: 'bg-gray-200 text-black hover:bg-gray-300 transition-colors',
  outline: 'border-2 border-black hover:bg-black hover:text-white transition-colors',
  ghost: 'hover:bg-gray-100 transition-colors',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  isLoading = false,
  motionProps,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium uppercase tracking-wide flex items-center justify-center gap-2'
  const widthStyles = fullWidth ? 'w-full' : ''
  const disabledStyles = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''

  const className = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles}`.trim()

  if (motionProps) {
    return (
      <motion.button
        type={type}
        className={className}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...motionProps}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </motion.button>
    )
  }

  return (
    <button 
      type={type}
      className={className} 
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  )
}

