import { Heart, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { useQuickShopStore } from '@/stores'
import { loadAllProducts } from '@/utils/product-loader'

import type { GlossierProduct } from '@/types/glossier'
import type { QuickShopProduct } from '@/types/quick-shop'

interface ProductCardProps {
  product: GlossierProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const openQuickShop = useQuickShopStore((state) => state.openQuickShop)
  const [productIds, setProductIds] = useState<string[]>([])

  // Load all product IDs on mount
  useEffect(() => {
    loadAllProducts().then((products) => {
      setProductIds(products.map((p) => p.id))
    })
  }, [])

  const handleQuickShop = (e: React.MouseEvent) => {
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

  return (
    <div className="group relative flex flex-col cursor-pointer" onClick={handleCardClick}>
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
        <button className="absolute top-3 right-3 z-10 p-2 hover:bg-white/80 rounded-full transition-colors">
          <Heart className="w-5 h-5 text-black stroke-1" />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        
        {/* Quick Shop Button */}
        <button
          onClick={handleQuickShop}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 text-sm font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          QUICK SHOP
        </button>
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
