import { Heart, Plus, Star } from 'lucide-react'

import type { GlossierProduct } from '@/types/glossier'

interface ProductCardProps {
  product: GlossierProduct
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col cursor-pointer">
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
        <button className="absolute bottom-4 right-4 p-3 bg-white shadow-lg rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-sm font-bold tracking-wide uppercase">{product.brand}</h3>
        <p className="text-base text-black leading-snug min-h-[40px] line-clamp-2">{product.name}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-base font-medium">{product.price}</p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-black text-black" />
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

