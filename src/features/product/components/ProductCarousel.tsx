import { Carousel } from '@/shared/components/Carousel'
import { ProductCard } from './product-card'
import { useQuickShopStore } from '@/features/product/stores'
import type { GlossierProduct } from '@/shared/types/glossier'
import type { QuickShopProduct } from '@/features/product/types'
import { MOCK_QUICK_SHOP_SHADES, MOCK_QUICK_SHOP_SIZES, MOCK_QUICK_SHOP_DESCRIPTION } from '@/features/product/constants/quick-shop-mock'

export interface ProductCarouselProps {
  id: string
  products: GlossierProduct[]
  variant?: 'default' | 'compact'
  showNavigation?: boolean
  showWishlist?: boolean
  gap?: 2 | 4 | 6 | 8
}

/**
 * 상품 캐러셀 컴포넌트
 * 
 * Carousel + ProductCard의 조합
 */
export function ProductCarousel({
  id,
  products,
  variant = 'default',
  showNavigation = true,
  showWishlist = true,
  gap = 4,
}: ProductCarouselProps) {
  const openQuickShop = useQuickShopStore((state) => state.openQuickShop)

  const handleQuickShop = (product: GlossierProduct) => {
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
    <Carousel id={id} gap={gap} showNavigation={showNavigation} itemWidth={260}>
      {products.map((product, i) => (
        <ProductCard
          key={i}
          product={product}
          variant={variant}
          showWishlist={showWishlist}
          onQuickShop={() => handleQuickShop(product)}
        />
      ))}
    </Carousel>
  )
}

