import { FLAVORS } from '@/data/product-data'

import type { Flavor } from '@/types/glossier'

interface BalmSelectorProps {
  index: number
  selectedFlavor: Flavor
  onSelect: (index: number, flavor: Flavor) => void
}

export function BalmSelector({ index, selectedFlavor, onSelect }: BalmSelectorProps) {
  return (
    <div className="border-b border-gray-200 py-6 last:border-0">
      <div className="flex gap-4">
        <div className="w-16 h-20 shrink-0 bg-gray-50 flex flex-col items-center justify-center rounded-sm border border-gray-100">
          <div className="w-4 h-12 rounded-sm" style={{ backgroundColor: selectedFlavor.tubeColor }} />
          <div className="w-4 h-2 rounded-sm mt-0.5" style={{ backgroundColor: selectedFlavor.capColor }} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-base text-black font-normal">Balm Dotcom</h4>
          </div>
          <p className="text-sm text-black mb-3 leading-relaxed font-normal">
            <span className="text-black">{selectedFlavor.name}</span>: {selectedFlavor.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {FLAVORS.map((flavor) => (
              <button
                key={flavor.id}
                onClick={() => onSelect(index, flavor)}
                className={`w-6 h-6 rounded-sm border transition-all ${
                  selectedFlavor.id === flavor.id
                    ? 'border-black ring-1 ring-black scale-110'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: flavor.color }}
                aria-label={`Select ${flavor.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

