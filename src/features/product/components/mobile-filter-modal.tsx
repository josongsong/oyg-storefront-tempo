/**
 * Mobile Filter Modal
 * 모바일용 바텀 시트 스타일 필터 모달
 */

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { FilterFacet } from './filter-facet'
import { FILTER_DATA } from '@/features/product/constants/filter-data'

interface MobileFilterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileFilterModal({ isOpen, onClose }: MobileFilterModalProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  const handleDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y > 150) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: isMinimized ? 'calc(100% - 80px)' : 0 }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className="fixed bottom-0 left-0 right-0 bg-white z-[70] max-h-[85vh] flex flex-col rounded-t-3xl shadow-2xl"
          >
            {/* Drag Handle */}
            <div className="sticky top-0 bg-white rounded-t-3xl z-10">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label={isMinimized ? 'Expand' : 'Minimize'}
                  >
                    <motion.div
                      animate={{ rotate: isMinimized ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-0">
                {FILTER_DATA.map((filter) => (
                  <FilterFacet key={filter.id} filter={filter} />
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => {
                  // Reset filters logic here
                }}
                className="flex-1 px-6 py-3 border-2 border-black text-black font-medium hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

