/**
 * Product API Mutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToastStore } from '@/app/stores/toast.store'
import { productQueries } from './queries'
import { logger } from '@/shared/utils/logger'

import type { ProductId, Product } from '@/entities/product'

// API functions (implement actual API calls)
const updateProduct = async (id: ProductId, data: Partial<Product>) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update product')
  return response.json()
}

const deleteProduct = async (id: ProductId) => {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete product')
}

// Mutations
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: ProductId; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productQueries.detail(id).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: productQueries.lists(),
      })
      addToast('Product updated successfully', 'success', 3000)
    },
    onError: (error) => {
      addToast('Failed to update product', 'error', 3000)
      logger.error('Update product error:', error)
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const { addToast } = useToastStore()
  
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: productQueries.lists(),
      })
      queryClient.removeQueries({
        queryKey: productQueries.detail(id).queryKey,
      })
      addToast('Product deleted successfully', 'success', 3000)
    },
    onError: (error) => {
      addToast('Failed to delete product', 'error', 3000)
      logger.error('Delete product error:', error)
    },
  })
}

