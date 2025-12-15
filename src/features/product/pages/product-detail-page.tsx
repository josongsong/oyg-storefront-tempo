import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, Star, Package, Truck, Store, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { loadProductById, loadAllProducts } from '@/features/product/utils'
import { Breadcrumb } from '@/shared/components/ui'
import { ProductCard } from '@/features/product/components'
import { ProductComparison, DeliveryOption, ProductImageGallery, ReviewCard } from '@/features/product/components'
import { useCartStore } from '@/features/cart/stores'
import { useWishlistStore } from '@/features/product/stores'
import { useToastStore } from '@/app/stores'
import type { ProductData, ProductListItem } from '@/features/product/types'

export function Component() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { addToast } = useToastStore()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [recommendedProducts, setRecommendedProducts] = useState<ProductListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<'free-shipping' | 'auto-replenish' | 'same-day' | 'pickup'>('auto-replenish')
  const [displayedReviews, setDisplayedReviews] = useState(3)
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent')
  const [quantity, setQuantity] = useState(1)
  const [isHoveringBasket, setIsHoveringBasket] = useState(false)
  const [bubbles, setBubbles] = useState<{ id: number; x: number }[]>([])

  // Load product data
  useEffect(() => {
    const loadData = async () => {
      if (!slug) return

      setIsLoading(true)
      
      // Load the specific product
      const productData = await loadProductById(slug)
      setProduct(productData)

      // Load all products for recommendations
      const products = await loadAllProducts()

      // Get random recommended products
      if (productData) {
        // Shuffle products and take random 12
        const shuffled = [...products].sort(() => Math.random() - 0.5)
        const randomProducts = shuffled.slice(0, 12)
        setRecommendedProducts(randomProducts)
      }

      setIsLoading(false)
    }

    loadData()
  }, [slug])

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Modern Spinner */}
        <div className="relative mb-8">
          {/* Outer rotating rings */}
          <div className="relative w-24 h-24">
            {/* Ring 1 */}
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-black rounded-full animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            
            {/* Ring 2 - slower, opposite direction */}
            <div 
              className="absolute inset-2 border-3 border-transparent border-b-gray-400 rounded-full"
              style={{ 
                animation: 'spin 1.5s linear infinite reverse',
              }}
            ></div>
            
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Loading text with dots animation */}
        <div className="flex items-center gap-1">
          <p className="text-base font-medium text-gray-800">Loading product</p>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
        
        {/* Subtle brand message */}
        <p className="mt-2 text-sm text-gray-500">Preparing your beauty experience</p>
      </div>
    )
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

  const handleAddToBasket = () => {
    if (!product) return

    addItem({
      productId: product.product_id,
      name: product.product_name,
      brand: product.brand,
      image: product.images[0] || product.detailed_images[0],
      price: parseFloat(product.sale_price),
      originalPrice: product.list_price ? parseFloat(product.list_price) : undefined,
      quantity: quantity,
    })

    // Success feedback is handled by cart store toast
  }

  return (
    <div className="w-full">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => navigate('/') },
          ...product.categories.slice(1).map((cat) => ({
            label: cat,
            onClick: () => navigate(`/products?category=${cat}`),
          })),
        ]}
      />

      {/* Main Product Section */}
      <div className="grid md:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 mb-12 md:mb-20">
        {/* Left: Images - Sticky */}
        <ProductImageGallery images={images} productName={product.product_name} />

        {/* Right: Product Info - Scrollable */}
        <div className="space-y-3 md:space-y-4">
          {/* Brand */}
          <div>
            <button
              onClick={() => navigate(`/products?brand=${product.brand}`)}
              className="text-xs md:text-sm font-medium underline underline-offset-2 hover:no-underline"
            >
              {product.brand}
            </button>
          </div>

          {/* Product Name */}
          <h1 className="text-xl md:text-2xl lg:text-3xl font-normal leading-tight">{product.product_name.replace(product.brand, '').trim()}</h1>

          {/* Rating */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 fill-none stroke-current stroke-[1.5] ${
                    i < Math.floor(parseFloat(product.rating_avg))
                      ? 'text-black'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating_avg}</span>
            <button className="text-sm hover:underline">
              ({parseInt(product.rating_count).toLocaleString()})
            </button>
            <button className="text-sm text-blue-600 hover:underline ml-2">
              Ask a question
            </button>
            <button className="text-sm flex items-center gap-1 ml-2">
              <Heart className="w-4 h-4" />
              {Math.floor(Math.random() * 20)}K
            </button>
          </div>

          {/* Tags */}
          {product.tags.special_features && (
            <div className="text-xs text-gray-600">
              Highly rated by customers for:{' '}
              <span className="text-blue-600">
                {product.tags.special_features.slice(0, 3).join(', ')}
              </span>
            </div>
          )}

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
            <div className="flex gap-2">
              <motion.button 
                onClick={handleAddToBasket}
                onMouseEnter={() => {
                  setIsHoveringBasket(true)
                  // Generate bubbles
                  const interval = setInterval(() => {
                    setBubbles(prev => [...prev, { 
                      id: Date.now() + Math.random(), 
                      x: Math.random() * 100 
                    }])
                  }, 150)
                  setTimeout(() => clearInterval(interval), 1000)
                }}
                onMouseLeave={() => {
                  setIsHoveringBasket(false)
                  setBubbles([])
                }}
                className="relative flex-1 bg-black text-white py-3 px-6 text-sm font-bold uppercase tracking-wide overflow-hidden shadow-lg"
                animate={{ 
                  backgroundColor: isHoveringBasket 
                    ? ['#000000', '#00C73C', '#7DD321', '#00D98F', '#00C73C']
                    : '#000000',
                  boxShadow: isHoveringBasket 
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
                whileHover={{ 
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  backgroundColor: {
                    duration: isHoveringBasket ? 1.2 : 0.3,
                    ease: "easeInOut",
                    repeat: isHoveringBasket ? Infinity : 0
                  },
                  boxShadow: {
                    duration: 0.2,
                    ease: "easeOut"
                  },
                  scale: {
                    duration: 0.2
                  }
                }}
              >
                {/* Bubbles Animation - Green Oliveyoung Colors */}
                <AnimatePresence>
                  {bubbles.map((bubble) => {
                    // Random green color from Oliveyoung palette
                    const colors = ['#00C73C', '#7DD321', '#00D98F']
                    const color = colors[Math.floor(Math.random() * colors.length)]
                    
                    return (
                      <motion.div
                        key={bubble.id}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          width: `${Math.random() * 8 + 4}px`,
                          height: `${Math.random() * 8 + 4}px`,
                          backgroundColor: color,
                          boxShadow: `0 0 10px ${color}`
                        }}
                        initial={{ 
                          bottom: '10%',
                          left: `${bubble.x}%`,
                          opacity: 0,
                          scale: 0
                        }}
                        animate={{ 
                          bottom: '100%',
                          opacity: [0, 1, 0.9, 0.7, 0],
                          scale: [0, 1, 1.3, 1.5, 1.2],
                          x: [0, Math.random() * 20 - 10, Math.random() * 30 - 15]
                        }}
                        exit={{ 
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{ 
                          duration: 2,
                          ease: "easeOut"
                        }}
                        onAnimationComplete={() => {
                          setBubbles(prev => prev.filter(b => b.id !== bubble.id))
                        }}
                      />
                    )
                  })}
                </AnimatePresence>

                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Basket
                </span>

                {/* Green gradient shine effect on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(125, 211, 33, 0.3), transparent)'
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: isHoveringBasket ? '200%' : '-100%' }}
                  transition={{ 
                    duration: 0.8,
                    ease: "easeInOut",
                    repeat: isHoveringBasket ? Infinity : 0
                  }}
                />
              </motion.button>
              <motion.button 
                onClick={() => {
                  if (product) {
                    const isCurrentlyInWishlist = isInWishlist(product.product_id)
                    toggleItem({
                      id: product.product_id,
                      name: product.product_name,
                      brand: product.brand,
                      price: product.sale_price,
                      image: product.images[0] || product.detailed_images[0],
                      rating: parseFloat(product.rating_avg),
                      reviews: parseInt(product.rating_count),
                    })
                    
                    addToast(
                      isCurrentlyInWishlist 
                        ? 'Removed from wishlist' 
                        : 'Added to wishlist',
                      'success',
                      2000
                    )
                  }
                }}
                className={`p-3 border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
                  product && isInWishlist(product.product_id)
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-black hover:bg-gray-50'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    product && isInWishlist(product.product_id)
                      ? 'fill-red-500 text-red-500'
                      : 'fill-none text-black'
                  }`} 
                />
              </motion.button>
            </div>
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
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
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
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 border border-gray-300 hover:border-black transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
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
                onChange={(e) => setSortBy(e.target.value as any)}
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
