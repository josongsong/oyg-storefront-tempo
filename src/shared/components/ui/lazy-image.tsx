import { useState, useEffect, useRef } from 'react'
import { cn } from '@/shared/utils/cn'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  placeholderClassName?: string
  threshold?: number
}

export function LazyImage({
  src,
  alt,
  className,
  placeholderClassName,
  threshold = 0.1,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(imgRef.current)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={alt}
      className={cn(
        className,
        !isLoaded && placeholderClassName,
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0'
      )}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
      {...props}
    />
  )
}

