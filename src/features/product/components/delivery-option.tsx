import type { ReactNode } from 'react'

interface DeliveryOptionProps {
  id: string
  icon: ReactNode
  title: ReactNode
  subtitle?: string
  badge?: ReactNode
  isSelected: boolean
  onClick: () => void
}

export function DeliveryOption({
  id,
  icon,
  title,
  subtitle,
  badge,
  isSelected,
  onClick,
}: DeliveryOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={typeof title === 'string' ? title : id}
      className={`group relative p-3 border text-left transition-all duration-300 hover:shadow-md ${
        isSelected
          ? 'border-black bg-gray-50'
          : 'border-gray-200 hover:border-gray-400'
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <div className="relative">
          {icon}
          {badge}
        </div>
        <div>
          <div className="text-sm">{title}</div>
          {subtitle && <div className="text-xs text-gray-600">{subtitle}</div>}
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-black rounded-full flex items-center justify-center">
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  )
}

