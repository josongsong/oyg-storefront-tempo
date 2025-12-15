/**
 * Promo Banner Component
 * Auto-rotating promotional banner with animations
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

interface PromoBanner {
  text: string
  link: string
}

interface PromoBannerProps {
  banners: PromoBanner[]
  autoPlayInterval?: number
}

export function PromoBanner({ banners, autoPlayInterval = 4000 }: PromoBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isPaused, banners.length, autoPlayInterval])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  if (banners.length === 0) return null

  return (
    <motion.div
      className="bg-black text-white text-xs h-10 flex items-center justify-center relative px-4 overflow-hidden group cursor-pointer"
      initial={{ backgroundColor: '#000000' }}
      whileHover={{
        backgroundColor: ['#000000', '#00C73C', '#7DD321', '#00D98F', '#00C73C'],
        transition: {
          duration: 1.5,
          ease: 'easeInOut',
        },
      }}
    >
      {/* Animated gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100"
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="flex-1 text-center flex items-center justify-center font-normal relative z-10"
        >
          <motion.a
            href={banners[currentIndex].link}
            className="cursor-pointer"
            whileHover={{
              scale: 1.02,
              textShadow: '0 0 8px rgba(255,255,255,0.5)',
              transition: { duration: 0.2 },
            }}
          >
            {banners[currentIndex].text}
          </motion.a>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <div className="hidden md:flex items-center gap-2 absolute right-4 md:right-8">
          <motion.button
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-3 h-3" />
          </motion.button>

          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
            aria-label="Next banner"
          >
            <ChevronRight className="w-3 h-3" />
          </motion.button>

          <motion.button
            onClick={() => setIsPaused(!isPaused)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? (
              <Play className="w-3 h-3 fill-current" />
            ) : (
              <Pause className="w-3 h-3 fill-current" />
            )}
          </motion.button>

          {/* Progress indicator */}
          <div className="flex gap-1">
            {banners.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1 h-1 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-3' : 'bg-white/40'
                }`}
                whileHover={{ scale: 1.2 }}
                aria-label={`Go to banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

