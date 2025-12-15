import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface WishlistEmptyTooltipProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

export function WishlistEmptyTooltip({ isOpen, onClose, onLogin }: WishlistEmptyTooltipProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[49]"
            onClick={onClose}
          />
          
          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 z-[60] w-64"
          >
            <div className="bg-black text-white p-4 rounded-lg shadow-xl relative">
              {/* Arrow */}
              <div className="absolute -top-1.5 right-4 w-3 h-3 bg-black rotate-45" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <p className="text-sm mb-3 leading-relaxed pr-6">
                Don't lose your wishlist!
              </p>

              {/* Login Button */}
              <motion.button
                onClick={() => {
                  onLogin()
                  onClose()
                }}
                className="text-white text-sm font-bold border-b border-white pb-0.5 hover:opacity-80 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login or sign up
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
