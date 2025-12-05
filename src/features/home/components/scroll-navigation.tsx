import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ScrollNavigationProps {
  onScrollLeft: () => void
  onScrollRight: () => void
}

export function ScrollNavigation({ onScrollLeft, onScrollRight }: ScrollNavigationProps) {
  return (
    <>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <button
          onClick={onScrollLeft}
          className="w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <button
          onClick={onScrollRight}
          className="w-12 h-12 bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </>
  )
}

