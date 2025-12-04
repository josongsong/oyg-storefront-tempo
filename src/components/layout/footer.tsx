export function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-12">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
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

