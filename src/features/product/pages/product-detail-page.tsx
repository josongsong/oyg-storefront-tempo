import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Truck, Package, Store, ChevronRight } from 'lucide-react'

import { DeliveryOption, ProductImageGallery } from '@/features/product/components'
import { 
  ProductDetailLoading, 
  ProductDetailHeader, 
  ProductActions,
  ProductReviews,
  ProductRecommendations 
} from '@/features/product/components/detail'
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

      {/* Reviews */}
      <ProductReviews
        product={product}
        displayedReviews={displayedReviews}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onLoadMore={() => setDisplayedReviews(prev => prev + 10)}
      />

      {/* Recommended Products */}
      <ProductRecommendations products={recommendedProducts} />
      
      </div>
    </div>
  )
}

Component.displayName = 'ProductDetailPage'
