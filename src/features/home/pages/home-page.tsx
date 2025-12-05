import { useState, useEffect } from 'react'

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
import { PromoPopup } from '@/components/ui'
import { usePromoPopupStore } from '@/stores'

import type { Flavor } from '@/types/glossier'
import type { ViewType } from '@/features/home/types'

export function Component() {
  const [view] = useState<ViewType>('HOME')
  const { checkAndOpenPopup } = usePromoPopupStore()

  const [selections, setSelections] = useState<Flavor[]>([FLAVORS[2], FLAVORS[3], FLAVORS[0]])

  // 컴포넌트 마운트 시 프로모션 팝업 체크
  useEffect(() => {
    // 약간의 딜레이 후 팝업 표시 (사용자 경험 향상)
    const timer = setTimeout(() => {
      checkAndOpenPopup()
    }, 1000)

    return () => clearTimeout(timer)
  }, [checkAndOpenPopup])

  const handleSelect = (index: number, flavor: Flavor) => {
    const newSelections = [...selections]
    newSelections[index] = flavor
    setSelections(newSelections)
  }

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <style>{`
        body, .font-sans { font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif; }
      `}</style>

      {/* 프로모션 팝업 */}
      <PromoPopup />

      <main className="relative z-10">
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
      </main>
    </div>
  )
}

Component.displayName = 'HomePage'
