import { useState } from 'react'
import { motion } from 'framer-motion'

interface LinkItem {
  id: string
  text: string
  isActive?: boolean
}

const CATEGORY_LINKS: LinkItem[] = [
  { id: 'skincare', text: 'Skincare' },
  { id: 'makeup', text: 'Makeup' },
  { id: 'haircare', text: 'Hair Care' },
  { id: 'body', text: 'Body & Bath' },
  { id: 'fragrance', text: 'Fragrance' },
  { id: 'tools', text: 'Tools & Devices' },
  { id: 'wellness', text: 'Wellness' },
]

const TRENDING_LINKS: LinkItem[] = [
  { id: 'k-beauty', text: 'K-Beauty Bestsellers', isActive: true },
  { id: 'holiday-gifts', text: 'Holiday Gift Sets' },
  { id: 'clean-beauty', text: 'Clean Beauty' },
  { id: 'vegan', text: 'Vegan Products' },
  { id: 'travel', text: 'Travel Size' },
  { id: 'limited', text: 'Limited Edition' },
]

const BRAND_LINKS: LinkItem[] = [
  { id: 'beauty-of-joseon', text: 'Beauty of Joseon' },
  { id: 'cosrx', text: 'COSRX' },
  { id: 'laneige', text: 'Laneige' },
  { id: 'innisfree', text: 'Innisfree' },
  { id: 'view-all', text: 'View All Brands' },
]

export function CategoryLinksSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>('k-beauty')
  const [activeBrand, setActiveBrand] = useState<string | null>(null)

  const renderLinks = (links: LinkItem[], activeId: string | null, onHover: (id: string | null) => void) => {
    return links.map((link) => {
      const isActive = activeId === link.id || link.isActive
      
      return (
        <motion.a
          key={link.id}
          href="#"
          className={`block text-lg leading-relaxed transition-colors ${
            isActive ? 'text-black font-bold' : 'text-black font-normal hover:font-bold'
          }`}
          onMouseEnter={() => onHover(link.id)}
          onMouseLeave={() => onHover(null)}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          {link.text}
        </motion.a>
      )
    })
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Shop by Category */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">Shop by Category</h3>
            <div className="space-y-4">
              {renderLinks(CATEGORY_LINKS, null, () => {})}
            </div>
          </div>

          {/* Trending Now */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">Trending Now</h3>
            <div className="space-y-4">
              {renderLinks(TRENDING_LINKS, activeCategory, setActiveCategory)}
            </div>
          </div>

          {/* Shop by Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">Shop by Brand</h3>
            <div className="space-y-4">
              {renderLinks(BRAND_LINKS, activeBrand, setActiveBrand)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

