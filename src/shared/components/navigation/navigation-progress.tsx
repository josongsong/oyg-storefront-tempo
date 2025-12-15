/**
 * Navigation Progress Bar
 * React Router v7 useNavigation - 전역 로딩 상태
 */

import { useNavigation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function NavigationProgress() {
  const navigation = useNavigation()
  const isNavigating = navigation.state === 'loading'

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-0.5 bg-gradient-to-r from-[#00C73C] via-[#7DD321] to-[#00D98F]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

