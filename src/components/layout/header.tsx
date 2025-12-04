import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, Menu, Pause, Play, Search, ShoppingBag, User, LogOut } from 'lucide-react'

import { SearchOverlay } from '@/components/ui/search-overlay'
import { MEGA_MENU_DATA, TRENDING_SEARCHES } from '@/data/menu-data'
import { useAuthPopupStore, useUserStore, useCartStore, useLocaleStore } from '@/stores'
import { useNavigate } from 'react-router-dom'

import type { GlossierProduct } from '@/types/glossier'

interface HeaderProps {
  onNavigate?: (target: 'PDP' | 'PLP', category?: string) => void
  onLogoClick?: () => void
  products?: GlossierProduct[]
}

const NAV_LINKS = ['Skincare', 'Makeup', 'Balms', 'Body', 'Fragrance', 'Glossier Goods', 'Sets', 'Shop All']

const PROMO_BANNERS = [
  {
    text: 'Oliveyoung USA\'s First Official Store Now Open! Visit our Times Square location in Manhattan, New York',
    link: '#'
  },
  {
    text: 'Elevating to a Global K-Beauty Hub! Special discounts to celebrate Oliveyoung\'s North American market launch',
    link: '#'
  },
  {
    text: '150+ Top Korean Beauty Brands in One Place! Discover them now',
    link: '#'
  }
]

