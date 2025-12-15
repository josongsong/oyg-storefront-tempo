/**
 * Product Recommendations Component
 * 추천 상품 그리드
 */

import { ProductCard } from '@/features/product/components'

import type { ProductListItem } from '@/features/product/types'
import type { GlossierProduct } from '@/shared/types/glossier'

interface ProductRecommendationsProps {
  products: ProductListItem[]
}

function toGlossierProduct(item: ProductListItem): GlossierProduct {
  return {
    id: Number(item.id.replace(/\D/g, '')) || 0,
    brand: item.brand || 'Unknown',
    name: item.name,
    price: item.price,
    rating: item.rating,
    reviews: item.reviewCount || 0,
    badge: item.badge,
    image: item.image,
  }
}

export function ProductRecommendations({ products }: ProductRecommendationsProps) {
  if (products.length === 0) return null

  return (
    <div className="mt-12 md:mt-20">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">You may also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={toGlossierProduct(product)}
            variant="default"
          />
        ))}
      </div>
    </div>
  )
}

