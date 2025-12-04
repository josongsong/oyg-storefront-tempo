import { Play } from 'lucide-react'

export function VideoSection() {
  return (
    <section className="w-full relative group">
      <div className="w-full aspect-video md:h-[600px] md:aspect-auto overflow-hidden bg-gray-100 relative">
        <img
          src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2000&auto=format&fit=crop"
          alt="Video Thumbnail"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/30">
            <Play className="w-6 h-6 text-white fill-current ml-1" />
          </button>
        </div>
      </div>
    </section>
  )
}

