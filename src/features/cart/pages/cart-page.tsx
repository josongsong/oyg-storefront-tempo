import { useState, useEffect } from 'react'
import { ChevronRight, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { CartItem, OrderSummary } from '@/features/cart/components'
import { useCartStore } from '@/features/cart/stores'
import { useWishlistStore } from '@/features/product/stores'
import { cartMessages } from '@/features/cart/i18n'
import { getRecommendedProducts, getWishlistSuggestions } from '@/features/product/api/product-provider'
import { 
  RECOMMENDATION_CONFIG, 
  DEFAULT_PRODUCT_META, 
  SHIPPING_CONFIG, 
  TAX_CONFIG 
} from '@/features/cart/constants'
import { logger } from '@/shared/utils/logger'

import type { GlossierProduct } from '@/shared/types/glossier'

export function Component() {
  const navigate = useNavigate()
  const { getItems, updateQuantity, removeItem, getSummary } = useCartStore()
  const { addItem: addToWishlist } = useWishlistStore()
  const items = getItems()
  const summary = getSummary()
  
  const [similarItems, setSimilarItems] = useState<GlossierProduct[]>([])
  const [wishlistItems, setWishlistItems] = useState<GlossierProduct[]>([])

  useEffect(() => {
    Promise.all([
      getRecommendedProducts(undefined, RECOMMENDATION_CONFIG.SIMILAR_ITEMS_COUNT),
      getWishlistSuggestions(RECOMMENDATION_CONFIG.YOU_MAY_LIKE_COUNT)
    ]).then(([similar, wishlist]) => {
      setSimilarItems(similar)
      setWishlistItems(wishlist)
    })
  }, [])

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id as any, quantity)
  }

  const handleRemove = (id: string) => {
    removeItem(id as any)
  }

  const handleMoveToWishlist = (id: string) => {
    const item = items.find((i: any) => i.id === id)
    if (item) {
      addToWishlist({
        id: item.productId,
        name: item.name,
        brand: item.brand,
        price: String(item.price),
        image: item.image,
        rating: DEFAULT_PRODUCT_META.RATING,
        reviews: DEFAULT_PRODUCT_META.REVIEWS,
      })
    }
    removeItem(id as any)
  }

  const handleChangeShade = (id: string, _shade: string) => {
    const currentItem = items.find((i: any) => i.id === id)
    if (currentItem?.quantity) {
      updateQuantity(id as any, currentItem.quantity)
    }
  }

  const handleApplyPromo = (code: string) => {
    logger.debug('Apply promo:', code)
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  // 계산
  const subtotal = summary.subtotal
  const shipping = subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD 
    ? 0 
    : SHIPPING_CONFIG.STANDARD_SHIPPING_COST
  const shippingDiscount = subtotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD 
    ? SHIPPING_CONFIG.STANDARD_SHIPPING_COST 
    : 0
  const gst = subtotal * TAX_CONFIG.GST_RATE
  const total = subtotal + shipping - shippingDiscount

  // 빈 카트 처리
  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">{cartMessages.emptyTitle()}</h1>
          <p className="text-gray-600 mb-8">{cartMessages.emptyDescription()}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              {cartMessages.continueShopping()}
            </button>
            {import.meta.env.DEV && (
              <button
                onClick={() => {}}
                className="bg-gray-200 text-black px-8 py-3 hover:bg-gray-300 transition-colors"
              >
                Load Sample Data
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          {/* Cart Items */}
          <div className="mb-8">
              {items.map((item) => (
              <CartItem
                key={item.id}
                item={{
                  id: item.id,
                  quantity: item.quantity || 1,
                  price: item.price || 0,
                  originalPrice: item.originalPrice,
                  sku: item.sku,
                  shade: item.shade,
                  shadeOptions: item.shadeOptions,
                  product: {
                    name: item.name || '',
                    brand: item.brand || '',
                    image: item.image || '',
                  },
                  isNew: item.isNew,
                }}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onMoveToWishlist={handleMoveToWishlist}
                onChangeShade={handleChangeShade}
              />
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            shippingDiscount={shippingDiscount}
            gst={gst}
            total={total}
            itemCount={items.length}
            onApplyPromo={handleApplyPromo}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Carousels - Below cart and order summary */}
      <div>
        {/* From your wishlist */}
        {wishlistItems.length > 0 && (
          <div className="mb-12 pb-12 border-b border-gray-200">
              <h2 className="text-xl font-medium mb-6">From your wishlist</h2>
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-4 pb-2" style={{ minWidth: 'min-content' }}>
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="group cursor-pointer shrink-0 w-48">
                      <div className="relative aspect-square bg-gray-50 overflow-hidden mb-3">
                        <button className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full hover:bg-gray-100">
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <button className="absolute bottom-2 left-2 right-2 quick-action-btn">
                          +
                        </button>
                      </div>
                      <h3 className="text-[10px] font-bold uppercase mb-1">{item.brand}</h3>
                      <p className="text-xs text-gray-900 leading-tight mb-2 line-clamp-2">{item.name}</p>
                      <div className="text-sm font-medium mb-1">{item.price}</div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-[10px] ${i < Math.floor(item.rating) ? 'text-black' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500">({item.reviews})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        {/* We have a feeling you'll love these */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">We have a feeling you'll love these...</h2>
            <button className="icon-btn-bordered rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-4 pb-2" style={{ minWidth: 'min-content' }}>
              {similarItems.map((item) => (
                <div key={item.id} className="group cursor-pointer shrink-0 w-48">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden mb-3">
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                      {item.badge && (
                        <span className="bg-white border border-black text-black text-[9px] font-bold px-2 py-1 uppercase leading-tight">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <button className="absolute top-2 right-2 z-10 icon-btn">
                      <Heart className="w-4 h-4" />
                    </button>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <button className="absolute bottom-2 left-2 right-2 quick-action-btn">
                      +
                    </button>
                  </div>
                  <h3 className="text-[10px] font-bold uppercase mb-1">{item.brand}</h3>
                  <p className="text-xs text-gray-900 leading-tight mb-2 line-clamp-2">{item.name}</p>
                  <div className="flex items-center gap-2 mb-1">
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                    )}
                    <span className="text-sm font-bold">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-[10px] ${i < Math.floor(item.rating) ? 'text-black' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    {item.reviews > 0 && <span className="text-[10px] text-gray-500">({item.reviews})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Component.displayName = 'CartPage'
