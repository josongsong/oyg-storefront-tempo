/**
 * Error Boundary Component
 * React Router v7 권장 에러 처리
 */

import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'

export function ErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  let errorMessage: string
  let errorStatus: number | undefined

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status
    errorMessage = error.statusText || error.data?.message || 'An error occurred'
  } else if (error instanceof Error) {
    errorMessage = error.message
  } else {
    errorMessage = 'Unknown error occurred'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50"></div>
            <div className="relative bg-white rounded-full p-6 shadow-lg">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
          </div>
        </div>

        {/* Error Status */}
        {errorStatus && (
          <div className="text-6xl font-bold text-gray-900 mb-4">
            {errorStatus}
          </div>
        )}

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {errorStatus === 404 ? 'Page Not Found' : 'Something Went Wrong'}
        </h1>
        <p className="text-gray-600 mb-8">
          {errorStatus === 404 
            ? "The page you're looking for doesn't exist."
            : errorMessage
          }
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* Debug Info (dev only) */}
        {import.meta.env.DEV && error instanceof Error && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Developer Info
            </summary>
            <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

