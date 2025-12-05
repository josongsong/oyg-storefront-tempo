import { HERO_CONTENT, HERO_VIDEO } from '@/features/home/constants'
import { HeroContent } from './hero-content'
import { VideoControls } from './video-controls'
import { useVideoControls } from '@/features/home/hooks/use-video-controls'

export function HeroSectionV2() {
  const { videoRef, isPlaying, isMuted, togglePlay, toggleMute } = useVideoControls()

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-white">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-white/10" />

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
        <source src={HERO_VIDEO.desktop} type="video/mp4" media="(min-width: 768px)" />
        {/* Mobile Video */}
        <source src={HERO_VIDEO.mobile} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <HeroContent
        title={HERO_CONTENT.title}
        description={HERO_CONTENT.description}
        ctaText={HERO_CONTENT.cta}
      />

      {/* Video Controls */}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
      />
    </div>
  )
}

