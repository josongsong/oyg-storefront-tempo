/**
 * Responsive Image Component
 * 반응형 이미지 로딩 최적화 (lazy loading, srcset)
 */

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/shared/utils'

interface ResponsiveImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto'
  priority?: boolean
  sizes?: string
  onError?: () => void
}

export function ResponsiveImage({
  src,
  alt,
  className,
  aspectRatio = 'auto',
  priority = false,
  sizes = '100vw',
  onError,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '100px',
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  const aspectClasses = {
    square: 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    auto: '',
  }

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        aspectClasses[aspectRatio],
        className
      )}
    >
      {/* Skeleton loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      {/* Image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover object-center transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Image unavailable
        </div>
      )}
    </div>
  )
}

