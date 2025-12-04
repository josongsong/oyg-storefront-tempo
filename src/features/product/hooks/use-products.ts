import { useQuery } from '@tanstack/react-query'

import { productService } from '@/services'

import type { ProductListParams } from '@/types/product'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params ?? {}),
    queryFn: () => productService.getList(params),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  })
}

