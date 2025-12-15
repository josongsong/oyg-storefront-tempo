/**
 * Mobile Menu Component
 * 모바일용 풀스크린 네비게이션 메뉴
 */

import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { MEGA_MENU_DATA } from '@/shared/constants/menu-data'
import { NAV_LINKS } from '@/shared/constants/nav-links'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onNavigate?: (target: 'PDP' | 'PLP', category?: string) => void
}

export function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const handleMenuClick = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu)
  }

  const handleLinkClick = (link: string) => {
    onClose()
    if (onNavigate) {
      if (link === 'Sets') {
        onNavigate('PDP')
      } else {
        onNavigate('PLP', link)
      }
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

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[400px] bg-white z-[70] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="py-4">
              {/* Categories */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => handleMenuClick('Categories')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-base">Categories</span>
                  <motion.div
                    animate={{ rotate: expandedMenu === 'Categories' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedMenu === 'Categories' && MEGA_MENU_DATA['Categories'] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-gray-50"
                    >
                      <div className="px-6 py-2 space-y-1">
                        {MEGA_MENU_DATA['Categories'].columns.map((col, colIdx) => (
                          <div key={colIdx} className="py-2">
                            {col.title && col.title !== '\u00A0' && (
                              <h3 className="font-bold text-sm text-gray-900 mb-2 px-2">
                                {col.title}
                              </h3>
                            )}
                            {col.items.map((item, itemIdx) => (
                              <a
                                key={itemIdx}
                                href={item.link}
                                onClick={(e) => {
                                  e.preventDefault()
                                  onClose()
                                }}
                                className="block px-2 py-2 text-sm text-gray-700 hover:text-black hover:bg-white rounded transition-colors"
                              >
                                {item.label}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nav Links */}
              {NAV_LINKS.map((link) => (
                <div key={link} className="border-b border-gray-200">
                  <button
                    onClick={() => handleMenuClick(link)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-base">{link}</span>
                    <motion.div
                      animate={{ rotate: expandedMenu === link ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedMenu === link && MEGA_MENU_DATA[link] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        <div className="px-6 py-2 space-y-1">
                          {MEGA_MENU_DATA[link].columns.map((col, colIdx) => (
                            <div key={colIdx} className="py-2">
                              {col.title && col.title !== '\u00A0' && (
                                <h3 className="font-bold text-sm text-gray-900 mb-2 px-2">
                                  {col.title}
                                </h3>
                              )}
                              {col.items.map((item, itemIdx) => (
                                <a
                                  key={itemIdx}
                                  href={item.link}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleLinkClick(link)
                                  }}
                                  className="block px-2 py-2 text-sm text-gray-700 hover:text-black hover:bg-white rounded transition-colors"
                                >
                                  {item.label}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Additional Links */}
              <div className="mt-4 px-6 space-y-2">
                <a
                  href="#"
                  className="flex items-center justify-between py-3 text-sm text-gray-700 hover:text-black"
                  onClick={(e) => {
                    e.preventDefault()
                    onClose()
                  }}
                >
                  <span>Store Locator</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between py-3 text-sm text-gray-700 hover:text-black"
                  onClick={(e) => {
                    e.preventDefault()
                    onClose()
                  }}
                >
                  <span>Help & Support</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

