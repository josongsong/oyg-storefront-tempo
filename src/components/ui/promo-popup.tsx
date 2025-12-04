import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import { usePromoPopupStore } from '@/stores'

export function PromoPopup() {
  const { isOpen, closePopup } = usePromoPopupStore()
  const [email, setEmail] = useState('')
  const scrollPositionRef = useRef(0)

  // 모달이 열렸을 때 배경 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      scrollPositionRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll'
    } else {
      // 모달이 닫힐 때 스크롤 위치 복원
      const scrollY = scrollPositionRef.current
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflowY = ''
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 이메일 제출 로직 추가
    console.log('Email submitted:', email)
    closePopup()
  }

  const handlePassClick = () => {
    closePopup()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closePopup}
          >
            {/* Modal */}
            <motion.div
              className="relative bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

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
                <p className="text-lg md:text-xl font-medium mb-6 text-gray-700">
                  YOUR FIRST ORDER
                </p>

                {/* Terms */}
                <p className="text-xs leading-relaxed mb-8 text-gray-500 max-w-md mx-auto">
                  One coupon per customer. Cannot be combined with other promotions. 
                  Excludes new arrivals, travel sizes, sale items, limited editions and gift cards.
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
                    </button>
                    {' '}and{' '}
                    <button type="button" className="text-[#00b894] hover:text-[#00a078] underline">
                      Privacy Policy
                    </button>
                    {' '}and consent to receiving marketing emails.
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
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

