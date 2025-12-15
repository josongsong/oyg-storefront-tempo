import type { ReactNode } from 'react'
import { useCarousel } from '@/shared/hooks/useCarousel'
import { CarouselNavigation } from './CarouselNavigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface CarouselProps {
  id: string
  children: ReactNode
  gap?: 0 | 2 | 4 | 6 | 8
  showNavigation?: boolean
  navigationVariant?: 'default' | 'minimal' | 'shadow'
  navigationPosition?: 'outside' | 'inside'
  itemWidth?: number
  className?: string
}

/**
 * 범용 가로 스크롤 캐러셀 컴포넌트
 * 
 * @example
 * <Carousel id="products" gap={4} showNavigation>
 *   {items.map(item => <Item key={item.id} {...item} />)}
 * </Carousel>
 */
export function Carousel({
  id,
  children,
  gap = 4,
  showNavigation = true,
  navigationVariant = 'default',
  navigationPosition = 'outside',
  itemWidth = 280,
  className = '',
}: CarouselProps) {
  const { scrollLeft, scrollRight } = useCarousel({ containerId: id, scrollAmount: itemWidth })

  const gapClass = `gap-${gap}`

  return (
    <div className="relative">
      {/* Navigation - Outside */}
      {showNavigation && navigationPosition === 'outside' && (
        <div className="flex justify-end gap-2 mb-4">
          <CarouselNavigation
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
            variant={navigationVariant}
          />
        </div>
      )}

      {/* Carousel Container */}
      <div id={id} className={`overflow-x-auto hide-scrollbar ${className}`}>
        <div className={`flex ${gapClass} pb-4`}>{children}</div>
      </div>

      {/* Navigation - Inside (Absolute) */}
      {showNavigation && navigationPosition === 'inside' && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors rounded-full z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors rounded-full z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  )
}

