import { MOCK_PRODUCTS } from '@/features/product/mocks'
import { ProductCarousel } from '@/features/product/components'

export function CuratedSection() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-normal">Curated for you</h2>
      </div>

      <ProductCarousel
        id="curated-carousel"
        products={[...MOCK_PRODUCTS, ...MOCK_PRODUCTS]}
        variant="compact"
        showNavigation
        showWishlist={false}
      />
    </section>
  )
}
