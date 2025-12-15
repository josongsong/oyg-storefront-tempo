import { Outlet, useNavigate } from 'react-router-dom'

import { Header, Footer } from '@/widgets'
import { QuickShopModal } from '@/features/product/components'
import { AuthPopup } from '@/features/auth/components'
import { LocalePopup } from '@/features/locale/components'
import { LuckyDrawPopup } from '@/features/promotion/components'
import { AIAgent } from '@/features/ai-assistant/components'
import { Toast } from '@/shared/components/ui/toast'
import { MOCK_PRODUCTS } from '@/features/product/mocks'
import { ScrollToTop } from '@/shared/components'

export function RootLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
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
        products={MOCK_PRODUCTS}
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
