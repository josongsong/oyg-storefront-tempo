/**
 * Product Reviews Section Component
 * 리뷰 섹션 전체
 */

import { useNavigate } from 'react-router-dom'

import { ReviewCard } from '@/features/product/components'
import { Rating } from '@/shared/components/ui/rating'

import type { ProductData } from '@/features/product/types'

interface ProductReviewsProps {
  product: ProductData
  displayedReviews: number
  sortBy: 'recent' | 'helpful' | 'highest' | 'lowest'
  onSortChange: (sort: 'recent' | 'helpful' | 'highest' | 'lowest') => void
  onLoadMore: () => void
}

export function ProductReviews({
  product,
  displayedReviews,
  sortBy,
  onSortChange,
  onLoadMore,
}: ProductReviewsProps) {
  const navigate = useNavigate()
  
  const reviews = product.reviews?.reviews || []
  const rollup = product.reviews?.rollup
  const ratingHistogram = rollup?.rating_histogram || [0, 0, 0, 0, 0]
  const averageRating = rollup?.average_rating || parseFloat(product.rating_avg)
  const totalReviews = rollup?.review_count || parseInt(product.rating_count)
  const recommendedRatio = rollup?.recommended_ratio || 0

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.created_date - a.created_date
      case 'helpful':
        return b.helpful_votes - a.helpful_votes
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const displayReviews = sortedReviews.slice(0, displayedReviews)
  
  // Get most helpful reviews
  const positiveReviews = reviews.filter(r => r.rating >= 4).sort((a, b) => b.helpful_votes - a.helpful_votes)
  const negativeReviews = reviews.filter(r => r.rating <= 2).sort((a, b) => b.helpful_votes - a.helpful_votes)
  const mostHelpfulPositive = positiveReviews[0]
  const mostHelpfulNegative = negativeReviews[0]

  return (
    <div className="mt-12 md:mt-20">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        {/* Left: Rating Summary */}
        <div className="md:w-1/3">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Rating & Reviews</h2>
          
          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl md:text-5xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex flex-col pb-1">
              <Rating rating={averageRating} />
              <span className="text-xs text-gray-500 mt-1">{totalReviews} reviews</span>
            </div>
          </div>

          {/* Rating Histogram */}
          <div className="space-y-2 mb-6">
            {ratingHistogram.slice().reverse().map((count, idx) => {
              const star = 5 - idx
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
              
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-8">{star} star</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-gray-600">{count}</span>
                </div>
              )
            })}
          </div>

          {recommendedRatio > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">
                {Math.round(recommendedRatio * 100)}% of reviewers recommend this product
              </p>
            </div>
          )}

          <button
            onClick={() => navigate(`/products/${product.product_id}/write-review`)}
            className="w-full mt-6 bg-black text-white py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
          >
            Write a Review
          </button>
        </div>

        {/* Right: Reviews List */}
        <div className="md:w-2/3">
          {/* Sort */}
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-medium">Customer Reviews ({totalReviews})</h3>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'recent' | 'helpful' | 'highest' | 'lowest')}
              className="text-xs md:text-sm font-medium border-b-2 border-black bg-transparent outline-none cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Most Helpful Reviews */}
          {(mostHelpfulPositive || mostHelpfulNegative) && (
            <div className="mb-6 space-y-4">
              {mostHelpfulPositive && (
                <div>
                  <h4 className="text-sm font-semibold text-green-700 mb-2">Most Helpful Positive Review</h4>
                  <ReviewCard review={mostHelpfulPositive} />
                </div>
              )}
              {mostHelpfulNegative && (
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-2">Most Helpful Critical Review</h4>
                  <ReviewCard review={mostHelpfulNegative} />
                </div>
              )}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4 md:space-y-6">
            {displayReviews.map((review) => (
              <ReviewCard key={review.review_id} review={review} />
            ))}
          </div>

          {displayedReviews < sortedReviews.length && (
            <button
              onClick={onLoadMore}
              className="w-full mt-6 py-3 border-2 border-black text-sm font-bold uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
            >
              Load More Reviews ({sortedReviews.length - displayedReviews} more)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

