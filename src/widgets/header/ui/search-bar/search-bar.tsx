/**
 * Search Bar Component
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

interface SearchBarProps {
  isOpen: boolean
  onFocus: () => void
  placeholder?: string
}

export function SearchBar({ isOpen, onFocus, placeholder = 'Search 150+ global beauty brands' }: SearchBarProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`w-full max-w-2xl flex items-center px-4 py-2.5 border-2 ${
        isOpen ? 'border-black' : 'border-transparent'
      }`}
      style={{ backgroundColor: '#F5F5F5' }}
      animate={{ 
        backgroundColor: isOpen ? '#FFFFFF' : (isHovered ? '#EAEAEA' : '#F5F5F5')
      }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ 
        scale: {
          type: 'spring', 
          stiffness: 300, 
          damping: 15,
          mass: 0.5
        },
        backgroundColor: {
          duration: 0.2
        }
      }}
    >
      <motion.div
        animate={isHovered ? {
          x: [0, 1, -1, 1.5, -0.5, 0],
          y: [0, -1, 0.5, -1.5, 1, 0]
        } : {
          x: 0,
          y: 0
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: isHovered ? Infinity : 0
        }}
      >
        <Search className="w-4 h-4 text-black mr-2.5 shrink-0" />
      </motion.div>
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[0.8125rem] text-gray-900 placeholder-gray-600 outline-none font-normal"
        onFocus={onFocus}
      />
    </motion.div>
  )
}

