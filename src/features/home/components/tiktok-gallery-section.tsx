import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TIKTOK_VIDEOS } from '@/features/home/constants/tiktok-data'
import type { TikTokVideo } from '@/types/tiktok'

export function TikTokGallerySection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollPosition()
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 302 * 2 // 300px width + 2px gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      })
      
      setTimeout(checkScrollPosition, 300)
    }
  }

  return (
    <section className="py-16 bg-white w-full">
      <div className="w-full">
        <div className="mb-4 px-4">
          <h2 className="text-3xl md:text-4xl font-normal text-center mb-2">
            Shop From Our Community
          </h2>
          <p className="text-center text-gray-600 text-sm md:text-base">
            Discover real reviews and tutorials from beauty lovers
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-0.5 pb-4 px-2 items-center py-20">
              {TIKTOK_VIDEOS.map((video) => (
                <TikTokVideoCard key={video.id} video={video} />
              ))}
            </div>
          </div>

          {/* 네비게이션 화살표 */}
          <div className="flex justify-center items-center gap-0 mt-6">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex items-center justify-center w-11 h-11 p-0 cursor-pointer border-none bg-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              aria-label="Previous item"
            >
              <ChevronLeft className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex items-center justify-center w-11 h-11 p-0 cursor-pointer border-none bg-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              aria-label="Next item"
            >
              <ChevronRight className="w-5 h-5 text-black" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

interface TikTokVideoCardProps {
  video: TikTokVideo
}

function TikTokVideoCard({ video }: TikTokVideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleVideoHover = (hover: boolean) => {
    if (hover && videoRef.current && video.videoUrl) {
      videoRef.current.play()
      setIsPlaying(true)
    } else if (!hover && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  // 기본 90% 크기 (scale 0.9), 재생 시 100% (scale 1)
  const scale = isPlaying ? 1 : 0.9

  return (
    <div
      className="flex-shrink-0 flex flex-col items-center transition-transform duration-500 ease-in-out origin-center"
      style={{ 
        gap: '10px',
        transform: `scale(${scale})`,
        zIndex: isPlaying ? 10 : 1,
      }}
      onMouseEnter={() => handleVideoHover(true)}
      onMouseLeave={() => handleVideoHover(false)}
    >
      {/* 비디오 컨테이너 */}
      <div
        className="relative w-[300px] h-[388px] rounded-[10px] overflow-hidden cursor-pointer group bg-gray-100"
        onClick={handleVideoClick}
      >
        {/* 비디오 */}
        {video.videoUrl ? (
          <video
            ref={videoRef}
            poster={video.thumbnail}
            src={video.videoUrl}
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            preload="metadata"
          />
        ) : (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* 음소거 버튼 */}
        <button
          className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full border-none cursor-pointer hover:bg-black/50 transition-colors"
          aria-label="Mute video"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.266 1.551a0.667 0.667 0 0 1 0.382 0.583v7.714c0 0.261 -0.161 0.482 -0.381 0.602a0.651 0.651 0 0 1 -0.703 -0.12L2.85 7.918h-1.346a1.269 1.269 0 0 1 -1.286 -1.286v-1.286c0 -0.703 0.562 -1.286 1.286 -1.286h1.346L5.563 1.671a0.651 0.651 0 0 1 0.703 -0.12Zm2.492 2.651 1.105 1.106 1.105 -1.106c0.18 -0.18 0.483 -0.18 0.663 0 0.201 0.201 0.201 0.502 0 0.683L10.526 5.991l1.106 1.104c0.201 0.201 0.201 0.502 0 0.683a0.44 0.44 0 0 1 -0.663 0l-1.106 -1.105 -1.104 1.106c-0.201 0.201 -0.502 0.201 -0.683 0 -0.201 -0.182 -0.201 -0.483 0 -0.684l1.105 -1.105L8.073 4.886c-0.2 -0.18 -0.2 -0.482 0 -0.683 0.182 -0.18 0.483 -0.18 0.684 0Z"
              fill="#fff"
            />
          </svg>
        </button>

        {/* 재생/일시정지 버튼 */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M4 3.532c0-1.554 1.696-2.514 3.029-1.715l14.113 8.468c1.294.777 1.294 2.653 0 3.43L7.029 22.183c-1.333.8-3.029-.16-3.029-1.715V3.532Z"
                  fill="#000"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 제품 정보 카드 */}
      {video.product && (
        <div className="relative w-[300px] min-h-[80px] rounded-[5px] border border-[#767676] bg-white p-0 overflow-hidden">
          <div className="flex min-h-[80px]">
            {/* 제품 이미지 및 정보 */}
            <div className="flex flex-1 gap-3 p-3 pr-10">
              <img
                src={video.product.image}
                alt={video.product.name}
                className="w-[64px] h-[64px] rounded-lg object-cover flex-shrink-0"
                loading="lazy"
              />
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <p
                  className="text-[13px] leading-[15px] font-bold text-[#090A0B] line-clamp-2"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  {video.product.name}
                </p>
                <p
                  className="text-[12px] leading-[14px] font-bold text-[#090A0B]"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  {video.product.price}
                </p>
              </div>
            </div>

            {/* 추가 버튼 */}
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full bg-[#090A0B] flex items-center justify-center cursor-pointer border-none hover:bg-gray-800 transition-colors"
              aria-label="Add to cart"
            >
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="30" rx="15" fill="#090A0B" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 11a1 1 0 1 0-2 0v3h-3a1 1 0 1 0 0 2h3v3a1 1 0 0 0 2 0v-3h3a1 1 0 1 0 0-2h-3v-3Z"
                  fill="#fff"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

