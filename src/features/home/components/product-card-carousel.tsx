import { Heart } from 'lucide-react'
import type { GlossierProduct } from '@/types/glossier'

interface ProductCardCarouselProps {
  product: GlossierProduct
  onQuickShop: () => void
}

export function ProductCardCarousel({ product, onQuickShop }: ProductCardCarouselProps) {
  return (
    <div className="shrink-0 w-[260px] group cursor-pointer">
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
          onClick={onQuickShop}
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
            <span key={idx} className="text-xs">
              ★
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500">({product.reviews})</span>
      </div>
      {product.badge && <p className="text-xs text-gray-500 uppercase mt-1">{product.badge}</p>}
    </div>
  )
}

