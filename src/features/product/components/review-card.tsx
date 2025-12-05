import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react'
import { Rating } from '@/components/ui/rating'

export interface Review {
  review_id: string | number
  nickname: string
  rating: number
  headline: string
  comments: string
  created_date: number
  location?: string
  helpful_votes: number
  not_helpful_votes: number
}

interface ReviewCardProps {
  review: Review
  onHelpful?: (reviewId: string | number) => void
  onNotHelpful?: (reviewId: string | number) => void
  onReport?: (reviewId: string | number) => void
}

export function ReviewCard({
  review,
  onHelpful,
  onNotHelpful,
  onReport,
}: ReviewCardProps) {
  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{review.nickname}</span>
          </div>
          <Rating rating={review.rating} size="sm" />
        </div>
        <span className="text-xs text-gray-500">
          {new Date(review.created_date * 1000).toLocaleDateString()}
        </span>
      </div>

      <h4 className="font-medium mb-2 text-sm md:text-base">{review.headline}</h4>
      <p className="text-xs md:text-sm text-gray-700 mb-3 leading-relaxed">
        {review.comments}
      </p>

      {review.location && (
        <p className="text-xs text-gray-500 mb-3">{review.location}</p>
      )}

      {/* Review Actions */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-gray-600">Is this review helpful?</span>
        <button
          type="button"
          onClick={() => onHelpful?.(review.review_id)}
          className="flex items-center gap-1 hover:text-black transition-colors"
          aria-label="Mark as helpful"
        >
          <ThumbsUp className="w-3 h-3" />
          <span>{review.helpful_votes}</span>
        </button>
        <button
          type="button"
          onClick={() => onNotHelpful?.(review.review_id)}
          className="flex items-center gap-1 hover:text-black transition-colors"
          aria-label="Mark as not helpful"
        >
          <ThumbsDown className="w-3 h-3" />
          <span>{review.not_helpful_votes}</span>
        </button>
        <button
          type="button"
          onClick={() => onReport?.(review.review_id)}
          className="flex items-center gap-1 hover:text-red-600 transition-colors ml-auto"
          aria-label="Report review"
        >
          <Flag className="w-3 h-3" />
          <span>Report</span>
        </button>
      </div>
    </div>
  )
}

