import { Plus } from 'lucide-react'
import { useState } from 'react'

interface OrderSummaryProps {
  subtotal: number
  shipping: number
  shippingDiscount?: number
  gst: number
  total: number
  itemCount: number
  promoCode?: string
  onApplyPromo: (code: string) => void
  onCheckout: () => void
}

export function OrderSummary({
  subtotal,
  shipping,
  shippingDiscount = 0,
  gst,
  total,
  itemCount,
  promoCode,
  onApplyPromo,
  onCheckout,
}: OrderSummaryProps) {
  const [isPromoExpanded, setIsPromoExpanded] = useState(false)
  const [promoInput, setPromoInput] = useState(promoCode || '')

  const handleApplyPromo = () => {
    onApplyPromo(promoInput)
  }

  return (
    <div className="bg-white border border-gray-200 p-6 sticky top-4 self-start">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

      {/* Order Details */}
      <div className="space-y-3 text-sm mb-6">
        <div className="flex justify-between">
          <span>Subtotal (GST Incl.)</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        {shipping > 0 && (
          <div className="flex justify-between">
            <span>Premium Shipping</span>
            <span className="font-medium">${shipping.toFixed(2)}</span>
          </div>
        )}

        {shippingDiscount > 0 && (
          <div className="flex justify-between">
            <span>Complimentary Express Shipping</span>
            <span className="font-medium">-${shippingDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Returns within 90 days</span>
          <span className="font-medium">Free</span>
        </div>

        <div className="flex justify-between">
          <span>GST</span>
          <span className="font-medium">${gst.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 pb-6 border-t border-gray-200">
        <div>
          <p className="text-base font-semibold">Total:</p>
          <p className="text-xs text-gray-500">or 4 payments of ${(total / 4).toFixed(2)} with</p>
        </div>
        <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
      </div>

      {/* Payment Options */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-1">
          <img src="/afterpay-logo.svg" alt="Afterpay" className="h-5" onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling!.textContent = 'afterpay'
          }} />
          <span className="text-xs font-semibold">afterpay</span>
          <button className="text-xs underline ml-1">Learn more</button>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold">PayPal</span>
          <button className="text-xs underline ml-1">Learn more</button>
        </div>
      </div>

      {/* Apply Offer Code */}
      <div className="mb-6">
        <button
          onClick={() => setIsPromoExpanded(!isPromoExpanded)}
          className="w-full flex items-center justify-between py-3 text-sm font-medium hover:opacity-70"
        >
          <span>Apply offer code</span>
          <Plus className={`w-5 h-5 transition-transform ${isPromoExpanded ? 'rotate-45' : ''}`} />
        </button>
        
        {isPromoExpanded && (
          <div className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter code"
                className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
              />
              <button
                onClick={handleApplyPromo}
                className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Free Shipping Message */}
      <div className="bg-gray-50 p-4 mb-6 text-center">
        <p className="text-xs leading-relaxed">
          It's a good day! You've qualified for free premium shipping (subject to delivery location). 
          Please note that your items are not reserved.
        </p>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-black text-white py-4 text-base font-medium hover:bg-gray-800 transition-colors mb-4"
      >
        Proceed to checkout
      </button>

      {/* Payment Methods */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {['visa', 'mastercard', 'amex', 'diners', 'apple-pay', 'google-pay', 'paypal'].map((method) => (
          <div key={method} className="w-8 h-6 border border-gray-200 flex items-center justify-center">
            <span className="text-[8px] text-gray-400 uppercase">{method.slice(0, 4)}</span>
          </div>
        ))}
        <span className="text-xs font-semibold">afterpay</span>
      </div>
    </div>
  )
}

