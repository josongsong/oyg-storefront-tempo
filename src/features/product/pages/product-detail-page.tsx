import { useParams } from 'react-router-dom'

export function Component() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div>
      <h1>Product Detail: {slug}</h1>
    </div>
  )
}

Component.displayName = 'ProductDetailPage'

