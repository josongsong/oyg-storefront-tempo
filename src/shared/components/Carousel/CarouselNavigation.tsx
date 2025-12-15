import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/utils'

export interface CarouselNavigationProps {
  onScrollLeft: () => void
  onScrollRight: () => void
  variant?: 'default' | 'minimal' | 'shadow'
  layout?: 'together' | 'split'
}

/**
 * 캐러셀 네비게이션 버튼
 */
export function CarouselNavigation({
  onScrollLeft,
  onScrollRight,
  variant = 'default',
  layout = 'together',
}: CarouselNavigationProps) {
  const buttonBaseClass = 'flex items-center justify-center transition-colors'

  const variantClasses = {
    default: 'w-10 h-10 border border-gray-300 hover:bg-gray-100',
    minimal: 'w-8 h-8 hover:bg-gray-100 rounded-full',
    shadow: 'w-12 h-12 bg-white/90 hover:bg-white shadow-lg',
  }

  const buttonClass = cn(buttonBaseClass, variantClasses[variant])

  if (layout === 'split') {
    return (
      <>
        <button onClick={onScrollLeft} className={buttonClass} aria-label="Previous">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={onScrollRight} className={buttonClass} aria-label="Next">
          <ChevronRight className="w-5 h-5" />
        </button>
      </>
    )
  }

  return (
    <div className="flex gap-2">
      <button onClick={onScrollLeft} className={buttonClass} aria-label="Previous">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={onScrollRight} className={buttonClass} aria-label="Next">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

