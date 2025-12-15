import { GIFT_CATEGORIES } from '@/features/home/constants'
import { GiftCategoryCard } from './gift-category-card'
import { Carousel } from '@/shared/components/Carousel'

export function GiftGuideSection() {
  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <Carousel
        id="gift-guide-carousel"
        showNavigation
        navigationVariant="shadow"
        navigationPosition="inside"
        itemWidth={320}
        gap={0}
      >
        {GIFT_CATEGORIES.map((category) => (
          <GiftCategoryCard
            key={category.id}
            title={category.title}
            subtitle={category.subtitle}
            image={category.image}
            isQuiz={category.isQuiz}
          />
        ))}
      </Carousel>
    </section>
  )
}

