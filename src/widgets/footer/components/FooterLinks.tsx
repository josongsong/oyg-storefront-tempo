export function FooterLinks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
      {/* Customer Service */}
      <div className="flex flex-col gap-5">
        <h3 className="text-sm font-medium tracking-[0.2em] uppercase mb-2">CUSTOMER SERVICE</h3>
        <div className="flex flex-col gap-3">
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Contact Us
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Shipping & Delivery
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Returns & Exchanges
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            FAQs
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Size Guide
          </a>
        </div>
      </div>

      {/* About */}
      <div className="flex flex-col gap-5">
        <h3 className="text-sm font-medium tracking-[0.2em] uppercase mb-2">ABOUT OLIVE YOUNG</h3>
        <div className="flex flex-col gap-3">
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Our Story
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Stores
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Careers
          </a>
          <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
            Partnership
          </a>
        </div>
      </div>

      {/* Membership */}
      <div className="flex flex-col gap-5">
        <h3 className="text-sm font-medium tracking-[0.2em] uppercase mb-2">MEMBERSHIP</h3>
        <p className="text-sm leading-relaxed text-gray-300 mb-4">
          Join Olive Young Membership
          <br />
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
  )
}

