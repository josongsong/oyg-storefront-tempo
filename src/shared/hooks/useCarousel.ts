import { useCallback } from 'react'

export interface UseCarouselOptions {
  containerId: string
  scrollAmount?: number
  smooth?: boolean
}

export interface UseCarouselReturn {
  scrollTo: (position: number) => void
  scrollBy: (amount: number) => void
  scrollLeft: () => void
  scrollRight: () => void
}

/**
 * 캐러셀/가로 스크롤 기능을 위한 훅
 * 
 * @param containerId - 스크롤할 컨테이너의 ID
 * @param scrollAmount - 스크롤 이동 거리 (기본: 280px)
 * @param smooth - 부드러운 스크롤 여부 (기본: true)
 */
export function useCarousel({
  containerId,
  scrollAmount = 280,
  smooth = true,
}: UseCarouselOptions): UseCarouselReturn {
  const scrollTo = useCallback(
    (position: number) => {
      const container = document.getElementById(containerId)
      if (container) {
        container.scrollTo({
          left: position,
          behavior: smooth ? 'smooth' : 'auto',
        })
      }
    },
    [containerId, smooth]
  )

  const scrollBy = useCallback(
    (amount: number) => {
      const container = document.getElementById(containerId)
      if (container) {
        const newPosition = container.scrollLeft + amount
        scrollTo(newPosition)
      }
    },
    [containerId, scrollTo]
  )

  const scrollLeft = useCallback(() => {
    scrollBy(-scrollAmount * 2)
  }, [scrollBy, scrollAmount])

  const scrollRight = useCallback(() => {
    scrollBy(scrollAmount * 2)
  }, [scrollBy, scrollAmount])

  return {
    scrollTo,
    scrollBy,
    scrollLeft,
    scrollRight,
  }
}

