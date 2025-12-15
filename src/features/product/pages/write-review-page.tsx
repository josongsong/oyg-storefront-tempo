import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Star, Upload } from 'lucide-react'
import { motion } from 'framer-motion'

import { loadProductById } from '@/features/product/utils'
import type { ProductData, ReviewSubmitData } from '@/features/product/types'
import { useToastStore } from '@/app/stores'
import { productApi } from '@/features/product/api'

export function Component() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToast } = useToastStore()
  const [product, setProduct] = useState<ProductData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [headline, setHeadline] = useState('')
  const [comments, setComments] = useState('')
  const [recommend, setRecommend] = useState<boolean | null>(null)
  const [firstName, setFirstName] = useState('')
  const [location, setLocation] = useState('')
  const [email, setEmail] = useState('')
  const [images, setImages] = useState<File[]>([])

  // Load product data
  useEffect(() => {
    const loadData = async () => {
      if (!slug) return

      setIsLoading(true)
      const productData = await loadProductById(slug)
      setProduct(productData)
      setIsLoading(false)
    }

    loadData()
  }, [slug])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages((prev) => [...prev, ...files].slice(0, 5)) // Max 5 images
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (rating === 0) {
      addToast('별점을 선택해주세요', 'error')
      return
    }
    if (!headline.trim()) {
      addToast('리뷰 제목을 입력해주세요', 'error')
      return
    }
    if (!comments.trim()) {
      addToast('리뷰 내용을 입력해주세요', 'error')
      return
    }
    if (recommend === null) {
      addToast('추천 여부를 선택해주세요', 'error')
      return
    }
    if (!firstName.trim()) {
      addToast('이름을 입력해주세요', 'error')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      addToast('올바른 이메일을 입력해주세요', 'error')
      return
    }

    if (!product) return

    try {
      const submitData: ReviewSubmitData = {
        product_id: product.product_id,
        rating,
        headline: headline.trim(),
        comments: comments.trim(),
        recommend,
        first_name: firstName.trim(),
        location: location.trim() || undefined,
        email: email.trim(),
        images: images.length > 0 ? images : undefined,
      }

      await productApi.submitReview(submitData)
      addToast('리뷰가 성공적으로 등록되었습니다', 'success')
      navigate(`/products/${slug}`)
    } catch (error) {
      logger.error('Failed to submit review:', error)
      addToast('리뷰 등록에 실패했습니다. 다시 시도해주세요.', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
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

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-normal mb-8">Write a Review</h1>

        {/* Product Info */}
        <div className="flex items-center gap-4 pb-8 mb-8 border-b border-gray-200">
          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
            <img
              src={product.images[0] || product.detailed_images[0]}
              alt={product.product_name}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-normal">{product.product_name}</h2>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium uppercase tracking-wide mb-3">
              YOUR RATING
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-black stroke-black'
                        : 'fill-none stroke-black'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Headline */}
          <div>
            <label htmlFor="headline" className="block text-sm font-normal mb-2">
              Review Headline
            </label>
            <input
              id="headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="I would buy this product again and again"
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-base"
              maxLength={100}
            />
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-normal mb-2">
              Comments
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please do not include special characters such as @#$%& in your review."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-base resize-none"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              The most helpful reviews are 250 characters.
            </p>
          </div>

          {/* Bottom Line */}
          <div>
            <label className="block text-sm font-medium uppercase tracking-wide mb-3">
              BOTTOM LINE
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={recommend === true}
                  onChange={() => setRecommend(true)}
                  className="w-5 h-5 border-2 border-gray-300 checked:border-black"
                />
                <span className="text-base">Yes, I would recommend this to a friend</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={recommend === false}
                  onChange={() => setRecommend(false)}
                  className="w-5 h-5 border-2 border-gray-300 checked:border-black"
                />
                <span className="text-base">No, I would not recommend this to a friend</span>
              </label>
            </div>
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-normal mb-2">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Please do not include last name or email address in this field."
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-base"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-normal mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex. San Jose, CA"
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-base"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-normal mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address to mark your review as verified"
              className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none text-base"
            />
          </div>

          {/* Add an Image */}
          <div>
            <label className="block text-sm font-medium uppercase tracking-wide mb-3">
              ADD AN IMAGE
            </label>
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
              <Upload className="w-5 h-5" />
              <span className="text-sm font-medium uppercase">UPLOAD</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {images.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="text-xs text-gray-600">
                    {img.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              By submitting, you represent that you have read and agree to our{' '}
              <a href="#" className="text-red-600 underline hover:no-underline">
                Terms of Agreement
              </a>{' '}
              and our{' '}
              <a href="#" className="text-red-600 underline hover:no-underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full md:w-auto px-12 py-3.5 bg-black text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            SUBMIT REVIEW
          </motion.button>
        </form>
      </div>
    </div>
  )
}

Component.displayName = 'WriteReviewPage'
