import { Star } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface RatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

export function Rating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  showValue = false,
  className 
}: RatingProps) {
  const normalizedRating = Math.max(0, Math.min(rating, maxRating))
  const fullStars = Math.floor(normalizedRating)
  const hasHalfStar = normalizedRating % 1 >= 0.5

  return (
    <div 
      className={cn('flex items-center gap-1', className)} 
      role="img" 
      aria-label={`Rating: ${normalizedRating} out of ${maxRating} stars`}
      data-testid="rating-component"
    >
      {[...Array(maxRating)].map((_, i) => {
        const isFilled = i < fullStars
        const isHalf = i === fullStars && hasHalfStar
        const isEmpty = !isFilled && !isHalf
        
        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              isFilled && 'fill-black text-black fill-current stroke-current',
              isHalf && 'fill-black/50 text-black',
              isEmpty && 'fill-none text-gray-300'
            )}
            data-filled={isFilled}
            data-half={isHalf}
          />
        )
      })}
      {showValue && (
        <span className="text-sm text-gray-600 ml-1" data-testid="rating-value">
          {normalizedRating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