export function Header({ onNavigate, onLogoClick, products = [] }: HeaderProps) {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { openPopup: openAuthPopup } = useAuthPopupStore()
  const { user, isLoggedIn, initUser, logout } = useUserStore()
  const { getTotalItems } = useCartStore()
  const { openPopup: openLocalePopup, settings: localeSettings, initSettings } = useLocaleStore()

  useEffect(() => {
    initUser()
    initSettings()
  }, [initUser, initSettings])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused])

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length)
  }

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % PROMO_BANNERS.length)
  }

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-black text-white text-xs h-10 flex items-center justify-center relative px-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="flex-1 text-center flex items-center justify-center font-normal"
          >
            <a 
              href={PROMO_BANNERS[currentBannerIndex].link}
              className="cursor-pointer hover:text-gray-300 transition-colors"
            >
              {PROMO_BANNERS[currentBannerIndex].text}
            </a>
          </motion.div>
        </AnimatePresence>
        
        <div className="hidden md:flex items-center gap-2 absolute right-4 md:right-8">
          <motion.button
            onClick={handlePrevBanner}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
          </motion.button>
          
          <motion.button
            onClick={handleNextBanner}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
          >
            <ChevronRight className="w-3 h-3" />
          </motion.button>
          
          <motion.button
            onClick={() => setIsPaused(!isPaused)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer text-white/80 hover:text-white transition-colors"
          >
            {isPaused ? (
              <Play className="w-3 h-3 fill-current" />
            ) : (
              <Pause className="w-3 h-3 fill-current" />
            )}
          </motion.button>
          
          {/* Progress indicator */}
          <div className="flex gap-1">
            {PROMO_BANNERS.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={`w-1 h-1 rounded-full transition-all ${
                  idx === currentBannerIndex ? 'bg-white w-3' : 'bg-white/40'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Header: Logo + Search + Icons + Category Nav Container */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 relative" onMouseLeave={() => setActiveMenu(null)}>
        {/* Logo, Search and Icons */}
        <div className="px-4 md:px-8 py-5 bg-white relative">
            <div className="max-w-[1600px] mx-auto grid grid-cols-3 items-center gap-4">
              {/* Left: Logo */}
              <div className="flex items-center">
                <motion.div
                  className="cursor-pointer flex items-center overflow-hidden"
                  onClick={onLogoClick}
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
                            y: 0, 
                            rotateZ: 0,
                            color: '#000000'
                          },
                          hover: { 
                            y: [0, -8, 0],
                            rotateZ: [0, 5, -5, 0],
                            color: ['#000000', '#00C73C', '#7DD321', '#00D98F', '#000000'],
                            transition: {
                              duration: 0.6,
                              delay: index * 0.05,
                              ease: "easeInOut",
                              repeat: 0
                            }
                          }
                        }}
                        className="inline-block"
                        style={{ display: 'inline-block' }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Center: Search */}
              <div className="flex justify-center">
                <motion.div
                  className={`w-full max-w-2xl bg-[#F5F5F5] flex items-center px-4 py-2.5 border-2 transition-colors ${
                    isSearchOpen ? 'border-black bg-white' : 'border-transparent hover:bg-[#EAEAEA]'
                  }`}
                  whileHover={{ scale: 1.005 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <Search className="w-4 h-4 text-black mr-2.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search 150+ global beauty brands"
                    className="flex-1 bg-transparent text-[0.8125rem] text-gray-900 placeholder-gray-600 outline-none font-normal"
                    onFocus={() => setIsSearchOpen(true)}
                  />
                </motion.div>
              </div>

              {/* Right: Icons */}
              <div className="flex items-center justify-end gap-3 md:gap-5 text-black">
                <motion.div
                  className="hidden md:block text-[0.8125rem] font-normal cursor-pointer hover:text-gray-600"
                  whileHover={{ y: -1 }}
                  onClick={openLocalePopup}
                >
                  {localeSettings.language.toUpperCase()}
                </motion.div>
                <motion.div
                  className="hidden md:block text-[0.8125rem] font-normal cursor-pointer hover:text-gray-600"
                  whileHover={{ y: -1 }}
                >
                  STORES
                </motion.div>
                
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="hidden md:block text-[0.8125rem] font-normal text-gray-700"
                      whileHover={{ y: -1 }}
                    >
                      {user?.name}
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      <LogOut className="w-5 h-5 hover:text-gray-600 stroke-1" />
                    </motion.div>
                  </div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={openAuthPopup}
                  >
                    <User className="w-5 h-5 cursor-pointer hover:text-gray-600 stroke-1" />
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                  <Heart className="w-5 h-5 cursor-pointer hover:text-gray-600 stroke-1" />
                </motion.div>
                <motion.div
                  className="relative cursor-pointer hover:text-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingBag className="w-5 h-5 stroke-1" />
                  {getTotalItems() > 0 && (
                    <motion.span
                      className="absolute -top-0.5 -right-0.5 bg-[#D23F57] text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      {getTotalItems()}
                    </motion.span>
                  )}
                </motion.div>
              </div>
            </div>

            <SearchOverlay
              isOpen={isSearchOpen}
              onClose={(e) => {
                e.stopPropagation()
                setIsSearchOpen(false)
              }}
              trendingSearches={TRENDING_SEARCHES}
              products={products}
            />
          </div>

          {/* Category Nav */}
          <div className="flex items-center pt-1 pb-4 bg-white px-4 md:px-8">
            <nav className="flex-1 flex justify-center gap-8 text-sm font-medium tracking-wide text-black h-full items-center">
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-gray-600 pb-1 relative"
                onMouseEnter={() => setActiveMenu('Categories')}
                onClick={() => setActiveMenu(activeMenu === 'Categories' ? null : 'Categories')}
              >
                <Menu className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide">Categories</span>
                {activeMenu === 'Categories' && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                    layoutId="activeIndicator"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </div>

              {NAV_LINKS.map((link) => (
                <div
                  key={link}
                  className="flex items-center relative group cursor-pointer pb-1"
                  onMouseEnter={() => setActiveMenu(link)}
                  onClick={() => {
                    setActiveMenu(null)
                    if (onNavigate) {
                      if (link === 'Sets') {
                        onNavigate('PDP')
                      } else {
                        onNavigate('PLP', link)
                      }
                    }
                  }}
                >
                  <a
                    href="#"
                    className="hover:text-gray-500 transition-colors text-black"
                    onClick={(e) => e.preventDefault()}
                  >
                    {link}
                  </a>
                  {activeMenu === link && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                      layoutId="activeIndicator"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </div>
              ))}
            </nav>
          </div>

        {/* Mega Menu - Inside sticky container */}
        <AnimatePresence>
          {activeMenu && !isSearchOpen && MEGA_MENU_DATA[activeMenu] && (
            <motion.div
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 z-40 shadow-lg"
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
              <div className="max-w-[1600px] mx-auto px-8 pt-10 pb-16">
                <div className="flex justify-between">
                  <div className={`flex ${activeMenu === 'Categories' ? 'gap-16' : 'gap-16'}`}>
                    {MEGA_MENU_DATA[activeMenu].columns.map((col, colIdx) => (
                      <div key={colIdx} className={`flex flex-col gap-5 min-w-[180px]`}>
                        {col.title && col.title !== '\u00A0' && (
                          <h3
                            className={`font-bold text-lg text-black mb-2 border-b border-gray-200 pb-2 inline-block ${activeMenu === 'Categories' && colIdx === 0 ? 'w-[calc(200%+4rem)]' : 'w-full'}`}
                          >
                            {col.title}
                          </h3>
                        )}
                        {col.title === '\u00A0' && <div className="h-[42px]"></div>}

                        <div className="flex flex-col gap-2.5">
                          {col.items.map((item, itemIdx) => (
                            <a
                              key={itemIdx}
                              href={item.link}
                              className={`text-[15px] hover:underline hover:text-gray-600 font-normal ${item.isNew ? 'text-blue-600' : 'text-black'}`}
                              onClick={() => setActiveMenu(null)}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                        {colIdx === 0 && !col.title && <div className="h-4" />}
                      </div>
                    ))}
                  </div>

                  {MEGA_MENU_DATA[activeMenu].ad && (
                    <motion.div
                      className="w-[300px] relative group cursor-pointer overflow-hidden self-start rounded-lg shadow-lg"
                      onClick={() => setActiveMenu(null)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        y: [0, -8, 0],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{ 
                        opacity: { delay: 0.15, duration: 0.3, ease: 'easeOut' },
                        x: { delay: 0.15, duration: 0.3, ease: 'easeOut' },
                        y: { 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        },
                        scale: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      {/* Animated gradient overlay */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-10 pointer-events-none"
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Pulsing glow effect */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-pink-200/30 via-transparent to-purple-200/30 z-[5] pointer-events-none"
                        animate={{
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors z-10" />
                      <motion.img
                        src={MEGA_MENU_DATA[activeMenu].ad!.image}
                        alt={MEGA_MENU_DATA[activeMenu].ad!.title}
                        className="w-full h-auto object-contain"
                        animate={{
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      {MEGA_MENU_DATA[activeMenu].ad!.isSale ? (
                        <motion.div 
                          className="absolute bottom-0 left-0 p-6 z-20 w-full bg-linear-to-t from-black/80 to-transparent flex flex-col items-center text-center"
                          animate={{
                            y: [0, -3, 0]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <motion.h3 
                            className="font-black text-3xl leading-tight mb-1 text-white italic drop-shadow-md"
                            animate={{
                              textShadow: [
                                '0 0 10px rgba(255,255,255,0.5)',
                                '0 0 20px rgba(255,255,255,0.8)',
                                '0 0 10px rgba(255,255,255,0.5)'
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {MEGA_MENU_DATA[activeMenu].ad!.title}
                          </motion.h3>
                          <motion.p 
                            className="text-xl font-bold text-pink-400 mb-3 drop-shadow-sm bg-white/90 px-2 rounded-sm"
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {MEGA_MENU_DATA[activeMenu].ad!.subtitle}
                          </motion.p>
                          <motion.div 
                            className="text-xs font-bold bg-black text-white px-3 py-1 rounded-sm"
                            whileHover={{ scale: 1.1 }}
                            animate={{
                              boxShadow: [
                                '0 0 0px rgba(0,0,0,0.3)',
                                '0 0 15px rgba(255,255,255,0.6)',
                                '0 0 0px rgba(0,0,0,0.3)'
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            {MEGA_MENU_DATA[activeMenu].ad!.linkText}
                          </motion.div>
                        </motion.div>
                      ) : (
                        <div className="absolute bottom-0 left-0 p-6 z-20 text-white w-full bg-linear-to-t from-black/60 to-transparent">
                          <h3 className="font-bold text-2xl leading-tight mb-1">
                            {MEGA_MENU_DATA[activeMenu].ad!.title}
                          </h3>
                          <p className="text-lg font-bold text-white mb-2">{MEGA_MENU_DATA[activeMenu].ad!.subtitle}</p>
                          <div className="flex items-center text-sm font-bold bg-[#F5A7B8] w-fit px-3 py-1 rounded-full">
                            {MEGA_MENU_DATA[activeMenu].ad!.linkText}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
