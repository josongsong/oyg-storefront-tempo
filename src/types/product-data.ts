// Product Data Types from /public/data/*.json files

export interface ProductTags {
  product_type?: string[]
  skin_type?: string[]
  finish?: string[]
  ingredients?: string[]
  brand?: string[]
  special_features?: string[]
  category?: string[]
}

export interface Review {
  review_id: number
  rating: number
  headline: string
  comments: string
  nickname: string
  location: string
  created_date: number
  bottom_line: string | null
  helpful_votes: number
  not_helpful_votes: number
}

export interface ReviewPaging {
  total_results: number
  pages_total: number
  page_size: number
  current_page_number: number
  next_page_url: string | null
}

export interface ReviewMedia {
  id: string
  review_id: number
  uri: string
  headline: string
  rating: number
  helpful_votes: number
  not_helpful_votes: number
  type: 'image' | 'video'
  caption?: string
  nickname: string
  created_date: number
}

export interface ReviewProperty {
  display_type: string
  key: string
  name: string
  type: string
  values: Array<{
    label: string
    count: number
  }>
  display_values: string[]
}

export interface ReviewRollup {
  properties: ReviewProperty[]
  rating_histogram: number[]
  review_histogram: number[]
  rating_count: number
  review_count: number
  average_rating: number
  recommended_ratio: number
  media: ReviewMedia[]
  faceoff_positive?: {
    comments: string
    headline: string
    rating: number
    ugc_id: number
  }
  faceoff_negative?: {
    comments: string
    headline: string
    rating: number
    ugc_id: number
  }
  name: string
  variant_names?: string[]
  native_review_count: number
  native_sampling_review_count: number
  native_sweepstakes_review_count: number
  native_community_content_review_count: number
  syndicated_review_count: number
  locale: string
}

export interface ProductReviews {
  product_id: string
  total_reviews: number
  reviews: Review[]
  paging: ReviewPaging
  rollup: ReviewRollup
}

export interface ProductData {
  product_id: string
  product_url: string
  extracted_at: string
  product_name: string
  brand: string
  categories: string[]
  category_keys: string[]
  currency: string
  list_price: string
  sale_price: string
  availability: 'in_stock' | 'out_of_stock' | 'preorder'
  rating_avg: string
  rating_count: string
  images: string[]
  detailed_images: string[]
  summary: string
  details: string
  how_to_use: string
  ingredients: string[]
  extended_contents: Record<string, any>
  tags: ProductTags
  reviews: ProductReviews
}

// Simplified Product type for listing pages
export interface ProductListItem {
  id: string
  name: string
  brand: string
  price: string
  originalPrice?: string
  rating: number
  reviewCount: number
  image: string
  images: string[]
  badge?: string
  availability: 'in_stock' | 'out_of_stock' | 'preorder'
  categories: string[]
  tags: ProductTags
}

// Convert ProductData to ProductListItem
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function toProductListItem(data: ProductData): ProductListItem {
  return {
    id: data.product_id,
    name: data.product_name.replace(data.brand, '').trim(),
    brand: data.brand,
    price: data.sale_price ? `$${data.sale_price}` : '',
    originalPrice: data.list_price ? `$${data.list_price}` : undefined,
    rating: parseFloat(data.rating_avg) || 0,
    reviewCount: parseInt(data.rating_count) || 0,
    image: data.images[0] || '',
    images: data.detailed_images || data.images || [],
    badge: determineBadge(data),
    availability: data.availability,
    categories: data.categories,
    tags: data.tags,
  }
}

function determineBadge(data: ProductData): string | undefined {
  // Determine badge based on tags and other data
  if (data.tags.special_features?.includes('new')) {
    return 'NEW'
  }
  if (data.list_price && data.sale_price) {
    const listPrice = parseFloat(data.list_price)
    const salePrice = parseFloat(data.sale_price)
    if (listPrice > salePrice) {
      return 'SALE'
    }
  }
  if (data.availability === 'preorder') {
    return 'PRE-ORDER'
  }
  // Check if it's a bestseller based on high ratings
  const rating = parseFloat(data.rating_avg)
  const reviewCount = parseInt(data.rating_count)
  if (rating >= 4.5 && reviewCount >= 100) {
    return 'BESTSELLER'
  }
  return undefined
}

