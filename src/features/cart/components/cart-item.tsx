import { X, Check, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface CartItemProps {
  item: {
    id: string
    quantity: number
    price: number
    originalPrice?: number
    sku?: string
    shade?: string
    shadeOptions?: string[]
    product: {
      name: string
      brand: string
      image: string
    }
    badge?: string
    isNew?: boolean
  }
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onMoveToWishlist: (id: string) => void
  onChangeShade?: (id: string, shade: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove, onMoveToWishlist, onChangeShade }: CartItemProps) {
  const [selectedShade, setSelectedShade] = useState(item.shade || item.shadeOptions?.[0] || '')
  const [isShadeDropdownOpen, setIsShadeDropdownOpen] = useState(false)
  const [isQuantityDropdownOpen, setIsQuantityDropdownOpen] = useState(false)
  const shadeDropdownRef = useRef<HTMLDivElement>(null)
  const quantityDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shadeDropdownRef.current && !shadeDropdownRef.current.contains(event.target as Node)) {
        setIsShadeDropdownOpen(false)
      }
      if (quantityDropdownRef.current && !quantityDropdownRef.current.contains(event.target as Node)) {
        setIsQuantityDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleShadeChange = (shade: string) => {
    setSelectedShade(shade)
    onChangeShade?.(item.id, shade)
    setIsShadeDropdownOpen(false)
  }

  const handleQuantityChange = (qty: number) => {
    onUpdateQuantity(item.id, qty)
    setIsQuantityDropdownOpen(false)
  }

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-32 h-32 shrink-0 bg-gray-50 overflow-hidden relative">
        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 pr-4">
            <h3 className="font-semibold text-base mb-1 uppercase tracking-wide">{item.product.brand}</h3>
            <p className="text-sm text-gray-900 leading-snug mb-1">
              {item.product.name}
              {item.sku && <span className="text-gray-500"> · {item.sku}</span>}
            </p>
            {item.isNew && <span className="inline-block text-[10px] font-semibold text-gray-500 mb-2">NEW</span>}
            <button onClick={() => onMoveToWishlist(item.id)} className="text-sm underline hover:text-gray-600 mb-3 block">
              Move to wishlist
            </button>

            {/* Shade Selector */}
            {item.shadeOptions && item.shadeOptions.length > 0 && (
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Shade</label>
                <div ref={shadeDropdownRef} className="relative inline-block w-64">
                  <button
                    onClick={() => setIsShadeDropdownOpen(!isShadeDropdownOpen)}
                    className="w-full border border-gray-300 px-3 py-2 text-sm text-left flex items-center justify-between bg-white hover:border-gray-400"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-yellow-100 border border-gray-200 inline-block"></span>
                      {selectedShade}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {isShadeDropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                      {item.shadeOptions.map((shade) => (
                        <button
                          key={shade}
                          onClick={() => handleShadeChange(shade)}
                          className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                        >
                          <span className="w-5 h-5 bg-yellow-100 border border-gray-200 inline-block"></span>
                          {shade}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 mb-1 block">Qty</label>
              <div ref={quantityDropdownRef} className="relative inline-block w-32">
                <button
                  onClick={() => setIsQuantityDropdownOpen(!isQuantityDropdownOpen)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm text-left flex items-center justify-between bg-white hover:border-gray-400"
                >
                  <span>{item.quantity}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isQuantityDropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => handleQuantityChange(qty)}
                        className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Delivery available</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Click & Collect available</span>
              </div>
            </div>
          </div>

          {/* Remove Button and Price */}
          <div className="flex flex-col items-end">
            <button onClick={() => onRemove(item.id)} className="mb-2 hover:opacity-70">
              <X className="w-5 h-5" />
            </button>
            <div className="text-right mt-auto">
              <p className="text-xl font-medium">${item.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

