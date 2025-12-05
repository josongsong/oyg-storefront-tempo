import { useState } from 'react'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="bg-gray-100 aspect-square flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    )
  }

  return (
    <div className="md:sticky md:top-4 md:self-start h-fit">
      {/* Main Image */}
      <div className="mb-3 md:mb-4 bg-gray-50 aspect-square flex items-center justify-center overflow-hidden rounded-lg md:rounded-none">
        <img
          src={images[currentImageIndex]}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={`shrink-0 w-16 h-16 md:w-20 md:h-20 bg-gray-50 border-2 transition-all rounded-md ${
                currentImageIndex === index
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

