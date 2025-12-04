import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Search, Star, X } from 'lucide-react'

import { loadAllProducts, searchProducts as searchProductsUtil } from '@/utils/product-loader'
import type { GlossierProduct } from '@/types/glossier'
import type { ProductListItem } from '@/types/product-data'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: (e: React.MouseEvent) => void
  trendingSearches: string[]
  products?: GlossierProduct[]
}

// Random badges for products
const PRODUCT_BADGES = ['LIMITED EDITION', 'COLLECTABLE', 'NEW ARRIVAL', 'BESTSELLER', null, null]

// Helper function to convert ProductListItem to GlossierProduct with random badge
function toGlossierProduct(item: ProductListItem): GlossierProduct {
  // Randomly assign a badge (50% chance)
  const randomBadge = PRODUCT_BADGES[Math.floor(Math.random() * PRODUCT_BADGES.length)]
  
  return {
    id: item.id,
    name: item.name,
    brand: item.brand,
    price: item.price,
    rating: item.rating,
    reviews: item.reviewCount,
    image: item.image,
    badge: item.badge || randomBadge || undefined,
  }
}

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export function SearchOverlay({ isOpen, onClose, trendingSearches, products: propProducts }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [allProducts, setAllProducts] = useState<ProductListItem[]>([])
  const [randomProducts, setRandomProducts] = useState<GlossierProduct[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const navigate = useNavigate()

  // 검색 오버레이가 열렸을 때 배경 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflowY = 'scroll'
      
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflowY = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  // Load all products when component mounts (not when overlay opens)
  useEffect(() => {
    if (!propProducts && allProducts.length === 0 && !isLoadingProducts) {
      setIsLoadingProducts(true)
      loadAllProducts().then((products) => {
        setAllProducts(products)
        // Get random 4 products
        const shuffled = shuffleArray(products)
        setRandomProducts(shuffled.slice(0, 4).map(toGlossierProduct))
        setIsLoadingProducts(false)
      })
    }
  }, [propProducts, allProducts.length, isLoadingProducts])

  // Refresh random products when overlay opens
  useEffect(() => {
    if (isOpen && allProducts.length > 0) {
      const shuffled = shuffleArray(allProducts)
      setRandomProducts(shuffled.slice(0, 4).map(toGlossierProduct))
    }
  }, [isOpen, allProducts])

  // Auto-complete suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 0 && allProducts.length > 0) {
      const results = searchProductsUtil(allProducts, searchQuery)
      const uniqueSuggestions = new Set<string>()
      
      // Add matching product names and brands
      results.slice(0, 20).forEach(product => {
        const searchLower = searchQuery.toLowerCase()
        if (product.name.toLowerCase().includes(searchLower)) {
          uniqueSuggestions.add(product.name)
        }
        if (product.brand.toLowerCase().includes(searchLower)) {
          uniqueSuggestions.add(product.brand)
        }
      })
      
      setSuggestions(Array.from(uniqueSuggestions).slice(0, 8))
    } else {
      setSuggestions([])
    }
  }, [searchQuery, allProducts])

  const products = propProducts || randomProducts

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery.trim()
    if (searchTerm) {
      navigate(`/products?q=${encodeURIComponent(searchTerm)}`)
      onClose({ stopPropagation: () => {} } as any)
      setSearchQuery('')
      setSuggestions([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleTrendingClick = (term: string) => {
    handleSearch(term)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    handleSearch(suggestion)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            {/* Search Overlay - 검색바 바로 아래 위치 */}
            <motion.div
              className="absolute top-[calc(100%-1rem)] left-1/2 transform -translate-x-1/2 w-full max-w-5xl bg-white shadow-2xl z-50"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input Area */}
              <div className="bg-white px-6 py-4 relative">
                <div className="flex items-center gap-3 border-b border-black pb-4">
                  <Search className="w-5 h-5 text-black shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search 150+ global beauty brands"
                    className="flex-1 text-base text-gray-900 placeholder-gray-600 outline-none bg-transparent font-normal"
                    autoFocus
                  />
                  <button onClick={onClose} className="p-1 hover:bg-gray-100 transition-colors rounded">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Auto-complete suggestions */}
                {suggestions.length > 0 && (
                  <motion.div
                    className="absolute left-0 right-0 top-[calc(100%-0.5rem)] bg-white border border-gray-200 shadow-xl z-[60] max-h-[300px] overflow-y-auto"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ul className="py-1">
                      {suggestions.map((suggestion, i) => (
                        <li key={i}>
                          <button
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-6 py-3 hover:bg-gray-100 text-sm text-gray-900 transition-colors flex items-center gap-2"
                          >
                            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{suggestion}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Search Results */}
              <div className="px-6 py-8 max-h-[500px] overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="w-full md:w-64 shrink-0 border-r border-gray-100 pr-8">
                    <h3 className="font-bold text-base mb-4 text-black">Trending right now</h3>
                    <ul className="space-y-3">
                      {trendingSearches.map((term, i) => (
                        <li key={i}>
                          <button
                            onClick={() => handleTrendingClick(term)}
                            className="text-sm text-black hover:underline hover:text-gray-600 transition-colors text-left w-full"
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-base mb-6 text-black">You might like these bestsellers...</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {products.slice(0, 4).map((product, i) => (
                        <div
                          key={i}
                          className="group cursor-pointer"
                          onClick={() => {
                            navigate(`/products/${product.id}`)
                            onClose({ stopPropagation: () => {} } as any)
                          }}
                        >
                          <div className="relative aspect-square bg-[#F9F9F9] overflow-hidden mb-3">
                            {product.badge && (
                              <span className="absolute top-2 left-2 z-10 text-[10px] font-medium px-2 py-1 border border-black bg-white uppercase">
                                {product.badge}
                              </span>
                            )}
                            <button
                              className="absolute top-2 right-2 z-10 p-2 hover:bg-white/80"
                              onClick={(e) => e.stopPropagation()}
                            >
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
                              <Star className="w-3 h-3 text-black fill-none stroke-current stroke-[1.5]" />
                              <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
