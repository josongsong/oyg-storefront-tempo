import { ProductCard } from '@/features/product/components'
import { MOCK_PRODUCTS } from '@/features/product/mocks'
import { TRENDING_CONTENT } from '@/features/home/constants'

export function TrendingSection() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {TRENDING_CONTENT.title.line1}
            <br />
            {TRENDING_CONTENT.title.line2}
          </h2>
          <p className="text-base text-gray-600 mb-6">{TRENDING_CONTENT.description}</p>
          <button className="underline text-base font-bold hover:text-gray-600">
            {TRENDING_CONTENT.buttonText}
          </button>
        </div>
        <div className="flex-3 w-full overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4 min-w-max">
            {MOCK_PRODUCTS.slice(0, 4).map((p, i) => (
              <div key={i} className="w-[200px] md:w-[250px]">
                <ProductCard product={{ ...p, id: `trend-${i}` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

