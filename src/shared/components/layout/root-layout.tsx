import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@/shared/hooks/use-document-title'
import { Header, Footer } from '@/widgets'
import { QuickShopModal } from '@/features/product/components'
import { AuthPopup } from '@/features/auth/components'
import { LocalePopup } from '@/features/locale/components'
import { LuckyDrawPopup } from '@/features/promotion/components'
import { AIAgent } from '@/features/ai-assistant/components'
import { Toast } from '@/shared/components/ui/toast'
import { NavigationProgress } from '@/shared/components/navigation/navigation-progress'
import { ScrollToTop } from '@/shared/components'
import { getProducts } from '@/features/product/api/product-provider'

import type { GlossierProduct } from '@/shared/types/glossier'

export function RootLayout() {
  const navigate = useNavigate()
  useDocumentTitle()
  
  const [products, setProducts] = useState<GlossierProduct[]>([])

  useEffect(() => {
    getProducts().then(data => setProducts(data.slice(0, 20)))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <NavigationProgress />
      <ScrollToTop />
      <Header
        onNavigate={(target, category) => {
          if (target === 'PDP') {
            navigate('/products/balm-dotcom-trio')
          } else {
            navigate(`/products?category=${encodeURIComponent(category || '')}`)
          }
        }}
        onLogoClick={() => navigate('/')}
        products={products}
      />
      <main>
        <Outlet />
      </main>
      <Footer />
      <QuickShopModal />
      <AuthPopup />
      <LocalePopup />
      <LuckyDrawPopup />
      <AIAgent />
      <Toast />
    </div>
  )
}
