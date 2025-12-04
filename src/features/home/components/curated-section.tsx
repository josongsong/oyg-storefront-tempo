import { useState } from 'react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'

import { MOCK_PRODUCTS } from '@/data/mock-products'
import { useQuickShopStore } from '@/stores'

import type { QuickShopProduct } from '@/types/quick-shop'

export function CuratedSection() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const itemWidth = 280 // 상품 카드 너비 + gap
  const openQuickShop = useQuickShopStore((state) => state.openQuickShop)

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('curated-scroll')
    if (container) {
      const newPosition = direction === 'left' ? scrollPosition - itemWidth * 2 : scrollPosition + itemWidth * 2
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  const handleQuickShop = (product: typeof MOCK_PRODUCTS[0]) => {
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

  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-normal">Curated for you</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div id="curated-scroll" className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 pb-4">
          {[...MOCK_PRODUCTS, ...MOCK_PRODUCTS].map((product, i) => (
            <div key={i} className="shrink-0 w-[260px] group cursor-pointer">
              <div className="relative aspect-square bg-gray-50 overflow-hidden mb-3">
                {product.badge && (
                  <span className="absolute top-2 left-2 z-10 text-[10px] font-bold px-2 py-1 border border-black bg-white uppercase">
                    {product.badge}
                  </span>
                )}
                <button className="absolute top-2 right-2 z-10 p-2 hover:bg-white/80 transition-colors">
                  <Heart className="w-5 h-5 text-black stroke-1" />
                </button>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.opacity = '0'
                  }}
                />
                
                {/* Quick Shop Button */}
                <button
                  onClick={() => handleQuickShop(product)}
                  className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-sm font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  QUICK SHOP
                </button>
              </div>
              <h3 className="text-xs font-bold uppercase mb-1">{product.brand}</h3>
              <p className="text-sm text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[40px]">{product.name}</p>
              <p className="text-base font-bold mb-1">{product.price}</p>
              <div className="flex items-center gap-1">
                <div className="flex text-black">
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className="text-xs">★</span>
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviews})</span>
              </div>
              {product.badge && (
                <p className="text-xs text-gray-500 uppercase mt-1">{product.badge}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
