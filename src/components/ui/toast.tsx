import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useToastStore } from '@/stores/toast.store'

const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const TOAST_COLORS = {
  success: 'bg-[#00C73C] text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
}

export function Toast() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse items-center gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => {
          const Icon = TOAST_ICONS[toast.type || 'success']
          const colorClass = TOAST_COLORS[toast.type || 'success']
          
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ 
                opacity: 0, 
                y: 50,
                scale: 0.8
              }}
              animate={{ 
                opacity: 1, 
                y: index * -8, // Stacked offset
                scale: 1 - index * 0.05, // Slightly smaller for stacked items
                zIndex: toasts.length - index,
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                y: -20,
                transition: { duration: 0.2 }
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className={`${colorClass} rounded-lg shadow-2xl px-5 py-3.5 flex items-center gap-3 min-w-[320px] max-w-[500px] pointer-events-auto`}
              style={{
                marginBottom: index > 0 ? '-8px' : '0',
              }}
            >
              <motion.div
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
              
              <p className="flex-1 text-sm font-medium">
                {toast.message}
              </p>
              
              <motion.button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Progress bar */}
              {toast.duration && toast.duration > 0 && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg"
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

