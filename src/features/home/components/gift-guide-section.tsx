import { GIFT_CATEGORIES } from '@/features/home/constants'
import { GiftCategoryCard } from './gift-category-card'
import { ScrollNavigation } from './scroll-navigation'
import { useHorizontalScroll } from '@/features/home/hooks/use-horizontal-scroll'

export function GiftGuideSection() {
  const { handleScroll } = useHorizontalScroll({ containerId: 'gift-guide-scroll', scrollAmount: 300 })

  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto relative">
      <ScrollNavigation
        onScrollLeft={() => handleScroll('left')}
        onScrollRight={() => handleScroll('right')}
      />

      {/* Scrollable Container */}
      <div id="gift-guide-scroll" className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-0">
          {GIFT_CATEGORIES.map((category) => (
            <GiftCategoryCard
              key={category.id}
              title={category.title}
              subtitle={category.subtitle}
              image={category.image}
              isQuiz={category.isQuiz}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

