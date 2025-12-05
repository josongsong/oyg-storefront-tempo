import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GRID_ITEMS } from '@/features/home/constants/grid-items'

export function ExpandableGridSection() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleItemClick = (id: string) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <section className="w-full min-h-[600px] relative overflow-hidden">
      <div className="flex h-[600px]">
        {GRID_ITEMS.map((item) => {
          const isActive = activeId === item.id
          const isOtherActive = activeId !== null && activeId !== item.id

          return (
            <motion.div
              key={item.id}
              className="relative cursor-pointer overflow-hidden"
              initial={false}
              animate={{
                flex: isActive ? 2 : isOtherActive ? 0.5 : 1,
              }}
              transition={{
                duration: 0.6,
                ease: [0.32, 0.72, 0, 1],
              }}
              onClick={() => handleItemClick(item.id)}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Vertical Text - Always visible */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  opacity: isActive ? 0 : 1,
                }}
                transition={{ duration: isActive ? 0.15 : 0.3 }}
              >
                <h3
                  className="text-white font-bold text-2xl tracking-[0.2em] uppercase"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                  }}
                >
                  {item.subtitle}
                </h3>
              </motion.div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      transition: { duration: 0.3, delay: 0.2 }
                    }}
                    exit={{ 
                      opacity: 0,
                      transition: { duration: 0.15, delay: 0 }
                    }}
                  >
                    <div className="bg-black/90 text-white p-8 max-w-md pointer-events-auto">
                      <p className="text-xs font-bold tracking-wider uppercase mb-4">{item.subtitle}</p>
                      <h2 className="text-3xl font-bold mb-4 leading-tight">{item.title}</h2>
                      <p className="text-base mb-6 leading-relaxed">{item.description}</p>
                      <button className="bg-white text-black px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-gray-200 transition-colors">
                        {item.buttonText}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

