/**
 * Product Loader for React Router v7
 * Data loading before component render
 */

import type { LoaderFunctionArgs } from 'react-router-dom'
import { loadProductById, loadAllProducts } from '@/features/product/utils'

export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  const { slug } = params

  if (!slug) {
    throw new Response('Product not found', { status: 404 })
  }

  try {
    const [product, allProducts] = await Promise.all([
      loadProductById(slug),
      loadAllProducts(),
    ])

    if (!product) {
      throw new Response('Product not found', { status: 404 })
    }

    // Get random recommended products
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5)
    const recommendedProducts = shuffled.slice(0, 12)

    return {
      product,
      recommendedProducts,
    }
  } catch (error) {
    throw new Response('Failed to load product', { status: 500 })
  }
}

export async function productListLoader() {
  try {
    const products = await loadAllProducts()
    return { products }
  } catch (error) {
    throw new Response('Failed to load products', { status: 500 })
  }
}

