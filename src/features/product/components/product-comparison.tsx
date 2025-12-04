import { Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ProductListItem } from '@/types/product-data'

interface ProductComparisonProps {
  currentProduct: {
    id: string
    name: string
    brand: string
    image: string
    price: string
    rating: number
    reviewCount: number
    ingredients?: string[]
    specialFeatures?: string[]
  }
  similarProducts: ProductListItem[]
}

export function ProductComparison({ currentProduct, similarProducts }: ProductComparisonProps) {
  const navigate = useNavigate()
  
  // 현재 제품 + 최대 5개의 유사 제품
  const productsToCompare = [
    {
      id: currentProduct.id,
      name: currentProduct.name,
      brand: currentProduct.brand,
      image: currentProduct.image,
      price: currentProduct.price,
      rating: currentProduct.rating,
      reviewCount: currentProduct.reviewCount,
      specialFeatures: currentProduct.specialFeatures || [],
      isCurrent: true,
    },
    ...similarProducts.slice(0, 5).map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      image: p.image,
      price: p.price,
      rating: p.rating,
      reviewCount: p.reviewCount,
      specialFeatures: p.tags?.special_features || [],
      isCurrent: false,
    }))
  ]

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="w-full border-t border-gray-200 pt-8">
      <h2 className="text-xl md:text-2xl font-normal mb-6">Similar Products</h2>
      
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-32 md:w-40"></th>
              {productsToCompare.map((product) => (
                <th key={product.id} className="w-56 md:w-64 px-2 md:px-3 align-top pb-6">
                  <div className={`${product.isCurrent ? 'border-2 border-black rounded-lg p-4 bg-gray-50/30 shadow-sm' : 'p-2'}`}>
                    <div 
                      className="bg-gray-50 aspect-square flex items-center justify-center mb-3 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => !product.isCurrent && handleProductClick(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div 
                      className="text-xs font-medium underline mb-1 cursor-pointer hover:no-underline text-left"
                      onClick={() => !product.isCurrent && handleProductClick(product.id)}
                    >
                      {product.brand}
                    </div>
                    <div className="text-sm line-clamp-3 mb-2 text-left min-h-[3.6rem]">
                      {product.name}
                    </div>
                    {product.isCurrent && (
                      <div className="text-xs text-blue-600 font-medium text-left">Current Product</div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr className="border-t border-gray-200">
              <td className="py-4 px-2 md:px-0 text-sm font-medium align-top">Price</td>
              {productsToCompare.map((product) => (
                <td key={product.id} className="py-4 px-2 md:px-3 align-top">
                  <div className="text-lg font-bold">{product.price}</div>
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="border-t border-gray-200">
              <td className="py-4 px-2 md:px-0 text-sm font-medium align-top">Rating</td>
              {productsToCompare.map((product) => (
                <td key={product.id} className="py-4 px-2 md:px-3 align-top">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 md:w-4 md:h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-black text-black'
                            : 'fill-none text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs md:text-sm font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-600">
                      {product.reviewCount >= 1000 
                        ? `${(product.reviewCount / 1000).toFixed(1)}K` 
                        : product.reviewCount}
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Ingredient Highlights Row */}
            <tr className="border-t border-gray-200">
              <td className="py-4 px-2 md:px-0 text-sm font-medium align-top">Ingredient<br />Highlights</td>
              {productsToCompare.map((product) => (
                <td key={product.id} className="py-4 px-2 md:px-3 align-top">
                  {product.specialFeatures.length > 0 ? (
                    <div className="text-xs text-gray-700">
                      {product.specialFeatures.slice(0, 3).join(', ')}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">N/A</div>
                  )}
                </td>
              ))}
            </tr>

            {/* Action Buttons Row */}
            <tr className="border-t border-gray-200">
              <td className="py-4 px-2 md:px-0"></td>
              {productsToCompare.map((product) => (
                <td key={product.id} className="py-4 px-2 md:px-3">
                  <button
                    onClick={() => handleProductClick(product.id)}
                    disabled={product.isCurrent}
                    className={`w-full px-4 py-2 border-2 rounded-full text-xs md:text-sm font-medium transition-colors ${
                      product.isCurrent
                        ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50'
                        : 'border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {product.isCurrent ? 'Current' : 'See Details'}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

