import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import { useAuthPopupStore } from '@/stores'
import { localAuthService } from '@/services'

type AuthStep = 'email' | 'login' | 'register' | 'complete'

export function AuthPopup() {
  const { isOpen, closePopup } = useAuthPopupStore()
  const [step, setStep] = useState<AuthStep>('email')
  const [, setIsExistingUser] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // 기존 사용자 확인
      const existingUser = localAuthService.findUserByEmail(email)
      if (existingUser) {
        setIsExistingUser(true)
        setName(existingUser.name)
        setStep('login')
      } else {
        setIsExistingUser(false)
        setStep('register')
      }
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password) {
      const result = localAuthService.login(email, password)
      
      if (result.success) {
        setStep('complete')
        setTimeout(() => {
          closePopup()
          resetForm()
          window.location.reload()
        }, 2000)
      } else {
        alert(result.message || 'Login failed')
      }
    }
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && password) {
      const result = localAuthService.register(email, name, password, phone)
      
      if (result.success) {
        setStep('complete')
        setTimeout(() => {
          closePopup()
          resetForm()
          window.location.reload()
        }, 2000)
      } else {
        alert(result.message || 'Registration failed')
      }
    }
  }

  const resetForm = () => {
    setStep('email')
    setIsExistingUser(false)
    setEmail('')
    setName('')
    setPassword('')
    setPhone('')
  }

  const handleClose = () => {
    closePopup()
    setTimeout(resetForm, 300) // 애니메이션 후 리셋
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              layout
              className="relative bg-white w-full max-w-[650px] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>

              {/* Content */}
              <AnimatePresence mode="wait">
                {step === 'email' && (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Hero Image */}
                    <div className="w-full h-[280px] overflow-hidden">
                      <img
                        src="/cosmetics/s2895985-main-zoom.webp"
                        alt="Welcome"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Form Content */}
                    <div className="px-10 py-12">
                      <h2 className="text-3xl font-bold mb-4 text-center">
                        Welcome! We're so thrilled to have you here.
                      </h2>
                      
                      <p className="text-base mb-8 text-center leading-relaxed">
                        Pop your email address below. We'll check if there's an existing account, or, we can start a new one for you.
                      </p>

                      <form onSubmit={handleEmailSubmit}>
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2">
                            Email address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-b-black transition-colors"
                            placeholder="944899@gmail.com"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-black text-white py-4 font-medium text-base hover:bg-gray-800 transition-colors mb-4"
                        >
                          Next
                        </button>

                        <p className="text-xs text-gray-600 text-center leading-relaxed">
                          This site is protected by reCAPTCHA and the{' '}
                          <a href="#" className="underline hover:text-black">
                            Google Privacy Policy
                          </a>
                          {' '}and{' '}
                          <a href="#" className="underline hover:text-black">
                            Terms of Service
                          </a>
                          {' '}apply.
                        </p>
                      </form>
                    </div>
                  </motion.div>
                )}

                {step === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-10 py-12">
                      <h2 className="text-3xl font-bold mb-4 text-center">
                        Welcome back, {name}!
                      </h2>
                      
                      <p className="text-base mb-8 text-center leading-relaxed text-gray-600">
                        {email}
                      </p>

                      <form onSubmit={handleLoginSubmit}>
                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-b-black transition-colors"
                            placeholder="Enter your password"
                            required
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep('email')}
                            className="flex-1 bg-gray-200 text-black py-4 font-medium text-base hover:bg-gray-300 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-black text-white py-4 font-medium text-base hover:bg-gray-800 transition-colors"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {step === 'register' && (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-10 py-12">
                      <h2 className="text-3xl font-bold mb-4 text-center">
                        Just a few more details
                      </h2>
                      
                      <p className="text-base mb-8 text-center leading-relaxed text-gray-600">
                        {email}
                      </p>

                      <form onSubmit={handleRegisterSubmit}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-b-black transition-colors"
                            placeholder="John Doe"
                            required
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-b-black transition-colors"
                            placeholder="Enter your password"
                            required
                          />
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium mb-2">
                            Phone Number (Optional)
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none focus:border-b-black transition-colors"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStep('email')}
                            className="flex-1 bg-gray-200 text-black py-4 font-medium text-base hover:bg-gray-300 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-black text-white py-4 font-medium text-base hover:bg-gray-800 transition-colors"
                          >
                            Create Account
                          </button>
                        </div>

                        <p className="text-xs text-gray-600 text-center leading-relaxed mt-6">
                          By creating an account, you agree to our{' '}
                          <a href="#" className="underline hover:text-black">
                            Terms of Service
                          </a>
                          {' '}and{' '}
                          <a href="#" className="underline hover:text-black">
                            Privacy Policy
                          </a>
                          .
                        </p>
                      </form>
                    </div>
                  </motion.div>
                )}

                {step === 'complete' && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="px-10 py-20 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: 'spring', 
                          stiffness: 260, 
                          damping: 20,
                          delay: 0.1
                        }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>

                      <h2 className="text-3xl font-bold mb-4">
                        Welcome aboard, {name}!
                      </h2>
                      
                      <p className="text-base text-gray-600 mb-2">
                        Your account has been created successfully.
                      </p>
                      
                      <p className="text-sm text-gray-500">
                        You'll be redirected shortly...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

