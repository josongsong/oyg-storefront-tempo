import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Truck, Package, Store } from 'lucide-react'

import { ProductCard } from '@/features/product/components'
import { ProductComparison, DeliveryOption, ProductImageGallery, ReviewCard } from '@/features/product/components'
import { ProductDetailLoading, ProductDetailHeader, ProductActions } from '@/features/product/components/detail'
import { useProductDetail } from '@/features/product/hooks/useProductDetail'
import { useToastStore } from '@/app/stores'

export function Component() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const { addToast } = useToastStore()
  
  const {
    product,
    recommendedProducts,
    isLoading,
    selectedDeliveryOption,
    setSelectedDeliveryOption,
    quantity,
    setQuantity,
    isHoveringBasket,
    bubbles,
    handleAddToCart: handleAddToBasket,
    handleToggleWishlist,
    isInWishlist,
  } = useProductDetail(slug)

  const INITIAL_REVIEWS_COUNT = 3
  const [displayedReviews, setDisplayedReviews] = useState(INITIAL_REVIEWS_COUNT)
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent')

  if (isLoading) {
    return <ProductDetailLoading />
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-lg text-gray-500 mb-4">Product not found</div>
        <button
          onClick={() => navigate('/products')}
          className="text-sm underline hover:no-underline"
        >
          Back to products
        </button>
      </div>
    )
  }

  const images = product.detailed_images.length > 0 ? product.detailed_images : product.images
  const hasDiscount = product.list_price && parseFloat(product.list_price) > parseFloat(product.sale_price)

  // Review data
  const reviews = product.reviews?.reviews || []
  const rollup = product.reviews?.rollup
  const ratingHistogram = rollup?.rating_histogram || [0, 0, 0, 0, 0]
  const reviewMedia = rollup?.media || []
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
  
  // Get most helpful positive and negative reviews
  const positiveReviews = reviews.filter(r => r.rating >= 4).sort((a, b) => b.helpful_votes - a.helpful_votes)
  const negativeReviews = reviews.filter(r => r.rating <= 2).sort((a, b) => b.helpful_votes - a.helpful_votes)
  const mostHelpfulPositive = positiveReviews[0]
  const mostHelpfulNegative = negativeReviews[0]

  return (
    <div className="w-full">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-8">
      
      {/* Main Product Section */}
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 mb-12 md:mb-20">
        {/* Left: Images - Sticky */}
        <ProductImageGallery images={images} productName={product.product_name} />

        {/* Right: Product Info - Scrollable */}
        <div className="space-y-3 md:space-y-4">
          <ProductDetailHeader
            product={product}
            onBrandClick={(brand) => navigate(`/products?brand=${brand}`)}
            onCategoryClick={(cat) => navigate(`/products?category=${cat}`)}
          />

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl md:text-3xl font-bold">${product.sale_price}</span>
              {hasDiscount && (
                <span className="text-lg text-gray-400 line-through">${product.list_price}</span>
              )}
            </div>
            
            {/* Payment Options */}
            <div className="text-xs text-gray-600 flex flex-wrap items-center gap-1">
              <span>or 4 payments of ${(parseFloat(product.sale_price) / 4).toFixed(2)} with</span>
              <span className="font-semibold">Klarna</span>
              <span>or</span>
              <span className="font-semibold text-green-600">Afterpay</span>
              <span>or</span>
              <span className="font-semibold text-blue-600">PayPal</span>
            </div>
            
            {/* Auto-Replenish Offer */}
            {selectedDeliveryOption === 'auto-replenish' && (
              <div className="mt-2 text-sm">
                <span className="text-red-600 font-medium">
                  Get It For ${(parseFloat(product.sale_price) * 0.95).toFixed(2)} (5% Off)
                </span>
                <span className="text-gray-600"> With Auto-Replenish</span>
              </div>
            )}
          </div>

          {/* Size Selection */}
          <div>
            <div className="text-sm font-medium mb-2">Size: 1.7 oz / 50 mL</div>
            <button className="px-4 py-2 border-2 border-black rounded text-sm font-medium hover:bg-gray-50 transition-all">
              1.7 oz / 50 mL
            </button>
          </div>

          {/* Delivery Options */}
          <div>
            <div className="grid grid-cols-2 gap-2.5">
              <DeliveryOption
                id="free-shipping"
                icon={<Truck className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform duration-300" />}
                title={
                  <span className="font-medium">
                    <span className="text-blue-600 hover:underline">Sign in</span> for FREE shipping
                  </span>
                }
                isSelected={selectedDeliveryOption === 'free-shipping'}
                onClick={() => setSelectedDeliveryOption('free-shipping')}
              />

              <DeliveryOption
                id="auto-replenish"
                icon={
                  <div className="w-6 h-6 border border-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                }
                title={<span className="font-bold">Auto-Replenish</span>}
                subtitle="Save 5% on this item"
                isSelected={selectedDeliveryOption === 'auto-replenish'}
                onClick={() => setSelectedDeliveryOption('auto-replenish')}
              />

              <DeliveryOption
                id="same-day"
                icon={
                  <svg className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
                title={<span className="font-medium">Same-Day Delivery</span>}
                badge={<div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                isSelected={selectedDeliveryOption === 'same-day'}
                onClick={() => setSelectedDeliveryOption('same-day')}
              />

              <DeliveryOption
                id="pickup"
                icon={<Store className="w-6 h-6 text-gray-700 group-hover:scale-110 transition-transform duration-300" />}
                title={<span className="font-medium">Buy Online & Pick Up</span>}
                isSelected={selectedDeliveryOption === 'pickup'}
                onClick={() => setSelectedDeliveryOption('pickup')}
              />
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border-2 border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x-2 border-gray-300 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <ProductActions
              isInWishlist={isInWishlist}
              isHoveringBasket={isHoveringBasket}
              bubbles={bubbles}
              onAddToCart={handleAddToBasket}
              onToggleWishlist={handleToggleWishlist}
              onWishlistSuccess={(message) => addToast(message, 'success', 2000)}
            />
          </div>

          {/* Summary */}
          <div className="pt-3 md:pt-4 border-t border-gray-200">
            <h3 className="text-sm md:text-base font-medium mb-1.5 md:mb-2">Summary</h3>
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{product.summary}</p>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-0 border-t border-gray-200">
            {/* Details */}
            <details className="group border-b border-gray-200">
              <summary className="py-3 md:py-3.5 cursor-pointer flex items-center justify-between">
                <span className="text-xs md:text-sm font-medium">Details</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="pb-3 md:pb-4 text-xs md:text-sm text-gray-700 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: product.details }} />
              </div>
            </details>

            {/* How to Use */}
            {product.how_to_use && (
              <details className="group border-b border-gray-200">
                <summary className="py-3 md:py-3.5 cursor-pointer flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium">How to Use</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-open:rotate-90" />
                </summary>
                <div className="pb-3 md:pb-4 text-xs md:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.how_to_use}
                </div>
              </details>
            )}

            {/* Ingredients */}
            {product.ingredients.length > 0 && (
              <details className="group border-b border-gray-200">
                <summary className="py-3 md:py-3.5 cursor-pointer flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium">Ingredients</span>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-open:rotate-90" />
                </summary>
                <div className="pb-3 md:pb-4 text-xs md:text-sm text-gray-700 leading-relaxed">
                  {product.ingredients.join(', ')}
                </div>
              </details>
            )}

            {/* Shipping & Coupon Restrictions */}
            <details className="group border-b border-gray-200">
              <summary className="py-3 md:py-3.5 cursor-pointer flex items-center justify-between">
                <span className="text-xs md:text-sm font-medium">Shipping & Coupon Restrictions</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="pb-3 md:pb-4 text-xs md:text-sm text-gray-700 leading-relaxed">
                <p>This brand is excluded from most Ulta Beauty coupons.</p>
                <p className="mt-2">Standard shipping is free on orders over $35.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <div className="mb-12 md:mb-20">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <h2 className="text-xl md:text-2xl font-normal">We think you'll like</h2>
            <div className="hidden md:flex gap-2">
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {recommendedProducts.slice(0, 6).map((product) => (
                <div key={product.id} className="w-56 shrink-0">
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      brand: product.brand,
                      price: product.price,
                      rating: product.rating,
                      reviews: product.reviewCount,
                      image: product.image,
                      badge: product.badge,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendedProducts.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  price: product.price,
                  rating: product.rating,
                  reviews: product.reviewCount,
                  image: product.image,
                  badge: product.badge,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Similar Products Section */}
      {recommendedProducts.length > 6 && (
        <div className="mb-12 md:mb-20">
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <h2 className="text-xl md:text-2xl font-normal">Similar items for you</h2>
            <div className="hidden md:flex gap-2">
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-3 pb-2">
              {recommendedProducts.slice(6, 12).map((product) => (
                <div key={product.id} className="w-56 shrink-0">
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      brand: product.brand,
                      price: product.price,
                      rating: product.rating,
                      reviews: product.reviewCount,
                      image: product.image,
                      badge: product.badge,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendedProducts.slice(6, 12).map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  price: product.price,
                  rating: product.rating,
                  reviews: product.reviewCount,
                  image: product.image,
                  badge: product.badge,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product Comparison Section */}
      {product && recommendedProducts.length > 0 && (
        <div className="mb-12 md:mb-20">
          <ProductComparison
            currentProduct={{
              id: product.product_id,
              name: product.product_name.replace(product.brand, '').trim(),
              brand: product.brand,
              image: product.images[0] || product.detailed_images[0],
              price: `$${product.sale_price}`,
              rating: parseFloat(product.rating_avg),
              reviewCount: parseInt(product.rating_count),
              specialFeatures: product.tags?.special_features,
            }}
            similarProducts={recommendedProducts}
          />
        </div>
      )}

      {/* Review Section */}
      <div className="mb-12 md:mb-20">
        <div className="border-t border-gray-200 pt-6 md:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3">
            <h2 className="text-xl md:text-2xl font-normal">Reviews</h2>
            <button 
              onClick={() => navigate(`/products/${slug}/write-review`)}
              className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-2.5 border-2 border-black hover:bg-black hover:text-white transition-colors text-xs md:text-sm font-medium uppercase"
            >
              Write A REVIEW
            </button>
          </div>

          {/* Rating Summary */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 md:w-6 md:h-6 fill-none stroke-current stroke-[1.5] ${
                          i < Math.floor(averageRating)
                            ? 'text-black'
                            : i < averageRating
                            ? 'text-black opacity-50'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-3xl md:text-4xl font-bold">{averageRating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {totalReviews.toLocaleString()} Reviews
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                <h3 className="text-xs font-medium uppercase mb-3">RATINGS DISTRIBUTION</h3>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingHistogram[star - 1] || 0
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                  return (
                    <div key={star} className="flex items-center gap-3 text-xs">
                      <span className="w-12">{star} Stars</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-gray-600">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold mb-2">{Math.round(recommendedRatio * 100)}%</div>
                <p className="text-xs md:text-sm text-gray-600">
                  would recommend this<br />product to a friend
                </p>
              </div>
            </div>
          </div>

          {/* Pros & Cons / Most Helpful Reviews */}
          {(mostHelpfulPositive || mostHelpfulNegative) && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* Most Helpful Positive */}
              {mostHelpfulPositive && (
                <div className="border border-gray-200 rounded-lg p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium uppercase">Most Helpful Positive Review</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 fill-none stroke-current stroke-[1.5] ${
                            i < mostHelpfulPositive.rating
                              ? 'text-black'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">{mostHelpfulPositive.headline}</h4>
                  <p className="text-xs md:text-sm text-gray-700 line-clamp-3">
                    {mostHelpfulPositive.comments}
                  </p>
                </div>
              )}

              {/* Most Helpful Critical */}
              {mostHelpfulNegative && (
                <div className="border border-gray-200 rounded-lg p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium uppercase">Most Helpful Critical Review</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 fill-none stroke-current stroke-[1.5] ${
                            i < mostHelpfulNegative.rating
                              ? 'text-black'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">{mostHelpfulNegative.headline}</h4>
                  <p className="text-xs md:text-sm text-gray-700 line-clamp-3">
                    {mostHelpfulNegative.comments}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Review Media Gallery */}
          {reviewMedia.length > 0 && (
            <div className="mb-8">
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {reviewMedia.slice(0, 12).map((media) => (
                  <div key={media.id} className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={media.uri}
                      alt={media.caption || ''}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 border-t border-b border-gray-200 py-4">
            <div className="text-sm font-medium">
              Filter ratings
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-gray-600">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful' | 'highest' | 'lowest')}
                className="text-xs md:text-sm font-medium border-b-2 border-black bg-transparent outline-none cursor-pointer"
              >
                <option value="recent">Most recent</option>
                <option value="helpful">Most helpful</option>
                <option value="highest">Highest rating</option>
                <option value="lowest">Lowest rating</option>
              </select>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {displayReviews.map((review) => (
              <ReviewCard key={review.review_id} review={review} />
            ))}
          </div>

          {/* Load More */}
          {displayedReviews < reviews.length && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600 mb-4">
                Showing {displayedReviews} of {reviews.length} reviews
              </p>
              <button
                onClick={() => setDisplayedReviews(prev => Math.min(prev + 10, reviews.length))}
                className="px-6 py-2.5 border-2 border-black hover:bg-black hover:text-white transition-colors text-sm font-medium"
              >
                Read more reviews
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

Component.displayName = 'ProductDetailPage'
