/**
 * Animated Logo Component
 */

import { motion } from 'framer-motion'

interface LogoProps {
  onClick?: () => void
  onDoubleClick?: () => void
}

export function Logo({ onClick, onDoubleClick }: LogoProps) {
  return (
    <motion.div
      className="cursor-pointer flex items-center overflow-hidden relative"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-[1.5rem] md:text-[1.625rem] font-bold tracking-tighter italic cursor-pointer flex">
        {['O', 'l', 'i', 'v', 'e', 'y', 'o', 'u', 'n', 'g', '.'].map((letter, index) => (
          <motion.span
            key={index}
            variants={{
              initial: {
                color: '#000000',
              },
              hover: {
                color: ['#000000', '#00C73C', '#7DD321', '#00D98F', '#000000'],
                transition: {
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: 'easeInOut',
                  repeat: 0,
                },
              },
            }}
            className="inline-block"
            style={{ display: 'inline-block' }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

