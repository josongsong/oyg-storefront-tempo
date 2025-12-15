import { useState } from 'react'
import { Minus, Plus, Search } from 'lucide-react'

import type { Filter } from '@/shared/types/glossier'

interface FilterFacetProps {
  filter: Filter
}

export function FilterFacet({ filter }: FilterFacetProps) {
  const [isOpen, setIsOpen] = useState(filter.isOpen)
  const isRadio = filter.type === 'radio'

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-base font-normal text-black">{filter.title}</span>
        {isOpen ? <Minus className="w-3 h-3 text-black" /> : <Plus className="w-3 h-3 text-black" />}
      </div>

      {isOpen && (
        <div className="mt-4 space-y-3 animate-in slide-in-from-top-1 duration-200">
          {filter.hasSearch && (
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search for a brand"
                className="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-0 placeholder-gray-500"
              />
              <Search className="w-3 h-3 absolute right-3 top-1/2 transform -translate-y-1/2 text-black" />
            </div>
          )}

          {filter.options.map((option, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group/item">
              <div className="relative flex items-center">
                <input
                  type={isRadio ? 'radio' : 'checkbox'}
                  name={isRadio ? filter.id : undefined}
                  className={`
                    peer appearance-none h-4 w-4 border border-black
                    checked:bg-transparent checked:border-black cursor-pointer
                    ${isRadio ? 'rounded-full' : 'rounded-sm'}
                  `}
                />
                {isRadio ? (
                  <div className="w-2.5 h-2.5 bg-black rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                ) : (
                  <div className="w-2.5 h-2.5 bg-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-0 peer-checked:scale-100 transition-transform pointer-events-none rounded-[1px]"></div>
                )}
              </div>
              <span className="text-sm text-black font-normal">{option.label}</span>
              <span className="text-sm text-gray-400 ml-auto">({option.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

