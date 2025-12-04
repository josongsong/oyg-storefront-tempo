import { ChevronRight, Heart } from 'lucide-react'

import { CartItem, OrderSummary } from '@/features/cart/components'
import { SIMILAR_ITEMS, WISHLIST_ITEMS } from '@/data/mock-cart'
import { useCartStore } from '@/stores'
import { useNavigate } from 'react-router-dom'

export function Component() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, updateShade, getSubtotal } = useCartStore()

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity)
  }

  const handleRemove = (id: string) => {
    removeItem(id)
  }

  const handleMoveToWishlist = (id: string) => {
    // TODO: 위시리스트 기능 구현
    console.log('Move to wishlist:', id)
    removeItem(id)
  }

  const handleChangeShade = (id: string, shade: string) => {
    updateShade(id, shade)
  }

  const handleApplyPromo = (code: string) => {
    console.log('Apply promo:', code)
  }

  const handleCheckout = () => {
    console.log('Proceed to checkout')
    // TODO: 체크아웃 페이지로 이동
  }

  // 계산
  const subtotal = getSubtotal()
  const shipping = subtotal >= 60 ? 0 : 10
  const shippingDiscount = subtotal >= 60 ? 10 : 0
  const gst = subtotal * 0.07 // 7% GST
  const total = subtotal + shipping - shippingDiscount

  // 빈 카트 처리
  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started</p>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          {/* Cart Items */}
          <div className="mb-8">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={{
                  id: item.id,
                  quantity: item.quantity,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  sku: item.sku,
                  shade: item.shade,
                  shadeOptions: item.shadeOptions,
                  product: {
                    name: item.name,
                    brand: item.brand,
                    image: item.image,
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

          {/* From your wishlist */}
          {WISHLIST_ITEMS.length > 0 && (
            <div className="mb-12 pb-12 border-b border-gray-200">
              <h2 className="text-xl font-medium mb-6">From your wishlist</h2>
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-4 pb-2" style={{ minWidth: 'min-content' }}>
                  {WISHLIST_ITEMS.map((item) => (
                    <div key={item.id} className="group cursor-pointer shrink-0 w-48">
                      <div className="relative aspect-square bg-gray-50 overflow-hidden mb-3">
                        <button className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full hover:bg-gray-100">
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <button className="absolute bottom-2 left-2 right-2 bg-white border-2 border-black py-2 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          +
                        </button>
                      </div>
                      <h3 className="text-[10px] font-bold uppercase mb-1">{item.brand}</h3>
                      <p className="text-xs text-gray-900 leading-tight mb-2 line-clamp-2">{item.name}</p>
                      <div className="text-sm font-medium mb-1">${item.price.toFixed(2)}</div>
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
              <button className="p-2 border border-gray-300 hover:bg-gray-100 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex gap-4 pb-2" style={{ minWidth: 'min-content' }}>
                {SIMILAR_ITEMS.map((item) => (
                  <div key={item.id} className="group cursor-pointer shrink-0 w-48">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden mb-3">
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {item.badge && (
                          <span className="bg-white border border-black text-black text-[9px] font-bold px-2 py-1 uppercase leading-tight">
                            {item.badge}
                          </span>
                        )}
                        {item.badgeSecondary && (
                          <span className="bg-yellow-300 text-black text-[9px] font-bold px-2 py-1 uppercase leading-tight">
                            {item.badgeSecondary}
                          </span>
                        )}
                      </div>
                      <button className="absolute top-2 right-2 z-10 p-2 hover:bg-white/80 rounded-full transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <button className="absolute bottom-2 left-2 right-2 bg-white border-2 border-black py-2 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        +
                      </button>
                    </div>
                    <h3 className="text-[10px] font-bold uppercase mb-1">{item.brand}</h3>
                    <p className="text-xs text-gray-900 leading-tight mb-2 line-clamp-2">{item.name}</p>
                    <div className="flex items-center gap-2 mb-1">
                      {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                      )}
                      <span className="text-sm font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-[10px] ${i < item.rating ? 'text-black' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      {item.reviews > 0 && <span className="text-[10px] text-gray-500">({item.reviews})</span>}
                    </div>
                    {item.isNew && <span className="inline-block text-[9px] font-semibold text-gray-500 mt-1">NEW</span>}
                  </div>
                ))}
              </div>
            </div>
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
    </div>
  )
}

Component.displayName = 'CartPage'
