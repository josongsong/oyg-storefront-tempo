/**
 * User Actions Component
 * Displays user menu, wishlist, notifications, and cart
 */

import { motion } from 'framer-motion'
import { Heart, Bell, ShoppingBag, User, LogOut } from 'lucide-react'
import { useRef } from 'react'

interface UserActionsProps {
  // User state
  isLoggedIn: boolean
  userName?: string
  onLogin: () => void
  onLogout: () => void
  
  // Actions
  onLocaleClick: () => void
  onStoresClick: () => void
  onWishlistClick: () => void
  onNotificationClick: () => void
  onCartClick: () => void
  
  // Counts
  wishlistCount: number
  notificationCount: number
  cartCount: number
  
  // Current locale
  locale: string
  
  // Refs
  notificationTriggerRef?: React.RefObject<HTMLDivElement>
}

export function UserActions({
  isLoggedIn,
  userName,
  onLogin,
  onLogout,
  onLocaleClick,
  onStoresClick,
  onWishlistClick,
  onNotificationClick,
  onCartClick,
  wishlistCount,
  notificationCount,
  cartCount,
  locale,
  notificationTriggerRef,
}: UserActionsProps) {
  const defaultNotificationRef = useRef<HTMLDivElement>(null)
  const notifRef = notificationTriggerRef || defaultNotificationRef

  return (
    <div className="flex items-center justify-end gap-3 md:gap-5 text-black">
      {/* Locale */}
      <motion.div
        className="hidden md:block text-[0.8125rem] font-normal cursor-pointer hover:text-gray-600"
        whileHover={{ y: -1 }}
        onClick={onLocaleClick}
      >
        {locale.toUpperCase()}
      </motion.div>

      {/* Stores */}
      <motion.div
        className="hidden md:block text-[0.8125rem] font-normal cursor-pointer hover:text-gray-600"
        whileHover={{ y: -1 }}
        onClick={onStoresClick}
      >
        STORES
      </motion.div>

      {/* User */}
      {isLoggedIn ? (
        <div className="flex items-center gap-3">
          <motion.div
            className="hidden md:block text-[0.8125rem] font-normal text-gray-700"
            whileHover={{ y: -1 }}
          >
            {userName}
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="cursor-pointer"
          >
            <LogOut className="w-5 h-5 hover:text-gray-600 stroke-1" />
          </motion.div>
        </div>
      ) : (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogin}
        >
          <User className="w-5 h-5 cursor-pointer hover:text-gray-600 stroke-1" />
        </motion.div>
      )}

      {/* Wishlist */}
      <motion.div
        className="relative cursor-pointer hover:text-gray-600"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={onWishlistClick}
      >
        <Heart className="w-5 h-5 stroke-1" />
        {wishlistCount > 0 && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 bg-[#D23F57] text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {wishlistCount > 9 ? '9+' : wishlistCount}
          </motion.span>
        )}
      </motion.div>

      {/* Notification Bell */}
      <motion.div
        ref={notifRef}
        className="relative cursor-pointer hover:text-gray-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNotificationClick}
      >
        <motion.div
          animate={
            notificationCount > 0
              ? {
                  rotate: [0, -15, 15, -15, 15, 0],
                }
              : {}
          }
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <Bell className="w-5 h-5 stroke-1" />
        </motion.div>
        {notificationCount > 0 && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 bg-[#D23F57] text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {notificationCount > 9 ? '9+' : notificationCount}
          </motion.span>
        )}
      </motion.div>

      {/* Cart */}
      <motion.div
        className="relative cursor-pointer hover:text-gray-600"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCartClick}
      >
        <ShoppingBag className="w-5 h-5 stroke-1" />
        {cartCount > 0 && (
          <motion.span
            className="absolute -top-0.5 -right-0.5 bg-[#D23F57] text-white text-[9px] font-bold rounded-full h-3.5 min-w-[14px] px-1 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          >
            {cartCount > 9 ? '9+' : cartCount}
          </motion.span>
        )}
      </motion.div>
    </div>
  )
}

