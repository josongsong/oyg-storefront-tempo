import { ChevronLeft, ChevronRight } from 'lucide-react'

import { MOCK_PRODUCTS } from '@/features/product/mocks'
import { useQuickShopStore } from '@/stores'
import { useHorizontalScroll } from '@/features/home/hooks/use-horizontal-scroll'
import { ProductCardCarousel } from './product-card-carousel'
import { MOCK_QUICK_SHOP_SHADES, MOCK_QUICK_SHOP_SIZES, MOCK_QUICK_SHOP_DESCRIPTION } from '@/features/product/constants/quick-shop-mock'

import type { QuickShopProduct } from '@/types/quick-shop'

export function CuratedSection() {
  const openQuickShop = useQuickShopStore((state) => state.openQuickShop)
  const { handleScroll } = useHorizontalScroll({ containerId: 'curated-scroll', scrollAmount: 280 })

  const handleQuickShop = (product: typeof MOCK_PRODUCTS[0]) => {
    const quickShopProduct: QuickShopProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      images: [product.image, product.image, product.image],
      shades: MOCK_QUICK_SHOP_SHADES,
      sizes: MOCK_QUICK_SHOP_SIZES,
      description: MOCK_QUICK_SHOP_DESCRIPTION,
    }

    openQuickShop(quickShopProduct)
  }

  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-normal">Curated for you</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div id="curated-scroll" className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-4 pb-4">
          {[...MOCK_PRODUCTS, ...MOCK_PRODUCTS].map((product, i) => (
            <ProductCardCarousel key={i} product={product} onQuickShop={() => handleQuickShop(product)} />
          ))}
        </div>
      </div>
    </section>
  )
}
