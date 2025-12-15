import { motion } from 'framer-motion'
import { X, Heart, ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useWishlistStore } from '@/features/product/stores'
import { useCartStore } from '@/features/cart/stores'
import { useToastStore } from '@/app/stores/toast.store'
import { Modal } from '@/shared/components/Modal'
import { toProductId, parsePriceString, toPrice } from '@/features/cart/utils/cart-helpers'

export function WishlistPopup() {
  const { isOpen, closeWishlist, items, removeItem } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const { addToast } = useToastStore()
  const navigate = useNavigate()

  const handleAddToCart = (item: typeof items[0]) => {
    const priceValue = typeof item.price === 'string' 
      ? parsePriceString(item.price)
      : toPrice(item.price)
    
    const cartItem = {
      productId: toProductId(item.id),
      name: item.name,
      brand: item.brand,
      price: priceValue,
      image: item.image,
    }
    addToCart(cartItem as any, 1)
    
    addToast(
      'Added to cart',
      'success',
      2000
    )
  }

  const handleProductClick = (id: string) => {
    closeWishlist()
    navigate(`/products/${id}`)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeWishlist}
      position="right"
      size="full"
      className="w-full md:w-[480px] h-full flex flex-col"
      showCloseButton={false}
    >
      {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                <h2 className="text-xl font-bold">Wishlist</h2>
              </div>
              <motion.button
                onClick={closeWishlist}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-sm text-gray-500 mb-6">Add your favorite products!</p>
                <motion.button
                  onClick={closeWishlist}
                  className="bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 border border-gray-200 hover:border-gray-300 transition-colors group"
                    >
                      {/* Image */}
                      <div 
                        className="w-24 h-24 bg-gray-100 overflow-hidden shrink-0 cursor-pointer"
                        onClick={() => handleProductClick(item.id)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col">
                        <div 
                          className="cursor-pointer"
                          onClick={() => handleProductClick(item.id)}
                        >
                          <p className="text-xs font-bold uppercase text-gray-600 mb-1">{item.brand}</p>
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-gray-700">
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-base font-bold text-gray-900 mb-3">{item.price}</p>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                          <motion.button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              removeItem(item.id)
                              addToast(
                                'Removed from wishlist',
                                'success',
                                2000
                              )
                            }}
                            className="p-2 border border-gray-300 hover:border-red-500 hover:bg-red-50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-4 h-4 text-gray-600 hover:text-red-500" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Total {items.length} {items.length === 1 ? 'item' : 'items'}</span>
                  </div>
                  <motion.button
                    onClick={() => {
                      items.forEach(item => handleAddToCart(item))
                      addToast(
                        'All items added to cart',
                        'success',
                        2000
                      )
                    }}
                    className="w-full bg-black text-white py-3 px-6 text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add All to Cart
                  </motion.button>
                </div>
        </>
      )}
    </Modal>
  )
}

