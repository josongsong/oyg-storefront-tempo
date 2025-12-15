import { useState, useEffect } from 'react'

import { ProductCard } from '@/features/product/components'
import { TRENDING_CONTENT } from '@/features/home/constants'
import { getTrendingProducts } from '@/features/product/api/product-provider'

import type { GlossierProduct } from '@/shared/types/glossier'

export function TrendingSection() {
  const [products, setProducts] = useState<GlossierProduct[]>([])

  useEffect(() => {
    getTrendingProducts(4).then(setProducts)
  }, [])

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
        <div className="flex-3 w-full">
          <div className="overflow-x-auto hide-scrollbar pb-4">
            <div className="flex gap-4 min-w-max">
              {products.map((p, i) => (
                <div key={i} className="w-[200px] md:w-[250px]">
                  <ProductCard product={p} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

