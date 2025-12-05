interface UseHorizontalScrollOptions {
  containerId: string
  scrollAmount?: number
}

export function useHorizontalScroll({ containerId, scrollAmount = 280 }: UseHorizontalScrollOptions) {
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(containerId)
    if (container) {
      const amount = direction === 'left' ? -scrollAmount * 2 : scrollAmount * 2
      const currentScroll = container.scrollLeft
      const newPosition = currentScroll + amount
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
    }
  }

  return { handleScroll }
}

