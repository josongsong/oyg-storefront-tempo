/**
 * Product Detail Loading Component
 * 상품 상세 로딩 스피너
 */

export function ProductDetailLoading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Modern Spinner */}
      <div className="relative mb-8">
        {/* Outer rotating rings */}
        <div className="relative w-24 h-24">
          {/* Ring 1 */}
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-transparent border-t-black rounded-full animate-spin"
            style={{ animationDuration: '1s' }}
          ></div>
          
          {/* Ring 2 - slower, opposite direction */}
          <div 
            className="absolute inset-2 border-3 border-transparent border-b-gray-400 rounded-full"
            style={{ 
              animation: 'spin 1.5s linear infinite reverse',
            }}
          ></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Loading text with dots animation */}
      <div className="flex items-center gap-1">
        <p className="text-base font-medium text-gray-800">Loading product</p>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
      
      {/* Subtle brand message */}
      <p className="mt-2 text-sm text-gray-500">Preparing your beauty experience</p>
    </div>
  )
}

