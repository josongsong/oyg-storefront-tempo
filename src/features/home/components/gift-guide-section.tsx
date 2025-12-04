import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const GIFT_CATEGORIES = [
  {
    id: 1,
    title: 'The perfect gift is just a few questions away.',
    subtitle: 'Take the quiz',
    image: 'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=800&auto=format&fit=crop&q=80',
    isQuiz: true,
  },
  {
    id: 2,
    title: 'Skincare Gifts',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Fragrance Gifts',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Hair Gifts',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Body Gifts',
    image: '/cosmetics/s2895845-main-zoom.webp',
  },
  {
    id: 6,
    title: 'Wellness Gifts',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    title: 'Makeup Gifts',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
  },
]

export function GiftGuideSection() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('gift-guide-scroll')
    if (container) {
      const scrollAmount = 300
      const newPosition = direction === 'left' ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto relative">
      {/* Navigation Arrows */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <button
          onClick={() => handleScroll('left')}
          className="w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <button
          onClick={() => handleScroll('right')}
          className="w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable Container */}
      <div id="gift-guide-scroll" className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-0">
          {GIFT_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="shrink-0 w-[280px] md:w-[320px] h-[280px] md:h-[320px] relative group cursor-pointer overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.opacity = '0'
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              
              {category.isQuiz ? (
                <div className="absolute inset-0 flex flex-col items-start justify-center p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{category.title}</h3>
                  <button className="border-2 border-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition-colors">
                    {category.subtitle}
                  </button>
                </div>
              ) : (
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

