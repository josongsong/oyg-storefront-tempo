import { Fragment } from 'react'

export interface BreadcrumbItem {
  label: string
  onClick?: () => void
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string
}

export function Breadcrumb({ items, separator = '/' }: BreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav className="mb-3 md:mb-4 text-xs md:text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 md:gap-2 text-gray-600">
        {items.map((item, index) => (
          <Fragment key={index}>
            <li>
              {item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:underline focus:outline-none focus:underline"
                >
                  {item.label}
                </button>
              ) : (
                <span aria-current={index === items.length - 1 ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
            </li>
            {index < items.length - 1 && (
              <li aria-hidden="true" className="select-none">
                {separator}
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

