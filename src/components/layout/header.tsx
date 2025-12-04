import { useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, Menu, Pause, Search, ShoppingBag, User } from 'lucide-react'

import { SearchOverlay } from '@/components/ui/search-overlay'
import { MEGA_MENU_DATA, TRENDING_SEARCHES } from '@/data/menu-data'

import type { GlossierProduct } from '@/types/glossier'

interface HeaderProps {
  onNavigate?: (target: 'PDP' | 'PLP', category?: string) => void
  onLogoClick?: () => void
  products?: GlossierProduct[]
}

const NAV_LINKS = ['Skincare', 'Makeup', 'Balms', 'Body', 'Fragrance', 'Glossier Goods', 'Sets', 'Shop All']

export function Header({ onNavigate, onLogoClick, products = [] }: HeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" onMouseLeave={() => setActiveMenu(null)}>
      {/* Promo Banner */}
      <div className="bg-black text-white text-sm h-10 flex items-center justify-center relative z-50 px-4">
        <div className="flex-1 text-center flex items-center justify-center font-normal">
          <span>
            Get gifting today! Shop the <span className="underline cursor-pointer">2025 Glossier Gift Guide</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 absolute right-4 md:right-8">
          <ChevronLeft className="w-4 h-4 cursor-pointer text-white/80 hover:text-white" />
          <ChevronRight className="w-4 h-4 cursor-pointer text-white/80 hover:text-white" />
          <Pause className="w-4 h-4 cursor-pointer text-white/80 hover:text-white fill-current" />
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 md:px-8 py-6 md:py-8 flex items-center justify-between relative z-50 bg-white">
        <div className="md:hidden">
          <Menu className="w-6 h-6" />
        </div>

        <div className="cursor-pointer flex items-center mr-8" onClick={onLogoClick}>
          <div className="font-bold text-4xl tracking-tighter italic cursor-pointer">Glossier.</div>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-auto relative">
          <div
            className="w-full bg-[#F5F5F5] rounded-sm flex items-center px-4 py-3 cursor-text hover:bg-[#EAEAEA] transition-colors"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5 text-black mr-3" />
            <span className="text-sm text-gray-600 font-normal">Search 150+ global beauty brands</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-black ml-auto md:ml-8">
          <div className="hidden md:block text-sm font-normal cursor-pointer hover:text-gray-600">KR</div>
          <div className="hidden md:block text-sm font-normal cursor-pointer hover:text-gray-600">STORES</div>
          <User className="w-6 h-6 cursor-pointer hover:text-gray-600 stroke-1" />
          <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600 stroke-1" />
          <div className="relative cursor-pointer hover:text-gray-600">
            <ShoppingBag className="w-6 h-6 stroke-1" />
            <span className="absolute -top-1 -right-1 bg-[#D23F57] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              1
            </span>
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
      <div className="hidden md:flex items-center pt-1 pb-4 border-b border-gray-100 bg-white relative z-40 px-4 md:px-8">
        <nav className="flex-1 flex justify-center gap-8 text-sm font-medium tracking-wide text-black h-full items-center">
          <div
            className="flex items-center gap-2 cursor-pointer hover:text-gray-600"
            onMouseEnter={() => setActiveMenu('Categories')}
            onClick={() => setActiveMenu(activeMenu === 'Categories' ? null : 'Categories')}
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">Categories</span>
          </div>

          {NAV_LINKS.map((link) => (
            <div
              key={link}
              className="flex items-center relative group cursor-pointer"
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
                className={`hover:text-gray-500 transition-colors ${activeMenu === link ? 'text-black underline underline-offset-4 decoration-2' : ''}`}
                onClick={(e) => e.preventDefault()}
              >
                {link}
              </a>
            </div>
          ))}
        </nav>
      </div>

      {/* Mega Menu */}
      {activeMenu && !isSearchOpen && MEGA_MENU_DATA[activeMenu] && (
        <div
          className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl z-40 animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-[1600px] mx-auto px-8 pt-8 pb-16">
            <div className="flex justify-between">
              <div className={`flex ${activeMenu === 'Categories' ? 'gap-16' : 'gap-16'}`}>
                {MEGA_MENU_DATA[activeMenu].columns.map((col, colIdx) => (
                  <div key={colIdx} className={`flex flex-col gap-4 min-w-[180px]`}>
                    {col.title && col.title !== '\u00A0' && (
                      <h3
                        className={`font-bold text-base text-black mb-2 border-b border-gray-200 pb-2 inline-block ${activeMenu === 'Categories' && colIdx === 0 ? 'w-[calc(200%+4rem)]' : 'w-full'}`}
                      >
                        {col.title}
                      </h3>
                    )}
                    {col.title === '\u00A0' && <div className="h-[38px]"></div>}

                    <div className="flex flex-col gap-1.5">
                      {col.items.map((item, itemIdx) => (
                        <a
                          key={itemIdx}
                          href={item.link}
                          className={`text-sm hover:underline hover:text-gray-600 font-normal ${item.isNew ? 'text-blue-600' : 'text-black'}`}
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
                <div className="w-[300px] relative group cursor-pointer overflow-hidden self-start">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                  <img
                    src={MEGA_MENU_DATA[activeMenu].ad!.image}
                    alt={MEGA_MENU_DATA[activeMenu].ad!.title}
                    className={`w-full h-[350px] object-cover transform group-hover:scale-105 transition-transform duration-500`}
                  />

                  {MEGA_MENU_DATA[activeMenu].ad!.isSale ? (
                    <div className="absolute bottom-0 left-0 p-6 z-20 w-full bg-linear-to-t from-black/80 to-transparent flex flex-col items-center text-center">
                      <h3 className="font-black text-3xl leading-tight mb-1 text-white italic drop-shadow-md">
                        {MEGA_MENU_DATA[activeMenu].ad!.title}
                      </h3>
                      <p className="text-xl font-bold text-red-500 mb-3 drop-shadow-sm bg-white/90 px-2 rounded-sm">
                        {MEGA_MENU_DATA[activeMenu].ad!.subtitle}
                      </p>
                      <div className="text-xs font-bold bg-black text-white px-3 py-1 rounded-sm">
                        {MEGA_MENU_DATA[activeMenu].ad!.linkText}
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-0 left-0 p-6 z-20 text-white w-full bg-linear-to-t from-black/60 to-transparent">
                      <h3 className="font-bold text-2xl leading-tight mb-1">
                        {MEGA_MENU_DATA[activeMenu].ad!.title}
                      </h3>
                      <p className="text-lg font-bold text-white mb-2">{MEGA_MENU_DATA[activeMenu].ad!.subtitle}</p>
                      <div className="flex items-center text-sm font-bold bg-[#D23F57] w-fit px-3 py-1 rounded-full">
                        {MEGA_MENU_DATA[activeMenu].ad!.linkText}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

