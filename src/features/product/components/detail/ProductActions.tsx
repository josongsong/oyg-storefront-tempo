/**
 * Product Actions Component
 * Add to Cart, Wishlist 버튼
 */

import { Heart, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductActionsProps {
  quantity: number
  isInWishlist: boolean
  isHoveringBasket: boolean
  bubbles: { id: number; x: number }[]
  onAddToCart: () => void
  onToggleWishlist: () => void
  onWishlistSuccess: (message: string) => void
}

export function ProductActions({
  quantity,
  isInWishlist,
  isHoveringBasket,
  bubbles,
  onAddToCart,
  onToggleWishlist,
  onWishlistSuccess,
}: ProductActionsProps) {
  return (
    <div className="flex gap-2">
      <motion.button 
        onClick={() => {
          onAddToCart()
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
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        transition={{
          backgroundColor: {
            duration: 0.8,
            ease: "easeInOut"
          },
          boxShadow: {
            duration: 0.3
          }
        }}
      >
        {/* Bubbles Animation */}
        <AnimatePresence>
          {bubbles.map((bubble) => {
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
                onAnimationComplete={() => {}}
              />
            )
          })}
        </AnimatePresence>

        {/* Button Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Add to Basket
        </span>

        {/* Green gradient shine effect */}
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
          onToggleWishlist()
          onWishlistSuccess(
            isInWishlist 
              ? 'Removed from wishlist' 
              : 'Added to wishlist'
          )
        }}
        className={`p-3 border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
          isInWishlist
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-black hover:bg-gray-50'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isInWishlist
              ? 'fill-red-500 text-red-500'
              : 'fill-none text-black'
          }`} 
        />
      </motion.button>
    </div>
  )
}

