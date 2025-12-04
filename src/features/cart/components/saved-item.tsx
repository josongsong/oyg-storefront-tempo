import { Bell } from 'lucide-react'

interface SavedItemProps {
  item: {
    id: string
    quantity: number
    price: number
    originalPrice?: number
    product: {
      name: string
      brand: string
      image: string
      outOfStock?: boolean
    }
  }
  onNotify: (id: string) => void
  onRemove: (id: string) => void
}

export function SavedItem({ item, onNotify, onRemove }: SavedItemProps) {
  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-24 h-24 shrink-0 bg-gray-50 overflow-hidden relative">
        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
        {item.product.outOfStock && (
          <div className="absolute inset-0 bg-purple-600/80 flex items-center justify-center">
            <div className="text-white text-xs font-bold text-center px-2">
              Temporarily
              <br />
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">{item.product.brand}</h3>
          <p className="text-sm text-gray-900 leading-tight">{item.product.name}</p>
        </div>

        {/* Price */}
        <div className="flex justify-between items-end mt-3">
          <div className="flex gap-4 text-sm">
            <button onClick={() => onNotify(item.id)} className="flex items-center gap-1 text-gray-600 hover:text-black">
              <Bell className="w-3 h-3" />
              Notify me
            </button>
            <button onClick={() => onRemove(item.id)} className="text-gray-600 hover:text-black hover:underline">
              Remove
            </button>
          </div>

          <div className="text-right">
            {item.originalPrice && item.originalPrice > item.price && (
              <p className="text-xs text-gray-400 line-through">US${item.originalPrice.toFixed(2)}</p>
            )}
            <p className="text-lg font-bold">US${item.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

