/**
 * Document Title Hook
 * React Router v7 handle과 연동하여 페이지 타이틀 자동 설정
 */

import { useEffect } from 'react'
import { useMatches } from 'react-router-dom'

interface RouteHandle {
  title?: string
  description?: string
}

export function useDocumentTitle() {
  const matches = useMatches()

  useEffect(() => {
    // Get the last match with a handle
    const match = [...matches].reverse().find((m) => m.handle)
    const handle = match?.handle as RouteHandle | undefined

    if (handle?.title) {
      document.title = `${handle.title} | Oliveyoung`
    } else {
      document.title = 'Oliveyoung - Global Beauty & Cosmetics'
    }

    // Set meta description
    if (handle?.description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', handle.description)
    }
  }, [matches])
}

