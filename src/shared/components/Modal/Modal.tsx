import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  position?: 'center' | 'top' | 'right' | 'bottom'
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
  className?: string
  backdropClassName?: string
  closeButtonClassName?: string
}

const sizeClasses = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
  xl: 'w-full max-w-xl',
  full: 'w-full h-full',
}

const positionClasses = {
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  top: 'top-0 left-1/2 -translate-x-1/2',
  right: 'top-0 right-0 h-full',
  bottom: 'bottom-0 left-1/2 -translate-x-1/2',
}

const positionAnimations = {
  center: {
    initial: { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' },
    animate: { opacity: 1, scale: 1, y: '-50%', x: '-50%' },
    exit: { opacity: 0, scale: 0.95, y: '-50%', x: '-50%' },
  },
  top: {
    initial: { opacity: 0, y: -100, x: '-50%' },
    animate: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: -100, x: '-50%' },
  },
  right: {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100%' },
  },
  bottom: {
    initial: { opacity: 0, y: 100, x: '-50%' },
    animate: { opacity: 1, y: 0, x: '-50%' },
    exit: { opacity: 0, y: 100, x: '-50%' },
  },
}

export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  position = 'center',
  closeOnBackdrop = true,
  showCloseButton = true,
  className,
  backdropClassName,
  closeButtonClassName,
}: ModalProps) {
  // Prevent body scroll when modal is open (backup)
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className={cn('fixed inset-0 bg-black/50 z-40', backdropClassName)}
          />

          {/* Modal */}
          <motion.div
            {...positionAnimations[position]}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'fixed z-50 bg-white',
              position !== 'right' && position !== 'bottom' && 'mx-4',
              sizeClasses[size],
              positionClasses[position],
              position === 'right' && 'shadow-2xl',
              position === 'center' && 'rounded-lg shadow-2xl',
              className
            )}
          >
            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10',
                  closeButtonClassName
                )}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Content */}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

