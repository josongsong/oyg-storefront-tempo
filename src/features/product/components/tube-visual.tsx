import type { Flavor } from '@/types/glossier'

interface TubeVisualProps {
  flavor: Flavor
  rotation: number
}

export function TubeVisual({ flavor, rotation }: TubeVisualProps) {
  return (
    <div
      className={`relative w-16 h-48 md:w-20 md:h-64 flex flex-col items-center justify-end transition-all duration-500 ease-in-out`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div
        className="w-full h-full rounded-t-sm relative shadow-lg overflow-hidden flex flex-col justify-end pb-8 items-center"
        style={{ backgroundColor: flavor.tubeColor }}
      >
        <div
          className={`absolute top-1/3 transform -rotate-90 text-3xl font-bold tracking-tighter italic opacity-90`}
          style={{ color: flavor.labelColor }}
        >
          Oliveyoung.
        </div>
        <div className="text-center px-1 mb-2">
          <p className="text-xs font-bold leading-tight uppercase" style={{ color: flavor.labelColor }}>
            {flavor.name}
          </p>
          <p className="text-[10px] leading-tight" style={{ color: flavor.labelColor }}>
            balm dotcom
          </p>
        </div>
      </div>
      <div
        className="w-[110%] h-12 md:h-16 rounded-sm shadow-md mt-[-2px] z-10 relative"
        style={{
          backgroundColor: flavor.capColor,
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-black opacity-10"></div>
      </div>
    </div>
  )
}

