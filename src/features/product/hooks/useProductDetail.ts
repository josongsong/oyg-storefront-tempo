/**
 * useProductDetail Hook
 * 상품 상세 페이지 비즈니스 로직
 */

import { useState, useEffect, useCallback } from 'react'

import { loadProductById, loadAllProducts } from '@/features/product/utils'
import { useCartStore } from '@/features/cart/stores'
import { useWishlistStore } from '@/features/product/stores'
import { useToastStore } from '@/app/stores'
import { RECOMMENDATION_CONFIG } from '@/features/cart/constants'
import { toProductId, toPrice } from '@/features/cart/utils/cart-helpers'
import { getRandomProducts } from '@/shared/utils/product-transformer'
import { logger } from '@/shared/utils/logger'

import type { ProductData, ProductListItem } from '@/features/product/types'

type DeliveryOption = 'free-shipping' | 'auto-replenish' | 'same-day' | 'pickup'

export function useProductDetail(slug: string | undefined) {
  const { addItem } = useCartStore()
  const { toggleItem, isInWishlist } = useWishlistStore()
  const { addToast } = useToastStore()
  
  const [product, setProduct] = useState<ProductData | null>(null)
  const [recommendedProducts, setRecommendedProducts] = useState<ProductListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOption>('auto-replenish')
  const [quantity, setQuantity] = useState(1)
  const [isHoveringBasket, setIsHoveringBasket] = useState(false)
  const [bubbles, setBubbles] = useState<{ id: number; x: number }[]>([])

  // Load product data
  useEffect(() => {
    const loadData = async () => {
      if (!slug) return

      setIsLoading(true)
      
      const productData = await loadProductById(slug)
      setProduct(productData)

      const products = await loadAllProducts()

      if (productData) {
        const randomProducts = getRandomProducts(products, RECOMMENDATION_CONFIG.YOU_MAY_LIKE_COUNT)
        setRecommendedProducts(randomProducts)
      }

      setIsLoading(false)
    }

    loadData()
  }, [slug])

  // Add to cart handler
  const handleAddToCart = useCallback(() => {
    if (!product) return

    const salePrice = product.sale_price 
      ? (typeof product.sale_price === 'string' ? parseFloat(product.sale_price) : product.sale_price)
      : 0
    const listPrice = product.list_price 
      ? (typeof product.list_price === 'string' ? parseFloat(product.list_price) : product.list_price)
      : undefined

    try {
      addItem({
        productId: toProductId(product.product_id),
        name: product.product_name,
        brand: product.brand,
        image: product.images[0] || product.detailed_images[0] || '',
        price: toPrice(salePrice),
        originalPrice: listPrice ? toPrice(listPrice) : undefined,
      }, quantity)
      
      // Basket animation
      setIsHoveringBasket(true)
      const newBubbles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100 - 50,
      }))
      setBubbles(newBubbles)
      
      setTimeout(() => {
        setIsHoveringBasket(false)
        setBubbles([])
      }, 1000)
    } catch (error) {
      logger.error('Error adding to cart:', error)
      addToast('Error adding to cart', 'error', 3000)
    }
  }, [product, quantity, addItem, addToast])

  // Toggle wishlist handler
  const handleToggleWishlist = useCallback(() => {
    if (!product) return

    toggleItem({
      id: product.product_id,
      name: product.product_name,
      brand: product.brand,
      price: product.sale_price,
      image: product.images[0] || product.detailed_images[0] || '',
      rating: parseFloat(product.rating_avg),
      reviews: parseInt(product.rating_count),
    })
  }, [product, toggleItem])

  return {
    product,
    recommendedProducts,
    isLoading,
    selectedDeliveryOption,
    setSelectedDeliveryOption,
    quantity,
    setQuantity,
    isHoveringBasket,
    bubbles,
    handleAddToCart,
    handleToggleWishlist,
    isInWishlist: product ? isInWishlist(product.product_id) : false,
  }
}

