import { Pause, Play, Volume2, VolumeX } from 'lucide-react'

interface VideoControlsProps {
  isPlaying: boolean
  isMuted: boolean
  onTogglePlay: () => void
  onToggleMute: () => void
}

export function VideoControls({ isPlaying, isMuted, onTogglePlay, onToggleMute }: VideoControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 flex gap-3 z-20">
      <button
        onClick={onToggleMute}
        className="w-12 h-12 bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
      </button>

      <button
        onClick={onTogglePlay}
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
  )
}

