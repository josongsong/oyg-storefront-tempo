/**
 * Review Action for React Router v7
 * Form action for review submission
 */

import type { ActionFunctionArgs } from 'react-router-dom'
import { redirect } from 'react-router-dom'
import { productApi } from './service'
import type { ReviewSubmitData } from '@/features/product/types'

export async function reviewAction({ request, params }: ActionFunctionArgs) {
  const { slug } = params

  if (!slug) {
    throw new Response('Product not found', { status: 404 })
  }

  try {
    const formData = await request.formData()

    const rating = Number(formData.get('rating'))
    const headline = formData.get('headline') as string
    const comments = formData.get('comments') as string
    const recommend = formData.get('recommend') === 'true'
    const firstName = formData.get('firstName') as string
    const location = formData.get('location') as string
    const email = formData.get('email') as string

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return { error: 'Please select a rating' }
    }
    if (!headline?.trim()) {
      return { error: 'Please enter a review title' }
    }
    if (!comments?.trim()) {
      return { error: 'Please enter review content' }
    }
    if (!firstName?.trim()) {
      return { error: 'Please enter your name' }
    }
    if (!email?.trim() || !email.includes('@')) {
      return { error: 'Please enter a valid email' }
    }

    const submitData: ReviewSubmitData = {
      product_id: slug,
      rating,
      headline: headline.trim(),
      comments: comments.trim(),
      recommend,
      first_name: firstName.trim(),
      location: location?.trim() || undefined,
      email: email.trim(),
    }

    await productApi.submitReview(submitData)

    // Redirect back to product page
    return redirect(`/products/${slug}`)
  } catch (error) {
    console.error('Failed to submit review:', error)
    return { error: 'Failed to submit review. Please try again.' }
  }
}

