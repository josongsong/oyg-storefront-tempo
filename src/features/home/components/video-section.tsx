import { useState, useRef } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'

export function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className="w-full py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Text Content */}
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-wider text-gray-500">OUR FRAGRANCES</p>
          
          <h2 className="text-3xl md:text-4xl font-normal leading-tight">
            Your favorite scents that will grow with you no matter where you are in your personal evolution.
          </h2>

          <button className="border border-black px-6 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors">
            Shop now
          </button>

          {/* Review */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-black">★</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-gray-700 mb-3">
              "Such an inviting scent! This is my favorite release so far (aside from the OG) and it's super fun to
              layer with Doux and Rêve. Fleur is summery, with a hint of salt; soft and warm from the cashmeran; with
              some sweetness from the apricot. Definitely my new go to!"
            </p>
            <p className="text-xs text-gray-500">
              Jessica, gifted Glossier You Fleur in exchange for an honest review.
            </p>
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
            <source
              src="https://player.vimeo.com/progressive_redirect/playback/1066988639/rendition/2160p/file.mp4?loc=external&signature=850fec95ae5b33fb502fcd2e8973658324f03a83e253c1ee1d83e9342536e324"
              type="video/mp4"
            />
          </video>

          {/* Video Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-current" />
              ) : (
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
