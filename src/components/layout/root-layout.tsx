import { Outlet, useNavigate } from 'react-router-dom'

import { Header } from './header'
import { Footer } from './footer'
import { QuickShopModal } from '@/components/ui/quick-shop-modal'
import { AuthPopup } from '@/components/ui/auth-popup'
import { LocalePopup } from '@/components/ui/locale-popup'
import { LuckyDrawPopup } from '@/components/ui/lucky-draw-popup'
import { AIAgent } from '@/components/ui/ai-agent'
import { Toast } from '@/components/ui/toast'
import { MOCK_PRODUCTS } from '@/features/product/mocks'

export function RootLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
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
