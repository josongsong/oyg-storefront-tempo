import { Star } from 'lucide-react'

interface RatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

const sizeStyles = {
  sm: 'w-3 h-3 md:w-4 md:h-4',
  md: 'w-5 h-5 md:w-6 md:h-6',
  lg: 'w-6 h-6 md:w-7 md:h-7',
}

export function Rating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className = '',
}: RatingProps) {
  const clampedRating = Math.min(Math.max(rating, 0), maxRating)
  const fullStars = Math.floor(clampedRating)
  const hasHalfStar = clampedRating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${sizeStyles[size]} fill-current stroke-current text-black`}
          />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className={`${sizeStyles[size]} stroke-current text-black`} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className={`${sizeStyles[size]} fill-current stroke-current text-black`} />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${sizeStyles[size]} fill-none stroke-current stroke-[1.5] text-black`}
          />
        ))}
      </div>
      
      {showValue && (
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

