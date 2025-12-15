import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/shared/components/layout/root-layout'
import { ErrorBoundary } from '@/shared/components/error'
import { productDetailLoader, productListLoader } from '@/features/product/api/product-loader'
import { reviewAction } from '@/features/product/api/review-action'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        lazy: () => import('@/features/home/pages/home-page'),
        handle: {
          title: 'Oliveyoung - Global Beauty & Cosmetics',
          description: 'Discover 150+ global beauty brands. K-beauty, skincare, makeup & more.',
        },
      },
      {
        path: 'products',
        lazy: () => import('@/features/product/pages/product-list-page'),
        loader: productListLoader,
        handle: {
          title: 'Products',
          description: 'Browse our collection of beauty products',
        },
      },
      {
        path: 'products/:slug',
        lazy: () => import('@/features/product/pages/product-detail-page'),
        loader: productDetailLoader,
        handle: {
          title: 'Product Details',
          description: 'View product information, reviews, and details',
        },
      },
      {
        path: 'products/:slug/write-review',
        lazy: () => import('@/features/product/pages/write-review-page'),
        loader: productDetailLoader,
        action: reviewAction,
        handle: {
          title: 'Write a Review',
          description: 'Share your experience with this product',
        },
      },
      {
        path: 'cart',
        lazy: () => import('@/features/cart/pages/cart-page'),
        handle: {
          title: 'Shopping Cart',
          description: 'Review your cart and proceed to checkout',
        },
      },
      {
        path: 'checkout',
        lazy: () => import('@/features/checkout/pages/checkout-page'),
        handle: {
          title: 'Checkout',
          description: 'Complete your purchase',
        },
      },
      {
        path: 'login',
        lazy: () => import('@/features/auth/pages/login-page'),
      },
      {
        path: 'register',
        lazy: () => import('@/features/auth/pages/register-page'),
      },
      {
        path: '*',
        lazy: () => import('@/features/error/pages/not-found-page'),
      },
    ],
  },
])

