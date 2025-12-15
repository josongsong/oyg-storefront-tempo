import { useState } from 'react'

import { usePromoPopupStore } from '@/features/promotion/stores'
import { Modal } from '@/shared/components/Modal'
import { logger } from '@/shared/utils/logger'

export function PromoPopup() {
  const { isOpen, closePopup } = usePromoPopupStore()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 이메일 제출 로직 추가
    logger.debug('Email submitted:', email)
    closePopup()
  }

  const handlePassClick = () => {
    closePopup()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closePopup}
      size="md"
      className="rounded-2xl overflow-hidden"
      closeButtonClassName="bg-white/90 hover:bg-white rounded-full shadow-lg"
    >
      <div className="relative">

        {/* Header with Green Gradient */}
        <div className="bg-gradient-to-r from-[#00b894] to-[#00d2a0] px-8 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-wider mb-2 text-white">
            OLIVE YOUNG
          </h1>
          <p className="text-sm tracking-wide text-white/90">K-Beauty & Beyond</p>
        </div>

        {/* Main Content */}
        <div className="px-8 py-10 text-center bg-white">
          {/* Special Offer Text */}
          <p className="text-xs tracking-[0.3em] text-gray-500 mb-3 uppercase">Special Offer</p>

          {/* Main Offer */}
          <h2 className="text-6xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-[#00b894] to-[#00d2a0] bg-clip-text text-transparent">
            15% OFF
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl font-medium mb-6 text-gray-700">YOUR FIRST ORDER</p>

          {/* Terms */}
          <p className="text-xs leading-relaxed mb-8 text-gray-500 max-w-md mx-auto">
            One coupon per customer. Cannot be combined with other promotions. Excludes new arrivals,
            travel sizes, sale items, limited editions and gift cards.
          </p>
        </div>

        {/* Footer Section with Light Gray Background */}
        <div className="bg-gray-50 px-8 py-8">
          {/* Email Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 mb-4 bg-white border border-gray-200 rounded-lg text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00b894] focus:border-transparent text-sm transition-all"
              required
            />

            {/* Agreement Text */}
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              By subscribing to Olive Young, you agree to our{' '}
              <button type="button" className="text-[#00b894] hover:text-[#00a078] underline">
                Terms of Use
              </button>{' '}
              and{' '}
              <button type="button" className="text-[#00b894] hover:text-[#00a078] underline">
                Privacy Policy
              </button>{' '}
              and consent to receiving marketing emails.
              <br />
              No purchase necessary.
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00b894] to-[#00d2a0] text-white py-4 font-semibold rounded-lg tracking-wide text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 mb-4"
            >
              GET MY DISCOUNT
            </button>
          </form>

          {/* Pass Button */}
          <button
            onClick={handlePassClick}
            className="w-full py-3 font-medium text-xs text-gray-500 hover:text-gray-700 transition-colors underline"
          >
            No thanks, I'll continue browsing
          </button>
        </div>
      </div>
    </Modal>
  )
}

