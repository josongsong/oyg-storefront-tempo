import { Heart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, memo, useMemo } from 'react'
import { motion } from 'framer-motion'

import { useQuickShopStore, useWishlistStore } from '@/features/product/stores'
import { loadAllProducts } from '@/features/product/utils'

import type { GlossierProduct } from '@/shared/types/glossier'
import type { QuickShopProduct } from '@/features/product/types'

interface ProductCardProps {
  product: GlossierProduct
  variant?: 'default' | 'compact'
  showWishlist?: boolean
  onQuickShop?: () => void
}

function ProductCardComponent({
  product,
  variant = 'default',
  showWishlist = true,
  onQuickShop,
}: ProductCardProps) {
  const navigate = useNavigate()
  const openQuickShop = useQuickShopStore((state) => state.openQuickShop)
  const toggleItem = useWishlistStore((state) => state.toggleItem)
  const wishlistItems = useWishlistStore((state) => state.items)
  const productId = String(product.id)
  const isFavorited = useMemo(
    () => wishlistItems.some(item => item.id === productId),
    [wishlistItems, productId]
  )
  const [productIds, setProductIds] = useState<string[]>([])
  
  // Compute classes based on variant
  const widthClass = variant === 'compact' ? 'w-[260px] shrink-0' : 'w-full'

  // Load all product IDs on mount
  useEffect(() => {
    loadAllProducts().then((products) => {
      setProductIds(products.map((p) => p.id))
    })
  }, [])

  const handleQuickShop = (e: React.MouseEvent) => {
    // 외부에서 onQuickShop이 제공되면 그것을 사용
    if (onQuickShop) {
      e.preventDefault()
      e.stopPropagation()
      onQuickShop()
      return
    }

    // 기본 QuickShop 로직
    e.preventDefault()
    e.stopPropagation()

    const quickShopProduct: QuickShopProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      images: [product.image, product.image, product.image],
      shades: [
        { id: '1', name: 'Vanilla Dream', color: '#F5E6D3' },
        { id: '2', name: 'Lavender Haze', color: '#E6D5F5' },
        { id: '3', name: 'Pink Sugar', color: '#FFD5E5' },
        { id: '4', name: 'Coral Reef', color: '#FFB5A0' },
        { id: '5', name: 'Berry Bliss', color: '#D5A5C5' },
        { id: '6', name: 'Chocolate', color: '#8B4513' },
      ],
      sizes: [
        { id: '1', name: '2 sizes', inStock: true },
        { id: '2', name: '6 shades', inStock: true },
      ],
      description: 'A dreamy scent that blends notes of vanilla, pink sugar + coconut.',
    }

    openQuickShop(quickShopProduct)
  }

  const handleCardClick = () => {
    // Pick a random product ID from the loaded products
    if (productIds.length > 0) {
      const randomId = productIds[Math.floor(Math.random() * productIds.length)]
      navigate(`/products/${randomId}`)
    } else {
      // Fallback to current product ID if not loaded yet
      navigate(`/products/${product.id}`)
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    toggleItem({
      id: String(product.id),
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
    })
  }

  return (
    <div className={`group relative flex flex-col cursor-pointer ${widthClass}`} onClick={handleCardClick}>
      <div className="relative aspect-4/5 bg-[#F9F9F9] overflow-hidden mb-3">
        {product.badge && (
          <div className="absolute top-2 left-2 z-10">
            <span
              className={`text-xs font-medium px-2 py-1 uppercase tracking-wider ${product.badge === 'VALUE SET' ? 'bg-[#D4A017] text-white' : 'bg-white border border-black text-black'}`}
            >
              {product.badge}
            </span>
          </div>
        )}
        {showWishlist && (
          <motion.button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 z-10 p-2 hover:bg-white/80 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`w-5 h-5 stroke-1 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-black fill-none'
              }`}
            />
          </motion.button>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        
        {/* Quick Shop Button */}
        <motion.button
          onClick={handleQuickShop}
          initial={{ y: '100%' }}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-sm font-bold uppercase tracking-wide group-hover:translate-y-0 transition-transform duration-300 overflow-hidden"
          whileHover={{ 
            backgroundColor: ['#000000', '#00C73C', '#7DD321', '#00D98F', '#00C73C'],
            scale: 1.02,
            transition: {
              backgroundColor: {
                duration: 1.2,
                ease: "easeInOut",
                repeat: Infinity
              },
              scale: {
                duration: 0.2,
                ease: "easeOut"
              }
            }
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">
            QUICK SHOP
          </span>
          
          {/* Animated gradient overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none opacity-0"
            whileHover={{
              opacity: 1,
              x: ['-100%', '200%'],
              transition: {
                opacity: { duration: 0.2 },
                x: {
                  duration: 0.8,
                  ease: "easeInOut",
                  repeat: Infinity
                }
              }
            }}
          />
        </motion.button>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-sm font-bold tracking-wide uppercase">{product.brand}</h3>
        <p className="text-base text-black leading-snug min-h-[40px] line-clamp-2">{product.name}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-base font-medium">{product.price}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-black fill-none stroke-current stroke-[1.5]" />
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>
        {product.valueText && <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{product.valueText}</p>}
      </div>
    </div>
  )
}

export const ProductCard = memo(ProductCardComponent)
