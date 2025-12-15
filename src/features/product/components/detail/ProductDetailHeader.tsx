/**
 * Product Detail Header Component
 * Breadcrumb, Brand, Title, Rating
 */

import { Heart, Star } from 'lucide-react'

import { Breadcrumb } from '@/shared/components/ui'

import type { ProductData } from '@/features/product/types'

interface ProductDetailHeaderProps {
  product: ProductData
  onBrandClick: (brand: string) => void
  onCategoryClick: (category: string) => void
}

export function ProductDetailHeader({ 
  product, 
  onBrandClick, 
  onCategoryClick 
}: ProductDetailHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => {} },
          ...product.categories.slice(1).map((cat) => ({
            label: cat,
            onClick: () => onCategoryClick(cat),
          })),
        ]}
      />

      {/* Brand */}
      <div>
        <button
          onClick={() => onBrandClick(product.brand)}
          className="text-xs md:text-sm font-medium underline underline-offset-2 hover:no-underline"
        >
          {product.brand}
        </button>
      </div>

      {/* Product Name */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-normal leading-tight">
        {product.product_name.replace(product.brand, '').trim()}
      </h1>

      {/* Rating */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 fill-none stroke-current stroke-[1.5] ${
                i < Math.floor(parseFloat(product.rating_avg))
                  ? 'text-black'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{product.rating_avg}</span>
        <button className="text-sm hover:underline">
          ({parseInt(product.rating_count).toLocaleString()})
        </button>
        <button className="text-sm text-blue-600 hover:underline ml-2">
          Ask a question
        </button>
        <button className="text-sm flex items-center gap-1 ml-2">
          <Heart className="w-4 h-4" />
          {parseInt(product.rating_count) > 1000 ? `${Math.floor(parseInt(product.rating_count) / 1000)}K` : product.rating_count}
        </button>
      </div>

      {/* Tags */}
      {product.tags.special_features && (
        <div className="text-xs text-gray-600">
          Highly rated by customers for:{' '}
          <span className="text-blue-600">
            {product.tags.special_features.slice(0, 3).join(', ')}
          </span>
        </div>
      )}
    </>
  )
}

