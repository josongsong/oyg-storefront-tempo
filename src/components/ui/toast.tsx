import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useToastStore } from '@/stores/toast.store'

const TOAST_ICONS = {
  success: Check,
  error: X,
  info: Check,
}

const TOAST_COLORS = {
  success: 'text-white',
  error: 'text-white',
  info: 'text-white',
}

const TOAST_BG_ANIMATION = {
  success: { 
    colors: ['#000000', '#00C73C', '#7DD321', '#00D98F', '#00C73C']
  },
  error: { 
    colors: ['#000000', '#EF4444', '#F87171', '#EF4444']
  },
  info: { 
    colors: ['#000000', '#3B82F6', '#60A5FA', '#3B82F6']
  },
}

export function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse items-center gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => {
          const Icon = TOAST_ICONS[toast.type || 'success']
          const colorClass = TOAST_COLORS[toast.type || 'success']
          const bgAnimation = TOAST_BG_ANIMATION[toast.type || 'success']
          
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                y: 0
              }}
              animate={{ 
                opacity: 1, 
                scale: 1 - index * 0.05,
                y: index * -8, // Stacked offset
                zIndex: toasts.length - index,
              }}
              exit={{ 
                opacity: 0,
                scale: 0.5,
                y: 0,
                transition: { duration: 0.2 }
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className={`${colorClass} rounded-lg shadow-2xl px-5 py-3.5 flex items-center gap-3 min-w-[320px] max-w-[500px] pointer-events-auto relative overflow-hidden`}
              style={{
                marginBottom: index > 0 ? '-8px' : '0',
                backgroundColor: bgAnimation.colors[0]
              }}
            >
              {/* Wave animation background - Oliveyoung style */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                initial={{ 
                  x: '-100%',
                  backgroundColor: bgAnimation.colors[0]
                }}
                animate={{ 
                  x: '0%',
                  backgroundColor: bgAnimation.colors
                }}
                transition={{
                  x: {
                    duration: 0.6,
                    ease: [0.32, 0.72, 0, 1]
                  },
                  backgroundColor: {
                    duration: 0.8,
                    ease: "easeInOut",
                    times: bgAnimation.colors.map((_, i) => i / (bgAnimation.colors.length - 1))
                  }
                }}
              />
              <motion.div
                className="relative z-10"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  delay: 0.1
                }}
              >
                <Icon className="w-5 h-5 shrink-0" />
              </motion.div>
              
              <p className="flex-1 text-sm font-medium relative z-10">
                {toast.message}
              </p>
              
              <motion.button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors relative z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Progress bar */}
              {toast.duration && toast.duration > 0 && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg z-20"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ 
                    duration: toast.duration / 1000,
                    ease: "linear"
                  }}
                />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

