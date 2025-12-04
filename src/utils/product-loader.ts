import type { ProductData, ProductListItem } from '@/types/product-data'

// Cache for loaded products
let productsCache: ProductListItem[] | null = null

/**
 * Load all products from script/data/*.json files
 * Note: import.meta.glob only works with source files, not public folder
 */
export async function loadAllProducts(): Promise<ProductListItem[]> {
  if (productsCache) {
    return productsCache
  }

  try {
    // Import all JSON files from script/data directory
    const modules = import.meta.glob<{ default: ProductData }>('../../script/data/*.json')
    
    const products: ProductListItem[] = []
    const { toProductListItem } = await import('@/types/product-data')

    // Load each file
    for (const path in modules) {
      try {
        const module = await modules[path]()
        const productData = module.default
        const listItem = toProductListItem(productData)
        products.push(listItem)
      } catch (error) {
        console.warn(`Failed to load product from ${path}:`, error)
      }
    }

    console.log(`Loaded ${products.length} products`)
    productsCache = products
    return products
  } catch (error) {
    console.error('Failed to load products:', error)
    return []
  }
}

/**
 * Search products by query
 */
export function searchProducts(products: ProductListItem[], query: string): ProductListItem[] {
  if (!query.trim()) {
    return products
  }

  const searchTerm = query.toLowerCase().trim()

  return products.filter((product) => {
    // Search in name
    if (product.name.toLowerCase().includes(searchTerm)) {
      return true
    }

    // Search in brand
    if (product.brand.toLowerCase().includes(searchTerm)) {
      return true
    }

    // Search in categories
    if (product.categories.some((cat) => cat.toLowerCase().includes(searchTerm))) {
      return true
    }

    // Search in tags
    if (product.tags.product_type?.some((type) => type.toLowerCase().includes(searchTerm))) {
      return true
    }

    if (product.tags.special_features?.some((feature) => feature.toLowerCase().includes(searchTerm))) {
      return true
    }

    return false
  })
}

/**
 * Filter products by category
 */
export function filterByCategory(products: ProductListItem[], category: string): ProductListItem[] {
  if (!category) {
    return products
  }

  const categoryLower = category.toLowerCase()

  return products.filter((product) => {
    return product.categories.some((cat) => cat.toLowerCase().includes(categoryLower))
  })
}

/**
 * Filter products by brand
 */
export function filterByBrand(products: ProductListItem[], brand: string): ProductListItem[] {
  if (!brand) {
    return products
  }

  return products.filter((product) => product.brand.toLowerCase() === brand.toLowerCase())
}

/**
 * Sort products
 */
export function sortProducts(
  products: ProductListItem[],
  sortBy: 'best-sellers' | 'whats-new' | 'top-rated' | 'a-z' | 'z-a' | 'price-low' | 'price-high'
): ProductListItem[] {
  const sorted = [...products]

  switch (sortBy) {
    case 'whats-new':
      // Reverse order (assuming newer products are at the end)
      return sorted.reverse()
    
    case 'top-rated':
      return sorted.sort((a, b) => b.rating - a.rating)
    
    case 'a-z':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    
    case 'z-a':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    
    case 'price-low':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0
        return priceA - priceB
      })
    
    case 'price-high':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0
        return priceB - priceA
      })
    
    case 'best-sellers':
    default:
      // Sort by review count and rating
      return sorted.sort((a, b) => {
        const scoreA = a.reviewCount * a.rating
        const scoreB = b.reviewCount * b.rating
        return scoreB - scoreA
      })
  }
}

/**
 * Get trending/popular products
 */
export function getTrendingProducts(products: ProductListItem[], limit: number = 10): ProductListItem[] {
  return sortProducts(products, 'best-sellers').slice(0, limit)
}

/**
 * Load a single product by ID
 */
export async function loadProductById(productId: string): Promise<ProductData | null> {
  try {
    // Import all JSON files from script/data directory
    const modules = import.meta.glob<{ default: ProductData }>('../../script/data/*.json')
    
    // Load each file to find the matching product
    for (const path in modules) {
      try {
        const module = await modules[path]()
        const productData = module.default
        
        if (productData.product_id === productId) {
          return productData
        }
      } catch (error) {
        console.warn(`Failed to load product from ${path}:`, error)
      }
    }

    return null
  } catch (error) {
    console.error('Failed to load product:', error)
    return null
  }
}

/**
 * Get similar/recommended products based on categories and tags
 */
export function getRecommendedProducts(
  allProducts: ProductListItem[],
  currentProduct: ProductListItem,
  limit: number = 12
): ProductListItem[] {
  // Filter products by similar categories
  const similar = allProducts.filter((p) => {
    if (p.id === currentProduct.id) return false
    
    // Check for common categories
    const hasCommonCategory = p.categories.some((cat) => 
      currentProduct.categories.includes(cat)
    )
    
    return hasCommonCategory
  })

  // Sort by rating and review count
  const sorted = similar.sort((a, b) => {
    const scoreA = a.reviewCount * a.rating
    const scoreB = b.reviewCount * b.rating
    return scoreB - scoreA
  })

  return sorted.slice(0, limit)
}

