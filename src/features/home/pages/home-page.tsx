import { useState } from 'react'

import {
  HeroSectionV2,
  GiftGuideSection,
  CuratedSection,
  TrendingSection,
  VideoSection,
  ExpandableGridSection,
  TikTokGallerySection,
} from '@/features/home/components'
import { ProductDetailView } from '@/features/product/components'
import { FLAVORS } from '@/features/product/constants/product-data'

import type { Flavor } from '@/shared/types/glossier'
import type { ViewType } from '@/features/home/types'

export function Component() {
  const [view] = useState<ViewType>('HOME')

  const [selections, setSelections] = useState<Flavor[]>([FLAVORS[2], FLAVORS[3], FLAVORS[0]])

  const handleSelect = (index: number, flavor: Flavor) => {
    const newSelections = [...selections]
    newSelections[index] = flavor
    setSelections(newSelections)
  }

  return (
    <>
      {view === 'HOME' && (
        <div className="animate-in fade-in duration-500">
          <HeroSectionV2 />
          <GiftGuideSection />
          <CuratedSection />
          <TrendingSection />
          <VideoSection />
          <ExpandableGridSection />
          <TikTokGallerySection />
        </div>
      )}

      {view === 'PDP' && (
        <ProductDetailView selections={selections} onSelectFlavor={handleSelect} />
      )}
    </>
  )
}

Component.displayName = 'HomePage'
