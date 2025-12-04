import { Heart, Star, X } from 'lucide-react'

import type { GlossierProduct } from '@/types/glossier'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: (e: React.MouseEvent) => void
  trendingSearches: string[]
  products: GlossierProduct[]
}

export function SearchOverlay({ isOpen, onClose, trendingSearches, products }: SearchOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-full max-w-5xl bg-white border border-gray-100 border-t-0 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-h-[400px] rounded-b-lg -mt-6">
      <div className="px-6 py-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-64 shrink-0 border-r border-gray-100 pr-8">
            <h3 className="font-bold text-base mb-4 text-black">Trending right now</h3>
            <ul className="space-y-3">
              {trendingSearches.map((term, i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-black hover:underline hover:text-gray-600 transition-colors">
                    {term}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-base mb-6 text-black">You might like these bestsellers...</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.slice(0, 4).map((product, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative aspect-square bg-[#F9F9F9] overflow-hidden mb-3 rounded-sm">
                    {product.badge && (
                      <span className="absolute top-2 left-2 z-10 text-[10px] font-medium px-2 py-1 border border-black bg-white uppercase">
                        {product.badge}
                      </span>
                    )}
                    <button className="absolute top-2 right-2 z-10 p-2 hover:bg-white/80 rounded-full">
                      <Heart className="w-5 h-5 text-black stroke-1" />
                    </button>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                  <h4 className="text-xs font-bold uppercase mb-1">{product.brand}</h4>
                  <p className="text-sm text-gray-900 leading-tight mb-1 line-clamp-2">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{product.price}</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 fill-black" />
                      <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 top-[180px] bg-transparent -z-10" onClick={onClose}></div>
    </div>
  )
}

