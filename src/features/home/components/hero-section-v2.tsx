import { useState, useRef } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'

export function HeroSectionV2() {
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
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300" />
      
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        loop
        autoPlay
        muted
        preload="none"
        aria-label="Hero Video"
        onError={(e) => {
          const target = e.target as HTMLVideoElement
          target.style.opacity = '0'
        }}
      >
        {/* Desktop Video */}
        <source
          src="https://player.vimeo.com/progressive_redirect/playback/1121576639/rendition/720p/file.mp4?loc=external&signature=cb21026e19af2308707d93a88ab361b27232f6e757bb2de7416f618ebf2b4fe4"
          type="video/mp4"
          media="(min-width: 768px)"
        />
        {/* Mobile Video */}
        <source
          src="https://player.vimeo.com/progressive_redirect/playback/1121580917/rendition/1440p/file.mp4?loc=external&signature=3713df9b40a51f7588b9716c69fc3c98aba9e7b9ba57c93635072cb7f296fe5a"
          type="video/mp4"
        />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 z-10">
        <h2 className="text-[3.5rem] md:text-[5rem] font-bold mb-4 tracking-tight drop-shadow-lg leading-[0.9]">
          Spoil Them With
          <br />
          Every Spritz
        </h2>
        <p className="text-[1.1rem] md:text-[1.3rem] font-medium mb-8 max-w-lg drop-shadow-md">
          Treat them to an iconic fragrance and compliments will follow everywhere they go.
        </p>
        <button className="bg-white text-black px-8 py-3 text-base font-bold hover:bg-gray-100 transition-colors">
          Shop now
        </button>
      </div>

      {/* Video Controls */}
      <div className="absolute bottom-6 right-6 flex gap-3 z-20">
        <button
          onClick={toggleMute}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
        </button>

        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white fill-current" />
          ) : (
            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
          )}
        </button>
      </div>
    </div>
  )
}

