import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, X } from 'lucide-react'

import { loadAllProducts, searchProducts as searchProductsUtil } from '@/features/product/utils'
import { toGlossierProduct, shuffleArray } from '@/shared/utils/product-transformer'

import type { GlossierProduct } from '@/shared/types/glossier'
import type { ProductListItem } from '@/features/product/types'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: (e: React.MouseEvent) => void
  trendingSearches: string[]
  products?: GlossierProduct[]
}

export function SearchOverlay({ isOpen, onClose, trendingSearches, products: propProducts }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [allProducts, setAllProducts] = useState<ProductListItem[]>([])
  const [randomProducts, setRandomProducts] = useState<GlossierProduct[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [dynamicTrending, setDynamicTrending] = useState<string[]>(trendingSearches)
  const [changedIndices, setChangedIndices] = useState<Set<number>>(new Set())
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
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

  // Dynamic trending searches - initialize and update every 5 seconds
  useEffect(() => {
    if (!isOpen || allProducts.length === 0) {
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current)
      }
      // Reset to default when closed
      if (!isOpen) {
        setDynamicTrending(trendingSearches)
      }
      return
    }

    // Generate pool of trending terms from actual products
    const generateTrendingPool = (): string[] => {
      const terms: string[] = []
      const brands = new Set<string>()
      const productNames: string[] = []
      
      allProducts.forEach(product => {
        brands.add(product.brand)
        productNames.push(product.name)
      })

      // Add all unique brands
      terms.push(...Array.from(brands))
      
      // Add some popular product names
      const shuffledProducts = shuffleArray(productNames)
      terms.push(...shuffledProducts.slice(0, 30))
      
      return shuffleArray(terms)
    }

    const trendingPool = generateTrendingPool()

    // Initialize with random terms from pool
    const initialTrending = shuffleArray(trendingPool).slice(0, 10)
    setDynamicTrending(initialTrending)

    // Update trending searches every 5 seconds
    intervalRef.current = setInterval(() => {
      setDynamicTrending(prev => {
        const newTrending = [...prev]
        const changed = new Set<number>()
        
        // Randomly change 2-4 items
        const numChanges = Math.floor(Math.random() * 3) + 2
        const indicesToChange = new Set<number>()
        
        while (indicesToChange.size < Math.min(numChanges, prev.length)) {
          indicesToChange.add(Math.floor(Math.random() * prev.length))
        }

        indicesToChange.forEach(index => {
          // Get a different term from the pool
          let newTerm = trendingPool[Math.floor(Math.random() * trendingPool.length)]
          let attempts = 0
          while (newTrending.includes(newTerm) && attempts < 20) {
            newTerm = trendingPool[Math.floor(Math.random() * trendingPool.length)]
            attempts++
          }
          newTrending[index] = newTerm
          changed.add(index)
        })

        // Set changed indices for animation
        setChangedIndices(changed)
        
        // Clear changed indices after animation
        setTimeout(() => {
          setChangedIndices(new Set())
        }, 500)

        return newTrending
      })
    }, 5000)

    return () => {
      if (intervalRef.current !== undefined) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isOpen, allProducts, trendingSearches])

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
      onClose({ stopPropagation: () => {} } as React.MouseEvent)
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

            {/* Search Overlay - Mobile: 최상단, Desktop: 검색바 아래 */}
            <motion.div
              className="fixed md:absolute top-0 md:top-[calc(100%-1rem)] left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-full md:max-w-5xl bg-white shadow-2xl z-50 h-screen md:h-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input Area */}
              <div className="bg-white px-6 py-4 relative">
                <div className="flex items-center gap-3 border-b border-black pb-4">
                  <Search className="w-5 h-5 text-black shrink-0 stroke-1" />
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
                            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0 stroke-1" />
                            <span>{suggestion}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Search Results */}
              <div className="px-6 py-8 pb-12 max-h-[calc(100vh-100px)] md:max-h-[500px] overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="w-full md:w-64 shrink-0 border-r border-gray-100 pr-8">
                    <h3 className="font-bold text-lg mb-4 text-black">Trending right now</h3>
                    <ul className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {dynamicTrending.map((term, i) => (
                          <motion.li
                            key={term}
                            layout
                            initial={{ opacity: 0, x: -15, scale: 0.95 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0, 
                              scale: 1,
                              transition: {
                                duration: 0.4,
                                delay: changedIndices.has(i) ? i * 0.08 : 0,
                                ease: [0.4, 0, 0.2, 1]
                              }
                            }}
                            exit={{ 
                              opacity: 0, 
                              x: 15, 
                              scale: 0.95,
                              transition: { duration: 0.2 }
                            }}
                          >
                            <motion.button
                              onClick={() => handleTrendingClick(term)}
                              className="text-sm text-black hover:underline hover:text-gray-600 transition-colors text-left w-full"
                              whileHover={{ x: 3 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                              {term}
                            </motion.button>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-6 text-black">You might like these bestsellers...</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {products.slice(0, 4).map((product, i) => (
                        <div
                          key={i}
                          className="group cursor-pointer"
                          onClick={() => {
                            navigate(`/products/${product.id}`)
                            onClose({ stopPropagation: () => {} } as React.MouseEvent)
                          }}
                        >
                          <div className="relative aspect-square card-surface mb-3">
                            {product.badge && (
                              <span className="absolute top-2 left-2 z-10 text-[10px] font-medium px-2 py-1 border border-black bg-white uppercase">
                                {product.badge}
                              </span>
                            )}
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
