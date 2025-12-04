import { ProductCard } from '@/components/ui/product-card'
import { MOCK_PRODUCTS } from '@/data/mock-products'

export function CuratedSection() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto bg-[#FAFAFA]">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-normal border-b border-black pb-1">Curated for you</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_PRODUCTS.slice(0, 4).map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
    </section>
  )
}

