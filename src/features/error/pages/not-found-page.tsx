/**
 * 404 Not Found Page
 */

import { useNavigate } from 'react-router-dom'
import { Home, Search, Package } from 'lucide-react'

export function Component() {
  const navigate = useNavigate()

  const suggestions = [
    { icon: Home, text: 'Go to Homepage', path: '/' },
    { icon: Search, text: 'Browse Products', path: '/products' },
    { icon: Package, text: 'View Cart', path: '/cart' },
  ]

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-[120px] sm:text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 leading-none">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-12 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. 
          Perhaps you've mistyped the URL or the page has been moved.
        </p>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 hover:border-black transition-colors group"
            >
              <div className="p-3 bg-gray-100 group-hover:bg-black transition-colors rounded-full">
                <item.icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-black">
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

Component.displayName = 'NotFoundPage'

