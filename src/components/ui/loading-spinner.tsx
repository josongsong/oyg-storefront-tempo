import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export function LoadingSpinner({ size = 'lg', className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className={cn(
            sizeClasses[size],
            'rounded-full border-2 border-gray-200 border-t-black animate-spin'
          )}
        />
      </div>
      {text && (
        <p className="text-sm text-gray-600 animate-pulse font-light tracking-wide">{text}</p>
      )}
    </div>
  )
}

// Alternative elegant spinner with dots
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-black rounded-full animate-bounce" />
    </div>
  )
}

// Minimal pulse loader
export function LoadingPulse({ className, text }: { className?: string; text?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
        <div className="w-3 h-3 bg-black rounded-full animate-pulse [animation-delay:0.2s]" />
        <div className="w-3 h-3 bg-black rounded-full animate-pulse [animation-delay:0.4s]" />
      </div>
      {text && (
        <p className="text-sm text-gray-600 font-light tracking-wide">{text}</p>
      )}
    </div>
  )
}

