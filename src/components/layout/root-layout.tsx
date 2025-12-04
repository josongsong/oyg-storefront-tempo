import { Outlet } from 'react-router-dom'

import { Footer } from './footer'

export function RootLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header는 각 페이지에서 개별 렌더링 (현재 home-page에 포함) */}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
