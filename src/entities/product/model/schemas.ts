/**
 * Product Zod Schemas
 * Runtime validation for product data
 */

import { z } from 'zod'
import { ProductId, Price, Rating } from './types'

// Base schemas
export const ProductIdSchema = z.string()
  .min(1, 'Product ID is required')
  .transform(ProductId.create)

export const PriceSchema = z.number()
  .nonnegative('Price must be non-negative')
  .finite('Price must be finite')
  .transform(Price.create)

export const PriceStringSchema = z.string()
  .transform(Price.fromString)

export const RatingSchema = z.number()
  .min(0, 'Rating must be at least 0')
  .max(5, 'Rating must be at most 5')
  .transform(Rating.create)

export const ProductBadgeSchema = z.enum([
  'BESTSELLER',
  'NEW',
  'LIMITED EDITION',
  'SALE',
  'COLLECTABLE',
])

// Product Schema
export const ProductSchema = z.object({
  id: z.union([
    z.string().transform(ProductId.create),
    z.number().transform(ProductId.fromNumber),
  ]),
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.union([PriceSchema, PriceStringSchema]),
  rating: RatingSchema,
  reviewCount: z.number().nonnegative('Review count must be non-negative'),
  image: z.string().url('Image must be a valid URL').or(z.string().min(1)),
  badge: ProductBadgeSchema.optional(),
  originalPrice: z.union([PriceSchema, PriceStringSchema]).optional(),
})

// Product List Item Schema
export const ProductListItemSchema = z.object({
  id: ProductIdSchema,
  name: z.string().min(1),
  brand: z.string().min(1),
  price: z.string(),
  rating: RatingSchema,
  reviewCount: z.number().nonnegative(),
  image: z.string(),
  badge: ProductBadgeSchema.optional(),
  originalPrice: z.string().optional(),
})

// Array schemas
export const ProductArraySchema = z.array(ProductSchema)
export const ProductListItemArraySchema = z.array(ProductListItemSchema)

// Validation helpers
export const validateProduct = (data: unknown) => {
  return ProductSchema.parse(data)
}

export const validateProductArray = (data: unknown) => {
  return ProductArraySchema.parse(data)
}

export const validateProductListItem = (data: unknown) => {
  return ProductListItemSchema.parse(data)
}

export const safeValidateProduct = (data: unknown) => {
  return ProductSchema.safeParse(data)
}

