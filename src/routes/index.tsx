import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/shared/components/layout/root-layout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        lazy: () => import('@/features/home/pages/home-page'),
      },
      {
        path: 'products',
        lazy: () => import('@/features/product/pages/product-list-page'),
      },
      {
        path: 'products/:slug',
        lazy: () => import('@/features/product/pages/product-detail-page'),
      },
      {
        path: 'products/:slug/write-review',
        lazy: () => import('@/features/product/pages/write-review-page'),
      },
      {
        path: 'cart',
        lazy: () => import('@/features/cart/pages/cart-page'),
      },
      {
        path: 'checkout',
        lazy: () => import('@/features/checkout/pages/checkout-page'),
      },
      {
        path: 'login',
        lazy: () => import('@/features/auth/pages/login-page'),
      },
      {
        path: 'register',
        lazy: () => import('@/features/auth/pages/register-page'),
      },
    ],
  },
])

