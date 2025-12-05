import { useVideoControls } from '@/features/home/hooks/use-video-controls'
import { VideoControls } from './video-controls'
import { VIDEO_SECTION_CONTENT } from '@/features/home/constants'

export function VideoSection() {
  const { videoRef, isPlaying, isMuted, togglePlay, toggleMute } = useVideoControls()

  return (
    <section className="w-full py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Text Content */}
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-wider text-gray-500">{VIDEO_SECTION_CONTENT.label}</p>

          <h2 className="text-3xl md:text-4xl font-normal leading-tight">{VIDEO_SECTION_CONTENT.title}</h2>

          <button className="border border-black px-6 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors">
            {VIDEO_SECTION_CONTENT.buttonText}
          </button>

          {/* Review */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex gap-1 mb-3">
              {[...Array(VIDEO_SECTION_CONTENT.review.rating)].map((_, i) => (
                <span key={i} className="text-black">
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-gray-700 mb-3">{VIDEO_SECTION_CONTENT.review.text}</p>
            <p className="text-xs text-gray-500">{VIDEO_SECTION_CONTENT.review.author}</p>
          </div>
        </div>

        {/* Right: Video */}
        <div className="relative group/video aspect-video overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            loop
            autoPlay
            muted
            preload="none"
            aria-label="Video"
            onError={(e) => {
              const target = e.target as HTMLVideoElement
              target.style.opacity = '0'
            }}
          >
            <source src={VIDEO_SECTION_CONTENT.videoUrl} type="video/mp4" />
          </video>

          {/* Video Controls */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
            <VideoControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
