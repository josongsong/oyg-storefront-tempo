import { Facebook, Globe, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base mb-2">Customer Care</h4>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Help & Contact Us
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Shipping & Delivery
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Returns & Exchanges
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Payment & Security
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Online Orders
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base mb-2">About us</h4>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Our Story
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Beauty Loop
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Careers
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              M-POWER
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              M-PACT
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-base mb-2">Visit us</h4>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Store Locator
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Services & Events
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              Discover Flagship
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black hover:underline">
              MECCA Aesthetica
            </a>
          </div>

          <div className="flex flex-col justify-end"></div>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <p className="text-xs leading-relaxed text-gray-500 max-w-3xl mb-8">
            MECCA commits to being allies and working in solidarity with First Nations people. We recognise their
            ongoing connection to this beautiful country, and we pay our respects to Elders, past and present. We
            acknowledge the land on which we live and work always was, and always will be, Aboriginal Land.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-bold cursor-pointer hover:opacity-70">
                <Globe className="w-4 h-4" />
                <span>United States</span>
              </div>
              <a href="#" className="text-xs text-gray-600 hover:text-black hover:underline">
                Terms and Conditions
              </a>
              <a href="#" className="text-xs text-gray-600 hover:text-black hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-gray-600 hover:text-black hover:underline">
                Website Policies
              </a>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-bold mr-2">Connect</span>
              <Facebook className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-gray-600" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

