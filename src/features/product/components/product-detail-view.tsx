import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { BalmSelector, TubeVisual, AITrioPicker } from '@/features/product/components'
import { THUMBNAILS } from '@/features/product/constants'
import type { Flavor } from '@/shared/types/glossier'

interface ProductDetailViewProps {
  selections: Flavor[]
  onSelectFlavor: (index: number, flavor: Flavor) => void
}

export function ProductDetailView({ selections, onSelectFlavor }: ProductDetailViewProps) {
  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[calc(100vh-100px)]">
        {/* LEFT COLUMN: Product Configuration */}
        <div className="md:col-span-4 lg:col-span-3 p-6 md:p-10 md:pr-4 flex flex-col h-full overflow-y-auto">
          <h1 className="text-4xl tracking-tight mb-2 font-normal text-black">Balm Dotcom Trio</h1>
          <p className="text-lg text-black mb-4 font-normal">Original formula</p>

          <div className="flex items-center gap-1 mb-6">
            <div className="flex text-black">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm text-black ml-1 font-normal">(10126)</span>
          </div>

          <div className="inline-block bg-gray-100 text-black text-sm px-3 py-1.5 mb-8 self-start font-normal">
            Save 13% with this set
          </div>

          <AITrioPicker onSelectTrio={(newSelections) => {
            newSelections.forEach((flavor, index) => {
              onSelectFlavor(index, flavor)
            })
          }} />

          <div className="grow">
            {selections.map((flavor, idx) => (
              <BalmSelector key={idx} index={idx} selectedFlavor={flavor} onSelect={onSelectFlavor} />
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-4">
            <div className="flex items-center justify-between mb-4">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-black font-normal py-4 px-6 text-base transition-colors flex justify-between items-center group">
                <span>Add to bag</span>
                <span className="group-hover:opacity-80">
                  <span className="mr-2 line-through text-black font-normal opacity-50">79,500</span>
                  69,500
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-black font-normal">A tube for every mood.</h3>
              <p className="text-sm text-black leading-relaxed font-normal">
                Treat your lips to a trio of our moisturizing lip balms with our original, cult-favorite formula.
                Pick any three tubes to satisfy your shade and flavor preferences.
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Visual Preview */}
        <div className="md:col-span-5 lg:col-span-5 bg-[#F9F9F9] md:bg-white flex flex-col justify-between relative overflow-hidden">
          <div className="grow flex items-center justify-center p-10 relative min-h-[400px]">
            <div className="flex items-end justify-center gap-4 md:gap-8 transform translate-y-10">
              <TubeVisual flavor={selections[0]} rotation={-5} />
              <TubeVisual flavor={selections[1]} rotation={0} />
              <TubeVisual flavor={selections[2]} rotation={5} />
            </div>
          </div>

          <div className="p-4 flex gap-2 overflow-x-auto pb-8 justify-center">
            <div className="w-16 h-16 border border-black cursor-pointer overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="w-2 h-8 bg-pink-400 -rotate-12 rounded-sm" />
                <div className="w-2 h-8 bg-red-400 rotate-0 mx-1 rounded-sm" />
                <div className="w-2 h-8 bg-yellow-400 rotate-12 rounded-sm" />
              </div>
            </div>
            {THUMBNAILS.map((thumbUrl, i) => (
              <div
                key={i}
                className="w-16 h-16 border border-transparent hover:border-gray-200 cursor-pointer overflow-hidden relative grayscale hover:grayscale-0 transition-all"
              >
                <img
                  src={thumbUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-gray-100 -z-10" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Lifestyle Image */}
        <div className="hidden lg:block lg:col-span-4 relative h-[calc(100vh-100px)] overflow-hidden">
          <div className="absolute inset-0 bg-[#F0EAE5]">
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
                alt="Cake with Balm"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          <div className="absolute bottom-10 right-10 flex gap-4">
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

