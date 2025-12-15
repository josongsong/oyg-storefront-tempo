import { useState, useEffect } from 'react'
import { ProductCarousel } from '@/features/product/components'
import { getProducts } from '@/features/product/api/product-provider'
import type { GlossierProduct } from '@/shared/types/glossier'

export function CuratedSection() {
  const [products, setProducts] = useState<GlossierProduct[]>([])

  useEffect(() => {
    getProducts().then((data) => {
      // 2배로 복제하여 캐러셀 효과
      setProducts([...data, ...data])
    })
  }, [])

  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-normal">Curated for you</h2>
      </div>

      <ProductCarousel
        id="curated-carousel"
        products={products}
        variant="compact"
        showNavigation
        showWishlist={false}
      />
    </section>
  )
}
