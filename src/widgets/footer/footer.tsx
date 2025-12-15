/**
 * Footer Widget
 * 앱의 전역 푸터 컴포넌트
 */

import { useState, useRef } from 'react'
import { useInView } from 'framer-motion'
import { FooterAnimation, generatePolygons } from './components/FooterAnimation'
import { FooterLinks } from './components/FooterLinks'

export function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const [polygons] = useState(() => generatePolygons(20))

  return (
    <footer ref={ref} className="bg-black text-white pt-16 pb-12 relative overflow-hidden">
      <FooterAnimation polygons={polygons} isInView={isInView} />

      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <FooterLinks />

        {/* Company Info */}
        <div className="mt-12 pt-8 border-t border-gray-800 relative z-10">
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

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} CJ OLIVE YOUNG Corporation. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
