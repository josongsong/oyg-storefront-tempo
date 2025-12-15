import { useState, useEffect, useRef } from 'react'
import { X, Minus, Plus, Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useQuickShopStore } from '@/features/product/stores'
import { useCartStore } from '@/features/cart/stores'
import { getRandomCosmeticImage } from '@/shared/utils/image'

interface CartIcon {
  id: number
  x: number
}

export function QuickShopModal() {
  const { isOpen, product, selectedShade, selectedSize, quantity, closeQuickShop, setSelectedShade, setSelectedSize, setQuantity } = useQuickShopStore()
  const { addItem } = useCartStore()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [cartIcons, setCartIcons] = useState<CartIcon[]>([])
  const [iconIdCounter, setIconIdCounter] = useState(0)
  const scrollPositionRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // 호버 시 카트 아이콘 애니메이션
  useEffect(() => {
    if (isHovering) {
      let counter = iconIdCounter
      intervalRef.current = setInterval(() => {
        const newIcon: CartIcon = {
          id: counter,
          x: Math.random() * 80 + 10, // 10-90% 범위에서 랜덤 위치
        }
        setCartIcons((prev) => [...prev, newIcon])
        counter++
        setIconIdCounter(counter)
      }, 150) // 150ms마다 새 아이콘 생성
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovering])

  // 애니메이션 완료 후 아이콘 제거
  const handleAnimationComplete = (id: number) => {
    setCartIcons((prev) => prev.filter((icon) => icon.id !== id))
  }

  if (!product || !isOpen) return null

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? (product.images?.length || 1) - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === (product.images?.length || 1) - 1 ? 0 : prev + 1))
  }

  const handleAddToBag = () => {
    if (!product) return

    const shadeName = product.shades?.find((s) => s.id === selectedShade)?.name
    const sizeName = product.sizes?.find((s) => s.id === selectedSize)?.name

    // 가격을 숫자로 변환
    const priceStr = product.price.replace(/[^0-9.]/g, '')
    const price = parseFloat(priceStr) || 0

    addItem({
      productId: String(product.id),
      name: product.name,
      brand: product.brand || 'Unknown Brand',
      image: product.images?.[0] || getRandomCosmeticImage(),
      price: price,
      quantity: quantity,
      shade: shadeName,
      size: sizeName,
    })

    // 모달 닫기
    closeQuickShop()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fadeIn"
        onClick={closeQuickShop}
      />

      {/* Modal */}
      <div
        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white z-50 overflow-y-auto shadow-2xl animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold">QUICK SHOP</h2>
          <button onClick={closeQuickShop} className="p-2 hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Badges */}
          {product.badge && (
            <div className="flex gap-2 mb-4">
              <span className="text-xs font-bold px-3 py-1 border border-black bg-white uppercase">
                {product.badge}
              </span>
            </div>
          )}

          {/* Product Title */}
          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-1">({product.rating})</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 fill-none stroke-current stroke-[1.5] ${i < Math.floor(product.rating) ? 'text-black' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
            <button className="text-sm underline hover:text-gray-600">View {product.reviews} Reviews</button>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
            )}
            <span className="text-2xl font-bold text-red-600">{product.price}</span>
          </div>

          {/* Shipping */}
          <p className="text-sm text-gray-600 mb-6">
            <button className="underline hover:text-black">Shipping</button> & Returns
          </p>

          {/* Images Gallery */}
          <div className="mb-6">
            <div className="relative aspect-square bg-gray-50 mb-4 group">
              <img
                src={product.images?.[currentImageIndex] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square bg-gray-50 overflow-hidden border-2 ${
                      currentImageIndex === idx ? 'border-black' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Shades Selection */}
          {product.shades && product.shades.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold">
                  {product.shades.find((s) => s.id === selectedShade)?.name || 'Select shade'}
                </h4>
                <button className="text-sm underline hover:text-gray-600">
                  {product.shades.length} shades
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.shades.map((shade) => (
                  <button
                    key={shade.id}
                    onClick={() => setSelectedShade(shade.id)}
                    className={`w-12 h-12 border-2 overflow-hidden ${
                      selectedShade === shade.id ? 'border-black' : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    {shade.image ? (
                      <img src={shade.image} alt={shade.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: shade.color }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-bold mb-3">Size</h4>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => size.inStock && setSelectedSize(size.id)}
                    disabled={!size.inStock}
                    className={`px-4 py-2 border text-sm font-medium ${
                      selectedSize === size.id
                        ? 'border-black bg-black text-white'
                        : size.inStock
                          ? 'border-gray-300 hover:border-black'
                          : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Quantity & Add to Bag */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-6 text-base font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 relative overflow-visible">
              <button 
                onClick={handleAddToBag}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-full bg-black text-white py-3 px-6 text-base font-medium hover:bg-gray-800 transition-colors relative z-10"
              >
                ADD TO BAG
              </button>

              {/* Floating Cart Icons */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                <AnimatePresence>
                  {cartIcons.map((icon) => (
                    <motion.div
                      key={icon.id}
                      initial={{ 
                        opacity: 1, 
                        y: 24,
                        scale: 0.5
                      }}
                      animate={{ 
                        opacity: 0, 
                        y: -100,
                        scale: 1
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        ease: 'easeOut'
                      }}
                      onAnimationComplete={() => handleAnimationComplete(icon.id)}
                      className="absolute pointer-events-none"
                      style={{ 
                        left: `${icon.x}%`,
                        bottom: 0,
                        zIndex: 20
                      }}
                    >
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Total Price */}
          <div className="text-right">
            <p className="text-2xl font-bold text-red-600">
              {product.price.replace(/[^0-9.]/g, '') ? 
                `₩${(parseFloat(product.price.replace(/[^0-9.]/g, '')) * quantity * 1300).toLocaleString()}` : 
                product.price
              }
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
