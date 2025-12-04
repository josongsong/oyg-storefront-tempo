import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BRAND_COLORS = ['#00C73C', '#7DD321', '#00D98F']

// Generate random polygons with more on the right side
const generatePolygons = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    // 70% of polygons on the right half
    const isRightSide = Math.random() > 0.3
    const x = isRightSide 
      ? 50 + Math.random() * 50  // 50-100%
      : Math.random() * 50        // 0-50%
    
    return {
      id: i,
      color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
      size: Math.random() * 120 + 40, // 40-160px
      x,
      y: Math.random() * 100, // 0-100%
      rotation: Math.random() * 360,
      duration: Math.random() * 4 + 2, // 2-6s
      delay: Math.random() * 0.8,
      sides: Math.floor(Math.random() * 3) + 3, // 3-5 sides
    }
  })
}

const Polygon = ({ sides, size, color }: { sides: number; size: number; color: string }) => {
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
    const x = 50 + 50 * Math.cos(angle)
    const y = 50 + 50 * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points={points} fill={color} opacity="0.15" />
    </svg>
  )
}

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const [polygons] = useState(() => generatePolygons(20))

  return (
    <footer 
      ref={ref}
      className="bg-black text-white pt-16 pb-12 relative overflow-hidden"
    >
      {/* Animated Polygons */}
      <div className="absolute inset-0 pointer-events-none">
        {polygons.map((polygon) => (
          <motion.div
            key={polygon.id}
            initial={{ 
              opacity: 0,
              x: `${polygon.x}%`,
              y: `${polygon.y}%`,
              rotate: polygon.rotation,
              scale: 0.5
            }}
            animate={isInView ? {
              opacity: [0, 0.8, 0.8],
              x: `${polygon.x + (Math.random() - 0.5) * 20}%`,
              y: `${polygon.y + (Math.random() - 0.5) * 20}%`,
              rotate: polygon.rotation + 360,
              scale: [0.5, 1, 0.8, 1],
            } : {
              opacity: 0,
              scale: 0.3
            }}
            transition={{
              duration: polygon.duration,
              delay: polygon.delay,
              repeat: isInView ? Infinity : 0,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            className="absolute"
            style={{
              left: 0,
              top: 0,
            }}
          >
            <Polygon 
              sides={polygon.sides} 
              size={polygon.size} 
              color={polygon.color} 
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Customer Service Section */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-medium tracking-[0.2em] uppercase mb-2">CUSTOMER SERVICE</h3>
            
            <p className="text-sm leading-relaxed text-gray-300 mb-4">
              Weekdays 09:00 - 18:00 (Lunch 12:00 - 13:00)<br />
              Closed on weekends and holidays
            </p>
            
            <a href="tel:1644-5566" className="text-sm text-gray-300 hover:text-white transition-colors mb-2">
              1644-5566
            </a>
            
            <a href="mailto:help@oliveyoung.com" className="text-sm text-gray-300 hover:text-white transition-colors mb-6">
              help@oliveyoung.com
            </a>
            
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Order Status
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Returns & Exchanges
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                FAQ
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          {/* About Section */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-medium tracking-[0.2em] uppercase mb-2">ABOUT OLIVE YOUNG</h3>
            
            <p className="text-sm leading-relaxed text-gray-300 mb-4">
              Korea's No.1 Health & Beauty Store.<br />
              Offering trendy beauty lifestyle across online and offline.
            </p>
            
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Store Locations
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Careers
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Partnership
              </a>
            </div>
          </div>

          {/* Member Benefits */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-medium tracking-[0.2em] uppercase mb-2">MEMBERSHIP</h3>
            
            <p className="text-sm leading-relaxed text-gray-300 mb-4">
              Join Olive Young Membership<br />
              and enjoy exclusive benefits!
            </p>
            
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Membership Guide
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Member Benefits
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Points Program
              </a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                Coupons
              </a>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-xs text-gray-400 leading-relaxed space-y-1.5">
            <p>CJ OLIVE YOUNG Corporation</p>
            <p>CEO: SUN JUNG LEE | Business Registration No.: 809-81-01574</p>
            <p>Address: 24th Floor, 372, Hangang-daero, Yongsan-gu, Seoul, 04323, Republic of Korea</p>
            <p>E-commerce Permit: 2019-Seoul-Yongsan-1428</p>
            <p>
              <a href="#" className="underline hover:text-white transition-colors">
                Click here for business information
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Youth Protection Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Accessibility
              </a>
            </div>
            
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} CJ OLIVE YOUNG. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

