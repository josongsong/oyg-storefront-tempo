import { useSearchParams } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { ChevronDown, ChevronUp, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react'

import { ProductCard } from '@/features/product/components'
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner'
import { FilterFacet } from '@/features/product/components'
import { FILTER_DATA } from '@/features/product/constants/filter-data'
import { loadAllProducts, filterByCategory, sortProducts } from '@/features/product/utils'
import type { ProductListItem } from '@/features/product/types'
import type { GlossierProduct } from '@/shared/types/glossier'

type SortOption = 'best-sellers' | 'whats-new' | 'top-rated' | 'a-z' | 'z-a' | 'price-low' | 'price-high'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'best-sellers', label: 'Best Sellers' },
  { value: 'whats-new', label: "What's New" },
  { value: 'top-rated', label: 'Top Rated' },
  { value: 'a-z', label: 'A - Z' },
  { value: 'z-a', label: 'Z - A' },
  { value: 'price-low', label: 'Price (low to high)' },
  { value: 'price-high', label: 'Price (high to low)' },
]

const ITEMS_PER_PAGE_OPTIONS = [20, 40, 60, 100]

// Helper function to convert ProductListItem to GlossierProduct
function toGlossierProduct(item: ProductListItem): GlossierProduct {
  return {
    id: item.id,
    name: item.name,
    brand: item.brand,
    price: item.price,
    rating: item.rating,
    reviews: item.reviewCount,
    image: item.image,
    badge: item.badge,
    valueText: item.originalPrice ? `Save ${((parseFloat(item.originalPrice.replace(/[^0-9.]/g, '')) - parseFloat(item.price.replace(/[^0-9.]/g, ''))) / parseFloat(item.originalPrice.replace(/[^0-9.]/g, '')) * 100).toFixed(0)}%` : undefined,
  }
}

export function Component() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const [sortBy, setSortBy] = useState<SortOption>('best-sellers')
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [allProducts, setAllProducts] = useState<ProductListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [isPerPageOpen, setIsPerPageOpen] = useState(false)

  // Load products on mount
  useEffect(() => {
    loadAllProducts().then((products) => {
      setAllProducts(products)
      setIsLoading(false)
    })
  }, [])

  const title = query ? `Search results for "${query}"` : category || 'All Products'
  
  // Reset to page 1 when query or category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [query, category])
  
  // Filter and sort products (all results, before pagination)
  const allFilteredProducts = useMemo(() => {
    if (isLoading || allProducts.length === 0) {
      return []
    }

    let filtered = allProducts

    // If search query exists, show random 50 products instead of searching
    if (query) {
      // Shuffle array using Fisher-Yates algorithm
      const shuffled = [...allProducts]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      filtered = shuffled.slice(0, 50)
    }
    // Apply category filter
    else if (category) {
      filtered = filterByCategory(filtered, category)
      // Apply sorting for category
      filtered = sortProducts(filtered, sortBy)
    }
    // For all products view
    else {
      filtered = sortProducts(filtered, sortBy)
    }

    // Convert to GlossierProduct format
    return filtered.map(toGlossierProduct)
  }, [allProducts, query, category, sortBy, isLoading])

  // Paginate products
  const displayProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return allFilteredProducts.slice(startIndex, endIndex)
  }, [allFilteredProducts, currentPage, itemsPerPage])

  const totalPages = Math.ceil(allFilteredProducts.length / itemsPerPage)
  const resultCount = allFilteredProducts.length
  
  const selectedLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Best Sellers'

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Reset to first page
    setIsPerPageOpen(false)
  }

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-normal mb-2">{title}</h1>
        <p className="text-sm text-gray-500">{resultCount} results</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Left Sidebar: Filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="space-y-0">
            {FILTER_DATA.map((filter) => (
              <FilterFacet key={filter.id} filter={filter} />
            ))}
          </div>
        </aside>

        {/* Right: Products */}
        <div className="flex-1">
          {/* Sort Bar */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <button className="md:hidden text-sm font-medium flex items-center gap-1 hover:text-gray-600">
              Filter <Plus className="w-3 h-3" />
            </button>
            <div className="ml-auto flex items-center gap-4">
              {/* Items per page */}
              <div className="relative">
                <button
                  onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                  className="flex items-center gap-2 cursor-pointer text-sm group"
                >
                  <span className="text-gray-500">Show</span>
                  <span className="font-medium underline decoration-gray-400 underline-offset-4 group-hover:decoration-black transition-all">
                    {itemsPerPage}
                  </span>
                  {isPerPageOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Items per page dropdown */}
                {isPerPageOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsPerPageOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 shadow-lg z-20">
                      {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleItemsPerPageChange(option)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            itemsPerPage === option ? 'bg-gray-100' : ''
                          }`}
                        >
                          <span>{option}</span>
                          {itemsPerPage === option && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Sort by */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 cursor-pointer text-sm group"
                >
                  <span className="text-gray-500">Sort by</span>
                  <span className="font-medium underline decoration-gray-400 underline-offset-4 group-hover:decoration-black transition-all">
                    {selectedLabel}
                  </span>
                  {isSortOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Sort dropdown */}
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 shadow-lg z-20">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
                            setIsSortOpen(false)
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            sortBy === option.value ? 'bg-gray-100' : ''
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <LoadingSpinner size="lg" text="Loading products..." />
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <p className="text-lg text-gray-500 mb-2">No products found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-10">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[40px] h-[40px] border transition-colors ${
                            currentPage === page
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 hover:border-black'
                          }`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className="px-2 text-gray-400">
                          {page}
                        </span>
                      )
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Page Info */}
                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, resultCount)} of {resultCount} products
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

Component.displayName = 'ProductListPage'
